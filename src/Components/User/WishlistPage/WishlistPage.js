import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style.css';
import placeholderImage from './placeholder.jpg'; 


const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const { userEmail } = useParams();
    const [selectedCoupon, setSelectedCoupon] = useState(null);
const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(''); 
    
  const handleImageClick = (image) => {
    setModalImage(image);
    setShowImageModal(true);
  };
    // console.log('userEmail:', userEmail);

    // useEffect(() => {
    //     const fetchWishlist = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:8001/getWishlist/${userEmail}`);
    //             setWishlist(response.data);
    //         } catch (error) {
    //             console.error('Error fetching wishlist:', error);
    //         }
    //     };

    //     fetchWishlist();
    // }, [userEmail]);

    // useEffect(() => {
    //     const fetchWishlist = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:8001/getWishlist/${userEmail}`);
    //             setWishlist(response.data);
    //         } catch (error) {
    //             console.error('Error fetching wishlist:', error);
    //         }
    //     };
    //     if (userEmail) {
    //         fetchWishlist();
    //     }
    // }, [userEmail]); 

    // const handleDelete = (couponId) => {
    //   if (window.confirm("Are you sure you want to delete this item from your wishlist?")) {
    //     axios.post('http://localhost:8001/removeFromWishlist', { userEmail, couponId })
    //       .then(() => {
    //         const updatedWishlist = wishlist.filter(item => item.couponId !== couponId);
    //         setWishlist(updatedWishlist);
    //       })
    //       .catch(error => {
    //         console.error('Error deleting wishlist item:', error);
    //       });
    //   }
    // };

    // const handleDelete = async (couponId) => {
    //   if (window.confirm("Are you sure you want to delete this item from your wishlist?")) {
    //     try {
    //       await axios.post('http://localhost:8001/removeFromWishlist', { userEmail, couponId });
    //       // Assuming removeFromWishlist API call is successful
    //       // Now update the state after the operation is complete
    //       setWishlist((prevWishlist) => prevWishlist.filter(item => item.couponId !== couponId));
    //     } catch (error) {
    //       console.error('Error deleting wishlist item:', error);
    //     }
    //   }
    // };

    const handleDelete = async (couponId) => {
      console.log('Deleting item...', couponId);
      if (window.confirm("Are you sure you want to delete this item from your wishlist?")) {
        try {
          await axios.post('http://localhost:8001/removeFromWishlist', { userEmail, couponId });
          console.log('Item deleted successfully.');
          // Assuming removeFromWishlist API call is successful
          // Now update the state after the operation is complete
          setWishlist((prevWishlist) => prevWishlist.filter(item => item.couponId !== couponId));
        } catch (error) {
          console.error('Error deleting wishlist item:', error);
        }
      }
    };
    


    
  

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/getWishlist/${userEmail}`);
                setWishlist(response.data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };
    
        if (userEmail) {
            fetchWishlist();
        }
    }, [userEmail]); // Only re-run the effect if userEmail changes
    



    const fetchCouponDetails = async (couponId) => {
        try {
            const response = await axios.get(`http://localhost:8001/getCouponDetails/${couponId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching coupon details:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchWishlistDetails = async () => {
            const updatedWishlist = await Promise.all(
                wishlist.map(async (item) => {
                    const couponDetails = await fetchCouponDetails(item.couponId);
                    return { ...item, couponDetails };
                })
            );

            setWishlist(updatedWishlist);
        };

        fetchWishlistDetails();
    }, [wishlist]);

    return (
        <div className="wishlist-container">
          <h2 className="wishlist-title">Your Wishlist</h2>
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item._id} className="wishlist-item">
                <img
                  className="w-coupon-image"
                  src={item.couponDetails?.image || placeholderImage}
                  alt="Coupon"
                  onClick={() => handleImageClick(item.couponDetails?.image)}
                />
                <div className="w-coupon-preview">
                <p className="w-coupon-title">{item.couponDetails?.title}</p>
              <p>Start Date: {new Date(item.couponDetails?.startDate).toLocaleDateString()}</p>
              <p>Expiration Date: {new Date(item.couponDetails?.expirationDate).toLocaleDateString()}</p>
              <p>Discount Type: {item.couponDetails?.discountType}</p>
              <p>Usage Limits: {item.couponDetails?.usageLimits}</p>
                  <button
                    className="w-read-more"
                    onClick={() => setSelectedCoupon(item.couponDetails)}
                  >
                    Read More
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(item.couponDetails?._id)}>
                &#10006;
              </button>
                </div>
              </div>
            ))}
          </div>
      
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
                <button className="close-details-btn" onClick={() => setSelectedCoupon(null)}>
                  &times; Close
                </button>
              </div>
            </div>
          )}
        </div>
      );
      
};

export default WishlistPage;
