import { examSeriesService } from "@/services/examSeriesService";
import { useState, useCallback } from "react";

export const useExamSeries = () => {
  const [examSeries, setExamSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const [params, setParams] = useState({ page: 1, limit: 10 });

  const fetchExamSeries = useCallback(async (overrideParams = {}) => {
    try {
      setLoading(true);

      const finalParams = { ...params, ...overrideParams };
      const apiParams = {
        ...finalParams,
      };
      const response = await examSeriesService.getExamSeries(apiParams);

      setPagination(
        response.pagination || {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 0,
        }
      );
      setExamSeries(response.data);
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

  const createExamsSeries = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await examSeriesService.insertExamSeries(data);
      fetchExamSeries();
      return { success: true, data: response.data };
    } catch (err) {
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

  const updateExamsSeries = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        await examSeriesService.updateExamsSeries(id, data);
        fetchExamSeries();
        return { success: true };
      } catch (err) {
        let errorMessage = "Failed to update";
        // Handle specific error types
        if (err.response?.status === 403) {
          errorMessage = "You don't have permission to view Expalloc";
        } else if (err.response?.status === 404) {
          errorMessage = "Expalloc not found";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error occurred while loading Expalloc";
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);

        setLoading(false);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [fetchExamSeries]
  );

  const deleteExamsSeries = useCallback(
    async (id) => {
      try {
        setLoading(true);
        console.log("here i  here");
        await examSeriesService.deleteExamSeries(id);
        fetchExamSeries();
        return { success: true };
      } catch (err) {
        let errorMessage = "Failed to update";
        // Handle specific error types
        if (err.response?.status === 403) {
          errorMessage = "You don't have permission to view Expalloc";
        } else if (err.response?.status === 404) {
          errorMessage = "Expalloc not found";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error occurred while loading Expalloc";
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);

        setLoading(false);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [fetchExamSeries]
  );

  const onSearch = useCallback(
    async (search) => {
      const newParams = { ...params, search };
      setParams(newParams);

      return await fetchExamSeries({ search, page: 1 });
    },
    [fetchExamSeries, setParams, params]
  );

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchExamSeries({ page });
    },
    [params, fetchExamSeries]
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchExamSeries({ limit, page: 1 });
    },
    [params, fetchExamSeries]
  );
  return {
    fetchExamSeries,
    updateExamsSeries,
    onPageChange,
    onPageSizeChange,
    createExamsSeries,
    deleteExamsSeries,
    onSearch,
    examSeries,
    loading,
    error,
    pagination,
    params,
  };
};
