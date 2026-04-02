const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "myWebhook123";

// Webhook verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Receive messages (POST)
const axios = require("axios");

app.post("/webhook", async (req, res) => {
  console.log("Webhook data:", JSON.stringify(req.body, null, 2));

  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;

    await axios.post(
      "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages",
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "Welcome from Nook and Nature" }
      },
      {
      headers: {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  "Content-Type": "application/json"
      }
      }
    );
  }

  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
