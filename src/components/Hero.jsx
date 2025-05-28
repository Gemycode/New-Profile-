"use client"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import logo from '../../public/assets/images/logo.jpg'
const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="pt-16 md:pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div
        className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Profile Image */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            <div className="w-full h-full rounded-full bg-gradient-primary p-1">
              <img
                src={logo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"></div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              Hi, I'm <span className="text-gradient">Abdullah Gamal</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              Full-Stack Developer | MERN Stack Expert | Flutter Developer
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              I specialize in building scalable and high-performance web applications using the MERN Stack (MongoDB,
              Express, React, Node.js) and cross-platform mobile apps with Flutter. Passionate about clean code,
              exceptional user experience, and leveraging modern technologies to deliver impactful digital solutions
              that drive business growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => document.querySelector("#portfolio").scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View My Work
            </button>
            <button
              onClick={() => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })}
              className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-all duration-300"
            >
              Get In Touch
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/Gemycode"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-110 transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/abdullah-jamal-51181a214/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:abdallagamal00@outlook.sa"
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-110 transition-all duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowDown className="text-gray-600 dark:text-gray-400" size={32} />
        </button>
      </div>
    </section>
  )
}

export default Hero
