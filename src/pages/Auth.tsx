import React, { useState } from 'react';
import type { Page } from '../App';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import './Auth.css';
import './Pages.css'; // For shared layout like page-header, back-link

interface AuthProps {
  onNavigate: (page: Page) => void;
  session?: Session | null;
}

export const Auth: React.FC<AuthProps> = ({ onNavigate, session }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // If already logged in, redirect immediately to order flow
  React.useEffect(() => {
    if (session) {
      onNavigate('order');
    }
  }, [session, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // ====================================================================
        // LOGIN FLOW
        // ====================================================================
        // We use Supabase's signInWithPassword method to authenticate the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        // If authentication fails, throw the error to be caught by the catch block below
        if (signInError) throw signInError;
        
        // Successful login: Proceed to the order page
        onNavigate('order');
      } else {
        // ====================================================================
        // SIGN-UP FLOW
        // ====================================================================
        // 1. Register the new user using Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        const user = signUpData.user;
        
        // 2. Automatically create a record in the 'profiles' table
        // We do this immediately after signup because our schema requires a matching profile
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id, // Linking the public profile directly to the secure auth user ID
              full_name: fullName,
              phone_number: phoneNumber,
              delivery_address: deliveryAddress
            });
            
          // If profile creation fails, throw the error to be caught and displayed
          if (profileError) throw profileError;
        }
        
        // Successful sign-up & profile creation: Proceed to the order page
        onNavigate('order');
      }
    } catch (err: any) {
      // Catch and elegantly display any Supabase errors (e.g., "Email already registered")
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      // Stop the loading indicator regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="page-shell page-transition auth-page">

      <div className="page-body auth-body">
        <div className="auth-container">
          <header className="auth-header">
            <h1 className="page-heading text-serif">
              {isLogin ? 'Welcome Back' : 'Join Our Family'}
            </h1>
            <p className="page-subheading auth-subheading">
              {isLogin
                ? 'Sign in to place your next order.'
                : 'Create an account for seamless ordering.'}
            </p>
          </header>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deliveryAddress">Delivery Address</label>
                  <textarea
                    id="deliveryAddress"
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn text-serif"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="auth-toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
                type="button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
