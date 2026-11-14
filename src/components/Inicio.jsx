import Icone from "./Icone.jsx";
import { dataHoje, proximoRemedio } from "../logica.js";

const apps = [
  { nome: "Ligar", icone: "telefone", pedido: "ligar para maria" },
  { nome: "Mensagem", icone: "mensagem", pedido: "mensagem" },
  { nome: "Remédios", icone: "remedio", tela: "remedios" },
  { nome: "Ajustes", icone: "ajustes", tela: "ajustes" },
];

// Tela inicial: relógio, próximo remédio e atalhos
export default function Inicio({ hora, nomeUsuario, remedios, onPedido, onAbrir }) {
  const proximo = proximoRemedio(remedios);

  return (
    <>
      <div className="relogio">
        <p className="relogio-hora">{hora}</p>
        <p className="relogio-data">{dataHoje()}</p>
      </div>

      {proximo && (
        <button className="cartao-remedio" onClick={() => onAbrir("remedios")}>
          <span className="cartao-icone"><Icone nome="remedio" tamanho={26} /></span>
          <span>
            <span className="rotulo">Próximo remédio</span>
            <span className="cartao-nome">{proximo.nome}</span>
          </span>
          <span className="cartao-hora">{proximo.hora}</span>
        </button>
      )}

      <div className="apps">
        {apps.map((a) => (
          <button key={a.nome} className="app"
            onClick={() => (a.tela ? onAbrir(a.tela) : onPedido(a.pedido))}>
            <span className="app-icone"><Icone nome={a.icone} tamanho={28} /></span>
            {a.nome}
          </button>
        ))}
      </div>

      <button className="sos" onClick={() => onPedido("socorro")}>SOS · Pedir ajuda</button>
      <p className="saudacao">Oi, {nomeUsuario}</p>
    </>
  );
}
