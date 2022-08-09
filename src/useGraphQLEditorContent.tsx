import LzString from "lz-string";
import { useState } from "react";

import { useEvent } from "./useEvent";
import { removeEmptyValues } from "./utils";

type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;
type UseGraphQLEditorContentResult = EditorContent &
  Record<
    `set${Capitalize<keyof EditorContent>}`,
    (newValue?: string | undefined) => void | undefined
  >;
type SavedEditorContent = Record<
  typeof longKeysToShortKeys[keyof typeof longKeysToShortKeys],
  string
>;

const longKeysToShortKeys = {
  query: "q",
  headers: "h",
  operationName: "o",
  variables: "v",
} as const;

export const saveToUrl = (editorContent: SavedEditorContent) => {
  const stringifiedContent = JSON.stringify(removeEmptyValues(editorContent));

  const editorContentToSaveInUrl =
    stringifiedContent === "{}" ? "" : LzString.compressToEncodedURIComponent(stringifiedContent);

  window.location.hash = `saleor/${editorContentToSaveInUrl}`;
};

const readFromUrl = (defaultQuery = ""): SavedEditorContent => {
  const editorContentFromUrl = window.location.hash.replace(/^#saleor\//, "");
  const editorContent = JSON.parse(
    LzString.decompressFromEncodedURIComponent(editorContentFromUrl) || "{}"
  );
  return {
    q: defaultQuery,
    h: "",
    v: "",
    o: "",
    ...editorContent,
  };
};

export const useGraphQLEditorContent = (defaultQuery?: string): UseGraphQLEditorContentResult => {
  const [editorContent, setEditorContent] = useState(readFromUrl(defaultQuery));
  const useSetEditorContentField = (fieldName: keyof SavedEditorContent) =>
    useEvent((newValue: string = "") => {
      setEditorContent((prevEditorContent) => {
        const newEditorContent = {
          ...prevEditorContent,
          [fieldName]: newValue,
        };
        saveToUrl(newEditorContent);
        return newEditorContent;
      });
    });

  const setQuery = useSetEditorContentField(longKeysToShortKeys["query"]);
  const setHeaders = useSetEditorContentField(longKeysToShortKeys["headers"]);
  const setOperationName = useSetEditorContentField(longKeysToShortKeys["operationName"]);
  const setVariables = useSetEditorContentField(longKeysToShortKeys["variables"]);

  return {
    query: editorContent[longKeysToShortKeys["query"]],
    headers: editorContent[longKeysToShortKeys["headers"]],
    operationName: editorContent[longKeysToShortKeys["operationName"]],
    variables: editorContent[longKeysToShortKeys["variables"]],
    setQuery,
    setHeaders,
    setOperationName,
    setVariables,
  };
};
