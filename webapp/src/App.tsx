// import SWRDevtools, { Cache } from '@jjordy/swr-devtools';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SWRConfig } from 'swr';
import './App.css';
import AppLayout from './components/AppLayout';
import Header from './components/Header';
import Home from './pages/Home';
import OthelloMain from './pages/OthelloMain';
import PvpWaitingRoom from './pages/PvpWaitingRoom';

function App() {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        dedupingInterval: 5000,
        errorRetryInterval: 5000,
        // provider: () => new Cache(),
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
              <Home />
            </Route>
            <Route exact path="/othello">
              <OthelloMain />
            </Route>
            <Route exact path="/othello/pvp">
              <PvpWaitingRoom />
            </Route>
          </Switch>
        </AppLayout.Main>
      </AppLayout>
    </SWRConfig>
  );
}

export default App;
