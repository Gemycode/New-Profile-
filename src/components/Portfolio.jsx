"use client"

import { useState } from "react"
import { ExternalLink, Github, Filter } from "lucide-react"

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "E-Commerce MERN Application",
      description:
        "Full-stack e-commerce platform built with MERN Stack. Features user authentication, payment processing, admin dashboard, and real-time inventory management.",
      image: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjpegiovgaouz91cix6tr.png",
      technologies: ["React", "Node.js", "Express.js", "MongoDB", "Stripe", "JWT"],
      category: "web",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      id: 2,
      title: "Flutter Task Management App",
      description:
        "Cross-platform mobile app built with Flutter. Real-time task synchronization, offline functionality, push notifications, and beautiful Material Design UI.",
      image: "https://flutterawesome.com/content/images/2024/01/Code_2024-01_16-44-19.jpg",
      technologies: ["Flutter", "Dart", "Firebase", "Provider", "SQLite"],
      category: "mobile",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      id: 3,
      title: "MERN Social Media Platform",
      description:
        "Full-featured social media platform with real-time messaging, post sharing, and user interactions. Built with MERN Stack and Socket.io for real-time features.",
      image: "https://i.ytimg.com/vi/8VbR_kSy7Wc/maxresdefault.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express.js"],
      category: "web",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      id: 4,
      title: "Flutter E-Learning App",
      description:
        "Cross-platform educational app with video streaming, progress tracking, and offline content. Integrated with backend APIs for user management.",
      image: "https://cdn.dribbble.com/userupload/37184331/file/original-3cd590025093d01fdab58598a064285b.png?resize=752x&vertical=center",
      technologies: ["Flutter", "Dart", "Node.js", "MongoDB", "Video Player"],
      category: "mobile",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      id: 5,
      title: "MERN Inventory Management",
      description:
        "Comprehensive inventory management system with real-time tracking, reporting, and multi-user access. Built with MERN Stack for scalability.",
      image: "https://i.ytimg.com/vi/wlxx3SCHZKk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDn4Mk7nKyoyxhnzfeO1w0tsYqbOg",
      technologies: ["React", "Express.js", "MongoDB", "Node.js", "Chart.js"],
      category: "cloud",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      id: 6,
      title: "Flutter Finance Tracker",
      description:
        "Personal finance tracking app with expense categorization, budget planning, and financial insights. Cross-platform with secure data storage.",
      image: "https://miro.medium.com/v2/resize:fit:2000/1*5xJfgWCvkHBiAV5mzEGK3g.png",
      technologies: ["Flutter", "Dart", "SQLite", "Charts", "Biometric Auth"],
      category: "cloud",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
  ]

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "cloud", label: "Cloud Solutions" },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  return (
    <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">My Portfolio</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A showcase of my recent projects demonstrating expertise across web development, mobile apps, and cloud
            solutions.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-gradient-primary text-white shadow-lg"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Filter size={16} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* <div className="absolute bottom-4 left-4 right-4 flex space-x-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                    >
                      <Github size={18} />
                    </a>
                  </div> */}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-6">Want to see more of my work or discuss a project?</p>
          <button
            onClick={() => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
