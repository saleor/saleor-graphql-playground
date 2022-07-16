import LzString from "lz-string";
import { useState } from "react";
import { useEvent } from "./useEvent";

type EditorContent = Record<keyof typeof longKeysToShortKeys, string>;
type UseGraphQLEditorContentResult = EditorContent & {
  [K in keyof EditorContent as `set${Capitalize<K>}`]: (
    newValue?: string | undefined
  ) => void | undefined;
};
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
    stringifiedContent === "{}"
      ? ""
      : LzString.compressToEncodedURIComponent(stringifiedContent);

  window.location.hash = `saleor/${editorContentToSaveInUrl}`;
};
const readFromUrl = (): SavedEditorContent => {
  const editorContentFromUrl = window.location.hash.replace(/^#saleor\//, "");
  const editorContent = JSON.parse(
    LzString.decompressFromEncodedURIComponent(editorContentFromUrl) || "{}"
  );
  return {
    ...editorContent,
    query: "",
    headers: "",
    operationName: "",
    variables: "",
  };
};

export const useGraphQLEditorContent = (): UseGraphQLEditorContentResult => {
  const [editorContent, setEditorContent] = useState(readFromUrl());
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
  const setOperationName = useSetEditorContentField(
    longKeysToShortKeys["operationName"]
  );
  const setVariables = useSetEditorContentField(
    longKeysToShortKeys["variables"]
  );

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

function removeEmptyValues<T extends object>(editorContent: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(editorContent).filter(([, val]) => !!val)
  ) as Partial<T>;
}
