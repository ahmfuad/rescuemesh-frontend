import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=2000')`,
          filter: 'blur(3px) brightness(0.5)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">🆘 RescueMesh Fuad ghosh</h1>
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-900 transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Emergency Response Platform
            </h1>
            <p className="text-xl md:text-3xl text-white mb-4 drop-shadow-xl">
              Connecting Communities During Disasters
            </p>
            <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto drop-shadow-lg">
              A real-time platform to coordinate rescue operations, match volunteers with victims, 
              and save lives during natural disasters in Bangladesh
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors shadow-2xl"
              >
                🆘 Get Help Now
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-2xl"
              >
                🤝 Volunteer to Help
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🚨</div>
                <h3 className="text-xl font-bold text-white mb-2">Emergency SOS</h3>
                <p className="text-blue-100">Send emergency requests instantly with your location</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-white mb-2">Real-time Map</h3>
                <p className="text-blue-100">Track disasters and emergency requests on live map</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Matching</h3>
                <p className="text-blue-100">AI-powered volunteer-victim matching system</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Alerts</h3>
                <p className="text-blue-100">Get notified about nearby emergencies and disasters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black/60 backdrop-blur-sm border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-blue-100">
              © 2026 RescueMesh - Emergency Response Platform for Bangladesh
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
