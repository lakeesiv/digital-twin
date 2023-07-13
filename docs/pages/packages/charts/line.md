---
sidebar_label: Line Chart
sidebar_position: 1
---

# Line Chart

The following file represents the data structure that the simulation _must_ output for the graph to be plotted as a line graph

```tsx
type LineChartData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: number[] | number[][]; // either one array of x values (global), or an array of arrays of x values for each line
    y: number[][]; // each array is a line [[...], [...], [...]]  or single line [...]
  };
  labels: string[]; // each label is a line ["label1", "label2", "label3"]
};
```

We tend to have the same x-values for all lines, so we can just pass in a single array of x-values. If we want to have different x-values for each line, we can pass in an array of arrays of x-values. **Note the y-values are always an array of arrays, where each array is a line.** Labels are also an array of strings, where each string is a label for a line.

Also the `title`, `xlabel`, and `ylabel` are all strings which are **required**.

## Examples

Note in these examples we omit the `title`, `xlabel`, and `ylabel` for brevity.

### One Line

```json title="1 Line"
{
  "data": {
    "x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "y": [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
  },
  "labels": ["label1"]
}
```

### Three Lines (Common X Values)

```json title="3 Lines, Same X values"
{
  "data": {
    "x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "y": [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
    ]
  },
  "labels": ["label1", "label2", "label3"]
}
```

### Three Lines (Different X Values)

```json title="3 Lines, Different X values"
{
  "data": {
    "x": [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    ],
    "y": [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
    ]
  },
  "labels": ["label1", "label2", "label3"]
}
```
