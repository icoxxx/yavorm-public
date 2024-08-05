import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import { RentalItem, setItems } from "@/store/rentalItems/dataSlice";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Всички продукти');
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const [filteredItems, setFilteredItems] = useState<RentalItem[]>(rentalItems);

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
                      <Image src={editButton} quality={100} alt="edit-button" />
                      <Image src={deleteButton} quality={100} alt="delete-button"/>
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
    </>
    )
};

export default Rental;


export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rental');
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