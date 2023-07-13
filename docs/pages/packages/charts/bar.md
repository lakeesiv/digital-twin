---
sidebar_label: Bar Chart
sidebar_position: 2
---

# Bar Chart

The following file represents the data structure that the simulation _must_ output for the graph to be plotted as a bar graph

```tsx
type BarChartData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: string[] | number[]; // categories for each bar [cat1, cat2, cat3, ...]
    labels: string[]; // each label is a line ["label1", "label2", "label3"]
    y: number[][]; // each array is a line [[label1_cat1_val, label2_cat1_val, label3_cat_1_val], [...], [...]]
    error?: number[][]; // same format as y
  };
};
```

The `x` values are the categories for each bar, for example these could be the stages in the Histo-Path lab.
The `labels` are the labels for each bar in the category, for example these could be the target and actual values for each stage. The `y` values are the values for each label in each category, the first index represents the category and the second index represents the label. The `error` values are the error bars for each label in each category, the first index represents the category and the second index represents the label.

## Examples

Note in these examples we omit the `title`, `xlabel`, and `ylabel` for brevity.

### One Bar

```json title="One Bar"
{
  "data": {
    "x": ["Stage 1", "Stage 2", "Stage 3"],
    "labels": ["Actual"],
    "y": [[1, 2, 3]]
  }
}
```

### Two Bars

```json title="Two Bar"
{
  "data": {
    "x": ["Stage 1", "Stage 2", "Stage 3"],
    "labels": ["Actual", "Target"],
    "y": [
      [1, 2, 3], // actual values
      [0.5, 3, 3] // target values
    ]
  }
}
```

### Error Bars

```json title="Error Bars"
{
  "data": {
    "x": ["Stage 1", "Stage 2", "Stage 3"],
    "labels": ["Actual", "Target"],
    "y": [
      [1, 2, 3], // actual values
      [0.5, 3, 3] // target values
    ],
    "errors": [
      [0.1, 0.2, 0.3], // actual values
      [0.1, 0.2, 0.3] // target values
    ]
  }
}
```
