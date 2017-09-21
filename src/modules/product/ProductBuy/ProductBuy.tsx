import { Flex } from "antd-mobile";
import * as React from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import { compose } from "redux";

import { CART_QUERY, IDataCart } from "../../cart/Cart/Cart";
import { AddCartItem } from "../../cart/index";
import { Loading } from "../../layout/index";

const styles = require("./styles.css");

interface IConnectedProductBuyProps {
  data: IDataCart;
}

interface IProductBuyProps {
  subProductId: number;
  price: number;
  oldPrice?: number;
}

interface IProductBuyState {
  // inCart: boolean;
}

class ProductBuy extends React.Component<
  IConnectedProductBuyProps & IProductBuyProps,
  IProductBuyState
> {
  render() {
    const { subProductId, price, oldPrice, data } = this.props;
    const { loading, cart } = data;
    if (loading) {
      return <Loading />;
    }
    const inCart =
      cart.items.filter(
        item => parseInt(item.subProduct.id, 0) === subProductId
      ).length > 0;

    return (
      <Flex className={styles.buy}>
        <div className={styles.buyPrice}>
          {!!oldPrice
            ? <div>
                <div className={styles.currentPrice}>
                  {parseInt(String(price), 10)} грн
                </div>
                <div className={styles.oldPrice}>
                  {parseInt(String(oldPrice), 10)} грн
                </div>
              </div>
            : <div className={styles.price}>
                {parseInt(String(price), 10)} грн
              </div>}
        </div>
        {inCart
          ? <Link
              to={{
                pathname: "/cart/",
                state: { modal: true, title: "Корзина" }
              }}
            >
              В корзину
            </Link>
          : <AddCartItem subProductId={subProductId} />}
      </Flex>
    );
  }
}

export default compose<IProductBuyProps & IConnectedProductBuyProps>(
  graphql(CART_QUERY)
)(ProductBuy) as any;
