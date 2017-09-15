import { View } from "antd-mobile";
import * as React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose } from "redux";

import client from "../../../graphqlClient";
import { IData } from "../../../model";
import { Loading } from "../../layout/index";
import { IProduct } from "../../product/model";
import { CartBar, CartItem } from "../index";
import { ICartItem } from "../model";

const styles = require("./styles.css");

const CART_QUERY = require("./cart.gql");

interface IDataCart extends IData {
  cart: [ICartItem];
}

interface IConnectedCartProps {
  data: IDataCart;
}

interface ICartProps {
  history: any;
}

class Cart extends React.Component<
  IConnectedCartProps & ICartProps & any,
  any
> {
  render() {
    const { history, data } = this.props;
    const { loading, cart } = data;

    if (loading === true) {
      return <Loading />;
    }

    const products = cart.map(el => {
      const product = client.readFragment({
        fragment: gql`
          fragment someFragment on ProductType {
            id
            name
            brand {
              name
            }
            subProducts {
              id
              article
              price
            }
            images {
              id
              src
              colorName
            }
          }
        `,
        id: `ProductType:${el.productId}`
      }) as any;
      return product as IProduct;
    });

    // tslint:disable-next-line
    const emptyCartSrc = "https://thumbs.dreamstime.com/t/smiley-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D1%8B-emoticon-%D1%82%D0%B5%D0%BB%D0%B5%D0%B6%D0%BA%D0%B8-2986275.jpg";

    return (
      <View style={{ flex: 1 }}>
        {products.map((product, index) =>
          <CartItem
            key={index}
            product={product}
            productId={cart[index].productId}
            subProductId={cart[index].subProductId}
            colorId={cart[index].colorId}
            price={cart[index].price}
            count={cart[index].count}
            index={index}
          />
        )}
        {cart.length > 0
          ? <CartBar />
          : <View style={styles.emptyCartContainer}>
              <img
                // resizeMode="contain"
                src={emptyCartSrc}
                style={{ width: "80%", height: "80%" }}
              />
            </View>}
      </View>
    );
  }
}

const mapStateToProps: any = state => ({
  cart: state.cart
});

const options = {
  options: props => ({
    variables: {
      id: props.id
    }
  })
}

export default compose(
  connect<IConnectedCartProps, {}, ICartProps>(mapStateToProps),
  graphql(gql(CART_QUERY), options)
)(Cart);
