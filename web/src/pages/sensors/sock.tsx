import Layout from "~/components/layout";
import useSensorManager from "~/api/sensor/useSensorManager";
import { useState } from "react";
import { DateRangePicker, type DateRangePickerValue } from "@tremor/react";
import { json } from "stream/consumers";

const WS = () => {
  const [dates, setDates] = useState<DateRangePickerValue>({
    from: new Date(),
    to: new Date(),
    selectValue: "tdy",
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
        onValueChange={setDates}
        selectPlaceholder="Select"
      />
      {connectionStatus}
      {
        JSON.stringify(messageHistory, null, 2
        )
      }

    </Layout>
  );
};

export default WS;
