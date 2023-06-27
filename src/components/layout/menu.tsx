"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/utils/cn";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/ui/navigation-menu";
import { Button } from "~/ui/button";
import { useTheme } from "next-themes";

const components: { title: string; href: string; description: string }[] = [
  // {
  //   title: "TwinAir",
  //   href: "/twin/twinair",
  //   description: "View the current state of the TwinAir digital twin",
  // },
  {
    title: "Digital Hospital Jobs",
    href: "/digital-hospital/jobs",
    description: "View all the jobs for the Digital Hospital simulation",
  },
  {
    title: "Digital Hospital Simulation",
    href: "/digital-hospital/simulation",
    description: "Run a simulation for the Digital Hospital",
  },
  // {
  //   title: "TwinAir 2D/3D Viewer",
  //   href: "/twin/3d",
  //   description: "View the twin in a 2D or 3D viewer",
  // },
  // {
  //   title: "Digital Hospital 2D/3D Viewer",
  //   href: "/twin/3d",
  //   description: "View the twin in a 2D or 3D viewer",
  // },
];

export function NavigationMenuDemo() {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Button variant="secondary" href="/">
            Digital Twin Website
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/sensors" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sensors
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Twins</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem
                key="User Guide"
                title="User Guide"
                href="/docs/user-guide"
              >
                User Guide for the Digital Twin Website
              </ListItem>
              <ListItem
                key="Technical Guide"
                title="Technical Guide"
                href="/docs/technical-guide"
              >
                Technical documentation for the development of the Digital Twin
                Website
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button
            variant="outline"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            Toggle Theme
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default NavigationMenuDemo;
