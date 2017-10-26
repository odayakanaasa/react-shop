import { Loading } from "@src/modules/common";
import { IRootReducer } from "@src/rootReducer";
import { MyLocation } from "@src/routes/interfaces";
import * as React from "react";
import { compose, QueryProps } from "react-apollo";
import MasonryInfiniteScroller from "react-masonry-infinite";
import { connect } from "react-redux";

import { Product } from "../index";
import { IAllProduct } from "../model";
import { ICatalogReducer } from "../reducer";

const styles = require("./styles.css");

interface StateProps {
  catalog: ICatalogReducer;
}

interface OwnProps {
  categoryId: string;
  location: MyLocation;
  allProducts: IAllProduct;
}

interface State {}

interface Props extends StateProps, OwnProps {}

class Products extends React.Component<Props, State> {
  render() {
    const {
      allProducts: { products, total },
      catalog: { showOnlyViewed, viewedProductIds }
    } = this.props;
    const filteredProducts = showOnlyViewed
      ? products.filter(p => viewedProductIds.indexOf(parseInt(p.id, 0)) !== -1)
      : products;

    const gutter = 3;
    console.log("Products.render");

    return (
      <div className={styles.Products}>
        <MasonryInfiniteScroller
          sizes={[{ columns: 2, gutter }]}
          loadMore={() => ""}
        >
          {filteredProducts.map((product, i) => {
            return <Product key={i} {...product} />;
          })}
        </MasonryInfiniteScroller>
        {/*<ShowOnlyViewed/>*/}
      </div>
    );
  }
}

const mapStateToProps = (state: IRootReducer): StateProps => ({
  catalog: state.catalog
});

export default compose(connect<StateProps, {}, OwnProps>(mapStateToProps))(
  Products
) as any;
