import React, { useState } from 'react';
import type { Page } from '../App';
import { ArrowLeft, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './Pages.css';

interface Props {
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

interface PolicySection {
  q: string;
  content: React.ReactNode;
}

const PolicyContent: React.FC = () => {
  const sections: PolicySection[] = [
    {
      q: 'Lead Time & Order Hours',
      content: (
        <>
          <p>Orders may be placed at any time through our website. However, please note the following:</p>
          <ul>
            <li>All orders must be placed a <strong>minimum of 3 hours</strong> before the desired pickup or delivery time.</li>
            <li>Orders are fulfilled (available for pickup or delivery) only between <strong>9:00 AM and 9:00 PM</strong>, seven days a week.</li>
            <li>Orders placed after <strong>6:00 PM</strong> will be baked and fulfilled the following day.</li>
            <li>Preparation time varies depending on the level of customisation and the number of pieces ordered. We do not guarantee a fixed preparation duration for any order.</li>
          </ul>
        </>
      )
    },
    {
      q: 'Shipping & Delivery',
      content: (
        <>
          <p>We offer local delivery as well as self-pickup from our kitchen. Please review the following terms:</p>
          <ul>
            <li>Deliveries are carried out only between <strong>9:00 AM and 9:00 PM</strong>.</li>
            <li>You may indicate a preferred delivery time when placing your order. While we make every reasonable effort to deliver around the requested time, <strong>delivery times are approximate and not guaranteed</strong>.</li>
            <li>Self-pickup is available during the same operating hours and is recommended for delicate or multi-tier orders.</li>
            <li>A flat delivery fee applies to all delivery orders and is displayed at checkout.</li>
            <li>We currently deliver within a limited local area. If your delivery address falls outside our serviceable zone, we will notify you and arrange an alternative (pickup or cancellation with refund).</li>
          </ul>
          <p>Breads & Bonds is not liable for any damage to the product that occurs after handover to the customer or a third-party delivery partner.</p>
        </>
      )
    },
    {
      q: 'Cancellation & Refund Policy',
      content: (
        <>
          <p>As all our products are baked fresh to order, the following cancellation and refund terms apply:</p>
          <ul>
            <li><strong>Customer-initiated cancellations:</strong> Cancellations requested before preparation has begun will receive a full refund. Once baking has commenced, cancellations cannot be accommodated.</li>
            <li><strong>Business-initiated cancellations:</strong> In the event that we are unable to fulfil your order (e.g., due to unforeseen circumstances such as being out of town, ingredient unavailability, or operational constraints), we will cancel the order and issue a <strong>full refund</strong> of the amount paid.</li>
            <li><strong>Perishable goods:</strong> Due to the perishable nature of baked goods, returns and exchanges are not accepted once the product has been delivered or picked up.</li>
            <li><strong>Damaged deliveries:</strong> If your order arrives visibly damaged due to mishandling during delivery, please contact us with photographic evidence within 30 minutes of receiving the order. We will review the claim and, at our discretion, offer a replacement or a refund.</li>
          </ul>
          <p>Refunds, where applicable, will be processed within 5–7 business days to the original payment method.</p>
        </>
      )
    },
    {
      q: 'Payment',
      content: (
        <>
          <p>We offer multiple payment options for your convenience:</p>
          <ul>
            <li><strong>Online Payment:</strong> Payments can be made securely through Razorpay, which supports UPI, debit cards, credit cards, and net banking.</li>
            <li><strong>UPI Direct:</strong> You may also pay directly via UPI using the details provided at checkout.</li>
            <li><strong>Cash on Delivery:</strong> Available for select orders at our discretion. Full payment is required upon delivery or pickup.</li>
          </ul>
          <p>Your order is confirmed only upon successful receipt of payment. For Cash on Delivery orders, confirmation is subject to availability and approval.</p>
        </>
      )
    },
    {
      q: 'Privacy Policy',
      content: (
        <>
          <p>Breads & Bonds respects your privacy and is committed to protecting the personal information you share with us.</p>
          <ul>
            <li><strong>Information we collect:</strong> When you place an order, we collect your name, phone number, delivery address, and payment details solely for the purpose of order fulfilment and communication.</li>
            <li><strong>How we use your information:</strong> Your personal data is used exclusively to process your orders, coordinate delivery or pickup, and send order-related updates (primarily via WhatsApp).</li>
            <li><strong>Data sharing:</strong> We do not sell, rent, or share your personal information with third parties, except as necessary to process payments (e.g., Razorpay) or fulfil deliveries.</li>
            <li><strong>Data retention:</strong> We retain order information for a reasonable period to handle any post-delivery queries, after which it is securely deleted.</li>
            <li><strong>Cookies:</strong> Our website may use essential cookies for authentication and session management. No tracking or advertising cookies are used.</li>
          </ul>
          <p>By using our website and placing an order, you consent to the collection and use of your information as described above.</p>
        </>
      )
    },
    {
      q: 'Terms & Conditions',
      content: (
        <>
          <p>By placing an order with Breads & Bonds, you agree to the following terms:</p>
          <ul>
            <li>All products are freshly baked to order. Slight variations in appearance, texture, or colour from product images are natural and do not constitute a defect.</li>
            <li>Customers are responsible for providing accurate delivery details and contact information. We are not liable for failed deliveries caused by incorrect or incomplete information.</li>
            <li>Breads & Bonds reserves the right to cancel or refuse any order at our sole discretion, including but not limited to situations where we are unavailable, ingredients are out of stock, or the order cannot be fulfilled within the requested timeframe. In such cases, a full refund will be issued.</li>
            <li>Prices listed on the website are inclusive of applicable taxes unless stated otherwise. Delivery charges, if any, are displayed separately at checkout.</li>
            <li>Any allergies or dietary restrictions must be communicated at the time of placing the order in the special requests field. While we take precautions, our kitchen handles common allergens (wheat, dairy, nuts) and cross-contamination cannot be entirely ruled out.</li>
            <li>We are not liable for any adverse reactions resulting from undisclosed allergies or sensitivities.</li>
            <li>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in our local jurisdiction.</li>
          </ul>
          <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Last updated: July 2026. We reserve the right to update these policies at any time. Continued use of the website constitutes acceptance of the revised terms.
          </p>
        </>
      )
    },
  ];

  return <>{sections.map((s, i) => <SectionItem key={i} section={s} index={i} />)}</>;
};

const SectionItem: React.FC<{ section: PolicySection; index: number }> = ({ section, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-serif">{section.q}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="faq-answer animate-fade-in">
          {section.content}
        </div>
      )}
    </div>
  );
};

export const Policies: React.FC<Props> = ({ onGoBack }) => {
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
          <h1 className="page-heading text-serif">Policies & Contact</h1>
          <p className="page-subheading">Everything you need to know before ordering.</p>
        </header>

        <div className="faq-list">
          <PolicyContent />
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
