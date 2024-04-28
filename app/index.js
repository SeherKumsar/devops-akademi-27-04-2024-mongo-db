const express = require("express");

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

app.listen(3000, async () => {
  console.log(`Server is running on port 3000`);
});
