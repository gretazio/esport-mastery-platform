
// Questo file è solo per riferimento e può essere eseguito una tantum 
// per migrare i dati esistenti dei membri al database Supabase
import { supabase } from "../integrations/supabase/client";

// Questo è l'array attuale di top players nella tua app
const topPlayers = [
  {
    id: "player1",
    name: "Empo",
    image: "https://www.smogon.com/forums/data/avatars/m/288/288721.jpg?1730056245",
    role: "GEN 6 OU, GEN 7 OU, GEN 8 OU, GEN 9 OU",
    joinDate: "September 2015",
    achievements: [
      "Official Smogon Tournament x1", 
      "Smogon Tournament x3", 
      "Smogon Masters x1",
      "Smogon Premier League x2",
      "World Cup of Pokemon x1",
      "Smogon Championship Circuit x1"
    ]
  },
  // ... tutti gli altri membri
];

export const migrateMembers = async () => {
  // Formatta i dati nel formato corretto per Supabase
  const membersToInsert = topPlayers.map(player => ({
    name: player.name,
    image: player.image,
    role: player.role,
    join_date: player.joinDate,
    achievements: player.achievements
  }));

  try {
    const { data, error } = await supabase
      .from('members')
      .insert(membersToInsert)
      .select();

    if (error) {
      throw error;
    }

    console.log('Migration successful:', data);
    return data;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Importa i best games
const games = [
  {
    id: 1,
    imageUrl: "/jf-assets/raiza.png",
    replayUrl: "https://replay.pokemonshowdown.com/smogtours-gen8ou-781566",
    tournament: "World Cup of Pokemon 2024",
    phase: "Finals",
    format: "Gen 8 OU",
    players: "Raiza vs Luthier",
    descriptionIt: "Raiza, con un team particolarmente non convenzionale per la tier, riesce a sconfiggere Luthier in un match-up molto complesso. Dopo aver trovato l'occasione giusta per rimuovere Volcanion, affronta al meglio Arctozolt, uno dei Pokemon più pericolosi per il team, prima di chiudere la partita con Volcarona.",
    descriptionEn: "Raiza, using a highly unconventional team for the tier, manages to defeat Luthier in a very challenging match-up. After finding the right opportunity to remove Volcanion, he plays at his best against Arctozolt, one of the main threats in his own team, before securing the win with Volcarona."
  },
  // ... tutti gli altri best games
];

export const migrateGames = async () => {
  // Formatta i dati nel formato corretto per Supabase
  const gamesToInsert = games.map(game => ({
    image_url: game.imageUrl,
    replay_url: game.replayUrl,
    tournament: game.tournament,
    phase: game.phase,
    format: game.format,
    players: game.players,
    description_it: game.descriptionIt,
    description_en: game.descriptionEn
  }));

  try {
    const { data, error } = await supabase
      .from('best_games')
      .insert(gamesToInsert)
      .select();

    if (error) {
      throw error;
    }

    console.log('Games migration successful:', data);
    return data;
  } catch (error) {
    console.error('Games migration failed:', error);
    throw error;
  }
};

// Sample data for FAQs
const faqs = [
  {
    question_it: "Che cos'è Judgment Fleet?",
    question_en: "What is Judgment Fleet?",
    answer_it: "Judgment Fleet è un clan italiano di Pokémon competitivo fondato nel 2015. Ci concentriamo principalmente sui tornei su Pokémon Showdown.",
    answer_en: "Judgment Fleet is an Italian competitive Pokémon clan founded in 2015. We focus primarily on tournaments on Pokémon Showdown.",
    position: 1,
    is_active: true
  },
  {
    question_it: "Come posso unirmi a Judgment Fleet?",
    question_en: "How can I join Judgment Fleet?",
    answer_it: "Puoi contattarci attraverso il nostro Discord o via email. Siamo sempre alla ricerca di giocatori appassionati!",
    answer_en: "You can contact us through our Discord or via email. We're always looking for passionate players!",
    position: 2,
    is_active: true
  }
];

export const migrateFAQs = async () => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert(faqs)
      .select();

    if (error) {
      throw error;
    }

    console.log('FAQs migration successful:', data);
    return data;
  } catch (error) {
    console.error('FAQs migration failed:', error);
    throw error;
  }
};

// Sample data for footer resources
const footerResources = [
  {
    title_it: "Smogon",
    title_en: "Smogon",
    url: "https://www.smogon.com/",
    icon: "external-link",
    category: "links",
    position: 1,
    is_active: true
  },
  {
    title_it: "Pokémon Showdown",
    title_en: "Pokémon Showdown",
    url: "https://play.pokemonshowdown.com/",
    icon: "gamepad-2",
    category: "links",
    position: 2,
    is_active: true
  },
  {
    title_it: "Discord",
    title_en: "Discord",
    url: "https://discord.gg/example",
    icon: "discord",
    category: "social",
    position: 1,
    is_active: true
  }
];

export const migrateFooterResources = async () => {
  try {
    const { data, error } = await supabase
      .from('footer_resources')
      .insert(footerResources)
      .select();

    if (error) {
      throw error;
    }

    console.log('Footer resources migration successful:', data);
    return data;
  } catch (error) {
    console.error('Footer resources migration failed:', error);
    throw error;
  }
};

// Run all migrations at once
export const migrateAll = async () => {
  try {
    console.log("Starting migration of all data...");
    
    const memberResults = await migrateMembers();
    const gameResults = await migrateGames();
    const faqResults = await migrateFAQs();
    const resourceResults = await migrateFooterResources();
    
    return {
      members: memberResults,
      games: gameResults,
      faqs: faqResults,
      resources: resourceResults
    };
  } catch (error) {
    console.error("Error during full migration:", error);
    throw error;
  }
};
