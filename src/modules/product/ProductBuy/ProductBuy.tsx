import { Flex } from "antd-mobile";
import * as React from "react";

import { AddCartItem } from "../../cart/index";

const styles = require("./styles.css");

interface IConnectedProductBuyProps {}

interface IProductBuyProps {
  subProductId: number;
  price: number;
  oldPrice?: number;
}

class ProductBuy extends React.Component<
  IConnectedProductBuyProps & IProductBuyProps,
  any
> {
  render() {
    const { subProductId, price, oldPrice } = this.props;
    return (
      <Flex className={styles.buy}>
        <div className={styles.buyPrice}>
          {!!oldPrice
            ? <div>
                <div className={styles.currentPrice}>
                  {parseInt(String(price), 10)} грн
                </div>
                <div className={styles.oldPrice}>
                  {parseInt(String(oldPrice), 10)} грн
                </div>
              </div>
            : <div className={styles.price}>
                {parseInt(String(price), 10)} грн
              </div>}
        </div>
        <AddCartItem subProductId={subProductId} />
      </Flex>
    );
  }
}

export default ProductBuy;
