export type GraphingData = {
  title: string;
  xlabel: string;
  ylabel: string;
  data: {
    x: number[];
    y: number[];
  };
};

export type BoneStationData = {
  busy: GraphingData;
  waiting: GraphingData;
  metrics: {
    mean_busy: number;
    mean_scheduled: number;
    utilization: number;
  };
};

export type ProcessingRoomStaff = {
  waiting: GraphingData;
  metrics: {
    mean_waiting: number;
    mean_scheduled: number;
    utilization: number;
  };
};

export type SpeciminStats = {
  arrival_to_booked: number;
  booked_in_to_cutup: number;
  cutup_to_processed: number;
  tat_to_stained: number[];
};

export type WIPStats = {
  wip: GraphingData;
  in_staining: GraphingData;
};

export type DigitalHospitalData = {
  bone_station: BoneStationData;
  processing_room_staff: ProcessingRoomStaff;
  specimin_stats: SpeciminStats;
  wip_stats: WIPStats;
};
