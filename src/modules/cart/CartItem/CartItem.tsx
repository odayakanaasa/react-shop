import { WhiteSpace, WingBlank } from "antd-mobile";
import React from "react";
import { Dispatch } from "redux";

import { ISubProduct } from "../../product/model";
import { RemoveCartItem, UpdateCartItem } from "../index";
import { ICartItem } from "../model";
import { prettyPrice } from "../utils";

const styles = require("./styles.css");

const Hr = props => <div style={{ background: "gray" }} />;

interface IConnectedCartItemProps {
  dispatch: Dispatch<{}>;
}

interface ICartItemProps extends ICartItem {
  id: number;
  subProduct: ISubProduct;
  // colorId: number;
  price: number;
  amount: number;
}

export const getCartItemTotalPrice = (price: number, amount: number) => {
  return price * amount;
};

class CartItem extends React.Component<
  IConnectedCartItemProps & ICartItemProps & any,
  any
> {
  handleNavigation = (navigation, id, name) => {
    navigation.navigate("Product", { id, name });
  };

  render() {
    const {
      id,
      subProduct,
      // colorId,
      price,
      amount
    } = this.props;
    const { product } = subProduct;

    const totalPrice = getCartItemTotalPrice(price, amount);
    return (
      <WingBlank size="lg">
        <WhiteSpace size="sm" />
        <div className={styles.mainContainer}>
          <div className={styles.cartContent}>
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={subProduct.product.images[0].src}
              />
            </div>

            <div className={styles.info}>
              <span className={styles.infoTitle}>
                {product.name} {product.brand.name}
              </span>
              <span className={styles.infoArticle}>
                артикул:{subProduct.article}
              </span>
              <div className={styles.infoStepper}>
                <UpdateCartItem id={id} amount={amount} />
              </div>
              <span className={styles.infoPriceContainer}>
                Цена: {prettyPrice(Math.round(totalPrice))} грн.
              </span>
            </div>
            <RemoveCartItem id={id} />
          </div>
        </div>
        <Hr />
      </WingBlank>
    );
  }
}

export default CartItem;
