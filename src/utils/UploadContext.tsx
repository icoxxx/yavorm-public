import React, { useState, useEffect, useContext } from 'react';


type UploadContextType = {
  uploadMessage: string;
  setUploadMessage: React.Dispatch<React.SetStateAction<string>>;
  cancelUpload: () => void;
};

const UploadContext = React.createContext<UploadContextType>({
  uploadMessage: '',
  setUploadMessage: () => {},
  cancelUpload: () => {},
});

export const useUploadContext = () => useContext(UploadContext);

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [controller, setController] = useState<AbortController | null>(null);

  const cancelUpload = () => {
    if (controller) {
      controller.abort();
      setUploadMessage('Upload canceled.');
    }
  };

  useEffect(() => {
    setController(new AbortController());
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  return (
    <UploadContext.Provider value={{ uploadMessage, setUploadMessage, cancelUpload }}>
      {children}
    </UploadContext.Provider>
  );
};
