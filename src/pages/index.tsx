import React, { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { Item, getItems, setItems } from "../store/homeItems/dataSlice";
import { AppDispatch, RootState } from "../store/store";
import UploadForm from "../components/UploadForm";
import HomeItem from "../components/HomeItem";
import SpeakersCanvas from "@/components/SpeakersCanvas";
import FadeIn from "@/components/FadeIn";
import { fromBottom, fromRight } from "@/utils/animationVariants";
import homeImg from '../assets/images/bg-image-2.jpg';
import Image from "next/image";
import Head from 'next/head';
import { GetServerSideProps } from "next";
import 'react-multi-carousel/lib/styles.css';
import HomeCarousel from "@/components/HomeCarousel";
import Link from "next/link";
import Services from "@/components/Services";
import HomeWedding from "@/components/HomeWedding";
import Blogs from "@/components/Blogs";
import Contacts from "@/components/Contacts";

type HomeProps = {
  title: string;
  description: string;
  imageUrl: string;
  fetchedItems: Item[];
};

const HomePage: React.FunctionComponent<HomeProps> = ({title, description, imageUrl, fetchedItems})=> {
    
  const items = useSelector((state: RootState) => state.data.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, logout, isAdmin } = useAuth();

  useEffect(() => {
    dispatch(setItems(fetchedItems));
  }, [dispatch, fetchedItems]);
    
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

            <div className="canva">
              <SpeakersCanvas></SpeakersCanvas>
            </div>

            <div className="welcome">
                <FadeIn direction={fromBottom}>
                    <h1>Welcome to Yavorm</h1>
                </FadeIn>
                <FadeIn delay={1} direction={fromBottom}>
                    <p>This is a paragraph that will fade in.</p>
                </FadeIn>
                <FadeIn delay={2} direction={fromBottom}>
                    <p>PARTYSTARTER!</p>
                </FadeIn>
            </div>

            <section>
              <div className="welcome-img-wrapper">
                <div>
                  <h2>A FEW WORDS ABOUT</h2>
                  <h2>YAVORM</h2>
                </div>
                <Image alt="home-image" src={homeImg} fill quality={100}></Image>
              </div>
            </section>

            <section>
              {isAuthenticated && isAdmin && (
                <div>
                  <UploadForm/>
                </div>
                )}
            </section>

            <section className="home-carousel-wrapper">
              <h2>РЕНТАЛ</h2>
              <HomeCarousel/>
              <div id="view-all-products">
                <Link href={'/'}>ВИЖ ВСИЧКИ</Link>
              </div>
            </section>

            <section className="home-serives-section">
              <Services/>
            </section>

            <section>
              <HomeWedding/>
            </section>

            <section className="blogs-wrapper">
              <Blogs/>
            </section>

            <section className="contacts-wrapper">
              <Contacts/>
            </section>

              {items && (
                <section className="items">
                  <ul>
                      {items.map((item)=> (
                        <article key={item._id}>
                            <HomeItem
                              data = {item}>
                              </HomeItem>
                        </article>
                      ))}

                  </ul>
                </section>
                )}

          </main>
        </>
      );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test');
    if(!response.ok){
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    return {
      props: {
        title: 'YavorM',
        description: 'YavorM rental and DJs',
        imageUrl: '/dj-booth.jpg',
        fetchedItems: data.items || [], 
      }
    };
  } catch (error:any) {
    console.log('Error:', error)
    return {
      props: {
        title: 'YavorM',
        description: 'YavorM rental and DJs',
        imageUrl: '/dj-booth.jpg',
        fetchedItems: [],
      }
    }
  }

};


export default HomePage;