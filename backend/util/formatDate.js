export const formatDate = (
  date,
  locale = "vi-VN",
  options = {}
) => {
  if (!date) return "";

  return new Date(date).toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: "short",
    ...options,
  });
};
