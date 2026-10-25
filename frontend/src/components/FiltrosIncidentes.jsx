// Barra de filtros sobre la lista de incidentes
export default function FiltrosIncidentes({ filtros, tecnicos, alCambiar, alLimpiar }) {
    function cambiar(e) {
        alCambiar({ ...filtros, [e.target.name]: e.target.value });
    }

    return (
        <div className="tarjeta">
            <div className="fila">
                <div>
                    <label>Estado</label>
                    <select name="estado" value={filtros.estado} onChange={cambiar}>
                        <option value="">Todos</option>
                        <option>NUEVO</option>
                        <option>ASIGNADO</option>
                        <option>EN_PROCESO</option>
                        <option>RESUELTO</option>
                        <option>CERRADO</option>
                    </select>
                </div>
                <div>
                    <label>Prioridad</label>
                    <select name="prioridad" value={filtros.prioridad} onChange={cambiar}>
                        <option value="">Todas</option>
                        <option>BAJA</option>
                        <option>MEDIA</option>
                        <option>ALTA</option>
                        <option>CRITICA</option>
                    </select>
                </div>
                <div>
                    <label>Categoría</label>
                    <select name="categoria" value={filtros.categoria} onChange={cambiar}>
                        <option value="">Todas</option>
                        <option>HARDWARE</option>
                        <option>SOFTWARE</option>
                        <option>RED</option>
                        <option>ACCESOS</option>
                        <option>OTRO</option>
                    </select>
                </div>
                <div>
                    <label>Técnico</label>
                    <select name="tecnico_id" value={filtros.tecnico_id} onChange={cambiar}>
                        <option value="">Todos</option>
                        {tecnicos.map((t) => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button onClick={alLimpiar}>Limpiar filtros</button>
        </div>
    );
}