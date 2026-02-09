import { parseISO, format } from "date-fns";
export const formatDateToLocal = (apiDate) => {
  if (!apiDate) return "";

  const date = parseISO(apiDate);

  return format(date, "yyyy-MM-dd HH:mm");
};

export const formatDateForAPI = (dateTimeLocal) => {
  if (!dateTimeLocal) return "";

  const localDate = parseISO(dateTimeLocal);

  return localDate.toISOString();
};
