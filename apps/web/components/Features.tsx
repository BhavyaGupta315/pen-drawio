import { Image, Pencil, Users } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: (
          <Pencil className="w-8 h-8"/>
      ),
      title: "Intuitive Drawing",
      description: "Create beautiful drawings with our easy-to-use tools and intuitive interface."
    },
    {
      icon: (
        <Users className="w-8 h-8"/>
        
      ),
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time, see changes as they happen."
    },
    {
      icon: (
        <Image className="w-8 h-8"/>
      ),
      title: "Persistent Drawings",
      description: "Drawings are automatically saved in the cloud. Everything loads instantly exactly where you left off"
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to
            <span className="block bg-gradient-to-r from-gray-300 to-gray-900 bg-clip-text text-transparent">
              bring ideas to life
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make drawing and diagramming effortless and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-white border border-gray-300 hover:border-gray-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}