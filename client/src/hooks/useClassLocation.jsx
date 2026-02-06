import { classLocationService } from "@/services/classLocationService";
import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
export const useClassLocation = () => {
  const [classLocation, setClassLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const fetchClassLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await classLocationService.getClassLocation();

      setClassLocation(response.data);

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error fetching Location:", err);

      setError(err.message);
      setClassLocation([]);

      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchClassLocation,
    classLocation,
    isLoading,
    error,
    params,
    setParams,
  };
};
