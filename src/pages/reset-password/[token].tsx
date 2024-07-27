import React, { useEffect, useState } from "react";

import djBooth from '../../assets/images/dj-booth.jpg';
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/router";

declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";

const ResetPasswordClient: React.FC = ()=> {
    const router = useRouter();
    const {token} = router.query;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [secondsToRedirect, setSecondsToRedirect] = useState(10);
    console.log(token)

    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };


    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/login/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Password reset successfully! Redirecting to home page in ${secondsToRedirect} seconds`);
                startRedirectCountdown();
            } else {
                setMessage(data.error);
            }
        } catch (err: any) {
            console.error('Error:', err);
            setMessage('An error occurred. Please try again.');
        }
    };


    const startRedirectCountdown = () => {
        const interval = setInterval(() => {
            setSecondsToRedirect(prevSeconds => prevSeconds - 1);
        }, 1000);

        // Redirect when secondsToRedirect reaches 0
        setTimeout(() => {
            clearInterval(interval);
            window.location.href = '/';
        }, secondsToRedirect * 1000);
    };



    
    return(
        <div className="modal is-open">
            <div className="modal-container">
                <div className="modal-left">
                    <h1 className="modal-title">Please enter your new password</h1>
                    <form onSubmit={handleResetPassword} >
                                <div className="input-block">
                                    <input 
                                    type={showPassword ? "text" : "password"}
                                    id="login-password-change"
                                    name="login-password-change"
                                    placeholder="New password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    />                        
                                </div>
                                <div className="input-block">
                                    <input 
                                    type={showPassword ? "text" : "password"}
                                    id="confirm-login-password"
                                    name="confirm-login-email"
                                    placeholder="Confirm new password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    />                        
                                </div>
                                <div className="modal-buttons">
                                    <button className="toggle-password-visibility" type="button" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>

                                    <button 
                                    className='input-button'
                                    type="submit"
                                    >
                                    Change
                                    </button>
                                </div>
                    </form>

                        <p className="sign-up">{message ? message : 'Change your password and proceed to login page'}</p>
                        <div className="modal-right">
                        <Image alt="DJ-Booth" src={djBooth}></Image>
                         </div>
                </div>
            </div>
        </div>
    )
};

export default ResetPasswordClient;