import React, { useState, useEffect, useRef } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'website_contact_form'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
        
        if (formRef.current) {
          formRef.current.classList.add('animate-pulse');
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.classList.remove('animate-pulse');
            }
          }, 1000);
        }
        
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(
        error.message || 'Sorry, there was an error sending your message. Please try again or contact us directly.'
      );
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusMessage = () => {
    if (!submitStatus) return null;

    return (
      <div className={`rounded-2xl p-6 mb-6 border-2 transition-all duration-500 ${
        submitStatus === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
            submitStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {submitStatus === 'success' ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p className="font-semibold">{submitMessage}</p>
        </div>
      </div>
    );
  };

  const contactMethods = [
    {
      icon: '',
      title: 'Call Us',
      details: ['+256 709 167919', '+256 707 366082'],
      description: 'Available 24/7 for urgent inquiries',
      color: 'from-blue-500 to-cyan-500',
      link: 'tel:+256709167919'
    },
    {
      icon: '',
      title: 'Email Us',
      details: ['kampala@hostelbook.com', 'support@hostelbook.ug'],
      description: 'Typically respond within 2 hours',
      color: 'from-purple-500 to-pink-500',
      link: 'mailto:kampala@hostelbook.com'
    },
    {
      icon: '',
      title: 'Visit Us',
      details: ['Plot 123, Kampala Road', 'Kampala, Uganda'],
      description: 'Walk-ins welcome 8AM-8PM',
      color: 'from-green-500 to-emerald-500',
      link: 'https://maps.google.com/?q=Kampala,+Uganda'
    },
    {
      icon: '',
      title: 'WhatsApp',
      details: ['+256 759 546308', 'Instant messaging'],
      description: 'Quick responses via WhatsApp',
      color: 'from-green-600 to-green-700',
      link: 'https://wa.me/256759546308'
    }
  ];

  const teamMembers = [
    {
      name: 'Sam M.',
      role: 'Customer Support Manager',
      email: 'mubirusamuel002@gmail.com',
      phone: '+256 709 167919'
    },
    {
      name: 'Umar B.',
      role: 'Booking Specialist',
      email: 'umar@hostelbook.ug',
      phone: '+256 707 366082'
    },
    {
      name: 'Stephen',
      role: 'Travel Consultant',
      email: 'stephen@hostelbook.ug',
      phone: '+256 782 555 666'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-28 bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                CONTACT US
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Connect with our local experts and discover the authentic beauty of Uganda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Multiple ways to reach our Kampala-based team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <a 
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 text-center block"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                    <span className="text-2xl text-white">{method.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{method.title}</h3>
                  <div className="space-y-1 mb-3">
                    {method.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs">{method.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="space-y-8" ref={formRef}>
                <div>
                  <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider mb-6">
                    Send us a Message
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">
                    Let's Plan Your Ugandan Adventure
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Our local experts are ready to help you discover the best hostels in Uganda.
                  </p>
                </div>

                <StatusMessage />

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        required
                        disabled={isSubmitting}
                        className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white shadow-sm ${
                          activeField === 'name' 
                            ? 'border-yellow-500 ring-yellow-500/20' 
                            : 'border-gray-200'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        required
                        disabled={isSubmitting}
                        className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white shadow-sm ${
                          activeField === 'email' 
                            ? 'border-red-500 ring-red-500/20' 
                            : 'border-gray-200'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white shadow-sm ${
                        activeField === 'subject' 
                          ? 'border-orange-500 ring-orange-500/20' 
                          : 'border-gray-200'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      rows="6"
                      className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white shadow-sm resize-none ${
                        activeField === 'message' 
                          ? 'border-green-500 ring-green-500/20' 
                          : 'border-gray-200'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Tell us about your travel plans in Uganda..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Team Contact Cards */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Meet Our Kampala Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-1">{member.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-500">{member.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information & Map Section */}
              <div className="space-y-8">
                {/* Office Information */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                    Our Kampala Office
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl"></span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Main Office</h4>
                        <p className="text-yellow-200">Plot 123, Kampala Road</p>
                        <p className="text-yellow-200">Nakasero, Kampala</p>
                        <p className="text-yellow-200">Uganda</p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl"></span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Business Hours</h4>
                        <p className="text-red-200">Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p className="text-red-200">Saturday: 9:00 AM - 6:00 PM</p>
                        <p className="text-red-200">Sunday: 10:00 AM - 4:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl"></span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Local Expertise</h4>
                        <p className="text-green-200">Uganda Travel Specialists</p>
                        <p className="text-green-200">Safari & Adventure Planning</p>
                        <p className="text-green-200">Cultural Experience Guides</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Kampala Street Map */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {/* Google Street View Embed */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63846.66076215463!2d32.52940395820313!3d0.3475961999999945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb93dc34a0a5%3A0x8f243991e5dc0fae!2sKampala%2C%20Uganda!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Kampala Street Map - HostelBook Uganda"
                      className="absolute inset-0"
                    ></iframe>
                    
                    {/* Map Overlay Info */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="font-bold text-gray-800">HostelBook Uganda</span>
                      </div>
                      <p className="text-sm text-gray-600">Kampala Road Central</p>
                      <p className="text-xs text-gray-500">Heart of Uganda's capital</p>
                    </div>

                    {/* Street View Toggle */}
                    <div className="absolute bottom-4 right-4">
                      <a 
                        href="https://www.google.com/maps/@0.3475962,32.529404,15z?entry=ttu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        <span>🌐 Street View</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">Visit Our Kampala Office</h4>
                        <p className="text-sm text-gray-600">Experience Ugandan hospitality in the city center!</p>
                      </div>
                      <a 
                        href="https://maps.google.com/?q=Kampala+Road,+Kampala,+Uganda"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Response Info */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-white text-lg"></span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">East African Response Time</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Email: Response within 1 hour (EAT)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Phone: Immediate assistance</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>WhatsApp: Instant messaging</span>
                    </div>
                  </div>
                </div>

                {/* Local Landmarks */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-blue-500 mr-2"></span>
                    Nearby Landmarks
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Uganda Museum</span>
                      <span className="text-blue-600 font-semibold">2.1 km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Namirembe Cathedral</span>
                      <span className="text-blue-600 font-semibold">1.8 km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Owino Market</span>
                      <span className="text-blue-600 font-semibold">1.2 km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Nakasero Market</span>
                      <span className="text-blue-600 font-semibold">0.8 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Uganda Travel FAQs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-red-500 mx-auto mb-12 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  question: "Do you help with Uganda visa information?",
                  answer: "Yes! We provide up-to-date visa requirements and can assist with the application process."
                },
                {
                  question: "Can you arrange airport transfers in Entebbe?",
                  answer: "Absolutely! We offer airport transfer services from Entebbe to Kampala and beyond."
                },
                {
                  question: "Do you offer safari package deals?",
                  answer: "We partner with local safari operators to create unforgettable wildlife experiences."
                },
                {
                  question: "What areas in Kampala do you cover?",
                  answer: "We cover all major areas including Makerere, Kololo, Makindye, and surrounding neighborhoods."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;