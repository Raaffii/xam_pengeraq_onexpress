import { examsService } from "@/services/examsService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [examDetails, setExamDetails] = useState([]);
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

  const formatExamsData = useCallback((rawExams) => {
    return rawExams.map((item) => ({
      ...item,
      id: item.examId,
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
          },
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
    [params, formatExamsData],
  );

  const fetchExamsById = useCallback(async (examId) => {
    try {
      const response = await examsService.getExamsById(examId);
      setExamDetails(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching exams:", err);

      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setIsSubmitting(false);
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
      setIsSubmitting(false);
    }
  }, []);

  const deleteExams = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await examsService.deleteExams(id);
      toast.success("Exam deleted successfully");

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting exam:", err);
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

      return await fetchExams({ searchTerm, page: 1 });
    },
    [fetchExams, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExams({ page });
    },
    [params, fetchExams],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchExams({ pageSize, page: 1 });
    },
    [params, fetchExams],
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
    fetchExamsById,
    examDetails,
    setExamDetails,
    isSubmitting,
    exams,
    isLoading,
    error,
    pagination,
    params,
  };
};
