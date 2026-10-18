// Muestra la tabla de incidentes que recibe desde App
//export default function ListaIncidentes({ incidentes }) {
export default function ListaIncidentes({ incidentes, alSeleccionar }) {
  if (incidentes.length === 0) {
    return <p>No hay incidentes registrados.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Categoría</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Reportó</th>
          <th>Técnico</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {incidentes.map((i) => (
          //<tr key={i.id}>
          <tr key={i.id} onClick={() => alSeleccionar(i)} style={{ cursor: 'pointer' }}>
            <td>{i.id}</td>
            <td>{i.titulo}</td>
            <td>{i.categoria}</td>
            <td><span className={`etiqueta ${i.prioridad}`}>{i.prioridad}</span></td>
            <td>{i.estado}</td>
            <td>{i.usuario_nombre}</td>
            <td>{i.tecnico_nombre || 'Sin asignar'}</td>
            <td>{new Date(i.fecha_creacion).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}