// Deterministic client-side mock data and fallback calculation engine

export const MOCK_CITIES = [
  {
    id: 1,
    name: "Jaipur",
    region: "Rajasthan",
    country: "India",
    cost_index: 55,
    popularity_score: 94,
    description: "The Pink City famous for majestic forts, royal palaces, vibrant bazaars, and rich Rajasthani heritage.",
    image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Udaipur",
    region: "Rajasthan",
    country: "India",
    cost_index: 60,
    popularity_score: 92,
    description: "The City of Lakes known for serene waters, romantic royal architecture, and sunset boat rides.",
    image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Goa",
    region: "West Coast",
    country: "India",
    cost_index: 68,
    popularity_score: 96,
    description: "Sun-drenched beaches, Portuguese colonial heritage, fresh seafood, and lively water sports.",
    image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Manali",
    region: "Himachal Pradesh",
    country: "India",
    cost_index: 50,
    popularity_score: 90,
    description: "Snow-capped peaks, pine forests, adventure sports, and scenic Himalayan valleys.",
    image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Varanasi",
    region: "Uttar Pradesh",
    country: "India",
    cost_index: 40,
    popularity_score: 89,
    description: "Spiritual heart of India with sacred Ganga Ghats, evening Aarti ceremonies, and ancient alleys.",
    image_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Agra",
    region: "Uttar Pradesh",
    country: "India",
    cost_index: 45,
    popularity_score: 95,
    description: "Home of the iconic Taj Mahal, Agra Fort, and rich Mughal architectural masterpieces.",
    image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Kochi",
    region: "Kerala",
    country: "India",
    cost_index: 58,
    popularity_score: 88,
    description: "Coastal spice port with Chinese fishing nets, Fort Kochi heritage, and serene backwaters.",
    image_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Rishikesh",
    region: "Uttarakhand",
    country: "India",
    cost_index: 42,
    popularity_score: 91,
    description: "Yoga capital of the world, white-water river rafting, and scenic mountain bridges over the Ganges.",
    image_url: "https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Delhi",
    region: "National Capital Region",
    country: "India",
    cost_index: 62,
    popularity_score: 93,
    description: "Dynamic capital blending centuries of Mughal history, colonial avenues, and legendary food streets.",
    image_url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80"
  }
];

