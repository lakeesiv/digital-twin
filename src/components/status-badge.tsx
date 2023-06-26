import React from "react";
import { Text } from "@tremor/react";

interface StatusBageProps {
  message?: string;
  status: "active" | "inactive";
  color: string;
}

const StatusBage: React.FC<StatusBageProps> = ({ color, message, status }) => {
  return (
    <div className="flex items-center justify-center space-x-3 rounded-xl ">
      {/* Text */}
      <Text>{message}</Text>
      {/* Status Icon */}
      <div className="relative mt-[2px] flex h-3 w-3">
        {status === "active" && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full duration-1000 bg-${color}-400 opacity-75`}
          ></span>
        )}
        {status === "active" ? (
          <span
            className={`relative inline-flex h-3 w-3 rounded-full bg-${color}-600`}
          ></span>
        ) : (
          <span
            className={`relative inline-flex h-3 w-3 rounded-full bg-${color}-900`}
          ></span>
        )}
      </div>
    </div>
  );
};

export default StatusBage;
