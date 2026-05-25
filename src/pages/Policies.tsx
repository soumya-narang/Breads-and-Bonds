import React, { useState } from 'react';
import type { Page } from '../App';
import { ArrowLeft, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './Pages.css';

interface Props {
  onNavigate: (page: Page) => void;
}

const faqs = [
  {
    q: 'Lead Time',
    a: 'Since every item is baked fresh to order, we require a minimum of 24 hours notice for all orders. For custom cakes or large orders, please allow 48 hours so we can give your creation the attention it deserves.'
  },
  {
    q: 'Delivery',
    a: 'We offer localized delivery within a 10 km radius of our kitchen. Self pick-up is always welcome and encouraged — it\'s the safest way to transport your delicate desserts!'
  },
  {
    q: 'Cancellations',
    a: 'Cancellations must be made at least 24 hours before your scheduled delivery or pickup time for a full refund. Since we bake everything fresh, last-minute cancellations cannot be accommodated.'
  },
  {
    q: 'Payment',
    a: 'We accept all major UPI apps and direct bank transfers. Payment must be completed to confirm your order. You\'ll receive payment details after order confirmation via WhatsApp.'
  },
];

export const Policies: React.FC<Props> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="page-shell page-transition">
      <div className="page-header">
        <button className="back-link" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} />
          <span>Back to Menu</span>
        </button>
      </div>

      <article className="page-body">
        <header className="story-header">
          <span className="page-ornament">✦</span>
          <h1 className="page-heading text-serif">Policies & Contact</h1>
          <p className="page-subheading">Everything you need to know before ordering.</p>
        </header>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIndex === i ? 'faq-open' : ''}`}
            >
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <h3 className="text-serif">{faq.q}</h3>
                {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openIndex === i && (
                <div className="faq-answer animate-fade-in">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-block">
          <h3 className="text-serif contact-heading">Get in Touch</h3>
          <p className="contact-subtitle">We'd love to hear from you. Reach out anytime.</p>
          <div className="contact-actions">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="btn-primary flex-center gap-sm">
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary flex-center gap-sm">
              Instagram
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};