export const MOCK_ACTIVITIES = {
  Jaipur: [
    { id: 101, name: "Amber Fort & Palace Tour", category: "History", cost: 500, duration_minutes: 180, scheduled_time: "09:30", description: "Explore the hilltop 16th-century fortress, Sheesh Mahal mirror palace, and panoramic views.", notes: "Go early to beat the crowds and heat.", image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
    { id: 102, name: "Hawa Mahal & Old City Photo Walk", category: "Photography", cost: 200, duration_minutes: 90, scheduled_time: "14:00", description: "Iconic honeycomb facade of the Palace of Winds and lively bazaars of the Pink City.", notes: "Great afternoon light across from Wind View Cafe.", image_url: "https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=800&q=80" },
    { id: 103, name: "Johari Bazaar Royal Street Food Crawl", category: "Food", cost: 450, duration_minutes: 120, scheduled_time: "18:30", description: "Taste authentic Pyaaz Kachori, Ghewar sweets, and refreshing Lassiwala lassi.", notes: "Vegetarian paradise with authentic Rajasthani spices.", image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" },
    { id: 104, name: "City Palace & Jantar Mantar Observatory", category: "Culture", cost: 700, duration_minutes: 150, scheduled_time: "11:00", description: "Walk through royal courtyards and the UNESCO World Heritage astronomical instruments.", notes: "Includes access to royal textile and weapon galleries.", image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" }
  ],
  Udaipur: [
    { id: 201, name: "City Palace Lakefront Tour", category: "History", cost: 650, duration_minutes: 150, scheduled_time: "10:00", description: "Rajasthan's largest palace complex overlooking Lake Pichola with exquisite glass and tile work.", notes: "Overlooks Jag Mandir and Lake Palace.", image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80" },
    { id: 202, name: "Sunset Boat Cruise on Lake Pichola", category: "Photography", cost: 800, duration_minutes: 90, scheduled_time: "17:00", description: "Glide past fairy-tale marble palaces as the sunset casts golden reflections across the water.", notes: "Advance reservation recommended for sunset slot.", image_url: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80" },
    { id: 203, name: "Dharohar Folk Dance at Bagore Ki Haveli", category: "Culture", cost: 350, duration_minutes: 90, scheduled_time: "19:00", description: "Electrifying performance of Rajasthani folk music, puppet shows, and traditional Chari pot dances.", notes: "Right at Gangaur Ghat on the lake edge.", image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80" },
    { id: 204, name: "Saheliyon Ki Bari & Royal Gardens", category: "Nature", cost: 150, duration_minutes: 60, scheduled_time: "15:00", description: "Historic ornamental gardens with marble fountains, lotus pools, and lush elephant sculptures.", notes: "Peaceful escape with cool fountain mist.", image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80" }
  ],
  Goa: [
    { id: 301, name: "Scuba Diving & Watersports at Grand Island", category: "Adventure", cost: 2200, duration_minutes: 240, scheduled_time: "08:30", description: "Discover Arabian sea coral reefs followed by parasailing and jet skiing.", notes: "Includes boat transfers and safety gear.", image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" },
    { id: 302, name: "Fontainhas Latin Quarter Heritage Walk", category: "Culture", cost: 400, duration_minutes: 120, scheduled_time: "16:00", description: "Wander through colourful pastel Portuguese houses, vintage bakeries, and art cafes in Panaji.", notes: "Wear comfortable walking shoes.", image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
    { id: 303, name: "Seafood Tasting at Anjuna Beach Shacks", category: "Food", cost: 850, duration_minutes: 120, scheduled_time: "19:30", description: "Fresh Goan fish curry, butter garlic prawns, and live acoustic music under the palms.", notes: "Watch the sunset right on the beach.", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }
  ],
  Manali: [
    { id: 401, name: "Solang Valley Paragliding & Zipline", category: "Adventure", cost: 1800, duration_minutes: 180, scheduled_time: "10:00", description: "Soar over lush alpine meadows with breathtaking views of the Pir Panjal range.", notes: "Weather dependent, best in clear morning hours.", image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80" },
    { id: 402, name: "Old Manali Cafe Crawl & Trout Tasting", category: "Food", cost: 600, duration_minutes: 120, scheduled_time: "18:00", description: "Wood-fired pizzas, fresh river trout, and Himalayan herbal teas along the riverside.", notes: "Relaxing bohemian vibe.", image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
    { id: 403, name: "Hadimba Temple & Cedar Forest Walk", category: "Nature", cost: 100, duration_minutes: 90, scheduled_time: "14:30", description: "Ancient 4-tier wooden pagoda temple nestled among towering centuries-old Deodar cedars.", notes: "Peaceful forest trails surround the temple.", image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80" }
  ],
  Varanasi: [
    { id: 501, name: "Dawn Boat Ride along Sacred Ghats", category: "Photography", cost: 500, duration_minutes: 120, scheduled_time: "05:45", description: "Witness the sunrise over the Ganges, morning prayers, and timeless rituals along the riverbank.", notes: "Capture unforgettable golden morning light.", image_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80" },
    { id: 502, name: "Grand Ganga Aarti at Dashashwamedh Ghat", category: "Culture", cost: 0, duration_minutes: 90, scheduled_time: "18:30", description: "Spectacular rhythmic brass lamp ceremony with incense, bells, and chanting at dusk.", notes: "Arrive 45 minutes early for prime viewing spot.", image_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80" },
    { id: 503, name: "Ancient Alleys Street Food & Kashi Chat", category: "Food", cost: 350, duration_minutes: 90, scheduled_time: "13:00", description: "Tamatar chaat, Malaiyyo foam dessert, and authentic Banarasi paan.", notes: "Navigate the vibrant winding gullies.", image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }
  ]
};

// Helper to compute deterministic mock budget
export function computeMockBudget({ stops = [], activities = [], travelersCount = 2, travelStyle = "Balanced", userBudget = 25000, durationDays = 5 }) {
  const styleMultiplier = travelStyle === "Relaxed" ? 1.3 : travelStyle === "Adventure" ? 0.9 : 1.1;

  let activitiesCost = 0;
  activities.forEach((a) => {
    const cost = a.cost_override ?? a.cost ?? 0;
    activitiesCost += cost * travelersCount;
  });

  const baseHotelPerNight = 2200 * styleMultiplier;
  const hotelCost = Math.round(baseHotelPerNight * Math.max(1, durationDays - 1));

  const baseFoodPerDay = 850 * travelersCount * (styleMultiplier * 0.9);
  const foodCost = Math.round(baseFoodPerDay * durationDays);

  const baseTransit = 1800 * Math.max(1, stops.length) * travelersCount;
  const transitCost = Math.round(baseTransit);

  const totalEstimatedCost = activitiesCost + hotelCost + foodCost + transitCost;
  const remaining = Math.max(0, userBudget - totalEstimatedCost);
  const isOverBudget = totalEstimatedCost > userBudget;
  const overBudgetAmount = isOverBudget ? totalEstimatedCost - userBudget : 0;
  const averagePerDay = Math.round(totalEstimatedCost / durationDays);

  const breakdown = {
    activities: activitiesCost,
    hotel: hotelCost,
    food: foodCost,
    transit: transitCost
  };

  const chartData = [
    { name: "Accommodation", value: hotelCost, color: "#f97316" },
    { name: "Food & Dining", value: foodCost, color: "#eab308" },
    { name: "Activities & Tours", value: activitiesCost, color: "#10b981" },
    { name: "Transit & Travel", value: transitCost, color: "#3b82f6" }
  ];

  return {
    totalEstimatedCost,
    budget: userBudget,
    remaining,
    isOverBudget,
    overBudgetAmount,
    averagePerDay,
    durationDays,
    breakdown,
    chartData,
    analytics: {
      mostExpensiveDay: { dayNumber: 2, totalCost: Math.round(averagePerDay * 1.35) },
      cheapestDay: { dayNumber: durationDays, totalCost: Math.round(averagePerDay * 0.7) }
    }
  };
}

// Helper to compute deterministic mock GlobeScore
export function computeMockGlobeScore({ budget = 25000, totalEstimatedCost = 22000, userInterests = [], activities = [], stops = [], durationDays = 5 }) {
  let budgetScore = 20;
  if (totalEstimatedCost > budget) {
    const diffPct = (totalEstimatedCost - budget) / budget;
    budgetScore = Math.max(8, Math.round(20 - diffPct * 25));
  } else {
    budgetScore = 20;
  }

  const interestScore = 18;
  const transitScore = 17;
  const activityDensity = 19;
  const varietyScore = 18;

  const totalScore = Math.min(100, budgetScore + interestScore + transitScore + activityDensity + varietyScore);
  const grade = totalScore >= 90 ? "Excellent" : totalScore >= 80 ? "Great" : totalScore >= 70 ? "Balanced" : "Needs Review";

  return {
    score: totalScore,
    grade,
    factors: {
      budgetEfficiency: { label: "Budget Alignment", score: budgetScore, max: 20 },
      interestMatching: { label: "Interest Fulfillment", score: interestScore, max: 20 },
      transitEfficiency: { label: "Transit & Route Efficiency", score: transitScore, max: 20 },
      dailyPacing: { label: "Daily Pacing & Rest", score: activityDensity, max: 20 },
      experienceVariety: { label: "Experience Diversity", score: varietyScore, max: 20 }
    },
    highlights: [
      `Fits within your target budget of ₹${budget.toLocaleString("en-IN")}`,
      `${activities.length} curated experiences tailored to your style`,
      `Optimized inter-city route across ${Math.max(1, stops.length)} destination(s)`
    ],
    warnings: totalEstimatedCost > budget ? [`Estimated expenses exceed target budget by ₹${(totalEstimatedCost - budget).toLocaleString("en-IN")}`] : []
  };
}

// Pre-seeded initial trips
export const INITIAL_MOCK_TRIPS = [
  {
    id: "trip-jaipur-udaipur-heritage",
    name: "Rajasthan Royal Heritage: Jaipur to Udaipur",
    description: "An authentic 5-day royal journey through majestic hilltop fortresses, scenic lake cruises, and rich heritage cuisine.",
    start_date: "2026-09-10",
    end_date: "2026-09-14",
    durationDays: 5,
    budget: 28000,
    travelers_count: 2,
    travel_style: "Balanced",
    interests: ["History", "Food", "Photography", "Culture"],
    things_to_avoid: "Long overnight bus journeys, tourist traps",
    share_slug: "rajasthan-royal-heritage",
    cities: [
      { id: 1, name: "Jaipur", region: "Rajasthan", cost_index: 55, image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
      { id: 2, name: "Udaipur", region: "Rajasthan", cost_index: 60, image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80" }
    ],
    stops: [
      { city_id: 1, city_name: "Jaipur", start_date: "2026-09-10", end_date: "2026-09-12" },
      { city_id: 2, city_name: "Udaipur", start_date: "2026-09-12", end_date: "2026-09-14" }
    ],
    activities: [
      { ...MOCK_ACTIVITIES.Jaipur[0], city_name: "Jaipur", scheduled_date: "2026-09-10" },
      { ...MOCK_ACTIVITIES.Jaipur[1], city_name: "Jaipur", scheduled_date: "2026-09-10" },
      { ...MOCK_ACTIVITIES.Jaipur[2], city_name: "Jaipur", scheduled_date: "2026-09-11" },
      { ...MOCK_ACTIVITIES.Jaipur[3], city_name: "Jaipur", scheduled_date: "2026-09-11" },
      { ...MOCK_ACTIVITIES.Udaipur[0], city_name: "Udaipur", scheduled_date: "2026-09-12" },
      { ...MOCK_ACTIVITIES.Udaipur[1], city_name: "Udaipur", scheduled_date: "2026-09-13" },
      { ...MOCK_ACTIVITIES.Udaipur[2], city_name: "Udaipur", scheduled_date: "2026-09-13" },
      { ...MOCK_ACTIVITIES.Udaipur[3], city_name: "Udaipur", scheduled_date: "2026-09-14" }
    ]
  },
  {
    id: "trip-goa-coastal-escape",
    name: "Goa Coastal Sun & Adventure",
    description: "Relaxed coastal getaway with water sports at Grand Island, Latin Quarter heritage in Panaji, and sunset beach cafes.",
    start_date: "2026-10-02",
    end_date: "2026-10-05",
    durationDays: 4,
    budget: 22000,
    travelers_count: 2,
    travel_style: "Relaxed",
    interests: ["Adventure", "Food", "Culture"],
    things_to_avoid: "Crowded tourist buses",
    share_slug: "goa-coastal-escape",
    cities: [
      { id: 3, name: "Goa", region: "West Coast", cost_index: 68, image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" }
    ],
    stops: [
      { city_id: 3, city_name: "Goa", start_date: "2026-10-02", end_date: "2026-10-05" }
    ],
    activities: [
      { ...MOCK_ACTIVITIES.Goa[0], city_name: "Goa", scheduled_date: "2026-10-02" },
      { ...MOCK_ACTIVITIES.Goa[1], city_name: "Goa", scheduled_date: "2026-10-03" },
      { ...MOCK_ACTIVITIES.Goa[2], city_name: "Goa", scheduled_date: "2026-10-04" }
    ]
  }
];

// Hydrate trip with computed itineraryDays, budget_data, and globe_score_data
export function hydrateTrip(rawTrip) {
  const days = [];
  const start = new Date(rawTrip.start_date);

  for (let i = 0; i < rawTrip.durationDays; i++) {
    const curDate = new Date(start);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split("T")[0];

    // Determine current city stop
    let currentCity = rawTrip.cities?.[0]?.name || "Destination";
    if (rawTrip.stops && rawTrip.stops.length > 0) {
      const stop = rawTrip.stops.find((s) => dateStr >= s.start_date && dateStr <= s.end_date) || rawTrip.stops[0];
      currentCity = stop.city_name || currentCity;
    }

    const dayActivities = (rawTrip.activities || []).filter((a) => a.scheduled_date === dateStr || (!a.scheduled_date && i === 0));

    days.push({
      dayNumber: i + 1,
      date: dateStr,
      city: currentCity,
      activities: dayActivities
    });
  }

  const budgetData = computeMockBudget({
    stops: rawTrip.stops || [],
    activities: rawTrip.activities || [],
    travelersCount: rawTrip.travelers_count || 2,
    travelStyle: rawTrip.travel_style || "Balanced",
    userBudget: rawTrip.budget || 25000,
    durationDays: rawTrip.durationDays || 5
  });

  const globeScoreData = computeMockGlobeScore({
    budget: rawTrip.budget || 25000,
    totalEstimatedCost: budgetData.totalEstimatedCost,
    userInterests: rawTrip.interests || [],
    activities: rawTrip.activities || [],
    stops: rawTrip.stops || [],
    durationDays: rawTrip.durationDays || 5
  });

  return {
    ...rawTrip,
    total_estimated_cost: budgetData.totalEstimatedCost,
    globe_score: globeScoreData.score,
    itineraryDays: days,
    budget_data: budgetData,
    globe_score_data: globeScoreData
  };
}

// Local storage management
const STORAGE_KEY = "globetrotter_saved_trips";

export function getStoredTrips() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(hydrateTrip);
      }
    }
  } catch (err) {
    console.warn("Error reading local trips:", err);
  }
  const initial = INITIAL_MOCK_TRIPS.map(hydrateTrip);
  saveStoredTrips(initial);
  return initial;
}

export function saveStoredTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.warn("Error saving trips locally:", err);
  }
}

// Generate new mock trip
export function createMockTripFromGenerator(params) {
  const {
    startingCityName = "Delhi",
    destinationPreference = "",
    startDate = "2026-09-10",
    endDate = "2026-09-15",
    durationDays = 5,
    budget = 25000,
    travelersCount = 2,
    travelStyle = "Balanced",
    interests = ["Food", "History"],
    thingsToAvoid = ""
  } = params;

  // Determine destinations
  let matchedCities = [];
  const prefLower = (destinationPreference || "").toLowerCase();

  if (prefLower.includes("goa") || prefLower.includes("beach")) {
    matchedCities = [MOCK_CITIES.find((c) => c.name === "Goa")];
  } else if (prefLower.includes("manali") || prefLower.includes("himachal") || prefLower.includes("mountain")) {
    matchedCities = [MOCK_CITIES.find((c) => c.name === "Manali")];
  } else if (prefLower.includes("varanasi") || prefLower.includes("spiritual") || prefLower.includes("ganga")) {
    matchedCities = [MOCK_CITIES.find((c) => c.name === "Varanasi")];
  } else {
    matchedCities = [
      MOCK_CITIES.find((c) => c.name === "Jaipur"),
      MOCK_CITIES.find((c) => c.name === "Udaipur")
    ].filter(Boolean);
  }

  if (matchedCities.length === 0) {
    matchedCities = [MOCK_CITIES[0], MOCK_CITIES[1]];
  }

  // Create stops
  const start = new Date(startDate);
  const stops = [];
  const halfDays = Math.ceil(durationDays / matchedCities.length);

  matchedCities.forEach((city, idx) => {
    const stopStart = new Date(start);
    stopStart.setDate(stopStart.getDate() + idx * halfDays);

    const stopEnd = new Date(stopStart);
    stopEnd.setDate(stopEnd.getDate() + halfDays - (idx === matchedCities.length - 1 ? 1 : 0));

    stops.push({
      city_id: city.id,
      city_name: city.name,
      cost_index: city.cost_index,
      start_date: stopStart.toISOString().split("T")[0],
      end_date: stopEnd.toISOString().split("T")[0]
    });
  });

  // Pick activities
  const tripActivities = [];
  matchedCities.forEach((city, cIdx) => {
    const cityActs = MOCK_ACTIVITIES[city.name] || MOCK_ACTIVITIES.Jaipur;
    cityActs.forEach((act, aIdx) => {
      const actDate = new Date(start);
      actDate.setDate(actDate.getDate() + Math.min(durationDays - 1, cIdx * halfDays + Math.floor(aIdx / 2)));
      tripActivities.push({
        ...act,
        city_name: city.name,
        scheduled_date: actDate.toISOString().split("T")[0]
      });
    });
  });

  const tripId = `trip-${Date.now()}`;
  const newTrip = {
    id: tripId,
    name: `${matchedCities.map((c) => c.name).join(" & ")} Adaptive Journey`,
    description: `A ${durationDays}-day personalized itinerary starting from ${startingCityName} focusing on ${interests.join(", ")} at a ${travelStyle.toLowerCase()} pace.`,
    start_date: startDate,
    end_date: endDate,
    durationDays,
    budget,
    travelers_count: travelersCount,
    travel_style: travelStyle,
    interests,
    things_to_avoid: thingsToAvoid,
    share_slug: `trip-${Date.now().toString(36)}`,
    cities: matchedCities,
    stops,
    activities: tripActivities
  };

  const hydrated = hydrateTrip(newTrip);
  const currentTrips = getStoredTrips();
  saveStoredTrips([hydrated, ...currentTrips]);
  return hydrated;
}

// Optimize trip simulation
export function optimizeMockTrip(params) {
  const { trip_id, newBudget, newDuration, newTravelStyle, destinationChange } = params;
  const allTrips = getStoredTrips();
  const currentTrip = allTrips.find((t) => t.id === trip_id) || allTrips[0];

  const beforeCost = currentTrip.total_estimated_cost;
  const targetBudget = Number(newBudget || currentTrip.budget * 0.75);
  const newDays = Number(newDuration || currentTrip.durationDays);
  const newStyle = newTravelStyle || currentTrip.travel_style;

  // Optimized cost calculations
  const optimizedCost = Math.round(targetBudget * 0.94);
  const savings = Math.max(1200, beforeCost - optimizedCost);

  const whatChanged = [
    `Re-allocated ₹${Math.round(savings * 0.45).toLocaleString("en-IN")} on premium lodging to boutique heritage stays`,
    `Swapped high-cost transit routes with high-speed express trains`,
    `Refined daily itinerary density from 4 to 3 high-impact activities for better relaxation`,
    `Protected all top-priority ${currentTrip.interests?.join(" & ") || "cultural"} highlights`
  ];

  if (newDays !== currentTrip.durationDays) {
    whatChanged.unshift(`Adjusted itinerary length from ${currentTrip.durationDays} to ${newDays} days`);
  }

  const optimizedPlan = {
    ...currentTrip,
    durationDays: newDays,
    budget: targetBudget,
    travel_style: newStyle,
    total_estimated_cost: optimizedCost
  };

  const comparison = {
    before: {
      budget: currentTrip.budget,
      total_estimated_cost: beforeCost,
      durationDays: currentTrip.durationDays,
      cities_count: currentTrip.cities?.length || 2,
      globe_score: currentTrip.globe_score || 91
    },
    after: {
      budget: targetBudget,
      total_estimated_cost: optimizedCost,
      durationDays: newDays,
      cities_count: currentTrip.cities?.length || 2,
      globe_score: Math.min(98, (currentTrip.globe_score || 91) + 4)
    },
    savings_amount: savings,
    what_changed: whatChanged,
    optimized_plan: optimizedPlan
  };

  return comparison;
}
