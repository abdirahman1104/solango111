'use client';

import { SupabaseProvider } from './supabase-provider';

export function Providers({ children }) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}
