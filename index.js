// index.js — servidor proxy para notificaciones Expo Push
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint principal
app.post("/sendPush", async (req, res) => {
  try {
    const { to, title, body } = req.body;

    if (!to || !title || !body) {
      return res.status(400).json({ error: "Campos requeridos: to, title, body" });
    }

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        sound: "default",
        title,
        body,
      }),
    });

    const data = await response.json();
    console.log("📤 Notificación enviada:", data);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Error al enviar push:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
