import useSubscribeById from "./useSubscribeById";
import getDeviceHistory from "./getDeviceHistory";

const useSensorManager = (id: string | undefined, start: Date, end: Date) => {
  const { connectionStatus, messageHistory, setMessageHistory } =
    useSubscribeById(id);

  const { data, error, loading } = getDeviceHistory(id, start, end);

  const combinedData = [...messageHistory, ...data];
  // remove duplicates
  const uniqueData = combinedData.filter(
    (v, i, a) => a.findIndex((t) => t.acp_ts === v.acp_ts) === i
  );
  // sort by timestamp
  const sortedData = uniqueData.sort((a, b) => {
    return new Date(a.acp_ts).getTime() - new Date(b.acp_ts).getTime();
  });

  return {
    data: sortedData,
    error,
    loading,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  };
};

export default useSensorManager;
