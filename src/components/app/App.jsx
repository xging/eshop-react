import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApolloProviderWrapper from "../../ApolloClient";
import { gql, ApolloConsumer } from "@apollo/client";
import axios from "axios";
import Navbar from "../navbar/navbar";
import Shop from "../../pages/shop-page/shop/shop";
import ProductDetail from "../../pages/product-detail/product/product-detail";
import data from "../../data.json";
import "./App.css";

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $orderID: Int!
    $products: [ProductInput!]!
    $totalPrice: Float!
  ) {
    createOrder(
      orderID: $orderID
      products: $products
      totalPrice: $totalPrice
    ) {
      orderID
      totalPrice
      newOrder {
        productId
        name
        price
        productAttributes {
          Size
          Color
          Capacity
          WithUSB3ports
          TouchIDinkeyboard
        }
        qty
      }
    }
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      cartItems: [],
      selectedCategory: "all",
      isCartDropdownOpen: false,
      dataCategories: [],
      dataProducts: [],
      activeNavItem: "all",
      loading: false,
      error: null,
      data: null,
    };
    this.maxId = 0;
    this.cartOrderId = 0;
  }

  //Check component load
  componentDidMount() {
    const savedCartItems = localStorage.getItem("cartItems");
    const savedCartOrderId = localStorage.getItem("cartOrderId");

    if (savedCartItems) {
      this.setState({ cartItems: JSON.parse(savedCartItems) });
    }

    if (savedCartOrderId) {
      this.cartOrderId = savedCartOrderId;
    }

    this.setState({
      categories: data.data.categories,
      products: data.data.products,
    });

    axios
      .get("http://ging93.atwebpages.com/api/api.php")
      .then((response) => {
        const data = response.data;
        this.setState({
          dataCategories: data.categories,
          dataProducts: data.products,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }
  
  //Check component update
  componentDidUpdate(prevProps, prevState) {
    if (prevState.cartItems !== this.state.cartItems) {
      localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
    }

    if (this.cartOrderId > 0) {
      localStorage.setItem("cartOrderId", this.cartOrderId);
    }
  }

  //Products filter, by default "all" filtered
  productsFilter = (items, filter) => {
    return filter === "all"
      ? items
      : items.filter((item) => item.category === filter);
  };

  //Navbar items get name of selected item
  getCategory = (catName) => {
    this.setState({ selectedCategory: catName });
  };

  //Navbar active link
  setActiveNavItem = (itemName) => {
    this.setState({ activeNavItem: itemName });
  };

  //Add product in Cart
  addProduct = (
    productId,
    productName,
    productImage,
    productPrice,
    productCurrencySymbol,
    productAttributes
  ) => {
    const newCartProduct = {
      productId: productId,
      placeholder: productImage,
      name: productName,
      price: productPrice,
      currencySymbol: productCurrencySymbol,
      productAttributes: productAttributes,
      id: this.maxId++,
      qty: 1,
    };

    this.setState(({ cartItems }) => {
      const itemIndex = cartItems.findIndex(
        (item) =>
          item.name === productName &&
          JSON.stringify(item.productAttributes) ===
            JSON.stringify(productAttributes)
      );

      let newCartItems;
      if (itemIndex >= 0) {
        newCartItems = cartItems.map((item, index) =>
          index === itemIndex ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newCartItems = [...cartItems, newCartProduct];
      }
      newCartItems = this.removeSpacesFromAttributes(newCartItems);
      return { cartItems: newCartItems };
    });
  };

  //Decrease item quantity in cart
  removeProductQuantity = (productId) => {
    this.setState(({ cartItems }) => {
      const itemIndex = cartItems.findIndex((item) => item.id === productId);
      let newCartItems;
      if (itemIndex >= 0) {
        const item = cartItems[itemIndex];
        if (item.qty > 1) {
          newCartItems = cartItems.map((item, index) =>
            index === itemIndex ? { ...item, qty: item.qty - 1 } : item
          );
        } else {
          newCartItems = cartItems.filter((item, index) => index !== itemIndex);
        }
      }
      return { cartItems: newCartItems };
    });
  };

  //Increase item quantity in cart
  addProductQuantity = (productId) => {
    this.setState(({ cartItems }) => {
      const itemIndex = cartItems.findIndex((item) => item.id === productId);
      let newCartItems;
      if (itemIndex >= 0) {
        newCartItems = cartItems.map((item, index) =>
          index === itemIndex ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return { cartItems: newCartItems };
    });
  };

  //Get total item quantity in cart
  getTotalQuantity = () => {
    return this.state.cartItems.reduce((total, item) => total + item.qty, 0);
  };

  //Get total sum items in cart
  getTotalSum = () => {
    return this.state.cartItems
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };

  //Toggle cart dropdown
  toggleCartDropdown = () => {
    const smallCart = document.querySelector(".smallCart");

    if (smallCart) {
      const ariaHidden = smallCart.getAttribute("aria-hidden");
      const ariaModal = smallCart.getAttribute("aria-modal");
      if (ariaHidden === "true") {
        this.setState({ isCartDropdownOpen: false });
      }
      if (ariaModal !== "true") {
        setTimeout(() => {
          this.setState((prevState) => ({
            isCartDropdownOpen: !prevState.isCartDropdownOpen,
          }));
        }, 100);
      }
    }
  };

  //Update item selected attributes in cart
  updateCartAttributes = (productName, attributeName, attributeValue, flag) => {
    if (flag) {
      this.setState(({ cartItems }) => {
        const newCartItems = cartItems.map((item) => {
          if (item.name === productName) {
            return {
              ...item,
              productAttributes: {
                ...item.productAttributes,
                [attributeName]: attributeValue,
              },
            };
          }
          return item;
        });
        return { cartItems: newCartItems };
      });
    }
  };

  //Clear Cart
  clearCart = () => {
    this.setState({ cartItems: [] });
    console.log("Cart cleared");
  };

  //Cart Items - product attributes remove spaces
  removeSpacesFromAttributes = (cartItems) => {
    return cartItems.map((item) => {
      let newItem = { ...item };
      let newAttributes = {};
      Object.keys(newItem.productAttributes).forEach((key) => {
        let newKey = key.replace(/\s+/g, "");
        newAttributes[newKey] = newItem.productAttributes[key];
      });
      newItem.productAttributes = newAttributes;
      return newItem;
    });
  };

  //Create Order
  handleCreateOrder = (client) => {
    const { cartItems } = this.state;
    this.setState({ loading: true, cartOrderId: this.cartOrderId++ });

    const orderProducts = cartItems.map(
      ({ productId, name, price, productAttributes, qty }) => ({
        productId,
        name,
        price,
        productAttributes,
        qty,
      })
    );

    client
      .mutate({
        mutation: CREATE_ORDER,
        variables: {
          orderID: this.cartOrderId,
          products: orderProducts,
          totalPrice: parseFloat(this.getTotalSum()),
        },
      })
      .then((result) => {
        const { data } = result;
        this.setState({
          loading: false,
          data,
          cartItems: [],
        });
        console.log("Order created:", data);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error,
        });
        console.error("Error creating order:", error);
      });
  };

  render() {
    const {
      selectedCategory,
      cartItems,
      isCartDropdownOpen,
      dataCategories,
      dataProducts,
      activeNavItem,
    } = this.state;
    const displayProducts = this.productsFilter(dataProducts, selectedCategory);
    return (
      <ApolloProviderWrapper>
        <Router>
          <ApolloConsumer>
            {(client) => (
              <>
                <Navbar
                  data={dataCategories}
                  products={dataProducts}
                  getCategory={this.getCategory}
                  cartItems={cartItems}
                  addProductQuantity={this.addProductQuantity}
                  removeProductQuantity={this.removeProductQuantity}
                  getTotalQuantity={this.getTotalQuantity}
                  toggleCartDropdown={this.toggleCartDropdown}
                  isCartDropdownOpen={isCartDropdownOpen}
                  getTotalSum={this.getTotalSum}
                  updateCartAttributes={this.updateCartAttributes}
                  setActiveNavItem={this.setActiveNavItem}
                  activeNavItem={activeNavItem}
                  clearCart={this.clearCart}
                  handleCreateOrder={() => this.handleCreateOrder(client)}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Shop
                        data={displayProducts}
                        products={dataProducts}
                        selectedCategory={selectedCategory}
                        addProduct={this.addProduct}
                      />
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <ProductDetail
                        products={dataProducts}
                        addProduct={this.addProduct}
                        toggleCartDropdown={this.toggleCartDropdown}
                        isCartDropdownOpen={isCartDropdownOpen}
                      />
                    }
                  />
                </Routes>
                {/* {loading && <p>Order Create...</p>}
                {error && <p>Error Msg: {error.message}</p>} */}
              </>
            )}
          </ApolloConsumer>
        </Router>
      </ApolloProviderWrapper>
    );
  }
}

export default App;
