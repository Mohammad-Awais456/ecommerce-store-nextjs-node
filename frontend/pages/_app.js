import Head from 'next/head';
import '../styles/globals.scss';
import Header from '../components/Header/Header';
import {Provider} from "react-redux";
import { store,persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';

import Footer from '../components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { is_login } from '../functions/methods';
import { storeUserInformation } from '../store/slices/userSlices';
import Starter from '../components/Starter/Starter';


function MyApp({ Component, pageProps }) {





  return <>
  <Provider store={store}>
 <PersistGate loading={null} persistor={persistor}>

  <Starter/>
  <Header/>
  <Component {...pageProps} />
  <ToastContainer/>

  <Footer/>

 </PersistGate>
  </Provider>
  </>
}

export default MyApp
