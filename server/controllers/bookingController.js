import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create booking (hold seats + send OTP)
export const createBooking = async (req, res) => {
    try {
        const { clerkId, showId, seats } = req.body;

        // Find user
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find show
        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({ success: false, message: "Show not found" });
        }

        // Check if any selected seats are already occupied
        const occupiedSeats = show.occupiedSeats || new Map();
        const alreadyOccupied = seats.filter((seat) => occupiedSeats.has(seat));
        if (alreadyOccupied.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Seats already taken: ${alreadyOccupied.join(", ")}`,
            });
        }

        // Reserve seats on the show (mark as pending)
        seats.forEach((seat) => {
            show.occupiedSeats.set(seat, clerkId);
        });
        await show.save();

        // Calculate amount
        const amount = seats.length * show.showPrice;

        // Generate OTP
        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        // Create booking
        const booking = await Booking.create({
            user: user._id,
            show: showId,
            bookedSeats: seats,
            amount,
            otpCode,
            otpExpiry,
        });

        // Send OTP email
        try {
            await transporter.sendMail({
                from: `"QuickShow" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: "QuickShow — Booking Verification Code",
                html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px; background: #1a1a1a; color: #fff; border-radius: 12px;">
            <h2 style="color: #f84565; margin-bottom: 8px;">QuickShow</h2>
            <p>Hi ${user.name},</p>
            <p>Your verification code for seat booking is:</p>
            <div style="background: #f84565; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 16px; border-radius: 8px; letter-spacing: 8px; margin: 16px 0;">
              ${otpCode}
            </div>
            <p style="color: #999;">This code expires in 10 minutes. If you didn't request this, please ignore.</p>
            <p style="color: #999; font-size: 12px;">Seats: ${seats.join(", ")} | Amount: ₹${amount}</p>
          </div>
        `,
            });
        } catch (emailErr) {
            console.error("Email send error:", emailErr.message);
            // Don't block booking if email fails — user can still enter OTP
        }

        res.status(201).json({
            success: true,
            booking: {
                _id: booking._id,
                seats: booking.bookedSeats,
                amount: booking.amount,
                expiresAt: booking.expiresAt,
            },
            message: "OTP sent to your email. Complete payment within 10 minutes.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP and confirm booking
export const verifyBooking = async (req, res) => {
    try {
        const { otp } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or expired",
            });
        }

        if (booking.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Booking already confirmed",
            });
        }

        // Check OTP expiry
        if (new Date() > booking.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please create a new booking.",
            });
        }

        // Verify OTP
        if (booking.otpCode !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Confirm booking
        booking.isPaid = true;
        booking.expiresAt = null; // Remove TTL — confirmed bookings persist
        booking.otpCode = undefined;
        booking.otpExpiry = undefined;
        await booking.save();

        res.json({ success: true, message: "Booking confirmed!", booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get bookings for a user
export const getUserBookings = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const bookings = await Booking.find({ user: user._id, isPaid: true })
            .populate({
                path: "show",
                populate: { path: "movie" },
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user")
            .populate({
                path: "show",
                populate: { path: "movie" },
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
