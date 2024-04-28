const express = require("express");

const mongodbConnection = require('./helper/mongodb');
const dbConnection = require("./helper/mysql");

const app = express();

app.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  console.log("Received request for post ID:", id); // Debug log
  try {
    // MySQL'den ilgili postu al
    const [postRows] = await dbConnection.execute(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    );
    
    // Eğer post bulunamazsa hata gönder
    if (postRows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Post bulundu, post_id ile MongoDB'den yorumları al
    const post = postRows[0];
    const postId = post.id; // MySQL'den gelen post id'si
    let client = mongodbConnection.getClient();
    if (!client || !client.topology.isConnected()) {
      client = await mongodbConnection.connect();
    }
    const db = client.db('socialMedia');
    const query = { post_id: postId };
    console.log("MongoDB Query:", query); // Debug log
    const results = await db.collection("comments").find(query).toArray();
    console.log("Fetched comments:", results); // Debug log
    // Sort by date in ascending order
    results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    res.json({ post, comments: results });
  } catch (err) {
    console.error('Error fetching post and comments:', err);
    res.status(400).json({ message: 'Error fetching post and comments', error: err.toString() });
  }
});

app.listen(3000, async () => {
  console.log(`Server is running on port 3000`);
  try {
    await mongodbConnection.connect();
    await mongodbConnection.createCommentsCollection();
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
  }
});
