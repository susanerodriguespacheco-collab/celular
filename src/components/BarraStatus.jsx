// Barra do topo, igual à de um celular
export default function BarraStatus({ hora }) {
  return (
    <div className="status">
      <span>{hora}</span>
      <span className="status-icones" aria-hidden="true">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" /><rect x="2.5" y="2.5" width="15" height="7" rx="1.5" /><rect x="24" y="4" width="2" height="4" rx="1" /></svg>
      </span>
    </div>
  );
}
