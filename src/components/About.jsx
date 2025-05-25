import { Code, Database, Smartphone, Cloud, Zap, Users } from "lucide-react"
import pic from '../../public/assets/images/dennis-irorere-yvB-g4g8Uj8-unsplash.jpg'
const About = () => {
  const skills = [
    {
      category: "Frontend",
      technologies: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
      icon: <Code className="w-8 h-8" />,
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "JWT", "Mongoose"],
      icon: <Database className="w-8 h-8" />,
    },
    {
      category: "Mobile",
      technologies: ["Flutter", "Dart", "Cross-platform Development", "Firebase", "Native Features"],
      icon: <Smartphone className="w-8 h-8" />,
    },
    {
      category: "Tools & DevOps",
      technologies: ["Git", "Github" ,"AWS", "Postman", "VS Code"],
      icon: <Cloud className="w-8 h-8" />,
    },
  ]

  const stats = [
    { number: "12+", label: "Projects Completed" },
    { number: "1+", label: "Years Experience" },
    { number: "15+", label: "Happy Clients" },
    { number: "MERN Stack", label: "Specialist" },
  ]

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Passionate full-stack developer with expertise in modern technologies and a proven track record of
            delivering exceptional digital solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Building Digital Excellence</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              With extensive experience in full-stack development, I specialize in the MERN Stack (MongoDB, Express.js,
              React, Node.js) to create scalable and high-performance web applications. My expertise extends to
              cross-platform mobile development using Flutter, enabling me to deliver comprehensive digital solutions
              across all platforms.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm passionate about writing clean, maintainable code and creating exceptional user experiences. My
              commitment to continuous learning keeps me at the forefront of modern web technologies, ensuring that
              every project leverages the most effective tools and best practices for optimal performance and
              scalability.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">Fast Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Team Collaboration</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={pic}
              alt="Developer workspace"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-primary p-6 rounded-lg text-white">
              <h4 className="text-2xl font-bold">1+</h4>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-4">{skill.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{skill.category}</h4>
              <div className="space-y-2">
                {skill.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
