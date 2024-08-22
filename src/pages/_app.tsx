import { store } from "@/store/store";
import "@/styles/main.scss";
import { AuthProvider } from "@/utils/AuthContext";
import { ItemsToEditProvider } from "@/utils/EditContext";
import { UploadProvider } from "@/utils/UploadContext";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "@/components/Header";
import { IsLoginOpenedProvider } from "@/utils/LoginModalContext";
import { CategoryProvider } from "@/utils/RentalCategoryContext";
import Footer from "@/components/Footer";
import { IsCanvasProvider } from "@/utils/CanvasContext";


export default function App({ Component, pageProps }: AppProps) {
  return (

    <GoogleReCaptchaProvider
    reCaptchaKey="6Lf-0ikqAAAAAHX1ye-fVVKmLSHZCvhTZ-mA1SDf"
    >
      <Provider store={store}>
        <IsLoginOpenedProvider>
          <AuthProvider>
            <IsCanvasProvider>
              <CategoryProvider>
                <ItemsToEditProvider>
                    <UploadProvider>
                          <Header/>
                          <Component {...pageProps} />
                          <Footer/>
                    </UploadProvider>
                  </ItemsToEditProvider>
              </CategoryProvider>
            </IsCanvasProvider>
          </AuthProvider>
        </IsLoginOpenedProvider>
      </Provider>
    </GoogleReCaptchaProvider>
);
}
