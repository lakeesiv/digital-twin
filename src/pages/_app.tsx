import { type AppType } from "next/app";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
};

export default MyApp;
