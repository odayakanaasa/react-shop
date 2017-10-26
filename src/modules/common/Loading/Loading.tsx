import { Flex, Icon } from "antd-mobile";
import * as React from "react";

const styles = require("./styles.css");

const Loading = () => {
  return (
    <div className={styles.Loading}>
      <Flex alignContent="center">
        BUY
        <Icon type="loading" className={styles.icon} />
        BAG
      </Flex>
    </div>
  );
};

export default Loading;
