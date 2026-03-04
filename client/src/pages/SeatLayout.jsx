import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, ArrowRight, LogIn, X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import screenImage from "../assets/screenImage.svg";
import { dummyDateTimeData } from "../assets/assets";

const API_BASE = "http://localhost:5000/api";

// Seat layout configuration
const seatLayout = [
  {
    rows: [
      { label: "A", seats: 9, split: false },
      { label: "B", seats: 9, split: false },
    ],
  },
  {
    rows: [
      { label: "C", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "E" },
      { label: "D", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "F" },
    ],
    split: true,
  },
  {
    rows: [
      { label: "G", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "I" },
      { label: "H", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "J" },
    ],
    split: true,
  },
];

const occupiedSeats = new Set([
  "A1", "A2", "B1", "B2", "B3", "B4", "B5",
  "E1", "E2", "F1", "F2",
]);

const Seat = ({ id, isOccupied, isSelected, onSelect }) => {
  const handleClick = () => {
    if (!isOccupied) onSelect(id);
  };

  let bgClass = "bg-white/[0.04] border-white/10 text-gray-400 hover:border-primary/50 hover:bg-primary/10 cursor-pointer";
  if (isOccupied) {
    bgClass = "bg-primary/20 border-primary/30 text-primary/60 cursor-not-allowed";
  } else if (isSelected) {
    bgClass = "bg-primary border-primary text-white cursor-pointer shadow-md shadow-primary/20";
  }

  return (
    <button
      onClick={handleClick}
      disabled={isOccupied}
      title={isOccupied ? `${id} — Taken` : id}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border text-[10px] sm:text-xs font-medium flex items-center justify-center transition-all duration-200 ${bgClass}`}
    >
      {id}
    </button>
  );
};

const SeatLayout = () => {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(Object.keys(dummyDateTimeData)[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [bookingId, setBookingId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' | 'error' | null

  const timeSlots = dummyDateTimeData[selectedDate] || [];

  useMemo(() => {
    if (timeSlots.length > 0 && !selectedTime) {
      setSelectedTime(timeSlots[0].time);
    }
  }, [selectedDate]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400 text-sm mb-6">
            Please sign in to select seats and book your tickets.
          </p>
          <button
            onClick={() => openSignIn()}
            className="px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  };

  const formatTime = (isoStr) =>
    new Date(isoStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  };

  const totalAmount = selectedSeats.size * 120;

  const renderRow = (label, count, startNum = 1) => {
    const seats = [];
    for (let i = 0; i < count; i++) {
      const seatId = `${label}${startNum + i}`;
      seats.push(
        <Seat key={seatId} id={seatId} isOccupied={occupiedSeats.has(seatId)} isSelected={selectedSeats.has(seatId)} onSelect={handleSeatSelect} />
      );
    }
    return seats;
  };

  // ─── Booking Flow ────────────────────────────────
  const handleProceedToCheckout = async () => {
    if (selectedSeats.size === 0) return;

    const currentTimeSlot = timeSlots.find((s) => s.time === selectedTime);
    if (!currentTimeSlot) {
      toast.error("Please select a showtime");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          showId: currentTimeSlot.showId,
          seats: Array.from(selectedSeats),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setBookingId(data.booking._id);
        setShowOtpModal(true);
        setBookingStatus(null);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (err) {
      toast.error("Server error. Make sure backend is running.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (data.success) {
        setBookingStatus("success");
        toast.success("Booking confirmed! 🎬");
        setTimeout(() => {
          setShowOtpModal(false);
          navigate("/my-bookings");
        }, 2000);
      } else {
        setBookingStatus("error");
        toast.error(data.message || "Invalid OTP. Seats locked for 10 minutes.");
      }
    } catch (err) {
      setBookingStatus("error");
      toast.error("Verification failed. Try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setBookingId(null);
    setBookingStatus(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 sm:px-6 md:px-16 lg:px-24">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Left panel — Dates & Timings */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-white mb-4">Select Date</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
              {Object.keys(dummyDateTimeData).map((dateStr) => {
                const { day, date, month } = formatDate(dateStr);
                const isActive = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer ${isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] border border-white/5"
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-[10px] uppercase opacity-70">{day}</div>
                      <div className="text-lg font-bold leading-tight">{date}</div>
                      <div className="text-[10px] uppercase opacity-70">{month}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Available Timings</h3>
            <div className="flex lg:flex-col gap-2">
              {timeSlots.map((slot) => {
                const isActive = selectedTime === slot.time;
                return (
                  <button
                    key={slot.showId}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] border border-white/5"
                      }`}
                  >
                    <Clock className="w-4 h-4" />
                    {formatTime(slot.time)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel — Seat Map */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">Select your seat</h2>

          <div className="flex flex-col items-center mb-10">
            <img src={screenImage} alt="Screen" className="w-full max-w-lg opacity-80" />
            <span className="text-xs text-gray-500 mt-2 tracking-widest uppercase">Screen Side</span>
          </div>

          <div className="flex flex-col items-center gap-10">
            {seatLayout.map((tier, tierIdx) => (
              <div key={tierIdx} className="flex flex-col items-center gap-2">
                {tier.split
                  ? tier.rows.map((row) => (
                    <div key={row.label} className="flex items-center gap-6 sm:gap-10">
                      <div className="flex gap-1 sm:gap-1.5">{renderRow(row.label, row.seatsLeft)}</div>
                      <div className="w-4 sm:w-8" />
                      <div className="flex gap-1 sm:gap-1.5">{renderRow(row.rightLabel, row.seatsRight)}</div>
                    </div>
                  ))
                  : tier.rows.map((row) => (
                    <div key={row.label} className="flex gap-1 sm:gap-1.5">{renderRow(row.label, row.seats)}</div>
                  ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-white/[0.04] border border-white/10" />
              <span className="text-xs text-gray-500">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-primary border border-primary" />
              <span className="text-xs text-gray-500">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-primary/20 border border-primary/30" />
              <span className="text-xs text-gray-500">Occupied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom checkout bar */}
      {selectedSeats.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">
                {selectedSeats.size} {selectedSeats.size === 1 ? "seat" : "seats"} selected
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">{Array.from(selectedSeats).sort().join(", ")}</span>
                <span className="mx-2">•</span>
                <span className="text-primary font-bold text-lg">₹{totalAmount}</span>
              </p>
            </div>
            <button
              onClick={handleProceedToCheckout}
              disabled={bookingLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md relative">
            {/* Close */}
            <button
              onClick={handleCloseOtpModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStatus === "success" ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-sm text-gray-400">
                  Your seats have been booked. Redirecting to your bookings...
                </p>
              </div>
            ) : (
              /* OTP Input State */
              <>
                <div className="text-center mb-6">
                  {bookingStatus === "error" ? (
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-7 h-7 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {bookingStatus === "error" ? "Verification Failed" : "Enter Verification Code"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {bookingStatus === "error"
                      ? "Invalid code. Seats are locked for 10 minutes. Try again with correct code."
                      : "We've sent a 6-digit code to your email. Enter it below to confirm your booking."}
                  </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white/[0.04] text-white focus:outline-none transition-all ${bookingStatus === "error"
                          ? "border-red-500/50 focus:border-red-400"
                          : "border-white/10 focus:border-primary"
                        }`}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>

                <p className="text-[11px] text-gray-600 text-center mt-4">
                  Seats: {Array.from(selectedSeats).sort().join(", ")} • ₹{totalAmount}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
