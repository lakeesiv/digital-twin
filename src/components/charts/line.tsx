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
  ylabel: string;
  xlabel: string;
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
  xlabel,
  ylabel,
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
  };

  const x = data.x;
  const y = data.y;

  const parsedData: Data[] = [];

  for (let i = 0; i < x.length; i++) {
    parsedData.push({
      [ylabel]: y[i] as number,
      [xlabel]: x[i] as number,
    });
    console.log(parsedData);
  }

  const updatedProps = {
    ...props,
    index: xlabel,
    data: parsedData,
    categories: [ylabel],
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
            <SelectTrigger className="h-[30px] w-[100px]">
              <SelectValue placeholder={defaultCurveStyle || "Linear"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Line Style</SelectLabel>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="natural">Smooth</SelectItem>
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
      {xlabel && (
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">{xlabel}</p>
        </div>
      )}
    </Card>
  );
};

export default Line;
