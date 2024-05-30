import React, { Component, Suspense } from "react";
import client from "./apollo";
import { ApolloProvider } from "@apollo/client";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./context";
import Loader from "./components/Loader";

// Lazy load the Products and Details components
const Products = React.lazy(() => import("./components/Products"));
const Details = React.lazy(() => import("./components/Details"));

class App extends Component {
  state = {
    selectedCategory: "all", // Default to "all" category
    isLoading: true, // Initially set loading to true
  };

  handleCategoryClick = (category) => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ selectedCategory: category, isLoading: false });
    }, 1000);
  };
  componentDidMount() {
    // Simulate loading for 1.5 seconds, then set isLoading to false
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }
  render() {
    const { selectedCategory, isLoading } = this.state;

    return (
      <ApolloProvider client={client}>
        <AppProvider>
          <Router>
            <div className="wrapper">
              <Header
                link={"/"}
                handleCategoryClick={this.handleCategoryClick}
              />
              <Suspense fallback={<Loader />}>
                {!isLoading && (
                  <Routes>
                    <Route
                      path="/"
                      element={<Products selectedCategory={selectedCategory} />}
                    />
                    <Route path="/details/:id" element={<Details />} />
                  </Routes>
                )}
              </Suspense>
              {isLoading && <Loader />}
            </div>
          </Router>
        </AppProvider>
      </ApolloProvider>
    );
  }
}

export default App;
