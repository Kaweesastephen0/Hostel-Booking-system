import React from "react";
import styles from './gallery.module.css' 
 const Gallery=()=>{
    return(
        <div className={styles.container}>
            <table>
                <tr>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                    <td>
                        <img src="https://images.pexels.com/photos/34365797/pexels-photo-34365797.jpeg" alt="" />
                    </td>
                </tr>
            </table>

        </div>
    )
}
export default Gallery;