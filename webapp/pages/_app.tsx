import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import AppLayout from '../components/AppLayout';
import Footer from '../components/Footer';
import Header from '../components/Header';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        dedupingInterval: 5000,
        errorRetryInterval: 5000,
      }}
    >
      <AppLayout>
        <AppLayout.Head>
          <Header />
        </AppLayout.Head>
        <AppLayout.Main>
          <Component {...pageProps} />
        </AppLayout.Main>
        <AppLayout.Footer>
          <Footer />
        </AppLayout.Footer>
      </AppLayout>
    </SWRConfig>
  );
};

export default MyApp;
