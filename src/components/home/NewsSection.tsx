
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import SectionHeading from "../ui-custom/SectionHeading";
import ScrollReveal from "../ui-custom/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Global Championship Finals Set to Begin Next Week",
    excerpt: "The most anticipated esports event of the year is just around the corner with 16 top teams competing for the $2 million prize pool.",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2071&auto=format&fit=crop",
    date: new Date("2023-11-15"),
    author: "Michael Chang",
    category: "Tournament",
  },
  {
    id: 2,
    title: "Rising Star 'Nova' Signs Record-Breaking Contract",
    excerpt: "19-year-old prodigy joins elite team with unprecedented $3M annual salary, marking a new era in professional player contracts.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    date: new Date("2023-11-10"),
    author: "Sarah Johnson",
    category: "Players",
  },
  {
    id: 3,
    title: "New Season Introduces Revolutionary Team-Based Scoring System",
    excerpt: "League officials announce major changes to tournament structure with innovative point system designed to reward team coordination.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
    date: new Date("2023-11-05"),
    author: "David Park",
    category: "Updates",
  },
];

const NewsSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <SectionHeading
          title="Latest Esports News & Updates"
          subtitle="News & Articles"
        >
          <p>
            Stay informed with the latest happenings in the professional esports world from tournaments to player updates.
          </p>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <ScrollReveal 
              key={article.id} 
              delay={100 + index * 150}
              direction="up"
            >
              <div
                className="group h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border"
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-700",
                      hoveredId === article.id ? "scale-110" : "scale-100"
                    )}
                  />
                  <Badge 
                    className="absolute top-4 left-4 bg-accent hover:bg-accent/90 text-white"
                  >
                    {article.category}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(article.date, "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                  
                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm mb-6">{article.excerpt}</p>
                  
                  {/* Button */}
                  <div className="mt-auto">
                    <Button 
                      variant="ghost" 
                      className="px-0 group/btn hover:bg-transparent"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            View All News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
