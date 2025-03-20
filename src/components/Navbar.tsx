import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { cn } from "@/lib/utils";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { translations } = useLanguage();
  const location = useLocation();

  const NavLink = ({ to, children, exact }: { to: string; children: React.ReactNode; exact?: boolean }) => {
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={cn(
          "text-gray-300 hover:text-white transition-colors duration-200",
          isActive ? "text-white font-medium" : ""
        )}
      >
        {children}
      </Link>
    );
  };

  const { isAdmin } = useAuth();
  
  return (
    <header className="bg-jf-dark/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-white/5">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display font-bold text-xl">
          Judgment <span className="text-[#D946EF]">Fleet</span>
        </Link>
        
        <div className="lg:flex items-center space-x-6 hidden">
          <nav className="flex items-center space-x-6">
            <NavLink to="/" exact={true}>{translations.home}</NavLink>
            <NavLink to="/faq">{translations.faq}</NavLink>
            <NavLink to="/best-games">{translations.bestGames}</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          
          <LanguageSelector />
        </div>
        
        <div className="lg:hidden">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
