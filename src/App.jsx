import { useEffect, useState } from "react";
import BarraStatus from "./components/BarraStatus.jsx";
import Inicio from "./components/Inicio.jsx";
import TelaRemedios from "./components/TelaRemedios.jsx";
import TelaAjustes from "./components/TelaAjustes.jsx";
import Assistente from "./components/Assistente.jsx";
import Despertador from "./components/Despertador.jsx";
import { useVoz } from "./hooks/useVoz.js";
import { useDespertador } from "./hooks/useDespertador.js";
import { interpretar, horaAtual, remediosIniciais } from "./logica.js";

// Lê um valor salvo no navegador (ou usa o padrão)
function carregar(chave, padrao) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : padrao;
  } catch {
    return padrao;
  }
}

export default function App() {
  const [tela, setTela] = useState("inicio");
  const [hora, setHora] = useState(horaAtual());
  const [resposta, setResposta] = useState("Oi! Toque no microfone e me diga o que precisa.");
  const [nomeUsuario, setNomeUsuario] = useState(carregar("nome", "Vera"));
  const [remedios, setRemedios] = useState(carregar("remedios", remediosIniciais));
  const [modoSimples, setModoSimples] = useState(carregar("simples", false));
  const [nomeVoz, setNomeVoz] = useState(carregar("voz", ""));

  const { falar, ouvir, ouvindo, vozes, vozAtual, usandoNuvem, setUsandoNuvem } = useVoz(nomeVoz);
  const { alarme, confirmar, adiar, testar } = useDespertador(remedios, nomeUsuario, falar);

  // Salva as preferências no navegador
  useEffect(() => {
    localStorage.setItem("nome", JSON.stringify(nomeUsuario));
    localStorage.setItem("remedios", JSON.stringify(remedios));
    localStorage.setItem("simples", JSON.stringify(modoSimples));
    localStorage.setItem("voz", JSON.stringify(nomeVoz));
  }, [nomeUsuario, remedios, modoSimples, nomeVoz]);

  // Diminui o celular inteiro para caber na janela (sem cortar nada)
  const [escala, setEscala] = useState(1);
  useEffect(() => {
    const ajustar = () => setEscala(Math.min(1, (window.innerHeight - 24) / 822, (window.innerWidth - 24) / 402));
    ajustar();
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  // Relógio
  useEffect(() => {
    const timer = setInterval(() => setHora(horaAtual()), 1000);
    return () => clearInterval(timer);
  }, []);

  function responder(texto) {
    setResposta(texto);
    falar(texto);
  }

  function executar(pedido) {
    if (!pedido.trim()) return;
    const t = pedido.toLowerCase();
    if (t.includes("remédio") || t.includes("remedio")) setTela("remedios");
    responder(interpretar(pedido, remedios, nomeUsuario));
  }

  function usarMicrofone(preencherCampo) {
    ouvir((frase) => {
      preencherCampo("");
      executar(frase);
    }, responder);
  }

  function testarAlarme() {
    if (remedios.length === 0) return responder("Primeiro cadastra um remédio, tá?");
    const agora = horaAtual();
    testar(remedios.find((r) => r.hora >= agora) || remedios[0]);
  }

  return (
    <div className="mesa">
      <div className={modoSimples ? "celular simples" : "celular"} style={{ transform: `scale(${escala})` }}>
        <BarraStatus hora={hora} />

        <div className="conteudo">
          {tela === "inicio" && (
            <Inicio hora={hora} nomeUsuario={nomeUsuario} remedios={remedios}
              onPedido={executar} onAbrir={setTela} />
          )}
          {tela === "remedios" && (
            <TelaRemedios remedios={remedios} setRemedios={setRemedios}
              onTestar={testarAlarme} onVoltar={() => setTela("inicio")} />
          )}
          {tela === "ajustes" && (
            <TelaAjustes nomeUsuario={nomeUsuario} setNomeUsuario={setNomeUsuario}
              vozes={vozes} vozAtual={vozAtual} setNomeVoz={setNomeVoz}
              usandoNuvem={usandoNuvem} setUsandoNuvem={setUsandoNuvem}
              modoSimples={modoSimples} setModoSimples={setModoSimples}
              onOuvirExemplo={() => falar(`Oi, ${nomeUsuario}! É assim que eu vou falar com você.`)}
              onVoltar={() => setTela("inicio")} />
          )}
        </div>

        <Assistente resposta={resposta} ouvindo={ouvindo} onPedido={executar} onMicrofone={usarMicrofone} />

        <Despertador alarme={alarme} nomeUsuario={nomeUsuario} onConfirmar={confirmar} onAdiar={adiar} />
      </div>
    </div>
  );
}
