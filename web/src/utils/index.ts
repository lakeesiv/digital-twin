export const roundToDP = (value: number, dp: number) => {
  const factor = Math.pow(10, dp);
  return Math.round(value * factor) / factor;
};

export const capilatizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getAllAttributes = (obj: { [key: string]: number }[]) =>
  obj.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (!acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);
