
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const CTA = () => {
  const { translations } = useLanguage();
  
  return (
    <section id="join" className="py-24 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-jf-blue/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{translations.readyToJoin}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {translations.ctaDescription}
          </p>
          
          <Button size="lg" className="px-8 py-6 bg-jf-blue hover:bg-jf-blue/90 text-lg">
            {translations.joinToTwitter}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-8 text-gray-400">
            <p>{translations.alreadyMember}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
