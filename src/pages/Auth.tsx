
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
import { useAuth } from "../contexts/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User already authenticated, redirecting to admin");
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

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
        // Registration
        console.log("Attempting to register:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
          toast({
            title: "Utente già registrato",
            description: "Un account con questa email esiste già. Prova ad accedere.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registrazione inviata",
            description: "Controlla la tua email per confermare la registrazione",
          });
        }
      } else {
        // Login
        console.log("Attempting to login:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        console.log("Login successful, data:", data.user?.id);
        toast({
          title: "Login effettuato",
          description: "Hai effettuato l'accesso con successo",
        });
        
        navigate('/admin');
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = "Si è verificato un errore durante l'autenticazione";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenziali non valide. Controlla email e password.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email non confermata. Controlla la tua email per il link di conferma.";
      }
      
      toast({
        title: "Errore di autenticazione",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-jf-dark text-white flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
        <p className="mt-4">Verifica autenticazione...</p>
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
