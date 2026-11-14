import { useState } from "react";
import Icone from "./Icone.jsx";

// Assistente na parte de baixo: balão com a resposta + campo com microfone
export default function Assistente({ resposta, ouvindo, onPedido, onMicrofone }) {
  const [texto, setTexto] = useState("");

  function enviar(e) {
    e.preventDefault();
    onPedido(texto);
    setTexto("");
  }

  return (
    <div className="assistente">
      <p className="balao">{ouvindo ? "Pode falar, estou ouvindo…" : resposta}</p>
      <form className="pilula" onSubmit={enviar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)}
          placeholder="Fale ou escreva aqui" aria-label="Pedido para a assistente" />
        {texto ? (
          <button type="submit" className="bt-redondo" aria-label="Enviar"><Icone nome="enviar" /></button>
        ) : (
          <button type="button" className={ouvindo ? "bt-redondo ouvindo" : "bt-redondo"}
            onClick={() => onMicrofone(setTexto)} aria-label="Falar">
            <Icone nome="microfone" />
          </button>
        )}
      </form>
    </div>
  );
}
