
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gestione autenticazione
    const setupAuth = async () => {
      // Prima imposta il listener per i cambiamenti di stato
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            // Controlla se l'utente è un admin
            const { data } = await supabase
              .from('admins')
              .select('*')
              .eq('id', currentSession.user.id)
              .eq('is_active', true)
              .single();
            
            setIsAdmin(!!data);
          } else {
            setIsAdmin(false);
          }
          
          setLoading(false);
        }
      );

      // Poi controlla la sessione esistente
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        // Controlla se l'utente è un admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('id', data.session.user.id)
          .eq('is_active', true)
          .single();
        
        setIsAdmin(!!adminData);
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
