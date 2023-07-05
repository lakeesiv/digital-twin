import { Check, PlusCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "~/ui/badge";
import { Button } from "~/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { Separator } from "~/ui/separator";
import { cn } from "~/utils/cn";

interface FactedFilterButtonProps {
  filters: string[];
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  title: string;
  limit?: number;
}

const FacetedFilterButton = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  title,
  limit,
}: FactedFilterButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedFilters?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-mono lg:hidden"
              >
                {selectedFilters.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedFilters.length > 5 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-mono"
                  >
                    {selectedFilters.length} selected
                  </Badge>
                ) : (
                  filters
                    .filter((option) => selectedFilters.includes(option))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option}
                        className="rounded-sm px-1 font-mono"
                      >
                        {option}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filters.map((option) => {
                const isSelected = selectedFilters.includes(option);
                const numberSelected = selectedFilters.length;
                return (
                  <CommandItem
                    key={option}
                    disabled={
                      limit ? numberSelected >= limit && !isSelected : false
                    }
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedFilters(
                          selectedFilters.filter((filter) => filter !== option)
                        );
                      } else {
                        setSelectedFilters([...selectedFilters, option]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                        limit && numberSelected >= limit && !isSelected
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>

                    <span
                      className={cn(
                        "font-mono",
                        limit && numberSelected >= limit && !isSelected
                          ? "cursor-not-allowed text-red-500"
                          : "cursor-pointer"
                      )}
                    >
                      {option}
                    </span>
                    {/* {true && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {option}
                      </span>
                    )} */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedFilters.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedFilters([]);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FacetedFilterButton;
