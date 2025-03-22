
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
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

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
      setFormSubmitting(true);
      
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
        
        // Short delay to ensure session is set up
        setTimeout(() => {
          navigate('/admin');
        }, 500);
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
      setFormSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Errore",
        description: "Per favore inserisci la tua email",
        variant: "destructive",
      });
      return;
    }

    try {
      setResetSubmitting(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Richiesta inviata",
        description: "Ti abbiamo inviato un'email con le istruzioni per reimpostare la password",
      });
      
      // Clear form
      setResetEmail("");
      
      // Switch back to login tab
      setActiveTab("login");
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'invio dell'email",
        variant: "destructive",
      });
    } finally {
      setResetSubmitting(false);
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
              Accedi al Portale
            </h1>
            
            <Tabs 
              defaultValue="login" 
              className="w-full" 
              value={activeTab} 
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="reset">Reset Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
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
                      disabled={formSubmitting}
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
                      disabled={formSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
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
                    disabled={formSubmitting}
                  >
                    {isSignUp 
                      ? "Hai già un account? Accedi" 
                      : "Non hai un account? Registrati"}
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="reset">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="La tua email registrata"
                      className="bg-black/50 border-white/20"
                      disabled={resetSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90"
                    disabled={resetSubmitting}
                  >
                    {resetSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Invia link di reset
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-400 mt-4">
                    Riceverai un'email con le istruzioni per reimpostare la password se l'indirizzo email esiste nel nostro sistema.
                  </p>
                </form>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setActiveTab("login")}
                    className="text-[#D946EF] hover:underline text-sm"
                  >
                    Torna al login
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
