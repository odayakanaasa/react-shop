import { MyIcon } from "@src/modules/common";
import { PATH_NAMES } from "@src/routes";
import { Flex } from "antd-mobile";
import { compile } from "path-to-regexp";
import * as React from "react";
import { Link } from "react-router-dom";

import { MyTouchFeedback } from "../../common/utils";
import { IFilter } from "../model";

const styles = require("./styles.css");

export const getSelectedFilters = (filters: IFilter[]) => {
  return filters.filter(filter => filter.hasChecked);
};

interface OwnProps {
  categoryId: number;
  filters: IFilter[];
  style?: any;
}

interface State {
  uncheckedFilterId?: number;
}

interface Props extends OwnProps {}

class SelectedFilters extends React.Component<Props, State> {
  state = {
    uncheckedFilterId: undefined
  };
  render() {
    console.log("SelectedFilters.render");
    const { filters, categoryId, style } = this.props;
    const checkedFilters = getSelectedFilters(filters).filter(
      filter => filter.id !== this.state.uncheckedFilterId
    );
    if (checkedFilters.length === 0) {
      return null;
    }
    return (
      <Flex style={style} className={styles.SelectedFilters} wrap="wrap">
        {checkedFilters.map((filter, i) =>
          <MyTouchFeedback key={i}>
            <Link
              key={i}
              className={styles.item}
              to={{
                pathname: compile(PATH_NAMES.category)({ id: categoryId }),
                search: `query=`
              }}
              onClick={() => this.setState({ uncheckedFilterId: filter.id })}
            >
              <MyIcon
                className={styles.closeIcon}
                type={require("!svg-sprite-loader!./circle-close.svg")}
              />
              <span className={styles.label}>
                {filter.name}
              </span>
            </Link>
          </MyTouchFeedback>
        )}
      </Flex>
    );
  }
}

export default SelectedFilters;
