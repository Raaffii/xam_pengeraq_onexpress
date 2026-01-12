export function monthsAndYear(calendar) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date(new Date().setMonth(new Date().getMonth() + calendar));
  const next = new Date(
    new Date().setMonth(new Date().getMonth() + calendar + 1)
  );
  const monthNumberNow = now.getMonth();

  let monthNumberNext = next.getMonth();

  if (monthNumberNext == 12) {
    monthNumberNext = 0;
  }

  const getYearNow = now.getFullYear();
  const getYearNext = next.getFullYear();

  const finalMonth = {
    nowMonth: months[monthNumberNow],
    nextMonth: months[monthNumberNext],
    nowYear: getYearNow,
    nextYear: getYearNext,
  };

  return finalMonth;
}
