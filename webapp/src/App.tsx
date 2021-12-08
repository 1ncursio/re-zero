// import SWRDevtools, { Cache } from '@jjordy/swr-devtools';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { SWRConfig } from 'swr';
import './App.css';
import AppLayout from './components/AppLayout';
import Footer from './components/Footer';
import Header from './components/Header';
import AccountProfile from './pages/AccountProfile';
import Community from './pages/Community';
import CommunityPost from './pages/Community/CommunityPost';
import NewCommunityPost from './pages/Community/NewCommunityPost';
import Home from './pages/Home';
import OthelloAlphaZero from './pages/OthelloAlphaZero';
import OthelloMain from './pages/OthelloMain';
import PvpWaitingRoom from './pages/PvpWaitingRoom';
import Search from './pages/Search';

function App() {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        dedupingInterval: 5000,
        errorRetryInterval: 5000,
      }}
    >
      {/* {process.env.NODE_ENV === 'production' ? null : <SWRDevtools />} */}
      <AppLayout>
        <AppLayout.Head>
          <Header />
        </AppLayout.Head>
        <AppLayout.Main>
          <Switch>
            <Route exact path="/">
              {/* <Home /> */}
              <Redirect to="/othello" />
            </Route>
            <Route exact path="/othello">
              <OthelloMain />
            </Route>
            <Route exact path="/othello/pvp">
              <PvpWaitingRoom />
            </Route>
            <Route exact path="/othello/alphazero">
              <OthelloAlphaZero />
            </Route>
            <Route exact path="/community">
              <Community />
            </Route>
            <Route exact path="/community/new">
              <NewCommunityPost />
            </Route>
            <Route exact path="/community/:postId">
              <CommunityPost />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/account/profile">
              <AccountProfile />
            </Route>
          </Switch>
        </AppLayout.Main>
        <AppLayout.Footer>
          <Footer />
        </AppLayout.Footer>
      </AppLayout>
    </SWRConfig>
  );
}

export default App;
