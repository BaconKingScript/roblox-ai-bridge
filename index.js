const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

// OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("AI server is running");
});

// MAIN AI ROUTE
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  console.log("PROMPT:", prompt);

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini", // safer model for now
      input: `Return JSON like { "units": [{ "type": "worker", "count": 3 }] }. User: ${prompt}`
    });

    let text = response.output_text || "";

    if (!text && response.output) {
      text = response.output[0]?.content[0]?.text || "";
    }

    console.log("AI TEXT:", text);

    const data = JSON.parse(text);
    res.json(data);

  } catch (err) {
    console.error("ERROR:", err);
    res.json({ error: "AI failed" });
  }
});

// IMPORTANT: PORT (THIS FIXES MANY CRASHES)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
