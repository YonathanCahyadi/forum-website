import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { __graphql_server_url__ } from "../env";

const client = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createHttpLink({
      uri: __graphql_server_url__,
      headers: {
        Authorization:
          typeof window === "undefined" ? null : sessionStorage.getItem("auth") ? "Bearer " + JSON.parse(sessionStorage.getItem("auth")) : null,
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getAllThread: {
              keyArgs: false,

              merge(existing = [], incoming) {
                return [...existing, incoming];
              },
            },
          },
        },
      },
    }),
  });
};

export default client;
