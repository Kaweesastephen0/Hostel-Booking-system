
import styles from '../components/homePage/HostelList.module.css'
import { Menu, Home, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../components/sidebar/sidebarMenu';
 const HostelHeader=()=>{
    const navigate= useNavigate();

    const goToLogin=()=>{
    navigate('../homePage/AuthModal')
  }

    return(
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
              <h6 className={styles.brandName} >MUK-Book</h6>
            </div>
            <h5 className={styles.brandPhone} ><a href="tel:+256709167919">Tel: +256709167919</a></h5>
          </div>

          <button className={styles.userBtn} onClick={goToLogin}>
            <UserPlus size={32} />
          </button>
        </div>
      </header>
    )
}
export default HostelHeader;