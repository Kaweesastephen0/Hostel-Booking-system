import React from "react";
import styles from './ExactRoom.module.css'
import { MoveLeft, Share2, Heart, Plus, MapPinHouse, Venus, Clock10, Wifi, Bus, BookOpenCheck, Utensils, LockOpen, Dumbbell, WavesLadder } from 'lucide-react'

const ExactRoom=()=>{
    return(
        <div className={styles.container}>
            <div className={styles.topBar}>
                <div>
                    <p className={styles.backBox}><span><MoveLeft /></span>back to listing</p>
                </div>
                <div className={styles.Icons}>
                    <Share2 className={styles.shareIcon} />
                    <Heart />
                </div>

            </div>

            {/* image container */}
            <div className={styles.imageContainer}>
                <div className={styles.leftImageBox}>
                    <img src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" alt="bedRoom main image" />
                </div>
                <div className={styles.rightImageBox}>
                    <div className={styles.rightTopImage}>
                        <div className={styles.images}>
                            <img src="https://plus.unsplash.com/premium_photo-1675615949585-36aaf4cb778d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9kZXJuJTIwa2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" alt="sub image" />
                        </div>
                        <div className={styles.images}>
                            <img src="https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTMwMjY0Njg4Nzg5NDA4NzI1NQ==/original/7858d714-b83d-46f0-8129-00a0a7405289.jpeg?im_w=720" alt="sub image" />
                        </div>

                    </div>
                    <div className={styles.rightBottomImage}>
                        <div className={styles.images}>
                            <img src="https://images.unsplash.com/photo-1587527901949-ab0341697c1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9pbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" alt="sub image" />
                        </div>
                        <div className={styles.images1}>
                            <img src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" alt="sub image" />
                            <div className={styles.moreImage}>
                                <Plus color="white"/> <span>more</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.subHeadingBox}>
                <div>
                    Room K34
                </div>
                <div>
                    Ugx.700,000
                    <span>/semester</span>
                </div>
            </div>
            <div className={styles.locationBox}>
                <div className={styles.threeLocations}>
                    <div className={styles.inner3}><span><MapPinHouse /></span>Kikoni wandegeya</div>
                     <div className={styles.inner3}><span><Venus /></span>Preferred Gender: Both</div>
                    <div className={styles.inner3}><span><Clock10 /></span><div className={styles.postedTime}>Posted: 2 days ago</div></div>
                </div>
                <div>
                    <button>Book it</button>
                </div>
            </div>

            <div className={styles.AmenityLocation}>
                <div className={styles.AmenityLeftBox}>
                    <h3 className={styles.Title}>Amenities</h3>
                    <div className={styles.AmenitiesBox}>
                        <div className={styles.first3}>
                            <ul>
                                <li> <Bus /> <span>Pick up bus</span></li>
                                <li><BookOpenCheck /> <span>Library</span></li>
                                <li> <Utensils /> <span>Restaurant</span></li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li> <LockOpen /> <span>security</span></li>
                                <li><Dumbbell /> <span>GYM</span></li>
                                <li><WavesLadder /> <span>Swimming pool</span></li>
                            </ul>
                            
                        </div>
                    </div>
                </div>
                <div className={styles.locationMapRightBox}>
                    <h3 className={styles.Title}>Location</h3>
                    <div className={styles.mapSpace}>
                        <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z29vZ2xlJTIwbWFwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" alt="placeholder map" />
                    </div>
                </div>

            </div>

            <div className={styles.descriptionBox}>
                <h3>Description</h3>
                <div>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione minus a quae doloribus placeat. Natus quisquam vitae voluptatum dolore? Consequatur ex sed atque quo maiores ad, officia quidem rerum non.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa earum incidunt natus, voluptate hic omnis laudantium beatae blanditiis sint harum aspernatur rerum, expedita debitis explicabo porro, illo inventore illum! Blanditiis!</p>
                </div>
            </div>

            <div className={styles.otherRoomsBox}>
                <h3>Other Rooms in Sunways Hostel</h3>
                <div className={styles.otherRoomGrid}>
                    <div className={styles.otherRoom}>
                        <div className={styles.otherRoomImage}>
                           <img src="https://a0.muscache.com/im/pictures/hosting/Hosting-1339020775758776507/original/174d953f-7bc4-418b-8007-687648f748a5.jpeg?im_w=720" alt="sunways seating room" /> 
                        </div>
                        <div className={styles.otherRoomInfo}>
                            <p>Room-k708</p>
                        </div>
                        <div className={styles.OtherRoomsAmenities}>
                            <ul>
                                <li> <Bus /> <span>Pick up bus</span></li>
                                <li><BookOpenCheck /> <span>Library</span></li>
                                <li> <Utensils /> <span>Restaurant</span></li>
                            </ul>

                        </div>

                    </div>

                    <div className={styles.otherRoom}>
                        <div className={styles.otherRoomImage}>
                           <img src="https://a0.muscache.com/im/pictures/miso/Hosting-1302646887894087255/original/77f942a8-29b6-4571-a27e-96c841e24bd8.jpeg?im_w=1200" alt="sunways seating room" /> 
                        </div>
                        <div className={styles.otherRoomInfo}>
                            <p>Room-k73</p>
                        </div>
                        <div className={styles.OtherRoomsAmenities}>
                            <ul>
                                <li> <Bus /> <span>Pick up bus</span></li>
                                <li><BookOpenCheck /> <span>Library</span></li>
                                <li> <Utensils /> <span>Restaurant</span></li>
                            </ul>

                        </div>

                    </div>

                    <div className={styles.otherRoom}>
                        <div className={styles.otherRoomImage}>
                           <img src="https://images.unsplash.com/photo-1713283365745-a727fb26c52f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNlYXRpbmclMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" alt="sunways seating room" /> 
                        </div>
                        <div className={styles.otherRoomInfo}>
                            <p>Room-k08</p>
                        </div>
                        <div className={styles.OtherRoomsAmenities}>
                            <ul>
                                <li> <Bus /> <span>Pick up bus</span></li>
                                <li><BookOpenCheck /> <span>Library</span></li>
                                <li> <Utensils /> <span>Restaurant</span></li>
                            </ul>

                        </div>

                    </div>
                </div>
            </div>
           
        </div>
    )
}
export default ExactRoom;