// index.js — versión corregida para responder correctamente al panel web
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sendPush", async (req, res) => {
  try {
    const { to, title, body } = req.body;

    if (!to || !title || !body) {
      return res.status(400).json({ ok: false, error: "Faltan campos requeridos." });
    }

    // Enviar a Expo Push API
    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, sound: "default", title, body }),
    });

    const data = await expoResponse.json();
    console.log("📤 Respuesta de Expo:", data);

    // ✅ Interpretar resultado
    const status = data?.data?.[0]?.status;

    if (status === "ok") {
      return res.json({ ok: true, message: "Notificación enviada con éxito." });
    } else {
      return res.json({ ok: false, error: data });
    }
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// Puerto dinámico (Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
