import Link from "next/link";
import * as React from "react";

import { useTheme } from "next-themes";
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  cn,
  navigationMenuTriggerStyle,
} from "ui";

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
    href: "/digital-hospital/simulate",
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
          <Button variant="secondary" asChild>
            <Link href="/" legacyBehavior passHref>
              Digital Twin Website
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/sensors" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/sensors"
            >
              Sensors
            </NavigationMenuLink>
          </Link>
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
                href="https://lakeesiv.github.io/digital-twin-docs/docs/user-guide/intro"
              >
                User Guide for the Digital Twin Website
              </ListItem>
              <ListItem
                key="Technical Guide"
                title="Technical Guide"
                href="https://lakeesiv.github.io/digital-twin-docs/docs/category/technical-guide"
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
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default NavigationMenuDemo;