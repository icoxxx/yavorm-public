import React, { useState } from "react";
import { BlogItem } from "@/store/blogItems/blogSlice";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { useItemsToEdit } from "@/utils/EditContext";
import editButton from '../assets/images/edit-button.png';
import deleteButton from '../assets/images/delete-button.png';

interface BlogCardProps {
    data: BlogItem;
    editItem: (
        itemId?: string,
        blogTitle?: string,
        blogAuthor?: string,
        blogText?: string,
        instaLink?: string,
        fbLink?: string,
        itemImage?: string,
        category?: string,
        redirectPath?: string,
    ) => Promise<void>;
    setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteId: React.Dispatch<React.SetStateAction<string>>;
    returnPage: number;
  }

const BlogCard: React.FC <BlogCardProps>= ({data, editItem, setDeleteConfirm, setDeleteId, returnPage})=> {
    const {isAuthenticated, isAdmin} = useAuth();

    const formatDate = (dateString:string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      };

    return(
    <article className="blog-container">
        {isAuthenticated && isAdmin && (
            <div className="admin-buttons">
                <Link href='/edit'>
                <Image src={editButton}
                quality={100} 
                alt="edit-button"
                onClick={() => editItem(data._id, data.blogTitle, data.blogAuthor, data.blogText, data.instaLink, data.fbLink, data.image, data.category, `/blogs/page/${returnPage.toString()}`)}
                />
                 </Link>
                <Image 
                 src={deleteButton} 
                 quality={100} 
                 alt="delete-button"
                 onClick={() => {
                 setDeleteConfirm(true);
                 setDeleteId(data._id);
                 }}
                />
             </div>
        )}
        <div className="blog-img-container">
            <Image fill className="blog-img" quality={100} src={`/uploads/blogs/${data.image}`} alt={`${data.blogTitle}-image`} />
        </div>
        <div className="blog-author-date"><p>{data.blogAuthor}</p> <p>{formatDate(data.date)}</p></div>
        <div className="blog-text-container">
            <Link className="link-from-title" href={`/blogs/${data._id}`}>
                <h2>  
                    {data.blogTitle && (
                        data.blogTitle.length > 60
                        ? `${data.blogTitle.slice(0, 60)}...` // Truncate at 100 characters and add ellipsis
                        : data.blogTitle
                    )}
                </h2>
            </Link>
            <p className="blog-text-sliced">{data.blogText?.slice(0, 110)} ...</p>
            <Link className="button-to-blog" href={`/blogs/${data._id}`}>ПРОЧЕТИ ОЩЕ</Link>
        </div>
    </article>
    )
};

export default BlogCard;