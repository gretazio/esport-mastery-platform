import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

interface GameData {
  id: number;
  imageUrl: string;
  replayUrl: string;
  tournament: string;
  phase: string;
  format: string;
  players: string;
  description: string;
}

const BestGames = () => {
  const { locale } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const games: GameData[] = [
    {
      id: 1,
      imageUrl: "/jf-assets/raiza.png",
      replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen8ou-781566",
      tournament: "World Cup of Pokemon 2024",
      phase: "Finals",
      format: "Gen 8 OU",
      players: "Raiza vs Luthier",
      description: locale === "it" 
        ? "Raiza, con un team particolarmente non convenzionale per la tier, riesce a sconfiggere Luthier in un match-up molto complesso. Dopo aver trovato l'occasione giusta per rimuovere Volcanion, affronta al meglio Arctozolt, uno dei Pokemon più pericolosi per il team, prima di chiudere la partita con Volcarona." 
        : "Raiza, using a highly unconventional team for the tier, manages to defeat Luthier in a very challenging match-up. After finding the right opportunity to remove Volcanion, he plays at his best against Arctozolt, one of the main threats in his own team, before securing the win with Volcarona."
    },    
    {
      id: 2,
      imageUrl: "/jf-assets/b80c9f4c-e630-41ac-951b-d00392fad22d.png",
      replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen9ou-781119?p2",
      tournament: "World Cup of Pokemon 2024",
      phase: "Finals",
      format: "Gen 9 OU",
      players: "Pais vs Oldspicemike",
      description: locale === "it" 
        ? "Pais utilizza un Sun Team e riesce a conquistare la vittoria grazie al posizionamento strategico di Tera Ground Iron Crown. Dopo aver attirato e eliminato le minacce che avrebbero potuto fermare il suo sweep, sfrutta il momento giusto per chiudere la partita con una gestione tattica impeccabile." 
        : "Pais uses a Sun Team and secures the victory through the strategic positioning of Tera Ground Iron Crown. After luring and eliminating the threats that could have stopped its sweep, he capitalizes on the perfect moment to close out the game with flawless tactical play."
    },
    {
      id: 3,
      imageUrl: "/jf-assets/prinz.png",
      replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen3ou-482366",
      tournament: "Smogon Premier League XI",
      phase: "Finals",
      format: "Gen 3 OU",
      players: "Prinz vs Tamahome",
      description: locale === "it" 
        ? "Prinz (aka. Alexander) ottiene una vittoria impressionante nelle finali della Smogon Premier League XI con una gestione difensiva impeccabile e un uso strategico delle condizioni di status. Dopo un inizio bilanciato, sfrutta al meglio Swampert per assorbire la pressione avversaria e logora gradualmente il team di Tamahome. Il momento chiave è la gestione di Tyranitar, che impone il ritmo della partita, fino alla chiusura perfetta nel late game." 
        : "Prinz (aka. Alexander) secures an impressive victory in the Smogon Premier League XI finals, showcasing impeccable defensive play and strategic use of status conditions. After a balanced early game, he maximizes Swampert's ability to absorb pressure and gradually wears down Tamahome's team. The key turning point is the smart handling of Tyranitar, which dictates the pace, leading to a flawless late-game finish."
    },    
    {
      id: 4,
      imageUrl: "/jf-assets/empo.png",
      replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen7ou-775559",
      tournament: "Smogon Tour 36",
      phase: "Finals",
      format: "Gen 7 OU",
      players: "Empo vs Vertex",
      description: locale === "it" 
        ? "Empo si assicura il terzo Smogon Tour trophy della sua carriera, un risultato mai raggiunto prima da nessun altro giocatore del sito. In una finale combattutissima contro Vertex, uno dei migliori player della scena, affronta un intenso mirror match tra Psyspam teams e riesce a imporsi con un'ottima gestione delle risorse e del momentum." 
        : "Empo secures the third Smogon Tour trophy of his career, an achievement never before accomplished by any other player on the site. In a hard-fought final against Vertex, one of the best players in the scene, he navigates an intense Psyspam mirror match and claims victory through excellent resource management and momentum control."
    },
    {
      id: 5,
      imageUrl: "/jf-assets/willoffire.png",
      replayUrl: "https://replay.pokemonshowdown.com/gen7ou-842477389",
      tournament: "Blunder Money",
      phase: "Top 16",
      format: "Gen 7 OU",
      players: "Will of Fire vs Ciele",
      description: locale === "it" 
        ? "Match di Top 16 tra Will of Fire e Ciele, uno dei giocatori più forti di sempre, vincitore di OLT e Grand Slam. La partita è stata estremamente lunga e combattuta, con Will of Fire che, nonostante uno svantaggio iniziale apparente, riesce a imporsi grazie a una gestione paziente di Mega Latias e Clefable." 
        : "Top 16 match between Will of Fire and Ciele, one of the greatest players ever, winner of both OLT and Grand Slam. The game was extremely long and hard-fought, with Will of Fire overcoming an apparent early disadvantage through patient play with Mega Latias and Clefable."
},
{
  id: 6,
  imageUrl: "/jf-assets/mada.png",
  replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen9ou-755866",
  tournament: "Smogon Premier League XV",
  phase: "Semifinals",
  format: "Gen 9 OU",
  players: "Mada vs xImRaptor",
  description: locale === "it" 
    ? "Semifinale della Smogon Premier League XV tra Mada e il suo avversario. Grazie alla sua composizione stall, Mada ottiene un vantaggio iniziale e lo sfrutta perfettamente per controllare il ritmo della partita, gestendo le risorse con attenzione fino alla vittoria." 
    : "Semifinal match of Smogon Premier League XV between Mada and his opponent. With a stall composition, Mada gains an early advantage and expertly leverages it to control the pace of the game, carefully managing resources until securing the win."
}



  ];

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
                      href={game.replayUrl} 
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
                        src={game.imageUrl} 
                        alt={`${game.tournament} - ${game.players}`} 
                        className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
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
                      {game.description}
                    </p>
                    
                    <a 
                      href={game.replayUrl} 
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
