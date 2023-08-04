import Layout from "~/components/layout";
import { DataTable } from "~/components/sensors/gateway-data-connector/data-table";
import {
  GatewayDataConnectorRow,
  columns,
} from "~/components/sensors/gateway-data-connector/columns";
import useSubscribeByAll from "~/api/sensor/useSubscribeAll";
import { SensorData } from "~/api/sensor";
import WSStatus from "~/components/ws-status";

export default function Home() {
  const { connectionStatus, messageHistory } = useSubscribeByAll();

  return (
    <Layout>
      <div className="mb-2 flex items-center space-x-2">
        <WSStatus connectionStatus={connectionStatus} />
      </div>
      {connectionStatus === "Connected" && messageHistory.length > 0 && (
        <DataTable
          columns={columns}
          data={extractDataConnectorsAndGateways(messageHistory)}
        />
      )}
    </Layout>
  );
}

export const extractDataConnectorsAndGateways = (
  data: SensorData[]
): GatewayDataConnectorRow[] => {
  const result: GatewayDataConnectorRow[] = [];
  data.forEach((record) => {
    const gateway = record.gateway;
    const dataConnector = record.data_connector;
    result.push({
      id: gateway.gateway_id,
      type: "Gateway",
      timestamp: gateway.gateway_ts,
      lastReading: gateway,
    });

    result.push({
      id: dataConnector.data_connector_id,
      type: "Data Connector",
      timestamp: dataConnector.data_connector_ts,
      lastReading: dataConnector,
    });
  });
  return result;
};
