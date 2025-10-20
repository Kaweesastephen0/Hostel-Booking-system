import React from 'react'
import { Parallax} from 'react-parallax'
import styles from './houseImage.module.css'

function houseImageOne() {
  return (
    <div>
        <Parallax className={styles.image}  bgImage='https://a0.muscache.com/im/pictures/hosting/Hosting-1349100984948750567/original/b190fc15-916c-4172-affc-6fdb05b0d5b1.jpeg?im_w=1200' bgImageAlt='outside view' strength={800} >
         <div className={styles.content}>
            <span>Out side view of Nalika kings hostel</span>
         </div>
        </Parallax>

         <Parallax className={styles.image}  bgImage='https://a0.muscache.com/im/pictures/hosting/Hosting-1349100984948750567/original/d39f8530-5e02-4352-9168-d83260feb000.jpeg?im_w=1200' bgImageAlt='outside view' strength={800} >
         <div className={styles.content}>
            <span>Balcony view of the city</span>
         </div>
        </Parallax>

        <Parallax className={styles.image}  bgImage='https://a0.muscache.com/im/pictures/hosting/Hosting-1349100984948750567/original/9473acca-6fe9-4072-9b25-d9b024627a55.jpeg?im_w=960' bgImageAlt='outside view' strength={800} >
                 <div className={styles.content}>
                    <span>seating room</span>
                </div>        
        </Parallax>

        <Parallax className={styles.image}  bgImage='https://a0.muscache.com/im/pictures/hosting/Hosting-1349100984948750567/original/7551d903-981c-4f0a-84f7-0a8f8b8e3bd0.jpeg?im_w=1200' bgImageAlt='outside view' strength={800} >
         <div className={styles.content}>
            <span>comfort bedroom</span>
         </div>
        </Parallax>

        <Parallax className={styles.image}  bgImage='https://a0.muscache.com/im/pictures/hosting/Hosting-1349100984948750567/original/c43703d5-a208-46dd-a38b-79eed30b264e.jpeg?im_w=1200' bgImageAlt='outside view' strength={800} >
         <div className={styles.content}>
            <span>Bath room</span>
         </div>
        </Parallax>
      
    </div>
  )
}

export default houseImageOne
