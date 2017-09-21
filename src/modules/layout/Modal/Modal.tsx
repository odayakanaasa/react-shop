import { Flex, Icon, Modal } from "antd-mobile";
import * as React from "react";

import { CartTrigger } from "../../cart/index";

const styles = require("./styles.css");

interface IMyModelProps {
  history: any;
  location: any;
}

class MyModal extends React.Component<IMyModelProps, any> {
  back = e => {
    e.stopPropagation();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { children, location } = this.props;
    return (
      <Modal
        className={styles.modal}
        visible={true}
        transparent={false}
        animated={false}
      >
        <Flex className={styles.panel} justify="start" align="center">
          <Icon
            className={styles.back}
            type={require("!svg-sprite-loader!./back.svg")}
            size="md"
            onClick={this.back}
          />
          <div className={styles.title} onClick={this.back}>
            {location.state.title}
          </div>
          <CartTrigger />
        </Flex>
        {children}
      </Modal>
    );
  }
}

export default MyModal as any;
