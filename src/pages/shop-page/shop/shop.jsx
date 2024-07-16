import React, { Component } from "react";
//Components
import ShopItems from "../shop-items/shop-items";
//CSS
import "./shop.css";

class Shop extends Component {
  // Helper function to chunk array into subarrays of a specified size
  chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  render() {
    const { data, products, selectedCategory, addProduct } = this.props;

    // Map through data to generate ShopItems components
    const shopItems = data.map((item) => {
      const { id, ...itemProps } = item;

      // Extract product attributes if available
      const productAttributes = item.attributes
        ? item.attributes.map((attribute) =>
            attribute.items.map((attributeItem) => attributeItem.value)
          )
        : [];

      return (
        <ShopItems
          {...itemProps}
          key={id}
          addProduct={addProduct}
          productAttributes={productAttributes}
          products={products}
          id={id}
        />
      );
    });

    // Chunk shopItems array into subarrays of 3 items each
    const chunkedShopItems = this.chunkArray(shopItems, 3);

    return (
      <div className="container shop">
        <div className="row">
          <div className="col-12">
            <h2 className="text-header pt-5 pb-3">{selectedCategory}</h2>
          </div>
        </div>

        {/* Render each chunk of shopItems as a row */}
        {chunkedShopItems.map((chunk, index) => (
          <div className="row d-flex justify-content-between" key={index}>
            {chunk}
          </div>
        ))}
      </div>
    );
  }
}

export default Shop;
