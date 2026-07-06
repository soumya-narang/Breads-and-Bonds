import React from 'react';
import type { Page } from '../App';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { HandDrawnFrame } from '../components/HandDrawnIcons';
import './Pages.css';

interface Props {
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

export const OurStory: React.FC<Props> = ({ onGoBack }) => {
  return (
    <div className="page-shell page-transition">
      <div className="page-header">
        <button className="back-link" onClick={onGoBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <article className="page-body">
        <header className="story-header">
          <span className="page-ornament">✦</span>
          <h1 className="page-heading text-serif">Our Story</h1>
          <p className="page-subheading">A kitchen, a dream, and a whole lot of flour.</p>
        </header>

        <div className="story-layout">
          <div className="story-collage-wrapper">
            <img src={`${import.meta.env.BASE_URL}cakes-collage.jpg`} alt="Our handmade cakes" className="story-collage" />
            <div className="collage-frame-overlay">
              <HandDrawnFrame strokeWidth={3} />
            </div>
          </div>

          <div className="story-text">
            <p className="story-drop-cap">
              Every loaf, every cake, and every sweet memory created at Breads & Bonds starts with a simple philosophy: baking is a language of love. What began in a small home kitchen as a passion for feeding family has blossomed into a cherished neighborhood treasure.
            </p>

            <h3 className="text-serif story-section-title">The Process</h3>
            <p>
              We believe in the slow art of baking. No shortcuts, no artificial enhancers — just honest ingredients, hand-kneaded and baked to perfection. Our recipes have been passed down and refined over years, carrying the warmth of tradition in every bite.
            </p>

            <h3 className="text-serif story-section-title">Why Eggless?</h3>
            <p>
              All our cakes are 100% eggless. We've spent years perfecting our recipes so that no one has to compromise on taste or texture. The result? Cakes that are moist, fluffy, and absolutely delicious — without a single egg.
            </p>

            <h3 className="text-serif story-section-title">A Bond, Not a Transaction</h3>
            <p>
              When you order from us, you're not just getting a dessert; you're becoming part of our extended family. Each order is baked with the same care we put into feeding our own loved ones. Thank you for letting us be a small part of your celebrations.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
