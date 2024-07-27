import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ItemsToEditContextType = {
  itemsToEdit: string[];
  setItemsToEdit: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ItemsToEditContext = createContext<ItemsToEditContextType>({
  itemsToEdit: [],
  setItemsToEdit: () => {},
});

type ItemsToEditProviderProps = {
  children: ReactNode;
};

export const useItemsToEdit = () => useContext(ItemsToEditContext);

export const ItemsToEditProvider: React.FC<ItemsToEditProviderProps> = ({ children }) => {
  const [itemsToEdit, setItemsToEdit] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('itemsToEdit');
      if (savedItems) {
        setItemsToEdit(JSON.parse(savedItems));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (itemsToEdit.length > 0) {
        localStorage.setItem('itemsToEdit', JSON.stringify(itemsToEdit));
      } else {
        localStorage.removeItem('itemsToEdit');
      }
    }
  }, [itemsToEdit]);

  return (
    <ItemsToEditContext.Provider value={{ itemsToEdit, setItemsToEdit }}>
      {children}
    </ItemsToEditContext.Provider>
  );
};
