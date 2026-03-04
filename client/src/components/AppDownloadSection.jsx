import React from "react";
import { assets } from "../assets/assets";
import { Smartphone, Ticket, Bell, Zap } from "lucide-react";

const features = [
    {
        icon: Ticket,
        title: "Instant Booking",
        desc: "Book tickets in seconds",
    },
    {
        icon: Bell,
        title: "Show Alerts",
        desc: "Never miss a premiere",
    },
    {
        icon: Zap,
        title: "Quick Pay",
        desc: "OTP-based payments",
    },
];

const AppDownloadSection = () => {
    return (
        <section className="px-6 md:px-16 lg:px-36 py-20">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-[#1a1a1a] to-[#0f0f0f] border border-white/5">
                {/* Glow effects */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />

                <div className="relative flex flex-col md:flex-row items-center gap-10 p-8 md:p-14">
                    {/* Left content */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-primary">
                                Mobile App
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            Get the QuickShow
                            <br />
                            <span className="text-primary">Experience</span>
                        </h2>

                        <p className="text-gray-400 text-sm mb-8 max-w-md">
                            Download the app for a seamless booking experience. Browse movies,
                            pick your seats, and get instant confirmations — all from your
                            phone.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
                                >
                                    <f.icon className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="text-xs font-medium text-white">{f.title}</p>
                                        <p className="text-[10px] text-gray-500">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* App store badges */}
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a
                                href="#"
                                className="transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                <img
                                    src={assets.googlePlay}
                                    alt="Get on Google Play"
                                    className="h-12"
                                />
                            </a>
                            <a
                                href="#"
                                className="transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                                <img
                                    src={assets.appStore}
                                    alt="Download on App Store"
                                    className="h-12"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Right — phone mockup */}
                    <div className="flex-shrink-0 hidden md:flex items-center justify-center">
                        <div className="relative">
                            {/* Phone frame */}
                            <div className="w-56 h-[420px] rounded-[2.5rem] border-2 border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#111] shadow-2xl shadow-primary/5 p-3 flex flex-col overflow-hidden">
                                {/* Notch */}
                                <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3" />
                                {/* Screen content mockup */}
                                <div className="flex-1 rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-4 flex flex-col gap-3">
                                    {/* Mini poster cards */}
                                    <div className="w-full h-24 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center">
                                        <Ticket className="w-8 h-8 text-primary/60" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-16 rounded-lg bg-white/5" />
                                        <div className="flex-1 h-16 rounded-lg bg-white/5" />
                                    </div>
                                    <div className="h-3 w-3/4 rounded-full bg-white/5" />
                                    <div className="h-3 w-1/2 rounded-full bg-white/5" />
                                    <div className="mt-auto h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <span className="text-[10px] text-primary font-semibold">
                                            Book Now
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Glow behind phone */}
                            <div className="absolute inset-0 -z-10 blur-3xl bg-primary/10 rounded-full scale-75" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
