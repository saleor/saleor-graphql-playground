import { useState } from "react";
import { GraphiQL } from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";

import "graphiql/graphiql.css";
import { useEvent } from "./useEvent";
import { useFetcher } from "./useFetcher";
import { useGraphQLEditorContent } from "./useGraphQLEditorContent";

export const Root = () => {
  const { fetcher, schema, setSchema: _, isLoading } = useFetcher();

  const {
    query,
    headers,
    operationName,
    variables,
    setQuery: handleEditQuery,
    setHeaders: handleEditHeaders,
    setOperationName: handleEditOperationName,
    setVariables: handleEditVariables,
  } = useGraphQLEditorContent();
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);

  const handleToggleExplorer = useEvent(() =>
    setExplorerIsOpen((open) => !open)
  );

  return (
    <div
      className="graphiql-container"
      style={{ opacity: isLoading ? 0.3 : 1 }}
    >
      <GraphiQLExplorer
        schema={schema}
        query={query}
        onEdit={handleEditQuery}
        explorerIsOpen={explorerIsOpen}
        onToggleExplorer={handleToggleExplorer}
      />
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        query={query}
        headers={headers}
        operationName={operationName}
        variables={variables}
        onEditQuery={handleEditQuery}
        onEditHeaders={handleEditHeaders}
        onEditOperationName={handleEditOperationName}
        onEditVariables={handleEditVariables}
        toolbar={{
          additionalContent: (
            <GraphiQL.Button
              onClick={handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
          ),
        }}
      />
    </div>
  );
};
