import { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";

class Input extends Component {
  render() {
    const { type, value, handleOnChange, placeholder, className } = this.props;
    return (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={handleOnChange}
      />
    );
  }
}
Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
};
export default Input;
