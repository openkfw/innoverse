"use client";
import React from "react";
import { SWRConfig } from "swr";
export const SWRProvider = ({ children }: any) => {
  return <SWRConfig>{children}</SWRConfig>;
};
