import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) {
      id
      name
      gallery
      inStock
      description
      category
      attributes {
        id
        items {
          displayValue
          value
          id
        }
        name
        type
      }
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      quantity
    }
  }
`;

export const GET_PRODUCTS_BY_ID = gql`
  query GetProductsById($id: String!) {
    productsById(id: $id) {
      id
      name
      gallery
      inStock
      description
      category
      attributes {
        id
        items {
          displayValue
          value
          id
        }
        name
        type
      }
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      quantity
    }
  }
`;
export const INSERT_NEW_PRODUCT = gql`
  mutation InsertNewProduct($productInput: ProductInput!) {
    insertNewProduct(productInput: $productInput) {
      id
      name
      gallery
      inStock
      description
      category
      attributes {
        id
        items {
          displayValue
          value
          id
        }
        name
        type
      }
      prices {
        amount
        currency {
          symbol
        }
      }
      brand
      quantity
    }
  }
`;
