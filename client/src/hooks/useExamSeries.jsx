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

  const fetchExamSeries = useCallback(async () => {
    try {
      setLoading(true);

      const response = await examSeriesService.getExamSeries();

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

  return {
    fetchExamSeries,
    examSeries,
    loading,
    error,
    pagination,
  };
};
