import Nav from '../components/Nav.jsx'
import Hero from '../components/Hero.jsx'
import Overview from '../components/Overview.jsx'
import Team from '../components/Team.jsx'
import Research from '../components/Research.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'

// Home — the original editorial site. Splash route ("/") sits in front of it;
// users land there first, then click the CTA to navigate here.
export default function Home() {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <Overview />
        <Team />
        <Research />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
