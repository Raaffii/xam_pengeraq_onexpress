export function monthsAndYear(calendar) {
  const calendarDateNow = new Date();
  calendarDateNow.setDate(1);
  calendarDateNow.setMonth(calendarDateNow.getMonth() + calendar);

  const calendarDateNext = new Date();
  calendarDateNext.setDate(1);
  calendarDateNext.setMonth(calendarDateNext.getMonth() + calendar + 1);

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
  const now = calendarDateNow;
  const next = calendarDateNext;
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
