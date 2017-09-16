import ApolloClient, { createNetworkInterface } from "apollo-client";

export const GRAPHQL_URI = process.env.DEBUG_GRAPHQL
  ? "http://localhost:8000/graphql"
  : `https://shop.serga.name/graphql`;

const networkInterface = createNetworkInterface(
  {
    uri: GRAPHQL_URI,
    opts: {
      credentials: true
    },
    options: {
      credentials: true
    }
  } as any
);

// networkInterface.use([
//   {
//     applyMiddleware(request, next) {
//       if (!request.options.headers) {
//         request.options.headers = new Headers();
//       }
//       request.options.headers["User-Agent"] = "test";
//       next();
//     }
//   }
// ]);

networkInterface.useAfter([
  {
    applyAfterware({ response }, next) {
      // tslint:disable-next-line
      // document.cookie = "csrftoken=9jInAHWHcI4ahfOhfCywdFJXPbPtCdRa; expires=Sat, 15-Sep-2018 10:45:52 GMT; Max-Age=31449600; Path=/";
      // tslint:disable-next-line
      // document.cookie = "sessionid=10y3k8dn97teljfxrmt1cmmmzg4zvrxh; expires=Sat, 30-Sep-2017 17:33:59 GMT; httponly; Max-Age=1209600; Path=/";
      next();
    }
  }
]);

const client = new ApolloClient({
  networkInterface
});

export default client;
