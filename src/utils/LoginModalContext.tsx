import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IsLoginOpenedContextType {
    isLoginOpened: boolean | null;
    setIsLoginOpened: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface IsLoginOpenedProviderProps {
    children: ReactNode;
}

const IsLoginOpenedContext = createContext<IsLoginOpenedContextType | undefined>(undefined);

export const IsLoginOpenedProvider: React.FC<IsLoginOpenedProviderProps> = ({ children }) => {
    const [isLoginOpened, setIsLoginOpened] = useState<boolean | null>(false);

    return (
        <IsLoginOpenedContext.Provider value={{ isLoginOpened, setIsLoginOpened }}>
            {children}
        </IsLoginOpenedContext.Provider>
    );
};

export const useIsLoginOpened = () => {
    const context = useContext(IsLoginOpenedContext);
    if (!context) {
        throw new Error('useIsLoginClicked must be used within an provider');
    }
    return context;
};