import React, { useRef, useState } from "react";
import { Play, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { dummyTrailers } from "../assets/assets";

const TrailerSection = () => {
    const scrollRef = useRef(null);
    const [activeTrailer, setActiveTrailer] = useState(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const amount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="px-6 md:px-16 lg:px-36 py-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Section header */}
            <div className="relative flex items-end justify-between mb-8">
                <div>
                    <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
                        Watch
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Latest Trailers
                    </h2>
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

            {/* Trailer cards */}
            <div
                ref={scrollRef}
                className="relative flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
                {dummyTrailers.map((trailer, index) => (
                    <a
                        key={index}
                        href={trailer.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative min-w-[340px] sm:min-w-[400px] rounded-2xl overflow-hidden cursor-pointer shrink-0"
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={trailer.image}
                                alt={`Trailer ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlays */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
                                    <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                                </div>
                            </div>

                            {/* External link badge */}
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ExternalLink className="w-3 h-3" />
                                YouTube
                            </div>

                            {/* Bottom label */}
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[11px] px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-gray-200 font-medium">
                                    Official Trailer
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default TrailerSection;
