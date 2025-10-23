//hostel model
import mongoose from 'mongoose';
const hostelSchema= new mongoose.Schema({
  name:{
    type : String,
    required: [true, 'Hostel name is required'],
    trim: true,
    maxLength:[100, 'Hostel name cannot exceed 100 characters']

  },
  description:{
    type: String,
    maxLength:[1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },

 
   image: { 
    type: String,
    required: [true, 'Image is required'],
    
  },
  
  
  amenities:{
    type: [String],
    validate:{
        validator:function(array){
            return array.length <= 20;
        },
        message: 'Cannot have more than 20 amenities'
    }
    
  },

  
    HostelGender:{
    type: String,
    enum: ['male', 'female'],
    required:[true, 'Hotel gender is required']
    },
   
  distance:{
    type:String,
    required: [true, 'Distance from campus is required'],
    trim: true
  },
  
  location:{
    type: String,
    required: [true, 'location area is required'],
    trim: true
  },
  
  availability:{
    type: Boolean,
    default: true
  },
  rating:{
    average:{
        type: Number,
        min : 0,
        max : 5,
        default : 0

    },
    count:{
        type:Number,
        default: 0
    }
  },
  featured:{
    type:Boolean,
    default: false
  },
  // ADD THIS FIELD - This is what was missing!
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }]
  
  

},{
    timestamps: true
});

// Add indexes for better performance
hostelSchema.index({ price: 1 });
hostelSchema.index({ location: 1 });
hostelSchema.index({ verified: 1 });
hostelSchema.index({ featured: 1 });

// Virtual for formatted price display
hostelSchema.virtual('formattedPrice').get(function() {
  return `UGX ${this.price.toLocaleString()}`;
});

export default mongoose.model("Hostel", hostelSchema)