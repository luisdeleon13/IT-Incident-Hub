import { useEffect, useState } from 'react';
import { obtenerIncidentes } from './api';
import FormularioIncidente from './components/FormularioIncidente';
import ListaIncidentes from './components/ListaIncidentes';
import DetalleIncidente from './components/DetalleIncidente';

export default function App() {
  const [incidentes, setIncidentes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    try {
      const lista = await obtenerIncidentes();
      setIncidentes(lista);
      // Si hay un detalle abierto, lo refresca con los datos nuevos
      setSeleccionado((actual) =>
        actual ? lista.find((i) => i.id === actual.id) || null : null
      );
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    cargar();
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
      {error && <p className="error">{error}</p>}
      <ListaIncidentes incidentes={incidentes} alSeleccionar={setSeleccionado} />
    </div>
  );
}