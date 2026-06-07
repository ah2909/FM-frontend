export const fmt = (n: number, dec = 2) =>
  Math.abs(n).toLocaleString(undefined, {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
