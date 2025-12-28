import { examResultService } from "@/services/examResult";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExamsResult = () => {
  const [examsResult, setExamsResult] = useState([]);
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

  const fetchExamsResult = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await examResultService.getExamResult(
          apiParams,
          overrideParams.studentId
        );
        const data = formatExamsData(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );
        setExamsResult(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setExamsResult([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatExamsData]
  );

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchExamsResult({ search, page: 1 });
    },
    [fetchExamsResult, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExamsResult({ page });
    },
    [params, fetchExamsResult]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchExamsResult({ limit, page: 1 });
    },
    [params, fetchExamsResult]
  );
  return {
    fetchExamsResult,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    isSubmitting,
    examsResult,
    isLoading,
    error,
    pagination,
    params,
  };
};
