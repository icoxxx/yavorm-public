import React, { useEffect, useRef } from 'react';

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url }) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadInstagramEmbed = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };
  
    // Create and append the Instagram embed script if not already loaded
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = loadInstagramEmbed;
      script.onerror = () => {
        console.error('Error loading Instagram embed script.');
      };
      document.body.appendChild(script);
      scriptRef.current = script;
    } else {
      loadInstagramEmbed();
    }
  
    // Cleanup the script on component unmount
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [url]);

  return (
        <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
      >
      </blockquote>
  );
};

export default InstagramEmbed;
