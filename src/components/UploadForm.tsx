import React, { useState, FormEvent, useRef, useEffect} from "react";
import { useUploadContext } from "../utils/UploadContext";
import { useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addItem, getItems } from "../store/rentalItems/dataSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import cdj3000 from '../assets/images/CDJ-3000.png';
import djEvent from '../assets/images/dj-event-pic.jpg';
import blog from '../assets/images/blogpost.png';
import Image from "next/image";
import FadeIn from "./FadeIn";
import { fromLeft } from "@/utils/animationVariants";
import { RentalItemType, BlogItemType, GalleryItemType } from "@/types/typesExport";
import { addBlogItem } from "@/store/blogItems/blogSlice";

const RentalForm: React.FC<any> = ({ itemName, setItemName, description, setDescription, modelName, setModelName, rentalCategory, setRentalCategory, fileInputRef, handleFileChange, handleForm }) => {
  return (
    <form className="upload-form" id="upload-rental" onSubmit={handleForm}>
      <label htmlFor="itemName">Име/марка на продукта</label>
      <input type="text" id="itemName" name="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} autoComplete="off" />

      <label htmlFor="modelName">Модел</label>
      <input type="text" id="modelName" name="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)} autoComplete="off" />

      <label htmlFor="rentalCategory">Категория</label>
      <select name="rentalCategory" id="rentalCategory" value={rentalCategory} onChange={(e) => setRentalCategory(e.target.value)} >
        <option value="DJ миксери">DJ миксери</option>
        <option value="DJ плеъри">DJ плеъри</option>
        <option value="Осветление">Осветление</option>
        <option value="Тонколони">Тонколони</option>
        <option value="DJ контролери">DJ контролери</option>
        <option value="Субуфери">Субуфери</option>
        <option value="Микрофони">Микрофони</option>
        <option value="Други">Други</option>
      </select>

      <label htmlFor="description">Описание</label>
      <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} autoComplete="off" />

      <label htmlFor="file">Снимка</label>
      <input type="file" id="file" name="file" accept="image/jpeg, image/png" onChange={handleFileChange} ref={fileInputRef} />

      <input type="submit" id="submit" value="Добави" />
    </form>
  );
};

const BlogsForm: React.FC<any> = ({ blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogText, setBlogText, instaLink, setInstaLink, fbLink, setFbLink, blogFileInputRef, handleFileChange, handleForm }) => {
  return (
    <form className="upload-form" id="upload-blog" onSubmit={handleForm}>
      <label htmlFor="blogTitle">Заглавие</label>
      <input type="text" id="blogTitle" name="blogTitle" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} autoComplete="off" />

      <label htmlFor="blogAuthor">Автор</label>
      <input type="text" id="blogAuthor" name="blogAuthor" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} autoComplete="off" />

      <label htmlFor="blogText">Текст/Съдържание</label>
      <textarea rows={15} id="blogText" name="blogText" value={blogText} onChange={(e) => setBlogText(e.target.value)} />

      <label htmlFor="instaLink">Инстаграм пост</label>
      <input type="text" id="instaLink" name="instaLink" value={instaLink} onChange={(e) => setInstaLink(e.target.value)} autoComplete="off" /> 

      <label htmlFor="fbLink">Фейсбук пост</label>
      <input type="text" id="fbLink" name="fbLink" value={fbLink} onChange={(e) => setFbLink(e.target.value)} autoComplete="off" /> 

      <label htmlFor="blogFile">Снимка/обложка</label>
      <input type="file" id="blogFile" name="blogFile" accept="image/jpeg, image/png" onChange={handleFileChange} ref={blogFileInputRef} />

      <input type="submit" id="submit" value="Добави" />
    </form>
  );
};

const GalleryForm: React.FC<any> = ({ galleryName, setGalleryName, galleryFilesInputRef, handleFileChange, handleForm }) => {
  return (
    <form className="upload-form" id="upload-gallery" onSubmit={handleForm}>
      <label htmlFor="galleryName">Име на галерия</label>
      <input type="text" id="galleryName" name="galleryName" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} autoComplete="off" />

      <label htmlFor="galleryFiles">Снимки - между 2 и 10 наведнъж</label>
      <input type="file" id="galleryFiles" name="galleryFiles" accept="image/jpeg, image/png" onChange={handleFileChange} ref={galleryFilesInputRef} multiple />

      <input type="submit" id="submit" value="Добави"/>
    </form>
  );
};


