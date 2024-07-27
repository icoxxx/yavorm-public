import React, { useEffect, useRef, useState } from "react";
import cdj3000 from '../assets/images/CDJ-3000.png';
import {motion} from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import FadeIn from "./FadeIn";
import { fromLeft, fromTop } from "@/utils/animationVariants";
import Image, { StaticImageData } from "next/image";
import wedding from '../assets/images/wedding.jpeg';
import sound$lights from '../assets/images/sound-lights.jpg';
import djEvent from '../assets/images/dj-event.jpg';
import console from '../assets/images/console.jpg';

type Service = {
    index: number;
    name: string;
    description: string;
    tags: {
      name: string;
      color: string;
    }[];
    image: StaticImageData;
    source_code_link: string;
  };

const ServiceCard: React.FC<Service & { delay: number }> = ({index, name, description, tags, image, source_code_link, delay})=> {

    return(
    <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
    >
        <FadeIn direction={fromLeft} delay={delay} className="home-tilt-card-container" thresh={0.5}>
                <div className='tilt-content'>
                    <Image src={image} alt={name} quality={100} />
                </div>
        
                <div className="home-tilt-text">
                    <h3>{name}</h3>
                    <p>{description}</p>
                </div>
                <div className='home-tilt-tags'>
                    {tags.map((tag, index)=>{
                    return(
                        <p key={`${tag.name}-${index}`}>
                        #{tag.name}
                        </p>
                    )
                    })}
                </div>
        </FadeIn>
    </Tilt>
    )
  }

const Services: React.FC = ()=> {
    const [cardPositions, setCardPositions] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);    
    const services = [
        {
          name: "DJ техника под наем",
          description:
            "Поддържаме богато портфолио на най-търсените модели DJ техника. Може да получите повече информация в съответния раздел или като се свържете с нас. ",
          tags: [
            {
              name: "DJ",
              color: "blue",
            },
            {
              name: "техника",
              color: "green",
            },
            {
              name: "наем",
              color: "pink",
            },
          ],
          image: cdj3000,
          source_code_link: "https://github.com/icoxxx/gerena2",
        },
        {
            name: "Организиране на сватбени тържества",
            description:
              "Ние от YavorM имаме дългогодишен опит в организирането, озвучаването и осветлението на сватбени тържества. Доверете се на нас за мечтаната от вас сватба.",
            tags: [
              {
                name: "сватба",
                color: "blue",
              },
              {
                name: "DJ",
                color: "green",
              },
              {
                name: "организиране",
                color: "pink",
              },
            ],
            image: wedding,
            source_code_link: "https://github.com/icoxxx/gerena2",
          },
        {
          name: "Озвучителна и осветителна техника под наем",
          description:
            "Предлагаме не само DJ техника, но и цялостна такава, необходима за провеждането на събития от различен тип и се стараем се да осигурим необходимото оборудване според нуждите на клиента в най-кратки срокове.",
          tags: [
            {
              name: "озвучаване",
              color: "blue",
            },
            {
              name: "осветление",
              color: "green",
            },
            {
              name: "наем",
              color: "pink",
            },
          ],
          image: sound$lights,
          source_code_link: "https://github.com/icoxxx/portfolio-app",
        },
        {
            name: "Организиране на частни събития",
            description:
              "Опитът ни досега показва, че няма събитие, което да не можем да подсигурим с нужната техника и екип (диджеи / осветители). За повече подробноси - свържете се с нас.",
            tags: [
              {
                name: "частни",
                color: "blue",
              },
              {
                name: "събития",
                color: "green",
              },
              {
                name: "DJ",
                color: "pink",
              },
            ],
            image: djEvent,
            source_code_link: "https://github.com/icoxxx/portfolio-app",
          },
        {
            name: "Инсталация на звук и осветление",
            description:
              "За повече информация относно услугата, моля, свържете се с нас.",
            tags: [
              {
                name: "инсталация",
                color: "blue",
              },
              {
                name: "звук",
                color: "green",
              },
              {
                name: "осветление",
                color: "pink",
              },
            ],
            image: console,
            source_code_link: "https://github.com/icoxxx/portfolio-app",
          },
      ];

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.home-tilt-card-container');
      const positions = Array.from(cards).map(card => card.getBoundingClientRect().top);

      setCardPositions(positions);
    }
  }, []);

  const calculateDelays = (): number[] => {
    const delays: number[] = [];
    let currentDelay = 0;
    let previousTop = cardPositions[0];

    cardPositions.forEach((pos, index) => {
      if (pos !== previousTop) {
        currentDelay = 0;  // Reset delay if it's a new line
        previousTop = pos;
      }
      delays.push(currentDelay);
      currentDelay += 0.5;  // Increment delay for the next card in the same line
    });

    return delays;
  }

  const delays = calculateDelays();

    return(
        <>
        <FadeIn direction={fromTop} className="">
            <p className='service-title'>
            Услуги
            </p>
            <h2 className='service-title'>
            YavorM
            </h2>
        </FadeIn>
        <div className='services-wrapper' ref={containerRef}>
            {services.map((service, index)=> {
            return(
                    <ServiceCard key={`project-${index}`} index={index} {...service} delay={delays[index]}/>
            )
            })}
       </div>
        </>
    )
}

export default Services;