// components/hostels/shared/HostelSection.jsx
import React from 'react';
import { HostelCard } from './HostelCard';
import { useHostels } from '../../../hooks/useHostels';
import { formatDate } from '../../../utils/hostelUtils';
import styles from './HostelSection.module.css';

export const HostelSection = ({ 
  title, 
  endpoint, 
  variant = 'standard',
  showDate = false 
}) => {
  const { hostels, loading, error } = useHostels(endpoint);

  const sectionClass = styles[`${variant}Section`] || styles.standardSection;

  // Show skeleton loaders while loading (like YouTube)
  if (loading) {
    return (
      <section className={sectionClass}>
        <SectionHeader title={title} showDate={showDate} />
        <div className={styles.horizontalScrollContainer}>
          <div className={styles.loadingMessage}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.loadingSkeleton}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionClass}>
        <SectionHeader title={title} showDate={showDate} />
        <div className={styles.errorMessage}>{error}</div>
      </section>
    );
  }

  if (hostels.length === 0) {
    return (
      <section className={sectionClass}>
        <SectionHeader title={title} showDate={showDate} />
        <div className={styles.errorMessage}>No hostels available at the moment.</div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <SectionHeader title={title} showDate={showDate} />
      
      <div className={styles.horizontalScrollContainer}>
        <div className={styles.propertiesGridHorizontal}>
          {hostels.map((hostel) => (
            <HostelCard 
              key={hostel._id} 
              hostel={hostel}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title, showDate }) => (
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {showDate && (
      <div className={styles.headerInfo}>
        <span className={styles.language}>ENG</span>
        <span className={styles.date}>{formatDate()}</span>
      </div>
    )}
  </div>
);