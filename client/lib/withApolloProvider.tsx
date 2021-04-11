import { ApolloProvider } from "@apollo/client";
import client from "./apollo";

function withApolloProvider<T>(Components: React.ComponentType<T>): React.FC {
  return (props: T) => {
    const apolloClient = client();

    return (
      <ApolloProvider client={apolloClient}>
        <Components {...props} />
      </ApolloProvider>
    );
  };
}

export default withApolloProvider;
