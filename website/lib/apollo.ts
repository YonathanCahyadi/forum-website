import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const client = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createHttpLink({
      uri: "http://192.168.1.110:3001/graphql",
      headers: {
        Authorization:
          typeof window === "undefined" ? null : sessionStorage.getItem("auth") ? "Bearer " + JSON.parse(sessionStorage.getItem("auth")) : null,
      },
    }),
    cache: new InMemoryCache(),
  });
};

export default client;
