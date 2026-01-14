import { classScheduleDetailService } from "@/services/classScheduleDetailService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useClassScheduleDetail = () => {
  const [classScheduleDetail, setClassScheduleDetail] = useState([]);
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

  const fetchClassScheduleDetail = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };

        const response =
          await classScheduleDetailService.getClassScheduleDetail(apiParams);
        const data = formatClassSchedule(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );
        setClassScheduleDetail(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setClassScheduleDetail([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatClassSchedule]
  );

  const startClassSession = useCallback(async (classschhdid) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new students...");

      const response = await classScheduleDetailService.startClassSession(
        classschhdid
      );
      toast.success("Student added successfully!", { id: toastId });

      console.log("cekceec", response.data);
      return { success: true, data: response.data, token: response.data.token };
    } catch (err) {
      console.error("Error creating student:", err);
      toast.error(err.message || "Failed to create student", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const openClassSession = useCallback(async (classschhdid) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new students...");

      const response = await classScheduleDetailService.openClassSession(
        classschhdid
      );
      toast.success("Student added successfully!", { id: toastId });

      return { success: true, data: response.data, token: response.data.token };
    } catch (err) {
      console.error("Error creating student:", err);
      toast.error(err.message || "Failed to create student", { id: toastId });
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
      return await fetchClassScheduleDetail({
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      });
    },
    [params, fetchClassScheduleDetail]
  );

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchClassScheduleDetail({ search, page: 1 });
    },
    [fetchClassScheduleDetail, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchClassScheduleDetail({ page });
    },
    [params, fetchClassScheduleDetail]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchClassScheduleDetail({ limit, page: 1 });
    },
    [params, fetchClassScheduleDetail]
  );

  return {
    fetchClassScheduleDetail,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    startClassSession,
    onFilterChange,
    openClassSession,
    isSubmitting,
    classScheduleDetail,
    isLoading,
    error,
    pagination,
    params,
  };
};
