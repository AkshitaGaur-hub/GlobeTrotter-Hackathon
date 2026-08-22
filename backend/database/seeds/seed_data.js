import bcrypt from "bcryptjs";
import pool from "../../src/config/db.js";

export const seedCities = [
  {
    name: "Delhi",
    country: "India",
    region: "North India",
    cost_index: 65,
    popularity_score: 95,
    image_url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Jaipur",
    country: "India",
    region: "Rajasthan",
    cost_index: 55,
    popularity_score: 96,
    image_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Jodhpur",
    country: "India",
    region: "Rajasthan",
    cost_index: 50,
    popularity_score: 88,
    image_url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Udaipur",
    country: "India",
    region: "Rajasthan",
    cost_index: 60,
    popularity_score: 94,
    image_url: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Agra",
    country: "India",
    region: "North India",
    cost_index: 50,
    popularity_score: 98,
    image_url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Goa",
    country: "India",
    region: "West Coast",
    cost_index: 70,
    popularity_score: 99,
    image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mumbai",
    country: "India",
    region: "West Coast",
    cost_index: 85,
    popularity_score: 97,
    image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Bengaluru",
    country: "India",
    region: "South India",
    cost_index: 75,
    popularity_score: 89,
    image_url: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Kochi",
    country: "India",
    region: "Kerala",
    cost_index: 55,
    popularity_score: 91,
    image_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Varanasi",
    country: "India",
    region: "North India",
    cost_index: 45,
    popularity_score: 93,
    image_url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Rishikesh",
    country: "India",
    region: "Uttarakhand",
    cost_index: 45,
    popularity_score: 92,
    image_url: "https://images.unsplash.com/photo-1600100397608-f010e47b973c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Manali",
    country: "India",
    region: "Himachal Pradesh",
    cost_index: 55,
    popularity_score: 94,
    image_url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Amritsar",
    country: "India",
    region: "Punjab",
    cost_index: 50,
    popularity_score: 90,
    image_url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Hyderabad",
    country: "India",
    region: "South India",
    cost_index: 60,
    popularity_score: 87,
    image_url: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Chennai",
    country: "India",
    region: "Tamil Nadu",
    cost_index: 60,
    popularity_score: 84,
    image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Kolkata",
    country: "India",
    region: "East India",
    cost_index: 50,
    popularity_score: 86,
    image_url: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pune",
    country: "India",
    region: "Maharashtra",
    cost_index: 65,
    popularity_score: 82,
    image_url: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mysore",
    country: "India",
    region: "Karnataka",
    cost_index: 45,
    popularity_score: 88,
    image_url: "https://images.unsplash.com/photo-1600100397608-f010e47b973c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Jaisalmer",
    country: "India",
    region: "Rajasthan",
    cost_index: 55,
    popularity_score: 91,
    image_url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Shimla",
    country: "India",
    region: "Himachal Pradesh",
    cost_index: 60,
    popularity_score: 90,
    image_url: "https://images.unsplash.com/photo-1579618218290-24a26f63a728?auto=format&fit=crop&w=800&q=80"
  }
];

