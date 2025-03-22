
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FAQDisplay } from "@/components/FAQDisplay";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { translations } = useLanguage();

  return (
    <main className="min-h-screen bg-jf-dark text-jf-light">
      <Navbar />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pt-32 pb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          {translations.faqTitle}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {translations.faqDescription}
        </p>
      </motion.div>
      
      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-24">
        <FAQDisplay />
      </section>
      
      <Footer />
    </main>
  );
};

export default FAQ;
