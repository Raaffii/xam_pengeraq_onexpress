import { locationService } from "@/services/locationService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
export const useLocation = () => {
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });

  const fetchLocation = useCallback(async (overrideParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const finalParams = { ...params, ...overrideParams };
      const apiParams = {
        ...finalParams,
      };

      const response = await locationService.getLocation(apiParams);

      setLocation(response.data);
      setPagination(response.pagination);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching location:", err);

      setError(err.message);
      setLocation([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLocation = useCallback(async (data) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new location...");

      const response = await locationService.insertlocation(data);
      toast.success("location added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating location:", err);
      toast.error(err.message || "Failed to create location", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateLocation = useCallback(async (data, id) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Updating new location...");
      console.log("data", data);
      const response = await locationService.updateLocation(data, id);
      toast.success("location edit successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating location:", err);
      toast.error(err.message || "Failed to create location", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deletelocation = useCallback(async (id) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new location...");

      const response = await locationService.deleteLocation(id);
      toast.success("location delete successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating location:", err);
      toast.error(err.message || "Failed to create location", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchLocation({ page });
    },
    [params, fetchLocation],
  );

  const onPageSizeChange = useCallback(
    async (limit) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return await fetchLocation({ limit, page: 1 });
    },
    [params, fetchLocation],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm };
      setParams(newParams);

      return await fetchLocation({ searchTerm, page: 1 });
    },
    [fetchLocation, setParams, params],
  );

  return {
    fetchLocation,
    createLocation,
    updateLocation,
    pagination,
    location,
    isLoading,
    error,
    params,
    isSubmitting,
    deletelocation,
    setParams,
    onPageChange,
    onPageSizeChange,
    onSearch,
  };
};
