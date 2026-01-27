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
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

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
          },
        );
        setClassScheduleDetail(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);
        setIsLoading(false);
        setError(err.message);
        setClassScheduleDetail([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatClassSchedule],
  );

  const fetchClassScheduleDetailById = useCallback(
    async (classSchDetailsId) => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await classScheduleDetailService.getClassScheduleDetailById(
            classSchDetailsId,
          );

        setClassScheduleDetail(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setClassScheduleDetail([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const startClassSession = useCallback(async (classschhdid) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Checking QR code availability...");

      const response =
        await classScheduleDetailService.startClassSession(classschhdid);
      toast.success("Succes Create QR Code!", { id: toastId });

      return {
        success: true,
        token: response.data.dataTo.token,
        startDateTime: response.data.dataTo.startDateTime,
      };
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
      setIsLoading(true);
      setError(null);

      toastId = toast.loading("Checking QR code availability...");

      const response =
        await classScheduleDetailService.openClassSession(classschhdid);

      if (response.data.token) {
        toast.success("QR code is available.", { id: toastId });
      } else {
        toast.dismiss(toastId);
      }

      return {
        success: true,
        token: response.data.token,
        startDateTime: response.data.startDateTime,
        classDateTime: response.data.classDateTime,
      };
    } catch (err) {
      console.error("Error creating student:", err);
      toast.error("Failed to get QrCode information", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        scheduleId: filters.scheduleId,
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchClassScheduleDetail({
        byExamSeriesId: filters.byExamSeriesId || null,
        scheduleId: filters.scheduleId,
        page: 1,
      });
    },
    [params, fetchClassScheduleDetail],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchClassScheduleDetail({ searchTerm, page: 1 });
    },
    [fetchClassScheduleDetail, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchClassScheduleDetail({ page });
    },
    [params, fetchClassScheduleDetail],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchClassScheduleDetail({ pageSize, page: 1 });
    },
    [params, fetchClassScheduleDetail],
  );

  return {
    fetchClassScheduleDetail,
    fetchClassScheduleDetailById,
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
