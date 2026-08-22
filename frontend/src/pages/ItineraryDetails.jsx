import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit2, Calendar, DollarSign, Clock, MapPin, Save, Share2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../services/api";

export default function ItineraryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityData, setActivityData] = useState({ name: "", time: "", description: "", cost: "", notes: "" });

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const fetchTripData = async () => {
    setIsLoading(true);
    try {
      const tripRes = await api.getTripById(id);
      if (!tripRes.trip) throw new Error("Trip not found");
      setTrip(tripRes.trip);

      const itinRes = await api.getTripItinerary(id);
      
      // If we don't have well-formed days, create some based on duration
      let days = itinRes.itinerary || [];
      if (days.length === 0) {
        const duration = tripRes.trip.durationDays || 3;
        for (let i = 1; i <= duration; i++) {
          days.push({ dayNumber: i, activities: [] });
        }
      } else {
        // Ensure day objects have an activities array
        days = days.map(d => ({ ...d, activities: d.activities || [] }));
      }
      setItinerary(days);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalExpenses = () => {
    let total = 0;
    itinerary.forEach(day => {
      day.activities?.forEach(act => {
        total += parseFloat(act.cost || 0);
      });
    });
    return total;
  };

  const handleSaveActivity = async () => {
    if (!activityData.name) return;
    
    try {
      let updatedDays = [...itinerary];
      const activeDay = updatedDays[activeTab];
      
      if (editingActivity) {
        await api.updateTripActivity(id, editingActivity.id, {
          scheduled_time: activityData.time,
          cost_override: activityData.cost,
          notes: activityData.notes,
          name: activityData.name,
          description: activityData.description
        });
        
        activeDay.activities = activeDay.activities.map(a => 
          a.id === editingActivity.id ? { ...a, ...activityData, cost: parseFloat(activityData.cost || 0) } : a
        );
      } else {
        const res = await api.addTripActivity(id, {
          stop_id: activeDay.stop_id || activeDay.id,
          scheduled_date: activeDay.date,
          scheduled_time: activityData.time,
          name: activityData.name,
          description: activityData.description,
          cost: parseFloat(activityData.cost || 0),
          notes: activityData.notes
        });
        
        const newAct = {
          id: res.trip_activity?.id || Date.now(),
          ...activityData,
          cost: parseFloat(activityData.cost || 0)
        };
        activeDay.activities.push(newAct);
      }
      
      setItinerary(updatedDays);
      setIsModalOpen(false);
      setEditingActivity(null);
    } catch (err) {
      console.error("Failed to save activity", err);
      alert("Failed to save activity");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await api.deleteTripActivity(id, activityId);
        let updatedDays = [...itinerary];
        updatedDays[activeTab].activities = updatedDays[activeTab].activities.filter(a => a.id !== activityId);
        setItinerary(updatedDays);
      } catch (err) {
        console.error("Failed to delete activity", err);
        alert("Failed to delete activity");
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-red-600"><h2>Error: {error}</h2><button onClick={() => navigate('/trips')} className="mt-4 text-blue-600 underline">Back to Trips</button></div>;

  const totalBudget = parseFloat(trip.budget?.total || trip.budget || 0);
  const plannedExpense = calculateTotalExpenses();
  const remainingBudget = totalBudget - plannedExpense;
  const usedPercent = totalBudget > 0 ? Math.min((plannedExpense / totalBudget) * 100, 100) : 0;
  const isOverBudget = plannedExpense > totalBudget && totalBudget > 0;

  const currentDay = itinerary[activeTab];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{trip.title || trip.name || "Trip Itinerary"}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> {trip.destination || "Destination"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Trip">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </button>
        </div>
      </div>

      {/* Budget Summary Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500"/> Budget Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">₹{totalBudget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Planned Expense</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">₹{plannedExpense.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
            <p className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{remainingBudget.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
          <div className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${usedPercent}%` }}></div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">{usedPercent.toFixed(1)}% Used</span>
          {isOverBudget && <span className="text-red-500 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> ⚠️ Budget exceeded by ₹{Math.abs(remainingBudget).toLocaleString()}</span>}
        </div>
      </div>

      {/* Day-by-Day Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {itinerary.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors flex flex-col items-center min-w-[100px] ${
              activeTab === idx 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-sm opacity-80">Day</span>
            <span className="text-xl">{day.dayNumber || idx + 1}</span>
          </button>
        ))}
      </div>

      {/* Active Day Content */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Day {currentDay?.dayNumber || activeTab + 1}</h2>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Day Total: ₹{currentDay?.activities?.reduce((sum, a) => sum + parseFloat(a.cost || 0), 0).toLocaleString()}
          </span>
        </div>

        {currentDay?.activities?.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center border-dashed">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No activities planned for this day.</p>
          </div>
        ) : (
          currentDay?.activities?.map((activity, idx) => (
            <div key={activity.id || idx} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 relative group">
              
              <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-100 dark:border-slate-800 pr-4">
                <span className="text-sm font-bold text-slate-400">#{idx + 1}</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap mt-1">{activity.time}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activity.name}</h3>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-sm">
                    ₹{parseFloat(activity.cost || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">{activity.description}</p>
                {activity.notes && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs text-slate-500 dark:text-slate-400 italic">
                    Note: {activity.notes}
                  </div>
                )}
              </div>

              <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 flex flex-row sm:flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity justify-start sm:justify-center">
                <button onClick={() => { setEditingActivity(activity); setActivityData(activity); setIsModalOpen(true); }} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:text-blue-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteActivity(activity.id)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}

        <button 
          onClick={() => { setEditingActivity(null); setActivityData({ name: "", time: "", description: "", cost: "", notes: "" }); setIsModalOpen(true); }}
          className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Activity
        </button>
      </div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg my-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingActivity ? 'Edit Activity' : 'Add Activity'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Activity Name</label>
                  <input type="text" value={activityData.name} onChange={e => setActivityData({...activityData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="e.g. Visit Museum" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input type="time" value={activityData.time} onChange={e => setActivityData({...activityData, time: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={activityData.description} onChange={e => setActivityData({...activityData, description: e.target.value})} rows="2" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent resize-none" placeholder="Activity details..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost (₹)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="number" value={activityData.cost} onChange={e => setActivityData({...activityData, cost: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                <input type="text" value={activityData.notes} onChange={e => setActivityData({...activityData, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent" placeholder="Booking references, tips..." />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={handleSaveActivity} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Activity</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
