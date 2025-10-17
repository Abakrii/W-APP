import React, { ReactElement } from "react";
import { RenderOptions, render } from "@testing-library/react-native";

// Add custom test utilities here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react-native";

// Override render method
export { customRender as render };
