import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const useScrollToContacts = () => {
  const router = useRouter();

  const scrollToElement = () => {
    const sendMail = document.querySelector('.contacts-wrapper');
    if (sendMail) {
      sendMail.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRouteChangeComplete = () => {

    const observer = new MutationObserver(() => {

    const sendMail = document.querySelector('.contacts-wrapper');
    if (sendMail) {
      sendMail.scrollIntoView({ behavior: 'smooth' });
      observer.disconnect(); 
      return;
    }
  });
  
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
  }

  const scrollToContacts = useCallback(() => {
      const currentPath = window.location.pathname;

      if (currentPath === '/') {
        scrollToElement();
      } else {
        handleRouteChangeComplete();
        router.push('/');
      }
  }, [router]);

  return scrollToContacts;
};

export default useScrollToContacts;
