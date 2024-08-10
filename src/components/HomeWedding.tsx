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
                        <h2>ДИДЖЕЙ ЗА ВАШЕТО СЪБИТИЕ</h2>        
                    </FadeIn>
                    <FadeIn direction={fromLeft}>
                        <p>Диджей екипът на YavorM има зад гърба си стотици събития (клубни, частни, рожденни дни и сватби) из цялата страна, а и не само.</p>
                    </FadeIn>
                    <FadeIn direction={fromLeft}>
                        <p>Ние се чувстваме комфортно да работим заедно с клиента по подходящия плейлист за вашето събитие или пък да оставите музиката изцяло в наши ръце - за нас няма значение, ще се справим еднакво добре. Нашият екип ще покрие всички ваши изисквания и очаквания.</p>                
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
                    <p>- Emily Atanasov</p>
                </FadeIn>
                <FadeIn direction={fromRight}>
                    <button onClick={scrollToReservation} className="wedding-reserve">BOOK NOW</button>
                </FadeIn>
            </div>
        </div>
    )
}

export default HomeWedding;