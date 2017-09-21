import { Flex, Icon } from "antd-mobile";
import * as React from "react";

import { Modal, utils } from "../../layout/index";
import { HEIGHT } from "../Header/Header";

const styles = require("./styles.css");

function createMarkup(html) {
  return { __html: html };
}

class FlatPageModal extends React.Component<any, any> {
  render() {
    const { match, history, location } = this.props;
    const id = match.params.id;
    const page = location.state.pages.filter(el => el.id === id);
    return (
      <Modal location={location} history={history}>
        <div
          className={styles.flatpage}
          dangerouslySetInnerHTML={createMarkup(page.map(el => el.content))}
          style={{
            padding: utils.isSafariBrowser() ? 10 : 0,
            textAlign: "left"
          }}
        />
      </Modal>
    );
  }
}

export default FlatPageModal;
