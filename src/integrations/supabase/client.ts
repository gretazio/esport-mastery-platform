
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vpvwihuhltoqgzvrdkir.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdndpaHVobHRvcWd6dnJka2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0ODE3NjAsImV4cCI6MjA1ODA1Nzc2MH0.rRWslXLaXubMYTYeih-2cwexiSIFsQATpfU13BN1Mig";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    fetch: function customFetch(url, options) {
      // Add timestamp to bust cache for auth-related requests
      const isAuthRequest = url.toString().includes('/auth/');
      const urlWithParam = isAuthRequest 
        ? new URL(url.toString())
        : url;
      
      if (isAuthRequest && urlWithParam instanceof URL) {
        urlWithParam.searchParams.set('_t', Date.now().toString());
        return fetch(urlWithParam, options);
      }
      
      return fetch(url, options);
    }
  }
});
