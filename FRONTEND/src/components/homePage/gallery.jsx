import React from "react";
import styles from './gallery.module.css' 
 const Gallery=()=>{
    return(
        <div className={styles.galleryContainer}>
            <p>Our Rooms are just toiled for you</p>
            <div className={styles.container}> 
                           
                <div className={styles.Box}>
                   <img src="https://plus.unsplash.com/premium_photo-1674676471104-3c4017645e6f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=670" alt="" /> 
                </div>

                <div className={styles.Box}>
                    <div className={styles.Box}>
                    <img src="https://plus.unsplash.com/premium_photo-1706565466097-78de3dcc5067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" />
                    </div>

                    <div className={styles.Box}>
                    <img src="https://plus.unsplash.com/premium_photo-1674035037112-e3c34707af1f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" />
                    </div>
                </div>

                <div className={styles.thirdBox}>
                    <img src="https://plus.unsplash.com/premium_photo-1661962449952-29741f7dbbc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" />
                </div>

                <div className={styles.Box}>
                      <div className={styles.Box}>
                        <img src="https://plus.unsplash.com/premium_photo-1661884177973-3068b241e80d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU2fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" />
                    </div>

                     <div className={styles.Box}>
                        <img src="https://plus.unsplash.com/premium_photo-1661962449952-29741f7dbbc4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" />
                     </div>

                </div>

                <div className={styles.Box}>
                   <img src="https://plus.unsplash.com/premium_photo-1670950412066-2dc58699d7ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600" alt="" /> 
                </div>
              
               

            
        </div>
        </div>

        
    )
}
export default Gallery;