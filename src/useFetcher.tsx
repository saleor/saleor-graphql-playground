import { createGraphiQLFetcher } from "@graphiql/toolkit";
import {
  GraphQLSchema,
  getIntrospectionQuery,
  buildClientSchema,
  IntrospectionQuery,
} from "graphql";
import { useMemo, useState, useEffect } from "react";

export const useFetcher = () => {
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
