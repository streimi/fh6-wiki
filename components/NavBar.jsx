"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center -skew-x-12">
              <span className="text-white font-bold italic">FH</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-xl uppercase text-white">
                Horizon<span className="text-red-500">Wiki</span>
              </span>
              <span className="text-[9px] text-red-500 tracking-[0.3em]">
                ホライゾン・ウィキ
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Vehicles", "Map", "Features", "Updates"].map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;

              const isActive =
                path === "/" ? pathname === "/" : pathname.startsWith(path);

              return (
                <Link
                  key={item}
                  href={path}
                  className={`text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-red-500 border-b-2 border-red-500 pb-1"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800">
          {["Home", "Vehicles", "Map", "Features", "Updates"].map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;

            return (
              <Link
                key={item}
                href={path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-neutral-300 hover:text-red-500"
              >
                {item}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}