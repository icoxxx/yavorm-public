import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import djBooth from '../assets/images/dj-booth.jpg';
import Image from 'next/image';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useIsLoginOpened } from "@/utils/LoginModalContext";
import { useRouter } from "next/router";

declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";

const Login :React.FunctionComponent = ()=> {
    const { isAuthenticated, logout, isAdmin, login } = useAuth();
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isForgot, setIsForgot] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [message, setMessage] = useState('');
    const [wrongCredentials, setWrongCredentials] = useState(false);
    const shakeButtonRef = useRef<HTMLButtonElement | null>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { isLoginOpened, setIsLoginOpened } = useIsLoginOpened();
    const router = useRouter();



    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!executeRecaptcha) {
          console.error('reCAPTCHA not ready');
          return;
        }

        const token = await executeRecaptcha('login');

        if(isForgot){
          setWrongCredentials(false);
          try {
            const response = await fetch('http://localhost:3000/api/login/forgot-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: confirmEmail,
            })
            });

            const data = await response.json();
  
            if (response.ok) {
              setMessage(data.message);
            } else {
              setMessage(data.error);
            }
          } catch (err:any) {
            console.error('Error:', err);
            setMessage('An error occurred. Please try again.');
          }
  
        }

        else{

          try {
            const response = await fetch('http://localhost:3000/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: userPassword,
                captcha: token,
            })
            });
  
            if (!response.ok){
              setWrongCredentials(true)
              if (shakeButtonRef.current) {
                shakeButtonRef.current.classList.remove('shake');
                void shakeButtonRef.current.offsetWidth; // Trigger reflow to restart animation
                shakeButtonRef.current.classList.add('shake');
              }
              throw new Error ("Invalid credentials");
            }
  
            const data = await response.json();
            login(data.token, data.isAdmin);
            //localStorage.setItem('token', JSON.stringify({ token: data.token, isAdmin: data.isAdmin }));
            if(wrongCredentials){
              setWrongCredentials(false);
            }
            //setIsAuthenticated(true)
            closeModal()
            //window.location.reload();
            //closeModal();
  
          } catch (error:any) {
            console.log(error)
          }
  
        };
        }


      const closeModal = () => {
        setIsLoginOpened(false);
        document.body.style.overflow = "initial";
      };
    
    
      const handleModalClose = () => {
        closeModal();
        setIsForgot(false);
        setMessage('');
        setWrongCredentials(false);
        setUserPassword('');
        setUsername('');
      };

      const forgotPassword = () => {
        setIsForgot (true);
      }




    return(
        <>
        <div className="container"></div>
        <div className={`modal ${isLoginOpened ? 'is-open' : ''}`}>
            <div className="modal-container">
                <div className="modal-left">
                    <h1 className="modal-title">{isForgot ? 'Enter your email' : 'Welcome'}</h1>
                    <p className="modal-desc">{isForgot ? 'We will send you a link in your inbox.' : 'Please use your email and password to login.'}</p>

                    <form id="login-form" onSubmit={handleLogin} >
                      {isForgot
                      ?
                      (
                        <div className="input-block">
                              <input 
                              type="text"
                              id="login-email"
                              name="login-email"
                              placeholder="Email"
                              onChange={(e) => setConfirmEmail(e.target.value)}
                              autoComplete="on"
                              />                        
                        </div>
                      )
                      : (
                        <React.Fragment>
                            <div className="input-block">
                              <input 
                              type="text"
                              id="login-email"
                              name="login-email"
                              placeholder="Email"
                              onChange={(e) => setUsername(e.target.value)}
                              autoComplete="on"
                              />
                            </div>
                            <div className="input-block">
                              <input 
                              type="password"
                              id="login-password"
                              name="login-password"
                              placeholder="Password"
                              onChange={(e) => setUserPassword(e.target.value)}
                              autoComplete="on"
                              />
                            </div>
                        </React.Fragment>
                      )
                      }
                            <div className="modal-buttons">
                                <div className="" onClick={forgotPassword} >Forgot your password?</div>


                                <button 
                                className={wrongCredentials ? 'input-button shake' : 'input-button'} 
                                type="submit"
                                ref={shakeButtonRef}
                                >
                                  {isForgot ? 'Send' : 'Login'}
                                </button>
                            </div>
                        </form>

                    <p className="sign-up">{message ? message : 'Login into your admin account'}</p>
                <div className="modal-right">
                        
                        <Image alt="DJ-Booth" src={djBooth}></Image>
                </div>
                    <button className="icon-button close-button" onClick={handleModalClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path d="M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.13842 3 25 3 z M 25 5 C 36.05754 5 45 13.94246 45 25 C 45 36.05754 36.05754 45 25 45 C 13.94246 45 5 36.05754 5 25 C 5 13.94246 13.94246 5 25 5 z M 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.980469 15.990234 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
      
        </>
    )
};

export default Login;