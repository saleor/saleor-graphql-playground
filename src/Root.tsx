import "graphiql/graphiql.css";

// import "graphiql/src/css/app.css";
// import "graphiql/src/css/codemirror.css";
// import "graphiql/src/css/foldgutter.css";
// import "graphiql/src/css/info.css";
// import "graphiql/src/css/jump.css";
// import "graphiql/src/css/lint.css";
// import "graphiql/src/css/loading.css";
// import "graphiql/src/css/show-hint.css";
// import "graphiql/src/css/doc-explorer.css";
// import "graphiql/src/css/history.css";

import "./style.css";

import { GraphiQL } from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import { useState } from "react";

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
        showAttribution={false}
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
