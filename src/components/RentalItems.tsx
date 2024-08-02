import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { RentalItemsToEditType } from "../types";
import { useItemsToEdit } from "../utils/EditContext";
import { getItems, removeItem } from "../store/rentalItems/dataSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import FadeIn from "./FadeIn";
import { fromLeft } from "@/utils/animationVariants";

type DataProps = {
    data: {
        date: string;
        description?: string;
        itemName?: string;
        image?: string;
        category: string;
        __v: number;
        _id: string;
    }
  }

const RentalItems: React.FC<DataProps> = ({data})=> {

    const { isAuthenticated, logout, isAdmin } = useAuth();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const { itemsToEdit, setItemsToEdit } = useItemsToEdit();
    const dispatch = useDispatch();


    const editItem = async (itemId? : string, description?: string, itemName?: string, itemImage? : string, category?: string) => {
        const newItemToEdit: any = {
          itemId: itemId,
          description: description,
          itemName: itemName,
          itemImage: itemImage,
          category: category,
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
                      <div>Name: {data.itemName}</div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction={fromLeft}>
                    <div>Email: {data.description}</div>
                    </FadeIn>
                    <div>
                    {data.image && (
                        <img src={`http://localhost:3000/uploads/${data.image}`} alt="Uploaded" />
                    )}
                    </div>
                    {isAuthenticated && isAdmin && (
                    <div>
                        <Link href='/edit'>
                        <button onClick={() => editItem(data._id, data.description, data.itemName, data.image, data.category)}>EDIT</button>
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



export default RentalItems;