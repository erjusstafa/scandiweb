import { Component } from "react";
import { SlBasket } from "react-icons/sl";
import "./style.css";
import PropTypes from "prop-types";

class Basket extends Component {
  render() {
    const { addRemoveToCart } = this.props;
    return (
      <div className="quickshop-wrapper" onClick={addRemoveToCart}>
        <SlBasket className="quickshop-basket" />
      </div>
    );
  }
}
Basket.propTypes = {
  addRemoveToCart: PropTypes.func,
};
export default Basket;
