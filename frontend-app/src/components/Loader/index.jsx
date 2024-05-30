import { Component } from "react";
import "./style.css";

class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
       
      <div className="loading" data-loading-text="Loading..."></div>
    );
  }
}

export default Loader;
