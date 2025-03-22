
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import * as LucideIcons from "lucide-react";

interface FooterResource {
  id: string;
  title_it: string;
  title_en: string;
  url: string;
  icon: string | null;
  category: string;
  position: number;
  is_active: boolean;
}

type GroupedResources = Record<string, FooterResource[]>;

export function FooterResourcesDisplay() {
  const { currentLanguage } = useLanguage();
  const [resources, setResources] = useState<GroupedResources>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("footer_resources")
          .select("*")
          .eq("is_active", true)
          .order("position", { ascending: true });

        if (error) throw error;
        
        // Group resources by category
        const grouped = (data || []).reduce((acc, resource) => {
          if (!acc[resource.category]) {
            acc[resource.category] = [];
          }
          acc[resource.category].push(resource);
          return acc;
        }, {} as GroupedResources);
        
        setResources(grouped);
      } catch (error) {
        console.error("Error fetching footer resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();

    // Set up real-time subscription
    const subscription = supabase
      .channel("footer-resources-display-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "footer_resources" },
        () => {
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return null;
    
    // @ts-ignore - dynamically access Lucide icons
    const Icon = LucideIcons[iconName];
    return Icon ? <Icon className="h-5 w-5 text-[#D946EF]" /> : null;
  };

  if (loading) {
    return null; // Silent loading for footer
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
      {Object.entries(resources).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-white font-semibold text-lg capitalize mb-4">
            {category}
          </h3>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-gray-400 hover:text-[#D946EF] transition-colors"
                >
                  {item.icon && (
                    <span className="mr-2">{renderIcon(item.icon)}</span>
                  )}
                  <span>
                    {currentLanguage === "en" ? item.title_en : item.title_it}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
