import { Icon, Text, View } from "antd-mobile";
import React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import { Link } from "react-router-dom";
import { compose } from "redux";

import { HEIGHT } from "../../layout/Header/Header";
import { Loading } from "../../layout/index";
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
    if (loading) {
      return <Loading />;
    }
    return (
      <Ripples style={{ height: HEIGHT }}>
        <Link
          to={{
            pathname: "/cart/",
            state: { modal: true, title: "Корзина" }
          }}
        >
          {amount > 0
            ? <div className={styles.counterContainer}>
                <span className={styles.counter}>
                  {amount}
                </span>
              </div>
            : null}

          <Icon
            className={styles.ripple}
            type={require("!svg-sprite-loader!./cart.svg")}
            size="md"
          />
        </Link>
      </Ripples>
    );
  }
}

const mapStateToProps: any = state => ({});

export default compose(
  connect<IConnectedCartTriggerProps, {}, ICartTriggerProps>(mapStateToProps),
  graphql(CART_QUERY)
)(CartTrigger as any);
