import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MerchentLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getEmail = (event) => {
    setEmail(event.target.value);
  };

  const getPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    Axios.post('http://localhost:8001/merchentlogin', { email, password })
      .then((res) => {
        console.log(res);
        if (res.data === "Success") {
          // Store the email in session storage
          sessionStorage.setItem('merchentEmail', email);
          console.log(`Email stored in session: ${email}`);
          navigate('/MerchentHomePage');
        } else {
          alert(res.data); 
        }
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="wrapper4">
      <div className="Merchent-signin-container">
        <h1 className="main-heading3">Merchent Login</h1>
        <div className="form-container3">
          <input type="email" placeholder='registered email..' onChange={getEmail} required />
          <br />
          <input type="password" placeholder='password' onChange={getPassword} required />
          <button onClick={handleLoginSubmit}>Login ➤</button>
          <br />
          <div className="ca-style">Create Account ➟
            <Link to="/MerchentSignUpPage"><button>Signup</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchentLoginPage;
