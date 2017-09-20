import { Stepper } from "antd-mobile";
import update from "immutability-helper";
import React from "react";
import { gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose } from "redux";

const styles = require("./styles.css");

interface IConnectedUpdateCartItemProps {
  submit?: any;
}

interface IUpdateCartItemProps {
  id: number;
  amount: number;
}

interface IUpdateCartItemState {
  amount: number;
}

class UpdateCartItem extends React.Component<
  IConnectedUpdateCartItemProps & IUpdateCartItemProps,
  IUpdateCartItemState
> {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.amount
    };
  }

  handleStepper = (value: number) => {
    const { id, submit } = this.props;
    this.setState({ amount: value });
    submit(id, value);
  };

  render() {
    const { amount } = this.props;
    return (
      <Stepper
        min={1}
        max={10}
        step={1}
        onChange={this.handleStepper}
        showNumber={true}
        value={this.state.amount}
      />
    );
  }
}

const UPDATE_CART_ITEM_QUERY = require("./updateCartItem.gql");

export default compose(graphql(gql(UPDATE_CART_ITEM_QUERY)))(
  UpdateCartItem
) as any;
