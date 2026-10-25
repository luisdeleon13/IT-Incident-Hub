import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { obtenerDistribucion } from '../api';

// Una grafica de barras con titulo
function GraficaBarras({ titulo, datos, color }) {
    return (
        <div className="tarjeta" style={{ flex: 1 }}>
            <h3>{titulo}</h3>
            <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="total" fill={color} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Dos graficas: por categoria y por tecnico. Se refrescan cuando cambia "actualizar"
export default function Graficas({ actualizar }) {
    const [datos, setDatos] = useState({ porCategoria: [], porTecnico: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerDistribucion()
            .then((d) => { setDatos(d); setError(''); })
            .catch((e) => setError(e.message));
    }, [actualizar]);

    return (
        <>
            {error && <p className="error">{error}</p>}
            <div className="fila">
                <GraficaBarras titulo="Incidentes por categoría" datos={datos.porCategoria} color="#1d4ed8" />
                <GraficaBarras titulo="Incidentes por técnico" datos={datos.porTecnico} color="#059669" />
            </div>
        </>
    );
}