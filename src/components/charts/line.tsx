import React, { useState } from "react";
import { AreaChart, Card, Title, Flex } from "@tremor/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/ui/select";
import { Button } from "~/ui/button";
import { Download } from "lucide-react";

interface LineProps {
  y_label: string;
  x_label: string;
  title: string;
  cardProps?: React.ComponentProps<typeof Card>;
  defaultCurveStyle?: "linear" | "step" | "natural";
  data: {
    x: number[];
    y: number[];
  };
}

const Line: React.FC<LineProps> = ({
  data,
  x_label,
  y_label,
  title,
  cardProps,
  defaultCurveStyle,
  ...props
}) => {
  const [curveStyle, setCurveStyle] = useState<"linear" | "step" | "natural">(
    defaultCurveStyle || "linear"
  );

  // create data object
  type Data = {
    [label: string]: number;
    time: number;
  };

  const x = data.x;
  const y = data.y;

  const parsedData: Data[] = [];

  for (let i = 0; i < x.length; i++) {
    parsedData.push({
      [y_label]: y[i] as number,
      time: x[i] as number,
    });
    console.log(parsedData);
  }

  const updatedProps = {
    ...props,
    index: "time",
    data: parsedData,
    categories: [y_label],
  };

  return (
    <Card className="mx-auto" {...cardProps}>
      <Flex>
        <Title>{title}</Title>
        <div className="flex justify-center">
          <Select
            onValueChange={(value) =>
              setCurveStyle(value as "linear" | "step" | "natural")
            }
          >
            <SelectTrigger
              className="h-[30px]
					  w-[100px]
					  "
            >
              <SelectValue placeholder="Line" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Line Style</SelectLabel>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="natural">Natural</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="ml-4 h-[30px] "
            variant="secondary"
            onClick={() => {
              // download data as JSON
              const element = document.createElement("a");
              const file = new Blob([JSON.stringify(parsedData)], {
                type: "text/plain",
              });
              element.href = URL.createObjectURL(file);
              element.download = "data.json";
              document.body.appendChild(element); // Required for this to work in FireFox
              element.click();
            }}
          >
            <Download size={16} className="px-0" />
          </Button>
        </div>
      </Flex>
      <AreaChart
        className="mt-8 h-44"
        colors={["indigo"]}
        showYAxis={true}
        showLegend={true}
        curveType={curveStyle}
        yAxisWidth={40}
        {...updatedProps}
      />
      {x_label && (
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">{x_label}</p>
        </div>
      )}
    </Card>
  );
};

export default Line;
