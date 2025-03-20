import { motion } from "framer-motion";
import PlayerCard from "@/components/PlayerCard";
import { useLanguage } from "../contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopMembers = () => {
  const { translations } = useLanguage();
  
  const topPlayers = [
    {
      id: "player1",
      name: "Empo",
      image: "https://www.smogon.com/forums/data/avatars/m/288/288721.jpg?1730056245",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "September 2015",
      achievements: [
        "Official Smogon Tournament x1", 
        "Smogon Tournament x3", 
        "Smogon Masters x1",
        "Smogon Premier League x2",
        "World Cup of Pokemon x1",
        "Smogon Championship Circuit x1"
      ]
    },
    {
      id: "player2",
      name: "Santu",
      image: "https://www.smogon.com/forums/data/avatars/l/335/335670.jpg?1690812147",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU, Lower Tiers",
      joinDate: "June 2016",
      achievements: [
        "Smogon Grand Slam x1", 
        "World Cup of Pokemon x1",
        "GEN 6 OU Circuit x1"
      ]
    },
    {
      id: "player3",
      name: "Punny",
      image: "https://www.smogon.com/forums/data/avatars/l/310/310107.jpg?1714342133",
      role: "GEN 7 OU, GEN 8 OU, GEN 9 OU, Lower Tiers",
      joinDate: "February 2016",
      achievements: [
        "Smogon Grand Slam x1", 
        "Smogon Premier League x1",
        "World Cup of Pokemon x1"
      ]
    },
    {
      id: "player4",
      name: "Tricking",
      image: "https://www.smogon.com/forums/media/avatars/whiscash.gif.m.1",
      role: "Every Metagame",
      joinDate: "July 2014",
      achievements: [
        "Official Ladder Tournament x2", 
        "Smogon Premier League x2",
        "World Cup of Pokemon x1"
      ]
    },
    {
      id: "player5",
      name: "Will of Fire",
      image: "https://www.smogon.com/forums/media/avatars/skiploom.gif.m.1",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "February 2014",
      achievements: [
        "Ojama Money Tour x1", 
        "Blunder Money Tour x1",
        "World Cup of Pokemon x1",

      ]
    },
    {
      id: "player6",
      name: "Hellpowna",
      image: "https://www.smogon.com/forums/data/avatars/m/42/42105.jpg?1736428854",
      role: "GEN 2 OU, GEN 3 OU, GEN 4 OU",
      joinDate: "November 2009",
      achievements: [
        "Smogon Premier League x1", 
        "Smogon Classic [Playoffs] x2",
        "Multiple Circuits [Playoffs]",
        "Smogon Tournaments [Playoffs]"
      ]
    },
    {
      id: "player7",
      name: "Mada",
      image: "  https://www.smogon.com/forums/data/avatars/l/513/513753.jpg?1734134095",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "April 2020",
      achievements: [
        "Smogon Premier League x1", 
        "GEN 9 OU Circuit [Playoffs] "
      ]
    },
    {
      id: "player8",
      name: "Prinz",
      image: "https://www.smogon.com/forums/data/avatars/l/122/122818.jpg?1695033525",
      role: "Every OU",
      joinDate: "January 2012",
      achievements: [
        "World Cup of Pokemon x1",
        "Smogon Premier League x1", 
        "Official Ladder Tournament x1"
      ]
    },
    {
      id: "player9",
      name: "Kebab mlml",
      image: "https://www.smogon.com/forums/data/avatars/m/294/294482.jpg?1533056564",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "October 2015",
      achievements: [
        "World Cup of Pokemon x1",
        "Smogon Premier League x1", 
      ]
    },
    {
      id: "player10",
      name: "Raiza",
      image: "https://www.smogon.com/forums/data/avatars/l/155/155229.jpg?1742158346",
      role: "GEN 5 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "August 2012",
      achievements: [
        "World Cup of Pokemon x1",
        "Smogon Premier League x2",
        "GEN 5 OU Circuit x1" 
      ]
    },
    {
      id: "player11",
      name: "Niko",
      image: "https://www.smogon.com/forums/data/avatars/m/283/283197.jpg?1714264838",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "August 2015",
      achievements: [
        "World Cup of Pokemon x1",
        "Smogon Champions League x1",
        
      ]
    },
    {
      id: "player12",
      name: "LuckOverSkill",
      image: "https://www.smogon.com/forums/data/avatars/l/70/70861.jpg?1740989081",
      role: "GEN 5 OU",
      joinDate: "November 2010",
      achievements: [
        "World Cup of Pokemon x1",
       
        
      ]
    },
    {
      id: "player13",
      name: "Laroxyl",
      image: "https://www.smogon.com/forums/data/avatars/l/265/265734.jpg?1612354134",
      role: "Every OU, Little Cup",
      joinDate: "March 2015",
      achievements: [
        "GEN 1 OU Circuit x1",
        "SCL 2023: 8-2",
        "World Cup of Pokemon [Finals]",
        "Smogon Champions League [Semifinals]"

       
        
      ]
    },
    {
      id: "player14",
      name: "Pais",
      image: "https://www.smogon.com/forums/data/avatars/l/268/268987.jpg?1742223941",
      
      role: "GEN 8 OU, GEN 9 OU",
      joinDate: "April 2015",
      achievements: [
        "WCoP 2024: 5-1",
        "SCL 2024: 6-3",
        "World Cup of Pokemon [Finals]",
        "Smogon Champions League [Semifinals]",
        "GEN 8 OU Circuit [Playoffs]"
       
        
      ]
    },
    {
      id: "player15",
      name: "Entrocefalo",
      image: "https://www.smogon.com/forums/data/avatars/l/399/399174.jpg?1698014560",
      role: "Ubers",
      joinDate: "April 2017",
      achievements: [
        "SCL 2023: 7-2",
        "World Cup of Pokemon [Finals]",
        "AG Circuit Champion x1",
        "Multiple Circuits Playoffs"
       
        
      ]
    },
    {
      id: "player16",
      name: "zS",
      image: "https://www.smogon.com/forums/data/avatars/l/480/480681.jpg?1735611287",
      role: "GEN 8 OU, GEN 9 OU, Lower Tiers",
      joinDate: "May 2019",
      achievements: [
        "SCL 2024: 6-3",
        "World Cup of Pokemon [Finals]",
        "Multiple Circuit [Playoffs]",
        "Official Smogon Tournament [Top 8]"
           
        
      ]
    },

    {
      id: "player17",
      name: "LittleBigPlanet2",
      image: "https://www.smogon.com/forums/data/avatars/m/152/152269.jpg?1652693211",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
      joinDate: "July 2012",
      achievements: [
        "SCL 2020: 6-2",
        "Ojama Money Tour x1",
        "World Cup of Pokemon [Semifinals]",
           
        
      ]
    },

    {
      id: "player18",
      name: "Just One Galatina",
      image: "https://www.smogon.com/forums/data/avatars/l/648/648759.jpg?1730719175",
      role: "GEN 9 OU",
      joinDate: "September 2023",
      achievements: [
       
        "World Cup of Pokemon [Finals]",
           
        
      ]
    },

    {
      id: "player19",
      name: "H.M.N.I.P",
      image: "https://www.smogon.com/forums/data/avatars/l/291/291057.jpg?1681287399",
      role: "GEN 4 OU, GEN 6 OU, GEN 7 OU, GEN 8 OU",
      joinDate: "October 2015",
      achievements: [
        "Smogon Premier League x1",
        "World Cup of Pokemon x1",   
        
      ]
    },

    {
      id: "player20",
      name: "LoSconosciuto",
      image: "https://www.smogon.com/forums/data/avatars/l/470/470515.jpg?1613989183",
      role: "Random Battles",
      joinDate: "December 2018",
      achievements: [
        "Random Battles #1 Ladder",
        "RB Money Tour [Finals]",   
        
      ]
    },

    {
      id: "player21",
      name: "Kibo",
      image: "https://www.smogon.com/forums/media/avatars/gigalith.gif.m.1",
      role: "GEN 8 OU, GEN 9 OU",
      joinDate: "May 2021",
      achievements: [
        "World Cup of Pokemon [Finals]"
        
      ]
    },

    {
      id: "player22",
      name: "s7a",
      image: "https://www.smogon.com/forums/data/avatars/l/516/516880.jpg?1736765778",
      role: "GEN 9 OU",
      joinDate: "May 2020",
      achievements: [
        "World Cup of Pokemon [Finals]"
        
      ]
    },
  
    {
      id: "player23",
      name: "Ciro Napoli",
      image: "https://www.smogon.com/forums/data/avatars/l/574/574305.jpg?1687929478",
      role: "GEN 9 OU, Random Battles",
      joinDate: "December 2021",
      achievements: [
        "Random Battles #1 Ladder",
        "Official Smogon Tournament [Semifinals]"
        
      ]
    },
    
    {
      id: "player24",
      name: "procorphish",
      image: "https://www.smogon.com/forums/data/avatars/l/245/245859.jpg?1671194425",
      role: "GEN 9 OU, PU",
      joinDate: "November 2014",
      achievements: [
        "PUWC MvP",
        "WCoP 2023: 2-1",
        "SV OU Release Tournament [Semifinals]"
        
      ]
    },

    {
      id: "player25",
      name: "Mix",
      image: "https://www.smogon.com/forums/data/avatars/l/228/228535.jpg?1704138937",
      role: "GEN 5 OU, GEN 6 OU, GEN 7 OU, GEN 8 OU",
      joinDate: "April 2014",
      achievements: [
        "Smogtour [Playoffs]",
        "World Cup of Pokemon x1",
        "GEN 5 OU Circuit [Playoffs]"
        
      ]
    },

    {
      id: "player26",
      name: "Decis",
      image: "https://www.smogon.com/forums/data/avatars/l/155/155319.jpg?1741505205",
      role: "GEN 5 OU, GEN 6 OU, GEN 7 OU, GEN 8 OU",
      joinDate: "August 2012",
      achievements: [
        "World Cup of Pokemon [Semifinals]",
        "Smogon Classic [Playoffs]",
        
      ]
    },

    
    {
      id: "player27",
      name: "nightcore",
      image: "https://www.smogon.com/forums/data/avatars/l/161/161372.jpg?1741532032",
      role: "GEN 4 OU, GEN 5 OU",
      joinDate: "October 2012",
      achievements: [
        "GEN 4 OU Circuit [Playoffs]",
        
      ]
    },

    {
      id: "player28",
      name: "Micaiah",
      image: "https://www.smogon.com/forums/data/avatars/l/333/333469.jpg?1691074236",
      role: "CAP",
      joinDate: "July 2016",
      achievements: [
        "CAPPL Champion x1",
        
      ]
    },

  /*  {
      id: "player4",
      name: "Radu",
      image: "https://www.smogon.com/forums/data/avatars/l/455/455774.jpg?1740178895",
      role: "1v1",
      joinDate: "June 2018",
      achievements: [
        "1v1PL Champion x1",
        
      ]
    }, */

    {
      id: "player29",
      name: "Adam The First",
      image: "https://www.smogon.com/forums/data/avatars/l/314/314560.jpg?1737995000",
      role: "GEN 6 OU",
      joinDate: "March 2016",
      achievements: [
        "GEN 6 OU Circuit [Playoffs]",
        
      ]
    },

    {
      id: "player30",
      name: "Fran17",
      image: "https://www.smogon.com/forums/data/avatars/l/223/223354.jpg?1731339174",
      role: "Every Metagame",
      joinDate: "March 2014",
      achievements: [
        "World Cup of Pokemon [Semifinals]",
        
      ]
    },

    {
      id: "player31",
      name: "Aurella",
      image: "https://www.smogon.com/forums/data/avatars/m/418/418478.jpg?1734479604",
      role: "GEN 7 OU",
      joinDate: "August 2017",
      achievements: [
        "World Cup of Pokemon [Semifinals]",
        "Smogon Premier League [Semifinals]",
        
        
      ]
    },

    {
      id: "player32",
      name: "Figull400",
      image: "https://www.smogon.com/forums/data/avatars/l/606/606174.jpg?1662135447",
      role: "GEN 3 OU",
      joinDate: "September 2022",
      achievements: [
        "GEN 3 OU Circuit [Playoffs]",
        
        
      ]
    },

    
    {
      id: "player33",
      name: "ErPeris",
      image: "https://www.smogon.com/forums/data/avatars/l/356/356921.jpg?1608322403",
      role: "GEN 1 OU",
      joinDate: "November 2016",
      achievements: [
        "Smogon Premier League x1",
        
        
      ]
    },

       
    {
      id: "player34",
      name: "pkThunderbolt",
      image: "https://www.smogon.com/forums/data/avatars/l/522/522605.jpg?1617121921",
      role: "GEN 3 OU",
      joinDate: "July 2020",
      achievements: [
        "Smogon Premier League x1",
        
        
      ]
    },

    {
      id: "player35",
      name: "Going Hard",
      image: "https://www.smogon.com/forums/data/avatars/l/568/568718.jpg?1729355050",
      role: "GEN 9 OU",
      joinDate: "October 2021",
      achievements: [
        "World Cup of Pokemon [Finals]",
        
        
      ]
    },

    {
      id: "player36",
      name: "Breezy",
      image: "https://www.smogon.com/forums/data/avatars/l/288/288782.jpg?1700425061",
      role: "GEN 6 OU, GEN 7 OU, GEN 8 OU",
      joinDate: "September 2015",
      achievements: [
        "Smogon Premier League x1",
        
        
      ]
    },

    {
      id: "player37",
      name: "ronaldo o fenomeno",
      image: "https://www.smogon.com/forums/media/avatars/snover.gif.m.1",
      role: "GEN 8 OU",
      joinDate: "October 2021",
      achievements: [
        "Official Ladder Tournament [Playoffs]",
        
        
      ]
    },

    
    {
      id: "player38",
      name: "Diegoyuhhi",
      image: "https://www.smogon.com/forums/data/avatars/l/550/550005.jpg?1727978541",
      role: "ZU",
      joinDate: "April 2021",
      achievements: [
        "ZU Circuit x1",
        
        
      ]
    },

    {
      id: "player39",
      name: "StepC",
      image: "https://www.smogon.com/forums/data/avatars/l/388/388643.jpg?1738921341",
      role: "GEN 8 OU",
      joinDate: "February 2017",
      achievements: [
        "GEN 8 OU Circuit [Playoffs]",
        "GEN 9 OU Circuit [Playoffs]",
        
        
      ]
    },

    {
      id: "player40",
      name: "Sachumberto",
      image: "https://www.smogon.com/forums/data/avatars/l/457/457538.jpg?1696810270",
      role: "GEN 8 OU, GEN 9 OU",
      joinDate: "June 2018",
      achievements: [
        "GEN 8 OU Circuit [Playoffs]",
        
        
      ]
    },

    {
      id: "player41",
      name: "PolloAriosto",
      image: "https://www.smogon.com/forums/data/avatars/l/602/602286.jpg?1739295888",
      role: "Little Cup",
      joinDate: "July 2022",
      achievements: [
        "Little Cup Circuit [Playoffs]",
        
        
      ]
    },

  /*  {
      id: "player4",
      name: "ACII",
      image: "https://www.smogon.com/forums/media/avatars/drowzee.gif.m.1",
      role: "Every OU",
      joinDate: "December 2018",
      achievements: [
       
        
        
      ]
    },

    {
      id: "player4",
      name: "Montreal",
      image: "https://www.smogon.com/forums/data/avatars/l/183/183978.jpg?1446585976",
      role: "GEN 1 OU, GEN 5 OU",
      joinDate: "March 2013",
      achievements: [
       
        
        
      ]
    },

    {
      id: "player4",
      name: "giove97",
      image: "    https://www.smogon.com/forums/data/avatars/l/473/473533.jpg?1675071784",
      role: "Little Cup",
      joinDate: "January 2019",
      achievements: [
       
        
        
      ]
    },

    {
      id: "player4",
      name: "Hachimaki",
      image: "https://www.smogon.com/forums/data/avatars/l/255/255534.jpg?1669300081",
      role: "GEN 6 OU",
      joinDate: "January 2015",
      achievements: [
       
        
        
      ]
    }, */
  ];
  
  return (
    <section id="top-players" className="py-16 px-4 md:px-6 relative z-10 overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {translations.ourPlayers} <span className="text-[#D946EF]">{translations.playersSection}</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">{translations.playersDescription}</p>
        </motion.div>

        {/* Player profiles in a grid - all visible at once */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <PlayerCard {...player} />
            </motion.div>
          ))}
        </div>
        
        {/* Add button linking to Best Games at the bottom */}
        <div className="container mx-auto mt-16 text-center">
          <h3 className="text-2xl font-display font-bold mb-4">{translations.checkBestBattles}</h3>
          <Button 
            size="lg" 
            className="px-6 py-6 bg-[#D946EF] hover:bg-[#D946EF]/90"
            onClick={() => {
              window.location.href = '/best-games';
            }}
          >
            {translations.viewBestGames}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopMembers;
