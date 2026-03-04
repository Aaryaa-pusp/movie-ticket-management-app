import React, { useState } from 'react';
import { Star, Clock, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { dummyShowsData } from '../assets/assets';

const MovieCard = ({ movie, isFav, onToggleFav }) => {
    const navigate = useNavigate();

    const handleFav = (e) => {
        e.stopPropagation(); // Prevent card click navigation
        onToggleFav(movie._id);
    };

    return (
        <div
            onClick={() => navigate(`/movies/${movie._id}`)}
            className="group relative min-w-[200px] sm:min-w-[220px] cursor-pointer"
        >
            {/* Poster */}
            <div className="relative overflow-hidden rounded-xl aspect-[2/3]">
                <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                </div>

                {/* Heart / Favourite button */}
                <button
                    onClick={handleFav}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer z-10"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors duration-200 ${isFav
                            ? 'text-red-500 fill-red-500'
                            : 'text-white/70 hover:text-red-400'
                            }`}
                    />
                </button>

                {/* Hover info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{movie.runtime} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre.id}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-gray-200"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Title + Book Now */}
            <h3 className="mt-3 text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                {movie.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-2">
                {new Date(movie.release_date).getFullYear()}
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movies/${movie._id}/seats`);
                }}
                className="w-full py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
            >
                Book Now
            </button>
        </div>
    );
};

const FeaturedSection = () => {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    const [favourites, setFavourites] = useState(new Set());

    const handleToggleFav = (movieId) => {
        if (!isSignedIn) {
            // Could prompt login — for now, still allow toggling visually
        }
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
        <section className="px-6 md:px-16 lg:px-36 py-16">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
                        Curated for you
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Featured Movies
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/movies')}
                    className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                    View All
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Horizontal scroll row */}
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                {dummyShowsData.map((movie) => (
                    <MovieCard
                        key={movie._id}
                        movie={movie}
                        isFav={favourites.has(movie._id)}
                        onToggleFav={handleToggleFav}
                    />
                ))}
            </div>

            {/* Mobile "View All" */}
            <button
                onClick={() => navigate('/movies')}
                className="sm:hidden flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mt-4 mx-auto cursor-pointer"
            >
                View All
                <ArrowRight className="w-4 h-4" />
            </button>
        </section>
    );
};

export default FeaturedSection;
