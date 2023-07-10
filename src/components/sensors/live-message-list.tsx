import React from "react";
import { ScrollArea } from "~/ui/scroll-area";
import { type ParsedMessage } from "~/websockets/useWS";
import { Card, List, ListItem, Title } from "@tremor/react";

interface LiveMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  sensorData: ParsedMessage[];
}

const LiveMessageList: React.FC<LiveMessageListProps> = ({
  sensorData,
  ...props
}) => {
  return (
    <Card {...props}>
      <Title>Live Message List</Title>
      <ScrollArea className="h-[300px]">
        <List>
          {sensorData.map((message) => (
            <ListItem key={message.acp_ts}>
              <span className="whitespace-pre font-mono text-xs text-gray-700 dark:text-gray-300">
                {JSON.stringify(message, null, 4)}
              </span>
            </ListItem>
          ))}
        </List>
      </ScrollArea>
    </Card>
  );
};

export default LiveMessageList;
