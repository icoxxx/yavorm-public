import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import { removeItem, RentalItem, setItems } from "@/store/rentalItems/dataSlice";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useAuth } from "@/utils/AuthContext";
import logo from '../assets/images/Yavor-M-logo-color.svg';
import FadeIn from "@/components/FadeIn";
import { fromLeft80 } from "@/utils/animationVariants";
import Head from "next/head";
import editButton from '../assets/images/edit-button.png';
import deleteButton from '../assets/images/delete-button.png';
import { useItemsToEdit } from "@/utils/EditContext";
import Link from "next/link";
import { useCategory } from "@/utils/RentalCategoryContext";
import DeleteModal from "@/components/DeleteModal";

type RentalProps = {
    title: string;
    description: string;
    imageUrl: string;
    rentalItems: RentalItem[];
}

const Rental: React.FC<RentalProps> = ({title, description, imageUrl, rentalItems})=> {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setItems(rentalItems));
  }, [dispatch, rentalItems]);

  const items = useSelector((state: RootState) => state.data.items);
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const {categoryToLoad, setCategoryToLoad} = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryToLoad ? categoryToLoad : 'Всички продукти');
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const [filteredItems, setFilteredItems] = useState<RentalItem[]>(categoryToLoad ? items.filter(item => item.rentalCategory === categoryToLoad) : items);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { itemsToEdit, setItemsToEdit } = useItemsToEdit();

  useEffect(()=> {
    return ()=> {
      setCategoryToLoad('');
    }
  },[])


  const editItem = async (itemId? : string, description?: string, itemName?: string, modelName?: string, rentalCategory?: string, itemImage? : string, category?: string, redirectPath?: string) => {
    const newItemToEdit: any = {
      itemId: itemId,
      description: description,
      itemName: itemName,
      modelName: modelName,
      rentalCategory: rentalCategory,
      itemImage: itemImage,
      category: category,
      redirectPath: redirectPath,
    };
    setItemsToEdit(() => [newItemToEdit]);
  }

  const handleDelete = async ()=> {
   try {
      console.log(deleteId)
      const response = await fetch(`http://localhost:3000/api/rental/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
       dispatch(removeItem(deleteId));
       setFilteredItems(filteredItems.filter(item => item._id !== deleteId));
       setDeleteConfirm(false); // Close the confirmation modal
      }
      else if(!response.ok){
        throw new Error('Failed to delete item');
      }
    } catch (error:any) {
      console.log(`Error: ${error}`)
    } 
  }


  useEffect(()=>{
    if(selectedCategory !== 'Всички продукти'){
      const filtered = rentalItems.filter(item => item.rentalCategory === selectedCategory);
      setFilteredItems(filtered);
    }
    else{
      setFilteredItems(rentalItems);
    }
  },[selectedCategory])

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsActive(false);
  };


    return(
    <>
      <Head>  
        <title>{title}</title>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <link rel="icon" href={imageUrl} type="image/jpeg"/>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageUrl} />
      </Head>
      <div className="rental-page-wrapper">
        <div className="container">
            <span className="choose">Филтър</span>
            <div className={`dropdown ${isActive ? 'active' : ''}`} tabIndex={1} onBlur={handleBlur}>
                <div className="select" onClick={toggleDropdown}>
                  <span>{selectedCategory || 'Избери Категория'}</span>
                </div>
                <input type="hidden" name="gender" value={selectedCategory || ''} />
                <ul className="dropdown-menu" ref={dropdownMenuRef}>
                <li onClick={() => selectCategory('Всички продукти')}>Всички продукти</li>
                  <li onClick={() => selectCategory('DJ плеъри')}>DJ плеъри</li>
                  <li onClick={() => selectCategory('DJ миксери')}>DJ миксери</li>
                  <li onClick={() => selectCategory('Осветление')}>Осветление</li>
                  <li onClick={() => selectCategory('Тонколони')}>Тонколони</li>
                  <li onClick={() => selectCategory('Субуфери')}>Субуфери</li>
                  <li onClick={() => selectCategory('DJ контролери')}>DJ Контролери</li>
                  <li onClick={() => selectCategory('Микрофони')}>Микрофони</li>
                  <li onClick={() => selectCategory('Други')}>Други</li>
                </ul>
            </div>
        </div>
        <FadeIn key={selectedCategory} direction={fromLeft80} thresh={0} className="rental-container">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item, index)=> {
                return(
                <div key={`rental-${index}`} className="rental-item-wrapper">
                  {isAuthenticated && isAdmin && (
                    <div className="admin-buttons">
                      <Link href='/edit'>
                        <Image src={editButton}
                         quality={100} 
                         alt="edit-button"
                         onClick={() => editItem(item._id, item.description, item.itemName, item.modelName, item.rentalCategory, item.image, item.category, '/rental')}
                         />
                      </Link>
                      <Image 
                      src={deleteButton} 
                      quality={100} 
                      alt="delete-button"
                      onClick={() => {
                        setDeleteConfirm(true);
                        setDeleteId(item._id);
                        }}
                      />
                    </div>
                  )}
                  <div className="logo-background">
                    <div className="rental-logo-wrapper">
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                    </div>
                    <div className="rental-logo-wrapper">
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                    </div>
                    <div className="rental-logo-wrapper">
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                      <Image alt="logo" quality={100} src={logo}/>
                    </div>
                  </div>
                  <div className="rental-item-img-wrapper">
                    {item.image && (<Image width={200} height={200} quality={100} alt={`${item.itemName}-${item.modelName}`} src={`/uploads/rental/${item.image}`}/>)}
                  </div>
                  <div className="rental-item-text-wrapper">
                    <div>                  
                      <h2>{item.itemName}</h2>
                      <h3>{item.modelName}</h3>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </div>
                )
              })
            )
            :
            filteredItems.length < 1 && (
              <div>В момента нямаме продукти от избраната категория!</div>
            )
            }
        </FadeIn>
      </div>
      {deleteConfirm && (
           <DeleteModal setDeleteConfirm={setDeleteConfirm} handleDelete={handleDelete} />
          )}    
    </>
    )
};

export default Rental;


export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rental',{
        method: 'GET',
        cache: 'no-cache',
      });
      if(!response.ok){
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      console.log(data.items)
      return {
        props: {
          title: 'YavorM - рентал на техника',
          description: 'YavorM озвучителна и осветителна техника под наем',
          imageUrl: '/dj-booth.jpg',
          rentalItems: data.items || [], 
        }
      };
    } catch (error:any) {
      console.log('Error:', error)
      return {
        props: {
          title: 'YavorM - рентал на техника',
          description: 'YavorM озвучителна и осветителна техника под наем',
          imageUrl: '/dj-booth.jpg',
          rentalItems: [],
        }
      }
    }
  
  };