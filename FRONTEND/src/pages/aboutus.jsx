// import React from 'react';
// import { Link } from 'react-router-dom';
// import './aboutus.css';
// // import {
// //   School,
// //   Security,
// //   Groups,
// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   School,
//   Search,
//   AttachMoney,
//   Security,
//   SupportAgent,
//   VerifiedUser,
//   TrendingUp,
//   Groups,
//   Schedule,
//   EmojiEvents,
//   Target,
//   TravelExplore,
//   Star,
//   Home,
//   Phone,
//   Explore,
//   LocationOn,
//   Wifi,
//   LocalLaundryService,
//   Restaurant,
//   FitnessCenter,
//   AcUnit,
//   Pets,
//   Park,
//   ElectricBolt,
//   WaterDrop,
//   Tv,
//   LocalParking,
//   TrendingUp,
//   EmojiEvents,
//   Target,
//   TravelExplore,
//   KeyboardDoubleArrowRight,
//   KeyboardDoubleArrowDown,
//   PlayArrow,
//   Pause,
//   Diversity3,
//   Handshake,
//   Eco,
//   Speed,
//   AutoAwesome
// } from '@mui/icons-material';
// import styles from './aboutus.module.css';

// const AboutUs = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const sectionRefs = useRef([]);

//   useEffect(() => {
//     setIsVisible(true);

//     // Auto-rotate features
//     let interval;
//     if (isPlaying) {
//       interval = setInterval(() => {
//         setActiveFeature(prev => (prev + 1) % features.length);
//       }, 4000);
//     }

//     // Scroll progress
//     const handleScroll = () => {
//       const winHeight = window.innerHeight;
//       const docHeight = document.documentElement.scrollHeight - winHeight;
//       const scrollTop = window.pageYOffset;
//       setScrollProgress((scrollTop / docHeight) * 100);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [isPlaying]);

//   // Team Members
//   const teamMembers = [
//     {
//       name: "Sarah K.",
//       role: "Co-Founder & CEO",
//       image: "👩‍💼",
//       description: "Former Makerere University student who experienced hostel hunting challenges firsthand"
//     },
//     {
//       name: "David M.",
//       role: "Chief Technology Officer",
//       image: "👨‍💻",
//       description: "Tech enthusiast passionate about building seamless digital experiences for students"
//     },
//     {
//       name: "Grace L.",
//       role: "Operations Head",
//       image: "👩‍🎓",
//       description: "Ensures every listed hostel meets our strict quality and safety standards"
//     },
//     {
//       name: "Mike T.",
//       role: "Partnerships Manager",
//       image: "🤝",
//       description: "Connects with hostel owners to expand our network across Uganda"
//     }
//   ];

//   // Timeline Data
//   const timelineData = [
//     {
//       year: '2023',
//       event: 'Platform Launch',
//       icon: '🚀',
//       milestone: 'First 100 successful bookings'
//     },
//     {
//       year: '2024',
//       event: 'Expansion Phase',
//       icon: '🏠',
//       milestone: '100+ hostels across 5 major cities'
//     },
//     {
//       year: '2024',
//       event: 'Mobile App',
//       icon: '📱',
//       milestone: '5000+ app downloads'
//     },
//     {
//       year: '2025',
//       event: 'Nationwide Reach',
//       icon: '🌍',
//       milestone: 'Countrywide coverage achieved'
//     }
//   ];

//   // Stats Counter Component
//   const Counter = ({ end, duration = 2000 }) => {
//     const [count, setCount] = useState(0);
//     const [hasAnimated, setHasAnimated] = useState(false);
//     const ref = useRef(null);

//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting && !hasAnimated) {
//             let start = 0;
//             const increment = end / (duration / 16);
//             const timer = setInterval(() => {
//               start += increment;
//               if (start >= end) {
//                 setCount(end);
//                 clearInterval(timer);
//                 setHasAnimated(true);
//               } else {
//                 setCount(Math.ceil(start));
//               }
//             }, 16);
//           }
//         },
//         { threshold: 0.5 }
//       );

//       if (ref.current) {
//         observer.observe(ref.current);
//       }

//       return () => observer.disconnect();
//     }, [end, duration, hasAnimated]);

