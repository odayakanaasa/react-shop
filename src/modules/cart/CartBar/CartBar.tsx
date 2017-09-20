import { Text, View } from "antd-mobile";
import React from "react";
import { connect } from "react-redux";

import { prettyPrice } from "../utils";

const styles = require("./styles.css");

const empty = "Нет товара";

interface IConnectedCartBarProps {
}

interface ICartBarProps {
  totalPrice: number;
}

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
    const { totalPrice } = this.props;
    return (
        <div className={styles.footerContainer}>
          <div className={styles.containerTotalPrice}>
            <span className={styles.price}>
              {prettyPrice(totalPrice)} грн.
            </span>
          </div>
          <div
            className={styles.buyCart}
            onClick={() => alert("To Be Continued...")}
          >
            <div className={styles.buy}>Оформить заказ</div>
          </div>
        </div>
    );
  }
}

const mapStateToProps: any = state => ({
});

export default connect<IConnectedCartBarProps, {}, ICartBarProps>(
  mapStateToProps
)(CartBar as any);
