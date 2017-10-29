import { Dispatch } from "@src/interfaces";
import { Filters, Products, SelectedFilters } from "@src/modules/catalog";
import { IFilter } from "@src/modules/catalog/model";
import { ICatalogReducer } from "@src/modules/catalog/reducer";
import { Loading, MyIcon } from "@src/modules/common";
import { MyTouchFeedback } from "@src/modules/common/utils";
import { Layout } from "@src/modules/layout";
import { ICategory, IProduct } from "@src/modules/product/model";
import { PATH_NAMES } from "@src/routes/index";
import { IPage, IRouterReducer } from "@src/routes/interfaces";
import { Flex } from "antd-mobile";
import Progress from "antd-mobile/lib/progress";
import gql from "graphql-tag";
import update from "immutability-helper";
import { throttle } from "lodash";
import { compile } from "path-to-regexp";
import * as React from "react";
import { graphql, OperationOption, QueryProps } from "react-apollo";
import Sidebar from "react-sidebar";
import { compose } from "redux";

const styles = require("./styles.css");

const LIMIT = 15;

// miliseconds bettwen scroll event
const SCROLL_THROTTLE = 250;

// px from bottom to start fetch more products
// const FETCH_MORE_THRESHOLD = window.innerHeight * 2;
const FETCH_MORE_THRESHOLD = window.innerHeight * 1.5;

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
    products: IProduct[];
    found: number;
  };
}

interface StateProps {
  router: IRouterReducer;
  catalog: ICatalogReducer;
}

interface DispatchProps {
  dispath: Dispatch;
}

export interface GraphQLProps {
  dataCategory: IDataCategory;
  dataAllProducts: IDataAllProduct;
  // dataFilteredProducts: IDataFilteredProducts;
}

interface OwnProps extends IPage {}

interface Props extends OwnProps, GraphQLProps {}

interface State {
  title: string;
  openFilters: boolean;
  haveMoreProducts?: boolean;
  scrolledProducts?: number;
  // loading: boolean;
}

class CategoryPage extends React.Component<Props, State> {
  // state = { title: "", filterEnabled: false };
  state = {
    title: "",
    // loading: false,
    // openFilters: false,
    openFilters: false,
    haveMoreProducts: true,
    scrolledProducts: undefined
  };

  ref;

  bottomHeight: number;

  handleScrollThrottle: (event) => void;

  refineScrolledProducts = scrolledProducts => {
    const { dataAllProducts } = this.props;
    const { fetchMore, allProducts } = dataAllProducts;
    const { products, found } = allProducts!;

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
    window.addEventListener("scroll", this.handleScrollThrottle, true);
    console.log("addEvent");
  }

  componentWillReceiveProps(nextProps: Props) {
    const { dataCategory, dataAllProducts } = nextProps;

    if (this.props.match.params.id !== nextProps.match.params.id) {
      console.log('this.props.match.params.id !== nextProps.match.params.id')
    }

    // if (this.state.loading) {
    //   return false;
    // }

    // if (!dataAllProducts.loading && this.state.loading) {
    if (!dataAllProducts.loading) {
      // window.addEventListener("scroll", this.handleScrollThrottle, true);

      // state.loading = false;
      console.log("loading=false");
      this.setState({
        scrolledProducts: dataAllProducts.allProducts.products.length
      });
      const { products, found } = dataAllProducts.allProducts!;
      if (products.length >= found) {
        this.setState({ haveMoreProducts: false });
      }
    }
    if (
      !dataCategory.loading &&
      dataCategory.category!.name !== this.state.title
    ) {
      this.setState({ title: dataCategory.category!.name });
    }

    // if (this.state.loading) {
    //   window.removeEventListener("scroll", this.handleScrollThrottle, true);
    // }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const {
      dataCategory,
      // dataFilteredProducts,
      history,
      match: { params: { id } },
      location
    } = nextProps;

