import { teacherService } from "@/services/teacherService";
import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
export const useTeacher = () => {
  const [teacher, setTeacher] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({ page: 1, limit: 10 });

  const fetchTeacher = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await teacherService.getTeacher();

      setTeacher(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Student:", err);

      setError(err.message);
      setTeacher([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchTeacher,
    teacher,
    isLoading,
    error,

    params,
    setParams,
  };
};
