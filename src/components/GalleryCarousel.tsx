import { GalleryItem } from "@/store/galleryItems/gallerySlice";
import React from "react";
import FadeIn from "./FadeIn";
import { fromLeft80, fromRight80, fromTop } from "@/utils/animationVariants";
import GalleryImage from "./GalleryImage";
import Carousel from "react-multi-carousel";
import { useAuth } from "@/utils/AuthContext";
import Link from "next/link";
import Image from "next/image";
import editButton from '../assets/images/edit-button.png';
import deleteButton from '../assets/images/delete-button.png';

type GalleryCarouselProps = {
    galleryItem: GalleryItem;
    index: number;
    setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteId: React.Dispatch<React.SetStateAction<string>>;
    editItem: (
        itemId?: string,
        galleryName?: string,
        images?: string[],
        category?: string,
        redirectPath?: string,
    ) => Promise<void>;
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenedImage: React.Dispatch<React.SetStateAction<string>>;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({galleryItem, index, setDeleteConfirm, setDeleteId, editItem, setIsModalOpened, setOpenedImage})=> {
    const {isAuthenticated, isAdmin} = useAuth();
    return(
        <div className="gallery-carousel-wrapper">
            <FadeIn direction={fromTop} delay={0.4} thresh={0.1} className="gallery-name">{galleryItem.galleryName}</FadeIn>
            <FadeIn direction={fromTop} delay={0.6} thresh={0.1}>
                {isAuthenticated && isAdmin && (
                <div className="admin-buttons">
                    <Link href='/edit'>
                    <Image src={editButton}
                    quality={100} 
                    alt="edit-button"
                    onClick={() => editItem(galleryItem._id, galleryItem.galleryName, galleryItem.images, galleryItem.category, `/gallery`)}
                    />
                    </Link>
                    <Image 
                    src={deleteButton} 
                    quality={100} 
                    alt="delete-button"
                    onClick={() => {
                    setDeleteConfirm(true);
                    setDeleteId(galleryItem._id);
                    }}
                    />
                </div>
                )}
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    containerClass="home-carousel-container"
                    draggable
                    focusOnSelect={false}
                    infinite
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024
                        },
                        items: 2,
                        },
                        mobile: {
                        breakpoint: {
                            max: 600,
                            min: 0
                        },
                        items: 1,
                        },
                        tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 600
                        },
                        items: 2,
                        }
                    }}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    itemClass="gallery-page-carousel-items"
                    slidesToSlide={1}
                    swipeable
                    ssr
                    partialVisbile={false}
                    >
                        {galleryItem.images && galleryItem.images.length > 0 && (
                        galleryItem.images.map((image, index)=> {
                        return(
                            <div onClick={()=> (setIsModalOpened(true), setOpenedImage(image))} key={`image-${index}`} className="gallery-carousel-items">
                                <div className="gallery-carousel-img-container">
                                    <GalleryImage src={`/uploads/gallery/${image}`} alt={`${galleryItem.galleryName}-image`} />
                                </div>
                            </div>
                        )
                        })
                        )}
                </Carousel>
            </FadeIn>
        </div>
    )
};

export default GalleryCarousel;