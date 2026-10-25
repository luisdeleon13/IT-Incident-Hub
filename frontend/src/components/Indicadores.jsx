import { useEffect, useState } from 'react';
import { obtenerResumen } from '../api';

// Tres tarjetas con los indicadores. Se refrescan cuando cambia "actualizar"
export default function Indicadores({ actualizar }) {
    const [resumen, setResumen] = useState({ abiertos: 0, cerrados: 0, criticos: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerResumen()
            .then((r) => { setResumen(r); setError(''); })
            .catch((e) => setError(e.message));
    }, [actualizar]);

    return (
        <div className="indicadores">
            {error && <p className="error">{error}</p>}
            <div className="indicador">
                <span>{resumen.abiertos}</span>
                Abiertos
            </div>
            <div className="indicador">
                <span>{resumen.cerrados}</span>
                Cerrados
            </div>
            <div className="indicador critico">
                <span>{resumen.criticos}</span>
                Críticos
            </div>
        </div>
    );
}