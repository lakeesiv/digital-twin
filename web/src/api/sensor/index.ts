export type SensorData = {
  acp_id: string;
  acp_ts: number;
  payload: {
    [key: string]: number;
  };
  location: {
    x: number;
    y: number;
    floor: 0 | 1;
  };
  gateway: {
    gateway_id: string;
    gateway_ts: number;
  };
  data_connector: {
    data_connector_id: string;
    data_connector_ts: number;
    data_connector_dev_eui: string;
  };
};

import getDeviceHistory from "./getDeviceHistory";
import getLatestDevices from "./getLatestDevices";

export { getDeviceHistory, getLatestDevices };
