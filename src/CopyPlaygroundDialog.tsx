import { Button, Dialog } from "@graphiql/react";
import { useRef } from "react";
import { useState } from "react";
import { useEvent } from "./useEvent";
import { editorContentToUrlFragment } from "./useGraphQLEditorContent";
import { editorContentToCurl } from "./curl";
import { EditorContent } from "./types";

interface CopyPlaygroundDialogProps {
  editorContent: EditorContent;
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
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
    <Dialog className="graphiql-share-link-dialog" isOpen={isOpen} onDismiss={onClose}>
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
    </Dialog>
  );
};
