import { Menu, Home, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';
import styles from './HostelList.module.css';
import { useNavigate } from 'react-router-dom'; 
import FeaturedProperties from './featuredHostels';
import AffordableHostels from './AffordableHostel'
import { useEffect, useState } from 'react';
import Gallery from './gallery';
import HotelCard from '../hotelCard';
import Hero from './Hero';


function HostelList() {

  const [hostels, setHostels]= useState([]);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);
  

  const navigate= useNavigate();

  useEffect(()=>{
    const fetchHostels= async()=>{
      try{
        const response = await fetch('http://localhost:5001/api/hostels/hostel');
       
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`)

        }
        const result = await response.json();
        console.log(result)
        if(result.success && Array.isArray(result.data)){
          setHostels(result.data);

        }else{
          setHostels([])
        }
        console.log('API Response:', result);
      console.log('Type of data:', typeof result);
      console.log('Is array?', Array.isArray(result));
        // setHostels(data)
      } catch(error){
        console.error('Error fetching hostels:', error);
        setError('Failed to load hostels, Please try again later')

      } finally{
        setLoading(false)
      }

    }
    fetchHostels()
  }, [])

  const goToLogin=()=>{
    navigate('/login')
  }

  
  const formatePrice=(price)=>{
    return price?.toLocaleString() || '0'
  };

  const getHostelImage =(hostel) =>{
    return hostel.image || (hostel.image && hostel.images[0]) || 'https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg';
  }

  if(loading){
    return(
      <div>
        <div>Loading hostels...</div>
      </div>
    )

  }

  if(error){
    return (
      <div>
        <div>{error}</div>
      </div>
    )
  }

  
  return (
    <div className={styles.container}>
     <main className={styles.main}>
        <section className={styles.heroSection}>

        {/* la hero */}
          <Hero/>
          <div className={styles.searchBarWrapper}>
            <SearchBar />
          </div>
        </section>
        <FeaturedProperties hostels={hostels.filter(h=>h.featured)}/>
        <AffordableHostels/>

        <section className={styles.listingsSection}>
          <div>
            <h4 className={styles.sectionTitle}>All properties</h4>
          </div>
          

          <div className={styles.listingsScroll}>
            <div className={styles.listingsContainer}>
              {hostels.length === 0 ? (
                  <div className={styles.noHostels}>
                    No hostels found. Please check back later.
                  </div>
                ) : (
                  hostels.map((hostel, index) => (
                    <HotelCard
                    key={hostel._id}
                    hostel={hostel}
                    index={index}
                    />
                  ))
                )}
            </div>
          </div>
        </section>

        <Gallery/>
      </main>
    </div>
  );
}

export default HostelList;
// 😉
