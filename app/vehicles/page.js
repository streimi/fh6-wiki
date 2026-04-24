"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Gauge,
  Settings2,
  ChevronDown,
  FlipHorizontal2,
} from "lucide-react";

// ============================================================================
// DATA: Cars Database
// ============================================================================

const carsData = [
  {
    id: 1,
    make: "Toyota",
    model: "GR GT3",
    year: 2026,
    jpMake: "トヨタ",
    class: "S2",
    pi: 910,
    drivetrain: "RWD",
    type: "Track Toy",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    make: "Toyota",
    model: "Land Cruiser 250",
    year: 2024,
    jpMake: "トヨタ",
    class: "C",
    pi: 540,
    drivetrain: "AWD",
    type: "Offroad",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    make: "Nissan",
    model: "Skyline GT-R V-Spec II",
    year: 2002,
    jpMake: "日産",
    class: "A",
    pi: 745,
    drivetrain: "AWD",
    type: "Retro Sports",
    image:
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    make: "placeholder_brand",
    model: "placeholder_model",
    year: 9999,
    jpMake: "placeholder_japanese",
    class: "placeholder_class",
    pi: 999,
    drivetrain: "placeholder_drivetrain",
    type: "placeholder_type",
    image: "/img/car_thumbs/McLaren_P1_GTR.webp",
  },
];

const classColors = {
  X: "bg-green-500",
  S2: "bg-blue-600",
  S1: "bg-purple-600",
  A: "bg-red-600",
  B: "bg-orange-500",
  C: "bg-yellow-500",
  D: "bg-cyan-500",
};

// ============================================================================
// BLOCK 2: PageHeader Component
// ============================================================================

