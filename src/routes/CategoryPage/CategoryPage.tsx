import { Dispatch } from "@src/interfaces";
import { Filters, Nav, Products, SelectedFilters } from "@src/modules/catalog";
import { ACTION_SET_SCROLLED_PRODUCTS } from "@src/modules/catalog/constants";
import { IFilter, ISort } from "@src/modules/catalog/model";
import { getSelectedFilters } from "@src/modules/catalog/SelectedFilters/SelectedFilters";
import { Loading, MyIcon } from "@src/modules/common";
import { Layout } from "@src/modules/layout";
import { ICategory, IProduct } from "@src/modules/product/model";
import { IRootReducer } from "@src/rootReducer";
import { PATH_NAMES } from "@src/routes/index";
import { IPage } from "@src/routes/interfaces";
import gql from "graphql-tag";
import update from "immutability-helper";
import { throttle } from "lodash";
import { compile } from "path-to-regexp";
import * as queryString from "query-string";
import * as React from "react";
import { graphql, OperationOption, QueryProps } from "react-apollo";
import { connect } from "react-redux";
import Sidebar from "react-sidebar";
import { compose } from "redux";

import { Aux } from "../../modules/common/utils";
import LoadingMask from "../../modules/layout/LoadingMask/LoadingMask";

const styles = require("./styles.css");

export const LIMIT = 20;

// miliseconds bettwen scroll event
const SCROLL_THROTTLE = 250;
// const SCROLL_THROTTLE = 500;

// px from bottom to start fetch more products
// const FETCH_MORE_THRESHOLD = window.innerHeight * 2;
const FETCH_MORE_THRESHOLD = window.innerHeight * 3;

interface IDataCategory extends QueryProps {
  category?: ICategory;
}

interface IDataFilteredProducts extends QueryProps {
  filteredProducts: {
    filters: [IFilter];
    total: number;
    // products?: IProduct[];
  };
}
export interface IDataAllProduct extends QueryProps {
  allProducts: {
    filters: [IFilter];
    sorting: [ISort];
    products: IProduct[];
    found: number;
    total: number;
  };
}

interface StateProps {}

interface DispatchProps {
  dispatch: Dispatch;
}

export interface GraphQLProps {
  dataCategory: IDataCategory;
  dataAllProducts: IDataAllProduct;
}

interface OwnProps extends IPage {}

interface Props extends OwnProps, StateProps, DispatchProps, GraphQLProps {}

interface State {
  title: string;
  openFilters: boolean;
}

const hasMore = (dataAllProducts?: IDataAllProduct) => {
  if (!dataAllProducts) {
    return false;
  }
  const { allProducts: { products } } = dataAllProducts;
  return products.length % LIMIT === 0;
};

class CategoryPage extends React.Component<Props, State> {
  // state = { title: "", filterEnabled: false };
  state = {
    title: "",
    openFilters: false
  };

  ref;

  bottomHeight: number;

  handleScrollThrottle: (event) => void;

  refineScrolledProducts = scrolledProducts => {
    const { dataAllProducts } = this.props;
    const { fetchMore, allProducts } = dataAllProducts;
    const { products, found, total } = allProducts!;

    if (scrolledProducts < LIMIT) {
      scrolledProducts = LIMIT > found ? found : LIMIT;
    } else if (scrolledProducts > found) {
      scrolledProducts = found;
    }
    return scrolledProducts;
  };

  isLoading = () => {
    const { dataCategory, dataAllProducts } = this.props;
    return dataCategory.loading || dataAllProducts.loading;
  };

