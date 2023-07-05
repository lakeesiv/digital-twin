import Layout from "~/components/layout";
import { useRouter } from "next/router";
import Chart from "~/components/chart";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  // const [fooEvents, setFooEvents] = useState<any[]>([]);
  const socket: WebSocket = new SockJS(
    "https://tfc-app9.cl.cam.ac.uk/rtmonitor/A/mqtt_acp"
  );

  useEffect(() => {
    setMounted(true);

    function onConnect() {
      setIsConnected(true);
    }

    // function onConnectError(err: Error) {
    //   console.log("Error connecting to socket.io server", err);
    // }
    // function onDisconnect() {
    //   setIsConnected(false);
    // }

    // function onFooEvent(value) {
    //   setFooEvents((previous) => [...previous, value]);
    // }

    // socket.on("connect", onConnect);
    // socket.on("connect_error", onConnectError);
    // socket.on("disconnect", onDisconnect);
    // socket.on("foo", onFooEvent);
    socket.onopen = function () {
      console.log("open");
      onConnect();
    };

    socket.onmessage = function (e) {
      console.log("message", e.data);
      // sock.close();
    };

    // socket.onclose = function () {
    //   console.log("close");
    // };

    // return () => {
    //   socket.off("connect", onConnect);
    //   socket.off("disconnect", onDisconnect);
    // };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout title={(router.query.id as string) || "Sensor"}>
      <h1 className="mb-2 font-mono text-2xl font-bold">
        Sensor ID: {router.query.id} | Socket:{" "}
        {isConnected ? "Connected" : "Disconnected"}
      </h1>
      <Chart />
    </Layout>
  );
}
