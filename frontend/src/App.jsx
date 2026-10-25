import { useEffect, useState } from 'react';
import { obtenerIncidentes, obtenerTecnicos } from './api';
import FormularioIncidente from './components/FormularioIncidente';
import ListaIncidentes from './components/ListaIncidentes';
import DetalleIncidente from './components/DetalleIncidente';
import FiltrosIncidentes from './components/FiltrosIncidentes';

const FILTROS_VACIOS = { estado: '', prioridad: '', categoria: '', tecnico_id: '' };

export default function App() {
  const [incidentes, setIncidentes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState('');

  async function cargar() {
    try {
      const lista = await obtenerIncidentes(filtros);
      setIncidentes(lista);
      setSeleccionado((actual) =>
        actual ? lista.find((i) => i.id === actual.id) || null : null
      );
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Recarga la lista cada vez que cambia un filtro
  useEffect(() => {
    cargar();
  }, [filtros]);

  useEffect(() => {
    obtenerTecnicos().then(setTecnicos).catch(() => { });
  }, []);

  return (
    <div className="contenedor">
      <h1>IT Incident Hub</h1>
      <FormularioIncidente alCrear={cargar} />

      {seleccionado && (
        <DetalleIncidente
          key={seleccionado.id}
          incidente={seleccionado}
          alCambiar={cargar}
          alCerrar={() => setSeleccionado(null)}
        />
      )}

      <h2>Incidentes</h2>
      <FiltrosIncidentes
        filtros={filtros}
        tecnicos={tecnicos}
        alCambiar={setFiltros}
        alLimpiar={() => setFiltros(FILTROS_VACIOS)}
      />
      {error && <p className="error">{error}</p>}
      <ListaIncidentes incidentes={incidentes} alSeleccionar={setSeleccionado} />
    </div>
  );
}