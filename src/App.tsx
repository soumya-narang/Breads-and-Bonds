import { useState } from 'react';
import { Home } from './pages/Home';
import { OrderFlow } from './pages/OrderFlow';
import { OurStory } from './pages/OurStory';
import { Policies } from './pages/Policies';

export type Page = 'home' | 'order' | 'story' | 'policies';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'order':
        return <OrderFlow onNavigate={setCurrentPage} />;
      case 'story':
        return <OurStory onNavigate={setCurrentPage} />;
      case 'policies':
        return <Policies onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {renderPage()}
    </div>
  );
}

export default App;
