// Example from https://beta.reactjs.org/learn

import { useState } from "react";
import { Card } from "@tremor/react";
import styles from "./counters.module.css";
import { ScatterMap } from "charts";
import { LineComparisonChart } from "charts";

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <button onClick={handleClick} className={styles.counter}>
        Clicked {count} times
      </button>
    </div>
  );
}

export default function MyApp() {
  return (
    <LineComparisonChart
      lineData1={{
        data: {
          x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          y: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        },
        labels: ["Line 1"],
        title: "Line 1",
        xlabel: "x1",
        ylabel: "y1",
      }}
      lineData2={{
        data: {
          x: [6, 7, 8, 9, 10],
          y: [[36, 57, 38, 29, 110]],
        },
        labels: ["Line 2"],
        title: "Line 2",
        xlabel: "x2",
        ylabel: "y2",
      }}
      title="Line Comparison Chart"
      timeUnit={{
        current: "hour",
        target: "hour",
        options: ["hour", "day", "week"],
      }}
    />
  );
}
