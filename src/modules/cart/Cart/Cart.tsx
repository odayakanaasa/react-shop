import * as React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose } from "redux";

import { IData } from "../../../model";
import { Loading } from "../../layout/index";
import { getCartItemTotalPrice } from "../CartItem/CartItem";
import { CartItem, CheckoutTrigger } from "../index";
import { ICart } from "../model";

const styles = require("./styles.css");

export const CART_QUERY = gql(require("./cart.gql"));

export interface IDataCart extends IData {
  cart: ICart;
}

interface IConnectedCartProps {
  data: IDataCart;
}

export interface ICartProps {
  history: any;
  location: any;
  isModal: boolean;
}

const getCartTotalPrice = (cart: ICart): number => {
  let totalPrice = 0;
  if (cart && cart.items) {
    cart.items.forEach(item => {
      const { price, amount } = item;
      totalPrice += getCartItemTotalPrice(price, amount);
    });
  }
  return totalPrice;
};

export const getCartAmount = (cart: ICart): number => {
  return cart && cart.items ? cart.items.length : 0;
};

class Cart extends React.Component<
  IConnectedCartProps & ICartProps & any,
  any
> {
  handleClick = e => {
    e.stopPropagation();
    const { isModal } = this.props;
    if (isModal) {
      this.props.history.goBack();
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    const { data } = this.props;
    const { loading } = data;
    if (loading === true) {
      return <Loading />;
    }
    const cart = data.cart as ICart;
    const totalPrice = getCartTotalPrice(cart);
    const amount = getCartAmount(cart);
    return (
      <div className={styles.cart}>
        {cart && cart.items && cart.items.length > 0
          ? <div>
              <div className={styles.cartItems}>
                {(cart as any).items.map((item, index) =>
                  <CartItem
                    key={index}
                    // product={productsMap[item.subProduct.product.id]}
                    id={item.id}
                    subProduct={item.subProduct}
                    // colorId={cart[index].colorId}
                    price={item.price}
                    // oldPrice={item.oldPrice}
                    oldPrice={0}
                    amount={item.amount}
                  />
                )}
              </div>
              <CheckoutTrigger totalPrice={totalPrice} />
            </div>
          : <div onClick={this.handleClick} className={styles.emptyCart}>
              <img
                className={styles.emptyCartImage}
                src={require("./sad_smile.png")}
              />
              <div className={styles.emptyCartTitle}>Корзина пуста</div>
              <div className={styles.emptyCartContinue}>
                нажмите чтобы продолжить
              </div>
            </div>}
      </div>
    );
  }
}

export default compose(graphql(CART_QUERY))(Cart) as any;
