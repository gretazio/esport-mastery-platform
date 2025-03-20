
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after a small timeout for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="absolute inset-0 z-0 bg-black/40" />
        
        {/* Background image with lazy loading effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[1.5s]"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "scale(1)" : "scale(1.05)",
            filter: "blur(0px)"
          }} 
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <span className="inline-flex items-center rounded-full px-4 py-1 mb-6 text-sm font-medium bg-accent/10 text-accent">
              <Gamepad className="mr-1 h-4 w-4" /> The Future of Gaming
            </span>
          </div>

          <h1 
            className={`text-4xl md:text-6xl font-bold leading-tight md:leading-tight text-white mb-6 text-balance transition-all duration-1000 delay-100 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Elevate Your <span className="text-gradient">Esports</span> Experience
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Join the elite community of professional gamers, teams, and enthusiasts in the ultimate esports platform.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Button className="bg-accent hover:bg-accent/90 text-white min-w-40 h-12 shadow-lg shadow-accent/20" size="lg">
              Get Started
            </Button>
            <Button variant="outline" className="group min-w-40 h-12 border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10" size="lg">
              Explore Tournaments
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
