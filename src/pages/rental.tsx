import { GetServerSideProps } from "next";
import React from "react";
import { RentalItem } from "@/store/rentalItems/dataSlice";
import Image from "next/image";

type RentalProps = {
    title: string;
    description: string;
    imageUrl: string;
    rentalItems: RentalItem[];
}

const Rental: React.FC<RentalProps> = ({title, description, imageUrl, rentalItems})=> {
    return(
        <>
            <div>{rentalItems[0].itemName}</div>
            <div>{rentalItems[0].description}</div>
            <div>{rentalItems[0].category}</div>
        </>
    )
};

export default Rental;


export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rental');
      if(!response.ok){
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      return {
        props: {
          title: 'YavorM - техника под наем',
          description: 'YavorM техника под наем',
          imageUrl: '/dj-booth.jpg',
          rentalItems: data.items || [], 
        }
      };
    } catch (error:any) {
      console.log('Error:', error)
      return {
        props: {
          title: 'YavorM - техника под наем',
          description: 'YavorM техника под наем',
          imageUrl: '/dj-booth.jpg',
          rentalItems: [],
        }
      }
    }
  
  };