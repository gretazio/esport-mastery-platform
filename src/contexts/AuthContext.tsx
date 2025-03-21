
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

  // Check if user is admin with caching to avoid multiple calls
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

  // Initialize auth state - refactored to avoid race conditions
  useEffect(() => {
    console.log("Setting up auth state...");
    
    // Set up auth state listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change detected:", event);

        // Handle logout or session expiry
        if (!currentSession) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          console.log("Auth state reset: no session");
          return;
        }
        
        // Update session state
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Reset loading state after update
        setLoading(false);
      }
    );
    
    // Then get current session
    const initAuth = async () => {
      try {
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
        
        // Update session state
        setSession(currentSession);
        setUser(currentSession.user);
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

  // Check admin status separately when user ID changes to avoid unnecessary calls
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
          console.log("Admin status updated:", { 
            userId: user.id, 
            isAdmin: adminStatus 
          });
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [user?.id]); // Only run when user ID changes

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
