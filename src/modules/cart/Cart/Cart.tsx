import { Flex, Icon } from "antd-mobile";
import * as React from "react";
import { gql, graphql } from "react-apollo";
import { compose } from "redux";

import { IData } from "../../../model";
import { Loading } from "../../layout/index";
import { getCartItemTotalPrice } from "../CartItem/CartItem";
import { CartBar, CartItem } from "../index";
import { ICart } from "../model";

const styles = require("./styles.css");

export let CART_QUERY = require("./cart.gql");
CART_QUERY = gql(CART_QUERY);

export interface IDataCart extends IData {
  cart: ICart;
}

interface IConnectedCartProps {
  data: IDataCart;
}

export interface ICartProps {
  history: any;
}

const getCartTotalPrice = (cart: ICart): number => {
  if (!cart) {
    return 0;
  }
  let totalPrice = 0;
  cart.items.forEach(item => {
    const { price, amount } = item;
    totalPrice += getCartItemTotalPrice(price, amount);
  });
  return totalPrice;
};

export const getCartAmount = (cart: ICart): number => {
  return cart ? cart.items.length : 0;
};

class Cart extends React.Component<
  IConnectedCartProps & ICartProps & any,
  any
> {
  back = e => {
    e.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    const { data } = this.props;
    const cart = data.cart as ICart;
    const { loading } = data;
    const totalPrice = getCartTotalPrice(cart);
    const amount = getCartAmount(cart);

    if (loading === true) {
      return <Loading />;
    }

    return (
      <div>
        {cart.items.length === 0
          ? <div onClick={this.back} className={styles.emptyCartContainer}>
              Cart is empty.
              <br />
              Tap to continue.
            </div>
          : <div style={{ flex: 1 }}>
              <div>
                {cart.items.map((item, index) =>
                  <CartItem
                    key={index}
                    // product={productsMap[item.subProduct.product.id]}
                    id={item.id}
                    subProduct={item.subProduct}
                    // colorId={cart[index].colorId}
                    price={item.price}
                    amount={item.amount}
                  />
                )}
              </div>
              <CartBar totalPrice={totalPrice} />
            </div>}
      </div>
    );
  }
}

export default compose(graphql(CART_QUERY))(Cart) as any;
