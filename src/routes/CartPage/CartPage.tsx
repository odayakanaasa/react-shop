import { Cart } from "@src/modules/cart";
import { Layout } from "@src/modules/layout";
import { PATH_NAMES } from "@src/routes";
import * as React from "react";

import { IPage } from "../interfaces";

const styles = require("./styles.css");

interface OwnProps extends IPage {}

class CartPage extends React.Component<OwnProps, {}> {
  getLayoutOptions = () => {
    const { history, location } = this.props;
    return {
      location,
      history,
      header: {
        title: "Корзина",
        // right: null
      },
      footer: null
    };
  };

  render() {
    const { location, history } = this.props;
    return (
      <Layout {...this.getLayoutOptions()}>
        <div className={styles.CartPage}>
          <Cart history={history} isModal={false} />
        </div>
      </Layout>
    );
  }
}

export default CartPage;
