import { useEffect, useMemo, useRef, useState } from "react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import {
  GraphQLSchema,
  getIntrospectionQuery,
  buildClientSchema,
  IntrospectionQuery,
} from "graphql";
import { useEvent } from "./useEvent";

export const Root = () => {
  const fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: `https://typeofweb.eu.saleor.cloud/graphql/`,
      }),
    []
  );

  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [query, setQuery] = useState(``);
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);

  const handleEditQuery = useEvent((query?: string) => setQuery(query || ""));
  const handleToggleExplorer = useEvent(() =>
    setExplorerIsOpen((open) => !open)
  );

  const graphiqlRef = useRef<GraphiQL | null>(null);

  useEffect(() => {
    const maybePromise = fetcher(
      {
        query: getIntrospectionQuery(),
        operationName: "IntrospectionQuery",
      },
      {}
    );
    if ("then" in maybePromise) {
      maybePromise.then((result) => {
        if ("data" in result && result.data) {
          setSchema(
            buildClientSchema(result.data as unknown as IntrospectionQuery)
          );
        }
      });
    }
  }, [fetcher]);

  return (
    <div className="graphiql-container">
      <GraphiQLExplorer
        schema={schema}
        query={query}
        onEdit={handleEditQuery}
        explorerIsOpen={explorerIsOpen}
        onToggleExplorer={handleToggleExplorer}
      />
      <GraphiQL
        ref={graphiqlRef}
        fetcher={fetcher}
        schema={schema}
        query={query}
        onEditQuery={handleEditQuery}
        toolbar={{
          additionalContent: (
            <GraphiQL.Button
              onClick={handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
          ),
        }}
      ></GraphiQL>
    </div>
  );
};
