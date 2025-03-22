
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";

interface FAQ {
  id: string;
  question_it: string;
  question_en: string;
  answer_it: string;
  answer_en: string;
  position: number;
  is_active: boolean;
}

export function FAQDisplay() {
  const { currentLanguage } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .eq("is_active", true)
          .order("position", { ascending: true });

        if (error) throw error;
        setFaqs(data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();

    // Set up real-time subscription
    const subscription = supabase
      .channel("faqs-display-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        () => {
          fetchFaqs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq) => (
          <AccordionItem 
            key={faq.id} 
            value={faq.id}
            className="border border-white/10 bg-black/20 rounded-lg px-6 overflow-hidden"
          >
            <AccordionTrigger className="text-white hover:text-[#D946EF] text-lg font-medium py-4">
              {currentLanguage === "en" ? faq.question_en : faq.question_it}
            </AccordionTrigger>
            <AccordionContent className="text-gray-300 pt-2 pb-6">
              <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                {currentLanguage === "en" ? faq.answer_en : faq.answer_it}
              </ReactMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {faqs.length === 0 && (
        <p className="text-center text-gray-400 my-8">No FAQs available at the moment.</p>
      )}
    </div>
  );
}
