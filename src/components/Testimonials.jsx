"use client"
import { Star, Quote } from "lucide-react"

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      position: "Technical Manager",
      company: "Advanced Technology Solutions",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Abdullah is a highly professional developer. He built a complete web application using MERN Stack with excellent quality and on time. I highly recommend working with him.",
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      position: "Startup Founder",
      company: "Mobile App Innovations",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The Flutter app that Abdullah developed exceeded my expectations completely. Beautiful design and excellent performance on both iOS and Android. Thank you!",
    },
    {
      id: 3,
      name: "Mohamed Ali",
      position: "Project Manager",
      company: "Digital Solutions Company",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Excellent expertise in React and Node.js. Abdullah understands requirements quickly and implements them accurately. Working with him was easy and very comfortable.",
    },
    {
      id: 4,
      name: "Fatima Hassan",
      position: "Digital Marketing Manager",
      company: "Creative Marketing Agency",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The e-commerce website that Abdullah built helped us increase sales by 200%. Modern technologies and fast performance.",
    },
    {
      id: 5,
      name: "Khaled Abdel Rahman",
      position: "Senior Developer",
      company: "Advanced Software Company",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "Clean and organized code, excellent documentation, and commitment to deadlines. Abdullah is a developer you can rely on for any project.",
    },
    {
      id: 6,
      name: "Nora Salem",
      position: "Product Manager",
      company: "Smart Health Applications",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: "The health app he developed using Flutter works smoothly and provides an excellent user experience. Outstanding professional performance.",
    },
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Client Testimonials</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Reviews and feedback from clients who worked with me on MERN Stack and Flutter projects
          </p>
        </div>

        {/* Overall Rating */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary p-6 rounded-2xl text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5.0</div>
              <div className="flex justify-center space-x-1 mb-2">{renderStars(5)}</div>
              <div className="text-sm opacity-90">From 25+ satisfied clients</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-200 dark:text-purple-800" />

              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex space-x-1 mb-4">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary p-8 rounded-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">Want to be the next satisfied client?</h3>
            <p className="text-xl mb-6 opacity-90">
              Join the list of satisfied clients and get outstanding technical solutions
            </p>
            <button
              onClick={() => document.querySelector("#contact").scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Start Your Project Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
