import { Component } from "react";
import PropTypes from "prop-types";

class Price extends Component {
  render() {
    const { price } = this.props;
    return (
      <span className="item-price">
        <p>{price?.currency?.symbol}</p>
        <p>{price.amount.toFixed(2)}</p>
      </span>
    );
  }
}

Price.propTypes = {
  price: PropTypes.object,
};
export default Price;
