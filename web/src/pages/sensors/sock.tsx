import Layout from "~/components/layout";
import useSensorManager from "~/api/sensor/useSensorManager";

const WS = () => {
  const {
    data,
    error,
    loading,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  } = useSensorManager("1", new Date(), new Date());

  return <Layout></Layout>;
};

export default WS;
