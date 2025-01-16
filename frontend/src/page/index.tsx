import React from "react";
import { createRoot} from "react-dom/client"
import { Page } from "./Page";
import './index.css';

const getParams = (): { selectedText: string | null } => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const selectedText = searchParams.get("selected_text");
  return { selectedText }
}

const container = document.getElementById('root');
console.log("page");

if (container === null) {
  throw new Error("AHI");
}

const root = createRoot(container);
const params = getParams();

root.render(<Page {...params} />)
