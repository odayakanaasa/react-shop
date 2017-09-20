import { ICartItem } from "../model";
import update from "immutability-helper";
import React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";

import { CART_QUERY } from "../Cart/Cart";

const styles = require("./styles.css");

interface IConnectedCartItemAddProps {
  submit: any;
}

interface ICartItemAddProps {
  subProductId: number;
  index?: number;
}

class CartItemAdd extends React.Component<
  IConnectedCartItemAddProps & ICartItemAddProps,
  any
> {
  addCartItem = () => {
    const { submit, subProductId } = this.props;
    submit(subProductId);
  };

  render() {
    const { index } = this.props;
    return <div onClick={this.addCartItem}>Купить</div>;
    // return (
    //   <View style={styles.container} onClick={() => this.removeCartItem(index)}>
    //     <Icon
    //       style={styles.removeIcon}
    //       onClick={this.removeCartItem}
    //       type={require("!svg-sprite-loader!./remove.svg")}
    //       size="md"
    //     />
    //   </View>
    // );
  }
}

const mapStateToProps: any = state => ({});

const ADD_CART_ITEM_QUERY = require("./addCartItem.gql");

export default compose(
  connect<IConnectedCartItemAddProps, {}, ICartItemAddProps>(mapStateToProps),
  graphql(gql(ADD_CART_ITEM_QUERY), {
    props: ({ ownProps, mutate }) => {
      return {
        submit(subProductId: number) {
          return (mutate as any)({
            variables: { subProductId },
            update: (store, { data: { addCartItem } }) => {
              // // Read the data from our cache for this query.
              // const data = store.readQuery({ query: CommentAppQuery });
              // // Add our comment from the mutation to the end.
              // data.comments.push(submitComment);
              // // Write our data back to the cache.
              // store.writeQuery({ query: CommentAppQuery, data });
              const { cartItem } = addCartItem;
              const cart = cartItem.cart;
              cart.items = cart.items || [];
              cart.items.push(cartItem);
              store.writeQuery({
                query: gql(CART_QUERY),
                data: { cart }
              });
            }
          });
        }
      };
    }
  })
)(CartItemAdd as any);
