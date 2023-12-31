import { useEffect, useRef, useState } from "react";
import { SensorData } from ".";

interface Options {
  onConnect?: () => void;
  condition?: boolean;
}

const useWebSocket = (url: string | undefined, options?: Options) => {
  const [messageHistory, setMessageHistory] = useState<SensorData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connected" | "Disconnected" | "Uninstantiated"
  >("Uninstantiated");

  const socketRef = useRef<WebSocket | null>(null);
  const isBrowser = typeof window !== "undefined";

  const socket = socketRef.current;

  useEffect(() => {
    // if not in browser, don't connect
    if (!isBrowser) return;

    if (!url) return;

    if (!socketRef.current) {
      socketRef.current = new WebSocket(url);
    }

    // if condition is false, don't connect
    if (options?.condition !== undefined) {
      if (!options.condition) return;
    }

    if (!socketRef.current) return;

    socketRef.current.onopen = () => {
      console.log("WS: Connected");
      setConnectionStatus("Connected");
      options?.onConnect?.();
    };

    socketRef.current.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data) as SensorData;
      setMessageHistory((prev) => [...prev, data]);
    };

    socketRef.current.onclose = () => {
      setConnectionStatus("Disconnected");
    };
  }, [options?.condition, socketRef, url]);

  return {
    messageHistory,
    setMessageHistory,
    lastMessage: messageHistory[messageHistory.length - 1],
    connectionStatus,
  };
};

export default useWebSocket;
