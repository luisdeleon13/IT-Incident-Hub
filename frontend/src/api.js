// La URL sale de la variable de entorno de Vite; si no existe, usa localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// Trae los usuarios con rol TECNICO
export async function obtenerTecnicos() {
  const respuesta = await fetch(`${API_URL}/usuarios?rol=TECNICO`);
  if (!respuesta.ok) throw new Error('No se pudo cargar los tecnicos');
  return respuesta.json();
}

// Asigna un tecnico a un incidente
export async function asignarTecnico(incidenteId, tecnicoId) {
  const respuesta = await fetch(`${API_URL}/incidentes/${incidenteId}/asignar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tecnico_id: Number(tecnicoId) }),
  });
  const cuerpo = await respuesta.json();
  if (!respuesta.ok) throw new Error(cuerpo.error || 'Error al asignar');
  return cuerpo;
}
// Cambia el estado de un incidente
export async function cambiarEstado(id, estado) {
  const respuesta = await fetch(`${API_URL}/incidentes/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  const cuerpo = await respuesta.json();
  if (!respuesta.ok) throw new Error(cuerpo.error || 'Error al cambiar el estado');
  return cuerpo;
}