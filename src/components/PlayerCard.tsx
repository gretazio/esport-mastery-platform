
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";

export interface PlayerProps {
  id: string;
  name: string;
  image: string;
  role: string;
  achievements: string[];
  bestResult?: string;
  joinDate?: string;
}

const PlayerCard = ({ id, name, image, role, achievements, joinDate }: PlayerProps) => {
  const { translations } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12">
      <div className="shrink-0 md:w-1/3">
        <img 
          src={image} 
          alt={name} 
          className="rounded-md w-full h-auto shadow-md border border-white/10"
        />
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{name}</h3>
        <span className="text-[#D946EF] font-medium mb-1">{role}</span>
        
        {/* Display join date if available */}
        {joinDate && (
          <span className="text-gray-400 text-sm mb-4">{translations.memberSince}: {joinDate}</span>
        )}
        
        <ul className="space-y-2 text-left mt-2">
          {achievements.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[#D946EF] mr-2">•</span>
              <span className="text-gray-300">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerCard;
