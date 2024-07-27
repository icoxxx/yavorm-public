import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { ItemsToEditType } from "../types";
import { useItemsToEdit } from "../utils/EditContext";
import { getItems, removeItem } from "../store/homeItems/dataSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import FadeIn from "./FadeIn";
import { fromLeft } from "@/utils/animationVariants";

type DataProps = {
    data: {
        date: string;
        email: string;
        name: string;
        image: string;
        __v: number;
        _id: string;
    }
  }

const HomeItem: React.FC<DataProps> = ({data})=> {

    const { isAuthenticated, logout, isAdmin } = useAuth();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const { itemsToEdit, setItemsToEdit } = useItemsToEdit();
    const dispatch = useDispatch();


    const editItem = async (itemId : string, email: string, itemName: string, itemImage : string) => {
        const newItemToEdit: ItemsToEditType = [itemId, email, itemName, itemImage];
        setItemsToEdit(newItemToEdit);
        localStorage.setItem('itemsToEdit', JSON.stringify(newItemToEdit));
      }

    const handleDelete = async ()=> {
        try {
          console.log(deleteId)
          const response = await fetch(`http://localhost:3000/api/test/${deleteId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (response.ok) {
           dispatch(removeItem(deleteId))
            setDeleteConfirm(false); // Close the confirmation modal
          }
          else if(!response.ok){
            throw new Error('Failed to delete item');
          }
        } catch (error:any) {
          console.log(`Error: ${error}`)
        }
      }
    return(
        <>
             <li key={`${data._id}-li-item`}>
                    <FadeIn delay={0} direction={fromLeft}>
                      <div>Name: {data.name}</div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction={fromLeft}>
                    <div>Email: {data.email}</div>
                    </FadeIn>
                    <div>
                    {data.image && (
                        <img src={`http://localhost:3000/uploads/${data.image}`} alt="Uploaded" />
                    )}
                    </div>
                    {isAuthenticated && isAdmin && (
                    <div>
                        <Link href='/edit'>
                        <button onClick={() => editItem(data._id, data.email, data.name, data.image)}>EDIT</button>
                        </Link>
                        <button onClick={() => {
                        setDeleteConfirm(true);
                        setDeleteId(data._id);
                        }}>DELETE</button>
                    </div>
                    )}
             </li>
            {deleteConfirm && (
            <>
              <div className="blur-background" />
              <div className="delete-modal-wrapper">
                  <div>Are you sure you want to delete this item?</div>
                  <div>
                    <button onClick={()=> setDeleteConfirm(false)}>RETURN</button>
                    <button onClick={handleDelete}>Yes</button>
                  </div>
              </div>
            </>
          )}    
        </>

    )
};



export default HomeItem;