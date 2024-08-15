import Image from "next/image";
import React from "react";
import Carousel from 'react-multi-carousel';
import djma9 from '../assets/images/DJM-A9.png';
import cdj3000 from '../assets/images/CDJ-3000.png';
import speakers from '../assets/images/art-945.png';
import rcfSub from '../assets/images/rcf-sub.png';
import lights from '../assets/images/lights.png';
import flx10 from '../assets/images/ddj-flx10.png';
import shure from '../assets/images/shure-mic.png';
import { useCategory } from "@/utils/RentalCategoryContext";
import { useRouter } from "next/router";

const HomeCarousel: React.FC = ()=> {
    const {setCategoryToLoad} = useCategory();
    const router = useRouter();
    const carouselProps = 
    [
        {
            image: djma9,
            text: 'DJ миксери',
        },
        {
            image: cdj3000,
            text: 'DJ плеъри',
        },
        {
            image: speakers,
            text: 'Тонколони',
        },
        {
            image: rcfSub,
            text: 'Субуфери',
        },
        {
            image: lights,
            text: 'Осветление',

        },
        {
            image: flx10,
            text: 'DJ контролери',
        },
        {
            image: shure,
            text: 'Микрофони',
        },
    ]
    return(
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
                items: 3,
                partialVisibilityGutter: 40
                },
                mobile: {
                breakpoint: {
                    max: 550,
                    min: 0
                },
                items: 1,
                partialVisibilityGutter: 30
                },
                tablet: {
                breakpoint: {
                    max: 1024,
                    min: 550
                },
                items: 2,
                partialVisibilityGutter: 30
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
            >
                {
                    carouselProps.map((el, index)=> {
                        return(
                            <div key={`home-car-${index}`} className="home-carousel-items">
                                <div className="home-carousel-content">
                                    <div className="home-carousel-image-container">
                                        <Image className="home-carousel-img" src={el.image} quality={100} alt={el.text} />
                                    </div>
                                    <div className="home-carousel-text-wrapper">
                                        <div 
                                        className="home-carousel-text stack" 
                                        style={{ "--stacks": 3} as any}
                                        onClick={()=> {
                                            setCategoryToLoad(el.text);
                                            router.push('/rental');
                                        }}
                                        >
                                            <span style={{"--index": 0} as any}>{el.text}</span>
                                            <span style={{"--index": 1} as any}>{el.text}</span>
                                            <span style={{"--index": 2} as any}>{el.text}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
        </Carousel>
    )
}

export default HomeCarousel;