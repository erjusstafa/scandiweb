import { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../UI/Button";

class SingleAttribute extends Component {
  render() {
    const { opt } = this.props;

    return (
      <div className="atr-size" data-testid={`cart-item-attribute-${opt.name}`}>
        {opt.items.map((it) => {
          return (
            <div className={it.name} key={it.id}>
              <span className="atr-name">{opt.id}</span>

              <div className={`attributes-nested`}>
                <Button
                  key={it.id}
                  data_testid={`cart-item-attribute-${opt.name}-${opt.name}-selected`}
                  className={`${
                    opt.id === "Color"
                      ? "attributes-items color-box"
                      : " attributes-items out "
                  }`}
                  id={`${"attributes in"}`}
                  backgroundColor={it.value}
                  icon={opt.id !== "Color" && it.value}
                ></Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

SingleAttribute.propTypes = {
  opt: PropTypes.object,
};

export default SingleAttribute;
