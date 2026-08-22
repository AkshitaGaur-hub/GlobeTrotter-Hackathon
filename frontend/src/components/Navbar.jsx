import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, Search, LogOut, User, Menu, X, PlusCircle, Globe, Map, Sun, Moon, CalendarDays, MessageSquare, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has previously set dark mode or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
        location.pathname === to
          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white transition-colors duration-200">
                <Compass className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-blue-400">
                  GlobeTrotter
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={Globe}>Dashboard</NavLink>
                <NavLink to="/search" icon={Search}>Search</NavLink>
                <NavLink to="/trips" icon={Map}>My Trips</NavLink>
                <NavLink to="/calendar" icon={CalendarDays}>Calendar</NavLink>
                <NavLink to="/community" icon={MessageSquare}>Community</NavLink>
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                
                <Link
                  to="/trips/new"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan Trip</span>
                </Link>
                
                <div className="relative ml-2 group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 dark:border-slate-600">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} 
                        alt="Avatar" 
                      />
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      
                      {user?.is_admin && (
                        <Link to="/admin" className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <Shield className="w-4 h-4 text-blue-500" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link to="/profile" className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <User className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium px-3 py-2">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl absolute w-full left-0 z-50">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} alt="Avatar" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
                
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <Globe className="w-5 h-5" /> Dashboard
                </Link>
                <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <Search className="w-5 h-5" /> Search
                </Link>
                <Link to="/trips" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <Map className="w-5 h-5" /> My Trips
                </Link>
                <Link to="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <CalendarDays className="w-5 h-5" /> Calendar
                </Link>
                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <MessageSquare className="w-5 h-5" /> Community
                </Link>

                {user?.is_admin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <Shield className="w-5 h-5" /> Admin Dashboard
                  </Link>
                )}

                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border-t border-slate-100 dark:border-slate-800 mt-2 pt-3">
                  <User className="w-5 h-5" /> Profile
                </Link>
                
                <Link to="/trips/new" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 w-full">
                  <PlusCircle className="w-5 h-5" /> Plan New Trip
                </Link>
                
                <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 w-full text-left px-3 py-3 mt-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border-t border-slate-100 dark:border-slate-800 pt-4">
                  <LogOut className="w-5 h-5" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-center text-slate-600 dark:text-slate-300 font-medium">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block mt-2 px-3 py-3 text-center bg-blue-600 text-white font-medium rounded-lg">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
