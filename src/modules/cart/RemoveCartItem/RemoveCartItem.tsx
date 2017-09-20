import { Icon } from "antd-mobile";
import update from "immutability-helper";
import React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import { compose } from "redux";

import { HEIGHT } from "../../layout/Header/Header";
import { CART_QUERY } from "../Cart/Cart";

const styles = require("./styles.css");

interface IConnectedRemoveCartItemProps {
  submit: any;
}

interface IRemoveCartItemProps {
  id: number;
}

class RemoveCartItem extends React.Component<
  IConnectedRemoveCartItemProps & IRemoveCartItemProps,
  any
> {
  removeCartItem = () => {
    const { submit, id } = this.props;
    submit(id);
  };

  render() {
    return (
      <Ripples onClick={this.removeCartItem} style={{ height: HEIGHT }}>
        <Icon
          // className={styles.ripple}
          type={require("!svg-sprite-loader!./remove.svg")}
          style={{ fill: "red" }}
          size="md"
        />
      </Ripples>
    );
  }
}

const mapStateToProps: any = state => ({});

const REMOVE_CART_ITEM_QUERY = require("./removeCartItem.gql");

export default compose(
  connect<IConnectedRemoveCartItemProps, {}, IRemoveCartItemProps>(
    mapStateToProps
  ),
  graphql(gql(REMOVE_CART_ITEM_QUERY), {
    props: ({ ownProps, mutate }) => {
      return {
        submit: (id: number) =>
          (mutate as any)({
            variables: { id },
            updateQueries: {
              cart: (prev, { mutationResult }) => {
                const {
                  data: { removeCartItem: { totalPrice } }
                } = mutationResult;
                return update(prev, {
                  cart: {
                    totalPrice: { $set: totalPrice },
                    amount: { $set: prev.cart.amount - 1 },
                    items: {
                      $set: prev.cart.items.filter(item => item.id !== id)
                    }
                  }
                });
              }
            }
          })
      };
    }
  })
)(RemoveCartItem as any);
