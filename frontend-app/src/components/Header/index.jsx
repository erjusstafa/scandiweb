import { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { GET_CATEGORIES } from "../../apollo/queries";
import PropTypes from "prop-types"; // Import PropTypes
import "./style.css";
import logo from "../../assets/logo.png";
import Img from "../../UI/Img";
import { SlBasket } from "react-icons/sl";
import QuickShop from "../QuickShop";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: "all", // Initially set active link to 'all'
      toggle: false,
      openQuickShop: JSON.parse(localStorage.getItem("openQuickShop")) || false, // Load from localStorage
    };
  }
  componentDidMount() {
    const { openQuickShop } = this.state;
    localStorage.setItem("openQuickShop", JSON.stringify(openQuickShop)); // Save to localStorage
  }

  componentDidUpdate(prevProps, prevState) {
    const { openQuickShop } = this.state;
    if (prevState.openQuickShop !== openQuickShop) {
      localStorage.setItem("openQuickShop", JSON.stringify(openQuickShop)); // Update localStorage
    }
  }

  handleToggle = () => {
    this.setState({ toggle: !this.state.toggle });
  };

  handleActiveLinkClick = (link) => {
    this.setState({ activeLink: link });
  };

  handleOpenQuickShop = () => {
    this.setState((prevState) => ({
      openQuickShop: !prevState.openQuickShop,
    }));
  };

  handleCloseQuickShop = () => {
    this.setState({ openQuickShop: false });
  };
  render() {
    const { activeLink, toggle, openQuickShop } = this.state;
    const { link, handleCategoryClick } = this.props;

    return (
      <Query query={GET_CATEGORIES}>
        {({ error: categoriesError, data: categoriesData }) => {
          if (categoriesError)
            return <p>Error fetching categories: {categoriesError.message}</p>;

          return (
            <AppContext.Consumer>
              {(context) => {
                const { basket, emptySelectedAttributes, emptyClicked } =
                  context;
                const handleOpenQuickShop = () => {
                  this.setState({ openQuickShop: !this.state.openQuickShop });
                  emptySelectedAttributes();
                  emptyClicked();
                };
                return (
                  <header className={`Navbar ${toggle && "open"}`}>
                    {" "}
                    <div
                      className={`nav-toggle ${toggle && "open"}`}
                      onClick={this.handleToggle}
                    >
                      <div className="bar"></div>
                    </div>
                    <ul className={`nav-items ${toggle && "open"}`}>
                      {/* Render category names */}
                      {Object.values(categoriesData?.categories || []).map(
                        (category) => {
                          return (
                            <Link
                              to={link}
                              data-testid={
                                activeLink === category.name
                                  ? "active-category-link"
                                  : "category-link"
                              }
                              className={
                                activeLink === category.name
                                  ? "li active"
                                  : "li"
                              }
                              key={category.name}
                              onClick={() => {
                                handleCategoryClick(category.name);
                                this.handleActiveLinkClick(category.name);
                                this.setState({ toggle: false });
                              }}
                            >
                              {category.name.toUpperCase()}
                            </Link>
                          );
                        }
                      )}
                    </ul>
                    <div className="nav-logo">
                      <Img
                        className={"logo"}
                        src={logo}
                        height={"41px"}
                        width={"41px"}
                        alt={"logo"}
                      />
                    </div>
                    <div
                      className={` ${
                        toggle ? "nav-basket  open" : "nav-basket"
                      }`}
                      data-testid="cart-btn"
                      onClick={handleOpenQuickShop}
                    >
                      <SlBasket className="basket-icon" />
                      {basket.length > 0 && (
                        <span>{basket && basket.length}</span>
                      )}
                    </div>
                    {openQuickShop && (
                      <QuickShop openQuickShop={openQuickShop} />
                    )}
                  </header>
                );
              }}
            </AppContext.Consumer>
          );
        }}
      </Query>
    );
  }
}

Header.propTypes = {
  link: PropTypes.string,
  openQuickShop: PropTypes.bool,
  handleCategoryClick: PropTypes.func,
};
export default Header;
