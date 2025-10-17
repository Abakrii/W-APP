import React, { ReactElement } from "react";
import {
  RenderOptions,
  render as rtlRender,
} from "@testing-library/react-native";

// Simple wrapper that avoids complex React Native dependencies
const SimpleWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return rtlRender(ui, { wrapper: SimpleWrapper, ...options });
};

export * from "@testing-library/react-native";
