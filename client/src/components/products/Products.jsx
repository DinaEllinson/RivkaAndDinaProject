import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import Searches from "../searches/Searches";
import "./Products.css";
import Product from "../product/Product";
import { FaArrowUp } from "react-icons/fa";
import { fetchProducts } from "../../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [fullView, setFullView] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [filters, setFilters] = useState({})
  const { category } = useParams();
  const navigate = useNavigate();
  const limit = 20;

  useEffect(() => {
    const keys = Object.keys(filters);
    const queryString = keys.map((key) => `${key}=${filters[key]}`).join('&');
    setSearchQuery(queryString);
  }, [filters]);


  useEffect(() => {
    if (category) {
      setFilters((prevFilters) => ({ ...prevFilters, category: category }))
    }
  }, [category]);


  useEffect(() => {
    if (searchQuery) {
      resetData();
    }
  }, [searchQuery]);


  const resetData = () => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    fetchData(0, true);
  };


  const fetchData = async (currentOffset, isReset = false) => {
    try {
      const result = await fetchProducts(`${searchQuery}&limit=${limit}&offset=${currentOffset}`);
      
      if (isReset) {
        setProducts(result);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...result]);
      }

      setOffset(currentOffset + limit);

      if (result.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleProductClick = (productId) => {
    navigate(`${productId}`);
  };


  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="products-container">
      <div className="fixed-searches">
        <Searches address={address} setAddress={setAddress} setSearchQuery={setSearchQuery} setFilters={setFilters} />
      </div>
      <div className="products-list">
        <InfiniteScroll
          dataLength={products.length}
          next={() => fetchData(offset)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: 'center' }}><b>You have seen it all</b></p>}
        >
          <div id="container">
          {products.map((product, i) => (
           <div id="product" 
              onClick={() => handleProductClick(product.id)}
              key={i}
    
            >
              <Product product={product} />
            </div>
            
            
            
          ))}
          </div>
        </InfiniteScroll>
      </div>
      <Outlet />

      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp className="scroll-to-top-icon" />
        </button>
      )}
    </div>
  );
}

export default Products;


