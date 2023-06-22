export const roundToDP = (value: number, dp: number) => {
  const factor = Math.pow(10, dp);
  return Math.round(value * factor) / factor;
};
