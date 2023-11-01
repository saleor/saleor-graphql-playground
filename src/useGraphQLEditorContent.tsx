import {
  useOperationsEditorState,
  useVariablesEditorState,
  useHeadersEditorState,
  useEditorContext,
} from "@graphiql/react";
import LzString from "lz-string";
import { useEffect, useState } from "react";

import { removeEmptyValues } from "./utils";

import type { EditorContent } from "./types";
import type { TabsState } from "@graphiql/react";

type ShorterEditorContent = Record<
  (typeof longKeysToShortKeys)[keyof typeof longKeysToShortKeys],
  string
>;

const longKeysToShortKeys = {
  query: "q",
  headers: "h",
  operationName: "o",
  variables: "v",
} as const;

export const editorContentToUrlFragment = (editorContent: EditorContent) => {
  const shorterContent: ShorterEditorContent = {
    q: editorContent.query || "",
    h: editorContent.headers || "",
    o: editorContent.operationName || "",
    v: editorContent.variables || "",
  };
  const stringifiedContent = JSON.stringify(removeEmptyValues(shorterContent));

  const editorContentToSaveInUrl =
    stringifiedContent === "{}" ? "" : LzString.compressToEncodedURIComponent(stringifiedContent);

  return `saleor/${editorContentToSaveInUrl}`;
};

export const readFromUrl = (defaultQuery = ""): EditorContent | null => {
  const editorContentFromUrl = window.location.hash.replace(/^#saleor\//, "");

  if (editorContentFromUrl.length > 0) {
    const editorContent: ShorterEditorContent = JSON.parse(
      LzString.decompressFromEncodedURIComponent(editorContentFromUrl) || "{}",
    );
    return {
      query: editorContent.q || defaultQuery,
      headers: editorContent.h || "",
      variables: editorContent.v || "",
      operationName: editorContent.o,
    };
  }
  return null;
};
export const clearUrl = () => {
  const url = new URL(window.location.toString());
  url.hash = "";
  window.history.replaceState({}, "", url.toString());
};

export const useGraphQLEditorContent = (defaultQuery?: string) => {
  const [currentQuery, setQuery] = useOperationsEditorState();
  const [, setVariables] = useVariablesEditorState();
  const [, setHeaders] = useHeadersEditorState();
  const [isInitialized, setIsInitialized] = useState(false);
  const context = useEditorContext();
  const urlData = readFromUrl(defaultQuery);
  useEffect(() => {
    if (!isInitialized && context?.queryEditor && urlData) {
      if (
        // if the current editor is currently empty or contains the exact default query (save whitespace)
        currentQuery?.trim().length === 0 ||
        currentQuery?.trim() === defaultQuery?.trim()
      ) {
        setQuery(urlData.query);
        setVariables(urlData.variables);
        setHeaders(urlData.headers);
      } else if (context.tabs?.length > 0 && urlData?.query !== currentQuery) {
        context.addTab();
        setQuery(urlData.query);
        setVariables(urlData.variables);
        setHeaders(urlData.headers);
      }
      setIsInitialized(true);
      clearUrl();
    }
  }, []);

  return {
    query: context?.queryEditor?.getValue() || "",
    variables: context?.variableEditor?.getValue() || "",
    headers: context?.headerEditor?.getValue() || "",
    operationName: "",
  };
};
