import { MyIcon } from "@src/modules/common";
import { MyTouchFeedback, Aux } from "@src/modules/common/utils";
import { IDataAllProduct } from "@src/routes/CategoryPage/CategoryPage";
import { Accordion, Flex, List, Progress, Switch } from "antd-mobile";
import { compile } from "path-to-regexp";
import * as React from "react";
import { QueryProps } from "react-apollo";

import { PATH_NAMES } from "../../../routes/RouteSwitch/RouteSwitch";
import Loading from "../../common/Loading/Loading";
import { IAllProduct, IFilter, IFilterValue } from "../model";

const styles = require("./styles.css");

interface IAmount {
  found: number;
  total?: number;
}

interface IDataFilteredProducts extends QueryProps {
  // filteredProducts: {
  //   filters: [IFilter];
  //   total: number;
  //   // products?: IProduct[];
  // };
  allProducts: IAllProduct;
}

interface OwnProps {
  categoryId: number;
  history: any;
  open: boolean;
  onSetOpen: () => void;
  // filters: [IFilter];
  // amount: IAmount;
}

export interface GraphQLProps {
  // dataFilteredProducts: IDataFilteredProducts;
  dataAllProducts: IDataAllProduct;
}

interface State {
  loading: boolean;
  total?: number;
  checkedValueIds: number[];
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
  state = {
    loading: false,
    total: undefined,
    checkedValueIds: [] as number[]
  };

  handleClick = (value?: IFilterValue) => {
    const {
      categoryId,
      // dataFilteredProducts: { refetch, loading },
      dataAllProducts: { refetch },
      history
    } = this.props;

    let checkedValueIds = this.state.checkedValueIds;
    if (value) {
      if (checkedValueIds.indexOf(value.id) === -1) {
        checkedValueIds.push(value.id);
      } else {
        checkedValueIds = checkedValueIds.filter(id => id !== value.id);
      }
    } else {
      checkedValueIds = [];
    }
    if (!this.state.loading) {
      this.setState({ loading: true, checkedValueIds }, () =>
        refetch({
          categoryId,
          filterStr: value ? value.url : "",
          offset: 0
        }).then(res => {
          this.setState({ loading: false });
        })
      );
    }
    // history.replace(
    //   `${compile(PATH_NAMES.category)({ id: categoryId })}?query=${filterStr}`
    // );
  };

  getFilter = (filter: IFilter, found) => {
    const { categoryId } = this.props;
    const { dataAllProducts } = this.props;
    const { refetch } = dataAllProducts;
    const { checkedValueIds } = this.state;

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
                .filter(color => color.count !== found)
                .map((value, i) =>
                  <div
                    key={i}
                    className={styles.colorItem}
                    onClick={() => this.handleClick(value)}
                  >
                    <div className={styles.colorCount}>
                      {filter.hasChecked && "+"}
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
                    {checkedValueIds.indexOf(value.id) !== -1 &&
                      <MyIcon
                        className={styles.color}
                        type={require("svg-sprite-loader!./checked-circle.svg")}
                        style={{
                          fill: "green",
                          width: "1.1rem",
                          height: "1.1rem",
                          position: "absolute",
                          top: -4,
                          right: -4
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
              onClick={() => this.handleClick(filter.values[0])}
            >
              <div>
                {filter.name}
                <div className={styles.count}>
                  {filter.values[0].count}
                </div>
              </div>
              <Switch
                // checked={filter.values[0].isChecked}
                checked={checkedValueIds.indexOf(filter.values[0].id) !== -1}
                onChange={() => {
                  this.handleClick(filter.values[0]);
                }}
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
            {filter.values!
              .filter(value => value.count !== found || value.isChecked)
              .map((value, ii) =>
                <List.Item
                  disabled={!value.isChecked && value.count === found}
                  onClick={() => this.handleClick(value)}
                  key={ii}
                  className={styles.value}
                  thumb={
                    checkedValueIds.indexOf(value.id) !== -1
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
                    {filter.hasChecked && "+"}
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

  componentWillReceiveProps(nextProps) {
    const { dataAllProducts: { loading, allProducts } } = nextProps;
    if (this.state.loading) {
      this.setState({ loading: false });
    }
    if (!loading && !this.state.total) {
      const total = allProducts.found;
      this.setState({ total });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (!this.props.open) {
      return false;
    }
    return true;
  }

  render() {
    const { onSetOpen, dataAllProducts: { allProducts } } = this.props;
    const { filters, found } = allProducts;
    const total = this.state.total;
    console.log("Filters.render()");
    return (
      <div style={{ height: "100%", widht: "100%" }}>
        {this.state.loading &&
          <div className={styles.darkMask}>
            <div className={styles.loading}>
              <MyIcon type="loading" size="lg" />
            </div>}
          </div>}

        <Flex direction="column" className={styles.Filters}>
          <Flex className={styles.title}>
            <MyTouchFeedback>
              <MyIcon
                className={styles.closeIcon}
                type={require("!svg-sprite-loader!./close.svg")}
                onClick={onSetOpen}
              />
            </MyTouchFeedback>
            <div>
              Найдено {found}
              {found === total ? "" : ` из ${total}`}
            </div>
          </Flex>
          <Progress
            className={`${styles.progress} ${found === this.state.total &&
              styles.finished}`}
            percent={Math.round(found / this.state.total! * 100)}
            position="normal"
            // unfilled={false}
            unfilled={true}
          />
          <Accordion
            activeKey={filters.map(filter => String(filter.id))}
            className={styles.accordion}
          >
            {filters.map(filter => this.getFilter(filter, found))}
          </Accordion>

          <Flex className={styles.buttons} align="center">
            <MyTouchFeedback>
              <div className={styles.button} onClick={onSetOpen}>
                ЗАКРЫТЬ
              </div>
            </MyTouchFeedback>

            <MyTouchFeedback>
              <div
                style={{
                  display: found === total ? "none" : "block",
                  color: "red"
                  // opacity: found === total ? 0.5 : 1
                }}
                className={styles.button}
                onClick={() => this.handleClick()}
              >
                СБРОСИТЬ
              </div>
            </MyTouchFeedback>
          </Flex>
        </Flex>
      </div>
    );
  }
}

// const FILTERED_PRODUCTS_QUERY = gql(require("./filteredProducts.gql"));
// const filteredProductsOptions: OperationOption<OwnProps, GraphQLProps> = {
//   options: props => ({
//     // fetchPolicy: "cache-first",
//     variables: {
//       categoryId: props.categoryId,
//       filterStr: ""
//     }
//   }),
//   name: "dataFilteredProducts"
// };

// <List className={styles.content}>
// {filter.values!.map((value, i) =>
//   <List.Item key={i} className={styles.value}>
//     {value.name}
//   </List.Item>
// )}
// </List>

// export default compose(
//   graphql<GraphQLProps, OwnProps>(
//     FILTERED_PRODUCTS_QUERY,
//     filteredProductsOptions
//   )
// )(Filters);

export default Filters;
