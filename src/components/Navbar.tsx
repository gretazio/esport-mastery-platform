
import { useState, useEffect } from "react";
import { Menu, X, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { isAdmin } = useAuth();
  
  // Determina il pathname e hash attuali
  const currentPath = location.pathname;
  const currentHash = location.hash.replace('#', '');
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Gestione dello scroll per gli hash URLs sulla homepage
  useEffect(() => {
    // Se siamo sulla homepage e c'è un hash nell'URL
    if (currentPath === '/' && location.hash) {
      const targetId = location.hash.replace('#', '');
      // Piccolo delay per assicurarsi che i componenti siano montati
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentPath, location.hash]);

  const scrollToSection = async (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    if (currentPath !== "/") {
      // Se non siamo sulla homepage, naviga ad essa e indica di scorrere a questa sezione
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    // Piccolo delay per permettere al menu mobile di chiudersi
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Determina se un link è attivo
  const isActive = (path: string | undefined, hash: string | undefined) => {
    if (path) {
      return currentPath === path;
    }
    if (hash) {
      // Se siamo sulla homepage, controlla l'hash
      if (currentPath === '/') {
        // Se non c'è hash nell'URL e l'hash da controllare è 'top', consideralo attivo
        if (!location.hash && hash === 'top') return true;
        // Altrimenti, confronta con l'hash attuale
        return currentHash === hash;
      }
    }
    return false;
  };

  const navLinks = [
    { name: translations.home, href: "top" },
    { name: translations.community, href: "community" },
    { name: translations.players, href: "top-players" },
    { name: translations.resources, href: "resources" },
    { name: translations.bestGames, path: "/best-games" },
    { name: translations.faq, path: "/faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-jf-dark/80 backdrop-blur-md border-b border-white/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center">
          {/* Logo - left */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={(e) => {
                if (currentPath === '/') {
                  e.preventDefault();
                  const element = document.getElementById('top');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.history.replaceState(null, '', '/');
                  }
                }
              }}
            >
              <span className="text-2xl font-display font-bold text-white">
                Judgment<span className="text-[#D946EF]">Fleet</span>
              </span>
            </Link>
          </div>

          {/* Navigation - center */}
          <nav className="hidden md:flex items-center justify-center flex-grow ml-auto">
            <div className="max-w-4xl flex items-center gap-20">
              {navLinks.map((link) => (
                link.path ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative transition-colors text-gray-300 hover:text-white group"
                    onClick={(e) => {
                      if (link.path === currentPath) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {link.name}
                    {isActive(link.path, undefined) && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D946EF]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    className="relative transition-colors text-gray-300 hover:text-white group"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                  >
                    {link.name}
                    {isActive(undefined, link.href) && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D946EF]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </a>
                )
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="relative transition-colors text-gray-300 hover:text-white group"
                >
                  Admin
                  {isActive("/admin", undefined) && (
                    <motion.div
                      layoutId="navbar-underline-admin"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#D946EF]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )}
            </div>
          </nav>

          {/* Buttons - right */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <LanguageSelector />
            <Button 
              className="bg-[#D946EF] hover:bg-[#D946EF]/90"
              onClick={() => window.open('https://twitter.com/JudgmentFleet', '_blank')}
            >
              <Twitter size={18} className="mr-2" />
              {translations.followOnTwitter}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            <LanguageSelector />
            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-jf-gray border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                link.path ? (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-2 transition-colors relative ${
                      isActive(link.path, undefined) 
                        ? "text-[#D946EF] font-medium" 
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e) => {
                      if (link.path === currentPath) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.name}
                    {isActive(link.path, undefined) && (
                      <div className="absolute -bottom-1 left-0 w-1/4 h-0.5 bg-[#D946EF]" />
                    )}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    className={`py-2 transition-colors relative ${
                      isActive(undefined, link.href)
                        ? "text-[#D946EF] font-medium"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                  >
                    {link.name}
                    {isActive(undefined, link.href) && (
                      <div className="absolute -bottom-1 left-0 w-1/4 h-0.5 bg-[#D946EF]" />
                    )}
                  </a>
                )
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`py-2 transition-colors relative ${
                    isActive("/admin", undefined) 
                      ? "text-[#D946EF] font-medium" 
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                  {isActive("/admin", undefined) && (
                    <div className="absolute -bottom-1 left-0 w-1/4 h-0.5 bg-[#D946EF]" />
                  )}
                </Link>
              )}
              <Button 
                className="bg-[#D946EF] hover:bg-[#D946EF]/90 w-full"
                onClick={() => window.open('https://twitter.com/JudgmentFleet', '_blank')}
              >
                <Twitter size={18} className="mr-2" />
                {translations.followOnTwitter}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
