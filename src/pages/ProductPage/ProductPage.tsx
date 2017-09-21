import * as React from "react";
import { Product } from "../../modules/product/index";

class ProductPage extends React.Component<any, any> {
  render() {
    const { match } = this.props;
    return <Product id={match.params.id} />;
  }
}

export default ProductPage;
