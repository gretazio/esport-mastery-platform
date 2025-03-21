
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import PlayerCard from "./PlayerCard";
import { useLanguage } from "../contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// The members from the database have a different structure
interface MemberData {
  id: string;
  name: string;
  image: string;
  role: string;
  join_date?: string;
  achievements: string[];
}

const TopMembers = () => {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching members from Supabase...");
      
      // Added a small cache buster to prevent stale data
      const timestamp = new Date().getTime();
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name', { ascending: true })
        .limit(30) // Limit the number of members to improve performance
        .throwOnError(); // This will convert any error to an exception
      
      if (error) {
        throw error;
      }
      
      console.log("Fetched members from Supabase:", data?.length || 0);
      setMembers(data || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching members:", err);
      setError(err.message || "Failed to load members");
      setLoading(false);
      
      toast({
        title: "Error loading members",
        description: err.message || "There was a problem loading the members",
        variant: "destructive",
      });
    }
  };

  // Separate hook for initial load
  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription for changes
    const subscription = supabase
      .channel('members-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'members',
      }, () => {
        console.log('Members data changed, refreshing...');
        fetchMembers();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              {translations.topMembers}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              {translations.topMembersDescription}
            </motion.p>
          </div>
          
          <div className="space-y-12">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0 md:w-1/3">
                  <Skeleton className="w-full aspect-video rounded-md" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5 mt-4" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {translations.topMembers}
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={fetchMembers} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {translations.retry}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // If no members are found and no error occurred
  if (members.length === 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              {translations.topMembers}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto mb-8"
            >
              {translations.topMembersDescription}
            </motion.p>
            <p className="text-gray-400">
              {translations.noMembers}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            {translations.topMembers}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            {translations.topMembersDescription}
          </motion.p>
        </div>
        
        <div>
          {members.map((member) => (
            <PlayerCard
              key={member.id}
              id={member.id}
              name={member.name}
              image={member.image}
              role={member.role}
              achievements={member.achievements}
              joinDate={member.join_date}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopMembers;
