import { Products } from "@src/modules/catalog";
import Filters from "@src/modules/catalog/Filters/Filters";
import { IFilter } from "@src/modules/catalog/model";
import { Loading } from "@src/modules/common";
import MyIcon from "@src/modules/common/MyIcon/MyIcon";
import { Layout } from "@src/modules/layout";
import { ICategory } from "@src/modules/product/model";
import { IRootReducer } from "@src/rootReducer";
import { PATH_NAMES } from "@src/routes/index";
import { Button, Flex, List } from "antd-mobile";
import gql from "graphql-tag";
import { compile } from "path-to-regexp";
import * as React from "react";
import { graphql, OperationOption, QueryProps } from "react-apollo";
import Sidebar from "react-sidebar";
import { compose } from "redux";

import { Dispatch } from "../../interfaces";
import { ICatalogReducer } from "../../modules/catalog/reducer";
import { IPage, IRouterReducer } from "../interfaces";

const { Item } = List;

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

interface StateProps {
  router: IRouterReducer;
  catalog: ICatalogReducer;
}

interface DispatchProps {
  dispath: Dispatch
}

export interface GraphQLProps {
  dataCategory: IDataCategory;
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

  getLayoutOptions = () => {
    const { location, dataCategory: { category } } = this.props;
    return {
      header: {
        title: this.state.title
      }
    };
  };

  render() {
    const {
      match: { params: { id } },
      location,
      history,
      dataCategory
      // dataFilteredProducts
    } = this.props;

    // {dataCategory.loading || dataFilteredProducts.loading

    return (
      <Layout
        location={location}
        history={history}
        {...this.getLayoutOptions()}
      >
        {dataCategory.loading
          ? <Loading />
          : <Flex className={styles.CategoryPage}>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({
                    openFilters: !this.state.openFilters
                  });
                }}
                style={{
                  zIndex: 10,
                  width: "100%",
                  height: 40,
                  margin: "0 0.2rem"
                }}
              >
                <MyIcon
                  style={{
                    padding: "0 5px",
                    height: 15,
                    width: 15,
                    fill: "white"
                  }}
                  type={require("!svg-sprite-loader!./filter.svg")}
                />
                Фильтры
              </Button>
              <Sidebar
                sidebarClassName={styles.sidebar}
                pullRight={true}
                touch={false}
                sidebar={
                  <Filters
                    categoryId={id}
                    // filters={dataFilteredProducts.filteredProducts.filters}
                    // amount={{
                    //   current: 10,
                    //   total: dataFilteredProducts.filteredProducts.total
                    // }}
                  />
                }
                open={this.state.openFilters}
                onSetOpen={() =>
                  this.setState({ openFilters: !this.state.openFilters })}
              >
                <Products ids={catalog.productIds} />
              </Sidebar>
            </Flex>}
      </Layout>
    );
  }
}

const mapStateToProps = (state: IRootReducer): StateProps => ({
  catalog: state.catalog
});


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
  // graphql<GraphQLProps>(FILTERED_PRODUCTS_QUERY, filteredProductsOptions),
  graphql<GraphQLProps>(CATEGORY_QUERY, categoryOptions)
)(CategoryPage as any) as any;
