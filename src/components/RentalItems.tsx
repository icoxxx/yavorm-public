import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { RentalItemsToEditType } from "../types";
import { useItemsToEdit } from "../utils/EditContext";
import { getItems, removeItem } from "../store/rentalItems/dataSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import FadeIn from "./FadeIn";
import { fromLeft } from "@/utils/animationVariants";
import Image from "next/image";

type DataProps = {
    data: {
        date: string;
        description?: string;
        itemName?: string;
        modelName?: string;
        rentalCategory?: string;
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


    const editItem = async (itemId? : string, description?: string, itemName?: string, modelName?: string, rentalCategory?: string, itemImage? : string, category?: string) => {
        const newItemToEdit: any = {
          itemId: itemId,
          description: description,
          itemName: itemName,
          modelName: modelName,
          rentalCategory: rentalCategory,
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
             <div>
                    <FadeIn delay={0} direction={fromLeft}>
                      <div>Mарка: {data.itemName}</div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction={fromLeft}>
                    <div>Модел: {data.modelName}</div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction={fromLeft}>
                    <div>Категория: {data.rentalCategory}</div>
                    </FadeIn>
                    <FadeIn delay={0.5} direction={fromLeft}>
                    <div>Описание: {data.description}</div>
                    </FadeIn>
                    <div>
                    {data.image && (
                        <Image alt={`${data.itemName} - image`} quality={100} width={300} height={300} src={`/uploads/rental/${data.image}` } />
                    )}
                    </div>
                    {isAuthenticated && isAdmin && (
                    <div className="edit-delete-buttons">
                        <Link href='/edit' className="edit-button">
                        <button onClick={() => editItem(data._id, data.description, data.itemName, data.modelName, data.rentalCategory, data.image, data.category)}>EDIT</button>
                        </Link>
                        <button className="delete-button" onClick={() => {
                        setDeleteConfirm(true);
                        setDeleteId(data._id);
                        }}>DELETE</button>
                    </div>
                    )}
             </div>
            {deleteConfirm && (
            <>
              <div className="blur-background" />
              <div className="delete-modal-wrapper">
                  <div>Are you sure you want to delete this item?</div>
                  <div className="delete-confirm-buttons">
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