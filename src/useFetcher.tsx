import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { getIntrospectionQuery, buildClientSchema } from "graphql";
import { useMemo, useState, useEffect } from "react";
import Invariant from "ts-invariant";

import type { GraphQLSchema, IntrospectionQuery, ExecutionResult } from "graphql";

export const useFetcher = (url: string) => {
  const fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url,
        fetch(input, options) {
          return fetch(input, {
            ...options,
            credentials: "include",
          });
        },
      }),
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);

  useEffect(() => {
    const run = async () => {
      const fetcherResult = await fetcher(
        {
          query: getIntrospectionQuery(),
          operationName: "IntrospectionQuery",
        },
        {}
      );

      Invariant(isExecutionResult(fetcherResult), `Unsupported data type returned from fetcher.`);
      Invariant(
        isIntrospectionQuery(fetcherResult.data),
        `Invalid IntrospectionQuery returned by fetcher.`
      );
      return fetcherResult.data;
    };
    run()
      .then((result) => {
        setSchema(buildClientSchema(result));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fetcher]);

  return { fetcher, schema, setSchema, isLoading };
};

const isExecutionResult = <T,>(val: any): val is ExecutionResult<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- typeguard
  return Boolean(val && "data" in val && "__schema" in val["data"]);
};

const isIntrospectionQuery = (val: any): val is IntrospectionQuery => {
  /* eslint-disable @typescript-eslint/no-unsafe-member-access -- typeguard */
  return Boolean(
    val &&
      "__schema" in val &&
      "directives" in val["__schema"] &&
      "mutationType" in val["__schema"] &&
      "queryType" in val["__schema"] &&
      "subscriptionType" in val["__schema"] &&
      "types" in val["__schema"]
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  );
};
