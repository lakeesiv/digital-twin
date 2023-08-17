const prodEnv = {
  WEB_PORT: 2222,
  SENSOR_PORT: 7777,
  DH_PORT: 5000, // Can not be configured on this file
};

const devEnv = {
  SENSOR_PORT: 8000,
  DH_PORT: 5000, // Can not be configured on this file
};

module.exports = {
  apps: [
    {
      name: "web",
      script: "cd web && PORT=$WEB_PORT pnpm start",
      args: "start",
      autorestart: false,
      watch: true,
      env: prodEnv,
      devEnv: devEnv,
    },
    {
      name: "sensor-server",
      script:
        "cd servers/sensor && source venv/bin/activate && PORT=$SENSOR_PORT python main.py",
      args: "start",
      autorestart: false,
      watch: true,
      env: prodEnv,
      devEnv: devEnv,
    },
  ],
};
