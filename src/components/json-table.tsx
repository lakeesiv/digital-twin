import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import React, { useEffect, useState } from "react";

interface JSONTableProps extends React.HTMLAttributes<HTMLDivElement> {
  data: object;
  truncate?: number;
}

const JSONTable: React.FC<JSONTableProps> = ({
  data,
  truncate = 0,
  ...props
}) => {
  type KeyValue = keyof typeof data;
  const [currentTruncate, setCurrentTruncate] = useState(truncate);
  const [currentData, setCurrentData] = useState(data);

  useEffect(() => {
    if (currentTruncate > 0) {
      const keys = Object.keys(data);
      setCurrentData(
        keys.slice(0, currentTruncate).reduce((obj, key) => {
          obj[key as KeyValue] = data[key as KeyValue];
          return obj;
        }, {} as typeof data)
      );
    } else {
      setCurrentData(data);
    }
  }, [data, currentTruncate, truncate]);

  //   if (truncate > 0) {
  //     const keys = Object.keys(data);
  //     data = keys.slice(0, truncate).reduce((obj, key) => {
  //       obj[key as KeyValue] = data[key as KeyValue];
  //       return obj;
  //     }, {} as typeof data);
  //   }

  return (
    <div>
      <Table
        className="text-xxs max-w-[300px]"
        {...props}
        onMouseEnter={() => {
          setCurrentTruncate(0);
        }}
        onMouseLeave={() => {
          setCurrentTruncate(truncate);
        }}
      >
        <TableBody>
          {Object.keys(currentData).map((key) => (
            <TableRow className="p-0" key={`${key}-${Math.random()}`}>
              <TableCell>{key}</TableCell>
              <TableCell>{data[key as KeyValue]}</TableCell>
            </TableRow>
          ))}
          {currentTruncate > 0 && (
            <TableRow key={`...-${Math.random()}`}>
              <TableCell>...</TableCell>
              <TableCell>...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JSONTable;
