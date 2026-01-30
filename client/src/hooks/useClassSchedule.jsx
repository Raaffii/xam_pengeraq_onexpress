import { classScheduleService } from "@/services/classScheduleService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useClassSchedule = () => {
  const [classSchedule, setClassSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [params, setParams] = useState({ page: 1, pageSize: 10 });

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
          },
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
    [params, formatClassSchedule],
  );

  const getClassScheduleById = useCallback(async (scheduleId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await classScheduleService.getClassScheduleById(scheduleId);

      setClassSchedule(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching schedule:", err);

      setError(err.message);
      setClassSchedule([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const postClassSchedule = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new Schedule...");

      const response = await classScheduleService.postClassSchedule(data);
      toast.success("Schedule added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating schedul:", err);
      toast.error("Failed to create schedule", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const putClassSchedule = useCallback(async (classScheduleId, data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new schedule...");
      const response = await classScheduleService.putClassSchedule(
        classScheduleId,
        data,
      );
      toast.success("Schedule added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating Schedule:", err);
      toast.error(err.message || "Failed to create schedule", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteClassSchedule = useCallback(async (classschhdid) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Deleting new schedule...");

      const response =
        await classScheduleService.deleteClassSchedule(classschhdid);
      toast.success("Schedule delete successfully!", { id: toastId });
      setClassSchedule((prev) =>
        prev.filter((item) => item.classschhdid !== classschhdid),
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
    [params, fetchClassSchedule],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchClassSchedule({ searchTerm, page: 1 });
    },
    [fetchClassSchedule, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchClassSchedule({ page });
    },
    [params, fetchClassSchedule],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchClassSchedule({ pageSize, page: 1 });
    },
    [params, fetchClassSchedule],
  );

  return {
    fetchClassSchedule,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    postClassSchedule,
    onFilterChange,
    deleteClassSchedule,
    putClassSchedule,
    getClassScheduleById,
    isSubmitting,
    classSchedule,
    isLoading,
    error,
    pagination,
    params,
  };
};
