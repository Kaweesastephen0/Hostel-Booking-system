import { Menu, Home, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';
import styles from './HostelList.module.css';
import { useNavigate } from 'react-router-dom'; 
import FeaturedProperties from './featuredHostels';
import { useEffect, useState } from 'react';
import SidebarMenu from '../sidebar/sidebarMenu';


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
      <header className={styles.header}>
        <div className={styles.headerContent}>
                
            <SidebarMenu/>
          <div className={styles.sortOptions}>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>price</div>
            </div>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>distance</div>
            </div>
            <div className={styles.sortOption}>
              <div className={styles.sortLabel}>sort by</div>
              <div className={styles.sortValue}>Amenity</div>
            </div>
          </div>

          <div className={styles.branding}>
            <div className={styles.brandingTop}>
              <Home className={styles.brandIcon} size={24} />
              <h6 className={styles.brandName}>MUK-Book</h6>
            </div>
            <h5 className={styles.brandPhone}>Tel: +256709167919</h5>
          </div>

          <button className={styles.userBtn} onClick={goToLogin}>
            <UserPlus size={32} />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.quickBookingSidebar}>
              <p className={styles.quickBookingText}>Quick Booking</p>
            </div>

            <div className={styles.heroImageWrapper}>
              <img
                src="https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg"
                alt="Makerere University"
                className={styles.heroImage}
              />
              <div className={styles.heroTextOverlay}>
                <h1 className={styles.heroTitle}>
                  <span className={styles.heroTitleMain}>
                    AS YOU BUILD 4 THE FUTURE
                  </span>
                  <span className={styles.heroTitleSub}>
                    Accommodation matters
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className={styles.searchBarWrapper}>
            <SearchBar />
          </div>
        </section>

        <FeaturedProperties hostels={hostels.filter(h=>h.featured)}/>

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
                  hostels.map((hostel) => (
                    <div key={hostel._id || hostel.id} className={styles.hostelCard}>
                      <div className={styles.cardInner}>
                        <div className={styles.cardImageWrapper}>
                          <img
                            src={hostel.image || (hostel.images && hostel.images[0]) || 'https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg'}
                            alt={hostel.name}
                            className={styles.cardImage}
                          />
                          <div className={styles.rentBadge}>Rent</div>
                          {hostel.featured && (
                            <div className={styles.featuredBadge}>Featured</div>
                          )}
                        </div>

                        <div className={styles.cardContent}>
                          <div className={styles.cardInfoRow}>
                            <div className={styles.cardInfoLabel}>Apartment</div>
                            <div className={styles.cardInfoValue}>{hostel.name}</div>
                          </div>

                          <div className={styles.cardInfoRow}>
                            <div className={styles.cardInfoLabel}>Address</div>
                            <div className={styles.cardInfoValue}>{hostel.address}</div>
                          </div>

                          <div className={styles.cardPriceRow}>
                            <div>
                              <div className={styles.cardPriceLabel}>Price/Month</div>
                              <div className={styles.cardPrice}>
                                Shs. {hostel.price?.toLocaleString() || '0'}
                              </div>
                            </div>
                            
                            <div className={styles.cardRightSection}>
                              {hostel.rating && hostel.rating.average > 0 && (
                                <div className={styles.rating}>
                                  <span className={styles.ratingStar}>⭐</span>
                                  <span className={styles.ratingValue}>
                                    {hostel.rating.average} ({hostel.rating.count})
                                  </span>
                                </div>
                              )}
                              
                              <div className={styles.roomTypes}>
                                {hostel.roomTypes && (
                                  <div className={styles.roomAvailability}>
                                    {hostel.roomTypes.single > 0 && (
                                      <span className={styles.roomType}>Single: {hostel.roomTypes.single}</span>
                                    )}
                                    {hostel.roomTypes.double > 0 && (
                                      <span className={styles.roomType}>Double: {hostel.roomTypes.double}</span>
                                    )}
                                    {hostel.roomTypes.shared > 0 && (
                                      <span className={styles.roomType}>Shared: {hostel.roomTypes.shared}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {!hostel.availability && (
                            <div className={styles.unavailableBadge}>
                              Currently Unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              {/* {hostels.map((hostel) => (
                <div key={hostel.id} className={styles.hostelCard}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardImageWrapper}>
                      <img
                        src={hostel.image}
                        alt={hostel.name}
                        className={styles.cardImage}
                      />
                      <div className={styles.rentBadge}>Rent</div>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.cardInfoRow}>
                        <div className={styles.cardInfoLabel}>Apartment</div>
                        <div className={styles.cardInfoValue}>{hostel.name}</div>
                      </div>

                      <div className={styles.cardInfoRow}>
                        <div className={styles.cardInfoLabel}>Address</div>
                        <div className={styles.cardInfoValue}>{hostel.address}</div>
                      </div>

                      <div className={styles.cardPriceRow}>
                        <div>
                          <div className={styles.cardPriceLabel}>Price/Month</div>
                          <div className={styles.cardPrice}>Shs. {hostel.price}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HostelList;
// 😉
