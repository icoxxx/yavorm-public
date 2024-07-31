import React, { useEffect, useState } from "react";
import quote from '../assets/images/quote.png';
import Image from "next/image";
import FadeIn from "./FadeIn";
import { fromLeft, fromRight, fromTop } from "@/utils/animationVariants";

const HomeWedding: React.FC = ()=> {
    const [isClient, setIsClient] = useState(false);

    useEffect(()=> {
        setIsClient(true)
    },[])

    const scrollToReservation = ()=> {
        if(isClient){
          const sendMail = document.querySelector('.contacts-wrapper');
          if (sendMail){
            sendMail.scrollIntoView({behavior: 'smooth'});
          }
        }
    }
    return (
        <div className="home-wedding-wrapper">
            <div className="home-wedding-white">
                    <FadeIn direction={fromLeft}>
                        <h2>ДИДЖЕИ ЗА ВАШЕТО СЪБИТИЕ</h2>        
                    </FadeIn>
                    <FadeIn direction={fromLeft}>
                        <p>Hampshire Event DJs have provided the soundtrack to hundreds of weddings across the south of england.</p>
                    </FadeIn>
                    <FadeIn direction={fromLeft}>
                        <p>They are comfortable working with you on a playlist and whether you have a clear idea of what you want to hear or just a handful of songs you don’t our team can meet your expectations by delivering a wedding reception your guests will remember for all the right reasons.</p>                
                    </FadeIn>
            </div>
            <div className="home-wedding-gray">
                <FadeIn direction={fromRight}>
                    <Image width={80} height={80} src={quote} quality={100} alt="quote" />   
                </FadeIn>
                <FadeIn direction={fromRight}>
                    <p>Made our wedding party INCREDIBLE!</p>
                </FadeIn>
                <FadeIn direction={fromRight}>
                    <p>Everyone has since been saying how amazing the music was, the dance floor was packed the entire time. Would definitely recommend!</p>   
                </FadeIn>
                <FadeIn direction={fromRight}>
                    <button onClick={scrollToReservation} className="wedding-reserve">РЕЗЕРВИРАЙ</button>
                </FadeIn>
            </div>
        </div>
    )
}

export default HomeWedding;