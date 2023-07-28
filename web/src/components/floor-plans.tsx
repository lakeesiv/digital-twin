import Image, { ImageProps } from "next/image";

const FILTER =
  "invert(94%) sepia(8%) saturate(140%) hue-rotate(177deg) brightness(89%) contrast(94%)";

export const OverallPlan = ({ ...props }: Partial<ImageProps>) => {
  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
      }}
      {...props}
      src="/IfMBuildingPlans.svg"
      alt="IfMBuildingPlans"
    />
  );
};

export const Floor0 = ({ ...props }: Partial<ImageProps>) => {
  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
      }}
      {...props}
      src="/IfMBuildingPlans_Floor0.svg"
      alt="IfMBuildingPlans_Floor0"
    />
  );
};

export const Floor1 = ({ ...props }: Partial<ImageProps>) => {
  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
      }}
      {...props}
      src="/IfMBuildingPlans_Floor1.svg"
      alt="IfMBuildingPlans_Floor1"
    />
  );
};
