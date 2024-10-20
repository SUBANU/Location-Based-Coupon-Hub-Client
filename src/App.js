import './App.css';
import MainPage from './Components/MainPage/MainPage.js';
import React from 'react';
import UserHomePage from './Components/User/UserHomePage/UserHomePage.js';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MerchentHomePage from './Components/Merchent/MerchentHomePage/MerchentHomePage.js';
import UserSignUp from './Components/User/UserSignUp/UserSignUp.js';
import UserLogin from './Components/User/UserLogin/UserLogin.js';
import MerchentLoginPage from './Components/Merchent/MerchentLoginPage/MerchentLoginPage.js';
import MerchentSignUpPage from './Components/Merchent/MerchentSignUpPage/MerchentSignUpPage.js';
import AddCoupan from './Components/Merchent/AddCoupan/AddCoupon.js'
import WishlistPage from './Components/User/WishlistPage/WishlistPage.js';
import MapSearch from './Components/User/MapSearch/MapSearch.js';
import Profile from './Components/Merchent/Profile/Profile.js';
import MerchantCouponsDetails from './Components/User/MerchantCoupanDetails/MerchantCouponsDetails.js';



function App() {
  return (
    <Router>
    <Routes>
    
    <Route path="/" element={<MainPage/>} />
    <Route path="/UserLogin" element={<UserLogin/>} />
    <Route path="/UserSignUp" element={<UserSignUp/>} />
      <Route path="/UserHomePage" element={<UserHomePage/>} />
      <Route path="/MerchentLoginPage" element={<MerchentLoginPage/>} />
      <Route path="/MerchentSignUpPage" element={<MerchentSignUpPage/>} />  
      <Route path="/MerchentHomePage" element={<MerchentHomePage/>} />
      <Route path="/AddCoupan" element={<AddCoupan/>} />
    <Route path="/wishlist/:userEmail"  element={ <WishlistPage/>}/>
    <Route path="/profile" element={<Profile/>} />
    <Route path="/mapSearch" element={<MapSearch/>} />
    <Route path="/merchentCoupons" element={<MerchantCouponsDetails/>} />
   
   
    </Routes>
      
    </Router>
  );
}

export default App;
