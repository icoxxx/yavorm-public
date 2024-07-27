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

export default function App({ Component, pageProps }: AppProps) {
  return (

    <GoogleReCaptchaProvider
    reCaptchaKey="6LcbzxAqAAAAAGah0A9cflnTBqN1vSitIbq8Kfs2"
    >
      <Provider store={store}>
        <IsLoginOpenedProvider>
          <AuthProvider>
            <ItemsToEditProvider>
                <UploadProvider>
                      <Header/>
                      <Component {...pageProps} />
                </UploadProvider>
              </ItemsToEditProvider>
          </AuthProvider>
        </IsLoginOpenedProvider>
      </Provider>
    </GoogleReCaptchaProvider>
);
}