export const seedActivities = [
  // Delhi
  { cityName: "Delhi", name: "Old Delhi Heritage & Street Food Crawl", category: "Food", cost: 600, duration: 180, description: "Taste authentic parathas, jalebis, and kebabs in historic Chandni Chowk alleys." },
  { cityName: "Delhi", name: "Qutub Minar & Mehrauli Archaeological Park", category: "History", cost: 500, duration: 150, description: "Explore the 12th-century victory minaret and surrounding Mughal tombs." },
  { cityName: "Delhi", name: "Humayun's Tomb Sunset Walk", category: "Photography", cost: 450, duration: 120, description: "Marvel at the Persian-influenced garden tomb, a precursor to the Taj Mahal." },
  { cityName: "Delhi", name: "Hauz Khas Village Cafes & Nightlife", category: "Nightlife", cost: 1200, duration: 240, description: "Bustling rooftop bistros and indie music next to 14th-century lake ruins." },

  // Jaipur
  { cityName: "Jaipur", name: "Amber Fort & Elephant Pathway", category: "History", cost: 500, duration: 180, description: "Majestic hilltop fort featuring Sheesh Mahal mirror mosaics and panoramic Maota Lake vistas." },
  { cityName: "Jaipur", name: "City Palace & Royal Observatory (Jantar Mantar)", category: "Culture", cost: 700, duration: 150, description: "Blend of Rajasthani and Mughal architecture alongside ancient astronomical instruments." },
  { cityName: "Jaipur", name: "Traditional Rajasthani Thali at Chokhi Dhani", category: "Food", cost: 950, duration: 180, description: "Cultural village experience with puppet shows, folk dances, and unlimited royal feast." },
  { cityName: "Jaipur", name: "Hawa Mahal & Old Pink City Bazaars", category: "Photography", cost: 300, duration: 120, description: "Iconic honeycomb facade followed by spice and gemstone market exploration." },
  { cityName: "Jaipur", name: "Hot Air Balloon Flight over Forts", category: "Adventure", cost: 6500, duration: 120, description: "Sunrise aerial views over the Aravali hills and royal palaces." },

  // Jodhpur
  { cityName: "Jodhpur", name: "Mehrangarh Fort Guided Tour & Museum", category: "History", cost: 600, duration: 180, description: "Imposing fortress rising 400 feet above the vibrant Blue City." },
  { cityName: "Jodhpur", name: "Flying Fox Zipline across Fort battlements", category: "Adventure", cost: 1800, duration: 90, description: "6 exhilarating zip lines gliding over lakes and battlements." },
  { cityName: "Jodhpur", name: "Blue City Walking Tour & Mirchi Bada Tasting", category: "Food", cost: 400, duration: 120, description: "Stroll through indigo-painted alleyways and savor spiced street delicacies." },

  // Udaipur
  { cityName: "Udaipur", name: "Lake Pichola Sunset Boat Cruise", category: "Photography", cost: 800, duration: 90, description: "Scenic boat ride passing Jag Mandir and the majestic Lake Palace." },
  { cityName: "Udaipur", name: "Udaipur City Palace & Crystal Gallery", category: "History", cost: 650, duration: 180, description: "Rajasthan's largest palace complex overlooking tranquil lake waters." },
  { cityName: "Udaipur", name: "Lakeside Candlelight Dining & Mewari Cuisine", category: "Food", cost: 1400, duration: 150, description: "Gourmet dining on the lake ghats with illuminated palace views." },
  { cityName: "Udaipur", name: "Dharohar Folk Dance Show at Bagore Ki Haveli", category: "Culture", cost: 350, duration: 90, description: "Vibrant puppet shows, fire dances, and Rajasthani musicians." },

  // Agra
  { cityName: "Agra", name: "Sunrise Taj Mahal Experience", category: "Photography", cost: 1100, duration: 180, description: "Watch the marble wonder glow as dawn breaks over the Yamuna River." },
  { cityName: "Agra", name: "Agra Fort & Jahangir Palace Tour", category: "History", cost: 650, duration: 120, description: "Red sandstone fortress where Mughal emperors governed the empire." },
  { cityName: "Agra", name: "Mughlai Culinary Walk & Petha Tasting", category: "Food", cost: 500, duration: 120, description: "Rich lamb gravies, tandoori breads, and famous sweet Agra petha." },

  // Goa
  { cityName: "Goa", name: "Scuba Diving & Watersports at Grand Island", category: "Adventure", cost: 2800, duration: 300, description: "Explore Arabian Sea coral reefs with jet skiing and banana boat rides." },
  { cityName: "Goa", name: "Old Goa Portuguese Churches & Fontainhas Latin Quarter", category: "History", cost: 400, duration: 180, description: "16th-century Basilica of Bom Jesus and colorful heritage villas." },
  { cityName: "Goa", name: "Sunset Beach Shack Seafood Feast & Live Music", category: "Nightlife", cost: 1200, duration: 240, description: "Fresh butter garlic prawns, coconut curry, and beach bonfire tunes." },
  { cityName: "Goa", name: "Dudhsagar Waterfalls Trek & Spice Plantation", category: "Nature", cost: 1600, duration: 360, description: "Jeep safari through dense jungle to a four-tiered 310m waterfall." },

  // Mumbai
  { cityName: "Mumbai", name: "South Mumbai Art Deco & Gateway of India Walk", category: "Culture", cost: 500, duration: 150, description: "Colonial landmarks, Marine Drive promenade, and Kala Ghoda art galleries." },
  { cityName: "Mumbai", name: "Elephanta Caves Ferry & Rock-cut Temples", category: "History", cost: 750, duration: 240, description: "UNESCO rock-cut Shiva sculptures on Elephanta Island." },
  { cityName: "Mumbai", name: "Street Food Journey: Chowpatty to Mohammad Ali Road", category: "Food", cost: 600, duration: 180, description: "Crisp Pav Bhaji, Pani Puri, Bun Maska, and Seekh Kebabs." },
  { cityName: "Mumbai", name: "Bandra Rooftop Cocktails & Sea Views", category: "Nightlife", cost: 1800, duration: 210, description: "Chic lounge vibes overlooking the Arabian Sea sunset." },

  // Varanasi
  { cityName: "Varanasi", name: "Dawn Boat Ride on the Sacred Ganges", category: "Photography", cost: 500, duration: 120, description: "Witness morning rituals, bathing ghats, and sunrise prayers." },
  { cityName: "Varanasi", name: "Evening Ganga Aarti at Dashashwamedh Ghat", category: "Culture", cost: 200, duration: 90, description: "Mesmerizing multi-tier brass lamp prayer ceremony with chants." },
  { cityName: "Varanasi", name: "Banarasi Kachori, Paan, & Lassi Food Walk", category: "Food", cost: 350, duration: 120, description: "Famous Blue Lassi, crisp kachoris, and authentic Banarasi sweet paan." },
  { cityName: "Varanasi", name: "Sarnath Buddhist Monasteries & Stupa", category: "History", cost: 400, duration: 150, description: "Where Lord Buddha gave his first sermon 2,500 years ago." },

  // Rishikesh
  { cityName: "Rishikesh", name: "White Water Rafting on the Ganges (16km)", category: "Adventure", cost: 1200, duration: 180, description: "Tackle Class III and IV rapids like 'Roller Coaster' and 'Golf Course'." },
  { cityName: "Rishikesh", name: "Sunrise Yoga & Meditation by the River", category: "Nature", cost: 400, duration: 90, description: "Rejuvenating guided Hatha yoga as the Himalayan breeze flows." },
  { cityName: "Rishikesh", name: "Beatles Ashram (Chaurasi Kutia) & Graffiti Tour", category: "Culture", cost: 350, duration: 120, description: "Walk through the iconic 1968 meditation retreat filled with vibrant murals." },

  // Manali
  { cityName: "Manali", name: "Solang Valley Paragliding & ATV Ride", category: "Adventure", cost: 2500, duration: 240, description: "Tandem paragliding flight over snow-capped Himalayan peaks." },
  { cityName: "Manali", name: "Old Manali Cafes & Trout Fish Tasting", category: "Food", cost: 750, duration: 150, description: "Cozy wood-fired pizza bistros, riverside cafes, and fresh grilled river trout." },
  { cityName: "Manali", name: "Jogini Waterfall Hike & Pine Forest Trek", category: "Nature", cost: 300, duration: 180, description: "Scenic trek through apple orchards and pine woods to a cascading fall." },

  // Kochi
  { cityName: "Kochi", name: "Fort Kochi Chinese Fishing Nets & Heritage Walk", category: "Photography", cost: 300, duration: 120, description: "14th-century cantilevered fishing nets and Dutch-era streetscapes." },
  { cityName: "Kochi", name: "Traditional Kathakali Dance Drama Performance", category: "Culture", cost: 450, duration: 90, description: "Intricate facial makeup, martial choreography, and percussion." },
  { cityName: "Kochi", name: "Alleppey Houseboat Day Cruise & Kerala Sadhya", category: "Nature", cost: 2200, duration: 300, description: "Gliding through palm-fringed backwaters with a 24-dish banana leaf feast." },

  // Amritsar
  { cityName: "Amritsar", name: "Golden Temple (Harmandir Sahib) & Langar Volunteering", category: "Culture", cost: 100, duration: 180, description: "Serene sanctum, sparkling pool of nectar, and world's largest community kitchen." },
  { cityName: "Amritsar", name: "Wagah Border Beating Retreat Ceremony", category: "History", cost: 300, duration: 210, description: "Electrifying patriotic flag-lowering military drill at India-Pakistan border." },
  { cityName: "Amritsar", name: "Legendary Amritsari Kulcha & Sweet Lassi Trail", category: "Food", cost: 400, duration: 120, description: "Crisp multi-layered potato kulchas baked in charcoal tandoors." },

  // Bengaluru
  { cityName: "Bengaluru", name: "Cubbon Park Nature Walk & Iconic Vidyarthi Bhavan Dosa", category: "Food", cost: 350, duration: 150, description: "Lush botanical canopy followed by crisp ghee-roasted Masala Dosas." },
  { cityName: "Bengaluru", name: "Indiranagar Microbrewery Hopping", category: "Nightlife", cost: 1500, duration: 240, description: "Craft ales, mango ciders, and gastro-pub bites in India's pub capital." },

  // Hyderabad
  { cityName: "Hyderabad", name: "Charminar & Laad Bazaar Pearl Shopping Walk", category: "History", cost: 300, duration: 150, description: "16th-century grand monument surrounded by bangle and perfume markets." },
  { cityName: "Hyderabad", name: "Authentic Dum Biryani & Haleem Tasting at Shadab", category: "Food", cost: 650, duration: 120, description: "Slow-cooked saffron rice, tender mutton, and royal Nizami sweets." },
  { cityName: "Hyderabad", name: "Golconda Fort Sound & Light Show", category: "Culture", cost: 400, duration: 150, description: "Acoustic architecture wonders and dramatic historical storytelling." },

  // Jaisalmer
  { cityName: "Jaisalmer", name: "Thar Desert Camel Safari & Sunset Dunes Camp", category: "Adventure", cost: 2200, duration: 300, description: "Camel trek across Sam Sand Dunes with folk singing under starry desert skies." },
  { cityName: "Jaisalmer", name: "Golden Fort (Sonar Qila) Living Fortress Walk", category: "History", cost: 400, duration: 150, description: "Explore the world's only large-scale continuously inhabited medieval fort." }
];