//     return <span ref={ref}>{count}</span>;
//   };

//   const features = [
//     {
//       icon: <LocationOn sx={{ fontSize: 28 }} />,
//       title: "Prime Locations",
//       description: "Hostels near campus with easy access to university facilities"
//     },
//     {
//       icon: <Wifi sx={{ fontSize: 28 }} />,
//       title: "High-Speed Internet",
//       description: "Reliable Wi-Fi for studies and entertainment"
//     },
//     {
//       icon: <LocalLaundryService sx={{ fontSize: 28 }} />,
//       title: "Laundry Facilities",
//       description: "Clean and convenient laundry services"
//     },
//     {
//       icon: <Restaurant sx={{ fontSize: 28 }} />,
//       title: "Meal Plans",
//       description: "Affordable and nutritious meal options"
//     },
//     {
//       icon: <FitnessCenter sx={{ fontSize: 28 }} />,
//       title: "Fitness Centers",
//       description: "Stay active with on-site fitness facilities"
//     },
//     {
//       icon: <Security sx={{ fontSize: 28 }} />,
//       title: "24/7 Security",
//       description: "Round-the-clock security for your peace of mind"
//     }
//   ];

//   const amenities = [
//     { icon: <AcUnit />, name: "Air Conditioning" },
//     { icon: <Wifi />, name: "Free Wi-Fi" },
//     { icon: <LocalLaundryService />, name: "Laundry" },
//     { icon: <Restaurant />, name: "Cafeteria" },
//     { icon: <FitnessCenter />, name: "Gym" },
//     { icon: <Pets />, name: "Pet Friendly" },
//     { icon: <Park />, name: "Green Spaces" },
//     { icon: <ElectricBolt />, name: "Backup Power" },
//     { icon: <WaterDrop />, name: "Hot Water" },
//     { icon: <Tv />, name: "Common TV" },
//     { icon: <LocalParking />, name: "Parking" },
//     { icon: <Security />, name: "CCTV" }
//   ];

//   const teamMembers = [
//     {
//       name: "Sarah K.",
//       role: "Co-Founder & CEO",
//       image: "👩‍💼",
//       description: "Former student who experienced hostel hunting challenges firsthand"
//     },
//     {
//       name: "David M.",
//       role: "CTO",
//       image: "👨‍💻",
//       description: "Tech enthusiast building seamless digital experiences"
//     },
//     {
//       name: "Grace L.",
//       role: "Operations Head",
//       image: "👩‍🎓",
//       description: "Ensures every hostel meets our quality standards"
//     },
//     {
//       name: "Mike T.",
//       role: "Partnerships",
//       image: "🤝",
//       description: "Connects with hostel owners to expand our network"
//     }
//   ];

//   return (
//     <div className={styles.aboutUsContainer}>
//       {/* Scroll Progress Bar */}
//       <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }}></div>

//       {/* Hero Section */}
//       <section className={styles.heroSection}>
//         <div className={styles.heroBackground}>
//           <div className={styles.floatingElement} style={{ '--delay': '0s' }}>🏠</div>
//           <div className={styles.floatingElement} style={{ '--delay': '1s' }}>🎓</div>
//           <div className={styles.floatingElement} style={{ '--delay': '2s' }}>🔑</div>
//           <div className={styles.floatingElement} style={{ '--delay': '3s' }}>⭐</div>
//         </div>

//         <div className={styles.heroContent}>
//           <div className={styles.textCenter}>
//             <div className={styles.heroBadge}>
//               <AutoAwesome sx={{ mr: 1, fontSize: 20 }} />
//               Trusted by 1000+ Students
//             </div>

//             <h1 className={styles.heroTitle}>
//               ABOUT <span className={styles.gradientText}>MUK-BOOK</span>
//             </h1>

//             <h2 className={styles.heroSubtitle}>
//               Your Trusted Hostel Booking Platform
//             </h2>

//             <p className={styles.heroDescription}>
//               Connecting students with safe, affordable, and comfortable hostel accommodations
//               across Uganda. Your perfect stay is just a click away!
//             </p>

