import { useState } from "react";
import { hasConsented } from "@/lib/storage";
import CinematicLanding from "@/components/CinematicLanding";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const [consented, setConsented] = useState(hasConsented());

  if (!consented) {
    return <CinematicLanding onComplete={() => setConsented(true)} />;
  }

  return <Dashboard />;
};

export default Index;
