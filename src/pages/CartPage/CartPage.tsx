import * as React from "react";

import { Cart } from "../../modules/cart/index";

class CartPage extends React.Component<any, any> {
  render() {
    const { location, history } = this.props;
    return <Cart history={history} isModal={false} />;
  }
}

export default CartPage;
