export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-UG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount) => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
  }).format(amount);
};
