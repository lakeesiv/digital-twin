import Link from "next/link";
import { FC } from "react";
import Layout from "~/components/layout";
import { Card, Icon, Title, Text } from "@tremor/react";
import { PanelBottomInactive, PanelTopInactive, Square } from "lucide-react";

const Index: FC = ({}) => {
  return (
    <Layout title="2D Visualization">
      <div className="flex flex-col items-center space-y-4">
        <h1
          className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text pb-4 text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm "
          style={{ animationDelay: "0.20s", animationFillMode: "forwards" }}
        >
          2D Visualizer
        </h1>
        <p
          className="my-4 w-[900px] animate-fade-up pb-8 text-center text-muted-foreground/80 opacity-0 md:text-xl"
          style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
        >
          Visualize live 2D data of sensors in the IfM. Select which floor you
          want to see and the sensors will be displayed on the map.
        </p>
        <Card className="w-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/sensors/2d/all" className="flex space-x-4">
            <Icon
              color="emerald"
              variant="solid"
              icon={Square}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>Both</Title>
              <Text>Both Floors of the IfM</Text>
            </div>
          </Link>
        </Card>
        <Card className="w-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/sensors/2d/0" className="flex space-x-4">
            <Icon
              color="emerald"
              variant="solid"
              icon={PanelBottomInactive}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>Floor 0</Title>
              <Text>Bottom Floor of the IfM</Text>
            </div>
          </Link>
        </Card>
        <Card className="w-[400px] transform transition-transform duration-300 ease-in-out hover:scale-105">
          <Link href="/sensors/2d/1" className="flex space-x-4">
            <Icon
              color="emerald"
              variant="solid"
              icon={PanelTopInactive}
              className="h-12 w-12 items-center justify-center"
            />
            <div>
              <Title>Floor 1</Title>
              <Text>Top Floor of the IfM</Text>
            </div>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
