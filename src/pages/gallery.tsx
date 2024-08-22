import { GalleryItem, removeGalleryItem, setGalleryItems } from "@/store/galleryItems/gallerySlice";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import close from '../assets/images/delete-button.png';
import FadeIn from "@/components/FadeIn";
import { fromLeft80, fromRight80 } from "@/utils/animationVariants";
import GalleryImage from "@/components/GalleryImage";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useItemsToEdit } from "@/utils/EditContext";
import GalleryCarousel from "@/components/GalleryCarousel";
import DeleteModal from "@/components/DeleteModal";

type GalleryPageProps = {
    title: string;
    description: string;
    imageUrl: string;
    galleryItems: GalleryItem[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({title, description, imageUrl, galleryItems}) => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [openedImage, setOpenedImage] = useState('');
    const [isClient, setIsClient] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const { itemsToEdit, setItemsToEdit } = useItemsToEdit();

    useEffect(()=> {
        setIsClient(true)
    },[])

    useEffect(() => {
      dispatch(setGalleryItems(galleryItems));
    }, [dispatch, galleryItems]);

    const storedGalleryItems = useSelector((state: RootState) => state.gallery.items);
    
    useEffect(() => {
      if (isClient) {
          const body = document.body;
  
          if (isModalOpened) {
              const scrollY = window.scrollY;
              body.style.position = 'fixed';
              body.style.top = `-${scrollY}px`;
              body.style.width = '100%';
          } else {
              const scrollY = parseInt(body.style.top || '0') * -1;
              body.style.position = '';
              body.style.top = '';
              window.scrollTo(0, scrollY);
          }
      }
  }, [isModalOpened]);

    const editItem = async (itemId? : string, galleryName?: string, images?: string[], category?: string, redirectPath?: string) => {
        const newItemToEdit: any = {
          itemId: itemId,
          galleryName: galleryName,
          images: images,
          category: category,
          redirectPath: redirectPath,
        };
        setItemsToEdit(() => [newItemToEdit]);
      }

      const handleDelete = async ()=> {
        try {
           const response = await fetch(`http://localhost:3000/api/gallery/${deleteId}`, {
             method: 'DELETE',
             headers: {
               'Content-Type': 'application/json',
             }
           });
           if (response.ok) {
            dispatch(removeGalleryItem(deleteId));
            setDeleteConfirm(false); // Close the confirmation modal
           }
           else if(!response.ok){
             throw new Error('Failed to delete item');
           }
         } catch (error:any) {
           console.log(`Error: ${error}`)
         } 
       }

    return (
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
        <main className="gallery-page-wrapper">
          <div className="gallery-hoc">
            <div className="lines">
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
                          <div className="line"></div>
            </div>
            {storedGalleryItems && storedGalleryItems.length > 0 && (
              storedGalleryItems.map((gallery, index)=> {
                  return(
                      <GalleryCarousel
                          key={`gallery-section-${index}`}
                          galleryItem={gallery}
                          index={index}
                          setDeleteConfirm={setDeleteConfirm}
                          setDeleteId={setDeleteId}
                          editItem={editItem}
                          setIsModalOpened={setIsModalOpened}
                          setOpenedImage={setOpenedImage}
                      />
                  )
              })
              )}
              <div className={`modal ${isModalOpened ? 'is-open' : ''}`}>
                  <div className="opened-image-container">
                      {isModalOpened && (<div className="close-image" onClick={()=> setIsModalOpened(false)} ><Image src={close} width={50} height={50} alt="close" /></div>)}
                      {openedImage && isModalOpened && (
                          <Image className="opened-image" quality={100} fill src={`/uploads/gallery/${openedImage}`} alt={`gallery-image`} />
                      )}
                  </div>
              </div>
          </div>
        </main>
        {deleteConfirm && (
           <DeleteModal setDeleteConfirm={setDeleteConfirm} handleDelete={handleDelete} />
          )}  
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/gallery',{
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
          title: 'YavorM - Галерия',
          description: 'YavorM събития - галерия',
          imageUrl: '/dj-booth.jpg',
          galleryItems: data.items || [], 
        }
      };
    } catch (error:any) {
      console.log('Error:', error)
      return {
        props: {
          title: 'YavorM - Галерия',
          description: 'YavorM събития - галерия',
          imageUrl: '/dj-booth.jpg',
          galleryItems: [],
        }
      }
    }
  
  };

export default GalleryPage;