import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { TrustBar } from './components/TrustBar.jsx'
import { About } from './components/About.jsx'
import { Solutions } from './components/Solutions.jsx'
import { ProcessTimeline } from './components/ProcessTimeline.jsx'
import { Cases } from './components/Cases.jsx'
import { StackFormacion } from './components/StackFormacion.jsx'
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
        <TrustBar />
        <About />
        <Solutions />
        <ProcessTimeline />
        <Cases />
        <StackFormacion />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
