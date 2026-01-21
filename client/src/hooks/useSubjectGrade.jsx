import { subjectGradeService } from "@/services/subjectGradeService";
import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
export const useSubjectGrade = () => {
  const [subjectGrade, setSubjectGrade] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({ page: 1, limit: 10 });

  const fetchSubjectGradeByExamSubjectId = useCallback(async (examSubjtId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await subjectGradeService.getSubjectGradeByExamSubj(examSubjtId);
      setSubjectGrade(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setSubjectGrade([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchSubjectGradeByExamSubjectId,
    subjectGrade,
    isLoading,
    error,

    params,
    setParams,
  };
};
