import { HomeAboutPreview } from "./components/HomeAboutPreview";
import { HomeContacts } from "./components/HomeContacts";
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
      <HomeContacts />
    </>
  );
};
