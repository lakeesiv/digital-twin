import type { DateRangePickerValue } from "@tremor/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useSensorManager from "~/api/sensor/useSensorManager";
import Layout from "~/components/layout";
import LiveCharts from "~/components/sensors/live-charts";
import LiveMessageList from "~/components/sensors/live-message-list";
import WSStatus from "~/components/ws-status";

function Page() {
  const router = useRouter();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const [dates, _setDates] = useState<DateRangePickerValue>({
    from: yesterday,
    to: today,
  });

  const setDates = (newDates: DateRangePickerValue) => {
    if (!newDates.from || !newDates.to || newDates.from === newDates.to) {
      const availableDate = newDates.from || newDates.to || today;
      const startOfDay = new Date(availableDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(availableDate);
      endOfDay.setHours(23, 59, 59, 999);
      newDates.from = startOfDay;
      newDates.to = endOfDay;
    }
    _setDates(newDates);
  };

  const { data, error, loading, connectionStatus, messageHistory } =
    useSensorManager(
      router.query.id as string | undefined,
      dates.from!,
      dates.to!
    );

  if (!router.query.id) {
    return null;
  }

  if (loading && !error) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div className="flex items-center space-x-2">
        <WSStatus connectionStatus={connectionStatus} />
      </div>
      <LiveCharts
        dates={dates}
        setDates={setDates}
        sensorData={data}
        className="mt-4"
      />
      <LiveMessageList sensorData={messageHistory} className="mt-4" />
    </Layout>
  );
}

export default Page;
