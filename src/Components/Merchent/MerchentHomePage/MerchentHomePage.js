import React, { useState } from 'react';
import './style.css';

const MerchentHomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="main_box">
      <input type="checkbox" id="check" checked={menuOpen} onChange={toggleMenu} />
      <div className='btn_one'>
        <label htmlFor="check">
          <i className='fas fa-bars'></i>
        </label>
      </div>
      <div className='btn_two'>
        <label htmlFor="check">
          <i className="fas fa-times"></i>
        </label>
      </div>
      <div className={`sidebar_menu ${menuOpen ? 'open' : ''}`}>
        <div className="logo">
          <h1>𝓢𝓢𝓢 🛍️</h1>
        </div>
        <div className='menu'>
          <ul>
            <li><a href="/MerchentHomePage"><i className="fa-solid fa-house"></i>Home</a></li>
            <li><a href="/AddCoupan"><i className="fa-solid fa-plus"></i>Add Coupon</a></li>
            <li><a href="#view-coupon"><i className="fa-solid fa-eye"></i>View Coupon</a></li>
            <li><a href="/Profile"><i className="fa-solid fa-user"></i>Profile</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MerchentHomePage;
