// import { type SensorData } from "./components/sensors/columns";

// function generateMockData(): SensorData[] {
//   const mockData: SensorData[] = [];
//   const locations = ["IfM", "London", "Cambridge", "Oxford", "Manchester"];
//   const batteryLevels = [100, 80, 60, 40, 20, 5];
//   const bvocLevels = ["1.402", "1.234", "1.567", "1.890", "2.345"];
//   const co2Levels = [442, 500, 600, 700, 800];
//   const co2eLevels = ["932.28", "1000.00", "1200.00", "1400.00", "1600.00"];
//   const humidityLevels = [40, 50, 60, 70, 80];
//   const iaqLevels = [93, 94, 95, 96, 97];
//   const pressureLevels = [1017, 1018, 1019, 1020, 1021];
//   const temperatureLevels = [24.1, 24.2, 24.3, 24.4, 24.5];

//   for (let i = 0; i < 60; i++) {
//     const randomLocation =
//       locations[Math.floor(Math.random() * locations.length)];
//     const randomId = "id_" + i.toString();
//     const randomBatteryLevel =
//       batteryLevels[Math.floor(Math.random() * batteryLevels.length)];
//     const randomBvocLevel =
//       bvocLevels[Math.floor(Math.random() * bvocLevels.length)];
//     const randomCo2Level =
//       co2Levels[Math.floor(Math.random() * co2Levels.length)];
//     const randomCo2eLevel =
//       co2eLevels[Math.floor(Math.random() * co2eLevels.length)];
//     const randomHumidityLevel =
//       humidityLevels[Math.floor(Math.random() * humidityLevels.length)];
//     const randomIaqLevel =
//       iaqLevels[Math.floor(Math.random() * iaqLevels.length)];
//     const randomPressureLevel =
//       pressureLevels[Math.floor(Math.random() * pressureLevels.length)];
//     const randomTemperatureLevel =
//       temperatureLevels[Math.floor(Math.random() * temperatureLevels.length)];
//     const randomTimestamp = Math.floor(Math.random() * 10000000000).toString();

//     mockData.push({
//       id: randomId as string,
//       location: randomLocation as string,
//       lastUpdateTimestamp: randomTimestamp,
//       lastReading: {
//         battery: randomBatteryLevel as number,
//         bvoc: randomBvocLevel,
//         co2_ppm: randomCo2Level,
//         co2e_ppm: randomCo2eLevel,
//         humidity: randomHumidityLevel,
//         iaq: randomIaqLevel,
//         pressure_mbar: randomPressureLevel,
//         temperature: randomTemperatureLevel,
//         acp_id: randomId,
//         acp_ts: parseInt(randomTimestamp),
//       },
//     });
//   }

//   return mockData;
// }

