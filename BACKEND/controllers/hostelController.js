import HostelModel from "../models/HostelModel.js";

export const getAllHostels= async(req, res)=>{
    try{
        const hostels =await HostelModel.find({}).lean();
         if(hostels){
             console.log(`found ${hostels.length} hostels`)

         }
         res.status(200).json({ success: true, data: hostels, message: `fetched ${hostels.length} hostels`})
        
    }catch(error){
        console.log('Error fetching Hostels', error)
        res.status(500).json({success: false, error: error.message, message: "Error fetching Hostels"})

    }
}
// export default getAllHostels;

 export const getFeaturedHostels= async(req, res)=>{
    try{
        const featuredHostel = await hostel.find({featured: true})
         if(featuredHostel){
             console.log(`you have ${featuredHostel.length} hostels`)
         }
         res.status(200).json({success: true, data: featuredHostel, message: `you have ${featuredHostel.length} hostels`})
        
    }catch(error){
        console.log(error);
        res.status(500).json({success: false, message: 'Server error', error: error.message})
    }
}

