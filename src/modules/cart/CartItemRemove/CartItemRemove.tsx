import { Icon, View } from "antd-mobile";
import { type } from "os";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ACTION_REMOVE_CART_ITEM } from "../constants";

const styles = require("./styles.css");

interface IConnectedCartItemRemoveProps {
  dispatch: Dispatch<{}>;
}

interface ICartItemRemoveProps {
  index: number;
}

class CartItemRemove extends React.Component<
  IConnectedCartItemRemoveProps & ICartItemRemoveProps,
  any
> {
  removeCartItem(index) {
    this.props.dispatch({ type: ACTION_REMOVE_CART_ITEM, index });
  }

  render() {
    const { index } = this.props;
    return (
      <View style={styles.container} onClick={() => this.removeCartItem(index)}>
        <Icon
          style={styles.removeIcon}
          onClick={this.removeCartItem}
          type={require("!svg-sprite-loader!./remove.svg")}
          size="md"
        />
      </View>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

export default connect<IConnectedCartItemRemoveProps, {}, ICartItemRemoveProps>(
  mapStateToProps
)(CartItemRemove);
