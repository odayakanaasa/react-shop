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
      <Icon
        className={styles.icon}
        type={require("!svg-sprite-loader!./remove.svg")}
        onClick={this.removeCartItem}
      />
    );
  }
}

const mapStateToProps: any = state => ({});

const REMOVE_CART_ITEM_MUTATION = require("./removeCartItem.gql");

export default compose(
  connect<IConnectedRemoveCartItemProps, {}, IRemoveCartItemProps>(
    mapStateToProps
  ),
  graphql(gql(REMOVE_CART_ITEM_MUTATION), {
    props: ({ ownProps, mutate }) => {
      return {
        submit(id) {
          return (mutate as any)({
            variables: { id },
            update: (store, { removeCartItem }) => {
              const data = store.readQuery({ query: CART_QUERY });
              data.cart.items = data.cart.items.filter(item => item.id !== id);
              store.writeQuery({ query: CART_QUERY, data });
            }
          });
        }
      };
    }
  })
)(RemoveCartItem as any);
