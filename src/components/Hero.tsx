import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  
  const scrollToCommunity = () => {
    document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlayers = () => {
    document.getElementById('top-players')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 md:px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D946EF]/10 to-transparent z-0"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#D946EF]/5 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-jf-purple/10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo display at the top */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="/assetsupload/0960f71e-449c-4316-b652-9cff4011d4f4.png" 
              alt="Judgment Fleet Logo" 
              className="h-auto max-h-64 w-auto max-w-xs mx-auto"
            />
          </motion.div>
          
          <span className="inline-block px-3 py-1 bg-[#D946EF]/20 text-[#D946EF] rounded-full text-sm font-medium mb-4">
            {translations.italianCompetitiveSmogon}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
            Judgment <span className="text-[#D946EF]">Fleet</span>
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button 
              size="lg" 
              className="px-6 py-6 bg-jf-purple hover:bg-jf-purple/90"
              onClick={scrollToCommunity}
            >
              {translations.discoverMore}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              className="px-6 py-6 bg-[#D946EF] hover:bg-[#D946EF]/90"
              onClick={scrollToPlayers}
            >
              Hall of Fame
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              className="px-6 py-6 bg-jf-blue hover:bg-jf-blue/90"
              onClick={() => {
                navigate('/best-games');
              }}
            >
              Best Games
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-jf-dark/80 to-transparent z-0"></div>
    </section>
  );
};

export default Hero;
