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
  const [history, setHistory] = useState<Page[]>([]);
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

  const handleNavigate = (page: Page) => {
    setHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevPage = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'order':
        return <OrderFlow onNavigate={handleNavigate} onGoBack={handleGoBack} session={session} />;
      case 'story':
        return <OurStory onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case 'policies':
        return <Policies onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case 'auth':
        return <Auth onNavigate={handleNavigate} session={session} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={handleNavigate} 
      session={session}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
