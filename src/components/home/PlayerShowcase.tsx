
import { useState } from "react";
import { cn } from "@/lib/utils";
import SectionHeading from "../ui-custom/SectionHeading";
import ScrollReveal from "../ui-custom/ScrollReveal";
import GlassCard from "../ui-custom/GlassCard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad, Star, Medal } from "lucide-react";

const players = [
  {
    id: 1,
    name: "Alex 'Striker' Chen",
    avatar: "https://i.pravatar.cc/150?img=32",
    game: "League of Legends",
    team: "Quantum Pulse",
    country: "United States",
    achievements: ["World Champion '23", "Regional MVP", "3x All-Star"],
    rating: 9.8,
  },
  {
    id: 2,
    name: "Sofia 'Viper' Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=5",
    game: "Counter-Strike 2",
    team: "Stellar Nova",
    country: "Brazil",
    achievements: ["Major Winner", "ESL Champion", "Clutch Master"],
    rating: 9.5,
  },
  {
    id: 3,
    name: "Jae 'Phantom' Park",
    avatar: "https://i.pravatar.cc/150?img=11",
    game: "Valorant",
    team: "Eclipse Dynasty",
    country: "South Korea",
    achievements: ["Masters Champion", "Ace Award", "Rookie of the Year"],
    rating: 9.7,
  },
];

const PlayerShowcase = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900/10 to-background"></div>
      
      <div className="container relative z-10">
        <SectionHeading
          title="Elite Professional Players"
          subtitle="Pro Players"
        >
          <p>
            Meet the extraordinary talent behind competitive esports - skilled professionals who have mastered their craft.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {players.map((player, index) => (
            <ScrollReveal 
              key={player.id} 
              delay={100 + index * 150}
              direction="up"
            >
              <div
                className="group h-full"
                onMouseEnter={() => setHoveredId(player.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <GlassCard className="h-full flex flex-col relative overflow-hidden">
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-accent rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {player.rating}
                  </div>
                  
                  {/* Player Info */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24 border-4 border-white/10">
                        <img src={player.avatar} alt={player.name} />
                      </Avatar>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                        PRO
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Gamepad className="h-3 w-3" />
                      <span>{player.game}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-primary/5">
                        {player.team}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5">
                        {player.country}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="flex-1">
                    <div className="space-y-3 mb-6">
                      {player.achievements.map((achievement, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          {i === 0 ? (
                            <Trophy className="h-4 w-4 text-yellow-400" />
                          ) : i === 1 ? (
                            <Star className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Medal className="h-4 w-4 text-purple-400" />
                          )}
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* View Profile Button */}
                  <Button 
                    variant="secondary"
                    className={cn(
                      "w-full transition-all duration-300",
                      hoveredId === player.id ? "bg-accent text-white" : ""
                    )}
                  >
                    View Profile
                  </Button>
                </GlassCard>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayerShowcase;
