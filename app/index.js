const express = require("express");

const mongodbConnection = require('./helper/mongodb');
const dbConnection = require("./helper/mysql");

const app = express();

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await dbConnection.execute(
      "SELECT postName, postData, created_by FROM posts WHERE id = ?",
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching post from MySQL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/comments/:post_id", async (req, res) => {
  const { post_id } = req.params;
  console.log("Received request for post ID:", post_id); // Debug log
  try {
    let client = mongodbConnection.getClient();
    if (!client || !client.topology.isConnected()) {
      client = await mongodbConnection.connect();
    }
    const db = client.db('socialMedia');
    const query = { post_id: parseInt(post_id) };
    console.log("MongoDB Query:", query); // Debug log
    const results = await db.collection("comments").find(query).toArray();
    console.log("Fetched comments:", results); // Debug log
    // Sort by date in ascending order
    results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(400).json({ message: 'Error fetching comments', error: err.toString() });
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
