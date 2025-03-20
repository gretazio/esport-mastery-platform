
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  checkIsAdmin: (userId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  checkIsAdmin: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is admin
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error in checkIsAdmin:", error);
      return false;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // First set up the listener for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              const isUserAdmin = await checkIsAdmin(currentSession.user.id);
              setIsAdmin(isUserAdmin);
            } else {
              setIsAdmin(false);
            }
            
            setLoading(false);
          }
        );

        // Then check existing session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          toast({
            title: "Errore di autenticazione",
            description: "Si è verificato un problema con l'autenticazione.",
            variant: "destructive",
          });
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          const isUserAdmin = await checkIsAdmin(data.session.user.id);
          setIsAdmin(isUserAdmin);
        }
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("Auth setup error:", error);
        toast({
          title: "Errore di sistema",
          description: "Si è verificato un problema durante il caricamento. Riprova più tardi.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    setupAuth();
  }, [toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Errore durante il logout",
        description: error.message || "Si è verificato un problema durante il logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signOut, checkIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
