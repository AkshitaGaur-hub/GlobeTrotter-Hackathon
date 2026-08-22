import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Trash2, Calendar, DollarSign, GripVertical, Save, Share2, MapPin } from "lucide-react";

export default function ItineraryDetails() {
  const { id } = useParams();

  // We transition from a flat "day by day timeline" to editable sections
  const [sections, setSections] = useState([
    {
      id: "sec-1",
      title: "Section 1",
      description: "Explore the historic city center and visit the main monuments.",
      startDate: "2026-08-20",
      endDate: "2026-08-22",
      budget: "500",
      location: "Paris Center"
    },
    {
      id: "sec-2",
      title: "Section 2",
      description: "Day trip to Versailles and surrounding wine regions.",
      startDate: "2026-08-23",
      endDate: "2026-08-24",
      budget: "350",
      location: "Versailles"
    }
  ]);

  const addSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
      location: ""
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (idToRemove) => {
    setSections(sections.filter(s => s.id !== idToRemove));
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(sec => 
      sec.id === id ? { ...sec, [field]: value } : sec
    ));
  };

  const totalBudget = sections.reduce((sum, sec) => sum + (parseFloat(sec.budget) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trip Itinerary</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> Multi-City Journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold flex items-center border border-green-200">
            <DollarSign className="w-4 h-4 mr-1" />
            Total Budget: ${totalBudget.toFixed(2)}
          </div>
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Share Trip">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row gap-6 relative group">
            
            {/* Drag Handle & Delete (Desktop) */}
            <div className="hidden md:flex flex-col items-center justify-between py-2 text-slate-300">
              <GripVertical className="w-5 h-5 cursor-grab hover:text-slate-500 dark:text-slate-400" />
              <button 
                onClick={() => removeSection(section.id)}
                className="text-slate-300 hover:text-red-500 transition-colors mt-auto"
                title="Remove Section"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center md:block">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="text-xl font-bold text-slate-900 dark:text-white border-none p-0 focus:ring-0 bg-transparent hover:bg-slate-50 dark:bg-slate-800 rounded px-2 -ml-2 transition-colors w-1/2"
                />
                {/* Mobile delete */}
                <button 
                  onClick={() => removeSection(section.id)}
                  className="md:hidden text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description & Plans</label>
                <textarea
                  value={section.description}
                  onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="What are the main activities for this section?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Range</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="date"
                        value={section.startDate}
                        onChange={(e) => updateSection(section.id, 'startDate', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <span className="text-slate-400">to</span>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={section.endDate}
                        onChange={(e) => updateSection(section.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Section Budget</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={section.budget}
                      onChange={(e) => updateSection(section.id, 'budget', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addSection}
        className="mt-8 w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 font-medium hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition-all"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add another Section
      </button>

    </div>
  );
}
