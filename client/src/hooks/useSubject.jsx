import { subjectService } from "@/services/subjectService";
import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
export const useSubject = () => {
  const [subject, setSubject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({ page: 1, limit: 10 });

  const fetchSubjectByExamSeriesId = useCallback(async (examSeriesId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await subjectService.getSubjectByExamSeriesId(
        examSeriesId
      );

      setSubject(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setSubject([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchSubjectByExamSeriesId,
    subject,
    isLoading,
    error,

    params,
    setParams,
  };
};
