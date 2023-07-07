import React from "react";
import StatusBage from "./status-badge";
interface WSStatusProps {
  connectionStatus: string;
  rtConnected: boolean;
}

const WSStatus: React.FC<WSStatusProps> = ({
  connectionStatus,
  rtConnected,
}) => {
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
