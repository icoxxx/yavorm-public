import React, { useEffect, useRef } from 'react';

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url }) => {

  return (
        <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
      >
      </blockquote>
  );
};

export default InstagramEmbed;
