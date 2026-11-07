"use client"
import { motion } from "framer-motion"
import { GraduationCap, Award, Calendar, MapPin, Code, Smartphone } from "lucide-react"

const Education = () => {
  const achievements = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description: "Advanced React.js, JavaScript ES6+, HTML5, CSS3, and modern frontend frameworks",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cross-Platform Mobile",
      description: "React Native development for iOS and Android with JavaScript programming language",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Industry Projects",
      description: "Real-world projects and hands-on experience with modern development practices",
    },
  ]

  const skills = [
    "React.js & Modern JavaScript",
    "React Native & JavaScript",
    "Mobile App Development",
    "Responsive Web Design",
    "State Management",
    "API Integration",
    "Version Control (Git)",
    "Agile Development",
  ]

  return (
    <section
      id="education"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50/60 via-slate-50/40 to-zinc-50/60 dark:from-gray-900/40 dark:via-slate-900/30 dark:to-slate-900/40 relative"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 dark:from-orange-600/20 dark:to-red-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 dark:from-orange-600/10 dark:to-red-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-6 md:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-6 py-3 bg-gradient-to-r from-orange-100/80 to-red-100/80 dark:from-orange-900/80 dark:to-red-900/80 backdrop-blur-sm border border-orange-200/30 dark:border-orange-700/30 rounded-full text-sm font-medium text-orange-700 dark:text-orange-300">
              🎓 Education & Certifications
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-slate-600 dark:from-orange-400 dark:via-red-400 dark:to-slate-400 bg-clip-text text-transparent">
              Education & Certifications
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Graduate of Information Technology Institute (ITI) specializing in Frontend & Cross-Platform Mobile
            Development
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* ITI Information */}
          <motion.div 
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-200/30 dark:border-blue-700/30 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <GraduationCap className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Information Technology Institute</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  ITI - Egypt's Premier Tech Institute
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <motion.div 
                className="flex items-center text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Award className="w-5 h-5 text-blue-500 mr-3" />
                <span className="font-semibold">Specialization:</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400">Frontend & Cross-Platform Mobile Application</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                <span className="font-semibold">Graduation Year:</span>
                <span className="ml-2 text-purple-600 dark:text-purple-400">2025</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MapPin className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="font-semibold">Location:</span>
                <span className="ml-2 text-indigo-600 dark:text-indigo-400">Egypt</span>
              </motion.div>
            </div>

            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="font-bold mb-2">Intensive Training Program</h4>
              <p className="text-sm opacity-90">
                4-month intensive training program focusing on the latest web and mobile development technologies with
                hands-on projects and industry training
              </p>
            </motion.div>
          </motion.div>

          {/* Skills & Achievements */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Skills Acquired</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-md text-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border border-blue-200/30 dark:border-blue-700/30 hover:border-blue-400/50 dark:hover:border-blue-500/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 hover:border-purple-400/50 dark:hover:border-purple-500/50"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <motion.div 
                      className="text-blue-500 mt-1"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{achievement.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ITI Recognition */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-indigo-200/30 dark:border-indigo-700/30 hover:shadow-2xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>
            <motion.h3 
              className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Information Technology Institute (ITI)
            </motion.h3>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              The Information Technology Institute is one of the most important technical institutes in Egypt and the
              Middle East, offering advanced training programs in the latest technologies with a focus on practical
              application and real projects. Graduating from ITI means receiving high-quality training and advanced
              technical skills that qualify for work in the best technology companies.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                Intensive Practical Training
              </span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                Real Projects
              </span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                Latest Technologies
              </span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
                Industry Standards
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Education
