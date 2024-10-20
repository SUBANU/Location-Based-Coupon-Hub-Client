import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
const MainPage = () => {
  return (
    <div className='container'>
    <h1 class="h1">Welcome to Smart Shopping System.!!</h1>
    <div class="wrapper1">
    <div class="button-container">
    <Link className='l1' to="/UserLogin"><button class="button">User</button></Link>
        <Link className='l1' to="/"><button class="button" >Admin</button></Link>
        <Link className='l1' to="/MerchentLoginPage"><button class="button" >Merchent</button></Link>
    </div>
    </div>
    </div>
  )
}

export default MainPage;

