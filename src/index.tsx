import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Invariant from "ts-invariant";

import { Root } from "./Root";

declare global {
  function createPlayground(selector: string, url: string): void;
}

export const createPlayground = (selector: string, url: string) => {
  const el = document.querySelector(selector);

  Invariant(el, `Missing ${selector} element!`);

  createRoot(el).render(
    <StrictMode>
      <Root url={url} />
    </StrictMode>
  );
};
globalThis.createPlayground = createPlayground;
