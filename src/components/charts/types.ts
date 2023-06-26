export type LineGraphData = {
  title?: string; // optional
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[][] | number[]; // each array is a line [[...], [...], [...]]  or single line [...]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
};

export type BarGraphData = {
  title?: string; // optional
  xlabel: string;
  ylabel: string;
  data: {
    x: string[]; // categories
    labels: string[]; // each label is a line ["label1", "label2", "label3"]
    y: number[][]; // each array is a line [[label1_val, label2val, label3val], [...], [...]]
  };
};
