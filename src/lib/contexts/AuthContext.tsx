"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onIdTokenChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Cookies from 'js-cookie';
import { AuthContextType } from '../hooks/useAuth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      try {
        console.log('Setting up auth state listener');
        
        // Verify auth object is available
        if (!auth) {
          throw new Error('Firebase auth is not initialized');
        }

        unsubscribe = onIdTokenChanged(auth, async (user) => {
          console.log('Auth state changed:', user ? 'User logged in' : 'No user');
          setUser(user);

          if (user) {
            try {
              // Get the ID token and store it in a cookie
              const token = await user.getIdToken();
              console.log('Got user token');
              Cookies.set('__session', token, { 
                expires: 14, // 14 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
              });
            } catch (error) {
              console.error('Error getting user token:', error);
              setError('Failed to get authentication token');
            }
          } else {
            // Remove the cookie when user is not authenticated
            Cookies.remove('__session');
          }
          setAuthLoading(false);
        });
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize authentication');
        setAuthLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('Cleaning up auth state listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      console.log('Starting Google sign in');
      
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      await signInWithPopup(auth, provider);
      console.log('Google sign in successful');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      console.log('Starting sign out');
      
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }

      await firebaseSignOut(auth);
      Cookies.remove('__session');
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, error, signInWithGoogle, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
