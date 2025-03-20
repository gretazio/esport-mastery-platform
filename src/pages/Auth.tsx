
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Controlla se l'utente è già autenticato
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session) {
          navigate('/admin');
        }
        setSessionChecked(true);
      } catch (error: any) {
        console.error("Error checking session:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un problema nel controllo della sessione",
          variant: "destructive",
        });
        setSessionChecked(true);
      }
    };
    
    checkSession();
    
    // Ascolta i cambiamenti di stato dell'autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/admin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Per favore inserisci email e password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isSignUp) {
        // Registrazione nuovo utente
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Registrazione inviata",
          description: "Controlla la tua email per confermare la registrazione",
        });
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Il redirect avverrà automaticamente grazie all'event listener
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Errore di autenticazione",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading if we're still checking the session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-jf-dark text-white flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
        <p className="mt-4">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jf-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black/40 p-8 rounded-lg border border-white/10 backdrop-blur-sm"
          >
            <h1 className="text-3xl font-display font-bold mb-6 text-center">
              {isSignUp ? "Registrazione Account" : "Login Account"}
            </h1>
            
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-black/50 border-white/20"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="bg-black/50 border-white/20"
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Caricamento...
                  </>
                ) : isSignUp ? "Registra" : "Accedi"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#D946EF] hover:underline text-sm"
                disabled={loading}
              >
                {isSignUp 
                  ? "Hai già un account? Accedi" 
                  : "Non hai un account? Registrati"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
