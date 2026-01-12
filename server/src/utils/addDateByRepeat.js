const addDateByRepeat = (date, repeatValue, repeatFreq) => {
  const newDate = new Date(date);

  switch (repeatValue) {
    case "daily":
      newDate.setDate(newDate.getDate() + repeatFreq);
      break;

    case "weekly":
      newDate.setDate(newDate.getDate() + 7 * repeatFreq);
      break;

    case "monthly":
      newDate.setMonth(newDate.getMonth() + repeatFreq);
      break;

    default:
      throw new Error("Invalid repeat value");
  }

  return newDate;
};

module.exports = addDateByRepeat;
