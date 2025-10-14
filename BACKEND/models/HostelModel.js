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

  address:{
    type: String,
    required: [true, "Address is required"],
    trim: true,
    maxLength:[100, 'Address cannot exceed 200 characters']

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

  
    HotelGender:{
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
  roomTypes:{
    single:{
        type: Number,
        default: 0
    },
    double:{
        type : Number,
        default : 0
    },
    shared:{
        type: Number,
        default: 0
    }

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

export default mongoose.model("hostel", hostelSchema)