const PageHeader = () => {
  return (
    <div className="relative pt-32 pb-16 overflow-hidden border-b border-neutral-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[18rem] font-black text-neutral-900/40 pointer-events-none select-none z-0 whitespace-nowrap transition-colors duration-300">
        車両一覧
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-500 font-bold tracking-[0.4em] mb-3 text-sm">
          車両データベース
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">
          Vehicle{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
            Database
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-neutral-400 text-lg">
          Explore the complete roster of cars available at the Japan Horizon
          Festival. Filter by class, manufacturer, or drivetrain to find your
          perfect ride.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// BLOCK 3: Flippable Car Card Component
// ============================================================================

const CarCard = ({ car }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speed = Math.min(10, car.pi / 100 + 0.8).toFixed(1);
  const handling = Math.min(10, car.pi / 100 + 1.2).toFixed(1);
  const acceleration = Math.min(10, car.pi / 100 + 1.5).toFixed(1);
  const braking = Math.min(10, car.pi / 100 + 0.9).toFixed(1);

  const stats = [
    { label: "Speed", value: speed },
    { label: "Handling", value: handling },
    { label: "Accel", value: acceleration },
    { label: "Braking", value: braking },
  ];

  return (
    <div
      className="cursor-pointer"
      style={{
        perspective: "1200px",
        height: "420px",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
      onClick={() => setIsFlipped((f) => !f)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            willChange: "transform",
          }}
        >
          {/* ── FRONT FACE ── */}
          <div
            className="bg-neutral-900/40 rounded-2xl overflow-hidden border border-neutral-800 group hover:border-red-500/50 transition-colors duration-300 hover:shadow-xl hover:shadow-red-500/5 relative"
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
              outline: "1px solid transparent",
            }}
          >
            {/* Background Watermark */}
            <div className="absolute -right-4 -bottom-6 text-[6rem] font-black text-neutral-800/30 group-hover:text-red-900/10 transition-colors pointer-events-none select-none z-0">
              {car.jpMake}
            </div>

            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80 z-10" />
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Class Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-neutral-950/80 backdrop-blur-sm pr-3 rounded-full border border-neutral-700/50 shadow-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm ${classColors[car.class] ?? "bg-neutral-600"}`}
                >
                  {car.class}
                </div>
                <span className="text-white font-bold text-sm tracking-widest pl-1">
                  {car.pi}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-red-500 font-bold text-xs tracking-widest uppercase mb-1">
                    {car.year} • {car.make}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {car.model}
                  </h3>
                </div>
                <span className="text-neutral-600 text-[10px] font-bold tracking-[0.2em]">
                  {car.jpMake}
                </span>
              </div>

              <p className="text-neutral-400 text-sm mb-6">
                {car.type}
              </p>

              {/* Specs Footer */}
              <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                <div className="flex gap-4">
                  <div
                    className="flex items-center gap-1.5 text-neutral-400"
                    title="Drivetrain"
                  >
                    <Settings2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {car.drivetrain}
                    </span>
                  </div>
                </div>
                {/* Flip hint button */}
                <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-bold uppercase tracking-wider select-none">
                  <FlipHorizontal2 className="w-4 h-4" />
                  Flip
                </div>
              </div>
            </div>
          </div>

          {/* ── BACK FACE ── */}
          <div
            className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 relative flex flex-col"
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(0)",
              outline: "1px solid transparent",
            }}
          >
            {/* Top accent strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-red-400 shrink-0" />

            <div className="flex flex-col flex-grow p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-red-500 font-bold text-xs tracking-widest uppercase mb-0.5">
                    {car.year} • {car.make}
                  </p>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {car.model}
                  </h3>
                  <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] mt-0.5">
                    {car.jpMake}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md shrink-0 ${classColors[car.class] ?? "bg-neutral-600"}`}
                >
                  {car.class}
                </div>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">
                      Drivetrain
                    </p>
                    <p className="font-bold text-sm text-white">
                      {car.drivetrain}
                    </p>
                  </div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">
                      Category
                    </p>
                    <p className="font-bold text-sm text-white line-clamp-1">
                      {car.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance bars */}
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                Performance
              </p>
              <div className="space-y-3 flex-grow">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {stat.label}
                      </span>
                      <span className="text-neutral-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 dark:bg-red-500 rounded-full"
                        style={{ width: `${(stat.value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Back flip hint */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 text-sm font-bold uppercase tracking-wider select-none">
                  <FlipHorizontal2 className="w-4 h-4" />
                  Flip
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BLOCK 4: Database & Filters Component
// ============================================================================

const VehicleDatabase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedMake, setSelectedMake] = useState("All");

  const classes = ["All", "X", "S2", "S1", "A", "B", "C", "D"];
  const makes = ["All", ...new Set(carsData.map((car) => car.make))].sort();

  const filteredCars = useMemo(() => {
    return carsData.filter((car) => {
      const matchesSearch =
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.make.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass =
        selectedClass === "All" || car.class === selectedClass;
      const matchesMake = selectedMake === "All" || car.make === selectedMake;
      return matchesSearch && matchesClass && matchesMake;
    });
  }, [searchQuery, selectedClass, selectedMake]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white/50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm dark:shadow-none">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-neutral-900 dark:text-white placeholder-neutral-500 transition-all outline-none"
            placeholder="Search make or model..."
          />
        </div>

        <div className="flex gap-4">
          <div className="relative min-w-[140px]">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-red-500 text-neutral-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="All">All Makes</option>
              {makes
                .filter((m) => m !== "All")
                .map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          </div>

          <div className="relative min-w-[140px]">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-red-500 text-neutral-900 dark:text-white outline-none cursor-pointer font-bold"
            >
              <option value="All">All Classes</option>
              {classes
                .filter((c) => c !== "All")
                .map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex justify-between items-end mb-6">
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
          Showing{" "}
          <span className="text-neutral-900 dark:text-white font-bold">
            {filteredCars.length}
          </span>{" "}
          vehicles
        </p>
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Filter className="w-4 h-4" />
          <span>Sorted by relevance</span>
        </div>
      </div>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            No vehicles found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT (Export)
// ============================================================================

export default function CarsApp() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-50 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white transition-colors duration-300 flex flex-col">
        <main className="flex-grow">
          <PageHeader />
          <VehicleDatabase />
        </main>
      </div>
    </div>
  );
}
