import React from 'react';
import { Link } from 'react-router-dom';
import './aboutus.css';
import {
  School,
  Security,
  Groups,
  Star,
  Home,
  Phone,
  Explore,
  LocationOn,
  Wifi,
  LocalLaundryService,
  Restaurant,
  FitnessCenter,
  AcUnit,
  ElectricBolt,
  WaterDrop,
  Tv,
  LocalParking,
  TrendingUp,
  EmojiEvents,
  Target,
  TravelExplore,
  Diversity3,
  Handshake,
  Eco,
  Speed,
  AutoAwesome,
  VerifiedUser,
  SupportAgent,
  AttachMoney,
  KeyboardDoubleArrowRight,
  Send
} from '@mui/icons-material';

const AboutUs = () => {
  // Features Data
  const features = [
    {
      icon: <LocationOn style={{ fontSize: '2.5rem' }} />,
      title: "Prime Locations",
      description: "Hostels strategically located near campus with easy access to university facilities"
    },
    {
      icon: <Security style={{ fontSize: '2.5rem' }} />,
      title: "Verified Safety",
      description: "Every hostel undergoes thorough safety and security verification"
    },
    {
      icon: <AttachMoney style={{ fontSize: '2.5rem' }} />,
      title: "Budget-Friendly",
      description: "Affordable options designed specifically for student budgets"
    },
    {
      icon: <Wifi style={{ fontSize: '2.5rem' }} />,
      title: "High-Speed Internet",
      description: "Reliable Wi-Fi for both studies and entertainment"
    },
    {
      icon: <SupportAgent style={{ fontSize: '2.5rem' }} />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    },
    {
      icon: <VerifiedUser style={{ fontSize: '2.5rem' }} />,
      title: "Trusted Reviews",
      description: "Real feedback from fellow students to help you choose"
    }
  ];

  // Amenities Data
  const amenities = [
    { icon: <AcUnit />, name: "Air Conditioning" },
    { icon: <Wifi />, name: "Free Wi-Fi" },
    { icon: <LocalLaundryService />, name: "Laundry" },
    { icon: <Restaurant />, name: "Cafeteria" },
    { icon: <FitnessCenter />, name: "Gym" },
    { icon: <ElectricBolt />, name: "Backup Power" },
    { icon: <WaterDrop />, name: "Hot Water" },
    { icon: <Tv />, name: "Common TV" },
    { icon: <LocalParking />, name: "Parking" },
    { icon: <Security />, name: "CCTV Security" }
  ];

  // Team Members
  const teamMembers = [
    {
      name: "Sarah K.",
      role: "Co-Founder & CEO",
      image: "👩‍💼",
      description: "Former Makerere University student who experienced hostel hunting challenges firsthand"
    },
    {
      name: "David M.",
      role: "Chief Technology Officer",
      image: "👨‍💻",
      description: "Tech enthusiast passionate about building seamless digital experiences for students"
    },
    {
      name: "Grace L.",
      role: "Operations Head",
      image: "👩‍🎓",
      description: "Ensures every listed hostel meets our strict quality and safety standards"
    },
    {
      name: "Mike T.",
      role: "Partnerships Manager",
      image: "🤝",
      description: "Connects with hostel owners to expand our network across Uganda"
    }
  ];

  // Timeline Data
  const timelineData = [
    {
      year: '2023',
      event: 'Platform Launch',
      icon: '🚀',
      milestone: 'First 100 successful bookings'
    },
    {
      year: '2024',
      event: 'Expansion Phase',
      icon: '🏠',
      milestone: '100+ hostels across 5 major cities'
    },
    {
      year: '2024',
      event: 'Mobile App',
      icon: '📱',
      milestone: '5000+ app downloads'
    },
    {
      year: '2025',
      event: 'Nationwide Reach',
      icon: '🌍',
      milestone: 'Countrywide coverage achieved'
    }
  ];

  // Stats Counter Component
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = React.useState(0);
    
    React.useEffect(() => {
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

    return <span>{count}</span>;
  };

  return (
    <div className="aboutUsContainer">
      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroContent">
          <div className="heroBadge">
            <AutoAwesome style={{ marginRight: '8px' }} />
            Trusted by 1000+ Students
          </div>
          
          <h1 className="heroTitle">
            ABOUT <span className="gradientText">MUK-BOOK</span>
          </h1>
          
          <h2 className="heroSubtitle">
            Revolutionizing Student Accommodation in Uganda
          </h2>
          
          <p className="heroDescription">
            Born from the struggles of university students, Muk-Book is dedicated to making hostel 
            hunting simple, safe, and stress-free. We connect students with verified, affordable, 
            and comfortable accommodations near their campuses.
          </p>

          {/* Quick Stats */}
          <div className="heroStats">
            <div className="heroStat">
              <div className="heroStatNumber">50+</div>
              <div className="heroStatLabel">Verified Hostels</div>
            </div>
            <div className="heroStat">
              <div className="heroStatNumber">1000+</div>
              <div className="heroStatLabel">Happy Students</div>
            </div>
            <div className="heroStat">
              <div className="heroStatNumber">98%</div>
              <div className="heroStatLabel">Satisfaction Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="ctaButtons">
            <Link to="/hostels" className="primaryButton">
              <Explore style={{ marginRight: '8px' }} />
              Find Your Hostel
              <KeyboardDoubleArrowRight style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/contact" className="secondaryButton">
              <Phone style={{ marginRight: '8px' }} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="missionVisionSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Our Purpose & Vision</h2>
            <p className="sectionSubtitle">
              Dedicated to transforming student accommodation through technology and trust
            </p>
          </div>

          <div className="missionVisionGrid">
            {/* Mission Card */}
            <div className="missionCard">
              <div className="cardIcon">
                <Target style={{ fontSize: '3rem' }} />
              </div>
              <h3 className="cardTitle">OUR MISSION</h3>
              <p className="cardText">
                To eliminate the stress of finding student accommodation by providing a trusted platform 
                that connects students with safe, affordable, and comfortable hostels while ensuring 
                transparency and convenience throughout the process.
              </p>
              <div className="cardValues">
                <div className="valueItem">
                  <Diversity3 style={{ marginRight: '8px' }} />
                  Student Community Focus
                </div>
                <div className="valueItem">
                  <Handshake style={{ marginRight: '8px' }} />
                  Trust & Transparency
                </div>
                <div className="valueItem">
                  <Eco style={{ marginRight: '8px' }} />
                  Sustainable Partnerships
                </div>
                <div className="valueItem">
                  <Speed style={{ marginRight: '8px' }} />
                  Efficiency & Speed
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="visionCard">
              <div className="cardIcon">
                <TravelExplore style={{ fontSize: '3rem' }} />
              </div>
              <h3 className="cardTitle">OUR VISION</h3>
              <p className="cardText">
                To become Uganda's most trusted student accommodation platform, creating a seamless 
                ecosystem where every student finds their perfect home away from home, and hostel 
                owners thrive through digital transformation.
              </p>
              <div className="visionGoals">
                <div className="goalItem">
                  <div className="goalNumber">2025</div>
                  <div className="goalText">Expand to 10+ universities nationwide</div>
                </div>
                <div className="goalItem">
                  <div className="goalNumber">2026</div>
                  <div className="goalText">Launch in neighboring East African countries</div>
                </div>
                <div className="goalItem">
                  <div className="goalNumber">2027</div>
                  <div className="goalText">Become East Africa's leading student accommodation platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="statsSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Making a Difference</h2>
            <p className="sectionSubtitle">
              Our impact in numbers - transforming student accommodation experiences
            </p>
          </div>
          
          <div className="statsGrid">
            {[
              { 
                number: 50, 
                label: 'Hostels Listed', 
                suffix: '+', 
                icon: <Home style={{ fontSize: '3rem' }} />, 
                color: '#2563eb'
              },
              { 
                number: 1000, 
                label: 'Happy Students', 
                suffix: '+', 
                icon: <Groups style={{ fontSize: '3rem' }} />, 
                color: '#dc2626'
              },
              { 
                number: 24, 
                label: 'Support', 
                suffix: '/7', 
                icon: <SupportAgent style={{ fontSize: '3rem' }} />, 
                color: '#059669'
              },
              { 
                number: 98, 
                label: 'Satisfaction Rate', 
                suffix: '%', 
                icon: <Star style={{ fontSize: '3rem' }} />, 
                color: '#d97706'
              }
            ].map((stat, index) => (
              <div key={index} className="statCard">
                <div className="statIcon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="statNumber" style={{ color: stat.color }}>
                  <Counter end={stat.number} />{stat.suffix}
                </div>
                <div className="statLabel">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Why Choose Muk-Book?</h2>
            <p className="sectionSubtitle">
              Features designed with students in mind for the perfect accommodation experience
            </p>
          </div>

          <div className="featuresGrid">
            {features.map((feature, index) => (
              <div key={index} className="featureCard">
                <div className="featureIcon">
                  {feature.icon}
                </div>
                <h3 className="featureTitle">{feature.title}</h3>
                <p className="featureDescription">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="teamSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Meet Our Team</h2>
            <p className="sectionSubtitle">
              Passionate individuals dedicated to improving student accommodation experiences
            </p>
          </div>
          
          <div className="teamGrid">
            {teamMembers.map((member, index) => (
              <div key={index} className="teamCard">
                <div className="teamImage">
                  {member.image}
                </div>
                <h3 className="teamName">{member.name}</h3>
                <p className="teamRole">{member.role}</p>
                <p className="teamDescription">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="ctaSection">
        <div className="container">
          <div className="ctaContent">
            <h2 className="ctaTitle">
              Ready to Find Your Perfect Hostel?
            </h2>
            
            <p className="ctaSubtitle">
              Join thousands of students who've found their ideal accommodation through Muk-Book
            </p>

            <div className="ctaButtons">
              <Link to="/hostels" className="primaryButton">
                <Explore style={{ marginRight: '8px' }} />
                Browse All Hostels
                <KeyboardDoubleArrowRight style={{ marginLeft: '8px' }} />
              </Link>
              <Link to="/contact" className="secondaryButton">
                <Send style={{ marginRight: '8px' }} />
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;