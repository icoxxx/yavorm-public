import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction: {
    visible: {opacity: number, transform: string},
    hidden: {opacity: number, transform: string}
  };
  className?: string;
  thresh?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, direction, className = '', thresh = 0.5}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,  // Only trigger once
    threshold: thresh,     // Trigger when 10% of the element is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5, delay }}
      variants={direction} // direction - imported from animationVariants.ts from the component
      style={{ willChange: 'transform' }}  // Enable hardware acceleration
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;