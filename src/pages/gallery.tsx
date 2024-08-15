import { GalleryItem } from "@/store/galleryItems/gallerySlice";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import close from '../assets/images/delete-button.png';
import FadeIn from "@/components/FadeIn";
import { fromLeft80, fromRight80 } from "@/utils/animationVariants";
import GalleryImage from "@/components/GalleryImage";
import Head from "next/head";

type GalleryPageProps = {
    title: string;
    description: string;
    imageUrl: string;
    galleryItems: GalleryItem[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({title, description, imageUrl, galleryItems}) => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [openedImage, setOpenedImage] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(()=> {
        setIsClient(true)
    },[])

    useEffect(()=> {
        if(isClient){
            const body = document.body;
            if(isModalOpened){
                body.style.position = 'fixed';
                body.style.top = `-${window.scrollY}px`;
                body.style.width = '100%';
            }
            else{
                const scrollY = body.style.top;
                body.style.position = '';
                body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    },[isModalOpened])

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
        <div className="gallery-page-wrapper">
            {galleryItems && galleryItems.length > 0 && (
             galleryItems.map((gallery, index)=> {
                return(
                <FadeIn direction={index % 2 === 0 ? fromLeft80 : fromRight80} delay={0.3} thresh={0.1} key={`gallery-section-${index}`} className="gallery-carousel-wrapper">
                    <div className="gallery-name">{gallery.galleryName}</div>
                    <Carousel
                        additionalTransfrom={0}
                        arrows
                        autoPlaySpeed={3000}
                        centerMode={false}
                        containerClass="home-carousel-container"
                        draggable
                        focusOnSelect={false}
                        infinite
                        keyBoardControl
                        minimumTouchDrag={80}
                        pauseOnHover
                        renderArrowsWhenDisabled={false}
                        renderButtonGroupOutside={false}
                        renderDotsOutside={false}
                        responsive={{
                            desktop: {
                            breakpoint: {
                                max: 3000,
                                min: 1024
                            },
                            items: 2,
                            },
                            mobile: {
                            breakpoint: {
                                max: 600,
                                min: 0
                            },
                            items: 1,
                            },
                            tablet: {
                            breakpoint: {
                                max: 1024,
                                min: 600
                            },
                            items: 2,
                            }
                        }}
                        rewind={false}
                        rewindWithAnimation={false}
                        rtl={false}
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                        ssr
                        partialVisbile={false}
                        >
                            {gallery.images && gallery.images.length > 0 && (
                            gallery.images.map((image, index)=> {
                             return(
                                <div onClick={()=> (setIsModalOpened(true), setOpenedImage(image))} key={`image-${index}`} className="gallery-carousel-items">
                                    <div className="gallery-carousel-img-container">
                                        <GalleryImage src={`/uploads/gallery/${image}`} alt={`${gallery.galleryName}-image`} />
                                    </div>
                                </div>
                             )
                            })
                            )}
                    </Carousel>
                </FadeIn>
                )
             })
            )}
            <div className={`modal ${isModalOpened ? 'is-open' : ''}`}>
                <div className="opened-image-container">
                    {isModalOpened && (<div className="close-image" onClick={()=> setIsModalOpened(false)} ><Image src={close} width={50} height={50} alt="close" /></div>)}
                    {openedImage && isModalOpened && (
                        <Image className="opened-image" quality={100} fill src={`/uploads/gallery/${openedImage}`} alt={`gallery-image`} />
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/gallery');
      if(!response.ok){
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      console.log(data.items)
      return {
        props: {
          title: 'YavorM - Галерия',
          description: 'YavorM събития - галерия',
          imageUrl: '/dj-booth.jpg',
          galleryItems: data.items || [], 
        }
      };
    } catch (error:any) {
      console.log('Error:', error)
      return {
        props: {
          title: 'YavorM - Галерия',
          description: 'YavorM събития - галерия',
          imageUrl: '/dj-booth.jpg',
          galleryItems: [],
        }
      }
    }
  
  };

export default GalleryPage;