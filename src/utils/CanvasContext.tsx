import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IsCanvasContextType {
    isCanvas: boolean | undefined;
    setIsCanvas: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

interface IsCanvasProviderProps {
    children: ReactNode;
}

const IsCanvasContext = createContext<IsCanvasContextType | undefined>(undefined);

export const IsCanvasProvider: React.FC<IsCanvasProviderProps> = ({ children }) => {
    const [isCanvas, setIsCanvas] = useState<boolean | undefined>(false);

    return (
        <IsCanvasContext.Provider value={{ isCanvas, setIsCanvas }}>
            {children}
        </IsCanvasContext.Provider>
    );
};

export const useIsCanvas = () => {
    const context = useContext(IsCanvasContext);
    if (!context) {
        throw new Error('useIsCanvas must be used within an IsCanvasProvider');
    }
    return context;
};

