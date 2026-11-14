// Tela do alarme, como o despertador de um celular
export default function Despertador({ alarme, nomeUsuario, onConfirmar, onAdiar }) {
  if (!alarme) return null;

  return (
    <div className="despertador" role="alertdialog" aria-label="Hora do remédio">
      <p className="rotulo claro">Lembrete de remédio</p>
      <p className="alarme-hora">{alarme.hora}</p>
      <p className="alarme-texto">{nomeUsuario}, está na hora do</p>
      <p className="alarme-remedio">{alarme.nome}</p>
      <div className="alarme-botoes">
        <button className="bt-tomei" onClick={onConfirmar}>Já tomei</button>
        <button className="bt-adiar" onClick={onAdiar}>Lembrar em 5 min</button>
      </div>
    </div>
  );
}
