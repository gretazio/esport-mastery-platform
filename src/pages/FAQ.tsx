
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Twitter } from "lucide-react";

const FAQ = () => {
  const [visible, setVisible] = useState(false);
  const { translations, locale } = useLanguage();

  useEffect(() => {
    // Always scroll to top when mounting
    window.scrollTo(0, 0);
    
   
  }, [locale]);

  const faqItems = locale === "it" ? [
    {
      question: "Cos'è Judgment Fleet?",
      answer: "Judgment Fleet è una community italiana di giocatori competitivi di Pokémon che opera principalmente su Pokémon Showdown e si ispira agli standard competitivi di Smogon. Il nostro obiettivo è riunire i migliori giocatori italiani e promuovere lo sviluppo della scena competitiva in Italia."
    },
    {
      question: "Come posso unirmi a Judgment Fleet?",
      answer: "L'accesso a Judgment Fleet è selettivo e basato su inviti. Non bisogna essere necessariamente dei giocatori fin troppo esperti, ma bisogna essere interessati ad interfacciarsi alla community. Se sei interessato, contattaci, ti terremo d'occhio."
    },
    {
      question: "Cos'è Smogon?",
      answer: "La Community per il Competitivo Pokémon più longeva e importante al mondo. Rispetto al VGC, offre principalmente dei format dove si gioca in Singolo, anziché in Doppio. Seppur il VGC sia il formato ufficiale di The Pokémon Company, Smogon vanta all'incirca 500.000 utenti registrati sulla piattaforma e hai ogni torneo a portata di click."
    },
    {
      question: "Come posso migliorare come giocatore competitivo?",
      answer: "Giocando molto e analizzando i replay dei giocatori più esperti. Un ottimo modo per imparare è guardare contenuti educativi e analisi di partite fatte da top player. Ti consigliamo di seguire il canale di [Blunder](https://www.youtube.com/@Thunderblunder777), uno dei migliori content creator della scena competitiva di Pokémon."
    },
    {
      question: "Non ho teams, come inizio a giocare?",
      answer: "Un ottimo punto di partenza è utilizzare i Sample Teams, che sono squadre pre-costruite da giocatori esperti e approvate dalla community. Puoi trovarli qui: [Sample Teams Smogon](https://www.smogon.com/forums/threads/sv-ou-sample-teams-new-samples-added-post-scl-olt.3712513/)."
    },
    {
      question: "Come funzionano i tornei su Smogon?",
      answer: `Smogon ospita numerosi tornei con formati diversi, dalle competizioni individuali ai team tournaments. Se vuoi capire meglio il funzionamento dei tornei, puoi guardare questo video esplicativo:

[![Guida ai Tornei](https://img.youtube.com/vi/-w3rQcc7v1w/0.jpg)](https://www.youtube.com/watch?v=-w3rQcc7v1w)`
    },
    {
      question: "Su Smogon ci sono troppi formati, qual è la differenza tra di loro?",
      answer: `Smogon suddivide i formati in base alla potenza dei Pokémon:

* **OU (OverUsed):** Il formato principale, con i Pokémon più bilanciati e usati
* **Ubers:** Formato senza banlist, dove si possono usare i Pokémon più forti e normalmente vietati dal formato principale
* **UU (UnderUsed), RU (RarelyUsed), NU (NeverUsed), PU, LC (Little Cup):** Formats che dipendono dall'usage dei Pokemon, dove Pokémon meno popolari trovano spazio
* **LC (Little Cup):** Formato dedicato ai Pokémon non evoluti al livello 5
* **Random Battle:** Formato più casual e accessibile, con team generati casualmente

Attualmente, **Gen 9 OU** è il formato principale, ma ci sono tornei in quasi tutte le tier. E' possibile anche giocare le Old Gens.`
    }
  ] : [
    {
      question: "What is Judgment Fleet?",
      answer: "Judgment Fleet is an Italian community of competitive Pokémon players who primarily operate on Pokémon Showdown and follow Smogon's competitive standards. Our goal is to bring together the best Italian players and promote the development of the competitive scene in Italy."
    },
    {
      question: "How can I join Judgment Fleet?",
      answer: "Access to Judgment Fleet is selective and invitation-based. You don't necessarily need to be an extremely experienced player, but you need to be interested in engaging with the community. If you're interested, contact us and we'll keep an eye on you."
    },
    {
      question: "What is Smogon?",
      answer: "Smogon is the longest-running and most important competitive Pokémon community in the world. Unlike VGC, it primarily offers single battle formats rather than double battles. Although VGC is the official format of The Pokémon Company, Smogon boasts approximately 500,000 registered users on the platform and you have every tournament just a click away."
    },
    {
      question: "How can I improve as a competitive player?",
      answer: "By playing a lot and analyzing replays from more experienced players. A great way to learn is by watching educational content and match breakdowns from top players. We recommend checking out Blunder's [YouTube channel](https://www.youtube.com/@Thunderblunder777)., one of the best content creators in the competitive Pokémon scene."
    },
    {
      question: "I don't have teams, how do I start playing?",
      answer: "A great way to start is by using Sample Teams, which are pre-built teams created by experienced players and approved by the community. You can find them here: [Sample Teams Smogon](https://www.smogon.com/forums/threads/sv-ou-sample-teams-new-samples-added-post-scl-olt.3712513/)."
    },
    {
      question: "How do Smogon tournaments work?",
      answer: `Smogon hosts a variety of tournaments, ranging from individual competitions to team tournaments. If you want to understand better how tournaments work, check out this video explanation:

[![Tournament Guide](https://img.youtube.com/vi/-w3rQcc7v1w/0.jpg)](https://www.youtube.com/watch?v=-w3rQcc7v1w)`
    },
    {
      question: "Smogon has so many formats, what's the difference between them?",
      answer: `Smogon divides formats based on Pokémon power levels:

* **OU (OverUsed):** The main format, featuring the most balanced and commonly used Pokémon
* **Ubers:** A no-banlist format where the strongest Pokémon, normally banned from the main format, can be used
* **UU (UnderUsed), RU (RarelyUsed), NU (NeverUsed), PU, LC (Little Cup):** Formats based on Pokémon usage, where less common Pokémon find a place
* **LC (Little Cup):** A format dedicated to unevolved Pokémon at level 5
* **Random Battle:** A more casual and accessible format with randomly generated teams

Currently, **Gen 9 OU** is the main format, but tournaments exist for almost all tiers. It is also possible to play Old Gens.`
}

  ];

  const renderAnswer = (answer: string) => {
    return (
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400" />
            ),
            img: ({ node, ...props }) => (
              <img {...props} className="my-4 rounded-lg" loading="lazy" />
            ),
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-jf-dark text-white relative">
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-8 w-8 text-[#D946EF]" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">{translations.frequentlyAskedQuestions}</h1>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-jf-gray/30 border border-white/10 rounded-lg px-6 overflow-hidden">
                <AccordionTrigger className="text-xl font-medium py-5 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {renderAnswer(item.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">{translations.otherQuestions}</p>
          <Button 
            className="bg-[#D946EF] hover:bg-[#D946EF]/90"
            onClick={() => window.open('https://twitter.com/JudgmentFleet', '_blank')}
          >
            <Twitter size={18} className="mr-2" />
            {translations.contactTwitter}
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
