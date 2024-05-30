import { createContext, Component } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContext = createContext();

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basket: [],
      clickedBasket: [],
      selectedAttributes: [],
      isClicked: {},
    };
  }

  componentDidMount() {
    const storedState = localStorage.getItem("appState");
    if (storedState) {
      this.setState(JSON.parse(storedState));
    }
  }

  componentDidUpdate() {
    localStorage.setItem("appState", JSON.stringify(this.state));
  }
  // Handle different actions related to cart and clicked items
  handleClickButton = (action, product, hoveredProduct) => {
    const { basket, clickedBasket } = this.state;
    const productIndex = basket.findIndex((item) => item.id === product.id);
    const isProductInClickedBasket = clickedBasket.includes(product?.id);
    const isItemInCart = basket.some((cartItem) => cartItem.id === product.id); // check if the item is already in the cart
    const existingCartItemIndex = basket.findIndex((cartItem) =>
      this.areAttributesEqual(cartItem.attributes, product.attributes)
    );
    switch (action) {
      case "TOGGLE":
        if (productIndex !== -1 || isProductInClickedBasket) {
          this.removeFromCart(product.id);
          toast.success("Product removed from cart", {
            autoClose: 1000,
            style: {
              background: "var(--white)",
              color: "var(--red)",
            },
          });
        } else {
          this.setState((prevState) => ({
            basket: [...prevState.basket, product],
            clickedBasket: [...prevState.clickedBasket, hoveredProduct],
          }));
          toast.success("Product added to cart", { autoClose: 1000 });
        }
        break;
      case "ADD":
        if (isItemInCart) {
          this.setState({
            basket: basket.map((cartItem) =>
              cartItem.id === product.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });
        } else {
          this.setState({
            basket: [...basket, { ...product, quantity: 1 }],
          });
          toast.success("Product added to cart", { autoClose: 1000 });
        }
        break;
      case "DELETE":
        this.setState((prevState) => ({
          clickedBasket: prevState.clickedBasket.filter(
            (id) => id !== product.id
          ),
        }));
        if (existingCartItemIndex !== -1) {
          // If the item exists, decrease its quantity
          const updatedBasket = basket
            .map((cartItem, index) => {
              if (index === existingCartItemIndex) {
                const newQuantity = cartItem.quantity - 1;
                return newQuantity > 0
                  ? { ...cartItem, quantity: newQuantity }
                  : null; // Return null if quantity is 0
              }
              return cartItem;
            })
            .filter(Boolean); // Filter out null values
          this.updateBasketState(updatedBasket);
        } else {
          console.log("Item with specified attributes not found in the cart");
        }
        break;
      default:
        break;
    }
  };

  removeFromCart = (productId) => {
    this.setState((prevState) => ({
      basket: prevState.basket.filter((item) => item.id !== productId),
      clickedBasket: prevState.clickedBasket.filter((id) => id !== productId),
    }));
  };

  // Update the basket state and synchronize clickedBasket if necessary
  updateBasketState = (updBasket) => {
    this.setState({ basket: updBasket });
    if (this.state.basket.length === 1) {
      this.setState({ clickedBasket: updBasket });
    }
  };

  // Add or remove a single attribute for a product
  addSingleAttribute = (items, id) => {
    this.setState((prevState) => {
      // Check if the attribute already exists
      const existingAttributeIndex = prevState.selectedAttributes.findIndex(
        (attr) => attr.id === id
      );
      // If the attribute exists, remove it; otherwise, add a new one
      if (existingAttributeIndex !== -1) {
        const updatedAttributes = prevState.selectedAttributes.filter(
          (_, index) => index !== existingAttributeIndex
        );
        return { selectedAttributes: updatedAttributes };
      } else {
        return {
          selectedAttributes: [
            ...prevState.selectedAttributes,
            { items: [items], id },
          ],
        };
      }
    });
  };

  // Empty the selectedAttributes array
  emptySelectedAttributes = () => {
    this.setState({ selectedAttributes: [] });
  };

  // Reset the isClicked object
  emptyClicked = () => {
    this.setState({ isClicked: {} });
  };

  // Toggle the clicked attribute state
  isClickedAtribute = (id, atributeId) => {
    // Check if the clicked item is already active
    this.setState((prevState) => {
      const isActive = prevState.isClicked[id] === atributeId;
      return {
        isClicked: {
          ...prevState.isClicked,
          [id]: isActive ? null : atributeId,
        },
      };
    });
  };

  // Compare two attribute arrays for equality
  areAttributesEqual = (attr1, attr2) => {
    if (attr1.length !== attr2.length) {
      return false;
    }

    // Sort the attributes arrays to ensure consistent comparison
    const sortedAttr1 = attr1.slice().sort();
    const sortedAttr2 = attr2.slice().sort();

    // Compare each attribute to check for equality
    for (let i = 0; i < sortedAttr1.length; i++) {
      const isEqual =
        JSON.stringify(sortedAttr1[i]) === JSON.stringify(sortedAttr2[i]);
      if (!isEqual) {
        return false;
      }
    }

    return true;
  };
  render() {
    const { basket, clickedBasket, selectedAttributes, isClicked } = this.state;

    return (
      <AppContext.Provider
        value={{
          basket: basket,
          clickedBasket: clickedBasket,
          selectedAttributes: selectedAttributes,
          isClicked: isClicked,
          handleClickButton: this.handleClickButton,
          removeFromCart: this.removeFromCart,
          updateBasketState: this.updateBasketState,
          emptySelectedAttributes: this.emptySelectedAttributes,
          addSingleAttribute: this.addSingleAttribute,
          emptyClicked: this.emptyClicked,
          isClickedAtribute: this.isClickedAtribute,
          areAttributesEqual: this.areAttributesEqual,
        }}
      >
        {this.props.children}
        <ToastContainer position="bottom-left" />
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProvider, AppContext };
