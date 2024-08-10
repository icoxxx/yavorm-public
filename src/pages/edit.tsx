import React, { useEffect, useRef, useState } from "react";
import { useItemsToEdit } from "../utils/EditContext";
import { useAuth } from "../utils/AuthContext";
import { useDispatch } from "react-redux";
import { getItems, updateItem } from "../store/rentalItems/dataSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Image from "next/image";
import { useRouter } from "next/router";
import FadeIn from "@/components/FadeIn";
import { fromLeft } from "@/utils/animationVariants";
import { updateBlogItem } from "@/store/blogItems/blogSlice";

const RentalForm: React.FC<any> = ({ itemName, setItemName, description, setDescription, modelName, setModelName, rentalCategory, setRentalCategory, fileInputRef, handleFileChange, handleForm, placeholder }) => {
  return (
    <form className="upload-form" id="upload-rental" onSubmit={handleForm}>
      <label htmlFor="itemName">Име и марка на продукта</label>
      <input type="text" id="itemName" name="itemName" value={itemName} placeholder={placeholder.itemName} onChange={(e) => setItemName(e.target.value)} autoComplete="on" />

      <label htmlFor="modelName">Модел</label>
      <input type="text" id="modelName" name="modelName" value={modelName} placeholder={placeholder.modelName} onChange={(e) => setModelName(e.target.value)} autoComplete="off" />

      <label htmlFor="rentalCategory">Категория</label>
      <select name="rentalCategory" id="rentalCategory" value={rentalCategory} onChange={(e) => setRentalCategory(e.target.value)} >
        <option value="DJ миксери">DJ миксери</option>
        <option value="DJ плеъри">DJ плеъри</option>
        <option value="Осветление">Осветление</option>
        <option value="Тонколони">Тонколони</option>
        <option value="Субуфери">Субуфери</option>
        <option value="Микрофони">Микрофони</option>
        <option value="Други">Други</option>
      </select>


      <label htmlFor="description">Описание</label>
      <input type="text" id="description" name="description" value={description} placeholder={placeholder.description} onChange={(e) => setDescription(e.target.value)} autoComplete="on" />

      <label htmlFor="file">Снимка</label>
      <input type="file" id="file" name="file" accept="image/jpeg, image/png" onChange={handleFileChange} ref={fileInputRef} />

      <input type="submit" id="submit" />
    </form>
  );
};

const BlogsForm: React.FC<any> = ({ blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogText, setBlogText, instaLink, setInstaLink, fbLink, setFbLink, blogFileInputRef, handleFileChange, handleForm, placeholder }) => {
  return (
    <form className="upload-form" id="upload-blog" onSubmit={handleForm}>
      <label htmlFor="blogTitle">Заглавие</label>
      <input type="text" id="blogTitle" name="blogTitle" value={blogTitle} placeholder={placeholder.blogTitle} onChange={(e) => setBlogTitle(e.target.value)} autoComplete="on" />

      <label htmlFor="blogAuthor">Автор</label>
      <input type="text" id="blogAuthor" name="blogAuthor" value={blogAuthor} placeholder={placeholder.blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} autoComplete="off" />

      <label htmlFor="blogText">Текст/Съдържание</label>
      <textarea rows={15} id="blogText" name="blogText" value={blogText} placeholder={placeholder.blogText} onChange={(e) => setBlogText(e.target.value)} />

      <label htmlFor="instaLink">Инстаграм пост</label>
      <input type="text" id="instaLink" name="instaLink" value={instaLink} onChange={(e) => setInstaLink(e.target.value)} autoComplete="off" /> 

      <label htmlFor="fbLink">Фейсбук пост</label>
      <input type="text" id="fbLink" name="fbLink" value={fbLink} onChange={(e) => setFbLink(e.target.value)} autoComplete="off" /> 

      <label htmlFor="blogFile">Снимка/обложка</label>
      <input type="file" id="blogFile" name="blogFile" accept="image/jpeg, image/png" onChange={handleFileChange} ref={blogFileInputRef} />

      <input type="submit" id="submit" />
    </form>
  );
};

