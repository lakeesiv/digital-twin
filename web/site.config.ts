import config from "../ecosystem.config";
const prodEnv = config.apps[0].env;
const devEnv = config.apps[0].devEnv;

const isProd = process.env.NODE_ENV === "production";

const env = isProd ? prodEnv : devEnv;

export const siteConfig = {
  DH_API_URL: `http://127.0.0.1:${env.DH_PORT}`,
  SENSOR_API_URL: `http://localhost:${env.SENSOR_PORT}`,
  SENSOR_WS_URL: `ws://localhost:${env.SENSOR_PORT}/ws/`, // make sure to include trailing slash
};
