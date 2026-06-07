import React, { useState } from 'react';
import { Home } from './pages/Home';
import { OrderFlow } from './pages/OrderFlow';
import { OurStory } from './pages/OurStory';
import { Policies } from './pages/Policies';
import { Auth } from './pages/Auth';
import { Layout } from './components/Layout';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type Page = 'home' | 'order' | 'story' | 'policies' | 'auth';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [session, setSession] = useState<Session | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'order':
        return <OrderFlow onNavigate={setCurrentPage} session={session} />;
      case 'story':
        return <OurStory onNavigate={setCurrentPage} />;
      case 'policies':
        return <Policies onNavigate={setCurrentPage} />;
      case 'auth':
        return <Auth onNavigate={setCurrentPage} session={session} />;
      default:
        return <Home onNavigate={setCurrentPage} session={session} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage} 
      session={session}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
