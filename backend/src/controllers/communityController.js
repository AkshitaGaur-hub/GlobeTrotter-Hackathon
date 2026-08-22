import { query } from '../config/db.js';

export async function getPosts(req, res, next) {
  try {
    const { search, destination, sort } = req.query;
    
    let baseQuery = `
      SELECT p.*,
        u.name as author_name, u.email as author_email, u.avatar_url as author_avatar,
        (SELECT COUNT(*) FROM community_likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count,
        EXISTS(SELECT 1 FROM community_likes WHERE post_id = p.id AND user_id = $1) as user_liked
      FROM community_posts p
      JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (search) {
      baseQuery += ` AND (p.content ILIKE $${paramIndex} OR p.destination ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (destination) {
      baseQuery += ` AND p.destination ILIKE $${paramIndex}`;
      params.push(`%${destination}%`);
      paramIndex++;
    }

    if (sort === 'most_liked') {
      baseQuery += ` ORDER BY like_count DESC, p.created_at DESC`;
    } else {
      baseQuery += ` ORDER BY p.created_at DESC`;
    }

    const postsRes = await query(baseQuery, params);
    res.json({ posts: postsRes.rows });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const { destination, content, image_url } = req.body;
    const insertRes = await query(
      `INSERT INTO community_posts (author_id, destination, content, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, destination, content, image_url]
    );
    res.status(201).json({ post: insertRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { destination, content, image_url } = req.body;
    
    const postRes = await query("SELECT author_id FROM community_posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0) return res.status(404).json({ error: "Post not found" });
    if (postRes.rows[0].author_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const updateRes = await query(
      `UPDATE community_posts
       SET destination = COALESCE($1, destination), content = COALESCE($2, content), image_url = COALESCE($3, image_url), updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [destination, content, image_url, id]
    );
    res.json({ post: updateRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    
    const postRes = await query("SELECT author_id FROM community_posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0) return res.status(404).json({ error: "Post not found" });
    if (postRes.rows[0].author_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    await query("DELETE FROM community_posts WHERE id = $1", [id]);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function toggleLike(req, res, next) {
  try {
    const { id } = req.params;
    
    const likeRes = await query("SELECT id FROM community_likes WHERE post_id = $1 AND user_id = $2", [id, req.user.id]);
    let liked = false;
    
    if (likeRes.rows.length > 0) {
      await query("DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2", [id, req.user.id]);
    } else {
      await query("INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)", [id, req.user.id]);
      liked = true;
    }

    const countRes = await query("SELECT COUNT(*) FROM community_likes WHERE post_id = $1", [id]);
    res.json({ liked, like_count: parseInt(countRes.rows[0].count, 10) });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req, res, next) {
  try {
    const { id } = req.params;
    const commentsRes = await query(`
      SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
      FROM community_comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `, [id]);
    res.json({ comments: commentsRes.rows });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const insertRes = await query(
      `INSERT INTO community_comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [id, req.user.id, content]
    );

    const userRes = await query("SELECT name as author_name, avatar_url as author_avatar FROM users WHERE id = $1", [req.user.id]);
    const comment = { ...insertRes.rows[0], ...userRes.rows[0] };
    
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    
    const commentRes = await query("SELECT author_id FROM community_comments WHERE id = $1", [id]);
    if (commentRes.rows.length === 0) return res.status(404).json({ error: "Comment not found" });
    if (commentRes.rows[0].author_id !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    await query("DELETE FROM community_comments WHERE id = $1", [id]);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
}

