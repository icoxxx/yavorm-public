import React, { useRef, useState } from "react";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import djEvent from '../assets/images/dj-event-pic.jpg';
import Image from "next/image";

const Contacts:React.FC = ()=> {
    
    
      const[loading, setLoading] = useState(false);
      const[userName, setUserName] = useState('');
      const[userEmail, setUserEmail] = useState('');
      const[userMessage, setUserMessage] = useState('');
      const shakeButtonRef = useRef<HTMLButtonElement | null>(null);
      const [fetchMessage, setFetchMessage] = useState('');
      const { executeRecaptcha } = useGoogleReCaptcha();

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        if (!executeRecaptcha) {
            console.error('reCAPTCHA not ready');
            return;
          }
        const token = await executeRecaptcha('sendEmail');

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userName: userName,
                  email: userEmail,
                  message: userMessage,
                  captcha: token,
              })
              });
              const data = await response.json();
  
              if (response.ok) {
                setUserName('');
                setUserEmail('');
                setUserMessage('');
                setFetchMessage(data.message);
              } else {
                if (shakeButtonRef.current) {
                    shakeButtonRef.current.classList.remove('shake');
                    void shakeButtonRef.current.offsetWidth; // Trigger reflow to restart animation
                    shakeButtonRef.current.classList.add('shake');
                  }
                setFetchMessage(data.error);
              }
        } catch (error:any) {
            console.error('Error:', error);
        }
        finally{
            setLoading(false)
        }
      }
    return(
        <div className="contact-container">
            <div className="contact-text-container">
                <div className="contact-img-cover">
                    <Image src={djEvent} quality={100} alt="dj-event" />
                </div>
                <div className="contact-text-wrapper">
                    <div className="contact-text-title">
                        <h2>YavorM</h2>
                        <h2>Бранд, изграден от <span>професионалисти</span></h2>
                    </div>
                    <div className="contact-text-title">
                        <p>Нашият екип работи неуморно, за да направи всяко събитие <span>неповторимо</span></p>
                        <p>Имате запитване? Попълнете формата и ни изпратете съобщение.</p>
                    </div>
                </div>
            </div>
            <div className="contact-form">
                <p className="section-sub-text">Get in touch</p>
                <h3 className="section-head-text">Contact.</h3>
                <form onSubmit={handleSubmit} className="contact-form-elements">
                    <label className="form-label-contacts">
                        <span className="label-text-contacts">Your name</span>
                        <input type="text" name="name-contacts" onChange={(e)=> setUserName(e.target.value)} value={userName} placeholder="What's your name?" className="input-field-contacts" />
                    </label>
                    
                    <label className="form-label-contacts">
                        <span className="label-text-contacts">Email</span>
                        <input type="email" name="email-contacts" onChange={(e)=> setUserEmail(e.target.value)} value={userEmail} placeholder="What's your email?" className="input-field-contacts" />
                    </label>
                    
                    <label className="form-label-contacts">
                        <span className="label-text-contacts">Your message</span>
                        <textarea rows={7} name="message-contacts" onChange={(e)=> setUserMessage(e.target.value)} value={userMessage} placeholder="What do you want to say?" className="input-field-contacts"></textarea>
                    </label>
                    
                    <button ref={shakeButtonRef} type="submit" className="submit-button-contacts">
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Contacts;