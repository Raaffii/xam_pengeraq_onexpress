import { userService } from "@/services/userService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const formatUserData = useCallback((rawUsers) => {
    return rawUsers.map((item) => ({
      ...item,
      id: item.userId,
    }));
  }, []);

  const fetchUsers = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
          ...(finalParams.byRole && { byRole: finalParams.byRole }),
        };
        const response = await userService.getUsers(apiParams);
        const data = formatUserData(response.data);

        setUsers(data);
        setPagination(
          response.pagination || {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalItems: 0,
          },
        );

        return { success: true, data: data };
      } catch (err) {
        console.error("Error fetching users:", err);

        setError(err.message);
        setUsers([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatUserData],
  );

  const newUser = useCallback(async (userData) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new user...");
      const response = await userService.insertUser(userData);
      toast.success("User added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.message || "Failed to create user", { id: toastId });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateDetails = useCallback(async (userId, userData) => {
    if (!userId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Updating user details...");
      const response = await userService.putUser(userId, userData);
      toast.success("User updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Failed to update approval", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeUser = useCallback(async (userId) => {
    if (!userId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await userService.removeUser(userId);
      toast.success("User deleted successfully");

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message);
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetUserPassword = useCallback(async (userId, userData) => {
    if (!userId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Resetting user...");
      await userService.resetUser(userId, userData);
      toast.success("User resetted successfully", { id: toastId });

      return { success: true };
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Failed to update approval", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setUsers([]);
    setUserDetail(null);
    setIsLoading(false);
    setError(null);
    setIsSubmitting(false);
  }, []);

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchUsers({ page });
    },
    [params, fetchUsers],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchUsers({ pageSize, page: 1 });
    },
    [params, fetchUsers],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm, page: 1 };
      setParams(newParams);
      return await fetchUsers({ searchTerm, page: 1 });
    },
    [params, fetchUsers],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        byRole: filters.byRole || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchUsers({
        byRole: filters.byRole || null,
        page: 1,
      });
    },
    [params, fetchUsers],
  );

  return {
    // State
    users,
    userDetail,
    isLoading,
    error,
    isSubmitting,
    pagination,
    params,

    // Actions
    fetchUsers,
    newUser,
    removeUser,
    clearError,
    resetState,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onFilterChange,
    setParams,
    setUserDetail,
    setUsers,
    updateDetails,
    resetUserPassword,
  };
};
