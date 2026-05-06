const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI server is running");
});

app.post("/generate", (req, res) => {
  res.json({
    units: [
      { type: "worker", count: 3 },
      { type: "builder", count: 2 },
      { type: "harvester", count: 4 }
    ]
  });
});

app.listen(3000, () => {
  console.log("Server running");
});
