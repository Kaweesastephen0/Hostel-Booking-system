import React, { useEffect, useState } from 'react';
import styles from './hero.module.css';
import {MapPin} from 'lucide-react'
import { FaHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';


export default function Hero() {
  const [ featuredHostels, setFeaturedHostels]=useState([])
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null)

  const navigate = useNavigate()

  useEffect(()=>{
    const fetchFeaturedHostels= async()=>{
      try{
        const response = await fetch(`http://localhost:5000/api/hostels/featured`);
        if(!response.ok){
          throw new Error(`HTTP error ! status: ${response.status}`)

        }
        const result= await response.json();
        console.log(result);
        if(result.success && Array.isArray(result.data)){
          //get the latest 3 featured hostels
          const latestThreeHostels = result.data
          .sort((a,b)=> new Date(b.createdAt)- new Date(a.createdAt))
          .slice(0,3);

          setFeaturedHostels(latestThreeHostels)
        } else{
          setFeaturedHostels([])
        }

      } catch(error){
        console.error("failed to fetch featured hostels", error)
        setError('Failed to load featured hostels')
      } finally{
        setLoading(false)
      }
    }
    fetchFeaturedHostels()
  },[])

  if(loading){
    return(
      <div>Loading featured hostels</div>
    )

  }
   if(error){
    return(
      <div>
        {error}
      </div>
    )

   }

   const handleHostelClick=(hostelId)=>{
     navigate(`/rooms/${hostelId}`)
   }

  return (
    <div className={styles.heroContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Left Content */}
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              As You build for the future
            </h1>
            <p className={styles.heroSubtitle}>
              Your Accommodation Matters
            </p>

            {/* Trending Place Section */}
            <div className={styles.trendingSection}>
              <div className={styles.trendingHeader}>
                <span className={styles.heartIcon}><FaHeart color='red'/></span>
                <span className={styles.trendingText}>Trending Hostels</span>
              </div>
              <div className={styles.trendingImages}>
                {featuredHostels.map((hostel,index)=>(
                  <div  key={hostel._id || index} className={styles.trendingImg} onClick={()=>handleHostelClick(hostel._id)}>
                  <img 
                    src= {hostel.image} 
                    alt="Building 1" 
                  />
                </div>
                ))}
                
                
              </div>
            </div>
          </div>

          {/* Right Content - Building Image with Stats */}
          <div className={styles.heroRight}>
            {/* Main Building Image Container */}
            <div className={styles.buildingContainer}>
              {/* Rating Badge */}
              <div className={styles.ratingBadge}>
                <span className={styles.starIcon}><FaStar color='yellow' size={25}/></span>
                <span className={styles.ratingText}>4.9 / 5.0</span>
                <div className={styles.avatars}>
                  <div className={`${styles.avatar} ${styles.avatar1}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar2}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar3}`}></div>
                  <div className={`${styles.avatar} ${styles.avatar4}`}></div>
                </div>
              </div>
              

              {/* Building Image */}
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=1000&fit=crop" 
                alt="Modern Building" 
                className={styles.buildingImage}
              />

              {/* Bottom Badge */}
              <div className={styles.dreamHomeBadge}>
                <div className={styles.badgeIcon}><MapPin /></div>
                <div className={styles.badgeText}>
                  <p>Get directions</p>
                  <p>to any Hostel</p>
                </div>
              </div>
            </div>

            {/* Stats on the Right */}
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>30+</div>
                <div className={styles.statLabel}>Amenities<br />deal</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Affordable<br />yet comfortable</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Real time <br />rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.searchBarWrapper}>
            <SearchBar />
          </div>
    </div>
  );
}