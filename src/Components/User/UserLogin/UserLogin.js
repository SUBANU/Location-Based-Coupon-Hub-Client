import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const getEmail = (event) => {
        setEmail(event.target.value);
    };

    const getPassword = (event) => {
        setPassword(event.target.value);
    };

    // const handleLoginSubmit = (event) => {
    //     event.preventDefault();

    //     Axios.post('http://localhost:8001/login', { email, password })
    //         .then((res) => {
    //             console.log(res);
    //             if (res.data === "Success") {
    //                 navigate('/UserHomePage');
    //             } else {
    //                 alert(res.data); // Show server response message in case of failure
    //             }
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             alert('An error occurred. Please try again later.');
    //         });
    // };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const response = await Axios.post('http://localhost:8001/login', { email, password });
    
          if (response.data === "Success") {
            sessionStorage.setItem('userEmail', email);
            navigate('/UserHomePage');
          } else {
            alert(response.data); // Show server response message in case of failure
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred. Please try again later.');
        }
      };

    return (
        <div className="wrapper3">
            <div className="signin-container">
                <h1 className="main-heading2">User Login</h1>
                <div className="form-container1">
                    <label>
                        Email:
                        <input type="email" placeholder="Registered email..." onChange={getEmail} required />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" placeholder="Password" onChange={getPassword} required />
                    </label>
                    <button onClick={handleLoginSubmit}>Login ➤</button>
                    <br />
                    <div>New User?
                        <Link to="/UserSignUp"><button>Signup</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
