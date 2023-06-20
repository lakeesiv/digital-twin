import { Card, Metric, Text, Divider, AreaChart } from "@tremor/react";

const generateData = () => {
  type Datapoint = {
    humidity: number;
    temperature: number;
    pressure: number;
    timestamp: string;
  };

  const datapoints: Datapoint[] = [];

  for (let i = 0; i < 100; i++) {
    datapoints.push({
      humidity: Math.random() * 100,
      temperature: Math.random() * 100,
      pressure: Math.random() * 100,
      timestamp: new Date(
        Date.now() - i * 1000 * 60 * 60 * 24
      ).toLocaleString(),
    });
  }
  return datapoints;
};

const data = generateData();

export default function Example() {
  return (
    <Card className="mx-auto">
      <Text>Humidity</Text>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        categories={["humidity"]}
        index="timestamp"
        colors={["indigo"]}
        showYAxis={true}
        showLegend={false}
      />

      <Divider />

      <Text>Temperature</Text>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        curveType="step"
        categories={["temperature"]}
        index="timestamp"
        colors={["red"]}
        showYAxis={true}
        showLegend={false}
      />
      <Text>Pressure</Text>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        categories={["temperature"]}
        index="timestamp"
        colors={["blue"]}
        showYAxis={true}
        showLegend={false}
      />

      {/* 
      <Divider />

      <Text>Successful Payments</Text>
      <Metric>$ 10,300</Metric>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        categories={["Successful Payments"]}
        index="Month"
        colors={["indigo"]}
        valueFormatter={valueFormatter}
        showYAxis={false}
        showLegend={false}
      />

      <Divider />

      <Text>Customers</Text>
      <Metric>645</Metric>
      <AreaChart
        className="mt-8 h-44"
        data={data}
        categories={["Customers"]}
        index="Month"
        colors={["indigo"]}
        valueFormatter={valueFormatter}
        showYAxis={false}
        showLegend={false}
      /> */}
    </Card>
  );
}
