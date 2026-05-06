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

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY JSON like {\"units\":[{\"type\":\"worker\",\"count\":1}]}"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.choices[0].message.content;

    console.log("AI TEXT:", text);

    res.json(JSON.parse(text));

  } catch (err) {
    console.error("ERROR:", err);
    res.json({ error: "AI failed", detail: err.message });
  }
});
