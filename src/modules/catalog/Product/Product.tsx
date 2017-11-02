import { MyIcon, Price } from "@src/modules/common";
import { MyTouchFeedback } from "@src/modules/common/utils";
import { Images } from "@src/modules/product";
import { IImages } from "@src/modules/product/model";
import { IRootReducer } from "@src/rootReducer";
import { Card } from "antd-mobile";
import { compile } from "path-to-regexp";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { IProduct } from "../../product/model";
import { ICatalogReducer } from "../reducer";

const styles = require("./styles.css");

const getMinOfArray = numArray => {
  return Math.min.apply(null, numArray);
};

interface StateProps {
  viewedProductIds: any;
}

interface OwnProps extends IProduct {}

interface State {
  titleImage: IImages;
}

class Product extends React.Component<StateProps & OwnProps, State> {
  componentWillMount() {
    const { images } = this.props;
    this.setState({
      titleImage: images.filter(img => img.isTitle)[0] || images[0]
    });
  }

  isViewed() {
    const { viewedProductIds, id } = this.props;
    return viewedProductIds.indexOf(parseInt(id, 0)) !== -1;
  }

  changeTitleImage = (e, image) => {
    this.setState({ titleImage: image });
  };

  getLinkProps = () => {
    const { id, subProducts, brand } = this.props;
    const subProduct = subProducts[0];
    return {
      to: {
        pathname: compile(`/product/:id/`)({ id }),
        state: {
          modal: true,
          title: `${brand.name} ${subProduct.article}`
        }
      }
    };
  };

  render() {
    const { id, name, subProducts, brand, images } = this.props;
    const titleImage = this.state.titleImage;
    const subProduct = subProducts[0];
    const prices = subProducts.map(el => el.price);
    const isSinglePrice = prices.length === 1;
    const minPrice = getMinOfArray(prices);

    const width = Math.round(window.innerWidth / 2) - 5;
    console.log("Product.render");
    return (
      <MyTouchFeedback>
        <div className={styles.Product} style={{ width }}>
          <Card>
            {this.isViewed() &&
              <MyIcon
                type={require("!svg-sprite-loader!./viewed.svg")}
                size="sm"
                className={styles.isViewed}
              />}
            <Images
              images={images}
              objectFitSize={{ width: "90%", height: "90%" }}
              dotHeight={10}
              linkProps={this.getLinkProps()}
            />
            <MyTouchFeedback>
              <Link {...this.getLinkProps()}>
                <div className={styles.info}>
                  <div className={styles.title}>
                    {name}
                    <br />
                    {brand.name} {subProduct.article}
                  </div>
                  <Price
                    style={{
                      height: subProduct.oldPrice ? "3.5rem" : "3rem",
                      justifyContent: subProduct.oldPrice ? "center" : "left",
                      display: "flex",
                      alignItems: subProduct.oldPrice ? "left" : "center"
                    }}
                    price={subProduct.price}
                    oldPrice={subProduct.oldPrice}
                  />
                </div>
              </Link>
            </MyTouchFeedback>
          </Card>
        </div>
      </MyTouchFeedback>
    );
  }
}

const mapStateToProps = (state: IRootReducer): StateProps => ({
  viewedProductIds: state.catalog.viewedProductIds
});

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(Product);
