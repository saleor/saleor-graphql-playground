export function removeEmptyValues<T extends object>(editorContent: T): Partial<T> {
  return Object.fromEntries(Object.entries(editorContent).filter(([, val]) => !!val)) as Partial<T>;
}

export function removeValues<T extends object>(obj: T): Record<keyof T, ""> {
  return Object.fromEntries(Object.entries(obj).map(([key]) => [key, ""])) as Record<keyof T, "">;
}
