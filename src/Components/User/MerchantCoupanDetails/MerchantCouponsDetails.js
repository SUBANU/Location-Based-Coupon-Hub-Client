// MerchantCouponsDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const MerchantCouponsDetails = ({ merchantEmail }) => {
  const [merchantCoupons, setMerchantCoupons] = useState([]);

  useEffect(() => {
    const fetchMerchantCoupons = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/getMerchantCoupons/${merchantEmail}`);
        setMerchantCoupons(response.data);
      } catch (error) {
        console.error('Error fetching merchant coupons:', error);
      }
    };

    fetchMerchantCoupons();
  }, [merchantEmail]);

  return (
    <div className="merchant-coupons-container1">
      <h2>{`${merchantEmail}'s Coupons`}</h2>
      {merchantCoupons.map((coupon) => (
        <div key={coupon._id} className="coupon-item1">
          <img src={coupon.image} alt="Coupon" className="coupon-image1" />
          <div className="coupon-details1">
            <p className="coupon-title1">{coupon.title}</p>
            <p className="coupon-description1">{coupon.description}</p>
            <p className="coupon-info1">Discount Type: {coupon.discountType}</p>
            <p className="coupon-info1">Start Date: {new Date(coupon.startDate).toLocaleDateString()}</p>
            <p className="coupon-info1">End Date: {new Date(coupon.endDate).toLocaleDateString()}</p>
            <p className="coupon-info1">Usage Limits: {coupon.usageLimits}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MerchantCouponsDetails;
