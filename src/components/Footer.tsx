import React, { useEffect, useState } from "react";
import logo from '../assets/images/Yavor-M-logo-color.svg';
import Image from "next/image";
import {FaPhone, FaEnvelope, FaShoppingCart, FaBlogger, FaImages, FaHome} from 'react-icons/fa';
import { useRouter } from "next/router";
import useScrollToContacts from "@/utils/useScrollToContacts";
import { FacebookIcon, InstagramIcon } from "next-share";
import UAParser from 'ua-parser-js';

const Footer: React.FC = ()=> {
    const [isMobile, setIsMobile] = useState(false);
        
    useEffect(() => {
        const parser = new UAParser();
        setIsMobile(parser.getDevice().type === 'mobile');
      }, []);

    const Section1 = () => {

        return (
    
            <div>
    
                <Nav />
    
            </div>
    
        )
    
    }
    
    
    
    const Section2 = () => {
    
        return (
    
            <div className='footer-section2'>
    
                <Image width={550} height={180} src={logo} alt="logo" />
    
                <p>©copyright</p>
    
            </div>
    
        )
    
    }

    const Section3 = ()=> {
        return(
            <div className="dev">
                <h3>Developer</h3>
                <p>Hristiyan Valkov</p>
                <p>hristiyanv@gmail.com</p>
            </div>
        )
    }


    interface SocialMediaButtonProps {
        platform: string;
        webUrl: string;
        appUrl: string;
      }
      
    const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({ platform, webUrl, appUrl }) => {

        const handleClick = () => {
          if (isMobile) {
            window.location.href = appUrl;
          } else {
            window.open(webUrl, '_blank');
          }
        };
      
        return (
            <>
            {platform === 'Instagram' ? (
              <span onClick={handleClick} className="footer-links">
                <InstagramIcon size={30} round />
                {platform}
              </span>
            ) : platform === 'Facebook' ? (
              <span onClick={handleClick} className="footer-links">
                <FacebookIcon size={30} round />
                {platform}
              </span>
            ) : null}
          </>
        );
      };
    
    
    
    const Nav = () => {
        const links = [
            {href: '/', text: 'Home', icon: <FaHome className="footer-home" />},
            {href: '/rental', text: 'Rental', icon: <FaShoppingCart className="footer-rental" />},
            {href: '/blogs/page/1', text: 'Blogs', icon: <FaBlogger className="footer-blogs" />},
            {href: '/gallery', text: 'Gallery', icon: <FaImages className="footer-gallery" />}
        ]
        const router = useRouter();
        const scrollToContacts = useScrollToContacts();



        return (
    
            <div className='footer-nav-wrapper'>
    
                <div className='first-nav'>
    
                    <h3>About</h3>

                    {links.map((link, index)=> {
                        return(
                            <span 
                            key={`footer-${index}`} 
                            onClick={()=> router.push(link.href)}
                            >
                               {link.icon} {link.text}
                            </span>
                        )
                    })}
    
                </div>

    
                <div className='second-nav'>
    
                    <h3>Contact</h3>
    
                    <span> <FaPhone className="footer-phone"/> +359 897 93 21 08</span>
    
                    <span className="footer-links" onClick={scrollToContacts} > <FaEnvelope className="footer-mail"/> Send Mail</span>
    
                    <SocialMediaButton 
                    platform="Facebook"
                    appUrl="fb://profile/1401170129"
                    webUrl="https://www.facebook.com/yavor.milkov"
                     />

                    <SocialMediaButton
                    platform="Instagram"
                    appUrl="instagram://user?username=yavor_milkov"
                    webUrl="https://www.instagram.com/yavor_milkov"
                    />
    
                </div>
    
            </div>
    
        )
    
    }

    return(
        <footer>
            <div className="footer-wrapper">
                <div className="footer-container">
                    <Section1/>
                    <Section3/>
                    <Section2/>
                </div>
            </div>
        </footer>
    )
};

export default Footer;