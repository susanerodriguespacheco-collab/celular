import { useEffect, useRef, useState } from "react";
import { horaFalada } from "../logica.js";

// Som de despertador suave (três toques) usando o áudio do navegador
function tocarToque() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((inicio, i) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = [660, 784, 988][i];
      const t = ctx.currentTime + inicio;
      vol.gain.setValueAtTime(0, t);
      vol.gain.linearRampToValueAtTime(0.25, t + 0.03);
      vol.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(vol);
      vol.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  } catch {
    /* sem som: segue só com a voz */
  }
}

// Vigia o relógio e dispara o alarme na hora de cada remédio
export function useDespertador(remedios, nomeUsuario, falar) {
  const [alarme, setAlarme] = useState(null);
  const jaTocou = useRef(new Set());

  // Confere a hora a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      const hhmm = agora.toTimeString().slice(0, 5);
      const remedio = remedios.find((r) => r.hora === hhmm);
      const chave = remedio && remedio.nome + agora.toDateString() + hhmm;
      if (remedio && !jaTocou.current.has(chave)) {
        jaTocou.current.add(chave);
        setAlarme(remedio);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [remedios]);

  // Enquanto o alarme estiver ativo: toca e chama a pessoa a cada 20 segundos
  useEffect(() => {
    if (!alarme) return;
    let voz;
    let vez = 0;
    const chamar = () => {
      tocarToque();
      const hora = horaFalada(alarme.hora); // "08:00" vira "8 horas"
      const umaHora = hora.startsWith("1 ") && !hora.startsWith("1 e");
      const frase =
        vez === 0
          ? `${nomeUsuario}, ${umaHora ? "é" : "são"} ${hora}. Tá na hora do seu remédio, o ${alarme.nome}.`
          : `${nomeUsuario}, já passou ${umaHora ? "da" : "das"} ${hora}. Não esquece de tomar o ${alarme.nome}, tá bom?`;
      vez++;
      voz = setTimeout(() => falar(frase), 1400);
    };
    const primeiro = setTimeout(chamar, 50);
    const repetir = setInterval(chamar, 20000);
    return () => {
      clearTimeout(primeiro);
      clearTimeout(voz);
      clearInterval(repetir);
    };
  }, [alarme, nomeUsuario]);

  function confirmar() {
    falar(`Muito bem, ${nomeUsuario}! Anotei aqui que você tomou o ${alarme.nome} das ${horaFalada(alarme.hora)}.`);
    setAlarme(null);
  }

  function adiar() {
    const remedio = alarme;
    setAlarme(null);
    falar("Combinado. Daqui a cinco minutinhos eu te lembro de novo.");
    setTimeout(() => setAlarme(remedio), 5 * 60 * 1000);
  }

  return { alarme, confirmar, adiar, testar: setAlarme };
}