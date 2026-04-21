const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Keep Render alive
app.get("/", (req, res) => {
  res.send("COACH OBI BOT is running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("connection.update", ({ qr, connection }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("Scan QR to connect COACH OBI BOT");
    }

    if (connection === "close") {
      console.log("Reconnecting...");
      startBot();
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text = msg.message.conversation;

    if (text === "hi") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🔥 COACH OBI BOT ACTIVE!"
      });
    }
  });
}

startBot();
