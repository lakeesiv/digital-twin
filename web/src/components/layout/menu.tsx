import Link from "next/link";
import * as React from "react";

import { Icon } from "@tremor/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Button,
  NavigationMenuLink,
  cn
} from "ui";

const components: { title: string; href: string }[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Sensors",
    href: "/sensors",
  },
  {
    title: "Digital Hospital",
    href: "/digital-hospital",
  }
];

export function Menu() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row py-4 w-full space-x-2">
         {
          components.map((component) => (
            <Button variant="ghost" asChild key={component.title}>
              <Link href={component.href} passHref>
                  <div className="text-sm font-medium leading-none">
                    {component.title}
                  </div>
              </Link>
            </Button>
          ))
         }
          <Button asChild variant="ghost" className="ml-auto">
            <Icon
              // variant="outline"
              icon={theme === "dark" ? MoonIcon: SunIcon}
              className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white ml-auto" 
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              Toggle Theme
            </Icon>
          </Button>
      
    </div>
  );
}

export default Menu;
