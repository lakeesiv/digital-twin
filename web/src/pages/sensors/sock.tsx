import Layout from "~/components/layout";
import useSensorManager from "~/api/sensor/useSensorManager";
import { useState } from "react";
import { DateRangePicker, type DateRangePickerValue } from "@tremor/react";
import { getDeviceHistory } from "~/api/sensor";

const WS = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [dates, setDates] = useState<DateRangePickerValue>({
    from: yesterday,
    to: today,
  });
  const {
    data,
    error,
    loading,
    connectionStatus,
    messageHistory,
    setMessageHistory,
  } = useSensorManager("enl-iaqc-088b66", dates.from!, dates.to!);

  return (
    <Layout>
      <DateRangePicker
        className="mx-auto  max-w-md "
        value={dates}
        onValueChange={(newDates) => {
          if (!newDates.from || !newDates.to || newDates.from === newDates.to) {
            const availableDate = newDates.from || newDates.to || today;
            const startOfDay = new Date(availableDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(availableDate);
            endOfDay.setHours(23, 59, 59, 999);
            newDates.from = startOfDay;
            newDates.to = endOfDay;
          }
          setDates(newDates);
        }}
        selectPlaceholder="Select"
        maxDate={today}
        enableSelect={false}
      />
      {/* {connectionStatus} */}
      {JSON.stringify(data, null, 2)}
    </Layout>
  );
};

export default WS;
