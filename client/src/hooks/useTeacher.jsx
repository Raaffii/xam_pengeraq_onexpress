import { teacherService } from "@/services/teacherService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
export const useTeacher = () => {
  const [teacher, setTeacher] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });

  const fetchTeacher = useCallback(async (overrideParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const finalParams = { ...params, ...overrideParams };
      const apiParams = {
        ...finalParams,
      };

      const response = await teacherService.getTeacher(apiParams);

      setTeacher(response.data);
      setPagination(response.pagination);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setTeacher([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTeacher = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new teacher...");

      const response = await teacherService.insertTeacher(data);
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

  const updateTeacher = useCallback(async (data, id) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new teacher...");

      const response = await teacherService.updateTeacher(data, id);
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

  const deleteTeacher = useCallback(async (id) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new teacher...");

      const response = await teacherService.deleteTeacher(id);
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

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchTeacher({ page });
    },
    [params, fetchTeacher],
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchTeacher({ limit, page: 1 });
    },
    [params, fetchTeacher],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchTeacher({ searchTerm, page: 1 });
    },
    [fetchTeacher, setParams, params],
  );

  return {
    fetchTeacher,
    createTeacher,
    updateTeacher,
    pagination,
    teacher,
    isLoading,
    error,
    params,
    deleteTeacher,
    setParams,
    onPageChange,
    onPageSizeChange,
    onSearch,
  };
};
