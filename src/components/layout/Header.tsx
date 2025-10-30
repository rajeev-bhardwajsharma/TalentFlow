import React, { useState, useEffect, useRef } from "react";
import Logo from "../ui/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Button from "../ui/Button";

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const { role, logout } = useUser();

  const isLandingPage = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Detect scroll for header style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Landing Page Header
  if (isLandingPage) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-effect shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <Logo />
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate("/jobs")}
                className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Find Jobs
              </button>
              <a
                href="#features"
                className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                About
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {role ? (
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(role === "hr" ? "/dashboard" : "/jobs")
                  }
                >
                  Go to {role === "hr" ? "Dashboard" : "Jobs"}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button variant="primary" onClick={() => navigate("/login")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard Header (HR only)
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect shadow-lg" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div onClick={() => navigate("/dashboard")} className="cursor-pointer">
            <Logo />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-3 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all duration-200 group">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Messages */}
            <button className="hidden sm:block p-3 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.582 15.847 3 14.071 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">HR</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900">HR Manager</p>
                  <p className="text-xs text-slate-500">hr@company.com</p>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="dropdown-modern absolute right-0 mt-3 w-72 z-50">
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">HR</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-slate-900">HR Manager</p>
                        <p className="text-sm text-slate-500">hr@company.com</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-indigo-600">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          Administrator
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="dropdown-item w-full text-left">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button className="dropdown-item w-full text-left">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>

                    <button className="dropdown-item w-full text-left">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Help & Support</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="dropdown-item w-full text-left text-red-600 hover:bg-red-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
