import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth() {
  return useContext(AuthContext);
}