// Ícones desenhados em SVG (traço simples, sem emoji)
const caminhos = {
  telefone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mensagem: "M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z",
  remedio: "M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7zM7 10l7 7",
  relogio: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  ajustes: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4",
  microfone: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3",
  enviar: "M5 12h14M13 6l6 6-6 6",
  voltar: "M15 5l-7 7 7 7",
  mais: "M12 5v14M5 12h14",
  lixeira: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  sino: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  alto: "M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6",
};

export default function Icone({ nome, tamanho = 24 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={caminhos[nome]} />
    </svg>
  );
}
