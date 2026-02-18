export const getDefault3MonthRangeDates = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);

  return { from, to };
};

export const formatDDMMYYYY = (value) => {
  if (!value) return "";

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB").replaceAll("/", "-");
};