export async function runSeeds() {
  console.log("🌱 Starting GlobeTrotter Database Seeding...");

  // 1. Seed Cities
  const cityMap = new Map();
  for (const city of seedCities) {
    const res = await pool.query(
      `INSERT INTO cities (name, country, region, cost_index, popularity_score, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING
       RETURNING id, name;`,
      [city.name, city.country, city.region, city.cost_index, city.popularity_score, city.image_url]
    );

    if (res.rows.length > 0) {
      cityMap.set(res.rows[0].name, res.rows[0].id);
    } else {
      const existing = await pool.query("SELECT id FROM cities WHERE name = $1;", [city.name]);
      if (existing.rows.length > 0) {
        cityMap.set(city.name, existing.rows[0].id);
      }
    }
  }
  console.log(`✅ Seeded / Verified ${cityMap.size} cities.`);

  // 2. Seed Activities
  let activityCount = 0;
  for (const act of seedActivities) {
    const cityId = cityMap.get(act.cityName);
    if (!cityId) continue;

    await pool.query(
      `INSERT INTO activities (city_id, name, category, cost, duration_minutes, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING;`,
      [
        cityId,
        act.name,
        act.category,
        act.cost,
        act.duration,
        act.description,
        act.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
      ]
    );
    activityCount++;
  }
  console.log(`✅ Seeded / Verified ${activityCount} activities.`);

  // 3. Seed Demo User
  const demoEmail = "demo@globetrotter.app";
  const passwordHash = await bcrypt.hash("Demo123!", 10);
  const userRes = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, name, email;`,
    ["Demo Traveler", demoEmail, passwordHash]
  );
  const demoUser = userRes.rows[0];
  console.log(`✅ Demo User ready: ${demoUser.email} (Password: Demo123!)`);

  // 4. Seed Starter Trip
  const existingTrip = await pool.query(
    "SELECT id FROM trips WHERE user_id = $1 LIMIT 1;",
    [demoUser.id]
  );

  if (existingTrip.rows.length === 0) {
    const tripRes = await pool.query(
      `INSERT INTO trips (
        user_id, name, start_date, end_date, description, is_public, share_slug,
        globe_score, total_estimated_cost, budget, travelers_count, travel_style,
        interests, things_to_avoid
      ) VALUES (
        $1, $2, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '13 days',
        $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id;`,
      [
        demoUser.id,
        "Royal Rajasthan & Heritage Wonders",
        "A balanced 6-day journey across Jaipur, Jodhpur, and Udaipur immersed in royal palaces, rich heritage, vibrant bazaars, and delectable cuisine.",
        true,
        "royal-rajasthan-demo",
        92,
        23500,
        25000,
        2,
        "Balanced",
        ["Food", "History", "Adventure"],
        "Long overnight bus journeys, overcrowded tourist traps"
      ]
    );

    const tripId = tripRes.rows[0].id;
    const jaipurId = cityMap.get("Jaipur");
    const jodhpurId = cityMap.get("Jodhpur");
    const udaipurId = cityMap.get("Udaipur");

    // Add Stops
    if (jaipurId && jodhpurId && udaipurId) {
      const stop1 = await pool.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 0) RETURNING id;`,
        [tripId, jaipurId]
      );
      const stop2 = await pool.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, CURRENT_DATE + INTERVAL '9 days', CURRENT_DATE + INTERVAL '11 days', 1) RETURNING id;`,
        [tripId, jodhpurId]
      );
      const stop3 = await pool.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, CURRENT_DATE + INTERVAL '11 days', CURRENT_DATE + INTERVAL '13 days', 2) RETURNING id;`,
        [tripId, udaipurId]
      );

      // Attach activities
      const actsJaipur = await pool.query("SELECT id FROM activities WHERE city_id = $1 LIMIT 3;", [jaipurId]);
      for (let i = 0; i < actsJaipur.rows.length; i++) {
        await pool.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, order_index)
           VALUES ($1, $2, CURRENT_DATE + INTERVAL '${7 + i} days', '${10 + i * 3}:00', $3);`,
          [stop1.rows[0].id, actsJaipur.rows[i].id, i]
        );
      }

      const actsJodhpur = await pool.query("SELECT id FROM activities WHERE city_id = $1 LIMIT 2;", [jodhpurId]);
      for (let i = 0; i < actsJodhpur.rows.length; i++) {
        await pool.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, order_index)
           VALUES ($1, $2, CURRENT_DATE + INTERVAL '${9 + i} days', '${11 + i * 3}:00', $3);`,
          [stop2.rows[0].id, actsJodhpur.rows[i].id, i]
        );
      }

      const actsUdaipur = await pool.query("SELECT id FROM activities WHERE city_id = $1 LIMIT 2;", [udaipurId]);
      for (let i = 0; i < actsUdaipur.rows.length; i++) {
        await pool.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, order_index)
           VALUES ($1, $2, CURRENT_DATE + INTERVAL '${11 + i} days', '${14 + i * 3}:00', $3);`,
          [stop3.rows[0].id, actsUdaipur.rows[i].id, i]
        );
      }
    }
    console.log(`✅ Starter trip seeded for Demo User (Trip ID: ${tripId}).`);
  }

  console.log("🎉 Seeding completed successfully.");
}

// Direct execution support
if (process.argv[1]?.endsWith("seed_data.js")) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    });
}
