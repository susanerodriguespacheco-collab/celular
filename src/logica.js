// Dados de exemplo
export const contatos = ["Maria", "João", "Ana"];
export const remediosIniciais = [
  { nome: "Losartana", hora: "08:00" },
  { nome: "Vitamina D", hora: "12:00" },
  { nome: "Sinvastatina", hora: "21:00" },
];

export function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function dataHoje() {
  const d = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

// Próximo remédio do dia (ou o primeiro de amanhã)
export function proximoRemedio(remedios) {
  if (remedios.length === 0) return null;
  const agora = horaAtual();
  return remedios.find((r) => r.hora >= agora) || remedios[0];
}

// "08:00" -> "8 horas", "12:30" -> "12 e 30"
export function horaFalada(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return m === 0 ? `${h} ${h === 1 ? "hora" : "horas"}` : `${h} e ${m}`;
}

// Recebe o pedido (falado ou digitado) e devolve a resposta da assistente
export function interpretar(texto, remedios = [], nome = "") {
  const t = texto.toLowerCase();
  const pessoa = contatos.find((c) => t.includes(c.toLowerCase()));

  if (t.includes("socorro") || t.includes("sos") || t.includes("emergência")) {
    return "Calma, já avisei a Maria e o João que você precisa de ajuda.";
  }
  if (t.includes("ligar") || t.includes("liga")) {
    return `Tá bom, ligando pra ${pessoa || "Maria"}.`;
  }
  if (t.includes("mensagem")) {
    return `Claro. O que você quer dizer pra ${pessoa || "Maria"}?`;
  }
  if (t.includes("remédio") || t.includes("remedio")) {
    if (remedios.length === 0) return "Você ainda não tem nenhum remédio cadastrado.";
    const lista = remedios.map((r) => `${r.nome} às ${horaFalada(r.hora)}`).join(", ");
    return `Hoje você tem ${lista}.`;
  }
  if (t.includes("hora")) {
    return `Agora são ${horaFalada(horaAtual())}.`;
  }
  if (t.includes("oi") || t.includes("olá") || t.includes("bom dia") || t.includes("boa tarde") || t.includes("boa noite")) {
    return `Oi${nome ? ", " + nome : ""}! Em que posso te ajudar?`;
  }
  return "Desculpa, não entendi. Você pode pedir pra ligar pra alguém, ver seus remédios ou saber a hora.";
}
