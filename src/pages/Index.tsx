import { useState, useEffect, useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Community from "../components/Community";
import TopMembers from "../components/TopMembers";
import Footer from "../components/Footer";
import JudgmentFleetBanner from "../components/JudgmentFleetBanner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [showFooterButton, setShowFooterButton] = useState(false);
  const location = useLocation();
  const membersRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
      if (membersRef.current) {
        const membersSectionTop = membersRef.current.getBoundingClientRect().top;
        const membersSectionBottom = membersRef.current.getBoundingClientRect().bottom;
        setShowFooterButton(membersSectionTop <= 100 && membersSectionBottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Separare la logica di scroll reset dalla gestione della navigazione
    if (!location.state?.scrollTo && initialLoad) {
      // Se non c'è uno stato di navigazione e siamo nel caricamento iniziale
      // (incluso il refresh), resetta sempre alla cima
      window.scrollTo(0, 0);
      window.history.replaceState(null, '', '/');
      setInitialLoad(false);
    } else if (location.state?.scrollTo && initialLoad) {
      // Se c'è uno stato di navigazione, gestiscilo solo durante il caricamento iniziale
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
        if (location.state.scrollTo !== 'top') {
          window.history.replaceState(null, '', `/#${location.state.scrollTo}`);
        }
      }
      setInitialLoad(false);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location, initialLoad]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    // Update URL without reloading the page
    window.history.replaceState(null, '', '/');
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
      // Update URL without reloading the page
      window.history.replaceState(null, '', '/#resources');
    }
  };

  return (
    <div className="min-h-screen bg-jf-dark text-white relative">
      <Navbar />
      <JudgmentFleetBanner />
      <main>
        <div id="top">
          <Hero />
        </div>
        <div id="community" ref={communityRef}>
          <Community />
        </div>
        <div ref={membersRef} id="top-players">
          <TopMembers />
        </div>
      </main>
      <footer ref={footerRef} id="resources">
        <Footer />
      </footer>
      
      {/* Navigation buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* To top button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: visible ? 1 : 0, 
            scale: visible ? 1 : 0.9,
            y: visible ? 0 : 10 
          }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 bg-[#D946EF] hover:bg-[#D946EF]/90 shadow-lg"
            size="icon"
            aria-label="Torna all'inizio"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
        
        {/* To footer button - only shows when in Players section */}
        {showFooterButton && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              onClick={scrollToFooter}
              className="rounded-full w-12 h-12 bg-[#D946EF] hover:bg-[#D946EF]/90 shadow-lg"
              size="icon"
              aria-label="Vai alle risorse"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
