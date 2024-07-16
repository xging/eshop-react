import React, { Component } from 'react';
//CSS
import "./product-slider.css";

class ProductSlider extends Component {
  render() {
    const { products } = this.props;

    // If products or products.gallery is not available, show loading message
    if (!products || !products.gallery) {
      return <div>Slider Loading...</div>;
    }

    // Generate thumbnails for the carousel
    const imgThumbnail = products.gallery.map((img, index) => {
      return (
        <div
          key={index}
          className="thumbnail"
          data-target="#productCarousel"
          data-slide-to={index}
        >
          <img src={img} className="img-fluid" alt={products.name} />
        </div>
      );
    });

    // Generate main carousel items
    const imgProduct = products.gallery.map((img, index) => {
      return (
        <div
          key={index}
          className={`carousel-item ${index === 0 ? "active" : ""}`}
        >
          <img src={img} className="img-fluid" alt={products.name} />
        </div>
      );
    });

    return (
      <div className="col-md-6 px-0 py-0" data-testid='product-gallery'>
        <div className="col-md-1 d-flex flex-column text-center float-left">
          {imgThumbnail}
        </div>
        <div className="col-md-11 float-right">
          <div
            id="productCarousel"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner d-flex text-center">
              {imgProduct}
            </div>
            <a
              className="carousel-control-prev"
              href="#productCarousel"
              role="button"
              data-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#productCarousel"
              role="button"
              data-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductSlider;
