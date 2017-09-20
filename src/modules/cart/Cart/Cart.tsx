import * as React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose } from "redux";

import { IData } from "../../../model";
import { Loading } from "../../layout/index";
import { getCartItemTotalPrice } from "../CartItem/CartItem";
import { CartBar, CartItem } from "../index";
import { ICart, ICartItem } from "../model";

const styles = require("./styles.css");

export const CART_QUERY = require("./cart.gql");

export interface IDataCart extends IData {
  cart: ICart;
}

interface IConnectedCartProps {
  data: IDataCart;
}

export interface ICartProps {
  history: any;
}

const getCartTotalPrice = (items: [ICartItem]): number => {
  let totalPrice = 0;
  items.forEach(item => {
    const { price, amount } = item;
    totalPrice += getCartItemTotalPrice(price, amount);
  });
  return totalPrice;
};

class Cart extends React.Component<
  IConnectedCartProps & ICartProps & any,
  any
> {
  render() {
    const { history, data } = this.props;
    const cart = data.cart as ICart;
    const { loading } = data;

    if (loading === true) {
      return <Loading />;
    }

    if (!cart) {
      return (
        <div className={styles.emptyCartContainer}>
          <div>
            Cart is empty.
            <br />
            Tap to continue.
          </div>
        </div>
      );
    }

    const totalPrice = getCartTotalPrice(cart.items);

    // const productsMap = {};
    // for (const item of cart.items) {
    //   const product = client.readFragment({
    //     fragment: gql`
    //       fragment someFragment on ProductType {
    //         id
    //         name
    //         brand {
    //           name
    //         }
    //         subProducts {
    //           id
    //           article
    //           price
    //         }
    //         images {
    //           id
    //           src
    //           colorName
    //         }
    //       }
    //     `,
    //     id: `ProductType:${item.subProduct.product.id}`
    //   }) as IProduct;
    //   productsMap[product.id] = product;
    // }

    return (
      <div style={{ flex: 1 }}>
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
      </div>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

export default compose(
  connect<IConnectedCartProps, {}, ICartProps>(mapStateToProps),
  graphql(gql(CART_QUERY))
)(Cart);
