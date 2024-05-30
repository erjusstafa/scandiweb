import { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";

class Button extends Component {
  render() {
    const {
      id,
      data_testid,
      className,
      icon,
      height,
      width,
      backgroundColor,
      handleOnClick,
    } = this.props;
    return (
      <div
        id={id}
        data-testid={data_testid}
        className={className}
        style={{
          height: height,
          width: width,
          backgroundColor: backgroundColor,
        }}
        onClick={handleOnClick}
      >
        {icon}
      </div>
    );
  }
}
Button.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.any,
  disabled: PropTypes.bool,
  data_testid: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.any,
  handleOnClick: PropTypes.func,
};
export default Button;
