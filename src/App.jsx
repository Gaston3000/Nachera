import { Nav } from './components/Nav.jsx'
import { Hero } from './components/Hero.jsx'
import { TrustBar } from './components/TrustBar.jsx'
import { About } from './components/About.jsx'
import { ServicesGrid } from './components/ServicesGrid.jsx'
import { ProcessTimeline } from './components/ProcessTimeline.jsx'
import { ProjectsGrid } from './components/ProjectsGrid.jsx'
import { ExperienceTimeline } from './components/ExperienceTimeline.jsx'
import { CertGrid } from './components/CertGrid.jsx'
import { ToolStack } from './components/ToolStack.jsx'
import { FinalCTA } from './components/FinalCTA.jsx'
import { Footer } from './components/Footer.jsx'
import { ThemeSwitcher } from './theme/ThemeSwitcher.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <ServicesGrid />
        <ProcessTimeline />
        <ProjectsGrid />
        <ExperienceTimeline />
        <CertGrid />
        <ToolStack />
        <FinalCTA />
      </main>
      <Footer />
      <ThemeSwitcher />
    </>
  )
}
