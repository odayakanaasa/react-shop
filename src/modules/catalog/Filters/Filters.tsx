import { MyIcon } from "@src/modules/common";
import { IImages } from "@src/modules/product/model";
import { Accordion, Flex, List, Switch } from "antd-mobile";
import gql from "graphql-tag";
import * as React from "react";
import { graphql, OperationOption, QueryProps } from "react-apollo";
import { compose } from "redux";

import Loading from "../../common/Loading/Loading";
import { MyTouchFeedback, Aux } from "../../common/utils";
import { IFilter } from "../model";

const styles = require("./styles.css");

interface IAmount {
  current: number;
  total: number;
}

interface IDataFilteredProducts extends QueryProps {
  filteredProducts: {
    filters: [IFilter];
    total: number;
    // products?: IProduct[];
  };
}

interface OwnProps {
  categoryId: number;
  // filters: [IFilter];
  // amount: IAmount;
}

interface State {
  titleImage: IImages;
}

export interface GraphQLProps {
  dataFilteredProducts: IDataFilteredProducts;
}

interface Props extends OwnProps, GraphQLProps {}

class Filters extends React.Component<Props, State> {
  // render() {
  //   const { filters, amount } = this.props;
  //   return (
  //     <div>
  //       <div className={styles.amount}>
  //         Товаров: {amount.current} / {amount.total}
  //       </div>
  //       <List className={styles.Filters}>
  //         {filters.map(filter =>
  //           <List.Item
  //             key={filter.id}
  //             extra={filter.type === "B" ? <Switch checked={true} /> : null}
  //             header={

  //                 ? <div />
  //                 : <MyTouchFeedback>
  //                     <Flex>
  //                       <div>
  //                         {filter.name}
  //                       </div>
  //                     </Flex>
  //                   </MyTouchFeedback>
  //             }
  //             className={styles.header}
  //           >
  //             <List className={styles.content}>
  //               {filter.values!.map((value, i) =>
  //                 <List.Item key={i} className={styles.value}>
  //                   {value.name}
  //                 </List.Item>
  //               )}
  //             </List>
  //           </List.Item>
  //         )}
  //       </List>
  //     </div>
  //   );
  // }

  handleClick = url => {
    const {
      dataFilteredProducts: { refetch, loading },
      categoryId
    } = this.props;
    if (!loading) {
      refetch({ categoryId, filterStr: url });
    }
  };

  getFilter = (filter: IFilter, total) => {
    const { categoryId } = this.props;
    const { dataFilteredProducts } = this.props;
    const { refetch } = dataFilteredProducts;

    /* Colors */
    if (filter.isColor) {
      return (
        <Accordion.Panel
          headerClass={styles.colors}
          // style={{ marginRigth: -20 }}
          key={String(filter.id)}
          showArrow={false}
          header={
            <Flex
              wrap="wrap"
              align="center"
              style={{
                padding: 0,
                width: "100%",
                height: "100%",
                marginLeft: 10
              }}
            >
              {filter.values!
                .filter(color => color.count !== total)
                .map((value, i) =>
                  <div
                    onClick={() => this.handleClick(value.url)}
                    key={i}
                    className={styles.colorItem}
                  >
                    <div className={styles.colorCount}>
                      {value.count}
                    </div>
                    <MyIcon
                      className={styles.color}
                      // type={require("svg-sprite-loader!./checked-circle.svg")}
                      type={require("svg-sprite-loader!./circle.svg")}
                      style={{
                        fill: value.value
                      }}
                    />
                    {value.isChecked &&
                      <MyIcon
                        className={styles.color}
                        type={require("svg-sprite-loader!./checked-circle.svg")}
                        style={{
                          fill: "green",
                          width: "1.1rem",
                          height: "1.1rem",
                          position: "absolute",
                          top: -4,
                          right: -4,
                        }}
                      />}
                  </div>
                )}
            </Flex>
          }
        />
      );
    }

    /* Bolean */
    if (filter.type === "B") {
      return (
        <Accordion.Panel
          key={String(filter.id)}
          showArrow={false}
          header={
            <Flex
              justify="between"
              style={{ paddingLeft: 0, marginRight: "-20px" }}
              onClick={() => this.handleClick(filter.values[0].url)}
            >
              <div>
                {filter.name}
                <div className={styles.count}>
                  {filter.values[0].count}
                </div>
              </div>
              <Switch
                checked={filter.values[0].isChecked}
                onChange={() => this.handleClick(filter.values[0].url)}
              />
            </Flex>
          }
        />
      );

      /* Multi Select */
    } else if (filter.type !== "B") {
      return (
        <Accordion.Panel
          key={String(filter.id)}
          accordion={true}
          // showArrow={true}
          showArrow={false}
          header={filter.name}
        >
          <List>
            {filter.values!.filter(value => value.count).map((value, ii) =>
              <List.Item
                disabled={!value.isChecked && value.count === total}
                onClick={() => this.handleClick(value.url)}
                key={ii}
                className={styles.value}
                thumb={
                  value.isChecked
                    ? <MyIcon
                        className={styles.checkIcon}
                        type={require("svg-sprite-loader!./checked-circle.svg")}
                        style={{
                          fill: "green"
                        }}
                      />
                    : <MyIcon
                        className={styles.checkIcon}
                        type={require("svg-sprite-loader!./empty-circle.svg")}
                        style={{
                          fill: "gray"
                        }}
                      />
                }
              >
                {value.name}
                <div className={styles.count}>
                  {value.count}
                </div>
                {value.isChecked === true}
              </List.Item>
            )}
          </List>
        </Accordion.Panel>
      );
    }
  };

  render() {
    const { dataFilteredProducts: { loading, filteredProducts } } = this.props;
    if (loading && !filteredProducts) {
      return <Loading />;
    }
    const { filters, total } = filteredProducts;
    const amount = {
      current: 10,
      total
    };

    return (
      <div style={{ height: "100%", widht: "100%" }}>
        {loading &&
          <div className={styles.loading}>
            <MyIcon type="loading" size="lg" />
          </div>}
        <Flex
          direction="column"
          className={styles.Filters}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <div className={styles.title}>
            Товаров:
            {amount.current} / {amount.total}
          </div>
          <Accordion
            activeKey={filters.map(filter => String(filter.id))}
            className={styles.accordion}
          >
            {filters.map(filter => this.getFilter(filter, total))}
          </Accordion>
        </Flex>
      </div>
    );
  }
}

const FILTERED_PRODUCTS_QUERY = gql(require("./filteredProducts.gql"));
const filteredProductsOptions: OperationOption<OwnProps, GraphQLProps> = {
  options: props => ({
    // fetchPolicy: "cache-first",
    variables: {
      categoryId: props.categoryId,
      filterStr: ""
    }
  }),
  name: "dataFilteredProducts"
};

// <List className={styles.content}>
// {filter.values!.map((value, i) =>
//   <List.Item key={i} className={styles.value}>
//     {value.name}
//   </List.Item>
// )}
// </List>

export default compose(
  graphql<GraphQLProps, OwnProps>(
    FILTERED_PRODUCTS_QUERY,
    filteredProductsOptions
  )
)(Filters as any) as any;
