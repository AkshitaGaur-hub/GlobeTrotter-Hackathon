import { calculateTripBudget } from "./src/services/budgetService.js";
import { calculateGlobeScore } from "./src/services/globeScoreService.js";

console.log("🧪 Testing Deterministic GlobeTrotter Services...");

// 1. Test Budget Calculation
const testStops = [
  { city_id: 1, city_name: "Jaipur", cost_index: 55, start_date: "2026-09-01", end_date: "2026-09-03" },
  { city_id: 2, city_name: "Udaipur", cost_index: 60, start_date: "2026-09-03", end_date: "2026-09-06" }
];

const testActivities = [
  { activity_id: 1, name: "Amber Fort", category: "History", cost: 500, scheduled_date: "2026-09-01" },
  { activity_id: 2, name: "Street Food", category: "Food", cost: 400, scheduled_date: "2026-09-02" },
  { activity_id: 3, name: "Sunset Boat Cruise", category: "Photography", cost: 800, scheduled_date: "2026-09-04" },
  { activity_id: 4, name: "City Palace", category: "Culture", cost: 650, scheduled_date: "2026-09-05" }
];

const budgetResult = calculateTripBudget({
  stops: testStops,
  activities: testActivities,
  travelersCount: 2,
  travelStyle: "Balanced",
  userBudget: 25000,
  startDate: "2026-09-01",
  endDate: "2026-09-06"
});

console.log("✅ Budget Calculation Output:", {
  totalEstimatedCost: budgetResult.totalEstimatedCost,
  budget: budgetResult.budget,
  remaining: budgetResult.remaining,
  averagePerDay: budgetResult.averagePerDay,
  breakdown: budgetResult.breakdown
});

if (budgetResult.totalEstimatedCost > 0 && budgetResult.chartData.length === 4) {
  console.log("✅ Budget Service PASSED.");
} else {
  console.error("❌ Budget Service FAILED.");
  process.exit(1);
}

// 2. Test GlobeScore Calculation
const scoreResult = calculateGlobeScore({
  budget: 25000,
  totalEstimatedCost: budgetResult.totalEstimatedCost,
  userInterests: ["Food", "History", "Culture"],
  travelStyle: "Balanced",
  stops: testStops,
  activities: testActivities,
  durationDays: 6
});

console.log("✅ GlobeScore Calculation Output:", {
  score: scoreResult.score,
  grade: scoreResult.grade,
  highlights: scoreResult.highlights,
  factors: Object.keys(scoreResult.factors)
});

if (scoreResult.score >= 0 && scoreResult.score <= 100 && scoreResult.highlights.length > 0) {
  console.log("✅ GlobeScore Service PASSED.");
} else {
  console.error("❌ GlobeScore Service FAILED.");
  process.exit(1);
}

console.log("🎉 ALL SERVICES VERIFIED SUCCESSFULLY!");
