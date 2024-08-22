import Login from './Login';
import Hamburger from "hamburger-react";
import Link from "next/link";
import React, { createRef, useEffect, useRef, useState } from "react";
import StarsCanvas from './Stars';
import { useIsLoginOpened } from '@/utils/LoginModalContext';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '../assets/images/Yavor-M-logo-color.svg';
import useScrollToContacts from '@/utils/useScrollToContacts';
import { BiLogIn } from 'react-icons/bi';
import { FaUserShield, FaShoppingCart, FaBlogger, FaImages, FaHome, FaEnvelope } from 'react-icons/fa';
import { useIsCanvas } from '@/utils/CanvasContext';

const Header: React.FC = ()=> {
    const [isMenuOpen, setIsMenuOPen] = useState<boolean | undefined>(undefined);
    const [windowWidth, setWindowWidth] = useState<undefined | number>(undefined);
    const [isClient, setIsClient] = useState(false);
    const { isLoginOpened, setIsLoginOpened } = useIsLoginOpened();
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const [isInitial, setIsInitial] = useState(true);
    const router = useRouter();
    const scrollToContacts = useScrollToContacts();
    const {isCanvas, setIsCanvas} = useIsCanvas();
    
    useEffect(() => {
        setIsClient(true);
        setWindowWidth(window.innerWidth)
      }, [])


      const handleScroll = ()=> {
        if(isClient){
          const body = document.body;
          if (isMenuOpen) {
            body.style.position = 'fixed';
            body.style.top = `-${window.scrollY}px`;
            body.style.width = '100%';
          } else {
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
      }

      const handleMenuToggle = () => {
        setIsMenuOPen(prevState => prevState === null ? true : !prevState);
      };

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
    
      useEffect(()=> {
        handleScroll();
        if(isMenuOpen){
            window.addEventListener("resize", handleResize);
        }
        else{
            window.removeEventListener("resize", handleResize);
        }
        setIsCanvas(isMenuOpen)
      }, [isMenuOpen]);
    
      useEffect(() => {
        if(windowWidth !== undefined){
          if (windowWidth > 700) {
            if(isMenuOpen){
              setIsMenuOPen(false)
            }
        }
        }
      }, [windowWidth]);
    
    const navLinks = [
        {text: 'HOME', color: "#f44336", link: '/', icon: <FaHome className='hidden-icons'/>},
        {text: 'CONTACT', color: "#9c27b0", link: '', icon: <FaEnvelope className='hidden-icons'/>},
        {text: 'RENTAL', color: "#e91e63", link: '/rental', icon: <FaShoppingCart className='hidden-icons'/>},
        {text: 'BLOGS', color: '#673ab7', link: '/blogs/page/1', icon: <FaBlogger className='hidden-icons'/>},
        {text: 'GALLERY', color: '#3f51b5', link: '/gallery', icon: <FaImages className='hidden-icons'/>},
        {text: 'LOGIN', color: '#05a89b', link: '', icon: <BiLogIn className='hidden-icons'/>},
        {text: 'ADMIN', color: '#158c4f', link: '/admin', icon: <FaUserShield className='hidden-icons'/>},
      ];

    const $root:any = useRef();
    const $indicator1:any = useRef();
    const $items:any = useRef(navLinks.map(createRef));
    const [active, setActive] = useState(0);

    const animate = () => {
        const menuOffset = $root.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const activeItem = $items.current[active].current;

        if (activeItem) {
            const { width, height, top, left } = activeItem.getBoundingClientRect();

            const indicatorStyle = {
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(${left - menuOffset.left}px, ${top - menuOffset.top}px)`,
                backgroundColor: navLinks[active].color,
                transition: isInitial ? 'none' : 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
            };

            if ($indicator1.current) {
                Object.assign($indicator1.current.style, indicatorStyle);
            }

        }
    };

      useEffect(() => {
        setIsInitial(false);
        animate();
        window.addEventListener('resize', animate);
    
        return () => {
          window.removeEventListener('resize', animate);
        };
      }, [active, $root.current, isAuthenticated]);

      const [openLoginFromMenu, setOpenLoginFromMenu] = useState(false);

      const openLoginFromHidden = ()=> {
        if(openLoginFromMenu){
          openModal();
          setOpenLoginFromMenu(false);
        }
      }

      const openModal = () => {
        setIsLoginOpened(true);
        document.body.style.overflow = "hidden";
      };


      
    return(
    <header className="header-container">
        <nav onTransitionEnd={openLoginFromHidden} className={`hidden-menu ${isMenuOpen === undefined ? "" : (isMenuOpen ? "hidden-active" : "hidden-inactive")}`}>
          {isMenuOpen && (<StarsCanvas/>)}
          {navLinks.map((navLink, index)=>
            navLink.text !== 'CONTACT' 
            ?
            <Link  onClick={(e)=> {
              handleMenuToggle()
              if((e.target as HTMLElement).textContent === 'LOGIN'){
                setOpenLoginFromMenu(true);
              }
              if((e.target as HTMLElement).textContent === 'LOGOUT'){
                logout()
                router.push('/')
              }
            }}  
            key={`${index}-${navLink.text}`} 
            href={navLink.link}
            >
              {navLink.icon}
              {
              navLink.text !== 'LOGIN'
              ?
              navLink.text
              :
              (isAuthenticated ? 'LOGOUT' : 'LOGIN')
            }
            </Link>
            :
            <div
            className='contacts-hidden' 
            onClick={()=> {handleMenuToggle(), setTimeout(() => {
              scrollToContacts()
            }, 100);}}
            key={`${index}-${navLink.text}`} 
            >
              {navLink.icon} {navLink.text}
            </div> 
          )}
        </nav>
        <nav className="nav-container" ref={$root}>
            <div className={isMenuOpen ? 'hamb-button hamb-active' : 'hamb-button'}>
              <Hamburger toggled={isMenuOpen} toggle={handleMenuToggle} />
            </div>
            <div className='logo-mobile-nav'>
              <Link href={'/'}>
              <Image src={logo} width={90} height={90} quality={100} alt='logo' />
              </Link>
            </div>
            {navLinks.map((navLink, index) => {
              if (navLink.text !== 'LOGIN' && navLink.text !== 'ADMIN' && navLink.text !== 'CONTACT') {
                return (
                  <Link
                    className={`item ${active === index ? 'active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    ref={$items.current[index]}
                    key={`${index}-${navLink.text}`}
                    href={navLink.link}
                  >
                    {navLink.text}
                  </Link>
                );
              } else if (navLink.text === 'LOGIN') {
                return (
                  <div
                    className={`item ${active === index ? 'active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    ref={$items.current[index]}
                    key={`${index}-${navLink.text}`}
                    onClick={isAuthenticated ? logout : openModal}
                  >
                    {isAuthenticated ? 'LOGOUT' : 'LOGIN'}
                  </div>
                );
              } else if (navLink.text === 'ADMIN' && isAuthenticated && isAdmin) {
                return (
                  <Link
                    className={`item ${active === index ? 'active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    ref={$items.current[index]}
                    key={`${index}-${navLink.text}`}
                    href={navLink.link}
                  >
                    {navLink.text}
                  </Link>
                );
              }
              else if (navLink.text === 'CONTACT') {
                return (
                  <div
                  className={`item ${active === index ? 'active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  ref={$items.current[index]}
                  key={`${index}-${navLink.text}`}
                  onClick={scrollToContacts}
                >
                  {navLink.text}
                </div>
                )
              }
            })}
            <div ref={$indicator1} className="indicator" />
        </nav>
         <div>
            <Login></Login>
         </div>
    </header>        
    )
}

export default Header;