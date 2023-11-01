import { Button, Dialog } from "@graphiql/react";
import { useRef, useState } from "react";

import { editorContentToCurl } from "./curl";
import { useEvent } from "./useEvent";
import { editorContentToUrlFragment } from "./useGraphQLEditorContent";

import type { EditorContent } from "./types";

interface CopyPlaygroundDialogProps {
  readonly editorContent: EditorContent;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly endpoint: string;
}

export const CopyPlaygroundDialog = ({
  editorContent,
  isOpen,
  onClose,
  endpoint,
}: CopyPlaygroundDialogProps) => {
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const urlElRef = useRef<HTMLInputElement>(null);
  const curlElRef = useRef<HTMLInputElement>(null);

  const editorContentToSave = {
    ...editorContent,
    headers: includeHeaders ? editorContent.headers : "",
  };
  const editorContentUrl = new URL(window.location.toString());
  editorContentUrl.hash = editorContentToUrlFragment(editorContentToSave);

  const copyURLToClipboard = useEvent(() => {
    if (!urlElRef.current) {
      return;
    }

    urlElRef.current.select();
    document.execCommand("copy");
  });

  const copyCurlToClipboard = useEvent(() => {
    if (!curlElRef.current) {
      return;
    }

    curlElRef.current.select();
    document.execCommand("copy");
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className="graphiql-share-link-dialog">
        <div className="graphiql-dialog-header">
          <div className="graphiql-dialog-title">Share playground</div>
          <Dialog.Close onClick={onClose} />
        </div>
        <div className="graphiql-dialog-section">
          <div>
            <div className="graphiql-dialog-section-title">Copy plaground URL</div>
            <div className="graphiql-dialog-section-caption">
              Includes queries and variables of each tab.
            </div>
            <div className="graphiql-dialog-section-caption">
              <label className="checkbox-container">
                <input
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.currentTarget.checked)}
                  className="graphiql-button"
                  type="checkbox"
                />{" "}
                Add headers <strong className="warning">⚠️ avoid sharing secrets.</strong>
              </label>
            </div>
            <div className="graphiql-dialog-section-caption graphiql-copy-button-section">
              <input
                aria-label="Playground URL"
                className="graphiql-button url-input"
                readOnly
                value={editorContentUrl.toString()}
                ref={urlElRef}
              />
              <Button type="button" onClick={copyURLToClipboard}>
                Copy URL
              </Button>
            </div>
            <div className="graphiql-dialog-section-caption graphiql-copy-button-section">
              <input
                aria-label="CURL URL"
                className="graphiql-button url-input"
                readOnly
                value={editorContentToCurl(editorContentToSave, endpoint)}
                ref={curlElRef}
              />
              <Button type="button" onClick={copyCurlToClipboard}>
                Copy curl
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