const GalleryForm: React.FC<any> = ({ galleryName, setGalleryName, galleryFilesInputRef, handleFileChange, handleForm, placeholder }) => {
  return (
    <form className="upload-form" id="upload-gallery" onSubmit={handleForm}>
      <label htmlFor="galleryName">Име на галерия</label>
      <input type="text" id="galleryName" name="galleryName" value={galleryName} placeholder={placeholder.galleryName} onChange={(e) => setGalleryName(e.target.value)} autoComplete="on" />

      <label htmlFor="galleryFiles">Снимки - между 2 и 10 наведнъж</label>
      <input type="file" id="galleryFiles" name="galleryFiles" accept="image/jpeg, image/png" onChange={handleFileChange} ref={galleryFilesInputRef} multiple />

      <input type="submit" id="submit" />
    </form>
  );
};

const EditPage: React.FunctionComponent = () => {
    const { itemsToEdit, setItemsToEdit } = useItemsToEdit();
    const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();
    const item_ID = itemsToEdit[0].itemId;

    const router = useRouter();

    console.log(itemsToEdit)

    const {isAuthenticated, isAdmin} = useAuth();

    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [redirectSeconds, setRedirectSeconds] = useState(3);
    const [blogTitle, setBlogTitle] = useState('');
    const [blogText, setBlogText] = useState('');
    const [blogFile, setBlogFile] = useState<File | null>(null);
    const [galleryName, setGalleryName] = useState('');
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryFilesInputRef = useRef<HTMLInputElement>(null);
    const blogFileInputRef = useRef<HTMLInputElement>(null);
    const [blogAuthor, setBlogAuthor] = useState('');
    const [modelName, setModelName] = useState('');
    const [rentalCategory, setRentalCategory] = useState(itemsToEdit[0].rentalCategory);
    const [instaLink, setInstaLink] = useState('');
    const [fbLink, setFbLink] = useState('');


    const placeholder: {
      description?: string;
      itemName?: string;
      modelName?: string;
      rentalCategory?: string;
      blogTitle?: string;
      blogAuthor?: string;
      blogText?: string;
      galleryName?: string;
      instaLink?: string;
      fbLink?: string;
    } = {};

    if(itemsToEdit){
      if(itemsToEdit[0].category === 'rental'){
        placeholder.description = itemsToEdit[0].description;
        placeholder.itemName = itemsToEdit[0].itemName;
        placeholder.modelName = itemsToEdit[0].modelName;
        placeholder.rentalCategory = itemsToEdit[0].rentalCategory;
      }
      else if(itemsToEdit[0].category === 'blogs'){
        placeholder.blogTitle = itemsToEdit[0].blogTitle;
        placeholder.blogAuthor = itemsToEdit[0].blogAuthor;
        placeholder.blogText = itemsToEdit[0].blogText;
        placeholder.instaLink = itemsToEdit[0].instaLink;
        placeholder.fbLink = itemsToEdit[0].fbLink;
      }
      else if(itemsToEdit[0].category === 'gallery'){
        placeholder.galleryName = itemsToEdit[0].galleryName;
      }
    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        console.log(fileList)
        if (fileList && fileList.length > 0) {
          if(itemsToEdit[0].category === 'rental'){
            setFile(fileList[0]);
          }
          else if(itemsToEdit[0].category === 'blogs'){
            setBlogFile(fileList[0]);
          }
          else if(itemsToEdit[0].category === 'gallery'){
            setGalleryFiles(Array.from(fileList));
          }
        }
      }

      const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) : Promise<void> => {
        e.preventDefault();
        try {
          const formData = new FormData();
          if(itemsToEdit[0].category === 'rental'){
           description ? formData.append('description', description) : null;
           itemName ? formData.append('itemName', itemName) : null;
           modelName ? formData.append('modelName', modelName) : null;
           rentalCategory ? formData.append('rentalCategory', rentalCategory) : null;
           file ? file && formData.append('image', file) : null;
           formData.append('category', itemsToEdit[0].category);
          }
          else if(itemsToEdit[0].category === 'blogs'){
           blogTitle ? formData.append('blogTitle', blogTitle) : null;
           blogAuthor ? formData.append('blogAuthor', blogAuthor) : null;
           blogText ? formData.append('blogText', blogText) : null;
           instaLink ? formData.append('instaLink', instaLink) : null;
           fbLink ? formData.append('fbLink', fbLink) : null;
           blogFile ? blogFile && formData.append('image', blogFile) : null;
           formData.append('category', itemsToEdit[0].category);
          }
          else if(itemsToEdit[0].category === 'gallery'){
           galleryName ? formData.append('galleryName', galleryName) : null;
           galleryFiles.length > 0 ? galleryFiles.forEach((file) => formData.append('images', file)) : null; 
           formData.append('category', itemsToEdit[0].category);
          }
          const response = await fetch(`http://localhost:3000/api/${itemsToEdit[0].category}/${item_ID}`, {
            method: 'PUT',
            body: formData,
          });
          if(!response.ok){
            throw new Error('Failed to submit form')
          }
          const updatedItem = await response.json();

          ////////////
          itemsToEdit[0].category === 'rental' && (dispatch(updateItem(updatedItem)));
          itemsToEdit[0].category === 'blogs' && (dispatch(updateBlogItem(updatedItem)));
          ////////////

          setItemName("");
          setDescription("");
          setModelName('');
          setRentalCategory('');
          setFile(null);

          setBlogTitle('');
          setBlogAuthor('');
          setBlogText('');
          setFbLink('');
          setInstaLink('');
          setBlogFile(null);

          setGalleryName('');
          setGalleryFiles([]);


          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
          }

          if(blogFileInputRef.current){
            blogFileInputRef.current.value = '';
          }

          if(galleryFilesInputRef.current){
            galleryFilesInputRef.current.value = '';
          }
    
          console.log('Edit Form submitted! Files changed! Yay!')
        } catch (err: any) {
          console.error(`Error: ${err.message}`)
        }
        finally{
          //dispatch(getItems());
          router.push(itemsToEdit[0].redirectPath); // Navigate back to corresponded page
        }
    
      }

      useEffect(() => {
        const interval = setInterval(() => {
          setRedirectSeconds((prevSeconds) => {
            if (prevSeconds <= 1) {
              clearInterval(interval);
              if (!isAuthenticated && !isAdmin) {
                router.push('/')
              }
              return 0;
            }
            return prevSeconds - 1;
          });
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);

    return (
        <section id="edit-form-wrapper">
          {itemsToEdit.length > 0 && (isAuthenticated && isAdmin) ? (
            <React.Fragment>
              {itemsToEdit[0].category === 'rental' &&
              <FadeIn direction={fromLeft}>
                <RentalForm
                itemName={itemName}
                setItemName={setItemName}
                description={description}
                setDescription={setDescription}
                modelName={modelName}
                setModelName={setModelName}
                rentalCategory={rentalCategory}
                setRentalCategory={setRentalCategory}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleForm={handleEditForm}
                placeholder={placeholder}
              />
              </FadeIn>
              }
              {itemsToEdit[0].category === 'blogs' && 
              <FadeIn direction={fromLeft}>
                <BlogsForm
                  blogTitle={blogTitle}
                  setBlogTitle={setBlogTitle}
                  blogAuthor={blogAuthor}
                  setBlogAuthor={setBlogAuthor}
                  blogText={blogText}
                  setBlogText={setBlogText}
                  instaLink={instaLink}
                  setInstaLink={setInstaLink}
                  fbLink={fbLink}
                  setFbLink={setFbLink}
                  blogFileInputRef={blogFileInputRef}
                  handleFileChange={handleFileChange}
                  handleForm={handleEditForm}
                  placeholder={placeholder}
                />
              </FadeIn>
              }
              {itemsToEdit[0].category === 'gallery' && 
              <FadeIn direction={fromLeft}>
                <GalleryForm
                  galleryName={galleryName}
                  setGalleryName={setGalleryName}
                  galleryFilesInputRef={galleryFilesInputRef}
                  handleFileChange={handleFileChange}
                  handleForm={handleEditForm}
                  placeholder={placeholder}
                />
              </FadeIn>
              }
            </React.Fragment>
                    )
                    :
                    <div className="admin-redirection">
                      <h2>You need to login first!</h2>
                      <div>{`Redirecting to Home Page in ${redirectSeconds}`}</div>
                    </div>
          }
        </section>
    )
}

export default EditPage;