//             {/* Animated Stats */}
//             <div className={styles.heroStats}>
//               <div className={styles.heroStat}>
//                 <div className={styles.heroStatNumber}>50+</div>
//                 <div className={styles.heroStatLabel}>Hostels</div>
//               </div>
//               <div className={styles.heroStat}>
//                 <div className={styles.heroStatNumber}>1000+</div>
//                 <div className={styles.heroStatLabel}>Students</div>
//               </div>
//               <div className={styles.heroStat}>
//                 <div className={styles.heroStatNumber}>98%</div>
//                 <div className={styles.heroStatLabel}>Satisfaction</div>
//               </div>
//             </div>

//             {/* CTA Buttons */}
//             <div className={styles.ctaButtons}>
//               <Link to="/hostels" className={styles.primaryButton}>
//                 <Explore sx={{ mr: 1 }} />
//                 Find Hostels
//                 <KeyboardDoubleArrowRight sx={{ ml: 1 }} />
//               </Link>
//               <Link to="/contact" className={styles.secondaryButton}>
//                 <Phone sx={{ mr: 1 }} />
//                 Contact Us
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className={styles.scrollIndicator}>
//           <KeyboardDoubleArrowDown sx={{ animation: `${styles.bounce} 2s infinite` }} />
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className={styles.statsSection}>
//         <div className={styles.container}>
//           <div className={styles.sectionHeader}>
//             <h2 className={styles.sectionTitle}>Why Students Choose Us</h2>
//             <p className={styles.sectionSubtitle}>
//               Numbers that speak about our commitment to student accommodation
//             </p>
//           </div>

//           <div className={styles.statsGrid}>
//             {[
//               { number: 50, label: 'Hostels Listed', suffix: '+', icon: <Home sx={{ fontSize: 40 }} />, color: '#2563eb' },
//               { number: 1000, label: 'Happy Students', suffix: '+', icon: <Groups sx={{ fontSize: 40 }} />, color: '#dc2626' },
//               { number: 24, label: 'Support', suffix: '/7', icon: <SupportAgent sx={{ fontSize: 40 }} />, color: '#059669' },
//               { number: 98, label: 'Satisfaction Rate', suffix: '%', icon: <Star sx={{ fontSize: 40 }} />, color: '#d97706' }
//             ].map((stat, index) => (
//               <div key={index} className={styles.statCard}>
//                 <div className={styles.statIcon} style={{ color: stat.color }}>
//                   {stat.icon}
//                 </div>
//                 <div className={styles.statNumber} style={{ '--color': stat.color }}>
//                   <Counter end={stat.number} />{stat.suffix}
//                 </div>
//                 <div className={styles.statLabel}>{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Carousel */}
//       <section className={styles.featuresSection}>
//         <div className={styles.container}>
//           <div className={styles.sectionHeader}>
//             <h2 className={styles.sectionTitle}>What Makes Us Different</h2>
//             <p className={styles.sectionSubtitle}>
//               Features designed specifically for student needs
//             </p>
//           </div>

//           <div className={styles.featuresCarousel}>
//             <div className={styles.carouselContainer}>
//               <div
//                 className={styles.carouselTrack}
//                 style={{ transform: `translateX(-${activeFeature * 100}%)` }}
//               >
//                 {features.map((feature, index) => (
//                   <div key={index} className={styles.carouselSlide}>
//                     <div className={styles.featureCard}>
//                       <div className={styles.featureIcon}>
//                         {feature.icon}
//                       </div>
//                       <h3 className={styles.featureTitle}>{feature.title}</h3>
//                       <p className={styles.featureDescription}>{feature.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className={styles.carouselControls}>
//               <button
//                 className={styles.controlButton}
//                 onClick={() => setIsPlaying(!isPlaying)}
//               >
//                 {isPlaying ? <Pause /> : <PlayArrow />}
//               </button>
//               <div className={styles.carouselDots}>
//                 {features.map((_, index) => (
//                   <button
//                     key={index}
//                     className={`${styles.dot} ${index === activeFeature ? styles.activeDot : ''}`}
//                     onClick={() => setActiveFeature(index)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className={styles.storySection}>
//         <div className={styles.container}>
//           <div className={styles.storyGrid}>
//             {/* Story Content */}
//             <div>
//               <div className={styles.storyBadge}>
//                 <TrendingUp sx={{ mr: 1 }} />
//                 Our Story
//               </div>
//               <h2 className={styles.storyTitle}>
//                 From Student Struggles to{' '}
//                 <span className={styles.highlight}>
//                   Seamless Stays
//                 </span>
//               </h2>