const extraData = [
  {
    id: "id_0",
    location: "IfM",
    lastUpdateTimestamp: "6834407086",
    lastReading: {
      battery: 60,
      bvoc: "1.567",
      co2_ppm: 500,
      co2e_ppm: "1000.00",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1018,
      temperature: 24.1,
      acp_id: "id_0",
      acp_ts: 6834407086,
    },
  },
  {
    id: "id_1",
    location: "Cambridge",
    lastUpdateTimestamp: "7955826688",
    lastReading: {
      battery: 100,
      bvoc: "1.890",
      co2_ppm: 442,
      co2e_ppm: "1400.00",
      humidity: 80,
      iaq: 96,
      pressure_mbar: 1021,
      temperature: 24.1,
      acp_id: "id_1",
      acp_ts: 7955826688,
    },
  },
  {
    id: "id_2",
    location: "London",
    lastUpdateTimestamp: "1259378327",
    lastReading: {
      battery: 80,
      bvoc: "1.567",
      co2_ppm: 500,
      co2e_ppm: "932.28",
      humidity: 50,
      iaq: 97,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_2",
      acp_ts: 1259378327,
    },
  },
  {
    id: "id_3",
    location: "Cambridge",
    lastUpdateTimestamp: "2110902996",
    lastReading: {
      battery: 40,
      bvoc: "1.567",
      co2_ppm: 442,
      co2e_ppm: "1000.00",
      humidity: 50,
      iaq: 97,
      pressure_mbar: 1017,
      temperature: 24.5,
      acp_id: "id_3",
      acp_ts: 2110902996,
    },
  },
  {
    id: "id_4",
    location: "Oxford",
    lastUpdateTimestamp: "7190980854",
    lastReading: {
      battery: 20,
      bvoc: "1.890",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 94,
      pressure_mbar: 1020,
      temperature: 24.5,
      acp_id: "id_4",
      acp_ts: 7190980854,
    },
  },
  {
    id: "id_5",
    location: "Oxford",
    lastUpdateTimestamp: "4511814616",
    lastReading: {
      battery: 80,
      bvoc: "1.890",
      co2_ppm: 600,
      co2e_ppm: "932.28",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1018,
      temperature: 24.3,
      acp_id: "id_5",
      acp_ts: 4511814616,
    },
  },
  {
    id: "id_6",
    location: "IfM",
    lastUpdateTimestamp: "5413395034",
    lastReading: {
      battery: 80,
      bvoc: "1.890",
      co2_ppm: 500,
      co2e_ppm: "1200.00",
      humidity: 60,
      iaq: 93,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_6",
      acp_ts: 5413395034,
    },
  },
  {
    id: "id_7",
    location: "IfM",
    lastUpdateTimestamp: "6297490370",
    lastReading: {
      battery: 20,
      bvoc: "2.345",
      co2_ppm: 442,
      co2e_ppm: "1600.00",
      humidity: 40,
      iaq: 94,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_7",
      acp_ts: 6297490370,
    },
  },
  {
    id: "id_8",
    location: "Cambridge",
    lastUpdateTimestamp: "87371457",
    lastReading: {
      battery: 60,
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 96,
      pressure_mbar: 1020,
      temperature: 24.5,
      acp_id: "id_8",
      acp_ts: 87371457,
    },
  },
  {
    id: "id_9",
    location: "Oxford",
    lastUpdateTimestamp: "409952503",
    lastReading: {
      battery: 40,
      bvoc: "2.345",
      co2_ppm: 800,
      co2e_ppm: "1200.00",
      humidity: 80,
      iaq: 93,
      pressure_mbar: 1021,
      temperature: 24.5,
      acp_id: "id_9",
      acp_ts: 409952503,
    },
  },
  {
    id: "id_10",
    location: "London",
    lastUpdateTimestamp: "1393052136",
    lastReading: {
      battery: 20,
      bvoc: "1.234",
      co2_ppm: 700,
      co2e_ppm: "1000.00",
      humidity: 50,
      iaq: 95,
      pressure_mbar: 1019,
      temperature: 24.3,
      acp_id: "id_10",
      acp_ts: 1393052136,
    },
  },
  {
    id: "id_11",
    location: "IfM",
    lastUpdateTimestamp: "228210011",
    lastReading: {
      battery: 60,
      bvoc: "1.402",
      co2_ppm: 500,
      co2e_ppm: "1600.00",
      humidity: 60,
      iaq: 95,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_11",
      acp_ts: 228210011,
    },
  },
  {
    id: "id_12",
    location: "Cambridge",
    lastUpdateTimestamp: "8395719765",
    lastReading: {
      battery: 80,
      bvoc: "1.402",
      co2_ppm: 700,
      co2e_ppm: "1000.00",
      humidity: 40,
      iaq: 94,
      pressure_mbar: 1018,
      temperature: 24.4,
      acp_id: "id_12",
      acp_ts: 8395719765,
    },
  },
  {
    id: "id_13",
    location: "Manchester",
    lastUpdateTimestamp: "7153158473",
    lastReading: {
      battery: 40,
      bvoc: "1.402",
      co2_ppm: 700,
      co2e_ppm: "932.28",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1021,
      temperature: 24.3,
      acp_id: "id_13",
      acp_ts: 7153158473,
    },
  },
  {
    id: "id_14",
    location: "Manchester",
    lastUpdateTimestamp: "2872218850",
    lastReading: {
      battery: 60,
      bvoc: "1.890",
      co2_ppm: 442,
      co2e_ppm: "1400.00",
      humidity: 80,
      iaq: 94,
      pressure_mbar: 1020,
      temperature: 24.2,
      acp_id: "id_14",
      acp_ts: 2872218850,
    },
  },
  {
    id: "id_15",
    location: "Oxford",
    lastUpdateTimestamp: "6524355183",
    lastReading: {
      battery: 40,
      bvoc: "1.890",
      co2_ppm: 500,
      co2e_ppm: "1200.00",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.2,
      acp_id: "id_15",
      acp_ts: 6524355183,
    },
  },
  {
    id: "id_16",
    location: "Oxford",
    lastUpdateTimestamp: "7117024584",
    lastReading: {
      battery: 60,
      bvoc: "1.567",
      co2_ppm: 700,
      co2e_ppm: "1200.00",
      humidity: 60,
      iaq: 96,
      pressure_mbar: 1018,
      temperature: 24.1,
      acp_id: "id_16",
      acp_ts: 7117024584,
    },
  },
  {
    id: "id_17",
    location: "London",
    lastUpdateTimestamp: "5921382462",
    lastReading: {
      battery: 70,
      bvoc: "1.234",
      co2_ppm: 700,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 96,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "id_17",
      acp_ts: 5921382462,
    },
  },
  {
    id: "id_18",
    location: "London",
    lastUpdateTimestamp: "7064079291",
    lastReading: {
      battery: 75,
      bvoc: "1.890",
      co2_ppm: 800,
      co2e_ppm: "1200.00",
      humidity: 80,
      iaq: 94,
      pressure_mbar: 1017,
      temperature: 24.4,
      acp_id: "id_18",
      acp_ts: 7064079291,
    },
  },
  {
    id: "id_19",
    location: "Manchester",
    lastUpdateTimestamp: "9282364201",
    lastReading: {
      battery: 60,
      bvoc: "2.345",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 97,
      pressure_mbar: 1017,
      temperature: 24.4,
      acp_id: "id_19",
      acp_ts: 9282364201,
    },
  },
  {
    id: "id_20",
    location: "London",
    lastUpdateTimestamp: "5651751179",
    lastReading: {
      battery: 40,
      bvoc: "1.567",
      co2_ppm: 700,
      co2e_ppm: "1600.00",
      humidity: 70,
      iaq: 94,
      pressure_mbar: 1017,
      temperature: 24.2,
      acp_id: "id_20",
      acp_ts: 5651751179,
    },
  },
  {
    id: "id_21",
    location: "London",
    lastUpdateTimestamp: "3289629671",
    lastReading: {
      battery: 80,
      bvoc: "2.345",
      co2_ppm: 442,
      co2e_ppm: "1000.00",
      humidity: 60,
      iaq: 94,
      pressure_mbar: 1021,
      temperature: 24.4,
      acp_id: "id_21",
      acp_ts: 3289629671,
    },
  },
  {
    id: "id_22",
    location: "Cambridge",
    lastUpdateTimestamp: "7620464693",
    lastReading: {
      battery: 100,
      bvoc: "2.345",
      co2_ppm: 700,
      co2e_ppm: "1200.00",
      humidity: 40,
      iaq: 96,
      pressure_mbar: 1020,
      temperature: 24.2,
      acp_id: "id_22",
      acp_ts: 7620464693,
    },
  },
  {
    id: "id_23",
    location: "Oxford",
    lastUpdateTimestamp: "4669287968",
    lastReading: {
      battery: 75,
      bvoc: "1.402",
      co2_ppm: 700,
      co2e_ppm: "1600.00",
      humidity: 60,
      iaq: 94,
      pressure_mbar: 1021,
      temperature: 24.1,
      acp_id: "id_23",
      acp_ts: 4669287968,
    },
  },
  {
    id: "id_24",
    location: "Oxford",
    lastUpdateTimestamp: "6164173754",
    lastReading: {
      battery: 80,
      bvoc: "1.234",
      co2_ppm: 500,
      co2e_ppm: "1000.00",
      humidity: 50,
      iaq: 95,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_24",
      acp_ts: 6164173754,
    },
  },
  {
    id: "id_25",
    location: "IfM",
    lastUpdateTimestamp: "9071489270",
    lastReading: {
      battery: 75,
      bvoc: "1.234",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 96,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_25",
      acp_ts: 9071489270,
    },
  },
  {
    id: "id_26",
    location: "IfM",
    lastUpdateTimestamp: "6580565975",
    lastReading: {
      battery: 80,
      bvoc: "2.345",
      co2_ppm: 700,
      co2e_ppm: "1000.00",
      humidity: 80,
      iaq: 94,
      pressure_mbar: 1021,
      temperature: 24.4,
      acp_id: "id_26",
      acp_ts: 6580565975,
    },
  },
  {
    id: "id_27",
    location: "Oxford",
    lastUpdateTimestamp: "1677808750",
    lastReading: {
      battery: 40,
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 40,
      iaq: 95,
      pressure_mbar: 1017,
      temperature: 24.4,
      acp_id: "id_27",
      acp_ts: 1677808750,
    },
  },
  {
    id: "id_28",
    location: "Oxford",
    lastUpdateTimestamp: "5486215765",
    lastReading: {
      battery: 60,
      bvoc: "1.567",
      co2_ppm: 500,
      co2e_ppm: "1200.00",
      humidity: 50,
      iaq: 96,
      pressure_mbar: 1020,
      temperature: 24.2,
      acp_id: "id_28",
      acp_ts: 5486215765,
    },
  },
  {
    id: "id_29",
    location: "Cambridge",
    lastUpdateTimestamp: "4587089287",
    lastReading: {
      battery: 60,
      bvoc: "2.345",
      co2_ppm: 500,
      co2e_ppm: "932.28",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_29",
      acp_ts: 4587089287,
    },
  },
  {
    id: "id_30",
    location: "Cambridge",
    lastUpdateTimestamp: "3322256006",
    lastReading: {
      battery: 60,
      bvoc: "1.402",
      co2_ppm: 600,
      co2e_ppm: "1200.00",
      humidity: 70,
      iaq: 93,
      pressure_mbar: 1018,
      temperature: 24.2,
      acp_id: "id_30",
      acp_ts: 3322256006,
    },
  },
  {
    id: "id_31",
    location: "London",
    lastUpdateTimestamp: "444427388",
    lastReading: {
      battery: 40,
      bvoc: "2.345",
      co2_ppm: 500,
      co2e_ppm: "1000.00",
      humidity: 70,
      iaq: 94,
      pressure_mbar: 1017,
      temperature: 24.3,
      acp_id: "id_31",
      acp_ts: 444427388,
    },
  },
  {
    id: "id_32",
    location: "IfM",
    lastUpdateTimestamp: "464236568",
    lastReading: {
      battery: 40,
      bvoc: "1.567",
      co2_ppm: 442,
      co2e_ppm: "1200.00",
      humidity: 80,
      iaq: 96,
      pressure_mbar: 1017,
      temperature: 24.2,
      acp_id: "id_32",
      acp_ts: 464236568,
    },
  },
  {
    id: "id_33",
    location: "Manchester",
    lastUpdateTimestamp: "306672287",
    lastReading: {
      battery: 20,
      bvoc: "1.890",
      co2_ppm: 442,
      co2e_ppm: "1600.00",
      humidity: 70,
      iaq: 94,
      pressure_mbar: 1019,
      temperature: 24.2,
      acp_id: "id_33",
      acp_ts: 306672287,
    },
  },
  {
    id: "id_34",
    location: "Oxford",
    lastUpdateTimestamp: "9079003782",
    lastReading: {
      battery: 75,
      bvoc: "1.234",
      co2_ppm: 800,
      co2e_ppm: "1200.00",
      humidity: 50,
      iaq: 95,
      pressure_mbar: 1019,
      temperature: 24.1,
      acp_id: "id_34",
      acp_ts: 9079003782,
    },
  },
  {
    id: "id_35",
    location: "London",
    lastUpdateTimestamp: "264658393",
    lastReading: {
      battery: 40,
      bvoc: "1.890",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 97,
      pressure_mbar: 1017,
      temperature: 24.4,
      acp_id: "id_35",
      acp_ts: 264658393,
    },
  },
  {
    id: "id_36",
    location: "Cambridge",
    lastUpdateTimestamp: "7062289225",
    lastReading: {
      battery: 75,
      bvoc: "2.345",
      co2_ppm: 800,
      co2e_ppm: "932.28",
      humidity: 70,
      iaq: 97,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "id_36",
      acp_ts: 7062289225,
    },
  },
  {
    id: "id_37",
    location: "Manchester",
    lastUpdateTimestamp: "3822455658",
    lastReading: {
      battery: 60,
      bvoc: "1.402",
      co2_ppm: 800,
      co2e_ppm: "932.28",
      humidity: 50,
      iaq: 94,
      pressure_mbar: 1018,
      temperature: 24.1,
      acp_id: "id_37",
      acp_ts: 3822455658,
    },
  },
  {
    id: "id_38",
    location: "Cambridge",
    lastUpdateTimestamp: "3424406892",
    lastReading: {
      battery: 40,
      bvoc: "1.234",
      co2_ppm: 500,
      co2e_ppm: "932.28",
      humidity: 70,
      iaq: 97,
      pressure_mbar: 1018,
      temperature: 24.4,
      acp_id: "id_38",
      acp_ts: 3424406892,
    },
  },
  {
    id: "id_39",
    location: "IfM",
    lastUpdateTimestamp: "6921331390",
    lastReading: {
      battery: 100,
      bvoc: "2.345",
      co2_ppm: 800,
      co2e_ppm: "1600.00",
      humidity: 70,
      iaq: 93,
      pressure_mbar: 1020,
      temperature: 24.3,
      acp_id: "id_39",
      acp_ts: 6921331390,
    },
  },
  {
    id: "id_40",
    location: "Manchester",
    lastUpdateTimestamp: "2321558059",
    lastReading: {
      battery: 100,
      bvoc: "1.402",
      co2_ppm: 500,
      co2e_ppm: "1200.00",
      humidity: 80,
      iaq: 95,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "id_40",
      acp_ts: 2321558059,
    },
  },
  {
    id: "id_41",
    location: "Oxford",
    lastUpdateTimestamp: "3409708438",
    lastReading: {
      battery: 80,
      bvoc: "1.402",
      co2_ppm: 800,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 93,
      pressure_mbar: 1020,
      temperature: 24.2,
      acp_id: "id_41",
      acp_ts: 3409708438,
    },
  },
  {
    id: "id_42",
    location: "Cambridge",
    lastUpdateTimestamp: "100516117",
    lastReading: {
      battery: 75,
      bvoc: "1.402",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 60,
      iaq: 94,
      pressure_mbar: 1017,
      temperature: 24.1,
      acp_id: "id_42",
      acp_ts: 100516117,
    },
  },
  {
    id: "id_43",
    location: "Manchester",
    lastUpdateTimestamp: "8374222303",
    lastReading: {
      battery: 75,
      bvoc: "1.234",
      co2_ppm: 800,
      co2e_ppm: "1600.00",
      humidity: 50,
      iaq: 96,
      pressure_mbar: 1021,
      temperature: 24.5,
      acp_id: "id_43",
      acp_ts: 8374222303,
    },
  },
  {
    id: "id_44",
    location: "Manchester",
    lastUpdateTimestamp: "8917422057",
    lastReading: {
      battery: 20,
      bvoc: "2.345",
      co2_ppm: 600,
      co2e_ppm: "932.28",
      humidity: 80,
      iaq: 97,
      pressure_mbar: 1020,
      temperature: 24.4,
      acp_id: "id_44",
      acp_ts: 8917422057,
    },
  },
  {
    id: "id_45",
    location: "Cambridge",
    lastUpdateTimestamp: "520888429",
    lastReading: {
      battery: 20,
      bvoc: "1.567",
      co2_ppm: 700,
      co2e_ppm: "1200.00",
      humidity: 60,
      iaq: 94,
      pressure_mbar: 1019,
      temperature: 24.3,
      acp_id: "id_45",
      acp_ts: 520888429,
    },
  },
  {
    id: "id_46",
    location: "London",
    lastUpdateTimestamp: "7873885056",
    lastReading: {
      battery: 75,
      bvoc: "1.402",
      co2_ppm: 600,
      co2e_ppm: "1400.00",
      humidity: 70,
      iaq: 97,
      pressure_mbar: 1020,
      temperature: 24.3,
      acp_id: "id_46",
      acp_ts: 7873885056,
    },
  },
  {
    id: "id_47",
    location: "Oxford",
    lastUpdateTimestamp: "5205144086",
    lastReading: {
      battery: 40,
      bvoc: "1.402",
      co2_ppm: 800,
      co2e_ppm: "1000.00",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1019,
      temperature: 24.4,
      acp_id: "id_47",
      acp_ts: 5205144086,
    },
  },
  {
    id: "id_48",
    location: "London",
    lastUpdateTimestamp: "999009974",
    lastReading: {
      battery: 60,
      bvoc: "1.402",
      co2_ppm: 442,
      co2e_ppm: "932.28",
      humidity: 60,
      iaq: 97,
      pressure_mbar: 1019,
      temperature: 24.1,
      acp_id: "id_48",
      acp_ts: 999009974,
    },
  },
  {
    id: "id_49",
    location: "Cambridge",
    lastUpdateTimestamp: "5673893239",
    lastReading: {
      battery: 80,
      bvoc: "1.567",
      co2_ppm: 500,
      co2e_ppm: "1400.00",
      humidity: 40,
      iaq: 97,
      pressure_mbar: 1021,
      temperature: 24.5,
      acp_id: "id_49",
      acp_ts: 5673893239,
    },
  },
  {
    id: "id_50",
    location: "IfM",
    lastUpdateTimestamp: "8730274122",
    lastReading: {
      battery: 100,
      bvoc: "1.402",
      co2_ppm: 800,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 97,
      pressure_mbar: 1021,
      temperature: 24.4,
      acp_id: "id_50",
      acp_ts: 8730274122,
    },
  },
  {
    id: "id_51",
    location: "Oxford",
    lastUpdateTimestamp: "1135319389",
    lastReading: {
      battery: 80,
      bvoc: "1.890",
      co2_ppm: 800,
      co2e_ppm: "1000.00",
      humidity: 50,
      iaq: 93,
      pressure_mbar: 1019,
      temperature: 24.3,
      acp_id: "id_51",
      acp_ts: 1135319389,
    },
  },
  {
    id: "id_52",
    location: "Cambridge",
    lastUpdateTimestamp: "6033601934",
    lastReading: {
      battery: 60,
      bvoc: "1.234",
      co2_ppm: 600,
      co2e_ppm: "1400.00",
      humidity: 50,
      iaq: 97,
      pressure_mbar: 1019,
      temperature: 24.2,
      acp_id: "id_52",
      acp_ts: 6033601934,
    },
  },
  {
    id: "id_53",
    location: "Oxford",
    lastUpdateTimestamp: "5187405617",
    lastReading: {
      battery: 60,
      bvoc: "1.567",
      co2_ppm: 700,
      co2e_ppm: "1000.00",
      humidity: 40,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.3,
      acp_id: "id_53",
      acp_ts: 5187405617,
    },
  },
  {
    id: "id_54",
    location: "London",
    lastUpdateTimestamp: "1333608408",
    lastReading: {
      battery: 5,
      bvoc: "2.345",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 80,
      iaq: 93,
      pressure_mbar: 1017,
      temperature: 24.5,
      acp_id: "id_54",
      acp_ts: 1333608408,
    },
  },
  {
    id: "id_55",
    location: "London",
    lastUpdateTimestamp: "288885250",
    lastReading: {
      battery: 60,
      bvoc: "1.890",
      co2_ppm: 442,
      co2e_ppm: "1400.00",
      humidity: 70,
      iaq: 96,
      pressure_mbar: 1017,
      temperature: 24.4,
      acp_id: "id_55",
      acp_ts: 288885250,
    },
  },
  {
    id: "id_56",
    location: "Oxford",
    lastUpdateTimestamp: "2201000164",
    lastReading: {
      battery: 80,
      bvoc: "1.402",
      co2_ppm: 700,
      co2e_ppm: "1200.00",
      humidity: 40,
      iaq: 95,
      pressure_mbar: 1020,
      temperature: 24.2,
      acp_id: "id_56",
      acp_ts: 2201000164,
    },
  },
  {
    id: "id_57",
    location: "Oxford",
    lastUpdateTimestamp: "3175686031",
    lastReading: {
      battery: 60,
      bvoc: "2.345",
      co2_ppm: 800,
      co2e_ppm: "1200.00",
      humidity: 40,
      iaq: 94,
      pressure_mbar: 1017,
      temperature: 24.5,
      acp_id: "id_57",
      acp_ts: 3175686031,
    },
  },
  {
    id: "id_58",
    location: "London",
    lastUpdateTimestamp: "897864579",
    lastReading: {
      battery: 5,
      bvoc: "2.345",
      co2_ppm: 600,
      co2e_ppm: "1200.00",
      humidity: 40,
      iaq: 94,
      pressure_mbar: 1019,
      temperature: 24.1,
      acp_id: "id_58",
      acp_ts: 897864579,
    },
  },
  {
    id: "id_59",
    location: "IfM",
    lastUpdateTimestamp: "4188675085",
    lastReading: {
      battery: 20,
      bvoc: "1.234",
      co2_ppm: 600,
      co2e_ppm: "1600.00",
      humidity: 50,
      iaq: 96,
      pressure_mbar: 1018,
      temperature: 24.1,
      acp_id: "id_59",
      acp_ts: 4188675085,
    },
  },
];

// data = data.concat(extraData);

export default extraData;
