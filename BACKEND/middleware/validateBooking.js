export default function validateBooking(req, res, next) {
  const {
    fullName,
    gender,
    age,
    phone,
    email,
    hostelName,
    roomNumber,
    roomType,
    duration,
    checkIn,
    paymentMethod,
    bookingFee,
  } = req.body || {};

  const missing = [];
  if (!fullName) missing.push('fullName');
  if (!gender) missing.push('gender');
  if (age === undefined || age === null) missing.push('age');
  if (!phone) missing.push('phone');
  if (!email) missing.push('email');
  if (!hostelName) missing.push('hostelName');
  if (!roomNumber) missing.push('roomNumber');
  if (!roomType) missing.push('roomType');
  if (!duration) missing.push('duration');
  if (!checkIn) missing.push('checkIn');
  if (bookingFee === undefined || bookingFee === null) missing.push('bookingFee');
  if (!paymentMethod) missing.push('paymentMethod');

  if (missing.length) {
    return res.status(400).json({ success: false, message: 'Missing required fields', missing });
  }

  // normalize types
  if (typeof bookingFee === 'string') req.body.bookingFee = Number(bookingFee);
  if (typeof age === 'string') req.body.age = Number(age);

  // ensure valid date
  const date = new Date(checkIn);
  if (Number.isNaN(date.getTime())) {
    return res.status(400).json({ success: false, message: 'checkIn must be a valid date (YYYY-MM-DD)' });
  }

  next();
}
