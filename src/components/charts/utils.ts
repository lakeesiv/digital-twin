const colors = [
  "#6b64ef",
  "#FF6B6B",
  "#FFE66D",
  "#8CE8C3",
  "#FFA8E2",
  "#A8D0E6",
  "#FFCBB2",
  "#B2B2B2",
  "#F7DC6F",
  "#D2B4DE",
  "#F1948A",
  "#A9DFBF",
  "#F5B7B1",
  "#D7BDE2",
  "#A3E4D7",
  "#F0B27A",
];

export const getColor = (index: number) => {
  return colors[index % colors.length];
};
