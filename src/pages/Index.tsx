
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedGames from "@/components/home/FeaturedGames";
import PlayerShowcase from "@/components/home/PlayerShowcase";
import NewsSection from "@/components/home/NewsSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedGames />
      <PlayerShowcase />
      <NewsSection />
      <CallToAction />
    </Layout>
  );
};

export default Index;
