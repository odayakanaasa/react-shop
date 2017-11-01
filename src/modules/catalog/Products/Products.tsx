import { IRootReducer } from "@src/rootReducer";
import { MyLocation } from "@src/routes/interfaces";
import * as React from "react";
import { compose } from "react-apollo";
import MasonryInfiniteScroller from "react-masonry-infinite";
import { connect } from "react-redux";

import { LIMIT } from "../../../routes/CategoryPage/CategoryPage";
import { Product } from "../index";
import { IAllProduct } from "../model";
import { ICatalogReducer } from "../reducer";

const styles = require("./styles.css");

interface StateProps {
  showOnlyViewed: boolean;
  viewedProductIds: any;
}

interface OwnProps {
  categoryId: string;
  location: MyLocation;
  allProducts: IAllProduct;
  style: any;
  openFilters: boolean;
}

interface State {}

interface Props extends StateProps, OwnProps {}

class Products extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.openFilters !== nextProps.openFilters) {
      // Prevent rerender whan sidebar is opened
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps: Props, prezvState: State) {
    const { products } = this.props.allProducts;
  }

  render() {
    const {
      allProducts: { products, total },
      showOnlyViewed,
      viewedProductIds,
      style
    } = this.props;

    const gutter = 3;
    console.log("Products.render");

    return (
      <div className={styles.Products} style={style}>
        <MasonryInfiniteScroller
          pack={false}
          sizes={[{ columns: 2, gutter }]}
          loadMore={() => ""}
        >
          {products.map((product, i) => {
            return <Product key={i} {...product} />;
          })}
        </MasonryInfiniteScroller>
        {/*<ShowOnlyViewed/>*/}
      </div>
    );
  }
}

const mapStateToProps = ({
  catalog: { showOnlyViewed, viewedProductIds }
}: IRootReducer): StateProps => ({
  showOnlyViewed,
  viewedProductIds
});

export default compose(connect<StateProps, {}, OwnProps>(mapStateToProps))(
  Products
) as any;
