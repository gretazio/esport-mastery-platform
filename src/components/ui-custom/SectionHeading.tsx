
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  children?: ReactNode;
}

const SectionHeading = ({
  title,
  subtitle,
  className,
  align = "center",
  children,
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "space-y-4 mb-12",
        align === "center" && "text-center",
        align === "left" && "text-left",
        align === "right" && "text-right",
        className
      )}
    >
      <ScrollReveal delay={100}>
        <div className="mb-3">
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs tracking-wider uppercase font-medium">
            {subtitle || "Featured"}
          </span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <h2 className="font-bold text-balance">{title}</h2>
      </ScrollReveal>
      
      {children && (
        <ScrollReveal delay={300}>
          <div className="max-w-3xl mx-auto text-muted-foreground">
            {children}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

export default SectionHeading;
