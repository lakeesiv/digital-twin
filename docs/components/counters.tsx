// Example from https://beta.reactjs.org/learn

import { useState } from "react";
import { Card } from "@tremor/react";
import styles from "./counters.module.css";
import { ScatterMap } from "charts";

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
    <ScatterMap
      title="H"
      mapboxAccessToken="pk.eyJ1IjoicGxvdGx5LWRvY3MiLCJhIjoiY2s1MnNtODFwMDE4YjNscG5oYWNydXFxYSJ9.AquTxb6AI-oo7TWt01YQ9Q"
    />
  );
}
