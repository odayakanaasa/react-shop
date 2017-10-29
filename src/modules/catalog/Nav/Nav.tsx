import { MyIcon } from "@src/modules/common";
import { MyTouchFeedback } from "@src/modules/common/utils";
import { Flex, Progress } from "antd-mobile";
import * as React from "react";

import { IFilter } from "../model";

const styles = require("./styles.css");

const getSelected = (fitlers: IFilter[]) => {};

interface IAmount {}

interface OwnProps {
  refetch: () => void;
  toggleFilters: () => void;
  foundProducts: number;
}

interface State {}

interface Props extends OwnProps {}

class Nav extends React.Component<Props, State> {

  render() {
    const { foundProducts } = this.props;
    const scrolledProducts = 0;
    return (
      <Flex className={styles.Nav} direction="column">
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
              onClick={this.props.toggleFilters}
              className={styles.navFilter}
            >
              <MyIcon
                className={styles.filterIcon}
                type={require("!svg-sprite-loader!./filter.svg")}
              />
              Фильтр
              <div className={styles.ProductsCounter}>
                <span style={{ color: "orange" }}>{scrolledProducts}</span> /{" "}
                {foundProducts}
                <br />
                товара
              </div>
            </Flex>
          </MyTouchFeedback>
        </Flex>
        <Progress
          className={`${styles.progress} ${scrolledProducts === foundProducts &&
            styles.finished}`}
          percent={Math.round(scrolledProducts! / foundProducts * 100)}
          position="normal"
          unfilled={false}
        />
      </Flex>
    );
  }
}

export default Nav;
