import { studentsExamSeriesService } from "@/services/studentsExamSeriesService";
import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
export const useStudentsExamSeries = () => {
  const [studentsExamSeries, setStudentsExamSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const [params, setParams] = useState({ page: 1, limit: 10 });

  const formatStudentrData = useCallback((rawStudent) => {
    return rawStudent.map((item) => ({
      ...item,
      id: item.studentId,
    }));
  }, []);

  const fetchStudentsExamSeries = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await studentsExamSeriesService.getStudentsExam(
          apiParams
        );
        const data = formatStudentrData(response.data);

        setStudentsExamSeries(data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );

        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching Student:", err);

        setError(err.message);
        setStudentsExamSeries([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatStudentrData]
  );

  const fetchStudentExamSeriesById = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await studentsExamSeriesService.getStudentsExamSeriesById(studentId);

      setStudentsExamSeries(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setStudentsExamSeries([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchStudentsExamSeries({ searchTerm, page: 1 });
    },
    [fetchStudentsExamSeries, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };

      setParams(newParams);
      return await fetchStudentsExamSeries({ page });
    },
    [params, fetchStudentsExamSeries]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchStudentsExamSeries({ limit, page: 1 });
    },
    [params, fetchStudentsExamSeries]
  );
  return {
    fetchStudentsExamSeries,
    onPageChange,
    onPageSizeChange,
    onSearch,
    fetchStudentExamSeriesById,
    studentsExamSeries,
    isLoading,
    error,
    pagination,
    params,
    setParams,
  };
};
