import React from "react";
import { createRoot } from "react-dom/client";
import { Page } from "./Page";

const container = document.getElementById("root");
console.log("page");

if (container === null) {
  throw new Error("AHI");
}

const root = createRoot(container);

root.render(<Page />);
