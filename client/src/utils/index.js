export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getUserInitials = (userName) => {
  if (!userName || typeof userName !== "string") {
    return "AA";
  }

  // Remove extra spaces and get the first two characters
  const cleanName = userName.trim();
  return cleanName.slice(0, 2).toUpperCase();
};

export const getGradeClass = (grade) => {
  switch (grade) {
    case "A+":
    case "A":
    case "A-":
      return "bg-green-600";
    case "B+":
      return "bg-blue-600";
    case "B":
    case "B-":
      return "bg-blue-500";
    case "C+":
    case "C-":
    case "C":
      return "bg-yellow-500";
    case "D":
    case "E":
      return "bg-orange-500";
    case "F":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
};

export const getGradeColor = (grade) => {
  if (!grade) return "bg-gray-500";
  if (grade.startsWith("A")) return "bg-green-600";
  if (grade.startsWith("B")) return "bg-blue-600";
  if (grade.startsWith("C")) return "bg-yellow-600";
  if (grade.startsWith("D")) return "bg-orange-600";
  return "bg-red-600";
};

export const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  // Handle YYYY-MM-DD format
  const parseDate = (dateStr) => {
    if (dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-");
      return { month, year };
    } else {
      const [month, year] = dateStr.split("/");
      return { month, year };
    }
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const months = [
    "Januari",
    "Februari",
    "Mac",
    "April",
    "Mei",
    "Jun",
    "Julai",
    "Ogos",
    "September",
    "Oktober",
    "November",
    "Disember",
  ];

  return `${months[parseInt(start.month) - 1]} ${start.year} - ${
    months[parseInt(end.month) - 1]
  } ${end.year}`;
};
