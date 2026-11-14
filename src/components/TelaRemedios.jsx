import { useState } from "react";
import Icone from "./Icone.jsx";

// Lista de remédios + cadastro + botão de teste do alarme
export default function TelaRemedios({ remedios, setRemedios, onTestar, onVoltar }) {
  const [nome, setNome] = useState("");
  const [hora, setHora] = useState("");

  function adicionar(e) {
    e.preventDefault();
    if (!nome.trim() || !hora) return;
    const nova = [...remedios, { nome: nome.trim(), hora }].sort((a, b) => a.hora.localeCompare(b.hora));
    setRemedios(nova);
    setNome("");
    setHora("");
  }

  return (
    <div className="tela">
      <button className="voltar" onClick={onVoltar}><Icone nome="voltar" tamanho={22} /> Início</button>
      <h2>Remédios</h2>

      <ul className="lista">
        {remedios.map((r, i) => (
          <li key={r.nome + r.hora}>
            <span className="lista-hora">{r.hora}</span>
            <span className="lista-nome">{r.nome}</span>
            <button className="bt-icone" onClick={() => setRemedios(remedios.filter((_, j) => j !== i))}
              aria-label={"Remover " + r.nome}>
              <Icone nome="lixeira" tamanho={20} />
            </button>
          </li>
        ))}
        {remedios.length === 0 && <li className="vazio">Nenhum remédio ainda. Adicione abaixo.</li>}
      </ul>

      <form className="novo" onSubmit={adicionar}>
        <p className="rotulo">Novo remédio</p>
        <input placeholder="Nome do remédio" value={nome} onChange={(e) => setNome(e.target.value)} aria-label="Nome do remédio" />
        <div className="novo-linha">
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} aria-label="Horário" />
          <button type="submit" className="bt-principal"><Icone nome="mais" tamanho={20} /> Adicionar</button>
        </div>
      </form>

      <button className="bt-contorno" onClick={onTestar}><Icone nome="sino" tamanho={20} /> Testar o alarme agora</button>
    </div>
  );
}
