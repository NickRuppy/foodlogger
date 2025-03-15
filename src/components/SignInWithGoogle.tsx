"use client";

import { useAuth } from '../lib/hooks/useAuth';
import Image from 'next/image';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      <Image
        src="/google.svg"
        alt="Google Logo"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
}
