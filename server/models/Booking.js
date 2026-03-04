import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Show",
            required: true,
        },
        bookedSeats: [{ type: String, required: true }], // e.g. ["A1", "A2"]
        amount: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        otpCode: { type: String },
        otpExpiry: { type: Date },
        // TTL field — unpaid bookings auto-delete after 10 minutes
        expiresAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// TTL index: MongoDB automatically deletes documents when expiresAt is reached
// Only unpaid bookings will have expiresAt set; paid bookings set it to null
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save: set expiresAt to 10 minutes from now for unpaid bookings
bookingSchema.pre("save", function (next) {
    if (!this.isPaid && !this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }
    if (this.isPaid) {
        this.expiresAt = null; // Confirmed bookings never expire
    }
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
