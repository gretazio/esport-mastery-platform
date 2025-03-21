
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { useState } from "react";

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
  const [imageError, setImageError] = useState(false);
  
  // Function to handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${image}`);
    setImageError(true);
  };

  // Enhanced function to handle various image URL formats
  const getFormattedImageUrl = (url: string) => {
    if (!url) return "";
    
    try {
      // Check if it's already a valid URL
      new URL(url);
      return url;
    } catch (e) {
      // If it's not a valid URL, try to format it
      
      // If it's just an ID (common for Imgur)
      if (url.match(/^[a-zA-Z0-9]{5,10}$/)) {
        return `https://i.imgur.com/${url}.jpg`;
      }
      
      // If it's an Imgur URL without https://
      if (url.includes('imgur.com') && !url.startsWith('http')) {
        return `https://${url}`;
      }
      
      // If it's an Imgur URL but missing the direct image part
      if (url.includes('imgur.com/')) {
        // Handle gallery URLs
        if (url.includes('/gallery/') || url.includes('/a/')) {
          const parts = url.split('/');
          const imgurId = parts[parts.length - 1].split('.')[0]; // Remove extension if present
          return `https://i.imgur.com/${imgurId}.jpg`;
        }
        
        // Handle direct Imgur URLs that aren't in i.imgur.com format
        if (!url.includes('i.imgur.com/')) {
          const parts = url.split('/');
          const imgurId = parts[parts.length - 1].split('.')[0]; // Remove extension if present
          return `https://i.imgur.com/${imgurId}.jpg`;
        }
      }
      
      // Check for Discord CDN links and ensure they're complete
      if (url.includes('discord') && url.includes('cdn')) {
        if (!url.startsWith('http')) {
          return `https://${url}`;
        }
      }
      
      // Fallback for any other case
      return url;
    }
  };
  
  // Get the formatted image URL
  const formattedImageUrl = getFormattedImageUrl(image);
  
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12">
      <div className="shrink-0 md:w-1/3">
        {!imageError ? (
          <img 
            src={formattedImageUrl} 
            alt={name} 
            className="rounded-md w-full h-auto shadow-md border border-white/10"
            onError={handleImageError}
          />
        ) : (
          <div className="rounded-md w-full aspect-video bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10">
            <span>Image not available</span>
          </div>
        )}
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
