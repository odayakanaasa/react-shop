import { Text, View } from "antd-mobile";
import React from "react";
import { connect } from "react-redux";

import { prettyPrice } from "../utils";

const styles = require("./styles.css");

const empty = "Нет товара";

interface IConnectedCartBarProps {
  cart: any;
}

interface ICartBarProps {}

class CartBar extends React.Component<
  IConnectedCartBarProps & ICartBarProps,
  any
> {
  state = {
    modalVisible: false
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  add(a, b) {
    return Math.round(a) + Math.round(b);
  }

  render() {
    const { cart } = this.props;
    const productsPrice = cart.map(product => product.price * product.count);
    const totalPrice = productsPrice.reduce(this.add, 0);

    return (
      <View>
        <View style={styles.footerContainer}>
          <View style={styles.containerTotalPrice}>
            <Text style={styles.price}>Стоимость заказа</Text>
            <Text style={styles.price}>
              {prettyPrice(totalPrice)} грн.
            </Text>
          </View>
          <View
            style={styles.buyCart}
            onPress={() => alert("To Be Continued...")}
          >
            <Text style={styles.buy}>Оформить заказ</Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

export default connect<IConnectedCartBarProps, {}, ICartBarProps>(
  mapStateToProps
)(CartBar as any);
