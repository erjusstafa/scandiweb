import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import Carousel from "./Carousel";
import Attribute from "../../QuickShop/Attribute";
import Price from "../../QuickShop/Prices";
import Button from "../../../UI/Button";
import { AppContext } from "../../../context";
import Description from "./Description";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      toggleButton: false,
      id: "",
    };
  }

  toggleShow = () => {
    this.setState((prevState) => ({
      showAll: !prevState.showAll,
    }));
  };

  // Function to parse HTML string into an array of DOM nodes
  parseHTML = (html) => {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(html, "text/html");
    return Array.from(doc.body.childNodes);
  };

  // Function to convert a DOM node to a React element
  convertNodeToReact(node, index) {
    if (node.nodeType === Node.TEXT_NODE) {
      return <span key={index}>{node.textContent}</span>;
    } else {
      const tagName = node.tagName.toLowerCase();
      if (["ul", "li"].includes(tagName)) {
        return this.convertNodesToReact(Array.from(node.childNodes));
      }
      const props = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const { name, value } = node.attributes[i];
        props[name] = value;
      }
      return React.createElement(
        tagName,
        { key: index, ...props },
        this.convertNodesToReact(Array.from(node.childNodes))
      );
    }
  }

  // Create a React element with the tag name, props, and child nodes converted to React elements
  convertNodesToReact = (nodes) => {
    return nodes.map((node, index) => this.convertNodeToReact(node, index));
  };

  render() {
    const { showAll, toggleButton } = this.state;
    const { data } = this.props;

    return (
      <AppContext.Consumer>
        {(context) => {
          const {
            basket,
            isClicked,
            selectedAttributes,
            addSingleAttribute,
            updateBasketState,
            isClickedAtribute,
            handleClickButton,
            areAttributesEqual,
          } = context;

          //get clicked data
          const handleClickOption = (attributes, id) => {
            this.setState({ id: id }, () => {
              addSingleAttribute(attributes, id); // Use the updated value of id directly
              isClickedAtribute(id, attributes.id);
            });
          };

          const handleAddSelectedAttrToCart = (item) => {
            // Check if a product with the same attributes already exists in the basket
            const existingCartItemIndex = basket.findIndex((cartItem) =>
              areAttributesEqual(cartItem.attributes, selectedAttributes)
            );

            if (existingCartItemIndex !== -1) {
              // If the item exists, increase its quantity
              const updatedBasket = basket.map((cartItem, index) =>
                index === existingCartItemIndex
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              );
              updateBasketState(updatedBasket);
            } else {
              const newItem = {
                attributes: selectedAttributes,
                id: item.id,
                name: item.name,
                description: item.description,
                optionClicked: true,
                inStock: item.inStock,
                gallery: item.gallery,
                category: item.category,
                prices: [
                  {
                    amount: item.prices[0].amount,
                    currency: {
                      symbol: item.prices[0].currency.symbol,
                      label: item.prices[0].currency.label,
                    },
                  },
                ],
                brand: item.brand,
                quantity: item.quantity,
              };
              updateBasketState([...basket, newItem]);
            }
          };

          const addProductToCart = (item) => {
            //we check if an item has no attribute, we add it directly to the cart
            if (item.attributes.length === 0) {
              handleClickButton("TOGGLE", item);
              this.setState({ toggleButton: !toggleButton });
            } else {
              if (Object.keys(isClicked).length > 0) {
                handleAddSelectedAttrToCart(item);
                toast.success(
                  "Product with specific attribute(s) has been added to cart",
                  { autoClose: 1000 }
                );
              } else {
                handleClickButton("TOGGLE", item);
              }
            }
          };

          return (
            <div className="details-container">
              {Array.isArray(data) &&
                data.map((item) => {
                  return (
                    <div key={item.id} className="details-wrapper">
                      <div className="details-wrapper-img">
                        <div className="details-wrapper-list-img">
                          <Carousel
                            stock={item.inStock}
                            images={data[0].gallery}
                          />
                        </div>
                      </div>
                      <div className="details-wrapper-description">
                        <h2>{item.name}</h2>
                        {Array.isArray(item.attributes) &&
                          item.attributes.map((attribute) => (
                            <React.Fragment key={attribute.id}>
                              <Attribute
                                item={item}
                                isClicked={isClicked}
                                attribute={attribute}
                                handleOnClick={handleClickOption}
                              />
                            </React.Fragment>
                          ))}
                        <h2 className="details-wrapper-price">Price:</h2>
                        {Array.isArray(item.prices) &&
                          item.prices.map((price, index) => (
                            <React.Fragment key={index}>
                              <Price
                                item={item}
                                price={price}
                                atribute={item.attributes}
                              />
                            </React.Fragment>
                          ))}
                        <Button
                          className={
                            item.inStock ? "add-to-cart in" : "add-to-cart out"
                          }
                          data_testid="add-to-cart"
                          icon={
                            item.inStock
                              ? !toggleButton
                                ? "add to cart".toUpperCase()
                                : basket.length > 0
                                ? "remove from cart".toUpperCase()
                                : "add to cart".toUpperCase()
                              : "out of stock".toUpperCase()
                          }
                          height="auto"
                          width="100%"
                          handleOnClick={() => addProductToCart(item)}
                        />
                        <Description
                          showAll={showAll}
                          parsedDescription={this.parseHTML(item.description)}
                          toggleShow={this.toggleShow}
                          convertNodesToReact={this.convertNodesToReact}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

ProductDetails.propTypes = {
  showAll: PropTypes.bool,
  data: PropTypes.array,
};
export default ProductDetails;
