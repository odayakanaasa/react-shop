import { MyIcon } from "@src/modules/common";
import { MyTouchFeedback } from "@src/modules/common/utils";
import { IRootReducer } from "@src/rootReducer";
import { PATH_NAMES } from "@src/routes";
import { IPage, IRouterReducer } from "@src/routes/interfaces";
import { Flex } from "antd-mobile";
import * as React from "react";
import { CSSProperties } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const styles = require("./styles.css");

interface OwnProps extends IPage {}

interface StateProps {
  router: IRouterReducer;
}

class Footer extends React.Component<OwnProps & StateProps, {}> {
  isFlatpage = () => {
    const { router: { location }, history } = this.props;
    return location!.pathname.indexOf("flatpage") !== -1;
  };

  renderSection = (title, icon, pathname, modal) => {
    const { router: { location }, history } = this.props;
    const isCurrent = location!.pathname === pathname;
    const content = (
      <MyTouchFeedback style={{ backgroundColor: "lightgray" }}>
        <Flex
          justify="center"
          direction="column"
          style={{ height: "100%", padding: "0 1rem" }}
        >
          <MyIcon
            className={styles.icon}
            type={icon}
            style={{
              fill: isCurrent ? "orange" : "black"
            }}
          />
          <div className={styles.label}>
            {title}
          </div>
        </Flex>
      </MyTouchFeedback>
    );
    return isCurrent
      ? <div
          className={styles.item}
          onClick={e => {
            e.stopPropagation();
            history.goBack();
          }}
        >
          {content}
        </div>
      : <Link
          to={{
            pathname,
            state: {
              modal,
              animated: true
            }
          }}
          className={styles.item}
        >
          {content}
        </Link>;
  };

  render() {
    const { router: { location } } = this.props;
    const { pathname } = location!;
    if (pathname === PATH_NAMES.home || pathname.indexOf("category")) {
      return (
        <Flex justify="around" align="center" className={styles.Footer}>
          {this.renderSection(
            "Каталог",
            require("!svg-sprite-loader!./catalog.svg"),
            PATH_NAMES.catalog,
            false
          )}
          {this.renderSection(
            "Инфо",
            require("!svg-sprite-loader!./info.svg"),
            PATH_NAMES.flatpages,
            true
          )}
        </Flex>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IRootReducer): StateProps => ({
  router: state.router
});

export default connect(mapStateToProps)(Footer);
