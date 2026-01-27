import { ClassAttendanceService } from "@/services/classAttendanceService";
import { useState, useCallback } from "react";

export const useClassAttendance = () => {
  const [classAttendance, setClassAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchClassAttendance = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };

        setParams(finalParams);

        const response =
          await ClassAttendanceService.getClassAttendance(apiParams);
        const data = formatClassSchedule(response.data);

        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          },
        );

        setClassAttendance(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setClassAttendance([]);
        setIsLoading(false);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatClassSchedule],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchClassAttendance({
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      });
    },
    [params, fetchClassAttendance],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchClassAttendance({ searchTerm, page: 1 });
    },
    [fetchClassAttendance, setParams, params],
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchClassAttendance({ page });
    },
    [params, fetchClassAttendance],
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchClassAttendance({ limit, page: 1 });
    },
    [params, fetchClassAttendance],
  );

  return {
    fetchClassAttendance,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    onFilterChange,
    classAttendance,
    isLoading,
    error,
    pagination,
    params,
  };
};
