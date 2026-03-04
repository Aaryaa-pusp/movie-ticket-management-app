import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar, IndianRupee, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyDashboardData } from "../assets/assets";

const NowShowingSection = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [favourites, setFavourites] = useState(new Set());

    const activeShows = dummyDashboardData.activeShows;

    const scroll = (direction) => {
        if (scrollRef.current) {
            const amount = 340;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleToggleFav = (e, movieId) => {
        e.stopPropagation();
        setFavourites((prev) => {
            const next = new Set(prev);
            if (next.has(movieId)) {
                next.delete(movieId);
            } else {
                next.add(movieId);
            }
            return next;
        });
    };

    return (
        <section className="px-6 md:px-16 lg:px-36 py-16 relative">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
                        In Theatres
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold">Now Showing</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Horizontal scrollable cards */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
                {activeShows.map((show) => (
                    <div
                        key={show._id}
                        onClick={() => navigate(`/movies/${show.movie._id}`)}
                        className="group relative min-w-[260px] sm:min-w-[280px] rounded-2xl overflow-hidden cursor-pointer shrink-0 bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all duration-300"
                    >
                        {/* Poster + overlay */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <img
                                src={show.movie.poster_path}
                                alt={show.movie.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />

                            {/* Price badge */}
                            <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-primary/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white">
                                <IndianRupee className="w-3 h-3" />
                                {show.showPrice}
                            </div>

                            {/* Heart / Favourite button */}
                            <button
                                onClick={(e) => handleToggleFav(e, show.movie._id)}
                                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors duration-200 ${favourites.has(show.movie._id)
                                        ? "text-red-500 fill-red-500"
                                        : "text-white/70 hover:text-red-400"
                                        }`}
                                />
                            </button>

                            {/* Seats info */}
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium text-green-400 border border-green-400/20">
                                {Object.keys(show.occupiedSeats).length > 0
                                    ? `${Object.keys(show.occupiedSeats).length} seats booked`
                                    : "All seats available"}
                            </div>
                        </div>

                        {/* Info section */}
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-white truncate mb-2 group-hover:text-primary transition-colors">
                                {show.movie.title}
                            </h3>

                            {/* Genre tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {show.movie.genres.slice(0, 2).map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Show details */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-primary/60" />
                                    {formatDate(show.showDateTime)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-primary/60" />
                                    {formatTime(show.showDateTime)}
                                </div>
                            </div>

                            {/* Book Now button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/movies/${show.movie._id}/seats`);
                                }}
                                className="w-full py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NowShowingSection;
