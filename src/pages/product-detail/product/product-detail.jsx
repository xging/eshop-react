import React, { Component } from "react";
//Setups and Libs
import withParams from "./with-params"; // Higher-order component to inject URL params as props
//Components
import ProductAttribute from "../product-attribute/product-attribute"; // Component for displaying product attributes and controls
import ProductSlider from "../product-slider/product-slider"; // Component for displaying product images in a slider
//CSS
import "./product-detail.css";

class ProductDetail extends Component {
  componentDidMount() {
    window.scrollTo(0, 0); // Scroll to the top of the page when component mounts
  }

  render() {
    const { products, addProduct, params, toggleCartDropdown } = this.props; // Destructuring props
    const { id } = params; // Extracting 'id' from URL params
    const product = products.find((prod) => prod.id.toString() === id); // Finding the product based on 'id'

    return (
      <div className="container mt-5"> {/* Container for the entire product detail */}
        <div className="row"> {/* Row to contain product slider and attributes */}
          <ProductSlider products={product} id={id}/> {/* Product slider component */}
          <div className="col-md-2"></div> {/* Placeholder column */}
          <ProductAttribute products={product} addProduct={addProduct} toggleCartDropdown={toggleCartDropdown} id={id}/> {/* Product attribute component */}
        </div>
      </div>
    );
  }
}

export default withParams(ProductDetail); // Enhance ProductDetail component with URL params using 'withParams' HOC
