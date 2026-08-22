import { query } from '../config/db.js';

export async function getStats(req, res, next) {
  try {
    const usersRes = await query("SELECT COUNT(*) as count FROM users");
    const tripsRes = await query("SELECT COUNT(*) as count FROM trips");
    const postsRes = await query("SELECT COUNT(*) as count FROM community_posts");
    const commentsRes = await query("SELECT COUNT(*) as count FROM post_comments");
    
    const expensesRes = await query(`
      SELECT SUM(COALESCE(ta.cost_override, a.cost)) as total
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
    `);

    res.json({
      totalUsers: parseInt(usersRes.rows[0].count, 10),
      totalTrips: parseInt(tripsRes.rows[0].count, 10),
      totalPosts: parseInt(postsRes.rows[0].count, 10),
      totalComments: parseInt(commentsRes.rows[0].count, 10),
      totalExpenses: parseFloat(expensesRes.rows[0].total) || 0
    });
  } catch (err) {
    next(err);
  }
}

export async function getCharts(req, res, next) {
  try {
    const popularDestinations = await query(`
      SELECT c.name, COUNT(s.id) as count
      FROM stops s
      JOIN cities c ON s.city_id = c.id
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT 10
    `);

    const tripActivity = await query(`
      SELECT to_char(created_at, 'YYYY-MM') as month, COUNT(*) as count
      FROM trips
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `);

    const expenseOverview = await query(`
      SELECT a.category, SUM(COALESCE(ta.cost_override, a.cost)) as total
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      GROUP BY a.category
    `);

    const communityActivity = await query(`
      SELECT week, SUM(posts) as posts, SUM(comments) as comments
      FROM (
        SELECT to_char(created_at, 'IYYY-IW') as week, 1 as posts, 0 as comments
        FROM community_posts
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        UNION ALL
        SELECT to_char(created_at, 'IYYY-IW') as week, 0 as posts, 1 as comments
        FROM community_comments
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
      ) sub
      GROUP BY week
      ORDER BY week ASC
    `);

    res.json({
      popularDestinations: popularDestinations.rows.map(r => ({ name: r.name, count: parseInt(r.count, 10) })),
      tripActivity: tripActivity.rows.map(r => ({ month: r.month, count: parseInt(r.count, 10) })),
      expenseOverview: expenseOverview.rows.map(r => ({ category: r.category, total: parseFloat(r.total) || 0 })),
      communityActivity: communityActivity.rows.map(r => ({ week: r.week, posts: parseInt(r.posts, 10), comments: parseInt(r.comments, 10) }))
    });
  } catch (err) {
    next(err);
  }
}

