import { studentService } from "@/services/studentsService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const [params, setParams] = useState({ page: 1, limit: 10 });

  const formatStudentrData = useCallback((rawStudent) => {
    return rawStudent.map((item) => ({
      ...item,
      id: item.studentId,
    }));
  }, []);

  const fetchStudents = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await studentService.getStudents(apiParams);
        const data = formatStudentrData(response.data);

        setStudents(data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );

        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching Student:", err);

        setError(err.message);
        setStudents([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatStudentrData]
  );

  const getStudentById = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await studentService.getStudentsById(studentId);

      setStudents(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setStudents([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudents = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new students...");

      const response = await studentService.insertStudents(data);
      toast.success("Student added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating student:", err);
      toast.error(err.message || "Failed to create student", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateStudents = useCallback(async (id, data) => {
    if (!id) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Updating student details...");
      const response = await studentService.updateStudent(id, data);
      toast.success("student updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating student:", err);
      toast.error(err.message || "Failed to update approval", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await studentService.deleteStudents(id);
      toast.success("student deleted successfully");

      return { success: true };
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error(err.message);
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchStudents({ searchTerm, page: 1 });
    },
    [fetchStudents, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };

      setParams(newParams);
      return await fetchStudents({ page });
    },
    [params, fetchStudents]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchStudents({ limit, page: 1 });
    },
    [params, fetchStudents]
  );
  return {
    fetchStudents,
    updateStudents,
    onPageChange,
    onPageSizeChange,
    createStudents,
    deleteStudent,
    getStudentById,
    onSearch,
    isSubmitting,
    students,
    isLoading,
    error,
    pagination,
    params,
    setParams,
  };
};
