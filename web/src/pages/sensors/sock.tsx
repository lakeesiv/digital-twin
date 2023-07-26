import Layout from "~/components/layout";
import useSensorManager from "~/api/sensor/useSensorManager";
import { useState } from "react";
import { DateRangePicker, type DateRangePickerValue } from "@tremor/react";

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
  } = useSensorManager("1", dates.from!, dates.to!);

  return (
    <Layout>
      <DateRangePicker
        className="mx-auto  max-w-md "
        value={dates}
        onValueChange={setDates}
        selectPlaceholder="Select"
      />
    </Layout>
  );
};

export default WS;
