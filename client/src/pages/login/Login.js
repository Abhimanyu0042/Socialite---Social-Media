import React, { useState } from 'react';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import {axiosClient} from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorageManagement';

function Login() {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password
            });
            setItem(KEY_ACCESS_TOKEN,response.result.accessToken);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    

  return (
    <div className='Login'>
        <div className='login-box'>
            <h2 className="heading">
                Login
            </h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" onChange={(e) => { setEmail(e.target.value)}} className='email' />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={(e) => {setPassword(e.target.value)}} className='password' />

                <input type="submit" className='submit' />
            </form>

            <p className='subheading'>Do not have an account? <Link to={"/signup"}>Sign Up</Link> </p>
        </div>
    </div>
    
  )
}

export default Login