export const roundToDP = (value: number, dp: number) => {
  const factor = Math.pow(10, dp);
  return Math.round(value * factor) / factor;
};

export const capilatizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
