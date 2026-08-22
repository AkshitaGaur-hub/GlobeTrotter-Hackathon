import {
  MOCK_CITIES,
  MOCK_ACTIVITIES,
  getStoredTrips,
  saveStoredTrips,
  hydrateTrip,
  createMockTripFromGenerator,
  optimizeMockTrip,
} from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("globetrotter_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || `HTTP error ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.code = data.code;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        console.info("⚡ Backend offline, using demo auth mode");
        return {
          message: "Signed in (demo mode)",
          token: "demo-jwt-token-local",
          user: {
            id: 1,
            name: email.includes("demo") ? "Demo Traveler" : email.split("@")[0],
            email: email || "demo@globetrotter.app",
          },
        };
      }
      throw err;
    }
  },

  signup: async (name, email, password) => {
    try {
      return await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        console.info("⚡ Backend offline, using local signup mode");
        return {
          message: "User registered (demo mode)",
          token: "demo-jwt-token-local",
          user: { id: 1, name: name || "Traveler", email },
        };
      }
      throw err;
    }
  },

  getMe: async () => {
    try {
      return await request("/auth/me");
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return {
          user: {
            id: 1,
            name: "Demo Traveler",
            email: "demo@globetrotter.app",
          },
        };
      }
      throw err;
    }
  },

  // Trips
  getTrips: async () => {
    try {
      return await request("/trips");
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const trips = getStoredTrips();
        return { trips };
      }
      throw err;
    }
  },

  getTripById: async (id) => {
    try {
      return await request(`/trips/${id}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const trips = getStoredTrips();
        const found = trips.find((t) => t.id === id || t.share_slug === id) || trips[0];
        return { trip: found };
      }
      throw err;
    }
  },

  createTrip: async (tripData) => {
    try {
      return await request("/trips", {
        method: "POST",
        body: JSON.stringify(tripData),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const newTrip = hydrateTrip({
          ...tripData,
          id: `trip-${Date.now()}`,
          durationDays: tripData.durationDays || 5,
        });
        const current = getStoredTrips();
        saveStoredTrips([newTrip, ...current]);
        return { message: "Trip created", trip: newTrip };
      }
      throw err;
    }
  },

  deleteTrip: async (id) => {
    try {
      return await request(`/trips/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const current = getStoredTrips().filter((t) => t.id !== id);
        saveStoredTrips(current);
        return { message: "Trip deleted successfully" };
      }
      throw err;
    }
  },

  getTripBudget: async (id) => {
    try {
      return await request(`/trips/${id}/budget`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const trip = (await api.getTripById(id)).trip;
        return { budget: trip.budget_data };
      }
      throw err;
    }
  },

  getTripItinerary: async (id) => {
    try {
      return await request(`/trips/${id}/itinerary`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const trip = (await api.getTripById(id)).trip;
        return { itinerary: trip.itineraryDays };
      }
      throw err;
    }
  },

  applyOptimization: async (id, payload) => {
    try {
      return await request(`/trips/${id}/apply-optimization`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const currentTrips = getStoredTrips();
        const updated = hydrateTrip({
          ...(payload.optimized_plan || {}),
          id,
          budget: payload.newBudget,
          travel_style: payload.newStyle,
        });
        const nextList = currentTrips.map((t) => (t.id === id ? updated : t));
        saveStoredTrips(nextList);
        return { message: "Optimization applied", trip: updated };
      }
      throw err;
    }
  },

  getPublicTrip: async (shareSlug) => {
    try {
      return await request(`/public/trips/${shareSlug}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const trips = getStoredTrips();
        const found = trips.find((t) => t.share_slug === shareSlug || t.id === shareSlug) || trips[0];
        return { trip: found };
      }
      throw err;
    }
  },

  // AI Planner Engine
  generateTrip: async (params) => {
    try {
      return await request("/ai/generate-trip", {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        // Simulate thinking latency
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const newTrip = createMockTripFromGenerator(params);
        return {
          message: "Trip generated successfully via Adaptive AI",
          trip: newTrip,
        };
      }
      throw err;
    }
  },

  optimizeTrip: async (params) => {
    try {
      return await request("/ai/optimize-trip", {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const comparison = optimizeMockTrip(params);
        return {
          message: "Optimization simulated successfully",
          comparison,
        };
      }
      throw err;
    }
  },

  // Cities & Activities
  getCities: async (search = "") => {
    try {
      return await request(`/cities${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        let filtered = MOCK_CITIES;
        if (search) {
          filtered = MOCK_CITIES.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.region.toLowerCase().includes(search.toLowerCase())
          );
        }
        return { cities: filtered };
      }
      throw err;
    }
  },

  getCityById: async (id) => {
    try {
      return await request(`/cities/${id}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const found = MOCK_CITIES.find((c) => c.id === parseInt(id, 10)) || MOCK_CITIES[0];
        return { city: found };
      }
      throw err;
    }
  },

  getActivities: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request(`/activities${query ? `?${query}` : ""}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        const cityKey = params.city || "Jaipur";
        const acts = MOCK_ACTIVITIES[cityKey] || Object.values(MOCK_ACTIVITIES).flat();
        return { activities: acts };
      }
      throw err;
    }
  },
  // Calendar
  getCalendarTrips: async () => {
    try {
      return await request("/trips/calendar");
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        console.warn('Calendar API offline, using trip data fallback');
        const trips = await api.getTrips();
        return { trips: trips.trips || [] };
      }
      throw err;
    }
  },

  // Community
  getCommunityPosts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await request(`/community/posts${query ? `?${query}` : ""}`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { posts: [] };
      }
      throw err;
    }
  },
  createPost: async (data) => {
    try {
      return await request("/community/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { post: { id: Date.now(), ...data, likes: 0, comments: 0, created_at: new Date().toISOString(), user: { name: "Demo User" } } };
      }
      throw err;
    }
  },
  updatePost: async (id, data) => {
    try {
      return await request(`/community/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { post: { id, ...data } };
      }
      throw err;
    }
  },
  deletePost: async (id) => {
    try {
      return await request(`/community/posts/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { message: "Deleted" };
      }
      throw err;
    }
  },
  toggleLike: async (postId) => {
    try {
      return await request(`/community/posts/${postId}/like`, {
        method: "POST",
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { message: "Liked" };
      }
      throw err;
    }
  },
  getComments: async (postId) => {
    try {
      return await request(`/community/posts/${postId}/comments`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { comments: [] };
      }
      throw err;
    }
  },
  addComment: async (postId, content) => {
    try {
      return await request(`/community/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { comment: { id: Date.now(), content, created_at: new Date().toISOString(), user: { name: "Demo User" } } };
      }
      throw err;
    }
  },
  deleteComment: async (id) => {
    try {
      return await request(`/community/comments/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { message: "Deleted" };
      }
      throw err;
    }
  },

  // Trip Activities  
  addTripActivity: async (tripId, data) => {
    try {
      return await request(`/trips/${tripId}/activities`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { activity: { id: Date.now(), ...data } };
      }
      throw err;
    }
  },
  updateTripActivity: async (tripId, activityId, data) => {
    try {
      return await request(`/trips/${tripId}/activities/${activityId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { activity: { id: activityId, ...data } };
      }
      throw err;
    }
  },
  deleteTripActivity: async (tripId, activityId) => {
    try {
      return await request(`/trips/${tripId}/activities/${activityId}`, {
        method: "DELETE",
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { message: "Deleted" };
      }
      throw err;
    }
  },

  // Admin
  getAdminStats: async () => {
    try {
      return await request("/admin/stats");
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { stats: { totalUsers: 150, totalTrips: 45, totalPosts: 120, totalComments: 340, totalExpenses: 15000 } };
      }
      throw err;
    }
  },
  getAdminCharts: async () => {
    try {
      return await request("/admin/charts");
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { 
          charts: { 
            destinations: [{ name: "Paris", count: 12 }, { name: "Tokyo", count: 8 }], 
            activity: [{ date: "2026-08-01", count: 2 }], 
            expenses: [{ category: "Food", amount: 300 }], 
            community: [{ date: "2026-08-01", count: 5 }] 
          } 
        };
      }
      throw err;
    }
  },

  // Profile
  updateProfile: async (data) => {
    try {
      return await request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { user: { ...data } };
      }
      throw err;
    }
  },
  getUserProfile: async (userId) => {
    try {
      return await request(`/users/${userId}/profile`);
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        return { user: { id: userId, name: "Demo User", bio: "Loves traveling.", location: "Earth", travelStyle: "Budget" } };
      }
      throw err;
    }
  },
};

export default api;
