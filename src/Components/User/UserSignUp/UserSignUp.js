
import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const UserSignUp = () => {
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
        Axios.post('http://localhost:8001/form', { fullname, email, password })
            .then((res) => {
                console.log(res);
                navigate('/UserLogin');
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 400) {
                   
                    alert('User with this email already registered. Please use a different email.');
                } else {
                  
                    alert('An error occurred. Please try again later.');
                }
            });
    };

    return (
        <div className="wrapper2">
            <div className="signup-container">
                <h1 className="main-heading1">User Signup</h1>
                <div className="form-container1">
                    <label>
                        Full Name:
                        <input type="text" onChange={getFullName} />
                    </label>
                    <label>
                        Email:
                        <input type="email" onChange={getEmail} />
                    </label>
                    <label>
                        Password:
                        <input type="password" onChange={getPassword} />
                    </label>
                    <button onClick={handleSignUpSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default UserSignUp;