  componentDidMount() {
    // tslint:disable-next-line:max-line-length
    // TODO: Bind to some element, but not window
    // https://stackoverflow.com/questions/36207398/not-getting-callback-after-adding-an-event-listener-for-scroll-event-in-react-js/36207913#36207913

    this.handleScrollThrottle = throttle(
      event => this.handleScroll(event),
      SCROLL_THROTTLE
    );
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { dataCategory, dataAllProducts } = nextProps;

    if (
      this.props.match.params.id !== nextProps.match.params.id ||
      this.props.location.search !== nextProps.location.search
    ) {
      window.scrollTo(0, 0);
    }

    // if (this.state.loading) {
    //   return false;
    // }

    if (
      !dataCategory.loading &&
      dataCategory.category!.name !== this.state.title
    ) {
      this.setState({ title: dataCategory.category!.name });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const {
      dataCategory,
      history,
      match: { params: { id } },
      location
    } = nextProps;

    const pathname = compile(PATH_NAMES.category)({ id });

    // Fix nuka-carousel resize bag
    // https://github.com/FormidableLabs/nuka-carousel/issues/103
    // if (history.location.pathname === location.pathname) {
    //   setTimeout(() => {
    //     window.dispatchEvent(new Event("resize"));
    //   }, 0);
    // }

    if (nextProps.dataAllProducts.loading || nextProps.dataCategory.loading) {
      return false;
    }

    if (history.location.pathname !== location.pathname) {
      // Prevent rerender cause two active routes (main and modal in RouteSwitch)
      return false;
    }

    if (
      JSON.stringify(this.props) === JSON.stringify(nextProps) &&
      JSON.stringify(this.state) === JSON.stringify(nextState)
    ) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!hasMore(this.props.dataAllProducts)) {
      this.removeScrollListener();
    }

    const { loading, allProducts } = this.props.dataAllProducts;
    if (!loading) {
      this.bottomHeight =
        this.ref.offsetTop +
        this.ref.clientHeight -
        window.innerHeight -
        FETCH_MORE_THRESHOLD;
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  getLayoutOptions = () => {
    const { location, dataCategory: { category } } = this.props;
    return {
      header: {
        title: this.state.title
      }
    };
  };

  addScrollListener = () => {
    window.addEventListener("scroll", this.handleScrollThrottle, true);
  };

  removeScrollListener = () => {
    window.removeEventListener("scroll", this.handleScrollThrottle, true);
  };

  toggleFilters = () => {
    document.body.style.overflow = this.state.openFilters ? "scroll" : "hidden";
    this.setState({ openFilters: !this.state.openFilters }, () => {
      this.state.openFilters
        ? this.removeScrollListener()
        : this.addScrollListener();
    });
  };

  getScrolledProducts = scrollTop => {
    const { dataAllProducts } = this.props;
    return Math.round(
      scrollTop /
        this.bottomHeight *
        dataAllProducts.allProducts.products.length
    );
  };

  handleScroll = event => {
    const {
      location,
      dataAllProducts: { allProducts, loading, fetchMore }
    } = this.props;
    console.log("window.pageYOffset", window.pageYOffset);

    if (!loading && location.pathname.search("category") !== -1) {
      const { products, found } = allProducts;

      // Calculate scrolled products
      // const scrollTop = window.pageYOffset;
      const scrollTop = event.srcElement.scrollTop;

      const scrolledProducts = this.getScrolledProducts(scrollTop);

      this.props.dispatch({
        type: ACTION_SET_SCROLLED_PRODUCTS,
        value: scrolledProducts
      });

      if (scrollTop > this.bottomHeight) {
        this.removeScrollListener();
        fetchMore({} as any).then(res => {
          this.addScrollListener();
        });
      }
    }
  };

  render() {
    const {
      match: { params: { id } },
      location,
      history,
      dataCategory,
      dataAllProducts
    } = this.props;

    if (!(dataCategory.loading || dataAllProducts.loading)) {
      console.log("CategoryPage.render");
    }

    return (
      <Layout
        location={location}
        history={history}
        {...this.getLayoutOptions()}
      >
        {dataCategory.loading ||
        dataAllProducts.loading ||
        !dataAllProducts.allProducts
          ? <Loading />
          : <div className={styles.CategoryPage}>
              <Nav
                history={history}
                dataAllProducts={dataAllProducts}
                categoryId={id}
                toggleFilters={this.toggleFilters}
              />
              <Sidebar
                // rootClassName={`${styles.root} ${this.state.openFilters &&
                //   styles.rootOpened}`}
                sidebarClassName={styles.sidebar}
                // overlayClassName={styles.overlay}
                // contentClassName={styles.content}
                pullRight={true}
                touch={false}
                shadow={true}
                sidebar={
                  <Filters
                    dataAllProducts={dataAllProducts}
                    categoryId={id}
                    open={this.state.openFilters}
                    onSetOpen={this.toggleFilters}
                    history={history}
                  />
                }
                open={this.state.openFilters}
                onSetOpen={this.toggleFilters}
              >
                <div
                  className={styles.sidebarContent}
                  ref={element => (this.ref = element)}
                >
                  <SelectedFilters
                    openFilters={this.state.openFilters}
                    history={history}
                    categoryId={id}
                    filters={dataAllProducts.allProducts.filters}
                    style={{
                      flexDirection: this.state.openFilters ? "column" : "row"
                    }}
                  />
                  <Products
                    allProducts={dataAllProducts.allProducts}
                    location={location}
                    style={{
                      marginTop:
                        getSelectedFilters(dataAllProducts.allProducts.filters)
                          .length > 0
                          ? "2.4rem"
                          : "0.2rem"
                    }}
                    openFilters={this.state.openFilters}
                  />
                  {hasMore(dataAllProducts) &&
                    <div className={styles.loading}>
                      <MyIcon type="loading" size="lg" />
                    </div>}
                </div>
              </Sidebar>
            </div>}
      </Layout>
    );
  }
}

const CATEGORY_QUERY = gql(require("./category.gql"));
const categoryOptions: OperationOption<OwnProps, GraphQLProps> = {
  options: props => ({
    fetchPolicy: "cache-first",
    variables: {
      id: parseInt(props.match.params.id, 0)
    }
  }),
  name: "dataCategory"
};

export const ALL_PRODUCTS_QUERY = gql(require("./allProducts.gql"));

export const allProductsOptions: OperationOption<OwnProps, GraphQLProps> = {
  options: ownProps => {
    // fetchPolicy: "network-only",
    const GET = queryString.parse(ownProps.location.search);
    return {
      variables: {
        categoryId: ownProps.match.params.id,
        filters: GET.filters,
        sorting: GET.sorting,
        first: LIMIT,
        offset: 0
      }
    };
  },
  props: (ownProps: any) => {
    const { data } = ownProps;
    const { allProducts, loading, fetchMore, refetch, variables } = data;
    return {
      dataAllProducts: {
        allProducts,
        loading,
        refetch,
        variables,
        fetchMore() {
          console.log("fetchMore");
          return fetchMore({
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult.allProducts) {
                return prev;
              }
              return update(prev, {
                allProducts: {
                  products: {
                    $push: fetchMoreResult.allProducts.products
                  }
                }
              });
            },
            variables: {
              offset: allProducts.products.length,
              total: allProducts.total
            }
          });
        }
      }
    };
  }
};

// const FILTERED_PRODUCTS_QUERY = gql(require("./filteredProducts.gql"));
// const filteredProductsOptions: OperationOption<OwnProps, GraphQLProps> = {
//   options: props => ({
//     fetchPolicy: "cache-first",
//     variables: {
//       categoryId: parseInt(props.match.params.id, 0),
//       filters: "61=7962;brand=cat"
//     }
//   }),
//   name: "dataFilteredProducts"
// };

const mapStateToProps = (state: IRootReducer): StateProps => ({});

export default compose(
  connect<StateProps, DispatchProps, OwnProps>(mapStateToProps),
  graphql<GraphQLProps>(CATEGORY_QUERY, categoryOptions),
  graphql<GraphQLProps, OwnProps>(ALL_PRODUCTS_QUERY, allProductsOptions)
)(CategoryPage as any) as any;
