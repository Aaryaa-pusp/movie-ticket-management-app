import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Clock, Film, HeartOff } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { dummyShowsData } from "../assets/assets";

const Favourites = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [favouriteIds, setFavouriteIds] = useState(
    new Set(dummyShowsData.slice(0, 3).map((m) => m._id)) // Pre-seed with first 3 for demo
  );

  // Login gate
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400 text-sm mb-6">
            Please sign in to view and manage your favourite movies.
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

  const favouriteMovies = dummyShowsData.filter((m) => favouriteIds.has(m._id));

  const handleRemoveFav = (e, movieId) => {
    e.stopPropagation();
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      next.delete(movieId);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
            Your Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Favourites</h1>
          <p className="text-sm text-gray-500 mt-2">
            {favouriteMovies.length} {favouriteMovies.length === 1 ? "movie" : "movies"} saved
          </p>
        </div>

        {favouriteMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {favouriteMovies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => navigate(`/movies/${movie._id}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />

                  {/* Rating */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>

                  {/* Remove Heart */}
                  <button
                    onClick={(e) => handleRemoveFav(e, movie._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-red-500/40 cursor-pointer z-10"
                    title="Remove from favourites"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>

                  {/* Runtime */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-300">
                    <Clock className="w-3 h-3" />
                    {movie.runtime} min
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold text-white truncate mb-2 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map((genre) => (
                      <span
                        key={genre.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
              <HeartOff className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No favourites yet
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Browse movies and tap the heart icon to save your favourites here.
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

export default Favourites;
