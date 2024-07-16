import React, { Component } from "react";
//Components
import SmallCartItems from "../small-cart-items/small-cart-items";
//CSS
import "./small-cart.css";

class SmallCart extends Component {
  render() {
    // Destructuring props for easier access
    const {
      cartItems,
      removeProductQuantity,
      getTotalQuantity,
      getTotalSum,
      productAttributes,
      updateCartAttributes,
      addProductQuantity,
      toggleCartDropdown,
      isCartDropdownOpen,
      clearCart,
      handleCreateOrder
    } = this.props;

    // Mapping through cartItems to render SmallCartItems components
    const cartItemsAll = cartItems.map((item, index) => {
      const { id, ...itemProps } = item;
      return (
        <SmallCartItems
          {...itemProps}
          key={index}
          removeProductQuantity={removeProductQuantity}
          productAttributes={productAttributes}
          productAttributesSelected={itemProps.productAttributes}
          updateCartAttributes={updateCartAttributes}
          addProductQuantity={addProductQuantity}
          id={id}
        />
      );
    });

    return (
      <div
        className="smallCart modal fade"
        id="smallCart"
        aria-labelledby="smallCartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content px-3 py-3">
            {/* Header displaying the total number of items in the cart */}
            <p className="text-header">
              My Bag, <span data-testid='cart-item-amount'>{getTotalQuantity()} {(getTotalQuantity()===1)? 'item' : 'items'}</span>
            </p>
            {/* Render all SmallCartItems */}
            <div className="pb-3 mb-3">{cartItemsAll}</div>

            {/* Total and Place Order section */}
            <div className="row">
              <div className="col-6">
                <h5>Total</h5>
              </div>
              <div className="col-6">
                <h5 className="total-sum" data-testid='cart-total'>${getTotalSum()}</h5>
              </div>
            </div>

            {/* Place Order button */}
            <div className="row">
              <div className="col-12 text-center">
                <button
                  onClick={handleCreateOrder}
                  className={`btn btn-success btn-lg btn-block ${getTotalQuantity()===0 ? 'disabled' : ''}`}
                  disabled={getTotalQuantity()===0}
                  data-testid='cart-btn'
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SmallCart;
