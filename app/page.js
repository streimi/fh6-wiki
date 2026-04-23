"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  CarFront,
  Map,
  CalendarDays,
  Gamepad2,
  ArrowRight,
  X,
  ChevronRight,
  Mountain,
  Globe,
  Paintbrush,
  Sun,
  Moon,
  House
} from "lucide-react";
import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// ============================================================================
// BLOCK 3: QuickStats Component
// Extract to: components/QuickStats.jsx
// ============================================================================

const QuickStats = () => {
  const stats = [
    {
      icon: <Map className="w-6 h-6" />,
      label: "Setting",
      jp: "設定",
      value: "Japan (Tokyo, Mt. Fuji)",
    },
    {
      icon: <CalendarDays className="w-6 h-6" />,
      label: "Release Date",
      jp: "発売日",
      value: "May 19, 2026",
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      label: "Platforms",
      jp: "対応機種",
      value: "Xbox Series X|S, PC",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Developer",
      jp: "開発者",
      value: "Playground Games",
    },
  ];

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 p-6 rounded-xl shadow-xl hover:border-red-500/50 transition-colors duration-200 group relative overflow-hidden"
          >
            {/* Background Kanji Watermark */}
            <div className="absolute -right-4 -bottom-4 text-6xl font-black text-neutral-800/30 group-hover:text-red-900/20 transition-colors duration-200 select-none pointer-events-none z-0">
              {stat.jp}
            </div>

            <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-200 origin-left relative z-10">
              {stat.icon}
            </div>
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <span className="text-[10px] text-red-500/70 tracking-widest">
                {stat.jp}
              </span>
            </div>
            <p className="text-lg text-white font-bold relative z-10">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// BLOCK 5: VehicleShowcase Component
// Extract to: components/VehicleShowcase.jsx
// ============================================================================

const VehicleShowcase = () => {
  const vehicles = [
    {
      id: 1,
      brand: "Toyota GAZOO Racing",
      jpBrand: "トヨタ ガズー レーシング",
      model: "2025 GR GT Prototype",
      role: "Cover Car - Track & Street",
      image:
        "/img/5-3.jpg",
      desc: "The flagship GR GT is envisioned as a road-legal race car, bringing Toyota's motorsport-bred philosophy to the neon streets of Tokyo.",
    },
    {
      id: 2,
      brand: "Toyota",
      jpBrand: "トヨタ",
      model: "Land Cruiser 250",
      role: "Cover Car - Offroad",
      image:
        "/img/first-look-at-the-new-to-forza-2025-toyota-landcruiser-v0-8ngfwx0mrnkg1.webp",
      desc: "Built to explore, the Land Cruiser 250 tackles the rugged rural terrains, muddy trails, and snowy peaks surrounding Mount Fuji.",
    },
  ];

  return (
    <div
      className="bg-neutral-950 border-y border-neutral-900 py-24 relative overflow-hidden transition-colors duration-300"
      id="vehicles"
    >
      {/* Decorative Japanese pattern background placeholder */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-red-500 font-bold tracking-[0.3em] mb-2 text-sm">
            公式カバーカー
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Official Cover Cars
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            For the first time in franchise history, both cover vehicles hail
            from the same parent automaker, celebrating Japan's automotive
            excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vehicles.map((car) => (
            <div
              key={car.id}
              className="bg-neutral-900/50 rounded-2xl overflow-hidden border border-neutral-800 group hover:border-red-500/50 transition-colors duration-300 backdrop-blur-sm shadow-xl shadow-none"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent z-10 transition-colors duration-300"></div>
                <Image
                  src={car.image}
                  alt={car.model}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg shadow-red-900/50">
                  {car.role}
                </div>
              </div>
              <div className="p-8 relative z-20 -mt-8">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-red-500 font-bold text-sm tracking-widest uppercase">
                    {car.brand}
                  </p>
                  <p className="text-neutral-600 text-xs font-medium tracking-widest">
                    {car.jpBrand}
                  </p>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {car.model}
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  {car.desc}
                </p>
                <button className="text-white font-semibold flex items-center gap-2 group-hover:text-red-400 transition-all duration-300">
                  View Specs <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BLOCK 6: FeaturesGrid Component
// Extract to: components/FeaturesGrid.jsx
// ============================================================================

const FeaturesGrid = () => {
  const features = [
    {
      title: "Tokyo City",
      jp: "東京",
      desc: "Five times larger than previous cities, featuring dense neon-lit downtowns, Shibuya Crossing, and sprawling industrial docklands.",
      icon: <Map className="w-8 h-8" />,
      color: "text-cyan-400",
      borderHover: "hover:border-cyan-500/50",
    },
    {
      title: "Homes & Estates",
      jp: "邸宅",
      desc: "Build and expand your own estate with customizable garages, trophy rooms, and scenic locations across Japan.",
      icon: <House className="w-8 h-8" />,
      color: "text-blue-400",
      borderHover: "hover:border-blue-500/50",
    },
    {
      title: "Touge Battles",
      jp: "峠道",
      desc: "Master the winding mountain roads. Japan's drift culture is brought to life with incredibly detailed Touge racing routes.",
      icon: <Mountain className="w-8 h-8" />,
      color: "text-emerald-400",
      borderHover: "hover:border-emerald-500/50",
    },
    {
      title: "Legend Island",
      jp: "伝説",
      desc: "Earn your Gold Wristband to access this exclusive late-game region filled with unique events and the toughest competition.",
      icon: <CarFront className="w-8 h-8" />,
      color: "text-amber-400",
      borderHover: "hover:border-amber-500/50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" id="features">
      <div className="mb-12">
        <p className="text-red-500 font-bold tracking-[0.3em] mb-2 text-sm">
          主な特徴
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Core Features
        </h2>
        <div className="h-1 w-20 bg-red-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className={`bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl transition-all duration-300 relative overflow-hidden group ${feat.borderHover} hover:bg-neutral-800/80 shadow-lg shadow-none`}
          >
            {/* Big background Kanji */}
            <div className="absolute -right-6 -top-6 text-[8rem] font-black text-neutral-800/20 group-hover:text-neutral-700/30 transition-colors pointer-events-none select-none z-0">
              {feat.jp}
            </div>

            <div className="relative z-10">
              <div
                className={`mb-6 p-4 rounded-xl bg-neutral-950 inline-block border border-neutral-800 group-hover:scale-110 transition-transform ${feat.color}`}
              >
                {feat.icon}
              </div>
              <div className="flex items-end gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                <span className="text-sm font-medium text-neutral-500 tracking-widest mb-[2px]">
                  {feat.jp}
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT (Export)
// ============================================================================

export default function App() {
  return (
    <div className="dark">
      <div className="bg-neutral-950 min-h-screen text-neutral-50 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white transition-colors duration-300">
        <main>
          <HeroSection />
          <QuickStats />
          <AboutSection />
          <VehicleShowcase />
          <FeaturesGrid />
        </main>
      </div>
    </div>
  );
}
