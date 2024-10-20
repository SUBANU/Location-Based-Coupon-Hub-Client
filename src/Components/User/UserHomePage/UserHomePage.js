import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import WishlistPage from '../WishlistPage/WishlistPage';
import {Route,Switch} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import _debounce from 'lodash/debounce';


const UserHomePage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [filter, setFilter] = useState({ discountType: '', searchString: '' });
  const [wishlist, setWishlist] = useState([]);
  const [userEmail, setUserEmail] = useState('');
 

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
      fetchWishlist(storedUserEmail);
    }
  }, []);

  const fetchWishlist = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8001/getWishlist/${email}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

// Frontend Component - Update UserHomePage

// ... (existing code)

useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:8001/getCoupons', {
        params: {
          pageSize: 1000, // Set a large number to fetch all coupons
        },
      });
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  fetchCoupons();
}, []);



  const filteredCoupons = coupons.filter((coupon) => {
    const titleMatch = coupon.title.toLowerCase().includes(filter.searchString.toLowerCase());
    const couponCodeMatch =
      filter.searchString.trim() === '' || coupon.coupon.toLowerCase().includes(filter.searchString.toLowerCase());
    const discountTypeMatch =
      !filter.discountType || coupon.discountType.toLowerCase() === filter.discountType.toLowerCase();
    return (titleMatch || couponCodeMatch) && discountTypeMatch;
  });


  const handleLogin = useCallback((email) => {
    setUserEmail(email);
    sessionStorage.setItem('userEmail', email);
    fetchWishlist(email);
  }, [fetchWishlist]);

  const handleLogout = useCallback(() => {
    setUserEmail('');
    sessionStorage.removeItem('userEmail');
    setWishlist([]);
    navigate('/');
  }, []);

  const handleWishlistClick = _debounce(() => {
    if (userEmail) {
      //console.log(userEmail);
      navigate(`/wishlist/${userEmail}`);
      console.log("Go to Wishlist page");
    }
  }, 300);

  // const handleWishlistClick = () => {
  //   if (userEmail) {
  //     console.log(userEmail);
  //     navigate(`/wishlist/${userEmail}`);
  //     console.log("Go to Wishlist page");
  //   }
  // };

  const handleReadMore = (coupon) => {
    setSelectedCoupon(coupon);
    setShowImageModal(false); 
  };

  const handleHideDetails = () => {
    setSelectedCoupon(null);
    setShowImageModal(false);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowImageModal(true);
  };

  const handleModalClose = () => {
    setShowImageModal(false);
  };

  const handleAddToWishlist = async (coupon) => {
    try {
      await axios.post('http://localhost:8001/addToWishlist', {
        userEmail,
        couponId: coupon._id,
      });

      fetchWishlist(userEmail);

      console.log(`Coupon ${coupon} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <div className="container">
    
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by coupon title or code"
          value={filter.searchString}
          onChange={(e) => setFilter({ ...filter, searchString: e.target.value })}
        />
        <select
          value={filter.discountType}
          onChange={(e) => setFilter({ ...filter, discountType: e.target.value })}
        >
          <option value="">All Discount Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="buyOneGet">Buy One Get</option>
        </select>
      </div>

      <h2 className="title">Available Coupons</h2>
      {/* <Link  to={`/wishlist/${userEmail}`}><button className="wishlist-button"  onClick={() => console.log("Go to Wishlist page")}>Wishlist</button></Link> */}
      { <button className="wishlist-button" onClick={handleWishlistClick}>
      Wishlist
    </button>  }
         {/* <Switch>
        <Route path="/wishlist">
          {userEmail && <WishlistPage userEmail={userEmail} />}
        </Route>
      </Switch>
     */}

{!userEmail && (
  <button className="logout-button" onClick={() => handleLogin('user@example.com')}>Login</button>
)}
{userEmail && (
  <button className="logout-button" onClick={handleLogout}>Logout</button>
)}
<a href='/mapSearch'><button className="map-search-button" >MapSearch <i class="fa-solid fa-location-dot"></i></button></a>
      <br></br>
      <ul className="coupon-list">
        {filteredCoupons.map((coupon) => (
          <li key={coupon._id} className="coupon-card">
            <div className="coupon-preview">


 <span
                className="wishlist-icon"
                onClick={() => handleAddToWishlist(coupon)}
              >
                &#10084; 
              </span>

              <img
                src={coupon.image}
                alt={coupon.title}
                className="coupon-image"
                onClick={() => handleImageClick(coupon.image)}
              />
              <div className="coupon-info">
                <p>Title: {coupon.title}</p>
                <p>Start Date: {new Date(coupon.startDate).toLocaleDateString()}</p>
                <p>Expiration Date: {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                <p>Discount Type: {coupon.discountType}</p>
                <p>Usage Limits: {coupon.usageLimits}</p>
              </div>
            </div>
            <div>
              <button className="read-more-btn" onClick={() => handleReadMore(coupon)}>
                Read More
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedCoupon && (
        <div className="details-container-blur">
          <div className="details-container">
            <h3>{selectedCoupon.title}</h3>
            <p>Description: {selectedCoupon.description}</p>
            <p>Start Date: {new Date(selectedCoupon.startDate).toLocaleDateString()}</p>
            <p>Expiration Date: {new Date(selectedCoupon.expirationDate).toLocaleDateString()}</p>
            <p>Discount Type: {selectedCoupon.discountType}</p>
            {selectedCoupon.discountType === 'percentage' && (
              <p>Percentage: {selectedCoupon.percentage}%</p>
            )}
            {selectedCoupon.discountType === 'fixed' && (
              <p>Fixed Amount: ${selectedCoupon.fixedAmount}</p>
            )}
            {selectedCoupon.discountType === 'buyOneGet' && (
              <>
                <p>Buy One Get: {selectedCoupon.buyOneGet}</p>
                <p>Quantity: {selectedCoupon.buyOneGetQuantity}</p>
              </>
            )}
            <p>Usage Limits: {selectedCoupon.usageLimits}</p>
            <p className="coupon-code">Coupon Code: {selectedCoupon.coupon}</p>
          
            <button className="close-details-btn" onClick={handleHideDetails}>
              &times; Close
            </button>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="image-overlay">
          <div className="image-modal">
           
            <button className="close-image-btn" onClick={handleModalClose}>
              &times;
            </button>
            <img src={modalImage} alt="Modal" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;