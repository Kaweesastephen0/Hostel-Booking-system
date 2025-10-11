import { Menu, Home, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar';
import styles from './HostelList.module.css';
import { useNavigate } from 'react-router-dom'; 
import FeaturedProperties from './featuredHostels';


function HostelList() {

  const navigate= useNavigate();

  const hostels = [
    {
      id: 1,
      name: "Sun ways Hostel",
      address: "Wandegeya kikoni off Western gate",
      price: "400,000",
      image: "https://images.pexels.com/photos/20237982/pexels-photo-20237982.jpeg"
    },
    {
      id: 2,
      name: "Modern Living Apartments",
      address: "Kikoni Street, Near Main Gate",
      price: "500,000",
      image: "https://images.pexels.com/photos/18153132/pexels-photo-18153132.jpeg"
    },
    {
      id: 3,
      name: "Student Paradise",
      address: "Makerere University Road",
      price: "350,000",
      image: "https://images.pexels.com/photos/1838639/pexels-photo-1838639.jpeg"
    },
    {
      id: 4,
      name: "Campus Heights",
      address: "Wandegeya Main Street",
      price: "450,000",
      image: "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg"
    },
    {
      id: 5,
      name: "University Residence",
      address: "Kikoni Zone 3",
      price: "380,000",
      image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg"
    },
    {
      id: 6,
      name: "Scholar's Place",
      address: "Makerere Hill View",
      price: "420,000",
      image: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg"
    },
    {
      id: 7,
      name: "Elite Student Residence",
      address: "Makerere Main Campus",
      price: "550,000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    },
    {
      id: 8,
      name: "Comfort Suites",
      address: "Near Makerere Hospital",
      price: "390,000",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
    }
  ];

  const goToLogin=()=>{
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.menuBtn}>
            <Menu size={32} />
          </button>

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

        <FeaturedProperties />

        <section className={styles.listingsSection}>
          <div>
            <h4 className={styles.sectionTitle}>Featured Properties</h4>
          </div>

          <div className={styles.listingsScroll}>
            <div className={styles.listingsContainer}>
              {hostels.map((hostel) => (
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
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HostelList;
// 😉
