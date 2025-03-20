
import { useState } from "react";
import { cn } from "@/lib/utils";
import SectionHeading from "../ui-custom/SectionHeading";
import ScrollReveal from "../ui-custom/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Trophy } from "lucide-react";

const games = [
  {
    id: 1,
    title: "League of Legends",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    category: "MOBA",
    players: "125M+",
    tournaments: 432,
    prize: "$12M",
  },
  {
    id: 2,
    title: "Counter-Strike 2",
    image: "https://images.unsplash.com/photo-1616508299452-8b5870c209df?q=80&w=3426&auto=format&fit=crop",
    category: "FPS",
    players: "45M+",
    tournaments: 580,
    prize: "$8M",
  },
  {
    id: 3,
    title: "Dota 2",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=3876&auto=format&fit=crop",
    category: "MOBA",
    players: "30M+",
    tournaments: 216,
    prize: "$15M",
  },
  {
    id: 4,
    title: "Valorant",
    image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=3272&auto=format&fit=crop",
    category: "FPS",
    players: "22M+",
    tournaments: 184,
    prize: "$4M",
  },
];

const FeaturedGames = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <SectionHeading
          title="Explore Top Esports Titles"
          subtitle="Featured Games"
        >
          <p>
            Discover the most competitive and popular esports games with active tournaments and thriving communities.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <ScrollReveal 
              key={game.id} 
              className="h-full"
              delay={100 + index * 100}
              direction="up"
            >
              <div
                className="group relative h-[380px] rounded-xl overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${game.image})`,
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />
                
                {/* Badge */}
                <Badge
                  className="absolute top-4 left-4 bg-accent/90 hover:bg-accent text-white font-medium"
                >
                  {game.category}
                </Badge>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 ease-out">
                  <h3 className={cn(
                    "text-2xl font-bold text-white mb-3 transition-transform duration-500",
                    hoveredId === game.id ? "-translate-y-2" : "translate-y-0"
                  )}>
                    {game.title}
                  </h3>
                  
                  <div className={cn(
                    "grid grid-cols-3 gap-2 text-white/80 text-sm transition-all duration-500",
                    hoveredId === game.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <div className="flex flex-col gap-1 items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Users className="h-4 w-4 text-accent" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>{game.tournaments}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span>{game.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
