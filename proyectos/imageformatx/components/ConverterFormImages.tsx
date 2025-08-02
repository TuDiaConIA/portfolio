'use client';
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

type ConverterFormProps = {
    fromFormat: string;
    toFormat: string;
    lockFrom?: boolean;
    };

    const formats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

    // Map extension to mimetype
    const mimeType = (ext: string) => {
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        return 'image/jpeg';
        case 'png':
        return 'image/png';
        case 'webp':
        return 'image/webp';
        case 'gif':
        return 'image/gif';
        case 'avif':
        return 'image/avif';
        default:
        return 'image/*';
    }
    };

    export default function ConverterForm({ fromFormat, toFormat, lockFrom = false }: ConverterFormProps) {
    const [from, setFrom] = useState(fromFormat);
    const [to, setTo] = useState(toFormat);
    const [files, setFiles] = useState<File[]>([]);
    const [lockedFromState, setLockedFromState] = useState<boolean>(lockFrom);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFrom(fromFormat);
        setTo(toFormat);
        setLockedFromState(lockFrom);
    }, [fromFormat, toFormat, lockFrom]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        const extension = selectedFiles[0]?.name.split('.').pop()?.toLowerCase();
        if (extension && formats.includes(extension)) {
        setFrom(extension);
        setLockedFromState(true);
        const sameTypeFiles = selectedFiles.filter(file =>
            file.name.toLowerCase().endsWith(extension)
        );
        setFiles(prev => [...prev, ...sameTypeFiles]);
        } else {
        setError('Tipo de archivo no soportado.');
        }
    };

    const removeFile = (index: number) => {
        const updated = [...files];
        updated.splice(index, 1);
        setFiles(updated);

        if (updated.length === 0) {
        setLockedFromState(lockFrom); // si el prop lockFrom es false, desbloquea
        setFrom(fromFormat);
        }

        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!files.length || from === to) return;
        setLoading(true);

        try {
        // Enviar todos los archivos en un solo FormData
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('from', from);
        formData.append('to', to);

        const response = await fetch('/api/convert-image', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const contentDisposition = response.headers.get('Content-Disposition');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Si API devuelve batch (zip), asigna nombre, si no, usa primero
            if (contentDisposition && contentDisposition.includes('zip')) {
            link.download = `convertidos-${from}-a-${to}.zip`;
            } else if (files.length === 1) {
            link.download = `convertido-${files[0].name.split('.')[0]}.${to}`;
            } else {
            link.download = `convertidos.${to}`;
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            setError('Error al convertir. Formato no soportado o fallo del servidor.');
        }
        } catch (err) {
        setError('Ocurrió un error inesperado. Intenta nuevamente.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <section className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-12 animate-fade-in">
        <h1
            id="converter-title"
            className="text-2xl font-bold text-slate-800 mb-4 text-center"
            >
            Convertir imágenes online
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de conversión de imágenes">
            <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
                <label htmlFor="from" className="block text-sm font-medium text-slate-700 mb-1">Convertir de:</label>
                <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={lockedFromState}
                >
                {formats.map((format) => (
                    <option key={format} value={format}>
                    {format.toUpperCase()}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex-1">
                <label htmlFor="to" className="block text-sm font-medium text-slate-700 mb-1">a:</label>
                <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border rounded px-3 py-2"
                >
                {formats
                    .filter((f) => f !== from)
                    .map((format) => (
                    <option key={format} value={format}>
                        {format.toUpperCase()}
                    </option>
                    ))}
                </select>
            </div>
            </div>

            <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={mimeType(from)}
            multiple
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            aria-label="Subir imágenes"
            />

            <div className="space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                <span className="text-sm truncate max-w-[85%]">{file.name}</span>
                <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Eliminar ${file.name}`}
                >
                    <X size={18} />
                </button>
                </div>
            ))}
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {loading && <div className="text-blue-600 text-sm">Convirtiendo...</div>}

            <button
            type="submit"
            disabled={!files.length || from === to || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
            >
            {loading ? 'Convirtiendo...' : 'Convertir imágenes'}
            </button>
        </form>
        </section>
    );
}
