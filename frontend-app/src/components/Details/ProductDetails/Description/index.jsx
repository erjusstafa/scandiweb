import { Component } from "react";
import PropTypes from "prop-types";

class Description extends Component {
  render() {
    const { showAll, convertNodesToReact, parsedDescription, toggleShow } =
      this.props;
    return (
      <div id="description" data-testid='product-description' >
        {showAll
          ? convertNodesToReact(parsedDescription)
          : convertNodesToReact(parsedDescription.slice(0, 1))}
        {parsedDescription.length > 3 && (
          <span className="show-les-button" onClick={toggleShow}>
            {showAll ? "Show less" : "Show more"}
          </span>
        )}
      </div>
    );
  }
}
Description.propTypes = {
  showAll: PropTypes.bool,
  convertNodesToReact: PropTypes.func,
  toggleShow: PropTypes.func,
  parsedDescription: PropTypes.array,
};
export default Description;
