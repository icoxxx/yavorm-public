import RentalItems from "@/components/RentalItems";
import UploadForm from "@/components/UploadForm";
import { RootState } from "@/store/store";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Admin: React.FC = ()=> {
    const {isAuthenticated, isAdmin} = useAuth();
    const router = useRouter();
    const [redirectSeconds, setRedirectSeconds] = useState(3);
    const items = useSelector((state: RootState) => state.data.items);

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

    return(
        <>
          {
          (isAuthenticated && isAdmin) 
          ?
          (
            <>
            <UploadForm/>
            {items.map((item)=> (
                        <article key={item._id}>
                            <RentalItems
                              data = {item}>
                              </RentalItems>
                        </article>
            ))}
            </>
          )
          :
          <div>
            <div>You need to login first!</div>
            <div>{`Redirecting to Home Page in ${redirectSeconds}`}</div>
          </div>
          }
        </>
    )
};

export default Admin;