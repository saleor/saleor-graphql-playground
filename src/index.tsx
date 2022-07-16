import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Invariant from "ts-invariant";

import { Root } from "./Root";

const el = document.getElementById("root");

Invariant(el, `Missing #root element!`);

createRoot(el).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
