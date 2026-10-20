import { useState } from 'react';
import { crearIncidente } from '../api';

// Estado inicial del formulario (se reutiliza para limpiarlo)
const VACIO = {
  titulo: '',
  descripcion: '',
  categoria: 'HARDWARE',
  prioridad: 'MEDIA',
  usuario_id: 1, // Por ahora fijo: Ana Lopez. Luego se cambiara por el usuario real.
};

export default function FormularioIncidente({ alCrear }) {
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Actualiza el campo que el usuario esta escribiendo
  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault(); // Evita que la pagina se recargue
    setError('');
    setEnviando(true);
    try {
      await crearIncidente({ ...datos, usuario_id: Number(datos.usuario_id) });
      setDatos(VACIO); // Limpia el formulario
      alCrear();       // Avisa a la pantalla principal para recargar la lista
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="tarjeta">
      <h2>Reportar incidente</h2>

      <label>Título</label>
      <input name="titulo" value={datos.titulo} onChange={cambiar} />

      <label>Descripción</label>
      <textarea name="descripcion" rows="3" value={datos.descripcion} onChange={cambiar} />

      <div className="fila">
        <div>
          <label>Categoría</label>
          <select name="categoria" value={datos.categoria} onChange={cambiar}>
            <option>HARDWARE</option>
            <option>SOFTWARE</option>
            <option>RED</option>
            <option>ACCESOS</option>
            <option>OTRO</option>
          </select>
        </div>
        <div>
          <label>Prioridad</label>
          <select name="prioridad" value={datos.prioridad} onChange={cambiar}>
            <option>BAJA</option>
            <option>MEDIA</option>
            <option>ALTA</option>
            <option>CRITICA</option>
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Crear incidente'}
      </button>
    </form>
  );
}