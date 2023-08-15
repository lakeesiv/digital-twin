import { useDHStatus, useSensorStatus } from "~/api/status";
import WSStatus from "../ws-status";
import StatusBage from "../status-badge";

interface StatusProps {
  connectionStatus: boolean;
  title: string;
}

const Status = ({ connectionStatus, title }: StatusProps) => {
  return (
    <div className="mb-2 flex flex-row items-center space-x-4">
      <div>
        <StatusBage
          status={connectionStatus ? "active" : "inactive"}
          message={title}
          color={connectionStatus ? "lime" : "orange"}
          animated={false}
        />
      </div>
    </div>
  );
};

export const DHStatus = () => {
  const status = useDHStatus();
  return <Status connectionStatus={status} title="DH Server" />;
};
export const SensorStatus = () => {
  const status = useSensorStatus();
  return <Status connectionStatus={status} title="Sensor Server" />;
};