    const pathname = compile(PATH_NAMES.category)({ id });
    if (history.location.pathname === location.pathname) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }

    if (nextProps.dataAllProducts.loading || nextProps.dataCategory.loading) {
      return false;
    }

    // if (this.state.scrolledProducts !== nextState.scrolledProducts) {
    //   return false;
    // }

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

    // if (this.state.openFilters && nextState.openFilters) {
    //   // Prevent rerender whan sidebar is opened
    //   return false;
    // }

    return true;
  }

  componentDidUpdate(prevProps: Props, prezvState: State) {
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
    console.log("removeEventListener");
    window.removeEventListener("scroll", this.handleScrollThrottle, true);
  }

  getLayoutOptions = () => {
    const { location, dataCategory: { category } } = this.props;
    return {
      header: {
        title: this.state.title
      }
    };
  };

  toggleOpenFilters = () => {
    this.setState({ openFilters: !this.state.openFilters }, () => {
      this.state.openFilters
        ? window.removeEventListener("scroll", this.handleScrollThrottle, true)
        : window.addEventListener("scroll", this.handleScrollThrottle, true);
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
    // if (loading) {
    //   return;
    // }

    if (location.pathname.search("category") !== -1) {
      const { products, found } = allProducts;

      // Calculate scrolled products
      const scrollTop = event.srcElement.scrollTop;

      // const scrollTop = document.body.scrollTop;
      const { scrolledProducts, haveMoreProducts } = this.state;
      const scrolled = this.getScrolledProducts(scrollTop);

      // FIXME: uncomment
      // this.setState({ scrolledProducts: scrolled });

      if (
        scrollTop > this.bottomHeight &&
        haveMoreProducts === true
        // !this.state.loading
      ) {
        // this.setState({ loading: true }, () => fetchMore({} as any));
        window.removeEventListener("scroll", this.handleScrollThrottle, true);
        console.log("removeEventListener");
        fetchMore({} as any).then(res => {
          window.addEventListener("scroll", this.handleScrollThrottle, true);
          console.log("addEvent");
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
      // dataFilteredProducts
    } = this.props;

    // {dataCategory.loading || dataFilteredProducts.loading
    // <ProductsCounter scrolled={this.refineScrolledProducts(this.state.scrolledProducts)} total={total} />

    const scrolled = this.state.scrolledProducts;
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
              <Flex className={styles.navigation} direction="column">
                <Flex className={styles.nav} justify="center" align="center">
                  <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
                    <div className={styles.navSorting}>
                      <MyIcon
                        className={styles.sortIcon}
                        type={require("!svg-sprite-loader!./sort.svg")}
                      />
                      Сортировка
                    </div>
                  </MyTouchFeedback>
                  <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
                    <Flex
                      style={{ width: "50%", height: "100%" }}
                      onClick={this.toggleOpenFilters}
                      className={styles.navFilter}
                    >
                      <MyIcon
                        className={styles.filterIcon}
                        type={require("!svg-sprite-loader!./filter.svg")}
                      />
                      Фильтр
                      <div className={styles.ProductsCounter}>
                        <span style={{ color: "orange" }}>{scrolled}</span> /{" "}
                        {dataAllProducts.allProducts.found}
                        <br />
                        товара
                      </div>
                    </Flex>
                  </MyTouchFeedback>
                </Flex>
                <Progress
                  className={`${styles.progress} ${scrolled ===
                    dataAllProducts.allProducts.found && styles.finished}`}
                  percent={Math.round(
                    scrolled! / dataAllProducts.allProducts.found * 100
                  )}
                  position="normal"
                  unfilled={false}
                />
              </Flex>
              <Sidebar
                sidebarClassName={styles.sidebar}
                pullRight={true}
                touch={false}
                shadow={true}
                sidebar={
                  <Filters
                    dataAllProducts={dataAllProducts}
                    categoryId={id}
                    open={this.state.openFilters}
                    onSetOpen={this.toggleOpenFilters}
                    history={history}
                  />
                }
                open={this.state.openFilters}
                onSetOpen={this.toggleOpenFilters}
              >
                <div
                  className={styles.sidebarContent}
                  ref={element => (this.ref = element)}
                >
                  <SelectedFilters
                    categoryId={id}
                    filters={dataAllProducts.allProducts.filters}
                  />

                  <Products
                    allProducts={dataAllProducts.allProducts}
                    location={location}
                  />
                  {this.state.haveMoreProducts &&
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

// <Sidebar
// sidebarClassName={styles.sidebar}
// pullRight={true}
// touch={false}
// sidebar={
//   <Filters
//     dataAllProducts={dataAllProducts}
//     categoryId={id}
//     onSetOpen={this.onSetOpen}
//     history={history}
//   />
// }
// open={this.state.openFilters}
// onSetOpen={this.onSetOpen}
// >
// <Products data={dataAllProducts} />
// </Sidebar>

// const mapStateToProps = (state: IRootReducer): StateProps => ({
//   // catalog: state.catalog
// });

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
  options: ownProps => ({
    // fetchPolicy: "network-only",
    variables: {
      categoryId: ownProps.match.params.id,
      filterStr: ownProps.location.search.replace("?query=", ""),
      first: LIMIT,
      offset: 0
    }
  }),
  props: (ownProps: any) => {
    const { data } = ownProps;
    const { loading, fetchMore, refetch } = data;
    let allProducts;
    if (!loading) {
      // This is temp hack to exclude products without subProducts
      // TODO: Should be solved in GraphQL server
      allProducts = update(data.allProducts, {
        products: {
          $set: data.allProducts.products.filter(
            p => p.subProducts.length !== 0
          )
        }
      });
    }
    return {
      dataAllProducts: {
        allProducts,
        loading,
        refetch,
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
              first: 20
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
//       filterStr: "61=7962;brand=cat"
//     }
//   }),
//   name: "dataFilteredProducts"
// };

export default compose(
  graphql<GraphQLProps>(CATEGORY_QUERY, categoryOptions),
  graphql<GraphQLProps, OwnProps>(ALL_PRODUCTS_QUERY, allProductsOptions)
)(CategoryPage as any) as any;
