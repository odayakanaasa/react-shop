import { ICatalogReducer } from "@src/modules/catalog/reducer";
import { MyIcon } from "@src/modules/common";
import { MyTouchFeedback } from "@src/modules/common/utils";
import { IRootReducer } from "@src/rootReducer";
import { Flex, Popover, Progress } from "antd-mobile";
import { compile } from "path-to-regexp";
import * as queryString from "query-string";
import * as React from "react";
import { connect } from "react-redux";

import { IDataAllProduct } from "../../../routes/CategoryPage/CategoryPage";
import { MyHistory } from "../../../routes/interfaces";
import { PATH_NAMES } from "../../../routes/RouteSwitch/RouteSwitch";
import { IFilter } from "../model";

const styles = require("./styles.css");

const ICONS_MAP = {
  "sort-asc": require("!svg-sprite-loader!./sort-asc.svg"),
  "sort-desc": require("!svg-sprite-loader!./sort-desc.svg")
};

const getSelected = (fitlers: IFilter[]) => {};

interface OwnProps {
  categoryId: number;
  toggleFilters: () => void;
  dataAllProducts: IDataAllProduct;
  history: MyHistory;
}

interface StateProps {
  catalog: ICatalogReducer;
}

interface Props extends OwnProps, StateProps {}

interface State {
  sortingEnabled: boolean;
}

class Nav extends React.Component<Props, State> {
  state = {
    sortingEnabled: false
  };

  toggleSorting = () => {
    this.setState({ sortingEnabled: !this.state.sortingEnabled });
  };

  render() {
    const {
      history,
      dataAllProducts,
      categoryId,
      catalog: { scrolledProducts }
    } = this.props;
    const { found, total } = dataAllProducts.allProducts;
    const GET = queryString.parse(history.location.search);
    const sortingProps: any = {
      placement: "bottomLeft",
      visible: this.state.sortingEnabled,
      onVisibleChange: this.toggleSorting,
      mask: true,
      onSelect: (node, index) => {
        if (GET.sorting !== node.props.value) {
          GET.sorting = node.props.value;
          history.replace(
            `${compile(PATH_NAMES.category)({
              id: categoryId
            })}?${queryString.stringify(GET)}`
          );
        }
        this.toggleSorting();
      }
    };
    const selectedSort = dataAllProducts.allProducts.sorting.filter(
      sort => sort.isSelected
    )[0];
    return (
      <Flex className={styles.Nav} direction="column">
        <Flex className={styles.nav} justify="between" align="center">
          <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
            <Popover
              classNme={styles.sorting}
              {...sortingProps}
              overlay={dataAllProducts.allProducts.sorting.map(sort =>
                <Popover.Item
                  onVisibleChange={this.toggleSorting}
                  style={{
                    color: sort.isSelected ? "orange" : "black"
                  }}
                  value={sort.value}
                  icon={<MyIcon type={ICONS_MAP[sort.icon]} size="md" />}
                >
                  {sort.name}
                </Popover.Item>
              )}
            >
              <Flex className={styles.navSorting}>
                <MyIcon
                  className={styles.sortIcon}
                  type={ICONS_MAP[selectedSort.icon]}
                />
                <Flex direction="column">
                  <div className={styles.navName}>Сортировка</div>
                  <div className={styles.navValue}>
                    {selectedSort.name}
                  </div>
                </Flex>
              </Flex>
            </Popover>
          </MyTouchFeedback>
          <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
            <Flex
              onClick={this.props.toggleFilters}
              className={styles.navFilter}
            >
              <MyIcon
                className={styles.filterIcon}
                type={require("!svg-sprite-loader!./filter.svg")}
              />
              <Flex direction="column" align="start">
                <div className={styles.navName}>Фильтр</div>
                <div
                  // className={styles.ProductsCounter}
                  className={styles.navValue}
                >
                  найдено <span style={{ color: "orange" }}>{found}</span>
                  {found !== total && ` из ${total}`} товара
                </div>
              </Flex>
            </Flex>
          </MyTouchFeedback>
        </Flex>
        <Progress
          className={`${styles.progress} ${scrolledProducts === found &&
            styles.finished}`}
          percent={Math.round(scrolledProducts! / found * 100)}
          position="normal"
          unfilled={false}
        />
      </Flex>
    );
  }
}

const mapStateToProps = (state: IRootReducer): StateProps => ({
  catalog: state.catalog
});

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(Nav);
