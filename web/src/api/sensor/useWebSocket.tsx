import { useEffect, useState } from "react";
import { SensorData } from ".";

interface Options {
  onConnect?: () => void;
  condition?: boolean;
}

const useWebSocket = (url: string, options?: Options) => {
  const socket = new WebSocket(url);
  const [messageHistory, setMessageHistory] = useState<SensorData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connected" | "Disconnected" | "Uninstantiated"
  >("Uninstantiated");

  const sendMessage = (message: string) => {
    socket.send(message);
  };

  const sendJsonMessage = (message: object) => {
    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    // if condition is false, don't connect
    if (options?.condition !== undefined) {
      if (!options.condition) return;
    }

    socket.onopen = () => {
      setConnectionStatus("Connected");
      options?.onConnect?.();
    };

    socket.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data) as SensorData;
      setMessageHistory((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      setConnectionStatus("Disconnected");
    };
  }, [options?.condition]);

  return {
    messageHistory,
    setMessageHistory,
    sendMessage,
    sendJsonMessage,
    lastMessage: messageHistory[messageHistory.length - 1],
    connectionStatus,
  };
};

export default useWebSocket;
