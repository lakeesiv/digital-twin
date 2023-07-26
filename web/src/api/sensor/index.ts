export type SensorData = {
  acp_id: string;
  acp_ts: string;
  payload: {
    [key: string]: number;
  };
};

import getDeviceHistory from "./getDeviceHistory";
import getLatestDevices from "./getLatestDevices";

export { getDeviceHistory, getLatestDevices };
