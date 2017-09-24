import { Flex } from "antd-mobile";
import React from "react";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";

import { Price } from "../../common/index";
import { Devider } from "../../layout/index";
import { RemoveCartItem, UpdateCartItem } from "../index";
import { ICartItem } from "../model";

// import { Price } from "../../product/index";
const styles = require("./styles.css");

interface IConnectedCartItemProps {
  dispatch: Dispatch<{}>;
}

interface ICartItemProps extends ICartItem {}

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

    const linkTo = {
      pathname: `/product/${product.id}`
    };

    const totalPrice = getCartItemTotalPrice(price, amount);
    return (
      <div>
        <div className={styles.cartItem}>
          <Link className={styles.imageContainer} to={linkTo}>
            <img
              className={styles.image}
              src={subProduct.product.images[0].src}
            />
          </Link>
          <Flex
            direction="column"
            justify="around"
            align="start"
            className={styles.info}
          >
            <Link to={linkTo} className={styles.name}>
              {product.name}
              <br />
              {product.brand.name} {subProduct.article}
            </Link>
            <div className={styles.amount}>
              <UpdateCartItem id={id} amount={amount} />
            </div>
            <Flex className={styles.bottom} justify="between" align="center">
              <Price price={price} oldPrice={subProduct.oldPrice} />
              <div className={styles.remove}>
                <RemoveCartItem id={id} />
              </div>
            </Flex>
          </Flex>
        </div>
        <Devider />
      </div>
    );
  }
}

export default CartItem;
