import { MyIcon } from "@src/modules/common";
import { PATH_NAMES } from "@src/routes";
import { Flex } from "antd-mobile";
import { compile } from "path-to-regexp";
import * as queryString from "query-string";
import * as React from "react";

import { MyHistory } from "../../../routes/interfaces";
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
  history: MyHistory;
  openFilters: boolean;
}

interface State {
  uncheckedFilterId?: number;
}

interface Props extends OwnProps {}

class SelectedFilters extends React.Component<Props, State> {
  state = {
    uncheckedFilterId: undefined
  };

  handleClick = (filter: IFilter) => {
    const { categoryId, history } = this.props;
    const GET = queryString.parse(history.location.search);
    GET.filters = filter.resetUrl;
    history.push(
      `${compile(PATH_NAMES.category)({
        id: categoryId
      })}?${queryString.stringify(GET)}`
    );
    this.setState({ uncheckedFilterId: filter.id });
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.openFilters === nextProps.openFilters) {
      // Prevent rerender whan sidebar is toggled
      return false;
    }
    return true;
  }

  render() {
    console.log("SelectedFilters.render");
    const { filters, categoryId, style, openFilters } = this.props;
    const checkedFilters = getSelectedFilters(filters).filter(
      filter => filter.id !== this.state.uncheckedFilterId
    );
    if (checkedFilters.length === 0) {
      return null;
    }
    return (
      <Flex style={style} className={styles.SelectedFilters} direction={openFilters ? "row" : "column"} wrap="wrap">
        {checkedFilters.map((filter, i) =>
          <MyTouchFeedback key={i}>
            <div
              className={styles.item}
              onClick={() => {
                this.handleClick(filter);
              }}
            >
              <MyIcon
                className={styles.closeIcon}
                type={require("!svg-sprite-loader!./circle-close.svg")}
              />
              <span className={styles.label}>
                {filter.name}
              </span>
            </div>
          </MyTouchFeedback>
        )}
      </Flex>
    );
  }
}

export default SelectedFilters;
