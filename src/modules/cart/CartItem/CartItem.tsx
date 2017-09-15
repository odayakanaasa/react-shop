import { Stepper, Text, View, WhiteSpace, WingBlank } from "antd-mobile";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IProduct } from "../../product/model";
import { ACTION_SET_COUNT } from "../constants";
import { CartItemRemove } from "../index";
import { ICartItem } from "../model";
import { prettyPrice } from "../utils";

const styles = require("./styles.css");

const Hr = props => <div style={{ background: "gray" }} />;

interface IConnectedCartItemProps {
  dispatch: Dispatch<{}>;
  cart: ICartItem;
}

interface ICartItemProps extends ICartItem {
  product: IProduct;
  productId: string;
  subProductId: string;
  colorId: number;
  price: number;
  count: number;
  index: number;
}

class CartItem extends React.Component<
  IConnectedCartItemProps & ICartItemProps,
  any
> {
  handleNavigation = (navigation, id, name) => {
    navigation.navigate("Product", { id, name });
  };

  onChange = value => {
    this.props.dispatch({
      type: ACTION_SET_COUNT,
      subProductId: this.props.subProductId,
      count: value
    });
  };

  priceMultiple = (price, count) => {
    return price * count;
  };

  render() {
    const {
      product,
      productId,
      subProductId,
      colorId,
      price,
      count,
      index
    } = this.props;
    const totalPrice = this.priceMultiple(price, count);
    return (
      <WingBlank size="lg">
        <WhiteSpace size="sm" />
        <View className={styles.mainContainer}>
          <View className={styles.cartContent}>
            <View className={styles.imageContainer}>
              <img className={styles.image} src={product.images[0].src} />
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>
                {product.name} {product.brand.name}
              </Text>
              <Text style={styles.infoArticle}>
                артикул:{" "}
                {product.subProducts
                  .filter(e => e.id === subProductId)
                  .map(el => el.article)}
              </Text>
              <Text style={styles.infoColor}>
                цвет:{" "}
                {product.images
                  .filter(e => e.id === colorId)
                  .map(el => el.colorName)}
              </Text>
              <View style={styles.infoStepper}>
                <Text>Кол-во: </Text>
                <Stepper
                  max={10}
                  min={1}
                  defaultValue={count}
                  onChange={this.onChange}
                />
              </View>
              <Text style={styles.infoPriceContainer}>
                Цена: {prettyPrice(Math.round(totalPrice))} грн.
              </Text>
            </View>

            <CartItemRemove index={index} />
          </View>
        </View>
        <Hr />
      </WingBlank>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

export default connect<IConnectedCartItemProps, {}, ICartItemProps>(
  mapStateToProps
)(CartItem);
