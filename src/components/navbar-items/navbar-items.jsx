import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Import Link component from React Router
//CSS
import './navbar-items.css'; // Import CSS file for styling

class NavbarItems extends Component {
  // Handler for when an attribute (navbar item) is clicked
  handleAttributeClick = () => {
    // Destructure props for easier access
    const { name, setActiveNavItem, getCategory, toggleCartDropdown, isCartDropdownOpen } = this.props;
    
    // Set active navigation item
    setActiveNavItem(name);
    
    // Get category associated with the clicked item
    getCategory(name);
    
    // Close cart dropdown if open
    if (isCartDropdownOpen) {
      toggleCartDropdown();
    }
  };

  render() {
    // Destructure props for easier access
    const { name, activeNavItem, isCartDropdownOpen } = this.props;
    
    // Check if the current item is active
    const isActive = activeNavItem === name;

    return (
      <li className="nav-item px-3">
        {/* Link to the home page with dynamic class based on active state */}
        <Link
          to="/"
          className={`home-link nav-link ${isActive ? 'active' : ''}`}
          data-toggle={isCartDropdownOpen ? 'modal' : ''}
          data-testid={isActive ? 'active-category-link' : 'category-link'}
          onClick={this.handleAttributeClick}
          // data-target={isCartDropdownOpen ? '#smallCart' : ''}
          // data-toggle="modal" 
          data-target="#smallCart"
        >
          {name} {/* Display the name of the navigation item */}
        </Link>
      </li>
    );
  }
}

export default NavbarItems;
