import "graphiql/graphiql.css";

import "./style.css";

import { explorerPlugin } from "@graphiql/plugin-explorer";
import { ToolbarButton } from "@graphiql/react";
import { GraphiQL } from "graphiql";
import { useState } from "react";

import { ArrowUpOnSquareIcon } from "./ArrowUpOnSquareIcon";
import { CopyPlaygroundDialog } from "./CopyPlaygroundDialog";
import { useFetcher } from "./useFetcher";
import { readFromUrl, useGraphQLEditorContent } from "./useGraphQLEditorContent";

const explorer = explorerPlugin({
  showAttribution: false,
});

const CopyPlaygroundToolbarButton = ({
  url,
  defaultQuery,
}: {
  readonly url: string;
  readonly defaultQuery?: string | undefined;
}) => {
  const editorContent = useGraphQLEditorContent(defaultQuery);

  const [isCopyPlaygroundDialogOpen, setIsCopyPlaygroundDialogOpen] = useState(false);
  return (
    <>
      <ToolbarButton onClick={() => setIsCopyPlaygroundDialogOpen(true)} label="Share Playground">
        <ArrowUpOnSquareIcon />
      </ToolbarButton>
      <CopyPlaygroundDialog
        isOpen={isCopyPlaygroundDialogOpen}
        onClose={() => setIsCopyPlaygroundDialogOpen(false)}
        editorContent={editorContent}
        endpoint={url}
      />
    </>
  );
};

export const Root = ({
  url,
  defaultQuery,
}: {
  readonly url: string;
  readonly defaultQuery?: string;
}) => {
  const { fetcher, schema } = useFetcher(url);

  return (
    <div className="graphiql-container">
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        plugins={[explorer]}
        shouldPersistHeaders={true}
        toolbar={{
          // additionalContent: <CopyPlaygroundToolbarButton url={url} defaultQuery={defaultQuery} />,
          additionalComponent: () => (
            <CopyPlaygroundToolbarButton url={url} defaultQuery={defaultQuery} />
          ),
        }}
        defaultQuery={defaultQuery}
      ></GraphiQL>
    </div>
  );
};
