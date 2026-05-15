import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Clients } from "@/components/Clients";
import { Education } from "@/components/Education";
import { ClientChecklist } from "@/components/ClientChecklist";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Clients />
      <Education />
      {/* Sección interna de armado. Quitar o desactivar antes de publicar. */}
      <ClientChecklist />
      <FinalCTA />
      <Footer />
    </main>
  );
}
