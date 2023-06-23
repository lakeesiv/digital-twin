export type MultiGraphingData = {
  title?: string; // optional
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[][]; // each array is a line [[...], [...], [...]]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
};
