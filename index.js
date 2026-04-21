
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  // 👇 THIS IS THE IMPORTANT PART
  if (!sock.authState.creds.registered) {
    const phoneNumber = "234XXXXXXXXXX"; // 👉 PUT YOUR NUMBER HERE
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("PAIRING CODE:", code);
  }
}

startBot();
