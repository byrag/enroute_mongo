import { useState } from "react";
import useToast from "./hooks/useToast";
import useReveal from "./hooks/useReveal";

import PageBackground from "./components/layout/PageBackground";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Toast from "./components/layout/Toast";

import Hero from "./features/landing/Hero";
import Stats from "./features/landing/Stats";
import Services from "./features/landing/Services";
import HowItWorks from "./features/landing/HowItWorks";
import Cta from "./features/landing/Cta";
import SearchBox from "./features/search/SearchBox";
import ExplorerSection from "./features/explorer/ExplorerSection";
import JourneysSection from "./features/journeys/JourneysSection";
import ParcelApiDemo from "./features/parcels/ParcelApiDemo";

const scrollToSearch = () =>
  document.getElementById("searchBox")?.scrollIntoView({ behavior: "smooth", block: "center" });

export default function App() {
  const { toast, message, visible } = useToast();
  const [mode, setMode] = useState("ride"); // "ride" | "parcel"
  const [draft, setDraft] = useState(null); // place picked on the map

  useReveal();

  // Hero buttons: switch mode and scroll to the search box
  const changeMode = (next, scroll = true) => {
    setMode(next);
    if (scroll) scrollToSearch();
  };

  // "Use as pickup / drop-off" on a map place card
  const usePlace = (place, field) => {
    setDraft({ field, value: place.tags.name, nonce: Date.now() });
    toast(`${field === "from" ? "Pickup" : "Drop-off"} set to ${place.tags.name}`);
    scrollToSearch();
  };

  return (
    <>
      <PageBackground />
      <Header toast={toast} />
      <Hero onMode={changeMode} />
      <Stats />
      <SearchBox mode={mode} onMode={changeMode} toast={toast} draft={draft} />
      <Services />
      <HowItWorks />
      <ExplorerSection toast={toast} onUsePlace={usePlace} />
      <JourneysSection toast={toast} />
      <ParcelApiDemo toast={toast} />
      <Cta />
      <Footer />
      <Toast message={message} visible={visible} />
    </>
  );
}
