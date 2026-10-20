import { useEffect, useState } from 'react';
import { obtenerIncidentes } from './api';
import FormularioIncidente from './components/FormularioIncidente';
import ListaIncidentes from './components/ListaIncidentes';

export default function App() {
  const [incidentes, setIncidentes] = useState([]);
  const [error, setError] = useState('');

  // Pide la lista a la API
  async function cargar() {
    try {
      setIncidentes(await obtenerIncidentes());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Se ejecuta una vez al abrir la pagina
  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="contenedor">
      <h1>IT Incident Hub</h1>
      <FormularioIncidente alCrear={cargar} />
      <h2>Incidentes</h2>
      {error && <p className="error">{error}</p>}
      <ListaIncidentes incidentes={incidentes} />
    </div>
  );
}