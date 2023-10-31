import "graphiql/graphiql.css";

import "./style.css";

import { explorerPlugin } from "@graphiql/plugin-explorer";
import { ToolbarButton } from "@graphiql/react";
import { GraphiQL } from "graphiql";
import { useState } from "react";

import { ArrowUpOnSquareIcon } from "./ArrowUpOnSquareIcon";
import { CopyPlaygroundDialog } from "./CopyPlaygroundDialog";
import { useFetcher } from "./useFetcher";
import { useGraphQLEditorContent } from "./useGraphQLEditorContent";

const explorer = explorerPlugin({
  showAttribution: false,
});

export const Root = ({
  url,
  defaultQuery,
}: {
  readonly url: string;
  readonly defaultQuery?: string;
}) => {
  const { fetcher, schema } = useFetcher(url);

  const editorContent = useGraphQLEditorContent(defaultQuery);

  const [isCopyPlaygroundDialogOpen, setIsCopyPlaygroundDialogOpen] = useState(false);

  return (
    <div className="graphiql-container">
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        plugins={[explorer]}
        shouldPersistHeaders={true}
        toolbar={{
          additionalContent: (
            <>
              <ToolbarButton
                onClick={() => setIsCopyPlaygroundDialogOpen(true)}
                label="Share Playground"
              >
                <ArrowUpOnSquareIcon />
              </ToolbarButton>
            </>
          ),
        }}
      ></GraphiQL>
      <CopyPlaygroundDialog
        isOpen={isCopyPlaygroundDialogOpen}
        onClose={() => setIsCopyPlaygroundDialogOpen(false)}
        editorContent={editorContent}
        endpoint={url}
      />
    </div>
  );
};
