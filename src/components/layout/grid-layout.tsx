import { Flex } from "@tremor/react";
import { Grid, LayoutGrid, Rows } from "lucide-react";
import React, { useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Select,
  SelectItem,
} from "~/ui/select";

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gridColumns?: 1 | 2 | 3;
  children: React.ReactNode;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  gridColumns = 2,
  ...props
}) => {
  const [numberOfColumns, setNumberOfColumns] = useState<1 | 2 | 3>(
    gridColumns
  );
  const defaultIcon =
    gridColumns === 1 ? (
      <Rows size={18} />
    ) : gridColumns === 2 ? (
      <LayoutGrid size={18} />
    ) : (
      <Grid size={18} />
    );

  return (
    <div {...props}>
      <Flex>
        <div></div>
        <div className="flex justify-center space-x-2">
          <Select
            onValueChange={(value) => {
              setNumberOfColumns(parseInt(value) as 1 | 2 | 3);
            }}
          >
            <SelectTrigger className="h-[37px] w-[70px]">
              <SelectValue placeholder={defaultIcon} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Layout</SelectLabel>
                <SelectItem value="1">
                  <Rows size={18} />
                </SelectItem>
                <SelectItem value="2">
                  <LayoutGrid size={18} />
                </SelectItem>
                <SelectItem value="3">
                  <Grid size={18} />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Flex>
      <div
        className={
          "mx-auto grid  gap-4 pt-4 " + `grid-cols-${numberOfColumns || 2}`
        }
      >
        {children}
      </div>
    </div>
  );
};

export default GridLayout;
