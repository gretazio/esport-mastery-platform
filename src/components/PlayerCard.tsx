
import { useState } from "react";
import { motion } from "framer-motion";
import { normalizeImageUrl } from "../utils/imageUtils";

type PlayerCardProps = {
  name: string;
  image: string;
  achievements: string[];
  role: string;
  index: number;
  id?: string; // Optional id prop
  joinDate?: string; // Optional joinDate prop
};

const PlayerCard = ({ name, image, achievements, role, index, id, joinDate }: PlayerCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${image}`);
    setImageError(true);
  };
  
  // Use our utility to normalize the image URL before rendering
  const normalizedImageUrl = normalizeImageUrl(image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-black/30 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm mb-6"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-square overflow-hidden">
          <img
            src={imageError ? "/placeholder.svg" : normalizedImageUrl}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform hover:scale-105"
            onError={handleImageError}
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-[#D946EF] text-sm mb-3">{role}</p>
          {joinDate && <p className="text-gray-400 text-sm mb-3">Member since: {joinDate}</p>}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-300">Achievements:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              {achievements.map((achievement, i) => (
                <li key={i} className="line-clamp-2">{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
