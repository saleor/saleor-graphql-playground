import "graphiql/graphiql.css";

import "./style.css";

import { DOC_EXPLORER_PLUGIN, HISTORY_PLUGIN } from "@graphiql/react";
import { GraphiQL } from "graphiql";

import { useFetcher } from "./useFetcher";
import { useGraphQLEditorContent } from "./useGraphQLEditorContent";

export const Root = ({
  url,
  defaultQuery,
}: {
  readonly url: string;
  readonly defaultQuery?: string;
}) => {
  const { fetcher, schema } = useFetcher(url);

  const {
    query,
    headers,
    operationName,
    variables,
    setQuery: handleEditQuery,
    setHeaders: handleEditHeaders,
    setOperationName: handleEditOperationName,
    setVariables: handleEditVariables,
  } = useGraphQLEditorContent(defaultQuery);

  return (
    <div className="graphiql-container">
      <GraphiQL
        fetcher={fetcher}
        schema={schema}
        query={query}
        defaultQuery={query}
        headers={headers}
        operationName={operationName}
        variables={variables}
        onEditQuery={handleEditQuery}
        onEditHeaders={handleEditHeaders}
        onEditOperationName={handleEditOperationName}
        onEditVariables={handleEditVariables}
        plugins={[]}
      />
    </div>
  );
};
