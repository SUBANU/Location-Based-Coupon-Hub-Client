import React, { useState } from 'react';
import './style.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MerchentSignUpPage = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const getFullName = (event) => {
        setFullname(event.target.value);
    };

    const getEmail = (event) => {
        setEmail(event.target.value);
    };

    const getPassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSignUpSubmit = (event) => {
        event.preventDefault();
        console.log(`Submitted with values: ${fullname}, ${email}, ${password}`);
        Axios.post('http://localhost:8001/merchentform', { fullname, email, password })
            .then((res) => {
                console.log(res);
                navigate('/MerchentLoginPage');
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    alert('Merchant with this email already registered. Please use a different email.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            });
    };

    return (
        <div className="wrapper5">
            <div className="merchent-signup-container">
                <h1 className="main-heading4">Merchant Signup</h1>
                <div className="form-container4">
                    <label>
                        Full Name:
                        <input type="text" onChange={getFullName} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" onChange={getEmail} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" onChange={getPassword} required />
                    </label>
                    <button onClick={handleSignUpSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default MerchentSignUpPage;
