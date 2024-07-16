import React, { Component } from "react";
//Libs
import parse from "html-react-parser"; // Library to parse HTML strings into React elements
//CSS
import "./product-attribute.css";

class ProductAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {}, // Holds currently selected attributes for the product
      selectedAttributesDefault: {}, // Holds default attributes (first values from product's attributes)
    };
  }

  componentDidMount() {
    this.loadDefaultAttribute(); // Loads default attributes when component mounts
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      this.loadDefaultAttribute(); // Loads default attributes when product props change
    }
  }

  // Loads default attributes from the product's attributes array
  loadDefaultAttribute = () => {
    const { products } = this.props;
    if (products) {
      const defaultAttributes = products.attributes.reduce((acc, attribute) => {
        acc[attribute.name] = attribute.items[0].value; // Set default attribute value
        return acc;
      }, {});

      this.setState({
        selectedAttributesDefault: defaultAttributes,
        selectedAttributes: defaultAttributes, // Initialize selected attributes with defaults
      });
    }
  };

  // Handles adding the product to cart
  handleAddToCart = () => {
    const { addProduct, toggleCartDropdown, products } = this.props;
    const { selectedAttributes } = this.state;

    if (products) {
      // Call addProduct function to add product to cart
      addProduct(
        products.id,
        products.name,
        products.gallery[0],
        products.prices[0].amount,
        products.prices[0].currency.symbol,
        selectedAttributes
      );

      // Toggle cart dropdown after 1 second if modal is not open
      setTimeout(() => {
        if (!document.querySelector(".modal_open")) {
          toggleCartDropdown();
        }
      }, 1000);
    }
  };

  // Handles click event for selecting product attributes
  handleAttributeClick = (attributeName, attributeValue) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: attributeValue, // Update selected attribute
      },
    }));
  };

  // Determines CSS class for attribute based on name
  attrNames = (name) => {
    const arr = ["size", "color", "capacity"];
    const lowerCaseName = name.toLowerCase();
    const className = arr.includes(lowerCaseName) ? lowerCaseName : "generic";
    return `attribute mt-3 ${className}`;
  };

  // Renders attributes for the product
  renderAttributes = (attributes) => {
    return attributes.map((attribute, index) => {
      const attributeNameKebabCase = attribute.name
        .toLowerCase()
        .replace(/\s+/g, "-");
      return (
        <div
          key={index}
          className={this.attrNames(attribute.name)}
          data-testid={`product-attribute-${attributeNameKebabCase}`}
        >
          <h5>{attribute.name}:</h5>
          <div className="product-attribute d-flex flex-row">
            {attribute.items.map((item, idx) => (
              <div
                key={idx}
                className={`attribute-box me-1 ${
                  this.state.selectedAttributes[attribute.name] === item.value
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className={`btn`}
                  onClick={() =>
                    this.handleAttributeClick(attribute.name, item.value)
                  }
                  style={
                    attribute.name.toLowerCase() === "color"
                      ? { backgroundColor: item.value }
                      : {}
                  }
                >
                  {attribute.name.toLowerCase() === "color" ? "" : item.value}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  render() {
    const { products } = this.props;

    // Display loading message if products are not yet loaded
    if (!products) {
      return <div>Attributes Loading...</div>;
    }

    // Render product details including attributes, price, add to cart button, and description
    return (
      <div
        className="col-md-4"
        data-testid={`product-attribute-${products.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <h2>{products.name}</h2>
        {this.renderAttributes(products.attributes)}
        <div className="price mt-3">
          <h5>Price:</h5>
          <p>${products.prices[0].amount.toFixed(2)}</p>
        </div>

        {/* Button to add product to cart */}
        {products.inStock ? (
          <button
            className={`btn btn-success mt-3 ${
              Object.keys(this.state.selectedAttributes).length !==
              Object.keys(this.state.selectedAttributesDefault).length
                ? "disabled"
                : ""
            }`}
            onClick={this.handleAddToCart}
            disabled={
              Object.keys(this.state.selectedAttributes).length !==
              Object.keys(this.state.selectedAttributesDefault).length
            }
            data-toggle="modal"
            data-target="#smallCart"
            data-testid="add-to-cart"
          >
            ADD TO CART
          </button>
        ) : (
          // Display "Out of Stock" button if product is not in stock
          <button className="btn btn-success mt-3 disabled" disabled>
            ADD TO CART
          </button>
        )}

        {/* Display product description */}
        <p
          className="mt-3 product-description"
          data-testid="product-description"
        >
          {parse(products.description)}
        </p>
      </div>
    );
  }
}

export default ProductAttribute;
