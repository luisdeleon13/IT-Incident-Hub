import { useEffect, useState } from 'react';
import { obtenerTecnicos, asignarTecnico } from '../api';

// Panel que muestra un incidente y permite asignarle un tecnico
export default function DetalleIncidente({ incidente, alCambiar, alCerrar }) {
  const [tecnicos, setTecnicos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(incidente.tecnico_id || '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Carga la lista de tecnicos al abrir el panel
  useEffect(() => {
    obtenerTecnicos().then(setTecnicos).catch((e) => setError(e.message));
  }, []);

  async function asignar() {
    if (!seleccionado) {
      setError('Elige un tecnico');
      return;
    }
    setError('');
    setGuardando(true);
    try {
      await asignarTecnico(incidente.id, seleccionado);
      alCambiar(); // Recarga la lista en la pantalla principal
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="tarjeta">
      <h2>Incidente #{incidente.id}: {incidente.titulo}</h2>
      <p>{incidente.descripcion}</p>
      <p>
        <strong>Estado:</strong> {incidente.estado} ·{' '}
        <strong>Técnico:</strong> {incidente.tecnico_nombre || 'Sin asignar'}
      </p>

      <label>Asignar técnico</label>
      <select value={seleccionado} onChange={(e) => setSeleccionado(e.target.value)}>
        <option value="">-- Elige un técnico --</option>
        {tecnicos.map((t) => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}

      <button onClick={asignar} disabled={guardando}>
        {guardando ? 'Asignando...' : 'Asignar'}
      </button>{' '}
      <button onClick={alCerrar} style={{ background: '#6b7280' }}>Cerrar</button>
    </div>
  );
}