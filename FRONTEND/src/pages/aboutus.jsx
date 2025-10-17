import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Stats counter animation
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}+</span>;
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Hero Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Premium Badge Removed */}

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 text-white leading-none">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                ABOUT
              </span>
            </h1>
            
            <div className="w-64 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mb-12 rounded-full shadow-2xl"></div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12 text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                HOSTELBOOK
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white max-w-4xl mx-auto leading-relaxed mb-16 drop-shadow-2xl">
              Your Gateway to Unforgettable Hostel Adventures
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
              <Link
                to="/hostels"
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-16 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden border-2 border-cyan-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center">
                  Find Hostels
                  <svg className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="group relative border-2 border-white/40 hover:border-white text-white hover:bg-white/10 font-bold py-6 px-16 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105 backdrop-blur-lg shadow-2xl overflow-hidden"
              >
                <span className="relative flex items-center justify-center">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll Indicator Removed */}
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { number: 1, label: 'Countries', suffix: '', color: 'from-cyan-500 to-blue-500' },
              { number: 4, label: 'Hostels', suffix: '+', color: 'from-blue-500 to-purple-500' },
              { number: 98, label: 'Happy Guests', suffix: '%', color: 'from-green-500 to-emerald-500' },
              { number: 24, label: 'Support', suffix: '/7', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500`}></div>
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transform group-hover:scale-105 transition-all duration-500">
                    <div className={`text-5xl lg:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}>
                      {index === 0 ? <Counter end={stat.number} /> : stat.number}{stat.suffix}
                    </div>
                    <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
              {/* Story Content */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider mb-6">
                    Our Story
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
                    From Backpackers to{' '}
                    <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                      Global Leaders
                    </span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Born from a passion for travel and authentic experiences. We understand what travelers need.
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">🚀</span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Revolutionizing hostel bookings with technology that puts travelers first.
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">🌱</span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Building bridges between cultures and supporting local communities worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Our Journey
                </h3>
                <div className="space-y-6">
                  {[
                    { year: '2025', event: 'Founded', icon: '🏁' },
                    { year: '2025', event: 'Global Launch', icon: '🌍' },
                    { year: '2025', event: 'App Release', icon: '📱' },
                    { year: '2025', event: 'AI Powered', icon: '🤖' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg text-2xl">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-cyan-300 font-bold text-lg">{item.year}</div>
                        <h4 className="text-xl font-bold text-white">{item.event}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 transform group-hover:scale-105 transition-all duration-500">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                      <span className="text-3xl text-white">🎯</span>
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 mb-4">
                      MISSION
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed text-center">
                    Make extraordinary travel accessible to everyone through innovative technology and authentic experiences.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 transform group-hover:scale-105 transition-all duration-500">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                      <span className="text-3xl text-white">🌍</span>
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 mb-4">
                      VISION
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed text-center">
                    A world where every journey creates unforgettable memories and connects cultures across the globe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-blue-900/80 to-purple-900/90"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Ready to
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Explore?
              </span>
            </h2>
            
            <p className="text-xl text-blue-200 mb-12 leading-relaxed">
              Join our community of adventurous travelers
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/hostels"
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-16 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden border-2 border-cyan-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center">
                  Find Your Hostel
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span>Best Prices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span>Instant Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;