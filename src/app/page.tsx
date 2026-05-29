import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Solutions } from "@/components/Solutions";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
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
      <Marquee />
      <About />
      <Solutions />
      <Services />
      <Process />
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
