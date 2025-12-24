import { examsService } from "@/services/examsService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ page: 1, limit: 10 });

  const formatExamsData = useCallback((rawExams) => {
    return rawExams.map((item) => ({
      ...item,
      id: item.userId,
    }));
  }, []);

  const fetchExams = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await examsService.getExams(apiParams);
        const data = formatExamsData(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );
        setExams(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setExams([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatExamsData]
  );

  const createExams = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new exam...");
      const response = await examsService.insertExams(data);
      toast.success("Exam added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating exam:", err);
      toast.error(err.message || "Failed to create exam", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateExams = useCallback(async (id, data) => {
    if (!id) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);

      toastId = toast.loading("Updating exam details...");
      const response = await examsService.updateExams(id, data);
      toast.success("Exam updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating exam:", err);
      toast.error(err.message || "Failed to update approval", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteExams = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await examsService.deleteExams(id);
      toast.success("User deleted successfully");

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message);
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchExams({ search, page: 1 });
    },
    [fetchExams, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExams({ page });
    },
    [params, fetchExams]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchExams({ limit, page: 1 });
    },
    [params, fetchExams]
  );
  return {
    fetchExams,
    updateExams,
    onPageChange,
    onPageSizeChange,
    createExams,
    deleteExams,
    onSearch,
    setParams,
    isSubmitting,
    exams,
    isLoading,
    error,
    pagination,
    params,
  };
};
