import { examGradesService } from "@/services/examGradeService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExamGrades = () => {
  const [examGrades, setExamGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const formatExamGradesData = useCallback((rawExamGrades) => {
    return rawExamGrades.map((item) => ({
      ...item,
      id: item.gradeId,
    }));
  }, []);

  const fetchExamGrades = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await examGradesService.getExamGrades(apiParams);
        const data = formatExamGradesData(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          },
        );
        setExamGrades(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching examGrades:", err);

        setError(err.message);
        setExamGrades([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatExamGradesData],
  );

  const createExamGrades = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new grade...");
      console.log(data);
      const response = await examGradesService.insertExamGrades(data);
      toast.success("Exam Grade added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating examGrade:", err);
      toast.error(err.message || "Failed to create Grade", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateExamGrades = useCallback(async (id, data) => {
    if (!id) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);

      toastId = toast.loading("Updating grade details...");
      const response = await examGradesService.updateExamGrades(id, data);
      toast.success("ExamGrade updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating examGrade:", err);
      toast.error(err.message || "Failed to update grade", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteExamGrades = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await examGradesService.deleteExamGrades(id);
      toast.success("Grade deleted successfully");

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting grade:", err);
      toast.error(err.message);
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchExamGrades({ searchTerm, page: 1 });
    },
    [fetchExamGrades, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExamGrades({ page });
    },
    [params, fetchExamGrades],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchExamGrades({ pageSize, page: 1 });
    },
    [params, fetchExamGrades],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        bySeries: filters.bySeries,
        page: 1,
      };
      setParams(newParams);
      return await fetchExamGrades({
        bySeries: filters.bySeries,
        page: 1,
      });
    },
    [params, fetchExamGrades],
  );
  return {
    fetchExamGrades,
    updateExamGrades,
    onPageChange,
    onPageSizeChange,
    createExamGrades,
    deleteExamGrades,
    onFilterChange,
    onSearch,
    setParams,
    isSubmitting,
    examGrades,
    isLoading,
    error,
    pagination,
    params,
  };
};
