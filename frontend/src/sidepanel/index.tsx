import React from "react";
import { createRoot } from "react-dom/client";
import { SidePanel } from "./SidePanel";

const container = document.getElementById("root");

if (container === null) {
  throw new Error("AHI");
}

const root = createRoot(container);

root.render(<SidePanel />);
