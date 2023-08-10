import { useTheme } from "next-themes";
import Image, { ImageProps } from "next/image";

const FILTER =
  "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)";

export const OverallPlan = ({ ...props }: Partial<ImageProps>) => {
  const { theme } = useTheme();

  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
        opacity: theme === "dark" ? 0.5 : 1,
      }}
      {...props}
      src="/IfMBuildingPlans.svg"
      alt="IfMBuildingPlans"
    />
  );
};

export const Floor0 = ({ ...props }: Partial<ImageProps>) => {
  const { theme } = useTheme();

  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
        opacity: theme === "dark" ? 0.5 : 1,
      }}
      {...props}
      src="/IfMBuildingPlans_Floor0.svg"
      alt="IfMBuildingPlans_Floor0"
    />
  );
};

export const Floor1 = ({ ...props }: Partial<ImageProps>) => {
  const { theme } = useTheme();

  return (
    <Image
      width={500}
      height={500}
      style={{
        filter: FILTER,
        opacity: theme === "dark" ? 0.5 : 1,
      }}
      {...props}
      src="/IfMBuildingPlans_Floor1.svg"
      alt="IfMBuildingPlans_Floor1"
    />
  );
};
