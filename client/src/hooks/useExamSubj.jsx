import { subjectService } from "@/services/subjService";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useExamSubject = () => {
  const [examSubj, setExamSubj] = useState([]);
  const [examSubjDetail, setExamSubjDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [params, setParams] = useState({ pageSize: 10 });

  const formatExamSubjData = useCallback((rawExamSubj) => {
    return rawExamSubj.map((item) => ({
      ...item,
      id: item.subjId,
    }));
  }, []);

  const fetchSubjects = useCallback(
    async (overrideParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const finalParams = { ...params, ...overrideParams };
        const apiParams = {
          ...finalParams,
        };
        const response = await subjectService.getSubjects(apiParams);
        // console.log("response: ", response);
        const data = formatExamSubjData(response.data);

        setExamSubj(data);
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
        console.error("Error fetching examSubj:", err);

        setError(err.message);
        setExamSubj([]);

        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [params, formatExamSubjData],
  );

  const fetchSubjectById = useCallback(async (subjId) => {
    if (!subjId) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);

      const response = await subjectService.getSubjGrades(subjId);

      setExamSubjDetail(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching examSubj:", err);

      setError(err.message);
      setExamSubj([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const newExamSubj = useCallback(async (examSubjData) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new Subject...");
      const response = await subjectService.insertSubj(examSubjData);
      toast.success("Exam Subject added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating examSubj:", err);
      toast.error(err.message || "Failed to create Exam Subject", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateDetails = useCallback(async (examSubjId, examSubjData) => {
    if (!examSubjId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Updating subject details...");
      const response = await subjectService.putSubj(examSubjId, examSubjData);
      toast.success("Exam Subject updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating examSubj:", err);
      toast.error(err.message || "Failed to update subject", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeSubject = useCallback(async (examSubjId) => {
    if (!examSubjId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Deleting subject...");
      const response = await subjectService.removeSubj(examSubjId);
      toast.success("Exam Subject deleted successfully", { id: toastId });

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting examSubj:", err);
      toast.error(err.message || "Failed to delete subject", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const newSubjGrade = useCallback(async (examSubjData) => {
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Creating new grade...");
      const response = await subjectService.insertSubjGrade(examSubjData);
      toast.success("Subject Grade added successfully!", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error creating examSubjGrade:", err);
      toast.error(err.message || "Failed to create Subject Grade", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateSubjGrade = useCallback(async (gradeId, examSubjData) => {
    if (!gradeId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Updating grade details...");
      const response = await subjectService.putSubjectGrade(
        gradeId,
        examSubjData,
      );
      toast.success("Subject Grade updated successfully", { id: toastId });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating Subject Grade:", err);
      toast.error(err.message || "Failed to update subject grade", {
        id: toastId,
      });
      setError(err.message);

      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeSubjGrade = useCallback(async (gradeId) => {
    if (!gradeId) return;
    let toastId;
    try {
      setIsSubmitting(true);
      setError(null);
      toastId = toast.loading("Deleting subject grade...");
      const response = await subjectService.removeSubjGrade(gradeId);
      toast.success("Subject Grade deleted successfully", { id: toastId });

      return { success: true, data: response };
    } catch (err) {
      console.error("Error deleting examSubjGrade:", err);
      toast.error(err.message || "Failed to delete subject grade", {
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
    setExamSubj([]);
    setExamSubjDetail(null);
    setIsLoading(false);
    setError(null);
    setIsSubmitting(false);
  }, []);

  const onPageChange = useCallback(
    async (page) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return await fetchSubjects({ page });
    },
    [params, fetchSubjects],
  );

  const onPageSizeChange = useCallback(
    async (pageSize) => {
      const newParams = { ...params, pageSize, page: 1 };
      setParams(newParams);
      return await fetchSubjects({ pageSize, page: 1 });
    },
    [params, fetchSubjects],
  );

  const onSearch = useCallback(
    async (searchTerm) => {
      const newParams = { ...params, searchTerm, page: 1 };
      setParams(newParams);
      return await fetchSubjects({ searchTerm, page: 1 });
    },
    [params, fetchSubjects],
  );

  const onFilterChange = useCallback(
    async (filters) => {
      const newParams = {
        ...params,
        byRole: filters.byRole || null,
        page: 1,
      };
      setParams(newParams);
      return await fetchSubjects({
        byRole: filters.byRole || null,
        page: 1,
      });
    },
    [params, fetchSubjects],
  );

  return {
    // State
    examSubj,
    examSubjDetail,
    isLoading,
    error,
    isSubmitting,
    pagination,
    params,

    // Actions
    fetchSubjects,
    newExamSubj,
    removeSubject,
    clearError,
    resetState,
    onPageChange,
    onPageSizeChange,
    onSearch,
    onFilterChange,
    setParams,
    setExamSubjDetail,
    setExamSubj,
    updateDetails,
    fetchSubjectById,
    newSubjGrade,
    updateSubjGrade,
    removeSubjGrade,
  };
};
