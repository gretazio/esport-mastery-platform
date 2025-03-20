
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = true 
}: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "relative rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6",
        hoverEffect && "transition-all duration-300 hover:bg-white/10 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
