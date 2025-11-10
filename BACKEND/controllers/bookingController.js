import Booking from "../models/Booking.js";
import { validationResult } from "express-validator";


export const createBooking = async (req, res) => {
 try{
  // Error validation
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({
      errors: errors.array().map((err) => err.msg)
    });
  }

  const { fullName, gender, age, occupation, idNumber, phone, email, location, 
    hostelName, roomNumber, roomType, duration, checkIn, paymentMethod, bookingFee, paymentNumber
  } = req.body;
  const form = new Booking({
    fullName, gender, age, occupation, idNumber, phone, email, location, 
    hostelName, roomNumber, roomType, duration, checkIn, paymentMethod, bookingFee, paymentNumber
  });
    await form.save();

    res.status(201).json({ message: "Booking successfully"});
 } catch(err) {
  console.error(err);

  res.status(500).json({ error: "Server error"})
 }

};

export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: " Server error"})

  }
};
