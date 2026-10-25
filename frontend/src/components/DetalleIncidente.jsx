import { useEffect, useState } from 'react';
import {
  obtenerTecnicos, asignarTecnico, cambiarEstado,
  obtenerComentarios, crearComentario,
} from '../api';

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
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargarComentarios() {
    try {
      setComentarios(await obtenerComentarios(incidente.id));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    obtenerTecnicos().then(setTecnicos).catch((e) => setError(e.message));
    cargarComentarios();
  }, [incidente.id]);

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

  async function mover(nuevo) {
    setError('');
    try {
      await cambiarEstado(incidente.id, nuevo);
      alCambiar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function comentar() {
    if (!texto.trim()) {
      setError('Escribe un comentario');
      return;
    }
    setError('');
    try {
      await crearComentario(incidente.id, texto);
      setTexto('');
      await cargarComentarios();
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

      <h3>Bitácora</h3>
      <textarea
        rows="2"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe un comentario..."
      />
      <button onClick={comentar}>Comentar</button>
      {comentarios.length === 0 && <p>Sin comentarios todavía.</p>}
      <ul>
        {comentarios.map((c) => (
          <li key={c.id}>
            <strong>{c.autor}</strong> · {new Date(c.fecha).toLocaleString()}
            <br />
            {c.texto}
          </li>
        ))}
      </ul>

      {error && <p className="error">{error}</p>}

      <button onClick={asignar} disabled={guardando}>
        {guardando ? 'Asignando...' : 'Asignar'}
      </button>{' '}
      <button onClick={alCerrar} style={{ background: '#6b7280' }}>Cerrar</button>
    </div>
  );
}