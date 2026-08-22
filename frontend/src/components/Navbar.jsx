import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, Search, LogOut, User, Menu, X, PlusCircle, Globe, Map } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
        location.pathname === to
          ? "text-blue-600 bg-blue-50"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white transition-colors duration-200">
                <Compass className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 bg-clip-text text-transparent">
                  GlobeTrotter
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={Globe}>Dashboard</NavLink>
                <NavLink to="/search" icon={Search}>Search</NavLink>
                <NavLink to="/trips" icon={Map}>My Trips</NavLink>
                
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                
                <Link
                  to="/trips/new"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan Trip</span>
                </Link>
                
                <div className="relative ml-2 group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} 
                        alt="Avatar" 
                      />
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                        <User className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
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
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