//               <div className={styles.storyFeatures}>
//                 <div className={styles.storyFeature}>
//                   <div className={styles.featureIcon}>
//                     <School sx={{ fontSize: 30 }} />
//                   </div>
//                   <div>
//                     <h4>Student-First Approach</h4>
//                     <p className={styles.featureText}>
//                       Founded by university students who understood the challenges of finding quality accommodation near campus.
//                     </p>
//                   </div>
//                 </div>

//                 <div className={styles.storyFeature}>
//                   <div className={styles.featureIcon}>
//                     <Search sx={{ fontSize: 30 }} />
//                   </div>
//                   <div>
//                     <h4>Verified Quality</h4>
//                     <p className={styles.featureText}>
//                       We verify every hostel to ensure safety, cleanliness, and student-friendly environments.
//                     </p>
//                   </div>
//                 </div>

//                 <div className={styles.storyFeature}>
//                   <div className={styles.featureIcon}>
//                     <AttachMoney sx={{ fontSize: 30 }} />
//                   </div>
//                   <div>
//                     <h4>Affordable Pricing</h4>
//                     <p className={styles.featureText}>
//                       Transparent costs with no hidden fees - designed for student budgets.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Timeline */}
//             <div className={styles.timelineCard}>
//               <h3 className={styles.timelineTitle}>
//                 <EmojiEvents sx={{ mr: 1, fontSize: 30 }} />
//                 Our Journey
//               </h3>
//               <div className={styles.timelineItems}>
//                 {[
//                   { year: '2023', event: 'Platform Launch', icon: '🚀', milestone: 'First 100 bookings' },
//                   { year: '2024', event: '100+ Hostels', icon: '🏠', milestone: 'Expanded to 5 cities' },
//                   { year: '2024', event: 'Mobile App', icon: '📱', milestone: '5000+ downloads' },
//                   { year: '2025', event: 'Nationwide', icon: '🌍', milestone: 'Countrywide coverage' }
//                 ].map((item, index) => (
//                   <div key={index} className={styles.timelineItem}>
//                     <div className={styles.timelineYear}>
//                       {item.year}
//                     </div>
//                     <div className={styles.timelineContent}>
//                       <h4 className={styles.timelineEvent}>
//                         <span style={{ marginRight: '8px' }}>{item.icon}</span>
//                         {item.event}
//                       </h4>
//                       <p className={styles.timelineMilestone}>{item.milestone}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className={styles.teamSection}>
//         <div className={styles.container}>
//           <div className={styles.sectionHeader}>
//             <h2 className={styles.sectionTitle}>Meet Our Team</h2>
//             <p className={styles.sectionSubtitle}>
//               Passionate individuals dedicated to improving student accommodation
//             </p>
//           </div>

//           <div className={styles.teamGrid}>
//             {teamMembers.map((member, index) => (
//               <div key={index} className={styles.teamCard}>
//                 <div className={styles.teamImage}>
//                   {member.image}
//                 </div>
//                 <h3 className={styles.teamName}>{member.name}</h3>
//                 <p className={styles.teamRole}>{member.role}</p>
//                 <p className={styles.teamDescription}>{member.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Amenities Section */}
//       <section className={styles.amenitiesSection}>
//         <div className={styles.container}>
//           <div className={styles.sectionHeader}>
//             <h2 className={styles.sectionTitle}>Common Amenities</h2>
//             <p className={styles.sectionSubtitle}>
//               Everything you need for a comfortable student life
//             </p>
//           </div>

