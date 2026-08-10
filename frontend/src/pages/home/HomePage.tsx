import PublicLayout from "../../layouts/PublicLayout";

import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DestinationsSection } from "@/components/home/DestinationSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RecommendationsSection } from "@/components/home/RecommendationSection";
import { ItinerarySection } from "@/components/home/ItenerarySection";
import { ProvinceExplorer } from "@/components/home/ProvinceExplorer";
import { StatsSection } from "@/components/home/StatsSection";
import { HeroSection } from "@/components/home/HeroSection";

const HomePage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <DestinationsSection />
      <HowItWorksSection />
      <RecommendationsSection />
      <ItinerarySection />
      <ProvinceExplorer />
      <StatsSection />
    </PublicLayout>
  );
};

export default HomePage;