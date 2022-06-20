import React from 'react';
import AppLayout from '../components/AppLayout';
import Footer from '../components/Footer';
import Header from '../components/Header';

function App() {
  // {/* {process.env.NODE_ENV === 'production' ? null : <SWRDevtools />} */}
  return (
    <AppLayout>
      <AppLayout.Head>
        <Header />
      </AppLayout.Head>
      <AppLayout.Main>Main Page</AppLayout.Main>
      <AppLayout.Footer>
        <Footer />
      </AppLayout.Footer>
    </AppLayout>
  );
}

export default App;
