import React, { useState, FormEvent, useRef} from "react";
import { useUploadContext } from "../utils/UploadContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addItem, getItems } from "../store/rentalItems/dataSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import cdj3000 from '../assets/images/CDJ-3000.png';
import djEvent from '../assets/images/dj-event-pic.jpg';
import blog from '../assets/images/blogpost.png';
import Image from "next/image";
import FadeIn from "./FadeIn";
import { fromLeft } from "@/utils/animationVariants";

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


      type RentalItem = {
        date: string;
        description?: string;
        itemName?: string;
        image?: string;
        category: string;
        __v: number;
        _id: string;
      };

    const handleForm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!file) {
          console.error('No file selected');
          return;
        }
        const controller = new AbortController();
    
        const formData = new FormData();
        if(category === 'rental'){
          formData.append('description', description);
          formData.append('itemName', itemName);
          formData.append('image', file);
          formData.append('category', category);
        }
        else if(category === 'blogs'){
          formData.append('blogTitle', blogTitle);
          formData.append('blogText', blogText);
          formData.append('image', file);
          formData.append('category', category);
        }
        else if(category === 'gallery'){
          formData.append('galleryName', galleryName);
          formData.append('image', file);
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

          const newItem: RentalItem = await response.json();

          dispatch(addItem(newItem))
    
          setItemName("");
          setDescription("");
          setFile(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
          }
    
          setUploadMessage('Success! Data is uploaded!');
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
          dispatch(getItems())
          setIsUploading(false);
        }
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        console.log(fileList)
        if (fileList && fileList.length > 0) {
          setFile(fileList[0]);
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

    const RentalForm: React.FC = ()=> {
      return(
      <form id="upload-form" onSubmit={handleForm}>
        <label htmlFor="itemName">Item Name</label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          autoComplete="on"
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoComplete="on"
        />

        <label htmlFor="file">Image</label>
        <input 
          type="file"
          id="file"
          name="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange} // Call handleFileChange when file input changes
          ref={fileInputRef}
        />

        <input type="submit" id="submit" />
      </form>
      )
    }

    const BlogsForm: React.FC = ()=> {
      return(
      <form id="upload-form" onSubmit={handleForm}>
        <label htmlFor="blogTitle">Blog Title</label>
        <input
          type="text"
          id="blogTitle"
          name="blogTitle"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          autoComplete="on"
        />

        <label htmlFor="blogText">Blog Text</label>
        <input
          type="text"
          id="blogText"
          name="blogText"
          value={blogText}
          onChange={(e) => setBlogText(e.target.value)}
          autoComplete="on"
        />

        <label htmlFor="file">Image</label>
        <input 
          type="file"
          id="file"
          name="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange} // Call handleFileChange when file input changes
          ref={fileInputRef}
        />

        <input type="submit" id="submit" />
      </form>
      )
    }

    const GalleryForm: React.FC = ()=> {
      return(
      <form id="upload-form" onSubmit={handleForm}>
        <label htmlFor="galleryName">Gallery Name</label>
        <input
          type="text"
          id="galleryName"
          name="galleryName"
          value={galleryName}
          onChange={(e) => setGalleryName(e.target.value)}
          autoComplete="on"
        />

        <label htmlFor="file">Image</label>
        <input 
          type="file"
          id="file"
          name="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange} // Call handleFileChange when file input changes
          ref={fileInputRef}
        />

        <input type="submit" id="submit" />
      </form>
      )
    }


    return (
    <>
    <section className="selet-upload-category-wrapper">
      <div>Моля, изберете категория</div>
      {
        categories.map((el, index)=> (
          <div 
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
          key={`${el}-${index}`}
          >
            <div className="upload-category-text">
              <span>{el.category}</span>
            </div>
            <Image src={el.image} quality={100} alt={el.category} />
          </div>
        ))
      }
    </section>

    {category === 'rental' &&
     <FadeIn direction={fromLeft}>
      <RentalForm />
     </FadeIn>
     }
    {category === 'blogs' && 
    <FadeIn direction={fromLeft}>
      <BlogsForm />
    </FadeIn>
    }
    {category === 'gallery' && 
    <FadeIn direction={fromLeft}>
      <GalleryForm />
    </FadeIn>
    }

        <div>
              <p>{uploadMessage}</p>
              {isUploading && (
              <button onClick={cancelUpload}>Cancel Upload</button>
                )}
        </div>   
    </>     
    )
};

export default UploadForm;