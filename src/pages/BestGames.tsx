
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import useDebouncedEffect from "../hooks/use-debounced-effect";

interface Game {
  id: string;
  image_url: string;
  replay_url: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  description_it: string;
  description_en: string;
}

const BestGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, translations } = useLanguage();

  // Use debounced effect to fetch games only once
  useDebouncedEffect(() => {
    const fetchGames = async () => {
      try {
        console.time("Games fetch");
        setLoading(true);
        
        const { data, error } = await supabase
          .from('best_games')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.timeEnd("Games fetch");
        
        if (error) {
          console.error("Error fetching games:", error);
          return;
        }
        
        console.log(`Fetched ${data?.length || 0} games`);
        setGames(data || []);
      } catch (error) {
        console.error("Exception fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, 300, []); // 300ms debounce, empty deps array means run once on mount

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('best_games_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'best_games'
      }, (payload) => {
        console.log('Realtime update for best_games:', payload);
        
        // Refresh the entire list when changes occur
        supabase
          .from('best_games')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) {
              console.log(`Updated games list, now ${data.length} items`);
              setGames(data);
            }
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-jf-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-4">
        <div className="container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-16 text-center"
          >
            Best <span className="text-[#D946EF]">Games</span>
          </motion.h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[#D946EF]" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">Nessuna partita disponibile al momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-black/20 rounded-lg border border-white/10 overflow-hidden flex flex-col md:flex-row"
                >
                  <div className="md:w-1/3">
                    <img 
                      src={game.image_url} 
                      alt={game.players}
                      className="w-full h-full object-cover object-center" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block px-3 py-1 bg-jf-blue/20 text-jf-blue rounded-full text-xs font-medium">
                        {game.tournament}
                      </span>
                      <span className="inline-block px-3 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-xs font-medium">
                        {game.phase}
                      </span>
                      <span className="inline-block px-3 py-1 bg-jf-purple/20 text-jf-purple rounded-full text-xs font-medium">
                        {game.format}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{game.players}</h2>
                    
                    <p className="text-gray-300 mb-6">
                      {currentLanguage === 'it' ? game.description_it : game.description_en}
                    </p>
                    
                    <a
                      href={game.replay_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-[#D946EF] text-white rounded-full hover:bg-[#D946EF]/90 transition-colors"
                    >
                      {translations.watchReplay}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BestGames;
