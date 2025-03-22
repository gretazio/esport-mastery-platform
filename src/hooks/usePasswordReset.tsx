
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading
  };
}
