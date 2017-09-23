import { Flex, Icon } from "antd-mobile";
import * as React from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import { Link } from "react-router-dom";
import { compose } from "redux";

import { HEIGHT } from "../../layout/Header/Header";
import { CART_QUERY, getCartAmount, IDataCart } from "../Cart/Cart";

interface IConnectedCartTriggerProps {
  data: IDataCart;
}

interface ICartTriggerProps {}

const styles = require("./styles.css");

class CartTrigger extends React.Component<
  IConnectedCartTriggerProps & ICartTriggerProps,
  any
> {
  render() {
    const { data } = this.props;
    const { loading, cart } = data;
    const amount = getCartAmount(cart);
    return (
      <Link
        className={styles.container}
        to={{
          pathname: "/cart/",
          state: { modal: true, title: "Корзина" }
        }}
      >
        {!loading && amount > 0
          ? <Flex justify="center" align="center" className={styles.amount}>
              {amount}
            </Flex>
          : null}
        <Icon
          className={styles.icon}
          type={require("!svg-sprite-loader!./cart.svg")}
          size="md"
        />
      </Link>
    );
  }
}

const mapStateToProps: any = state => ({});

export default compose(
  connect<IConnectedCartTriggerProps, {}, ICartTriggerProps>(mapStateToProps),
  graphql(CART_QUERY)
)(CartTrigger as any);
