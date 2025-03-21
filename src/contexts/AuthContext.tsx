
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
    if (!userId) {
      console.log("No user ID provided to checkIsAdmin");
      return false;
    }
    
    try {
      console.log("Checking admin status for user ID:", userId);
      
      // Get admin record
      const { data, error } = await supabase
        .from('admins')
        .select('is_active')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      const isUserAdmin = data?.is_active === true;
      console.log("Admin check result:", isUserAdmin, data);
      
      return isUserAdmin;
    } catch (error) {
      console.error("Exception in checkIsAdmin:", error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change detected:", event);
        
        if (!currentSession) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          console.log("Auth state reset: no session");
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Only check admin status if we have a user
        if (currentSession.user) {
          try {
            const adminStatus = await checkIsAdmin(currentSession.user.id);
            setIsAdmin(adminStatus);
            console.log("Auth state updated:", { 
              userId: currentSession.user.id, 
              isAdmin: adminStatus 
            });
          } catch (error) {
            console.error("Error checking admin status during auth change:", error);
            setIsAdmin(false);
          }
        }
        
        setLoading(false);
      }
    );
    
    // Then check current session
    const initAuth = async () => {
      try {
        setLoading(true);
        console.log("Initializing auth...");
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        if (!currentSession) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          console.log("Auth state reset: no session");
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Only check admin status if we have a user
        if (currentSession.user) {
          try {
            const adminStatus = await checkIsAdmin(currentSession.user.id);
            setIsAdmin(adminStatus);
            console.log("Auth state updated:", { 
              userId: currentSession.user.id, 
              isAdmin: adminStatus 
            });
          } catch (error) {
            console.error("Error checking admin status during init:", error);
            setIsAdmin(false);
          }
        }
      } catch (error: any) {
        console.error("Auth initialization error:", error);
        toast({
          title: "Errore di autenticazione",
          description: "Si è verificato un problema durante l'inizializzazione dell'autenticazione.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo."
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Errore durante il logout",
        description: error.message || "Si è verificato un problema durante il logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signOut, checkIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
