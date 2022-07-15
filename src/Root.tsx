import { useCallback, useEffect, useMemo, useState } from "react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import LzString from "lz-string";
import "graphiql/graphiql.css";
import {
  GraphQLSchema,
  getIntrospectionQuery,
  buildClientSchema,
  IntrospectionQuery,
} from "graphql";
import { useEvent } from "./useEvent";

const useFetcher = () => {
  const fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: `https://typeofweb.eu.saleor.cloud/graphql/`,
      }),
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);

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
          setIsLoading(false);
        }
      });
    }
  }, [fetcher]);

  return { fetcher, schema, setSchema, isLoading };
};

const saveToUrl = (query: string) => {
  const queryToSaveInUrl = LzString.compressToEncodedURIComponent(query);
  window.location.hash = `saleor/${queryToSaveInUrl}`;
};
const readFromUrl = () => {
  const queryFromUrl = window.location.hash.replace(/^#saleor\//, "");
  const query = LzString.decompressFromEncodedURIComponent(queryFromUrl);
  return query;
};

const useGraphQLEditorContent = () => {
  const [query, setQuery] = useState(readFromUrl());

  const setQueryProxy = useCallback((newQuery: string) => {
    if (newQuery === query) {
      return;
    }

    saveToUrl(newQuery);
    setQuery(newQuery);
  }, []);

  return [query, setQueryProxy] as const;
};

export const Root = () => {
  const { fetcher, schema, setSchema, isLoading } = useFetcher();

  const [query, setQuery] = useGraphQLEditorContent();
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);

  const handleEditQuery = useEvent((query?: string) => {
    setQuery(query || "");
  });
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
      />
    </div>
  );
};
