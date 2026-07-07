import React, { useEffect, useState } from 'react';
import type { Page } from '../App';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Package, MapPin, Phone, LogOut, ArrowRight } from 'lucide-react';
import './Pages.css';

interface Props {
  onNavigate: (page: Page) => void;
  session: Session | null;
}

interface Profile {
  full_name: string;
  phone_number: string;
  delivery_address: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  delivery_method: string;
  payment_method: string;
  items: any[];
  checkout_details: any;
}

export const Account: React.FC<Props> = ({ onNavigate, session }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      onNavigate('auth');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, onNavigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return '#B55A44'; // Accent
      case 'preparing': return '#D4A373'; // Warm gold
      case 'ready': return '#798B73'; // Sage
      case 'out for delivery': return '#798B73';
      case 'completed': return '#2C1E16'; // Main text
      case 'cancelled': return '#6B5E55'; // Muted
      default: return '#B55A44';
    }
  };

  if (loading) {
    return (
      <div className="page-shell flex-center min-h-[50vh]" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="font-sans" style={{ color: 'var(--color-text-muted)' }}>Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-transition">
      <article className="page-body">
        <header className="story-header" style={{ marginBottom: 'var(--space-2xl)' }}>
          <span className="page-ornament">✦</span>
          <h1 className="page-heading text-serif">My Account</h1>
          <p className="page-subheading">Manage your profile and track orders.</p>
        </header>

        <div className="account-layout" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
          
          {/* Profile Section */}
          <section className="profile-section" style={{ background: 'var(--color-bg)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.5rem' }}>Details</h3>
              <button onClick={handleSignOut} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: 'var(--space-sm)', color: 'var(--color-text-muted)' }} className="font-sans">
              <p><strong>Email:</strong> {session?.user.email}</p>
              {profile?.full_name && <p><strong>Name:</strong> {profile.full_name}</p>}
              {profile?.phone_number && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> {profile.phone_number}
                </p>
              )}
              {profile?.delivery_address && (
                <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} style={{ marginTop: '4px' }} /> {profile.delivery_address}
                </p>
              )}
            </div>
          </section>

          {/* Orders Section */}
          <section className="orders-section">
            <h3 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Package size={24} color="var(--color-accent)" /> Order History
            </h3>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <p className="font-sans" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>You haven't placed any orders yet.</p>
                <button className="btn-primary" onClick={() => onNavigate('order')}>Order Now</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {orders.map(order => {
                  const date = new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  
                  return (
                    <div key={order.id} style={{ background: 'var(--color-surface)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <p className="font-sans" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Order #{order.id.split('-')[0]}</p>
                          <p className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{date}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            display: 'inline-block', 
                            padding: '4px 12px', 
                            borderRadius: '100px', 
                            fontSize: '0.8rem', 
                            fontWeight: 600, 
                            backgroundColor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            marginBottom: '8px'
                          }} className="font-sans">
                            {order.status.toUpperCase()}
                          </span>
                          <p className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 600 }}>₹{order.total_amount}</p>
                        </div>
                      </div>
                      
                      <div className="font-sans" style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                        <p style={{ marginBottom: '8px' }}>
                          <strong>{itemCount} {itemCount === 1 ? 'item' : 'items'}</strong> • {order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'} on {order.checkout_details?.date} at {order.checkout_details?.time}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text-muted)' }}>
                          {order.items.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ArrowRight size={14} color="var(--color-accent)" />
                              {item.orderType === 'bestseller' ? item.bestseller?.name : `Custom Cake (${item.base?.name})`}
                              {item.quantity > 1 && ` x${item.quantity}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </article>
    </div>
  );
};
