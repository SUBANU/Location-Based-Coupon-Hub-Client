import React, { useState, useEffect } from 'react';
import './style.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const AddCoupan = () => {
  const [merchantEmail, setMerchantEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coupon, setCode] = useState('');
  const [image, setImage] = useState(null);
  const [discountType, setDiscountType] = useState('percentage');
  const [percentage, setPercentage] = useState(0);
  const [fixedAmount, setFixedAmount] = useState(0);
  const [buyOneGet, setBuyOneGet] = useState(0);
  const [buyOneGetQuantity, setBuyOneGetQuantity] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [usageLimits, setUsageLimits] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [merchantLocation, setMerchantLocation] = useState({ latitude: 0, longitude: 0 });
  const [merchantAddress, setMerchantAddress] = useState('');

  useEffect(() => {
    // Retrieve merchant email from sessionStorage
    const storedMerchantEmail = sessionStorage.getItem('merchentEmail');
    if (storedMerchantEmail) {
      setMerchantEmail(storedMerchantEmail);
      fetchMerchantLocation(storedMerchantEmail);
      fetchMerchantAddress(storedMerchantEmail);
    }
  }, []);

  const fetchMerchantLocation = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8001/getMerchantLocation/${email}`);
      const { latitude, longitude } = response.data;
      console.log('Merchant email:', email); 
      setMerchantLocation({ latitude, longitude });
    } catch (error) {
      console.error('Error fetching merchant location:', error);
    }
  };

  const fetchMerchantAddress = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8001/getMerchantAddress/${email}`);
      setMerchantAddress(response.data.address);
      console.log(response.data.address)
    } catch (error) {
      console.error('Error fetching merchant address:', error);
    }
  };

  const setGeneratedCode = (generatedCode) => {
    setCode(generatedCode);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleUsageLimitsChange = (event) => {
    setUsageLimits(event.target.value);
  };

  const handleExpirationDateChange = (event) => {
    setExpirationDate(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleDiscountTypeChange = (event) => {
    const selectedDiscountType = event.target.value;
    setDiscountType(selectedDiscountType);

    setPercentage(0);
    setFixedAmount(0);
    setBuyOneGet(0);
    setBuyOneGetQuantity(0);

    if (selectedDiscountType === 'percentage') {
      setPercentage(0);
    } else if (selectedDiscountType === 'fixed') {
      setFixedAmount(0);
    } else if (selectedDiscountType === 'buyOneGet') {
      setBuyOneGet(0);
      setBuyOneGetQuantity(0);
    }
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
    return result;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let coupon = generateCouponCode();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const imageResponse = await axios.post('http://localhost:8001/upload', formData);
      const imageUrl = imageResponse.data.imageUrl;
      console.log(imageUrl);

      const newCoupon = {
        merchantEmail, // Pass the merchant's email
        title,
        description,
        coupon,
        image: imageUrl,
        discountType,
        percentage,
        fixedAmount,
        buyOneGet,
        buyOneGetQuantity,
        startDate,
        usageLimits,
        expirationDate,
        latitude: merchantLocation.latitude,
        longitude: merchantLocation.longitude,
        address:merchantAddress,
      };

      const couponResponse = await axios.post('http://localhost:8001/AddCoupon', newCoupon);
      alert('Coupon added successfully');
      console.log('Coupon created successfully:', couponResponse.data);
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Error creating coupon. Please try again.');
    }
  };

  return (
    <div className="addCoupan-container">
      <h1>Add Coupon</h1>
      <p>{`Logged in as: ${merchantEmail}`}</p>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <label htmlFor="couponTitle">Coupon Title:</label>
        <input
          className="addcoupan-input"
          type="text"
          id="couponTitle"
          name="couponTitle"
          required
          onChange={handleTitleChange}
        />

        <label htmlFor="couponDescription">Coupon Description:</label>
        <textarea
          id="couponDescription"
          name="couponDescription"
          rows="4"
          onChange={handleDescriptionChange}
          required
        ></textarea>

        

        <label htmlFor="couponDiscountType">Discount Type:</label>
        <select
          id="couponDiscountType"
          name="couponDiscountType"
          value={discountType}
          onChange={handleDiscountTypeChange}
          required
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="buyOneGet">Buy This Get This Type</option>
        </select>

        {discountType === 'percentage' && (
          <div>
            <label htmlFor="percentage">Percentage:</label>
            <input
              className="addcoupan-input"
              type="number"
              id="percentage"
              name="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              required
            />
          </div>
        )}

        {discountType === 'fixed' && (
          <div>
            <label htmlFor="fixedAmount">Fixed Amount:</label>
            <input
              className="addcoupan-input"
              type="number"
              id="fixedAmount"
              name="fixedAmount"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(e.target.value)}
              required
            />
          </div>
        )}

        {discountType === 'buyOneGet' && (
          <div>
            <label htmlFor="buyOneGet">Quantity to buy:</label>
            <input
              type="number"
              id="buyOneGet"
              name="buyOneGet"
              value={buyOneGet}
              onChange={(e) => setBuyOneGet(e.target.value)}
              required
            />

            <label htmlFor="buyOneGetQuantity">Quantity to Get:</label>
            <input
              className="addcoupan-input"
              type="number"
              id="buyOneGetQuantity"
              name="buyOneGetQuantity"
              value={buyOneGetQuantity}
              onChange={(e) => setBuyOneGetQuantity(e.target.value)}
              required
            />
          </div>
        )}

        <label htmlFor="couponStartDate">Start Date:</label>
        <input
          className="addcoupan-input"
          type="date"
          id="couponStartDate"
          name="couponStartDate"
          onChange={handleStartDateChange}
          required
        />

        <label htmlFor="couponUsageLimits">Usage Limits:</label>
        <input
          className="addcoupan-input"
          type="number"
          id="couponUsageLimits"
          name="couponUsageLimits"
          onChange={handleUsageLimitsChange}
          required
        />

        <label htmlFor="couponExpiration">Expiration Date:</label>
        <input
          className="addcoupan-input"
          type="date"
          id="couponExpiration"
          name="couponExpiration"
          onChange={handleExpirationDateChange}
          required
        />

        <label htmlFor="couponImage">Coupon Image:</label>
        <input
          className="addcoupan-input"
          type="file"
          id="couponImage"
          name="couponImage"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {coupon && (
          <div>
            <label>Generated Coupon Code:</label>
            <input type="text" value={coupon} readOnly onChange={setGeneratedCode} />
          </div>
        )}

        <button className="addCoupanButton" type="submit">
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default AddCoupan;
