import Icone from "./Icone.jsx";

// Ajustes: nome, voz da assistente e modo simples
export default function TelaAjustes({ nomeUsuario, setNomeUsuario, vozes, vozAtual, setNomeVoz, usandoNuvem, setUsandoNuvem,
  modoSimples, setModoSimples, onOuvirExemplo, onVoltar }) {
  return (
    <div className="tela">
      <button className="voltar" onClick={onVoltar}><Icone nome="voltar" tamanho={22} /> Início</button>
      <h2>Ajustes</h2>

      <label className="campo">
        <span className="rotulo">Como a assistente te chama</span>
        <input value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} />
      </label>

      <label className="chave">
        <span>
          <span className="lista-nome">Voz realista (ElevenLabs)</span>
          <span className="dica">{usandoNuvem ? "Ligada" : "Desligada: usando a voz do navegador"}</span>
        </span>
        <input type="checkbox" checked={usandoNuvem} onChange={(e) => setUsandoNuvem(e.target.checked)} />
      </label>

      <label className="campo">
        <span className="rotulo">Voz do navegador (reserva)</span>
        {vozes.length > 0 ? (
          <select value={vozAtual?.name || ""} onChange={(e) => setNomeVoz(e.target.value)}>
            {vozes.map((v) => (
              <option key={v.name} value={v.name}>{v.name.replace(/ - .*$/, "")}</option>
            ))}
          </select>
        ) : (
          <span className="dica">Nenhuma voz em português encontrada neste navegador.</span>
        )}
      </label>
      <button className="bt-contorno" onClick={onOuvirExemplo}><Icone nome="alto" tamanho={20} /> Ouvir exemplo</button>
      <p className="dica">As vozes com “Natural” ou “Google” no nome soam mais humanas.</p>

      <label className="chave">
        <span>
          <span className="lista-nome">Letras grandes</span>
          <span className="dica">Deixa tudo maior e mais fácil de tocar</span>
        </span>
        <input type="checkbox" checked={modoSimples} onChange={(e) => setModoSimples(e.target.checked)} />
      </label>
    </div>
  );
}
