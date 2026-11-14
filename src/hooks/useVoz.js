import { useEffect, useRef, useState } from "react";

// Ordem de preferência das vozes do navegador (usadas se a ElevenLabs não estiver disponível)
const PREFERIDAS = ["natural", "online", "google", "francisca", "thalita", "luciana", "maria"];
function nota(voz) {
  const i = PREFERIDAS.findIndex((p) => voz.name.toLowerCase().includes(p));
  return i === -1 ? PREFERIDAS.length : i;
}

// Guarda os áudios já gerados para não gastar créditos repetindo a mesma frase
const cacheAudio = new Map();

// Pede o áudio à ElevenLabs (pelo servidor do Vite, que tem a chave)
async function audioDaNuvem(texto) {
  if (cacheAudio.has(texto)) return cacheAudio.get(texto);
  const resp = await fetch("/api/eleven-voz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: texto,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 0.95 },
    }),
  });
  if (!resp.ok) throw new Error("ElevenLabs respondeu " + resp.status);
  const url = URL.createObjectURL(await resp.blob());
  cacheAudio.set(texto, url);
  return url;
}

// Hook de voz: o celular FALA e OUVE
export function useVoz(nomeVozSalva) {
  const [vozes, setVozes] = useState([]);
  const [ouvindo, setOuvindo] = useState(false);
  const [usandoNuvem, setUsandoNuvem] = useState(true);
  const tocando = useRef(null);

  // Vozes do navegador (plano B)
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const carregar = () => {
      const pt = speechSynthesis
        .getVoices()
        .filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith("pt-br"))
        .sort((a, b) => nota(a) - nota(b));
      setVozes(pt);
    };
    carregar();
    speechSynthesis.addEventListener("voiceschanged", carregar);
    return () => speechSynthesis.removeEventListener("voiceschanged", carregar);
  }, []);

  const vozAtual = vozes.find((v) => v.name === nomeVozSalva) || vozes[0];

  function pararTudo() {
    if (tocando.current) tocando.current.pause();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  // Voz do navegador
  function falarNavegador(texto) {
    if (!("speechSynthesis" in window)) return;
    const frases = texto.match(/[^.!?]+[.!?]?/g) || [texto];
    frases.forEach((frase) => {
      const fala = new SpeechSynthesisUtterance(frase.trim());
      fala.lang = "pt-BR";
      if (vozAtual) fala.voice = vozAtual;
      fala.rate = 0.95;
      fala.pitch = 1.05;
      speechSynthesis.speak(fala);
    });
  }

  // Fala: tenta a voz da nuvem (ElevenLabs); se der erro, usa a voz do navegador
  async function falar(texto) {
    pararTudo();
    if (usandoNuvem) {
      let url;
      try {
        url = await audioDaNuvem(texto);
      } catch (erro) {
        // Sem chave, sem créditos ou sem internet: desliga e usa a voz do navegador
        console.warn("Usando a voz do navegador:", erro.message);
        setUsandoNuvem(false);
      }
      if (url) {
        try {
          const audio = new Audio(url);
          tocando.current = audio;
          await audio.play();
          return;
        } catch {
          // O navegador bloqueou o som (falta um clique na página): usa a voz do navegador só desta vez
        }
      }
    }
    falarNavegador(texto);
  }

  // Ouve uma frase e chama quandoOuvir(frase)
  function ouvir(quandoOuvir, quandoErro) {
    const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Reconhecimento) {
      quandoErro("Esse navegador não entende voz. Abre no Google Chrome que funciona.");
      return;
    }
    pararTudo();
    const rec = new Reconhecimento();
    rec.lang = "pt-BR";
    rec.onresult = (e) => quandoOuvir(e.results[0][0].transcript);
    rec.onerror = () => quandoErro("Não consegui te ouvir. Confere se o microfone está liberado.");
    rec.onend = () => setOuvindo(false);
    setOuvindo(true);
    rec.start();
  }

  return { falar, ouvir, ouvindo, vozes, vozAtual, usandoNuvem, setUsandoNuvem };
}
