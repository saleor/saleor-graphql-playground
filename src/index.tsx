import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Root } from "./Root";

declare global {
  function createPlayground(
    element: Element,
    { query, endpoint }: { readonly query: string; readonly endpoint: string }
  ): void;
}

export const createPlayground = (
  element: Element,
  { query, endpoint }: { readonly query: string; readonly endpoint: string }
) => {
  createRoot(element).render(
    <StrictMode>
      <Root url={endpoint} defaultQuery={query} />
    </StrictMode>
  );
};
globalThis.createPlayground = createPlayground;
