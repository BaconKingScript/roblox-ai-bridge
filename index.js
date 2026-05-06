const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI server is running");
});

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  console.log("PROMPT:", prompt);

  try {
    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `
Return ONLY JSON like this:
{
  "units": [
    { "type": "worker", "count": 3 }
  ]
}

User request: ${prompt}
      `
    });

    console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));

    // safer extraction
    let text = "";
    if (response.output_text) {
      text = response.output_text;
    } else if (response.output && response.output[0]?.content[0]?.text) {
      text = response.output[0].content[0].text;
    }

    console.log("AI TEXT:", text);

    const data = JSON.parse(text);
    res.json(data);

  } catch (err) {
    console.error("ERROR:", err);
    res.json({ error: "AI failed" });
  }
});
