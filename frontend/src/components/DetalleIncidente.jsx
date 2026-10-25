import { useEffect, useState } from 'react';
import { obtenerTecnicos, asignarTecnico, cambiarEstado } from '../api';

// Estados a los que se puede pasar desde cada estado (igual que el backend)
const SIGUIENTES = {
  NUEVO: [],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTO'],
  RESUELTO: ['CERRADO', 'EN_PROCESO'],
  CERRADO: [],
};

export default function DetalleIncidente({ incidente, alCambiar, alCerrar }) {
  const [tecnicos, setTecnicos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(incidente.tecnico_id || '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

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
      alCambiar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  // Pasa el incidente al estado indicado
  async function mover(nuevo) {
    setError('');
    try {
      await cambiarEstado(incidente.id, nuevo);
      alCambiar();
    } catch (err) {
      setError(err.message);
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

      <div style={{ marginTop: 12 }}>
        {SIGUIENTES[incidente.estado].map((e) => (
          <button key={e} onClick={() => mover(e)} style={{ marginRight: 8 }}>
            Pasar a {e}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <button onClick={asignar} disabled={guardando}>
        {guardando ? 'Asignando...' : 'Asignar'}
      </button>{' '}
      <button onClick={alCerrar} style={{ background: '#6b7280' }}>Cerrar</button>
    </div>
  );
}