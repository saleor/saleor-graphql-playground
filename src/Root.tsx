import "graphiql/graphiql.css";

import "./style.css";

import { GraphiQL } from "graphiql";

import { useFetcher } from "./useFetcher";
import { useGraphQLEditorContent } from "./useGraphQLEditorContent";
import { ToolbarButton } from "@graphiql/react";
import { ArrowUpOnSquareIcon } from "./ArrowUpOnSquareIcon";
import { CopyPlaygroundDialog } from "./CopyPlaygroundDialog";
import { useState } from "react";

export const Root = ({
  url,
  defaultQuery,
}: {
  readonly url: string;
  readonly defaultQuery?: string;
}) => {
  const { fetcher, schema } = useFetcher(url);

  const {
    editorContent,
    setQuery: handleEditQuery,
    setHeaders: handleEditHeaders,
    setOperationName: handleEditOperationName,
    setVariables: handleEditVariables,
  } = useGraphQLEditorContent(defaultQuery);

  const [isCopyPlaygroundDialogOpen, setIsCopyPlaygroundDialogOpen] = useState(false);

  return (
    <div className="graphiql-container">
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        query={editorContent.query}
        defaultQuery={editorContent.query}
        headers={editorContent.headers}
        operationName={editorContent.operationName}
        variables={editorContent.variables}
        onEditQuery={handleEditQuery}
        onEditHeaders={handleEditHeaders}
        onEditOperationName={handleEditOperationName}
        onEditVariables={handleEditVariables}
        plugins={[]}
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
      />
    </div>
  );
};
