import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Plus } from "lucide-react";
import { api } from "../services/api";

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.getCalendarTrips();
        setTrips(data.trips || []);
      } catch (err) {
        console.error("Failed to fetch calendar trips:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const isToday = (day) => {
      const today = new Date();
      return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const getTripsForDay = (day) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const d = new Date(dateStr);
      return trips.filter(t => {
        if (!t.startDate || !t.endDate) return false;
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        // Normalize time
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        const current = new Date(d);
        current.setHours(0,0,0,0);
        return current >= start && current <= end;
      });
    };

    // Fill empty slots before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[120px] p-2 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"></div>);
    }

    // Fill days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayTrips = getTripsForDay(day);
      days.push(
        <div key={`day-${day}`} className={`min-h-[80px] sm:min-h-[120px] p-2 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors`}>
          <div className="flex justify-end">
            <span className={`text-sm sm:text-base w-7 h-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200 dark:ring-blue-900' : 'text-slate-700 dark:text-slate-300'}`}>
              {day}
            </span>
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {dayTrips.map(trip => (
              <div 
                key={trip.id} 
                onClick={() => navigate(`/trips/${trip.id || trip.share_slug}`)}
                className="text-xs px-2 py-1 rounded truncate cursor-pointer bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 transition-colors"
                title={trip.title || trip.name || trip.destination}
              >
                {trip.title || trip.name || trip.destination || 'Trip'}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800 gap-[1px]">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trip Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Plan your upcoming adventures</p>
        </div>
        <button onClick={() => navigate('/trips/new')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium">
          <Plus className="w-5 h-5 mr-2" />
          Plan New Trip
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <MapPin className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No trips scheduled yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Plan your first adventure and see it on the calendar!</p>
          <button onClick={() => navigate('/trips/new')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create Trip
          </button>
        </div>
      ) : (
        renderCalendar()
      )}
    </div>
  );
}
