"use client"
import { Star, Quote, Award, TrendingUp, Users, CheckCircle } from "lucide-react"

const Testimonials = () => {
  const testimonials = [
    {
      id: 100,
      name: "أحمد العلي",
      position: "رائد أعمال",
      company: "شركة الحلول الذكية",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "تجربة رائعة جدًا! عبدالله ملتزم بالمواعيد وقدم لنا تطبيقًا احترافيًا بأعلى جودة. التواصل كان ممتاز وسريع في تنفيذ جميع التعديلات المطلوبة. أنصح بالتعامل معه بشدة." 
    },
    {
      id: 101,
      name: "سارة منصور",
      position: "مديرة تقنية المعلومات",
      company: "مؤسسة التقنية الحديثة",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "عبدالله مطور محترف وذو خبرة عالية. تعامل راقٍ واهتمام كبير بأدق التفاصيل. المشروع تم تسليمه قبل الموعد وبجودة فاقت توقعاتنا. بالتأكيد سيكون لنا تعاون مستقبلي معه." 
    },
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
      text: "The React Native app that Abdullah developed exceeded my expectations completely. Beautiful design and excellent performance on both iOS and Android. Thank you!",
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
      text: "The health app he developed using React Native works smoothly and provides an excellent user experience. Outstanding professional performance.",
    },
  ]

  // Delivery images for real clients
  const deliveryImages = [
    "/assets/images/clients pic/Screenshot 2025-07-04 190323.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190318.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190311.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190306.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190300.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190253.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190248.png",
    "/assets/images/clients pic/Screenshot 2025-07-04 190242.png",
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 transition-all duration-300 ${index < rating ? "text-yellow-400 fill-current drop-shadow-sm" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  return (
    <section id="testimonials" className="relative py-12 sm:py-16 md:py-20">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-zinc-50/80 dark:from-slate-900/90 dark:via-gray-900/80 dark:to-slate-800/90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted by 25+ Clients Worldwide</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-orange-800 to-red-800 dark:from-slate-200 dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent mb-3 md:mb-4">
            Client Success Stories
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover why leading companies choose our MERN Stack and React Native solutions for their digital transformation
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-slate-700/30 hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">5.0</div>
            <div className="flex justify-center space-x-1 mb-3">{renderStars(5)}</div>
            <p className="text-slate-600 dark:text-slate-400 text-center font-medium">Average Rating</p>
          </div>

          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-slate-700/30 hover:border-emerald-300/50 dark:hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">25+</div>
            <p className="text-slate-600 dark:text-slate-400 text-center font-medium">Happy Clients</p>
          </div>

          <div className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-slate-700/30 hover:border-slate-300/50 dark:hover:border-slate-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-1">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300">100%</div>
            <p className="text-slate-600 dark:text-slate-400 text-center font-medium">Success Rate</p>
          </div>
        </div>

        {/* Delivery Images Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3">نماذج من تسليمات العملاء على موقع خمسات</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {deliveryImages.map((img, idx) => (
              <div key={idx} className="group relative rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/30 hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
                <div>
                  <img 
                    src={img} 
                    alt="تسليم عميل فعلي" 
                    className="w-full h-24 sm:h-28 md:h-32 object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="text-sm font-medium">تسليم مكتمل</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 dark:border-slate-700/30 hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>

              {/* Client Info */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{testimonial.position}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{testimonial.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-6">{renderStars(testimonial.rating)}</div>

              {/* Testimonial Text */}
              <blockquote className="text-slate-600 dark:text-slate-400 leading-relaxed text-base relative">
                <span className="text-4xl text-orange-500/30 dark:text-orange-400/30 absolute -top-2 -left-2">"</span>
                {testimonial.text}
                <span className="text-4xl text-orange-500/30 dark:text-orange-400/30 absolute -bottom-4 -right-2">"</span>
              </blockquote>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-slate-700 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-slate-700 p-6 sm:p-8 md:p-10 rounded-3xl text-white text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                <span>Ready to Start Your Project?</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold mb-6">Join Our Success Stories</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into exceptional digital experiences with our proven expertise in MERN Stack and React Native development
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  className="group bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <span>Start Your Project Now</span>
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Free Consultation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
