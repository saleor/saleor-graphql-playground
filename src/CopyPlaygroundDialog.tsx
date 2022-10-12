import { Button, Dialog } from "@graphiql/react";
import { useRef } from "react";
import { useState } from "react";
import { useEvent } from "./useEvent";
import { EditorContent, editorContentToUrlFragment } from "./useGraphQLEditorContent";

interface CopyPlaygroundDialogProps {
  editorContent: EditorContent;
  isOpen: boolean;
  onClose: () => void;
}

export const CopyPlaygroundDialog = ({
  editorContent,
  isOpen,
  onClose,
}: CopyPlaygroundDialogProps) => {
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const urlElRef = useRef<HTMLInputElement>(null);

  const editorContentToSave = {
    ...editorContent,
    headers: includeHeaders ? editorContent.headers : "",
  };
  const editorContentUrl = new URL(window.location.toString());
  editorContentUrl.hash = editorContentToUrlFragment(editorContentToSave);

  const copyToClipboard = useEvent(() => {
    if (!urlElRef.current) {
      return;
    }

    urlElRef.current.select();
    document.execCommand("copy");
  });

  return (
    <Dialog isOpen={isOpen} onDismiss={onClose}>
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
          <div className="graphiql-dialog-section-caption">
            <input
              aria-label="Playground URL"
              className="graphiql-button url-input"
              readOnly
              value={editorContentUrl.toString()}
              ref={urlElRef}
            />
          </div>
          <div className="graphiql-dialog-section-caption">
            <Button type="button" onClick={copyToClipboard}>
              Copy URL
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
