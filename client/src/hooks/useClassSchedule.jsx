import { classScheduleService } from "@/services/classScheduleService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useClassSchedule = () => {
  const [classSchedule, setClassSchedule] = useState([]);
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

  const formatClassSchedule = useCallback((rawExams) => {
    return rawExams.map((item) => ({
      ...item,
      id: item.userId,
    }));
  }, []);

  const fetchClassSchedule = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };

        const response = await classScheduleService.getClassSchedule(apiParams);
        const data = formatClassSchedule(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );
        setClassSchedule(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setClassSchedule([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatClassSchedule]
  );

  const postExamResult = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new exam result...");

      const response = await examResultService.postExamResult(data);
      toast.success("Exam Result added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating exam result:", err);
      toast.error(err.message || "Failed to create exam result", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const putExamResult = useCallback(async (examResultsId, data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new exam result...");

      const response = await examResultService.putExamResult(
        examResultsId,
        data
      );
      toast.success("Exam Result added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating exam result:", err);
      toast.error(err.message || "Failed to create exam result", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteExamResult = useCallback(async (examResultsId) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Deleting new exam result...");
      console.log("exa", examResultsId);
      const response = await examResultService.deleteExamResult(examResultsId);
      toast.success("Exam Result delete successfully!", { id: toastId });
      setClassSchedule((prev) =>
        prev.filter((item) => item.examResultsId !== examResultsId)
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating exam result:", err);
      toast.error(err.message || "Failed to create exam result", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchClassSchedule({
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      });
    },
    [params, fetchClassSchedule]
  );

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchClassSchedule({ search, page: 1 });
    },
    [fetchClassSchedule, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchClassSchedule({ page });
    },
    [params, fetchClassSchedule]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchClassSchedule({ limit, page: 1 });
    },
    [params, fetchClassSchedule]
  );

  return {
    fetchClassSchedule,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    postExamResult,
    onFilterChange,
    deleteExamResult,
    putExamResult,
    isSubmitting,
    classSchedule,
    isLoading,
    error,
    pagination,
    params,
  };
};
