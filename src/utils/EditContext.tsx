import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ItemToEdit = {
  itemId?: string;
  description?: string;
  itemName?: string;
  modelName?: string;
  rentalCategory?: string;
  itemImage?: string;
  category?: string;
  blogTitle?: string;
  blogAuthor?: string;
  blogText?: string;
  instaLink?: string;
  fbLink?: string;
  galleryName?: string;
  redirectPath: string;
}

type ItemsToEditContextType = {
  itemsToEdit: ItemToEdit[];
  setItemsToEdit: React.Dispatch<React.SetStateAction<ItemToEdit[]>>;
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
  const [itemsToEdit, setItemsToEdit] = useState<ItemToEdit[]>([]);

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
