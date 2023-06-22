import { Flex } from "@tremor/react";
import { LayoutGrid, Rows } from "lucide-react";
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

interface RowOrGridProps {
  defaultLayout?: "row" | "grid";
  gridColumns?: number;
  children: React.ReactNode;
}

const RowOrGrid: React.FC<RowOrGridProps> = ({
  children,
  defaultLayout = "grid",
  gridColumns = 2,
}) => {
  const [layout, setLayout] = useState<"row" | "grid">(defaultLayout || "grid");

  return (
    <div>
      <Flex>
        <div></div>
        <div className="flex justify-center space-x-2">
          <Select
            onValueChange={(value) => {
              setLayout(value as "row" | "grid");
            }}
          >
            <SelectTrigger className="h-[37px] w-[70px]">
              <SelectValue placeholder={<LayoutGrid size={18} />} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Layout</SelectLabel>
                <SelectItem value="row">
                  <Rows size={18} />
                </SelectItem>
                <SelectItem value="grid">
                  <LayoutGrid size={18} />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Flex>
      <div
        className={
          "mx-auto grid  gap-4 pt-4 " +
          (layout === "grid" ? `grid-cols-${gridColumns || 2}` : "grid-cols-1")
        }
      >
        {children}
      </div>
    </div>
  );
};

export default RowOrGrid;
