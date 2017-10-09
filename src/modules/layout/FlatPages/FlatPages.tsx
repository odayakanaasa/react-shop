import { Icon, Loading } from "@src/modules/common";
import { PATH_NAMES } from "@src/routes";
import { List } from "antd-mobile";
import gql from "graphql-tag";
import { compile } from "path-to-regexp";
import * as React from "react";
import { graphql, QueryProps } from "react-apollo";
import { Link } from "react-router-dom";

import { IFlatPage } from "../model";

const styles = require("./styles.css");

interface IFlatPagesData extends QueryProps {
  flatPages: [IFlatPage];
}

interface GraphQLProps {
  data: IFlatPagesData;
}

function createMarkup(html) {
  return { __html: html };
}

class FlatPages extends React.Component<GraphQLProps, {}> {
  state = {
    page: {
      content: "",
      id: "",
      name: ""
    }
  };

  getIcon = id => {
    // tslint:disable-next-line:variable-name
    const _id = parseInt(id, 10);
    switch (_id) {
      // info
      case 4: {
        return require("!svg-sprite-loader!./about.svg");
      }
      // contacts
      case 5: {
        return require("!svg-sprite-loader!./phone.svg");
      }
      // exchange and return
      case 8: {
        return require("!svg-sprite-loader!./exchange.svg");
      }
      // make order
      case 7: {
        return require("!svg-sprite-loader!./order.svg");
      }
      // buyers
      case 10: {
        return require("!svg-sprite-loader!./buyers.svg");
      }
      // discount card
      case 6: {
        return require("!svg-sprite-loader!./discount.svg");
      }
      // schedule of work
      case 14: {
        return require("!svg-sprite-loader!./schedule.svg");
      }
      // shipping and payment
      case 2: {
        return require("!svg-sprite-loader!./shipping.svg");
      }
      // rozygrish
      case 15: {
        return require("!svg-sprite-loader!./roulette.svg");
      }
      // suppliers
      case 11: {
        return require("!svg-sprite-loader!./suppliers.svg");
      }
      // guarantee
      case 3: {
        return require("!svg-sprite-loader!./guarantee.svg");
      }
      default: {
        return require("!svg-sprite-loader!./transport.svg");
      }
    }
  };

  getLinkProps = (flatPage: IFlatPage) => {
    const { id, name } = flatPage;
    return {
      to: {
        pathname: compile(PATH_NAMES.flatpage)({ id }),
        state: {
          modal: true,
          title: name,
          pages: this.props.data.flatPages
        }
      }
    };
  };

  render() {
    const { data } = this.props;
    if (!data) {
      return <div />;
    }

    const { loading, flatPages } = data;
    if (loading === true) {
      return <Loading />;
    }

    return (
      <div>
        <List>
          {flatPages.map(page =>
            <Link key={page.id} {...this.getLinkProps(page)}>
              <List.Item
                wrap={true}
                arrow="horizontal"
                thumb={
                  <Icon
                    className={styles.icon}
                    type={this.getIcon(page.id)}
                    size="md"
                  />
                }
              >
                {page.name}
              </List.Item>
            </Link>
          )}
        </List>
      </div>
    );
  }
}

const FLATPAGES_QUERY = gql(require("./flatpages.gql"));

export default graphql(FLATPAGES_QUERY)(FlatPages);
