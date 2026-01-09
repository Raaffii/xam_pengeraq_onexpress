import { examSeriesService } from "@/services/examSeriesService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExamSeries = () => {
  const [examSeries, setExamSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ pageSize: 10 });

  const formaExamSeriesData = useCallback((rawExamSeries) => {
    return rawExamSeries.map((item) => ({
      ...item,
      id: item.seriesId,
    }));
  }, []);

  const fetchExamSeries = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };

        const response = await examSeriesService.getExamSeries(apiParams);
        const data = formaExamSeriesData(response.data);

        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          },
        );
        setExamSeries(data);

        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching users:", err);

        setError(err.message);
        setExamSeries([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formaExamSeriesData],
  );

  const fetchExamSeriesByid = useCallback(async (examSeriesId) => {
    if (!examSeriesId) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const response = await examSeriesService.getExamSeriesById(examSeriesId);

      setExamSeries(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching users:", err);

      setError(err.message);
      setExamSeries([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExamsSeries = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new series...");
      const response = await examSeriesService.insertExamSeries(data);
      toast.success("Exam Series added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating Exam Series:", err);
      toast.error(err.message || "Failed to create exam series", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateExamsSeries = useCallback(async (id, data) => {
    if (!id) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);

      toastId = toast.loading("Updating exam series details...");
      const response = await examSeriesService.updateExamsSeries(id, data);
      toast.success("Exam Series updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating exam series:", err);
      toast.error(err.message || "Failed to update approval", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteExamsSeries = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await examSeriesService.deleteExamSeries(id);
      toast.success("User deleted successfully");

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting user:", err);
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

      return await fetchExamSeries({ searchTerm, page: 1 });
    },
    [fetchExamSeries, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExamSeries({ page });
    },
    [params, fetchExamSeries],
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchExamSeries({ limit, page: 1 });
    },
    [params, fetchExamSeries],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        byExam: filters.byExam || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchExamSeries({
        byExam: filters.byExam || null,
        page: 1,
      });
    },
    [params, fetchExamSeries],
  );

  return {
    fetchExamSeries,
    updateExamsSeries,
    onPageChange,
    onPageSizeChange,
    createExamsSeries,
    deleteExamsSeries,
    onSearch,
    setParams,
    onFilterChange,
    fetchExamSeriesByid,
    isSubmitting,
    examSeries,
    isLoading,
    error,
    pagination,
    params,
  };
};
