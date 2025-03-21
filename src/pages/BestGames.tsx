import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";
import { Loader2, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import useDebouncedEffect from "../hooks/use-debounced-effect";
import { Button } from "@/components/ui/button";
import { normalizeImageUrl } from "../utils/imageUtils";

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
  const { locale, translations } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-jf-dark text-white relative">
      <Navbar />
    
      <div className="pt-32 pb-24 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Best <span className="text-[#D946EF]">Games</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {locale === "it" 
                ? "Una selezione dei migliori match giocati dai Membri della Community nei tornei competitivi." 
                : "A selection of the best matches played by Community Members in competitive tournaments."}
            </p>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {locale === "it" 
                ? "Work in progress" 
                : "Work in progress"}
            </p>  
          </motion.div>

          {loading ? null : games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                {locale === "it" ? "Nessuna partita disponibile al momento." : "No games available at the moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-24">
              {games.map((game, index) => (
                <motion.div 
                  key={game.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                >
                  {/* Game Screenshot */}
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#D946EF]/20 rounded-xl blur-xl z-0 opacity-70"></div>
                      <a 
                        href={game.replay_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative block z-10 overflow-hidden rounded-xl border border-white/10"
                      >
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-[#D946EF] rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform">
                            <ExternalLink size={28} />
                          </div>
                        </div>
                        <img 
                          src={normalizeImageUrl(game.image_url)} 
                          alt={`${game.tournament} - ${game.players}`} 
                          className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Failed to load image: ${game.image_url}`);
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="lg:w-1/2">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-block px-3 py-1 bg-jf-blue/20 text-jf-blue rounded-full text-sm font-medium">
                          {game.tournament}
                        </span>
                        <span className="inline-block px-3 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-sm font-medium">
                          {game.phase}
                        </span>
                        <span className="inline-block px-3 py-1 bg-jf-purple/20 text-jf-purple rounded-full text-sm font-medium">
                          {game.format}
                        </span>
                      </div>
                      
                      <h2 className="text-3xl font-display font-bold">
                        {game.players}
                      </h2>
                      
                      <p className="text-lg text-gray-300">
                        {locale === 'it' ? game.description_it : game.description_en}
                      </p>
                      
                      <a 
                        href={game.replay_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#D946EF] hover:text-[#D946EF]/80 transition-colors mt-4"
                      >
                        {locale === "it" ? "Guarda il replay" : "Watch replay"} 
                        <ExternalLink size={18} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Always show both buttons */}
        <Button 
          onClick={scrollToTop}
          className="rounded-full w-12 h-12 bg-[#D946EF] hover:bg-[#D946EF]/90 shadow-lg"
          size="icon"
          aria-label="Torna all'inizio"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>

        <Button 
          onClick={scrollToFooter}
          className="rounded-full w-12 h-12 bg-[#D946EF] hover:bg-[#D946EF]/90 shadow-lg"
          size="icon"
          aria-label="Vai al fondo"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
      
      <footer ref={footerRef}>
        <Footer />
      </footer>
    </div>
  );
};

export default BestGames;
