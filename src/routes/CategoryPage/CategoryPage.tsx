import { Products } from "@src/modules/catalog";
import Filters from "@src/modules/catalog/Filters/Filters";
import { IFilter } from "@src/modules/catalog/model";
import { Loading } from "@src/modules/common";
import MyIcon from "@src/modules/common/MyIcon/MyIcon";
import { Layout } from "@src/modules/layout";
import { ICategory, IProduct } from "@src/modules/product/model";
import { PATH_NAMES } from "@src/routes/index";
import { Flex, List } from "antd-mobile";
import Progress from "antd-mobile/lib/progress";
import gql from "graphql-tag";
import update from "immutability-helper";
import { compile } from "path-to-regexp";
import * as React from "react";
import { graphql, OperationOption, QueryProps } from "react-apollo";
import Sidebar from "react-sidebar";
import { compose } from "redux";

import { Dispatch } from "../../interfaces";
import { ICatalogReducer } from "../../modules/catalog/reducer";
import { MyTouchFeedback } from "../../modules/common/utils";
import { IPage, IRouterReducer } from "../interfaces";

const { Item } = List;
const LIMIT = 15;

const styles = require("./styles.css");

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
}

class CategoryPage extends React.Component<Props, State> {
  // state = { title: "", filterEnabled: false };
  state = {
    title: "",
    // filterEnabled: true
    openFilters: false
  };

  componentWillReceiveProps(nextProps: Props) {
    const {
      dataCategory
      // dataFilteredProducts
    } = nextProps;
    if (!dataCategory.loading) {
      this.setState({
        title: dataCategory.category!.name
      });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // FIXME: Temp hack https://github.com/FormidableLabs/nuka-carousel/issues/103
    const {
      dataCategory,
      // dataFilteredProducts,
      history,
      match: { params: { id } },
      location
    } = nextProps;

    if (history.location.pathname !== location.pathname) {
      // Prevent rerender cause two active routes (main and modal in RouteSwitch)
      return false;
    }

    if (
      this.state.openFilters &&
      !this.props.dataAllProducts.loading &&
      nextProps.dataAllProducts.loading
    ) {
      return false;
    }

    const pathname = compile(PATH_NAMES.category)({ id });
    if (
      // !dataFilteredProducts.loading &&
      history.location.pathname === location.pathname
    ) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }
    return true;
  }

  componentWillUnmount() {
    console.log(this.props);
  }

  getLayoutOptions = () => {
    const { location, dataCategory: { category } } = this.props;
    return {
      header: {
        title: this.state.title
      }
    };
  };

  onSetOpen = () => {
    // this.setState({ openFilters: !this.state.openFilters });
    this.setState({ openFilters: false });
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

    const scrolled = 10;
    return (
      <Layout
        location={location}
        history={history}
        {...this.getLayoutOptions()}
      >
        {dataCategory.loading || dataAllProducts.loading
          ? <Loading />
          : <Flex className={styles.CategoryPage}>
              <Flex className={styles.nav}>
                <Flex
                  className={styles.nav}
                  style={{ background: "white", width: "100%" }}
                >
                  <div style={{ width: "50%", marginLeft: "1rem" }}>
                    <MyIcon
                      className={styles.sortIcon}
                      type={require("!svg-sprite-loader!./sort.svg")}
                    />
                    Сортировка
                  </div>

                  <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
                    <Flex
                      style={{ width: "50%", height: "100%" }}
                      onClick={() => {
                        this.setState({
                          openFilters: !this.state.openFilters
                        });
                      }}
                    >
                      <MyIcon
                        className={styles.filterIcon}
                        type={require("!svg-sprite-loader!./filter.svg")}
                      />
                      Фильтр
                      <div className={styles.ProductsCounter}>
                        {scrolled} / {dataAllProducts.allProducts.found}
                      </div>
                    </Flex>
                  </MyTouchFeedback>
                </Flex>
                <Progress
                  className={`${styles.progress} ${scrolled ===
                    dataAllProducts.allProducts.found && styles.finished}`}
                  percent={Math.round(
                    scrolled / dataAllProducts.allProducts.found * 100
                  )}
                  position="normal"
                  // unfilled={false}
                  unfilled={true}
                />
              </Flex>
              <Sidebar
                sidebarClassName={styles.sidebar}
                pullRight={true}
                touch={false}
                sidebar={
                  <Filters
                    dataAllProducts={dataAllProducts}
                    categoryId={id}
                    onSetOpen={this.onSetOpen}
                    history={history}
                  />
                }
                open={this.state.openFilters}
                onSetOpen={this.onSetOpen}
              >
                <Products data={dataAllProducts} location={location} />
              </Sidebar>
            </Flex>}
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
              offset: allProducts.products.length
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
