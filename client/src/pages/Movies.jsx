import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Star, Heart, Clock, X, Film } from "lucide-react";
import { dummyShowsData } from "../assets/assets";

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [favourites, setFavourites] = useState(new Set());
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const genreSet = new Set();
    dummyShowsData.forEach((movie) =>
      movie.genres.forEach((g) => genreSet.add(g.name))
    );
    return ["All", ...Array.from(genreSet).sort()];
  }, []);

  // Filter movies by search + genre
  const filteredMovies = useMemo(() => {
    return dummyShowsData.filter((movie) => {
      const matchesSearch =
        !searchTerm ||
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.overview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" ||
        movie.genres.some((g) => g.name === selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [searchTerm, selectedGenre]);

  const handleToggleFav = (e, movieId) => {
    e.preventDefault();
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 md:px-16 lg:px-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
            Browse
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">All Movies</h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Genre Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${selectedGenre === genre
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/[0.04] text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing {filteredMovies.length} of {dummyShowsData.length} movies
          {searchTerm && (
            <span>
              {" "}for "<span className="text-primary">{searchTerm}</span>"
            </span>
          )}
        </p>

        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
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

                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>

                  {/* Heart button */}
                  <button
                    onClick={(e) => handleToggleFav(e, movie._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-200 ${favourites.has(movie._id)
                        ? "text-red-500 fill-red-500"
                        : "text-white/70 hover:text-red-400"
                        }`}
                    />
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
              <Film className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No movies found
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                handleSearchChange("");
                setSelectedGenre("All");
              }}
              className="mt-6 px-6 py-2.5 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
