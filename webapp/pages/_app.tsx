import React from 'react';
import { SWRConfig } from 'swr';
import AppLayout from '../components/AppLayout';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
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
          {/* <Switch>
            <Route exact path="/">
              <Redirect to="/reversi" />
            </Route>
            <Route exact path="/community/:postId">
              <CommunityPost />
            </Route>
          </Switch> */}
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
