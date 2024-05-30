import { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
class Img extends Component {
  render() {
    const { className, data_testid, key, src, alt, height, width, onClick } =
      this.props;

    return (
      <img
        key={key}
        className={className}
        data-testid={data_testid}
        src={src}
        alt={alt}
        height={height}
        width={width}
        onClick={onClick}
      />
    );
  }
}
Img.propTypes = {
  key: PropTypes.any,
  src: PropTypes.any,
  data_testid: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};
export default Img;
