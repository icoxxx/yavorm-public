import React, { useEffect, useState } from "react";
import { useItemsToEdit } from "../utils/EditContext";
import { useAuth } from "../utils/AuthContext";
import { useDispatch } from "react-redux";
import { getItems, updateItem } from "../store/rentalItems/dataSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Image from "next/image";
import { useRouter } from "next/router";

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        console.log(fileList)
        if (fileList && fileList.length > 0) {
          setFile(fileList[0]);
        }
      }

      const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) : Promise<void> => {
        e.preventDefault();
        try {
          const formData = new FormData();
          description ? formData.append('description', description) : null;
          itemName ? formData.append('itemName', itemName) : null;
          //formData.append("email", email);
          //formData.append("name", name);
          if (file) {
            formData.append("image", file);
          }
          const response = await fetch(`http://localhost:3000/api/rental/${item_ID}`, {
            method: 'PUT',
            body: formData,
          });
          if(!response.ok){
            throw new Error('Failed to submit form')
          }
          const updatedItem = await response.json();
          dispatch(updateItem(updatedItem));
    
          console.log('Edit Form submitted! Files changed! Yay!')
        } catch (err: any) {
          console.error(`Error: ${err.message}`)
        }
        finally{
          dispatch(getItems());
          router.push('/'); // Navigate back to the homepage
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
        <section>
            <div>
                {itemsToEdit.length > 0 && (isAuthenticated && isAdmin) ? (
                <React.Fragment>
                <form id="test-form" onSubmit={handleEditForm}>
                    <input
                    type="text"
                    id="editName"
                    name="editName"
                    placeholder={itemsToEdit[0].itemName}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    />
                    <label htmlFor="editName">Item Name</label>
                    <input
                    type="text"
                    id="editDescription"
                    name="editDescription"
                    placeholder={itemsToEdit[0].description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="editDescription">Description</label>
        
                    <input 
                    type="file"
                    id="editFile"
                    name="editFile"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange} // Call handleFileChange when file input changes
                    />
        
                    <input type="submit" id="editSubmit" />
                </form>

                <ul>
                        <li>
                            <Image width={100} height={50} quality={100} src={`/uploads/${itemsToEdit[0].itemImage}`} alt="edit-image"/>
                        </li>
                        <li>{`Description - ${itemsToEdit[0].description}`}</li>
                        <li>{`Item Name - ${itemsToEdit[0].itemName}`}</li>
                    </ul> 
                </React.Fragment>
                )
                :
                <div>
                <div>You need to login first!</div>
                <div>{`Redirecting to Home Page in ${redirectSeconds}`}</div>
                </div>
                }
            </div>
        </section>
    )
}

export default EditPage;