import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import client from "./graphqlClient";
import cart from "./modules/cart/reducer";
import catalog from "./modules/catalog/reducer";
import layout from "./modules/layout/reducer";
import product from "./modules/product/reducer";

const apollo: any = client.reducer();
const router: any = routerReducer;

const rootReducers = combineReducers(
  {
    apollo,
    catalog,
    layout,
    product,
    router,
    cart
  } as any
);

export default rootReducers;
