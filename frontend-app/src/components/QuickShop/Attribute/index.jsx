import { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../UI/Button";
class Attribute extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, attribute, isClicked, handleOnClick } = this.props;

    return (
      <div className="atr-size" data-testid={`product-attribute-${attribute?.name}`}>
        <div className={attribute.name}>
          <span className="atr-name">{attribute?.name}</span>

          <div className={`attributes-nested`}>
            {attribute.items.map((atr) => {
              return (
                <Button
                  key={atr.id}
                   className={`${
                    attribute.name === "Color"
                      ? "attributes-items color-box"
                      : " attributes-items out "
                  }`}
                  id={`${
                    isClicked &&
                    isClicked[attribute?.id] === atr?.id &&
                    item?.inStock
                      ? "active "
                      : "  "
                  }  ${item?.inStock ? "attributes in" : " attributes out"}`}
                  backgroundColor={atr.value}
                  icon={attribute.name !== "Color" && atr.value}
                  handleOnClick={() => {
                    handleOnClick(atr, attribute.id);
                  }}
                ></Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

Attribute.propTypes = {
  key: PropTypes.string,
  isClicked: PropTypes.any,
  attribute: PropTypes.object,
  item: PropTypes.object,
  handleOnClick: PropTypes.func,
};
export default Attribute;
