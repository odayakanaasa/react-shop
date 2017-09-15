import * as React from "react";

import { Cart } from "../../modules/cart/index";

class CartPage extends React.Component<any, any> {
  render() {
    const { match } = this.props;
    return <Cart history={null}  />;
  }
}

export default CartPage;
