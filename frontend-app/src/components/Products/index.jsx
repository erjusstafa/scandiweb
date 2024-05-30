import { Component } from "react";
import { GET_PRODUCTS_BY_CATEGORY } from "../../apollo/queries";
import { Query } from "@apollo/client/react/components";
import PropTypes from "prop-types";
import "./style.css";
import Loader from "../Loader";
import ProductList from "./ProductList";

class Products extends Component {
  render() {
    const { selectedCategory } = this.props;
    return (
      <Query
        query={GET_PRODUCTS_BY_CATEGORY}
        variables={{ category: selectedCategory }}
      >
        {({
          loading: productsLoading,
          error: productsError,
          data: productsData,
        }) => {
          if (productsLoading) return <Loader />;
          if (productsError)
            return <p>Error fetching products: {productsError.message}</p>;
          return (
            <ProductList
              selectedCategory={selectedCategory}
              productsData={productsData.productsByCategory}
            />
          );
        }}
      </Query>
    );
  }
}

Products.propTypes = {
  selectedCategory: PropTypes.string,
};
export default Products;
