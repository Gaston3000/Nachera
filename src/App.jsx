import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { TrustBar } from './components/TrustBar.jsx'
import { About } from './components/About.jsx'
import { Solutions } from './components/Solutions.jsx'
import { ProcessTimeline } from './components/ProcessTimeline.jsx'
import { Cases } from './components/Cases.jsx'
import { BloopAgency } from './components/BloopAgency.jsx'
import { Herramientas } from './components/Herramientas.jsx'
import { FinalCTA } from './components/FinalCTA.jsx'
import { Footer } from './components/Footer.jsx'
import { ScrollProgress } from './components/ScrollProgress.jsx'

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        {/* La barra de roles cierra el capítulo de quién es (Fundador,
            Periodista, Lic. en Cs. de la Comunicación…): vive al final de
            Sobre mí y no entre el hero y la presentación, donde interrumpía
            el pasaje. */}
        <TrustBar />
        <Solutions />
        <ProcessTimeline />
        <Cases />
        <BloopAgency />
        <Herramientas />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
