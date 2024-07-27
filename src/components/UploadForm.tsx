import React, { useState, FormEvent, useRef} from "react";
import { useUploadContext } from "../utils/UploadContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addItem, getItems } from "../store/homeItems/dataSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

const UploadForm: React.FC = ()=> {
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [file, setFile] = useState<File | null>(null); // Change to File | null to handle file uploads
      const [isUploading, setIsUploading] = useState(false);
      const {uploadMessage, setUploadMessage, cancelUpload } = useUploadContext();
      const fileInputRef = useRef<HTMLInputElement>(null);
      const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();

      type Item = {
        date: string;
        email: string;
        name: string;
        image: string;
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
        formData.append('email', email);
        formData.append('name', name);
        formData.append('image', file);
        console.log(formData)
        setIsUploading(true)
    
        setUploadMessage('Wait for a moment. Data is Uploading.....');
    
        try {
          const response = await fetch('http://localhost:3000/api/test', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
    
          if (!response.ok) {
            throw new Error('Failed to upload data');
          }

          const newItem: Item = await response.json();
          //setItems(prevItems => [...prevItems, newItem]);
          dispatch(addItem(newItem))
    
          setName("");
          setEmail("");
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


    return (
    <>
    <form id="test-form" onSubmit={handleForm}>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="on"
        />
        <label htmlFor="name">Name</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
        />
        <label htmlFor="email">Email</label>

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