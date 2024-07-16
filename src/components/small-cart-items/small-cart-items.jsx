import React, { Component } from "react";
//CSS
import "./small-cart-items.css";

class SmallCartItems extends Component {
  // Function to render attributes for a product
  renderAttributes = (attributes, selectedAttributes) => {
    if (!attributes) return null; // Return null if no attributes provided

    const { name } = this.props; // Destructure props to get product name

    return (
      <div className="attributes-container">
        {attributes.map((attributeSet, index) => {
          if (attributeSet.name === name) {
            return (
              <div key={index} className="attribute-set">
                {attributeSet.attributes.map((attribute, idx) => (
                  <div key={idx}>
                    <p className="my-2 attribute-name">
                      {attribute.name}:
                    </p>
                    <div key={index} className={this.attrNames(attribute.name)}>
                      {this.renderAttributePicker(
                        attribute,
                        selectedAttributes
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Function to determine CSS class names for attributes
  attrNames = (name) => {
    const arr = ["size", "color", "capacity"]; // Array of attribute types
    const lowerCaseName = name.toLowerCase(); // Convert name to lowercase
    const className = arr.includes(lowerCaseName) ? lowerCaseName : "generic"; // Check if name is in array, otherwise use 'generic'
    return `attribute my-1 ${className + "-picker"}`; // Return class name for attribute element
  };

  // Function to render attribute picker for a specific attribute
  renderAttributePicker = (attribute, selectedAttributes) => {
    const selectedValue = selectedAttributes[attribute.name.replace(/\s+/g, "") ]; // Get selected value for the attribute and clear spaces
    const { name, updateCartAttributes } = this.props; // Destructure props to get product name and update function
    const updateAttributeFlag = false; // Update attribute flag
    return (
      <div className="cart-attribute d-flex flex-row" data-testid={`cart-item-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}`}>
        {attribute.items.map((item, itemIdx) => (
          <div
            key={itemIdx}
            className={`attribute-box ${selectedValue === item.value ? "selected" : item.value}`}
            data-testid={`cart-item-attribute-${attribute.name.toLowerCase().replace(/\s+/g, '-')}-${item.value.toLowerCase().replace(/\s+/g, '-')}${selectedValue === item.value ? "-selected" : ""}`}
          >
            <button
              className={`btn`}
              style={
                attribute.name.toLowerCase() === "color"
                  ? { backgroundColor: item.value }
                  : {}
              }
              onClick={() =>
                updateCartAttributes(name, attribute.name, item.value, updateAttributeFlag)
              }
              disabled
            >
              {attribute.name.toLowerCase() === "color" ? "" : item.value}
            </button>
          </div>
        ))}
      </div>
    );
  };

  render() {
    // Destructure props to get necessary product information and functions
    const {
      placeholder,
      name,
      price,
      currencySymbol,
      qty,
      id,
      removeProductQuantity,
      productAttributes,
      productAttributesSelected,
      addProductQuantity,
    } = this.props;

    return (
      <div className="row mx-0 my-3">
        <div className="col-7 px-1">
          <div className="row px-2">
            <div className="col-9 px-0">
              {/* Product name */}
              <p className="item-desc mb-0">
                {name}
              </p>
              {/* Product price */}
              <p className="item-price my-1">{currencySymbol + price.toFixed(2)}</p>
              {/* Render product attributes */}
              {this.renderAttributes(
                productAttributes,
                productAttributesSelected
              )}
            </div>
            <div className="col-3">
              {/* Quantity controls */}
              <div className="quantity-controls">
                {/* Button to increase product quantity */}
                <button onClick={() => addProductQuantity(id)} data-testid='cart-item-amount-increase'>
                  <i className="fa-solid fa-plus"></i>
                </button>
                {/* Display current quantity */}
                <span className="item-quantity">{qty}</span>
                {/* Button to decrease product quantity */}
                <button onClick={() => removeProductQuantity(id)} data-testid='cart-item-amount-decrease'>
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Product image */}
        <div className="col-5 px-0">
          <img src={placeholder} alt="Running Short" className="product-img" />
        </div>
      </div>
    );
  }
}

export default SmallCartItems;
