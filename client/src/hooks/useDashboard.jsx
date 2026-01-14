import { dashboardService } from "@/services/dashboardService";
import { examSeriesService } from "@/services/examSeriesService";
import { subjectService } from "@/services/subjService";
import { useState, useCallback } from "react";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [seriesOption, setSeriesOption] = useState([]);
  const [seriesSubj, setSeriesSubj] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ pageSize: 10 });

  const fetchInitialDashboard = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };

        const series = await examSeriesService.getExamSeries(finalParams);
        const seriesData = series.data || [];
        setSeriesOption(seriesData);

        if (seriesData.length > 0) {
          const latestSeries = seriesData[0];
          const seriesId = latestSeries.seriesId;

          setSelectedSeries(latestSeries);
          setParams((prev) => ({ ...prev, bySeries: seriesId }));

          const [subjects, dashboard] = await Promise.all([
            subjectService.getSubjects({
              ...finalParams,
              bySeries: seriesId,
            }),
            dashboardService.getDashboard({
              ...finalParams,
              bySeries: seriesId,
              page: 1,
            }),
          ]);

          const subjectsData = subjects.data || [];
          const dashboardDataResult = dashboard.data || [];
          const paginationResult = dashboard.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          };

          setSeriesSubj(subjectsData);
          setDashboardData(dashboardDataResult);
          setPagination(paginationResult);

          setParams((prev) => ({ ...prev, bySeries: seriesId }));

          return {
            success: true,
            data: {
              series: seriesData,
              subj: subjectsData,
              examResults: dashboardDataResult,
            },
            pagination: paginationResult,
          };
        }

        // No series data available
        return {
          success: true,
          data: {
            series: [],
            subj: [],
            examResults: [],
          },
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          },
        };
      } catch (err) {
        console.error("Error fetching initial dashboard data:", err);
        setError(err.message);
        setDashboardData([]);
        setSeriesSubj([]);
        setPagination({
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 0,
        });

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  // Fetch dashboard data with pagination and filters
  const fetchDashboard = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const response = await dashboardService.getDashboard(finalParams);

        const dashboardDataResult = response.data || [];
        const paginationResult = response.pagination || {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 0,
        };

        setDashboardData(dashboardDataResult);
        setPagination(paginationResult);

        return {
          success: true,
          data: dashboardDataResult,
          pagination: paginationResult,
        };
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  // Fetch all subjects for selected exam series filter
  const fetchSeriesSubj = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const response = await subjectService.getSubjects(finalParams);
        const subjectsData = response.data || [];

        setSeriesSubj(subjectsData);

        return { success: true, data: subjectsData };
      } catch (err) {
        console.error("Error fetching series subjects:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setDashboardData([]);
    setSeriesOption([]);
    setSeriesSubj([]);
    setSelectedSeries(null);
    setIsLoading(false);
    setError(null);
    setPagination({
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalItems: 0,
    });
    setParams({ pageSize: 10 });
  }, []);

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchDashboard({ page });
    },
    [params, fetchDashboard],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchDashboard({ pageSize, page: 1 });
    },
    [params, fetchDashboard],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm, page: 1 };
      setParams(newParams);
      return await fetchDashboard({ searchTerm, page: 1 });
    },
    [params, fetchDashboard],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      try {
        setIsLoading(true);
        setError(null);

        const seriesId = filters.bySeries || null;

        const newSelectedSeries =
          seriesOption.find((s) => s.seriesId === parseInt(seriesId)) || null;
        setSelectedSeries(newSelectedSeries);

        const [subjects, dashboard] = await Promise.all([
          subjectService.getSubjects({
            ...params,
            bySeries: seriesId,
          }),
          dashboardService.getDashboard({
            ...params,
            bySeries: seriesId,
            page: 1,
          }),
        ]);

        const subjectsData = subjects.data || [];
        const dashboardDataResult = dashboard.data || [];
        const paginationResult = dashboard.pagination || {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalItems: 0,
        };

        setSeriesSubj(subjectsData);
        setDashboardData(dashboardDataResult);
        setPagination(paginationResult);

        setParams((prev) => ({ ...prev, bySeries: seriesId, page: 1 }));

        return {
          success: true,
          data: {
            subj: subjectsData,
            examResults: dashboardDataResult,
          },
          pagination: paginationResult,
        };
      } catch (err) {
        console.error("Error filtering dashboard:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, seriesOption],
  );

  return {
    // State
    dashboardData,
    seriesOption,
    seriesSubj,
    selectedSeries,
    isLoading,
    error,
    pagination,
    params,

    // Actions
    fetchInitialDashboard,
    fetchDashboard,
    fetchSeriesSubj,
    clearError,
    resetState,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onFilterChange,
    setParams,
    setDashboardData,
    setSelectedSeries,
  };
};
