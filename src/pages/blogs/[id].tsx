import FacebookEmbedComponent from "@/components/FacebookEmbed";
import InstagramEmbed from "@/components/InstagramEmbed";
import { BlogItem } from "@/store/blogItems/blogSlice";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {FacebookShareButton, FacebookIcon, ViberShareButton, ViberIcon, WhatsappShareButton, WhatsappIcon } from 'next-share';
import { useRouter } from "next/router";
import logo from '../../assets/images/Yavor-M-logo-color.svg';
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { fromLeft, fromRight } from "@/utils/animationVariants";

type SingleBlogPropsType = {
    blogItem: BlogItem;
    title: string;
    description: string;
    imageUrl: string;
    blogs: BlogItem[];
}

declare global {
    interface Window {
      FB: any;
      fbAsyncInit: () => void;
    }
  }


const SingleBlogPage: React.FC<SingleBlogPropsType> = ({blogItem, title, description, imageUrl, blogs})=> {

    const fbScriptRef = useRef<HTMLScriptElement | null>(null);
    const instaScriptRef = useRef<HTMLScriptElement | null>(null);
    const router = useRouter();
    const currentUrl = typeof window !== 'undefined' ? window.location.origin + router.asPath : '';
    const asideBlog: BlogItem = blogItem._id === blogs[0]._id ? blogs[1] : blogs[0];
    const observerRef = useRef<MutationObserver | null>(null);

    useEffect(() => {
      if(blogItem.fbLink){
        const loadFacebookSDK = () => {
            if (window.FB) {
              window.FB.XFBML.parse();
            } else {
              window.fbAsyncInit = function () {
                window.FB.init({
                  xfbml: true,
                  version: 'v17.0',
                });
                window.FB.XFBML.parse(); // Ensure parsing happens after initialization
              };
      
              if (!fbScriptRef.current) {
                const script = document.createElement('script');
                script.id = 'facebook-jssdk';
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                  if (window.fbAsyncInit) {
                    window.fbAsyncInit();
                  }
                };
                script.onerror = () => {
                  console.error('Error loading Facebook SDK.');
                };
                document.body.appendChild(script);
                fbScriptRef.current = script;
              }
            }
          };
      
          loadFacebookSDK();
      }

      const loadInstagramEmbed = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };

      if(blogItem.instaLink){
        
          // Create and append the Instagram embed script if not already loaded
          if (!instaScriptRef.current) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.onload = loadInstagramEmbed;
            script.onerror = () => {
              console.error('Error loading Instagram embed script.');
            };
            document.body.appendChild(script);
            instaScriptRef.current = script;
          } else {
            loadInstagramEmbed();
          }

          const observer = new MutationObserver(() => {
            loadInstagramEmbed();
          });
    
          observer.observe(document.body, { childList: true, subtree: true });
          observerRef.current = observer;
      }
      // Cleanup the script on component unmount
      return () => {
        if (fbScriptRef.current) {
          document.body.removeChild(fbScriptRef.current);
          fbScriptRef.current = null;
        }
        if (instaScriptRef.current) {
            document.body.removeChild(instaScriptRef.current);
            instaScriptRef.current = null;
          }

        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
      };
    }, [blogItem]);



    const formatDate = (dateString:string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      };

      const renderParagraphs = (text: string) => {
        return text.split(/\r?\n\r?\n/).map((paragraph, index) => {
          if (index === 0) {
            const firstChar = paragraph.charAt(0); // Get the first character
            const restOfParagraph = paragraph.slice(1); // Get the rest of the paragraph
            return (
              <p key={index}>
                <span className="first-character">{firstChar}</span>
                {restOfParagraph.split(/\r?\n/).map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== restOfParagraph.split(/\r?\n/).length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          }
      
          return (
            <p key={index}>
              {paragraph.split(/\r?\n/).map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== paragraph.split(/\r?\n/).length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        });
      };
      

    return(
        <>
        <Head>
          <title>{title}</title>
          <meta
            name="format-detection"
            content="telephone=no, date=no, email=no, address=no"
          />
          <link rel="icon" href={imageUrl} type="image/jpeg"/>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:image" content={imageUrl} />
        </Head>

        <main className="single-blog-page-wrapper">
          <div className="single-blog-hoc">
                  <div className="lines">
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                     <div className="line"></div>
                   </div>
            {blogItem && (
              <article className="single-blog-wrapper">
                  <FadeIn key={`${currentUrl}-main`} direction={fromLeft} thresh={0} delay={0} className="single-blog-container">
                      <div className="single-blog-data">
                          <h1>{blogItem.blogTitle}</h1>
                          <div className="single-blog-img-wrapper">
                              {blogItem.image && (<Image fill quality={100} alt={`${blogItem.blogTitle}-image`} src={`/uploads/blogs/${blogItem.image}`} />)}
                          </div>
                          <div className="single-blog-author-date">
                              <p>{blogItem.blogAuthor}</p> <p>{formatDate(blogItem.date)}</p>
                          </div>
                          <div className="blog-share-buttons-container">
                              <div className="share-buttons">
                                  <FacebookShareButton url={currentUrl}>
                                      <FacebookIcon size={40} round/>
                                  </FacebookShareButton>

                                  <WhatsappShareButton title={title} url={currentUrl}>
                                      <WhatsappIcon size={40} round/>
                                  </WhatsappShareButton>

                                  <ViberShareButton title={title} url={currentUrl}>
                                      <ViberIcon size={40} round/>
                                  </ViberShareButton>
                              </div>
                              <div>СПОДЕЛИ</div>
                          </div>
                          <div className="single-blog-main-text">
                              {blogItem.blogText && (
                                renderParagraphs(blogItem.blogText)
                              )}
                          </div>
                          <div className="fb-post-container">
                              {blogItem.fbLink && (
                                  <FacebookEmbedComponent 
                                  url={blogItem.fbLink} 
                                  className="fb-post"
                                  >
                                  </FacebookEmbedComponent>
                              )}
                          </div>
                          {blogItem.instaLink && instaScriptRef && (
                            <div className="insta-post">
                              <InstagramEmbed url={blogItem.instaLink} />
                            </div>
                          )}
                      </div>
                  </FadeIn>
                      {asideBlog && (
                          <FadeIn key={`${currentUrl}-aside`} delay={0} thresh={0} direction={fromRight} className="single-blog-aside">
                              <div className="aside-blog">
                                      <div className="aside-news">АКТУАЛНО ОТ БЛОГА</div>
                                      <div className="aside-blog-img-wrapper">
                                      {asideBlog.image && (<Image fill quality={100} src={`/uploads/blogs/${asideBlog.image}`} alt={`${asideBlog.blogTitle}-image`}/>)}
                                      </div>
                                      <Link href={`/blogs/${asideBlog._id}`}><h4>{asideBlog.blogTitle}</h4></Link>
                                      <Link className="button-to-blog" href={`/blogs/${asideBlog._id}`}>КЪМ СТАТИЯТА</Link>
                              </div>
                              <Image width={150} height={150} quality={100} src={logo} alt="logo" />  
                          </FadeIn>
                      )}
              </article>
              )}
          </div>
        </main>
        </>
    )
};

export const getServerSideProps : GetServerSideProps = async (context)=> {
    try {
        const {id} = context.params!;
        const [blogRes, allBlogsRes] = await Promise.all([
            fetch(`http://localhost:3000/api/blogs/${id}`,{
              method: 'GET',
              cache: 'no-cache',
            }),
            fetch('http://localhost:3000/api/blogs',{
              method: 'GET',
              cache: 'no-cache',
            })
        ]);

        if(!blogRes.ok){
            throw new Error('Failed to fetch blog item');
        }
        if(!allBlogsRes.ok){
            throw new Error('Failed to fecth blog');
        }

        const blogData = await blogRes.json();
        const blog = blogData.item;

        const allBlogsData = await allBlogsRes.json();
        const blogs = allBlogsData.items
        return{
            props:{
                blogItem: blog,
                title: blog.blogTitle,
                description: `Актуални статии от музикалния свят - ${blog.blogTitle}`,
                imageUrl: '/dj-booth.jpg',
                blogs: blogs,
            }
        }
    } catch (error:any) {
        return{
            props:{
                blogItem: {},
                title: 'YavorM - статии',
                description: 'Актуални статии от музикалния свят',
                imageUrl: '/dj-booth.jpg',
                blogs: [],
            }
        }
    }
}

export default SingleBlogPage;