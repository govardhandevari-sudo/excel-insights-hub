export const formatLakhs = (value) => {
  return `₹${Number(value || 0).toFixed(2)}L`;
};
