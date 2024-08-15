import React, { useEffect, useState } from "react";
import logo from '../assets/images/Yavor-M-logo-color.svg';
import Image from "next/image";
import {FaPhone, FaEnvelope} from 'react-icons/fa';
import { useRouter } from "next/router";
import useScrollToContacts from "@/utils/useScrollToContacts";

const Footer: React.FC = ()=> {

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
    
    
    
    const Nav = () => {
        const links = [
            {href: '/', text: 'Home'},
            {href: '/rental', text: 'Rental'},
            {href: '/blogs/page/1', text: 'Blogs'},
            {href: '/gallery', text: 'Gallery'}
        ]
        const router = useRouter();
        const scrollToContacts = useScrollToContacts();



        return (
    
            <div className='footer-nav-wrapper'>
    
                <div className='first-nav'>
    
                    <h3>About</h3>

                    {links.map((link, index)=> {
                        return(
                            <p key={`footer-${index}`} onClick={()=> router.push(link.href)} >{link.text}</p>
                        )
                    })}
    
                </div>
    
                <div className='second-nav'>
    
                    <h3>Contact</h3>
    
                    <span> <FaPhone/> +359 899 28 91 28</span>
    
                    <span onClick={scrollToContacts} > <FaEnvelope/> Send Email</span>
    
                    <p>Certification</p>
    
                    <p>Publications</p>
    
                </div>
    
            </div>
    
        )
    
    }

    return(
        <footer>
            <div className="footer-wrapper">
                <div className="footer-container">
                    <Section1/>
                    <Section2/>
                </div>
            </div>
        </footer>
    )
};

export default Footer;