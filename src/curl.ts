import { EditorContent } from "./types";

export const editorContentToCurl = (editorContent: EditorContent, endpoint: string): string => {
  const { query, variables: variablesJson, operationName, headers: headersJson } = editorContent;
  const variables = tryJsonParse(variablesJson);
  const headers = tryJsonParse(headersJson) || ({} as Record<string, string>);
  headers["content-type"] = headers["content-type"] || "application/json";

  const dataRaw = JSON.stringify({ query, variables, operationName });

  const headersParams = Object.entries(headers).map(
    ([key, value]: [string, string]) => `-H '${key}: ${value.replaceAll("'", "\\'")}'`
  );

  return [
    `curl '${endpoint}'`,
    ...headersParams,
    `--data-raw '${dataRaw.replaceAll("'", "\\'")}'`,
    `--compressed`,
  ].join(" ");
};

export const curlToEditorContent = (_curl: string, _endpoint: string): EditorContent => {
  throw new Error(`Not implemented`);
};

const tryJsonParse = (json: string): Record<string, string> | undefined => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
};
