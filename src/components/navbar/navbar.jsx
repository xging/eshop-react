import React, { Component } from "react";
//Setups and Libs
import { Link } from 'react-router-dom'; // Import Link component from React Router
//Custom Components
import NavbarItems from "../navbar-items/navbar-items"; // Import NavbarItems component
import SmallCart from "../small-cart/small-cart"; // Import SmallCart component
//CSS & SVG
import { ReactComponent as CartIcon } from '../navbar-items/cart.svg'; // Import CartIcon SVG as a React component
import { ReactComponent as Logo } from '../navbar-items/logo.svg'; // Import Logo SVG as a React component
import "./navbar.css"; // Import CSS file for styling

class Navbar extends Component {
  render() {
    // Destructure props for easier access
    const {
      data,
      products,
      getCategory,
      cartItems,
      removeProductQuantity,
      getTotalQuantity,
      toggleCartDropdown,
      isCartDropdownOpen,
      getTotalSum,
      updateCartAttributes,
      addProductQuantity,
      setActiveNavItem,
      activeNavItem,
      clearCart,
      handleCreateOrder
    } = this.props;

    // Select DOM element for cart quantity display
    const cartQtyElem = document.querySelector(".cart-items-qty");

    // Add 'd-flex' class to cart quantity element if there are items in the cart
    if (getTotalQuantity() > 0) {
      cartQtyElem.classList.add("d-flex");
    }

    // Map through data to create NavbarItems components for each item
    const navItems = data.map((item, index) => {
      const { name } = item;
      return (
        <NavbarItems
          key={index}
          name={name}
          getCategory={getCategory}
          setActiveNavItem={setActiveNavItem}
          activeNavItem={activeNavItem}
          isCartDropdownOpen={isCartDropdownOpen}
          toggleCartDropdown={toggleCartDropdown}
        />
      );
    });

    // Check if cart is empty to conditionally render cart quantity display
    const isCartEmpty = cartItems.length === 0;

    return (
      <div className="container-fluid navbar-container">
        <div className="container">
          <nav className="navbar pt-0">
            {/* Rendered navigation items */}
            <ul className="navbar-nav d-flex flex-row">{navItems}</ul>

            {/* Centered logo linking to home */}
            <div className="navbar-brand-centered logo">
              <Link to="/"><Logo /></Link>
            </div>

            {/* Right-aligned cart dropdown */}
            <div className="ml-auto">
              <div className="dropdown">
                <button
                  className="btn btn-light cartDropdown"
                  type="button"
                  id="cartDropdown"
                  data-toggle="modal" data-target="#smallCart"
                  onClick={toggleCartDropdown}
                  aria-expanded={isCartDropdownOpen}
                >
                  <CartIcon />
                </button>

                {/* Display cart quantity if not empty */}
                <span className={`cart-items-qty ${isCartEmpty ? 'd-none' : 'd-flex'}`}>
                  {getTotalQuantity()}
                </span>

                {/* SmallCart component for detailed cart view */}
                {/* {isCartDropdownOpen && ( */}
                <SmallCart
                  cartItems={cartItems}
                  removeProductQuantity={removeProductQuantity}
                  getTotalQuantity={getTotalQuantity}
                  getTotalSum={getTotalSum}
                  productAttributes={products}
                  updateCartAttributes={updateCartAttributes}
                  addProductQuantity={addProductQuantity}
                  toggleCartDropdown={toggleCartDropdown}
                  clearCart={clearCart}
                  handleCreateOrder={handleCreateOrder}
                />
                {/* )} */}
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default Navbar;
