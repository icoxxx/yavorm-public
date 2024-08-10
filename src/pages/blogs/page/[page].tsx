import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { BlogItem, removeBlogItem, setBlogItems } from "@/store/blogItems/blogSlice";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { fromLeft, fromLeft80 } from "@/utils/animationVariants";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { useItemsToEdit } from "@/utils/EditContext";
import DeleteModal from "@/components/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

type BlogPageProps ={
    title: string;
    description: string;
    imageUrl: string;
    blogItems: BlogItem[];
    currentPage: number;
    totalPages: number;
}

const BlogsPage: React.FC <BlogPageProps> = ({title, description, imageUrl, blogItems, currentPage, totalPages})=> {
    const router = useRouter();
    const [isPrevDisabled, setIsPrevDisabled] = useState(currentPage <= 1);
    const [isNextDisabled, setIsNextDisabled] = useState(currentPage >= totalPages);
    const [isFirst, setIsFirst] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const { itemsToEdit, setItemsToEdit } = useItemsToEdit();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      dispatch(setBlogItems(blogItems));
    }, [dispatch, blogItems]);

    const storedBlogs = useSelector((state: RootState) => state.blogs.items);

    const editItem = async (itemId? : string, blogTitle?: string, blogAuthor?: string, blogText?: string, instaLink?: string, fbLink?: string, itemImage? : string, category?: string, redirectPath?: string) => {
      const newItemToEdit: any = {
        itemId: itemId,
        blogTitle: blogTitle,
        blogAuthor: blogAuthor,
        blogText: blogText,
        instaLink: instaLink,
        fbLink: fbLink,
        itemImage: itemImage,
        category: category,
        redirectPath: redirectPath,
      };
      setItemsToEdit(() => [newItemToEdit]);
    }
  
    const handleDelete = async ()=> {
     try {
        const response = await fetch(`http://localhost:3000/api/blogs/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
         dispatch(removeBlogItem(deleteId));
         setDeleteConfirm(false); // Close the confirmation modal
        }
        else if(!response.ok){
          throw new Error('Failed to delete item');
        }
      } catch (error:any) {
        console.log(`Error: ${error}`)
      } 
    }

    const handleNextPage = () => {
        setIsFirst(false);
        if (currentPage < totalPages) {
          router.push(`/blogs/page/${currentPage + 1}`);
        }
      };

    
      const handlePrevPage = () => {
        setIsFirst(false)
        if (currentPage > 1) {
          router.push(`/blogs/page/${currentPage - 1}`);
        }
      };

      const renderPageNumbers = () => {
        const pagesToShow = 3;
        const sidePages = 1;
        const pagesArray = [];
    
        if (totalPages <= pagesToShow + sidePages * 2) {
          for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i);
          }
        } else if (currentPage <= pagesToShow) {
          for (let i = 1; i <= pagesToShow + sidePages; i++) {
            pagesArray.push(i);
          }
          pagesArray.push('...');
          pagesArray.push(totalPages);
        } else if (currentPage > totalPages - pagesToShow) {
          pagesArray.push(1);
          pagesArray.push('...');
          for (let i = totalPages - (pagesToShow); i <= totalPages; i++) {
            pagesArray.push(i);
          }
        } else {
          pagesArray.push(1);
          pagesArray.push('...');
          for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) {
            pagesArray.push(i);
          }
          pagesArray.push('...');
          pagesArray.push(totalPages);
        }
    
        const handlePageClick = (page: string | number) => {
            setIsFirst(false)
          router.push(`/blogs/page/${page}`);
        };
    
        return pagesArray.map((page, index) => {
          if (page === '...') {
            return (
              <span className="dots-numb" key={index}>{page}</span>
            );
          } else {
            return (
                <span
                  key={index}
                  className={currentPage === page ? 'active-page page-numb' : 'page-numb'}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </span>
            );
          }
        });
      };
    
      useEffect(() => {
        setIsPrevDisabled(currentPage <= 1);
        setIsNextDisabled(currentPage >= totalPages);
      }, [currentPage, totalPages]);


    return(
        <>
        <main className="blogs-page-wrapper">
            <section style={{position: 'relative', width: '100%'}}>
                <FadeIn key={currentPage} direction={fromLeft80} thresh={0} delay={0} className="blogs-flex-wrapper">
                {storedBlogs && (
                    storedBlogs.map((blog) => (
                        <BlogCard key={blog._id} data={blog} editItem={editItem} setDeleteConfirm={setDeleteConfirm} setDeleteId={setDeleteId} returnPage={currentPage} />
                    ))
                )}
                </FadeIn>
            </section>
            <div className="pagination">
                <button className="prev-page-button" onClick={handlePrevPage} disabled={isPrevDisabled}><div className="left-arrow"></div></button>
                <div className="pagination-numbers">{renderPageNumbers()}</div>
                <button className="next-page-button" onClick={handleNextPage} disabled={isNextDisabled}><div className="right-arrow"></div></button>
            </div>
        </main>
        {deleteConfirm && (
           <DeleteModal setDeleteConfirm={setDeleteConfirm} handleDelete={handleDelete} />
          )}    
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { page = 1 } = context.query;

        const res = await fetch(`http://localhost:3000/api/blogs?page=${page}&limit=5`);
        if(!res.ok){
            throw new Error('Failed to fetch items');
          }
        const data = await res.json();
        return {
            props: {
              title: 'YavorM - статии',
              description: 'Актуални статии от музикалния свят',
              imageUrl: '/dj-booth.jpg',
              blogItems: data.items,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
            },
          };
    } catch (error:any) {
        console.log('Error:', error)
        return {
          props: {
            title: 'YavorM - статии',
            description: 'Актуални статии от музикалния свят',
            imageUrl: '/dj-booth.jpg',
            blogItems: [],
            currentPage: 1,
            totalPages: 1,
          }
        }
    }

  };

export default BlogsPage;