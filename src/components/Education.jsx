"use client"
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
      description: "Flutter development for iOS and Android with Dart programming language",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Industry Projects",
      description: "Real-world projects and hands-on experience with modern development practices",
    },
  ]

  const skills = [
    "React.js & Modern JavaScript",
    "Flutter & Dart",
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
      className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Education & Certifications
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Graduate of Information Technology Institute (ITI) specializing in Frontend & Cross-Platform Mobile
            Development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* ITI Information */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-primary p-3 rounded-full mr-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Information Technology Institute</h3>
                <p className="text-purple-600 dark:text-purple-400 font-semibold">
                  ITI - Egypt's Premier Tech Institute
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Award className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-semibold">Specialization:</span>
                <span className="ml-2">Frontend & Cross-Platform Mobile Application</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-semibold">Graduation Year:</span>
                <span className="ml-2">2025</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-semibold">Location:</span>
                <span className="ml-2">Egypt</span>
              </div>
            </div>

            <div className="bg-gradient-primary p-4 rounded-lg text-white">
              <h4 className="font-bold mb-2">Intensive Training Program</h4>
              <p className="text-sm opacity-90">
                4-month intensive training program focusing on the latest web and mobile development technologies with
                hands-on projects and industry training
              </p>
            </div>
          </div>

          {/* Skills & Achievements */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills Acquired</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-purple-600 dark:text-purple-400 mt-1">{achievement.icon}</div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{achievement.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ITI Recognition */}
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-primary p-4 rounded-full">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Information Technology Institute (ITI)
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              The Information Technology Institute is one of the most important technical institutes in Egypt and the
              Middle East, offering advanced training programs in the latest technologies with a focus on practical
              application and real projects. Graduating from ITI means receiving high-quality training and advanced
              technical skills that qualify for work in the best technology companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                Intensive Practical Training
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                Real Projects
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                Latest Technologies
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                Industry Standards
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
