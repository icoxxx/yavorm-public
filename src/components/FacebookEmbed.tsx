import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface SocialMediaEmbedProps {
  url: string;
  width?: number;
  className?: string;
}

const FacebookEmbedComponent: React.FC<SocialMediaEmbedProps> = ({ url, width = 550, className = 'fb-post' }) => {

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center'}} data-href={url} data-colorscheme="dark" data-width={width}></div>
  );
};

export default FacebookEmbedComponent;
