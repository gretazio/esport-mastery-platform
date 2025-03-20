
import { Github, Twitter } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
  const { translations } = useLanguage();
  //greetings
  const resources = [
    { name: "Smogon Metagames", url: "https://www.smogon.com/forums/forums/smogon-metagames.725/" },
    { name: "SV OU Sample Teams", url: "https://www.smogon.com/forums/threads/sv-ou-sample-teams-new-samples-added-post-scl-olt.3712513/" },
    { name: "Official Smogon Tournament", url: "https://www.smogon.com/forums/forums/official-smogon-tournament.463/" },
    { name: "Smogon Tour", url: "https://www.smogon.com/forums/forums/smogon-tour.49/" },
    { name: "Smogon Classic", url: "https://www.smogon.com/forums/forums/smogon-classic.334/" },
    { name: "Smogon Grand Slam", url: "https://www.smogon.com/forums/forums/smogon-grand-slam.208/" },
    { name: "Smogon Masters", url: "https://www.smogon.com/forums/forums/smogon-masters.864/" },
    { name: "Official Ladder Tournament", url: "https://www.smogon.com/forums/forums/official-ladder-tournament.465/" },
    { name: "Smogon Premier League", url: "https://www.smogon.com/forums/forums/smogon-premier-league.130/" },
    { name: "Smogon Champions League", url: "https://www.smogon.com/forums/forums/smogon-champions-league.453/" },
    { name: "World Cup of Pokemon", url: "https://www.smogon.com/forums/forums/world-cup-of-pokemon.234/" },
    { name: "Circuit Tournaments", url: "https://www.smogon.com/forums/forums/circuit-tournaments.351/" }
  ];

  return (
    <footer id="resources" className="bg-jf-dark py-12 px-4 md:px-6 border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-display font-bold text-white">
                Judgment<span className="text-[#D946EF]">Fleet</span>
              </span>
            </div>
            <div className="mt-6">
              <p className="text-gray-400 max-w-md">
                {translations.contactsFounder}
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-gray-400">paispaz</p>
              <p className="text-gray-400">vinn0558</p>
              <p className="text-gray-400">shootouts</p>
            </div>
            
            {/* Logo added below the founder contacts */}
            <div className="mt-8">
              <img 
                src="/assetsupload/0960f71e-449c-4316-b652-9cff4011d4f4.png" 
                alt="Judgment Fleet Logo" 
                className="h-auto max-h-24 w-auto"
              />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">{translations.resourcesSection}</h3>
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {resources.map((link) => (
                  <div key={link.name} className="mb-2">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white transition-colors text-sm md:text-base truncate block"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Judgment Fleet. {translations.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
