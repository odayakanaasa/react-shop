import { Loading, MyIcon } from "@src/modules/common";
import { IRootReducer } from "@src/rootReducer";
import { MyLocation } from "@src/routes/interfaces";
import update from "immutability-helper";
import { throttle } from "lodash";
import * as React from "react";
import { compose, gql, OperationOption, QueryProps } from "react-apollo";
import MasonryInfiniteScroller from "react-masonry-infinite";
import { connect } from "react-redux";

import { Product } from "../index";
import { IAllProduct } from "../model";
import { ICatalogReducer } from "../reducer";

const styles = require("./styles.css");

const LIMIT = 15;

// miliseconds bettwen scroll event
const SCROLL_THROTTLE = 250;

// px from bottom to start fetch more products
// const FETCH_MORE_THRESHOLD = window.innerHeight * 2;
const FETCH_MORE_THRESHOLD = window.innerHeight;

interface IDataProducts extends QueryProps {
  allProducts?: IAllProduct;
}

interface GraphQLProps {
  data: IDataProducts;
}

interface StateProps {
  catalog: ICatalogReducer;
}

interface OwnProps {
  categoryId: string;
  location: MyLocation;
}

interface State {
  haveMoreProducts?: boolean;
  scrolledProducts?: number;
}

interface Props extends StateProps, GraphQLProps, OwnProps {}

class Products extends React.Component<Props, State> {
  ref;

  bottomHeight: number;

  handleScrollThrottle: (event) => void;

  state = {
    haveMoreProducts: true,
    scrolledProducts: 0
  };

  refineScrolledProducts = scrolledProducts => {
    const { data } = this.props;
    const { fetchMore, allProducts } = data;
    const { products, total } = allProducts!;

    if (scrolledProducts < LIMIT) {
      scrolledProducts = LIMIT > total ? total : LIMIT;
    } else if (scrolledProducts > total) {
      scrolledProducts = total;
    }
    return scrolledProducts;
  };

  handleScroll = event => {
    const { location, data } = this.props;
    if (location.pathname.search("category") !== -1) {
      const { fetchMore, allProducts, loading } = data;
      const { products, total } = allProducts!;

      // Calculate scrolled products
      const scrollTop = event.srcElement.scrollTop;

      // const scrollTop = document.body.scrollTop;
      const { scrolledProducts, haveMoreProducts } = this.state;
      const scrolled = Math.round(
        scrollTop / this.bottomHeight * products.length
      );
      // this.setState({ scrolledProducts: scrolled });

      if (scrollTop > this.bottomHeight && haveMoreProducts === true) {
        fetchMore({} as any);
      }
    }
  };

  componentDidMount() {
    const { loading, allProducts } = this.props.data;
    this.handleScrollThrottle = throttle(
      event => this.handleScroll(event),
      SCROLL_THROTTLE
    );
    if (!loading) {
      this.bottomHeight =
        this.ref.offsetTop +
        this.ref.clientHeight -
        window.innerHeight -
        FETCH_MORE_THRESHOLD;
    }
    // tslint:disable-next-line:max-line-length
    // TODO: Bind to some element, but not window
    // https://stackoverflow.com/questions/36207398/not-getting-callback-after-adding-an-event-listener-for-scroll-event-in-react-js/36207913#36207913
    window.addEventListener("scroll", this.handleScrollThrottle, true);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollThrottle, true);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { loading, allProducts } = this.props.data;
    if (!loading) {
      this.bottomHeight =
        this.ref.offsetTop +
        this.ref.clientHeight -
        window.innerHeight -
        FETCH_MORE_THRESHOLD;
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { loading, allProducts } = nextProps.data;
    if (loading === false) {
      const { products, total } = allProducts!;
      if (products.length >= total) {
        this.setState({
          haveMoreProducts: false
        });
      }
    }
  }

  render() {
    const { data, catalog: { showOnlyViewed, viewedProductIds } } = this.props;
    const { loading, allProducts, fetchMore } = data;
    if (loading) {
      return <Loading />;
    }
    const { products, total } = allProducts!;
    const filteredProducts = showOnlyViewed
      ? products.filter(p => viewedProductIds.indexOf(parseInt(p.id, 0)) !== -1)
      : products;

    const gutter = 3;
    return (
      <div className={styles.Products} ref={element => (this.ref = element)}>
        <MasonryInfiniteScroller
          sizes={[{ columns: 2, gutter }]}
          loadMore={() => ""}
        >
          {filteredProducts.map((product, i) => {
            return <Product key={i} {...product} />;
          })}
        </MasonryInfiniteScroller>

        <div
          className={styles.loading}
          style={{ display: this.state.haveMoreProducts ? "block" : "none" }}
        >
          <MyIcon type="loading" size="lg" />
        </div>

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