const UploadForm: React.FC = ()=> {
      const [itemName, setItemName] = useState("");
      const [description, setDescription] = useState("");
      const [category, setCategory] = useState('');
      const [file, setFile] = useState<File | null>(null); // Change to File | null to handle file uploads
      const [isUploading, setIsUploading] = useState(false);
      const {uploadMessage, setUploadMessage, cancelUpload } = useUploadContext();
      const fileInputRef = useRef<HTMLInputElement>(null);
      const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();
      const [activeCategory, setActiveCategory] = useState('');
      const [blogTitle, setBlogTitle] = useState('');
      const [blogText, setBlogText] = useState('');
      const [galleryName, setGalleryName] = useState('');
      const galleryFilesInputRef = useRef<HTMLInputElement>(null);
      const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
      const blogFileInputRef = useRef<HTMLInputElement>(null);
      const [blogFile, setBlogFile] = useState<File | null>(null);
      // if displaying the uploaded item after upload completion:
      // const [uploadedItem, setUploadedItem] = useState<any>(null);
      const [blogAuthor, setBlogAuthor] = useState('');
      const [modelName, setModelName] = useState('');
      const [rentalCategory, setRentalCategory] = useState('DJ миксери');
      const [instaLink, setInstaLink] = useState('');
      const [fbLink, setFbLink] = useState('');

    useEffect(()=>{
      setUploadMessage('')
    },[]);

    const handleForm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (
          (activeCategory === 'rental' && !file)
          ||
          (activeCategory === 'blogs' && !blogFile)
          ||
          (activeCategory === 'gallery' && !galleryFiles)
        ) {
          console.error('No file selected');
          return;
        }
        const controller = new AbortController();
    
        const formData = new FormData();
        if(category === 'rental'){
          formData.append('description', description);
          formData.append('itemName', itemName);
          formData.append('modelName', modelName);
          formData.append('rentalCategory', rentalCategory);
          file && formData.append('image', file);
          formData.append('category', category);
        }
        else if(category === 'blogs'){
          formData.append('blogTitle', blogTitle);
          formData.append('blogText', blogText);
          formData.append('blogAuthor', blogAuthor);
          formData.append('instaLink', instaLink);
          formData.append('fbLink', fbLink);
          blogFile && formData.append('image', blogFile);
          formData.append('category', category);
        }
        else if(category === 'gallery'){
          if(galleryFiles.length < 2 || galleryFiles.length > 10){
            setUploadMessage('Мооля, изберете между 2 и 10 снимки!');
            console.error('Моля изберете между 2 и 10 снимки!');
            return
          }
          if(!galleryName){
            setUploadMessage('Не сте добавили име на галерията');
            console.error('No Gallery NAME');
            return
          }
          formData.append('galleryName', galleryName);
          galleryFiles && galleryFiles.forEach((file) => formData.append('images', file)); 
          formData.append('category', category);
        }
        else{
          console.error('No cattegory selected');
          return;
        }

        console.log(formData)
        setIsUploading(true)
    
        setUploadMessage('Wait for a moment. Data is Uploading.....');
    
        try {
          const response = await fetch(`http://localhost:3000/api/${category}`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
    
          if (!response.ok) {
            throw new Error('Failed to upload data');
          }

          const newItem = await response.json();

          console.log(newItem.item)

          // not displaying the uploaded item for now 
          // setUploadedItem(newItem.item);

          /////////////////////
          category === 'rental' && (dispatch(addItem(newItem.item)));
          category === 'blogs' && (dispatch(addBlogItem(newItem.item)));
          ////////////////////

          setItemName("");
          setDescription("");
          setModelName('');
          setRentalCategory('DJ миксери');
          setFile(null);

          setBlogTitle('');
          setBlogText('');
          setBlogAuthor('');
          setBlogFile(null);
          setInstaLink('');
          setFbLink('');

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
    
          setUploadMessage(`Успешно добавихте продукт в раздел ${activeCategory}`);
          console.log('Form submitted! Yay!');
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setUploadMessage('Upload canceled.');
          } else {
            setUploadMessage(`Error: ${err.message}`);
            console.error(`Error: ${err.message}`);
          }
        }
        finally{
          //dispatch(getItems())
          setIsUploading(false);
        }
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        console.log(fileList)
        if (fileList && fileList.length > 0) {
          if(category === 'rental'){
            setFile(fileList[0]);
          }
          else if(category === 'blogs'){
            setBlogFile(fileList[0]);
          }
          else if(category === 'gallery'){
            setGalleryFiles(Array.from(fileList));
          }
        }
      }

      const categories = [
        {
        category: 'РЕНТАЛ',
        image: cdj3000,
      },
      {
        category: 'БЛОГОВЕ',
        image: blog,
      },
      {
        category: 'ГАЛЕРИЯ',
        image: djEvent,
      },
    ]

    useEffect(()=> {
      if(rentalCategory){
        console.log(rentalCategory)
      }
    },[rentalCategory])


    return (
    <>
    <section className="selet-upload-category-wrapper">
      <div>Моля, изберете категория</div>
      {
        categories.map((el, index)=> (
          <div
            key={`${el.category}-${index}`} 
            onClick={()=> {
              setActiveCategory(el.category)
              if(el.category === 'РЕНТАЛ'){
                setCategory('rental');
              }
              else if(el.category === 'БЛОГОВЕ'){
                setCategory('blogs');
              }
              else if(el.category === 'ГАЛЕРИЯ'){
                setCategory('gallery');
              }
            }
          } 
            className={activeCategory === el.category ? `upload-category active-category` : 'upload-category'} 
          >
            <div className="upload-category-text">
              <span>{el.category}</span>
            </div>
            <Image src={el.image} quality={100} alt={el.category} />
          </div>
        ))
      }
    </section>

    {category && (
        <section id="upload-form-wrapper">
          {category === 'rental' &&
          <FadeIn direction={fromLeft} thresh={0} className={'upload-form-container'}>
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
            handleForm={handleForm}
          />
          </FadeIn>
          }
          {category === 'blogs' && 
          <FadeIn direction={fromLeft} thresh={0} className={'upload-form-container'}>
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
              handleForm={handleForm}
            />
          </FadeIn>
          }
          {category === 'gallery' && 
          <FadeIn direction={fromLeft} thresh={0} className={'upload-form-container'}>
            <GalleryForm
              galleryName={galleryName}
              setGalleryName={setGalleryName}
              galleryFilesInputRef={galleryFilesInputRef}
              handleFileChange={handleFileChange}
              handleForm={handleForm}
            />
          </FadeIn>
          }
        <div>
              <p>{uploadMessage}</p>
              {isUploading && (
              <button onClick={cancelUpload}>Cancel Upload</button>
                )}
        </div>
      </section>
    )}
    </>     
    )
};

export default UploadForm;