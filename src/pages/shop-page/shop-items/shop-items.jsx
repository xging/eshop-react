import React, { Component } from "react";
import { Link } from 'react-router-dom';
//CSS
import "./shop-items.css";

class ShopItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: {} // State to store selected attributes for the product
    };
  }

  componentDidMount() {
    const { products, name } = this.props;
    const defaultSelectedAttributes = {};

    // Find the specific product by name in the products array
    const product = products.find(item => item.name === name);

    if (product) {
      // Initialize selectedAttributes with the default values from the first item of each attribute
      product.attributes.forEach(attr => {
        if (attr.items.length > 0) {
          defaultSelectedAttributes[attr.name] = attr.items[0].value;
        }
      });
      this.setState({ selectedAttributes: defaultSelectedAttributes });
    }
  }
  
  // Update selectedAttributes state when an attribute is clicked
  handleAttributeClick = (attributeName, attributeValue) => {
    this.setState(prevState => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: attributeValue
      }
    }));
  };

  render() {
    const { name, gallery, prices, inStock, id, addProduct } = this.props;
    const { selectedAttributes } = this.state; // Destructure selectedAttributes from state

    return (
      <div className="col-lg-4 col-sm-12 py-5 mx-auto" data-testid={`product-${name.toLowerCase().replace(/\s+/g, '-')}`} >
        <div className="card mx-auto">
          <div className="card-img-top">
            <img src={gallery && gallery.length > 0 ? gallery[0] : ''} alt={name} />
            {inStock ? (
              "" // No overlay when product is in stock
            ) : (
              <div className="overlay">
                <div className="text">Out of stock</div>
              </div>
            )}
          </div>

          {inStock ? (
            <div
              className="cart"
              onClick={() =>
                addProduct(
                  id,
                  name,
                  gallery && gallery.length > 0 ? gallery[0] : '',
                  prices && prices.length > 0 ? prices[0].amount : 0,
                  prices && prices.length > 0 ? prices[0].currency.symbol : '',
                  selectedAttributes // Pass selected attributes to addProduct function
                )
              }
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
          ) : (
            "" // No cart icon when product is out of stock
          )}

          <div className="card-body">
            <Link to={`/product/${id}`} className="product-link"><h5 className="card-title">{name}</h5></Link> {/* Link to product detail page */}
            {prices && prices.length > 0 ? (
              <small className="text-muted">
                {prices[0].currency.symbol}
                {prices[0].amount.toFixed(2)} {/* Display product price */}
              </small>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default ShopItems;
