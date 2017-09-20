import ApolloClient, { createNetworkInterface } from "apollo-client";

export const GRAPHQL_URI = process.env.DEBUG_GRAPHQL
  ? "http://localhost:8000/graphql"
  : `https://shop.serga.name/graphql`;

const networkInterface = createNetworkInterface(
  {
    uri: GRAPHQL_URI,
    opts: {
      credentials: "include"  // "same-origin" or true
    }
  } as any
);

const client = new ApolloClient({
  networkInterface
});

export default client;
