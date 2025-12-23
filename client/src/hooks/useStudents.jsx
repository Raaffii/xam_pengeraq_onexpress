import { studentService } from "@/services/studentsService";
import { useState, useCallback } from "react";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const [params, setParams] = useState({ page: 1, limit: 10 });

  const fetchStudents = useCallback(async (overrideParams = {}) => {
    try {
      setLoading(true);

      const finalParams = { ...params, ...overrideParams };
      const apiParams = {
        ...finalParams,
      };
      const response = await studentService.getStudents(apiParams);

      setPagination(
        response.pagination || {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 0,
        }
      );
      setStudents(response.data);
      //   alert("cek");
      return response.data;
    } catch (err) {
      let errorMessage = "Failed to update";
      // Handle specific error types
      if (err.response?.status === 403) {
        errorMessage = "You don't have permission to view contacts";
      } else if (err.response?.status === 404) {
        errorMessage = "Contacts not found";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error occurred while loading contacts";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      setLoading(false);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudents = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await studentService.insertStudents(data);
      fetchStudents();
      return { success: true, data: response.data };
    } catch (err) {
      console.log("err", err);
      let errorMessage = "Failed to update";
      // Handle specific error types
      if (err.response?.status === 403) {
        errorMessage = "You don't have permission to view Expalloc";
      } else if (err.response?.status === 404) {
        errorMessage = "Expalloc not found";
      } else if (err.response?.status >= 500) {
        errorMessage =
          "A server error occurred, possibly caused by a duplicate code";
      } else if (err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);

      setLoading(false);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchStudents({ search, page: 1 });
    },
    [fetchStudents, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchStudents({ page });
    },
    [params, fetchStudents]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchStudents({ limit, page: 1 });
    },
    [params, fetchStudents]
  );
  return {
    fetchStudents,
    onPageChange,
    onPageSizeChange,
    createStudents,
    onSearch,
    students,
    loading,
    error,
    pagination,
    params,
  };
};
