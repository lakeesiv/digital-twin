/**
 * live-message-list.tsx: A component that displays a list of live messages from sensors.
 *
 * @description This file exports a React component that displays a list of live messages from sensors. The component receives an array of messages as a prop and renders each message as a list item. The messages are displayed in reverse chronological order, with the most recent message at the top of the list.
 *
 * @example
 *
 * ```
 * import { LiveMessageList } from '~/components/sensors/live-message-list';
 *
 * function SensorPage() {
 *   const [messages, setMessages] = useState<ParsedMessage>([]);
 *
 *   useEffect(() => {
 *     /// fetch messages from API and update state
 *   }, []);
 *
 *   return (
 *     <div>
 *       <h1>Sensor Page</h1>
 *       <LiveMessageList messages={messages} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {Array} messages An array of message objects of ParsedMessage type.
 *
 * @returns {JSX.Element} A React component that displays a list of live messages from sensors.
 *
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import React from "react";
import { ScrollArea } from "ui";
import { Card, List, ListItem, Title } from "@tremor/react";
import { SensorData } from "~/api/sensor";

interface LiveMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  sensorData: SensorData[];
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
