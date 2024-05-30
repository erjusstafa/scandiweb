import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import Img from "../../UI/Img";
import Button from "../../UI/Button";
import Price from "./Prices";
import Attribute from "./Attribute";
import { AppContext } from "../../context";
import { Mutation } from "@apollo/client/react/components";
import SingleAttribute from "./SingleAttribute";
import { INSERT_NEW_PRODUCT } from "../../apollo/queries";
import { ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class QuickShop extends Component {
  render() {
    const { openQuickShop } = this.props;

    return (
      <AppContext.Consumer>
        {(context) => {
          const { basket, handleClickButton, updateBasketState } = context;

          function removeTypename(obj) {
            if (Array.isArray(obj)) {
              return obj.map(removeTypename);
            } else if (obj !== null && typeof obj === "object") {
              const newObj = {};
              for (const prop in obj) {
                if (prop !== "__typename" && prop !== "optionClicked") {
                  newObj[prop] = removeTypename(obj[prop]);
                }
              }
              return newObj;
            } else {
              return obj;
            }
          }

          //insert product to the db
          const handleInsertProduct = (insertNewProduct) => {
            removeTypename(basket).forEach((item) => {
              insertNewProduct({
                variables: { productInput: item },
              })
                .then((response) => {
                  console.log("Product inserted:", response.data);
                  updateBasketState([]); //Once order is placed, cart is emptied
                  toast.success("Order placed successfully!", { autoClose: 1000 });
                })
                .catch((error) => {
                  if (error.networkError) {
                    console.error(
                      "Network error:",
                      error?.networkError?.message
                    );
                  } else if (error.graphQLErrors) {
                    error.graphQLErrors.forEach((graphQLError) => {
                      console.error("GraphQL error:", graphQLError.message);
                      // Handle GraphQL errors, e.g., display validation errors to the user.
                    });
                  } else if (error instanceof ApolloError) {
                    console.error(
                      "ApolloError inserting product:",
                      error?.message
                    );
                  } else {
                    console.error("Error inserting product:", error);
                  }
                });
            });
          };

          const generateUniqueKey = (id, attributes) => {
            const attributesString = JSON.stringify(attributes);
            return `${id}-${attributesString}`;
          };
          const getTotalPrice = () => {
            return basket.reduce((total, item) => {
              const itemPrice = item.prices[0].amount * item.quantity;
              return total + itemPrice;
            }, 0);
          };

          const itemQuantity = () => {
            return basket.reduce((total, item) => {
              const itemPrice = item.quantity;
              return total + itemPrice;
            }, 0);
          };

          const totalPrice = getTotalPrice();
          const totalItem = itemQuantity();

          return (
            <Mutation mutation={INSERT_NEW_PRODUCT}>
              {(insertNewProduct, { loading, error }) => (
                <div
                  className={
                    openQuickShop ? "modal-container open" : "modal-container"
                  }
                >
                  <div className="wraper-quickshop">
                    <span className="wraper-title">
                      My Bag, &nbsp; <p>{totalItem} items</p>
                    </span>
                    {Object.values(basket)
                      .map((product) => {
                        const uniqueKey = generateUniqueKey(
                          product.id,
                          product.attributes
                        );
                        return (
                          <div key={uniqueKey} className="item-added">
                            <div
                              className="wrapper-item"
                              style={{ pointerEvents: "none" }}
                            >
                              <div className="item-name-add">
                                <p>{product.name ?? ""}</p>
                              </div>
                              {Array.isArray(product.prices) &&
                                product.prices.map((price, index) => (
                                  <React.Fragment key={index}>
                                    <Price
                                      price={price}
                                      singleProductDetails={product}
                                    />
                                  </React.Fragment>
                                ))}

                              {product.optionClicked
                                ? Array.isArray(product?.attributes) &&
                                  product?.attributes.map((opt, index) => {
                                    return (
                                      <React.Fragment key={index}>
                                        <SingleAttribute opt={opt} />
                                      </React.Fragment>
                                    );
                                  })
                                : Array.isArray(product?.attributes) &&
                                  product.attributes.map((attribute) => (
                                    <React.Fragment key={attribute?.id}>
                                      <Attribute
                                        singleProductDetails={product}
                                        attribute={attribute}
                                        stock={product?.inStock}
                                      />
                                    </React.Fragment>
                                  ))}
                            </div>
                            <div className="quickshop-button">
                              <Button
                                data-testid="cart-item-amount-decrease"
                                className="add-button"
                                icon={"+"}
                                height="20px"
                                width="20px"
                                handleOnClick={() =>
                                  handleClickButton("ADD", product)
                                }
                              />
                              <span data-testid="cart-item-amount">
                                {product.quantity}
                              </span>
                              <Button
                                data_testid="cart-item-amount-increase"
                                className="add-button"
                                icon={"-"}
                                height="20px"
                                width="20px"
                                handleOnClick={() =>
                                  handleClickButton("DELETE", product)
                                }
                              />
                            </div>
                            <div className="item-image">
                              <Img
                                className=""
                                src={product?.gallery ?? ""}
                                height="100%"
                                width="100%"
                                alt={product.name ?? ""}
                              />{" "}
                            </div>
                          </div>
                        );
                      })
                      .reverse()}

                    <div className="total" data-testid="cart-total">
                      <span>Total</span>
                      <span>$ {totalPrice.toFixed(2)} </span>
                    </div>

                    <Button
                      className={`${
                        basket.length > 0
                          ? "place-order"
                          : "place-order-disabled"
                      }`}
                      icon={
                        loading
                          ? "Placing order...".toUpperCase()
                          : "place order".toUpperCase()
                      }
                      height="43px"
                      width="auto"
                      handleOnClick={() => {
                        handleInsertProduct(insertNewProduct);
                      }}
                    />
                    {error && (
                      <p style={{ color: "red" }}>
                        Error placing order: {error.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Mutation>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
QuickShop.propTypes = {
  openQuickShop: PropTypes.bool,
};
export default QuickShop;
