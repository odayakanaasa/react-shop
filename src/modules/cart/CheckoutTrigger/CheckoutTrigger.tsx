import { Text, View } from "antd-mobile";
import React from "react";
import { connect } from "react-redux";

import { prettyPrice } from "../utils";

const styles = require("./styles.css");

const empty = "Нет товара";

interface IConnectedCheckoutTriggerProps {}

interface ICheckoutTriggerProps {
  totalPrice: number;
}

class CheckoutTrigger extends React.Component<
  IConnectedCheckoutTriggerProps & ICheckoutTriggerProps,
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
      <div className={styles.checkoutTrigger}>
        <div className={styles.totalPrice}>
          {prettyPrice(totalPrice)} грн.
        </div>
        <div className={styles.checkout}>Оформить</div>
      </div>
    );
  }
}

const mapStateToProps: any = state => ({});

export default connect<IConnectedCheckoutTriggerProps, {}, ICheckoutTriggerProps>(
  mapStateToProps
)(CheckoutTrigger as any);
