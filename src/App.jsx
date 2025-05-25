import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Portfolio from "./components/Portfolio"
import Testimonials from "./components/Testimonials"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <Hero />
        <Portfolio />
        <About />
        <Education />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
