import React, { useState } from "react";
import screenImage from "../assets/screenImage.svg";

// Seat layout configuration — same as SeatLayout.jsx
const seatLayout = [
    // Tier 1 — Premium (closest to screen)
    {
        rows: [
            { label: "A", seats: 9, split: false },
            { label: "B", seats: 9, split: false },
        ],
    },
    // Tier 2 — Middle (split into left + right with aisle)
    {
        rows: [
            { label: "C", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "E" },
            { label: "D", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "F" },
        ],
        split: true,
    },
    // Tier 3 — Back (split into left + right with aisle)
    {
        rows: [
            { label: "G", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "I" },
            { label: "H", seatsLeft: 9, seatsRight: 5, leftStart: 1, rightLabel: "J" },
        ],
        split: true,
    },
];

const Seat = ({ id, isSelected, onSelect }) => {
    const bgClass = isSelected
        ? "bg-primary border-primary text-white cursor-pointer shadow-md shadow-primary/20"
        : "bg-white/[0.04] border-white/10 text-gray-400 hover:border-primary/50 hover:bg-primary/10 cursor-pointer";

    return (
        <button
            onClick={() => onSelect(id)}
            title={id}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border text-[10px] sm:text-xs font-medium flex items-center justify-center transition-all duration-200 ${bgClass}`}
        >
            {id}
        </button>
    );
};

const Theaters = () => {
    const [selectedSeats, setSelectedSeats] = useState(new Set());

    const handleSeatSelect = (seatId) => {
        setSelectedSeats((prev) => {
            const next = new Set(prev);
            if (next.has(seatId)) {
                next.delete(seatId);
            } else {
                next.add(seatId);
            }
            return next;
        });
    };

    const renderRow = (label, count, startNum = 1) => {
        const seats = [];
        for (let i = 0; i < count; i++) {
            const seatId = `${label}${startNum + i}`;
            seats.push(
                <Seat
                    key={seatId}
                    id={seatId}
                    isSelected={selectedSeats.has(seatId)}
                    onSelect={handleSeatSelect}
                />
            );
        }
        return seats;
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primary text-sm font-medium tracking-wider uppercase mb-1">
                        QuickShow Cinema
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Theater Layout</h1>
                    <p className="text-sm text-gray-500">
                        Explore our seating arrangement — tap seats to preview selection
                    </p>
                </div>

                {/* Theater Info Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-12">
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-primary mb-1">56</p>
                        <p className="text-xs text-gray-500">Total Seats</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400 mb-1">3</p>
                        <p className="text-xs text-gray-500">Tiers</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400 mb-1">Dolby</p>
                        <p className="text-xs text-gray-500">Sound</p>
                    </div>
                </div>

                {/* Screen indicator */}
                <div className="flex flex-col items-center mb-10">
                    <img
                        src={screenImage}
                        alt="Screen"
                        className="w-full max-w-lg opacity-80"
                    />
                    <span className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
                        Screen Side
                    </span>
                </div>

                {/* Seat grid */}
                <div className="flex flex-col items-center gap-10">
                    {seatLayout.map((tier, tierIdx) => (
                        <div key={tierIdx} className="flex flex-col items-center gap-2">
                            {tierIdx === 0 && (
                                <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-1 font-medium">
                                    Premium
                                </p>
                            )}
                            {tierIdx === 1 && (
                                <p className="text-[10px] text-blue-400/60 uppercase tracking-widest mb-1 font-medium">
                                    Standard
                                </p>
                            )}
                            {tierIdx === 2 && (
                                <p className="text-[10px] text-green-400/60 uppercase tracking-widest mb-1 font-medium">
                                    Economy
                                </p>
                            )}
                            {tier.split
                                ? tier.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex items-center gap-6 sm:gap-10"
                                    >
                                        <div className="flex gap-1 sm:gap-1.5">
                                            {renderRow(row.label, row.seatsLeft)}
                                        </div>
                                        <div className="w-4 sm:w-8" />
                                        <div className="flex gap-1 sm:gap-1.5">
                                            {renderRow(row.rightLabel, row.seatsRight)}
                                        </div>
                                    </div>
                                ))
                                : tier.rows.map((row) => (
                                    <div key={row.label} className="flex gap-1 sm:gap-1.5">
                                        {renderRow(row.label, row.seats)}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-white/[0.04] border border-white/10" />
                        <span className="text-xs text-gray-500">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-primary border border-primary" />
                        <span className="text-xs text-gray-500">Selected</span>
                    </div>
                </div>

                {/* Selected seats info */}
                {selectedSeats.size > 0 && (
                    <div className="mt-8 bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            {selectedSeats.size} {selectedSeats.size === 1 ? "seat" : "seats"} selected (preview)
                        </p>
                        <p className="text-sm font-semibold text-white">
                            {Array.from(selectedSeats).sort().join(", ")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Theaters;
