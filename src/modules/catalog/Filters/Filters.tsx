import { MyIcon } from "@src/modules/common";
import { IImages } from "@src/modules/product/model";
import { IRootReducer } from "@src/rootReducer";
import { Accordion, Flex, List, Switch } from "antd-mobile";
import * as React from "react";
import { connect } from "react-redux";

import { MyTouchFeedback } from "../../common/utils";
import { IFilter } from "../model";

const styles = require("./styles.css");

interface StateProps {
  // catalog: ICatalogReducer;
}

interface IAmount {
  current: number;
  total: number;
}

interface OwnProps {
  categoryId: number;
  filters: [IFilter];
  amount: IAmount;
  refetch: (variables) => void;
}

interface State {
  titleImage: IImages;
}

class Filters extends React.Component<StateProps & OwnProps, State> {
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
    const { refetch, categoryId } = this.props;
    refetch({ categoryId, filterStr: url });
  };

  getFilter = (filter: IFilter) => {
    const { categoryId } = this.props;
    const refetch = this.props.refetch as any;
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
              {filter.values!.map(
                (value, i) =>
                  value.isChecked
                    ? <MyIcon
                        key={i}
                        className={styles.colorIcon}
                        type={require("svg-sprite-loader!./checked-circle.svg")}
                        onClick={() => this.handleClick(value.url)}
                        style={{
                          fill: value.value,
                          width: "2.4rem",
                          height: "2rem"
                        }}
                      />
                    : <MyTouchFeedback key={i}>
                        <MyIcon
                          className={styles.colorIcon}
                          onClick={() => this.handleClick(value.url)}
                          type={require("svg-sprite-loader!./circle.svg")}
                          style={{
                            fill: value.value,
                            width: "2.4rem",
                            height: "2rem"
                          }}
                        />
                      </MyTouchFeedback>
              )}
            </Flex>
          }
        />
      );
    }
    if (filter.type === "B") {
      return (
        <Accordion.Panel
          key={String(filter.id)}
          showArrow={false}
          header={
            <Flex
              justify="between"
              style={{ paddingLeft: 0, marginRight: "-20px" }}
            >
              <div>
                {filter.name}
              </div>
              <Switch checked={true} />
            </Flex>
          }
        />
      );
    } else if (filter.type !== "B") {
      return (
        <Accordion.Panel
          key={String(filter.id)}
          accordion={true}
          showArrow={true}
          header={filter.name}
        >
          <List>
            {filter.values!.map((value, ii) =>
              <List.Item
                onClick={() => this.handleClick(value.url)}
                key={ii}
                className={styles.value}
                extra={value.isChecked && <MyIcon type="check" size="md" />}
              >
                {value.name}
              </List.Item>
            )}
          </List>
        </Accordion.Panel>
      );
    }
  };

  onChange() {
    console.log("he");
  }
  render() {
    const { filters, amount } = this.props;

    return (
      <div>
        <div className={styles.amount}>
          Товаров: {amount.current} / {amount.total}
        </div>
        <Accordion
          activeKey={filters.map(filter => String(filter.id))}
          className={styles.Filters}
        >
          {filters.map(filter => this.getFilter(filter))}
        </Accordion>
      </div>
    );
  }
}

// <List className={styles.content}>
// {filter.values!.map((value, i) =>
//   <List.Item key={i} className={styles.value}>
//     {value.name}
//   </List.Item>
// )}
// </List>

const mapStateToProps = (state: IRootReducer): StateProps => ({
  // catalog: state.catalog
});

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(Filters);
