const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "connecting") {
      console.log("⏳ Connecting...");
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp");
    }

    if (connection === "close") {
      console.log("❌ Connection closed, reconnecting...");
      startBot();
    }

    // 👇 MOVE PAIRING CODE HERE
    if (!sock.authState.creds.registered) {
      const phoneNumber = "2348162483696"; // your number
      const code = await sock.requestPairingCode(phoneNumber);
      console.log("🔥 PAIRING CODE:", code);
    }
  });
}

startBot();