//           <div className={styles.amenitiesGrid}>
//             {amenities.map((amenity, index) => (
//               <div key={index} className={styles.amenityItem}>
//                 <div className={styles.amenityIcon}>
//                   {amenity.icon}
//                 </div>
//                 <span className={styles.amenityName}>{amenity.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Mission & Vision */}
//       <section className={styles.missionVisionSection}>
//         <div className={styles.container}>
//           <div className={styles.missionVisionGrid}>
//             {/* Mission */}
//             <div className={styles.missionCard}>
//               <div className={styles.cardIcon}>
//                 <Target sx={{ fontSize: 40 }} />
//               </div>
//               <h3 className={styles.cardTitle}>
//                 MISSION
//               </h3>
//               <p className={styles.cardText}>
//                 To provide every student with safe, affordable, and comfortable hostel accommodations
//                 through a seamless digital platform that prioritizes trust and convenience.
//               </p>
//               <div className={styles.cardValues}>
//                 <div className={styles.valueItem}>
//                   <Diversity3 sx={{ mr: 1 }} />
//                   Community Focus
//                 </div>
//                 <div className={styles.valueItem}>
//                   <Handshake sx={{ mr: 1 }} />
//                   Trust & Transparency
//                 </div>
//                 <div className={styles.valueItem}>
//                   <Eco sx={{ mr: 1 }} />
//                   Sustainability
//                 </div>
//                 <div className={styles.valueItem}>
//                   <Speed sx={{ mr: 1 }} />
//                   Efficiency
//                 </div>
//               </div>
//             </div>

//             {/* Vision */}
//             <div className={styles.visionCard}>
//               <div className={styles.cardIcon}>
//                 <TravelExplore sx={{ fontSize: 40 }} />
//               </div>
//               <h3 className={styles.cardTitle}>
//                 VISION
//               </h3>
//               <p className={styles.cardText}>
//                 To become Uganda's most trusted student accommodation platform, connecting students
//                 with their perfect home away from home while supporting hostel owners in growing their businesses.
//               </p>
//               <div className={styles.visionGoals}>
//                 <div className={styles.goalItem}>
//                   <div className={styles.goalNumber}>2025</div>
//                   <div className={styles.goalText}>Expand to 10+ universities nationwide</div>
//                 </div>
//                 <div className={styles.goalItem}>
//                   <div className={styles.goalNumber}>2026</div>
//                   <div className={styles.goalText}>Launch in neighboring countries</div>
//                 </div>
//                 <div className={styles.goalItem}>
//                   <div className={styles.goalNumber}>2027</div>
//                   <div className={styles.goalText}>Become East Africa's leading student platform</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className={styles.ctaSection}>
//         <div className={styles.ctaBackground}>
//           <div className={styles.ctaParticle} style={{ '--delay': '0s' }}>⭐</div>
//           <div className={styles.ctaParticle} style={{ '--delay': '1s' }}>🎓</div>
//           <div className={styles.ctaParticle} style={{ '--delay': '2s' }}>🏠</div>
//           <div className={styles.ctaParticle} style={{ '--delay': '3s' }}>🔑</div>
//         </div>

//         <div className={styles.ctaContent}>
//           <h2 className={styles.ctaTitle}>
//             Ready to Find Your
//             <span className={`${styles.ctaHighlight} ${styles.block}`}>
//               Perfect Hostel?
//             </span>
//           </h2>

//           <p className={styles.ctaSubtitle}>
//             Join thousands of students who've found their ideal accommodation through Muk-Book
//           </p>

//           <div className={styles.ctaButtonContainer}>
//             <Link to="/hostels" className={styles.primaryButton}>
//               <Explore sx={{ mr: 1 }} />
//               Browse Hostels Now
//               <KeyboardDoubleArrowRight sx={{ ml: 1 }} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Trust Indicators */}
//       <div className={styles.trustIndicators}>
//         <div className={styles.trustItem}>
//           <div className={styles.statusDot}></div>
//           <VerifiedUser sx={{ mr: 1, fontSize: 20 }} />
//           <span>Verified Hostels</span>
//         </div>
//         <div className={styles.trustItem}>
//           <div className={styles.statusDot}></div>
//           <Security sx={{ mr: 1, fontSize: 20 }} />
//           <span>Secure Payments</span>
//         </div>
//         <div className={styles.trustItem}>
//           <div className={styles.statusDot}></div>
//           <SupportAgent sx={{ mr: 1, fontSize: 20 }} />
//           <span>24/7 Support</span>
//         </div>
//       </div>
//     </div>
//       </section >
//     </div >
//   );
// };

// export default AboutUs;
