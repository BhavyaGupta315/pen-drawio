import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-xl font-bold">pen-drawio</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Create beautiful drawings and diagrams with our intuitive drawing tool. 
              Perfect for designers, developers, and creative minds.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-gray-400 flex gap-4">
              <a href="https://github.com/BhavyaGupta315" className="hover:text-white transition-colors"><Github/></a>
              <a href="https://www.linkedin.com/in/bhavya-gupta-623981280/" className="hover:text-white transition-colors"><Linkedin/></a>
              <a href="https://x.com/Bhavya_Gupta315" className="hover:text-white transition-colors"><Twitter/></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 pen-drawio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}