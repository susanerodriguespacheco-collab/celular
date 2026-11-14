import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Lê o arquivo .env (a chave fica só aqui, no servidor, e não vão para o navegador)
  const env = loadEnv(mode, process.cwd(), "");
  const vozEleven = env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";

  return {
    plugins: [react()],
    server: {
      open: true,
      proxy: {
        // ElevenLabs: o app chama /api/eleven-voz e o Vite repassa com a chave
        "/api/eleven-voz": {
          target: "https://api.elevenlabs.io",
          changeOrigin: true,
          rewrite: () => `/v1/text-to-speech/${vozEleven}?output_format=mp3_44100_128`,
          headers: { "xi-api-key": env.ELEVENLABS_API_KEY || "" },
        },
      },
    },
  };
});
