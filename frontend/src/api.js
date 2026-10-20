// Direccion de la API del backend
const API_URL = 'http://localhost:3000';

// Trae la lista de incidentes
export async function obtenerIncidentes() {
  const respuesta = await fetch(`${API_URL}/incidentes`);
  if (!respuesta.ok) throw new Error('No se pudo cargar la lista');
  return respuesta.json();
}

// Crea un incidente nuevo
export async function crearIncidente(datos) {
  const respuesta = await fetch(`${API_URL}/incidentes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const cuerpo = await respuesta.json();
  // Si la API responde error (400, 500...), lanzamos su mensaje
  if (!respuesta.ok) throw new Error(cuerpo.error || 'Error al crear');
  return cuerpo;
}