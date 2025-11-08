import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    FormControl, InputLabel, Select, MenuItem, Grid, Typography, Divider,
    Alert, CircularProgress, Box, InputAdornment
} from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const defaultBookingForm = {
    fullName: '', gender: '', age: '', occupation: '', idNumber: '',
    phone: '', email: '', location: '', hostelName: '', roomNumber: '',
    roomType: '', duration: '', checkIn: '', paymentMethod: '',
    bookingFee: '', paymentNumber: '', status: 'pending',
};

const durationMap = { daily: 1, weekly: 7, monthly: 30, quarterly: 90, yearly: 365 };

const BookingForm = ({ open, onClose, onSuccess }) => {
    const [newBooking, setNewBooking] = useState(defaultBookingForm);
    const [createError, setCreateError] = useState(null);
    const [creatingBooking, setCreatingBooking] = useState(false);
    const [hostels, setHostels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loadingHostels, setLoadingHostels] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(false);

    // Fetching hostels when the booking form component opens
    React.useEffect(() => {
        if (open) {
            fetchHostels();
        }
    }, [open]);

    // Fetching rooms when hostel is selected
    React.useEffect(() => {
        if (newBooking.hostelName) {
            fetchRoomsByHostel(newBooking.hostelName);
        } else {
            setRooms([]);
            setNewBooking(prev => ({ ...prev, roomNumber: '', roomType: '', bookingFee: '' }));
        }
    }, [newBooking.hostelName]);

    const fetchHostels = async () => {
        setLoadingHostels(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hostels`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setHostels(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching hostels:', error);
        } finally {
            setLoadingHostels(false);
        }
    };

    const fetchRoomsByHostel = async (hostelId) => {
        setLoadingRooms(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/rooms/hostel/${hostelId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setRooms(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleNewBookingChange = (field) => (event) => {
        setNewBooking((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleRoomSelect = (event) => {
        const roomId = event.target.value;
        const selectedRoom = rooms.find(room => room._id === roomId);

        if (selectedRoom) {
            setNewBooking((prev) => ({
                ...prev,
                roomNumber: roomId,
                roomType: selectedRoom.roomType,
                bookingFee: selectedRoom.bookingPrice || selectedRoom.roomPrice || '',
            }));
        }
    };

    const handleClose = () => {
        if (creatingBooking) return;
        setNewBooking(defaultBookingForm);
        setCreateError(null);
        onClose();
    };

    const handleCreateBooking = async (event) => {
        event.preventDefault();
        setCreateError(null);

        const { fullName, gender, age, idNumber, phone, email, location,
            hostelName, roomNumber, roomType, duration, checkIn,
            paymentMethod, bookingFee, paymentNumber } = newBooking;

        const requiredFields = [
            { field: 'fullName', label: 'Guest name' },
            { field: 'roomNumber', label: 'Room number' },
            { field: 'checkIn', label: 'Check-in date' },
            { field: 'duration', label: 'Duration' },
            { field: 'bookingFee', label: 'Amount' },
        ];

        const missingField = requiredFields.find(({ field }) => !newBooking[field]?.toString().trim());
        if (missingField) {
            setCreateError(`${missingField.label} is required`);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setCreateError('Please enter a valid email address');
            return;
        }

        const ageValue = parseInt(age, 10);
        if (isNaN(ageValue) || ageValue <= 0) {
            setCreateError('Age must be a positive number');
            return;
        }

        const bookingFeeValue = parseFloat(bookingFee);
        if (isNaN(bookingFeeValue) || bookingFeeValue <= 0) {
            setCreateError('Booking fee must be a positive number');
            return;
        }

        const durationDays = durationMap[duration];
        if (!durationDays) {
            setCreateError('Please select a valid duration');
            return;
        }

        setCreatingBooking(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                fullName, gender, age: ageValue, occupation: newBooking.occupation,
                idNumber, phone, email, location, hostelName, roomNumber, roomType,
                duration: durationDays, checkIn, paymentMethod,
                bookingFee: bookingFeeValue, paymentNumber, status: newBooking.status,
            };

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create booking.');
            }

            setNewBooking(defaultBookingForm);
            setCreateError(null);

            if (onSuccess) {
                onSuccess('Booking created successfully.');
            }

            onClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            setCreateError(error.message || 'Failed to create booking.');
        } finally {
            setCreatingBooking(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <form onSubmit={handleCreateBooking}>
                <DialogTitle>Add New Booking</DialogTitle>
                <DialogContent>
                    {createError && <Alert severity="error">{createError}</Alert>}
                    <Box sx={{ mt: 2, maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                        <Typography variant="h6" gutterBottom>Guest Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Full Name" value={newBooking.fullName}
                                    onChange={handleNewBookingChange('fullName')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <FormControl fullWidth margin="normal" required sx={{ minWidth: 120 }}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select value={newBooking.gender} onChange={handleNewBookingChange('gender')} label="Gender">
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="Age" type="number" value={newBooking.age}
                                    onChange={handleNewBookingChange('age')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="ID/STN Number" value={newBooking.idNumber}
                                    onChange={handleNewBookingChange('idNumber')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="Phone Number" value={newBooking.phone}
                                    onChange={handleNewBookingChange('phone')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="Email" type="email" value={newBooking.email}
                                    onChange={handleNewBookingChange('email')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="Location/Address" value={newBooking.location}
                                    onChange={handleNewBookingChange('location')} margin="normal" required />
                            </Grid>
                            <Grid sm={6}>
                                <TextField fullWidth label="Occupation" value={newBooking.occupation}
                                    onChange={handleNewBookingChange('occupation')} margin="normal" />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>Booking Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" required sx={{ minWidth: 120 }}>
                                    <InputLabel>Hostel Name</InputLabel>
                                    <Select
                                        value={newBooking.hostelName}
                                        onChange={handleNewBookingChange('hostelName')}
                                        label="Hostel Name"
                                        disabled={loadingHostels}
                                    >
                                        {loadingHostels ? (
                                            <MenuItem value="">Loading hostels...</MenuItem>
                                        ) : hostels.length === 0 ? (
                                            <MenuItem value="">No hostels available</MenuItem>
                                        ) : (
                                            hostels.map((hostel) => (
                                                <MenuItem key={hostel._id} value={hostel._id}>
                                                    {hostel.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" required disabled={!newBooking.hostelName || loadingRooms} sx={{ minWidth: 120 }}>
                                    <InputLabel>Room Number</InputLabel>
                                    <Select
                                        value={newBooking.roomNumber}
                                        onChange={handleRoomSelect}
                                        label="Room Number"
                                    >
                                        {loadingRooms ? (
                                            <MenuItem value="">Loading rooms...</MenuItem>
                                        ) : rooms.length === 0 ? (
                                            <MenuItem value="">No rooms available</MenuItem>
                                        ) : rooms.status === 'available' ? (
                                            rooms.map((room) => (
                                                <MenuItem key={room._id} value={room._id}>
                                                    {room.roomNumber} - {room.roomType} (UGx{room.bookingPrice})
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">No available rooms</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Room Type"
                                    value={newBooking.roomType}
                                    margin="normal"
                                    InputProps={{ readOnly: true }}
                                    helperText="Auto-filled from selected room"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" required sx={{ minWidth: 120 }}>
                                    <InputLabel>Duration</InputLabel>
                                    <Select value={newBooking.duration} onChange={handleNewBookingChange('duration')} label="Duration">
                                        <MenuItem value="daily">Daily</MenuItem>
                                        <MenuItem value="weekly">Weekly</MenuItem>
                                        <MenuItem value="monthly">Monthly</MenuItem>
                                        <MenuItem value="quarterly">Quarterly</MenuItem>
                                        <MenuItem value="yearly">Yearly</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Check-in Date" type="date" value={newBooking.checkIn}
                                    onChange={handleNewBookingChange('checkIn')} margin="normal"
                                    InputLabelProps={{ shrink: true }} required />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>Payment Information</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="normal" required sx={{ minWidth: 120 }}>
                                    <InputLabel>Payment Method</InputLabel>
                                    <Select value={newBooking.paymentMethod} onChange={handleNewBookingChange('paymentMethod')} label="Payment Method">
                                        <MenuItem value="cash">Cash</MenuItem>
                                        <MenuItem value="mobile_money">Mobile Money</MenuItem>
                                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="credit_card">Credit Card</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Booking Fee"
                                    type="number"
                                    value={newBooking.bookingFee}
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">UGx</InputAdornment>
                                    }}
                                    helperText="Auto-filled from selected room"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Payment Reference/Number" value={newBooking.paymentNumber}
                                    onChange={handleNewBookingChange('paymentNumber')} margin="normal" required />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={handleClose} disabled={creatingBooking} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained" disabled={creatingBooking}
                        startIcon={creatingBooking ? <CircularProgress size={20} /> : null} sx={{ minWidth: 150 }}>
                        {creatingBooking ? 'Creating...' : 'Create Booking'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BookingForm;
