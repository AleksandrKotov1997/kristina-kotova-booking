import { HomeAboutPreview } from "./components/HomeAboutPreview";
import { HomeHero } from "./components/HomeHero";
import { HomeServicesPreview } from "./components/HomeServicesPreview";
import { HomeWorksPreview } from "./components/HomeWorksPreview";

export const HomeView = () => {
  return (
    <>
      <HomeHero />
      <HomeServicesPreview />
      <HomeWorksPreview />
      <HomeAboutPreview />
    </>
  );
};
