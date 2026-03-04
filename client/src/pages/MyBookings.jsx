import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  IndianRupee,
  Film,
  Ticket,
  LogIn,
  Loader2,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";

const API_BASE = "http://localhost:5000/api";

const MyBookings = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchBookings();
    }
  }, [isSignedIn, user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/user/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400 text-sm mb-6">
            Please sign in to view your past bookings.
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
            Your Tickets
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Past Bookings</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Movie Poster */}
                  {booking.show?.movie?.poster_path && (
                    <div className="sm:w-32 shrink-0">
                      <img
                        src={booking.show.movie.poster_path}
                        alt={booking.show.movie.title}
                        className="w-full h-40 sm:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {booking.show?.movie?.title || "Movie"}
                        </h3>
                        {booking.show?.movie?.genres && (
                          <div className="flex gap-1.5 mb-2">
                            {booking.show.movie.genres.slice(0, 3).map((g) => (
                              <span
                                key={g.id}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                              >
                                {g.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Confirmed badge */}
                      <span className="text-[10px] px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
                        Confirmed
                      </span>
                    </div>

                    {/* Show details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      {booking.show?.showDateTime && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary/60" />
                            {formatDate(booking.show.showDateTime)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary/60" />
                            {formatTime(booking.show.showDateTime)}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Seats & Amount */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary/60" />
                        <span className="text-sm text-white font-medium">
                          {booking.bookedSeats.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          {booking.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
              <Film className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No bookings yet
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Your confirmed bookings will appear here. Browse movies and book your seats!
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="mt-6 px-6 py-2.5 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
