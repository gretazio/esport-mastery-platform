
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
    fetch: function customFetch(url, options) {
      // Add custom fetch handling for debugging if needed
      return fetch(url, options);
    }
  }
});
