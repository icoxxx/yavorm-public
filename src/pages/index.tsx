import React, { useRef, useState } from "react";
import { useEffect } from "react";
import SpeakersCanvas from "@/components/SpeakersCanvas";
import FadeIn from "@/components/FadeIn";
import {fromLeft80} from "@/utils/animationVariants";
import homeImg from '../assets/images/bg-image-2.jpg';
import Image from "next/image";
import Head from 'next/head';
import { GetServerSideProps } from "next";
import 'react-multi-carousel/lib/styles.css';
import HomeCarousel from "@/components/HomeCarousel";
import Link from "next/link";
import Services from "@/components/Services";
import HomeWedding from "@/components/HomeWedding";
import Contacts from "@/components/Contacts";
import { motion } from "framer-motion";
import { BlogItem } from "@/store/blogItems/blogSlice";
import {MdArrowForward} from 'react-icons/md';
import { useIsLoginOpened } from "@/utils/LoginModalContext";
import { useIsCanvas } from "@/utils/CanvasContext";

type HomeProps = {
  title: string;
  description: string;
  imageUrl: string;
  fetchedItems: BlogItem[];
};

const HomePage: React.FunctionComponent<HomeProps> = ({title, description, imageUrl, fetchedItems})=> {
    

  const [isClient, setIsClient] = useState(false);

  const slider = useRef<HTMLDivElement | null>(null);
  const firstText = useRef<HTMLParagraphElement | null>(null);
  const secondText = useRef<HTMLParagraphElement | null>(null);
  const {isCanvas} = useIsCanvas();
  
  useEffect(() => {
    setIsClient(true);
  }, [])

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };


    const scrollToRental = ()=> {
      const rental = document.querySelector('.home-carousel-wrapper');
      if(rental){
        rental.scrollIntoView({ behavior: 'smooth' });
      }
    }
  
    
      return (
       <>
        <Head>
          <title>{title}</title>
          <meta
            name="format-detection"
            content="telephone=no, date=no, email=no, address=no"
          />
          <link rel="icon" href={imageUrl} type="image/jpeg"/>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:image" content={imageUrl} />
        </Head>

          <main id="page-wrap">

            <section>
                <div className="welcome-img-wrapper">
                  <Image alt="home-image" src={homeImg} fill quality={100}></Image>
                  <div className="welcome-slider-container">
                    <div ref={slider} className={slider.current && isClient ? `welcome-slider add-animation` : `welcome-slider`}>
                      <p ref={firstText} className="first">Yavor<span>M</span> - Events & Rental</p>
                      <p ref={secondText} className="second">Yavor<span>M</span> - Events & Rental</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="canvas-section">
                  <div className="canva">
                    <div className="lines">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                    </div>
                    <FadeIn className="canvas-home-text" direction={fromLeft80} thresh={0.1} delay={0.5} >
                      РЕНТАЛ
                      </FadeIn>
                    <SpeakersCanvas></SpeakersCanvas>
                    <div className='scroll-indicator-container'>
                          <div onClick={scrollToRental} className='scroll-indicator-wrapper'>
                            <motion.div
                              animate={{
                                y: [0, 24, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                              className='scroll-indicator'
                              />
                          </div>
                      </div>
                  </div>
            </section>

            <section className="home-carousel-wrapper">
              <div id="view-all-products">
                <Link href={'/rental'}>ВИЖ ВСИЧКИ <span><MdArrowForward/></span></Link>
              </div>
              <HomeCarousel/>
            </section>

            <section className="home-services-section">
              <div className="services-home-container">
                <div className="lines">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                  </div>
                <Services/>
              </div>
            </section>

            <section className="home-wedding-section">
              <HomeWedding/>
            </section>

            <section className="blogs-wrapper">
              <div className="blogs-home-container">
                <div className="lines">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                </div>
                <FadeIn direction={fromLeft80} thresh={0.1} delay={0.5}>
                  <h2 className="home-blogs-title">ПОСЛЕДНИ СТАТИИ</h2>
                </FadeIn>
                <div className="home-blogs-flex-wrapper">
                  {fetchedItems && fetchedItems.length > 0 && (
                    fetchedItems.map((blog, index)=> {
                      if(index === 0 || index === 1){
                        return(
                          <article key={`home-blog-${index}`} className="home-blog-container">
                              <div className="home-blog-img-container">
                                {blog.image && (
                                  <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 350px, 350px" src={`/uploads/blogs/${blog.image}`} quality={100} alt="lala" />
                                )}
                              </div>
                              <div className="home-blog-author-date"><p>{blog.blogAuthor}</p> <p>{formatDate(blog.date)}</p></div>
                              <div className="home-blog-text-container">
                                  <Link className="home-link-from-title" href={`/blogs/${blog._id}`}>
                                      <h2>  
                                          {blog.blogTitle && (
                                              blog.blogTitle.length > 60
                                              ? `${blog.blogTitle.slice(0, 60)}...` // Truncate at 100 characters and add ellipsis
                                              : blog.blogTitle
                                          )}
                                      </h2>
                                  </Link>
                                  <p className="home-blog-text-sliced">{blog.blogText?.slice(0, 110)} ...</p>
                                  <Link className="home-button-to-blog" href={`/blogs/${blog._id}`}>ПРОЧЕТИ ОЩЕ</Link>
                              </div>
                        </article>
                        )
                      }
                      else{
                        return;
                      }
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="contacts-wrapper">
              <Contacts/>
            </section>

          </main>
        </>
      );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/blogs');
    if(!response.ok){
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    return {
      props: {
        title: 'YavorM - Oзвучителна и осветителна техника под наем. Професионални диджеи за вашето събитие.',
        description: 'DJ, озвучителна и осветителна техника под наем. Професионални диджеи за вашето събитие. DJ миксери, DJ, плеъри. Актуални новини от музикалния свят. YavorM!',
        imageUrl: '/dj-booth.jpg',
        fetchedItems: data.items || [], 
      }
    };
  } catch (error:any) {
    console.log('Error:', error)
    return {
      props: {
        title: 'YavorM - Oзвучителна и осветителна техника под наем. Професионални диджеи за вашето събитие.',
        description: 'DJ, озвучителна и осветителна техника под наем. Професионални диджеи за вашето събитие. DJ миксери, DJ, плеъри. Актуални новини от музикалния свят. YavorM!',
        imageUrl: '/dj-booth.jpg',
        fetchedItems: [],
      }
    }
  }

};


export default HomePage; 