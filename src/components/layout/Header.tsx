
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, User, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <Trophy className="h-6 w-6 text-accent" />
          <span className="hidden sm:inline transition-all duration-500">ESPORT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "Games", path: "/games" },
            { name: "Teams", path: "/teams" },
            { name: "Tournaments", path: "/tournaments" },
            { name: "News", path: "/news" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="md:flex hidden"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            className="hidden md:flex bg-accent hover:bg-accent/90 text-white"
            variant="default"
          >
            Join Pro
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 p-4">
          {[
            { name: "Home", path: "/" },
            { name: "Games", path: "/games" },
            { name: "Teams", path: "/teams" },
            { name: "Tournaments", path: "/tournaments" },
            { name: "News", path: "/news" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-2xl font-medium transition-all duration-300 hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button 
            className="mt-4 bg-accent hover:bg-accent/90 text-white"
          >
            Join Pro
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
