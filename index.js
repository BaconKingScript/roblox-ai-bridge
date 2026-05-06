const express = require("express");

const app = express();
app.use(express.json());

/*
========================
 HEALTH CHECK
========================
*/
app.get("/", (req, res) => {
  res.send("Server is alive");
});

/*
========================
 AI GENERATE ROUTE
========================
*/
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.json({ error: "No prompt provided" });
  }

  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content:
              "You are a Roblox world generator. Return ONLY valid JSON. No text. No explanation. Format exactly: {\"units\":[],\"tools\":[],\"map\":{}}"
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const raw = await response.text();

    console.log("RAW AI RESPONSE:", raw);

    // Find JSON safely inside response
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.json({
        error: "Invalid AI response",
        raw
      });
    }

    const json = JSON.parse(raw.substring(start, end + 1));

    res.json(json);

  } catch (err) {
    console.error("AI ERROR:", err);

    res.json({
      error: "AI failed",
      detail: err.message
    });
  }
});

/*
========================
 START SERVER
========================
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
