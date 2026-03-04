import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  ArrowLeft,
  IndianRupee,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { dummyShowsData, dummyDashboardData } from "../assets/assets";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the movie from dummy data
  const movie = useMemo(
    () => dummyShowsData.find((m) => m._id === id),
    [id]
  );

  // Find active shows for this movie
  const activeShows = useMemo(() => {
    if (!movie) return [];
    return dummyDashboardData.activeShows.filter(
      (show) => show.movie._id === movie._id
    );
  }, [movie]);

  const isInTheaters = activeShows.length > 0;

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Film className="w-7 h-7 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold text-sm transition-all active:scale-95 cursor-pointer"
          >
            Browse Movies
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
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={movie.backdrop_path || movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-16 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="relative -mt-32 sm:-mt-40 z-10 px-4 sm:px-6 md:px-16 lg:px-24 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="w-48 sm:w-56 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl shadow-black/50">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 lg:pt-12">
            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-center lg:text-left">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-400 italic text-sm mb-4 text-center lg:text-left">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-500">
                  ({(movie.vote_count / 1000).toFixed(0)}K)
                </span>
              </div>

              {/* Runtime */}
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-sm text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {movie.runtime} min
              </div>

              {/* Release Date */}
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-sm text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(movie.release_date + "T00:00:00")}
              </div>

              {/* Language */}
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-sm text-gray-400">
                <Globe className="w-3.5 h-3.5" />
                {movie.original_language.toUpperCase()}
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Overview
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                {movie.overview}
              </p>
            </div>

            {/* Cast */}
            {movie.casts && movie.casts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Cast
                </h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {movie.casts.slice(0, 8).map((cast, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center shrink-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/10 mb-2">
                        <img
                          src={cast.profile_path}
                          alt={cast.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 text-center max-w-[80px] truncate">
                        {cast.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            Showtimes
          </h3>

          {isInTheaters ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeShows.map((show) => (
                <div
                  key={show._id}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all duration-300"
                >
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-primary/60" />
                      {formatDate(show.showDateTime)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-300">
                      <Clock className="w-4 h-4 text-primary/60" />
                      {formatTime(show.showDateTime)}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 mb-4">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-white">
                      {show.showPrice}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      per seat
                    </span>
                  </div>

                  {/* Seats availability */}
                  <p className="text-[11px] text-green-400 mb-4">
                    {Object.keys(show.occupiedSeats).length > 0
                      ? `${56 - Object.keys(show.occupiedSeats).length} seats available`
                      : "All seats available"}
                  </p>

                  {/* Book Now */}
                  <button
                    onClick={() =>
                      navigate(`/movies/${movie._id}/seats`)
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Not in Theaters */
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-200 mb-2">
                Not Currently in Theaters
              </h4>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                This movie doesn't have any active showtimes right now.
                Check back later or browse other movies currently playing.
              </p>
              <button
                onClick={() => navigate("/movies")}
                className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                Browse Other Movies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
