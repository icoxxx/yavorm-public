import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
    isAdmin: boolean | null;
    login: (token: string, isAdmin: boolean) => void;
}

type TokenData = {
    token: string;
    isAdmin: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

let tokenString:any;
if(typeof window !== 'undefined'){
    tokenString = localStorage.getItem('token');
}
let tokenData: TokenData | null = null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && tokenString) {
            try {
                tokenData = JSON.parse(tokenString);
                if(tokenData){
                    setIsAuthenticated(true);
                    setIsAdmin(tokenData.isAdmin)
                }
            } catch (error: any) {
                console.log(error)
            }
        }
    }, []);

    const login = (token: string, isAdmin: boolean) => {
        if (typeof window !== 'undefined'){
            localStorage.setItem('token', JSON.stringify({ token, isAdmin }));
            setIsAuthenticated(true);
            setIsAdmin(isAdmin);
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined'){
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setIsAdmin(false);
            //window.location.reload();
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout, isAdmin, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
