export type RentalItemType = {
    date: string;
    description: string;
    itemName: string;
    modelName: string;
    rentalCategory: string;
    image: string;
    category: string;
    __v: number;
    _id: string;
  };

 export type BlogItemType = {
    date: string;
    blogTitle: string;
    blogText: string;
    blogAuthor: string;
    instaLink: string;
    fbLink: string;
    image: string;
    category: string;
    __v: number;
    _id: string;
  }

 export type GalleryItemType = {
    galleryName: string;
    images: string[];
    date: string;
    category: string;
    __v: number;
    _id: string;
  }