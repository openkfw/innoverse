"use client";
import React from "react";

import theme from "../styles/theme";
import { SWRProvider } from "./swr-provider";

import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";

const metadata: Metadata = {
  title: "InnoBuddy",
  viewport: { width: "device-width", initialScale: 1 },
  themeColor: theme.palette.primary.main,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SWRProvider>
          <ThemeRegistry options={{ key: "mui" }}>
            {children}
            </ThemeRegistry>
        </SWRProvider>
      </body>
    </html>
  );
}
