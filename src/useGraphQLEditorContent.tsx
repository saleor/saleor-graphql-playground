import LzString from "lz-string";
import { useState } from "react";

import { useEvent } from "./useEvent";
import { removeEmptyValues } from "./utils";

export type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;
type UseGraphQLEditorContentResult = { editorContent: EditorContent } & Record<
  `set${Capitalize<keyof EditorContent>}`,
  (newValue?: string | undefined) => void | undefined
>;
type ShorterEditorContent = Record<
  typeof longKeysToShortKeys[keyof typeof longKeysToShortKeys],
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
    q: editorContent.query,
    h: editorContent.headers,
    o: editorContent.operationName,
    v: editorContent.variables,
  };
  const stringifiedContent = JSON.stringify(removeEmptyValues(shorterContent));

  const editorContentToSaveInUrl =
    stringifiedContent === "{}" ? "" : LzString.compressToEncodedURIComponent(stringifiedContent);

  return `saleor/${editorContentToSaveInUrl}`;
};

const readFromUrl = (defaultQuery = ""): EditorContent => {
  const editorContentFromUrl = window.location.hash.replace(/^#saleor\//, "");
  const editorContent: ShorterEditorContent = JSON.parse(
    LzString.decompressFromEncodedURIComponent(editorContentFromUrl) || "{}"
  );
  return {
    query: editorContent.q || defaultQuery,
    headers: editorContent.h,
    variables: editorContent.v,
    operationName: editorContent.o,
  };
};
const clearUrl = () => {
  const url = new URL(window.location.toString());
  url.hash = "";
  window.history.replaceState({}, "", url.toString());
};

export const useGraphQLEditorContent = (defaultQuery?: string): UseGraphQLEditorContentResult => {
  const [editorContent, setEditorContent] = useState(() => {
    const content = readFromUrl(defaultQuery);
    clearUrl();
    return content;
  });
  const useSetEditorContentField = (fieldName: keyof EditorContent) =>
    useEvent((newValue: string = "") => {
      setEditorContent((prevEditorContent) => {
        const newEditorContent = {
          ...prevEditorContent,
          [fieldName]: newValue,
        };
        return newEditorContent;
      });
    });

  const setQuery = useSetEditorContentField("query");
  const setHeaders = useSetEditorContentField("headers");
  const setOperationName = useSetEditorContentField("operationName");
  const setVariables = useSetEditorContentField("variables");

  return {
    setQuery,
    setHeaders,
    setOperationName,
    setVariables,
    editorContent,
  };
};
