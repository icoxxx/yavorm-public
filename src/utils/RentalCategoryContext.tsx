import React, { createContext, useContext, useState, ReactNode } from 'react';


interface CategoryContextType {
  categoryToLoad: string;
  setCategoryToLoad: (category: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);


export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categoryToLoad, setCategoryToLoad] = useState<string>('');

  return (
    <CategoryContext.Provider value={{ categoryToLoad, setCategoryToLoad }}>
      {children}
    </CategoryContext.Provider>
  );
};
