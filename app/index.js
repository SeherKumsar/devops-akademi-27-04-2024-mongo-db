const express = require("express");

const dbConnection = require("./helper/mysql");
const app = express();

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await dbConnection.execute(
    "SELECT * FROM posts WHERE id = ?",
    [id]
  );
  res.json(rows);
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
