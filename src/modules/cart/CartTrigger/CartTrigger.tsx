import { Icon, Text, View } from "antd-mobile";
import React from "react";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import { Link } from "react-router-dom";

import { HEIGHT } from "../../layout/Header/Header";
import { ICartItem } from "../model";

interface IConnectedCartTriggerProps {
  cart: [ICartItem];
}

interface ICartTriggerProps {
  // navigation: any;
}

const styles = require("./styles.css");

class CartTrigger extends React.Component<
  IConnectedCartTriggerProps & ICartTriggerProps,
  any
> {
  handleNavigation = () => {
    console.log("hello");
  };

  render() {
    const { cart } = this.props;
    return (
      <Ripples style={{ height: HEIGHT }}>
        <Link
          to={{
            pathname: "/cart/",
            state: { modal: true }
          }}
        >
          {cart.length > 0
            ? <View style={styles.counterContainer}>
                <Text style={styles.counter}>
                  {cart.length}
                </Text>
              </View>
            : null}

          <Icon
            className={styles.ripple}
            // onClick={this.handleNavigation}
            type={require("!svg-sprite-loader!./cart.svg")}
            size="md"
          />
        </Link>
      </Ripples>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

export default connect<IConnectedCartTriggerProps, {}, ICartTriggerProps>(
  mapStateToProps
)(CartTrigger as any);
