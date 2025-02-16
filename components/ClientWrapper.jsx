'use client';

import { createContext, useContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext(null);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export default function ClientWrapper({ children }) {
  const [supabase] = useState(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
