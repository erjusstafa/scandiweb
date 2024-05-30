import { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import PropTypes from "prop-types";
import Img from "../../../UI/Img";
import Basket from "./Basket";
import { AppContext } from "../../../context";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredProduct: "",
      valueInput: "",
      filteredData: props.productsData,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.debouncedHandleOnChange = this.debounce(this.handleOnChange, 1000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productsData !== this.props.productsData) {
      this.setState({
        filteredData: this.props.productsData,
      });
    }
  }

  handleMouseOver = (productId) => {
    this.setState({
      hoveredProduct: productId,
    });
  };

  handleMouseOut = () => {
    this.setState({
      hoveredProduct: null,
    });
  };
  handleOnChange(event) {
    this.setState({
      valueInput: event.target.value,
    });
  }

  handleFilterClick() {
    const { valueInput } = this.state;
    const { productsData } = this.props;
    this.setState({ isLoading: true });

    setTimeout(() => {
      if (valueInput === "") {
        this.setState({
          isLoading: false,
          filteredData: productsData,
          valueInput: "",
        });
      } else {
        const filteredData = productsData.filter((product) =>
          product.name.toLowerCase().includes(valueInput)
        );
        this.setState({
          isLoading: false,
          filteredData: filteredData,
          valueInput: "",
        });
      }
    }, 1000);
  }
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  render() {
    const { hoveredProduct, valueInput, isLoading, filteredData } = this.state;
    const { selectedCategory } = this.props;

    return (
      <AppContext.Consumer>
        {(context) => {
          const { clickedBasket, handleClickButton } = context;

          const addRemoveToCart = (event, product) => {
            event.preventDefault(); // Prevent the default behavior of the link
            event.stopPropagation(); // Prevent the event from bubbling up
            handleClickButton("TOGGLE", product, hoveredProduct);
          };

          return (
            <div className="container-products">
              <h2 className="selected-category">{selectedCategory}</h2>
              <div className="container-input-search">
                <Input
                  type={"text"}
                  value={valueInput}
                  placeholder={"Search for a product..."}
                  className={"input-search"}
                  handleOnChange={this.handleOnChange}
                />
                <Button
                  className="search-button"
                  icon={"Search"}
                  handleOnClick={this.handleFilterClick}
                />
              </div>

              <div className="wrapper-product">
                {isLoading ? (
                  <div className="loader-line" />
                ) : Array.isArray(filteredData) && filteredData.length === 0 ? (
                  <div className="not-found">Not products found!</div>
                ) : (
                  filteredData&& filteredData.map((product) => {
                    const productIsAdded = clickedBasket.includes(product.id);

                    return (
                      <Link
                        to={`/details/${product.id} `}
                        key={product.id}
                        className="card-item"
                        onMouseOver={() => this.handleMouseOver(product.id)}
                        onMouseOut={this.handleMouseOut}
                        data-testid={`product-${product.name}`}
                      >
                        <div
                          className={`wrapper-img-card ${
                            !product.inStock && " disable-item"
                          } `}
                        >
                          <Img
                            className={`card-img ${
                              product.inStock ? " in-stock" : " out-stock"
                            } `}
                            src={product.gallery[0]}
                            alt={product.id}
                            height={"250"}
                            width={"200px"}
                          />

                          {!product.inStock && <p>Out of stock</p>}
                          {product.inStock &&
                            (hoveredProduct === product.id ||
                              productIsAdded) && (
                              <Basket
                                addRemoveToCart={(event) =>
                                  addRemoveToCart(event, product)
                                }
                              />
                            )}
                        </div>
                        <div className="description-item">
                          <p className="product-name">{product.name}</p>
                          {product.prices.map((item, id) => (
                            <span key={id} className="price-item">
                              <p>{item.currency.symbol}</p>
                              <p>{item.amount.toFixed(2)}</p>
                            </span>
                          ))}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        }}
      </AppContext.Consumer>
    );
  }
}
ProductList.propTypes = {
  selectedCategory: PropTypes.string,
  productsData: PropTypes.array,
};

export default ProductList;
