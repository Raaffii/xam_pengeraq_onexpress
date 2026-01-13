import { studentClassService } from "@/services/studentClassService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useStudentClass = () => {
  const [studenctClass, setStudentClass] = useState([]);
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

  const formatStudentClass = useCallback((rawExams) => {
    return rawExams.map((item) => ({
      ...item,
      id: item.userId,
    }));
  }, []);

  const fetchStudentClass = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };

        const response = await studentClassService.getStudentClass(apiParams);

        const data = formatStudentClass(response.data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          }
        );
        setStudentClass(data);
        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching exams:", err);

        setError(err.message);
        setStudentClass([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatStudentClass]
  );

  const assignStudentClass = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new students...");

      const response = await studentClassService.assignStudentClass(data);
      toast.success("Student added successfully!", { id: toastId });

      return { success: true, data: response.data };
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
      return await fetchStudentClass({
        byExamSeriesId: filters.byExamSeriesId || null,
        page: 1,
      });
    },
    [params, fetchStudentClass]
  );

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchStudentClass({ search, page: 1 });
    },
    [fetchStudentClass, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchStudentClass({ page });
    },
    [params, fetchStudentClass]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchStudentClass({ limit, page: 1 });
    },
    [params, fetchStudentClass]
  );

  return {
    fetchStudentClass,
    onPageChange,
    onPageSizeChange,
    onSearch,
    setParams,
    assignStudentClass,
    onFilterChange,

    isSubmitting,
    studenctClass,
    isLoading,
    error,
    pagination,
    params,
  };
};
