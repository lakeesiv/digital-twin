import React from "react";
import StatusBage from "./status-badge";
import { useToast } from "~/ui/use-toast";
interface WSStatusProps {
  connectionStatus:
    | "Connecting"
    | "Connected"
    | "Closing"
    | "Closed"
    | "Uninstantiated";
  rtConnected: boolean;
  alert?: boolean;
}

const WSStatus: React.FC<WSStatusProps> = ({
  connectionStatus,
  rtConnected,
  alert = true,
}) => {
  const toast = useToast();

  React.useEffect(() => {
    if (alert) {
      if (connectionStatus === "Closed") {
        toast.toast({
          title: "WebSocket Disconnected",
          description: "WebSocket connection is lost.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [connectionStatus]);

  return (
    <div className="mb-2 flex flex-row items-center space-x-4">
      <div>
        <StatusBage
          status={connectionStatus === "Connected" ? "active" : "inactive"}
          message="WebSocket"
          color={connectionStatus === "Connected" ? "lime" : "orange"}
          animated={false}
        />
      </div>
      <div>
        <StatusBage
          status={rtConnected ? "active" : "inactive"}
          message="Real Time"
          color={rtConnected ? "lime" : "orange"}
          animated={false}
        />
      </div>
    </div>
  );
};

export default WSStatus;
