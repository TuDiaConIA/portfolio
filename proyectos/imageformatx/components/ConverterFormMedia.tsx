'use client';
import { useState, useRef, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';

const AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
const VIDEO_FORMATS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

type MediaType = 'audio' | 'video';

type ConverterFormMediaProps = {
    fromFormat?: string;
    toFormat?: string;
    lockFrom?: boolean;
    mediaType?: MediaType;
    };

    export default function ConverterFormMedia({
    fromFormat,
    toFormat,
    lockFrom = false,
    mediaType,
    }: ConverterFormMediaProps) {
    const [type, setType] = useState<MediaType>(mediaType || 'audio');
    const [from, setFrom] = useState(fromFormat || AUDIO_FORMATS[0]);
    const [to, setTo] = useState(toFormat || AUDIO_FORMATS[1]);
    const [lockedFrom, setLockedFrom] = useState(lockFrom);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mediaType) setType(mediaType);
        if (mediaType === 'audio') {
        setFrom(fromFormat || AUDIO_FORMATS[0]);
        setTo(toFormat || AUDIO_FORMATS[1]);
        }
        if (mediaType === 'video') {
        setFrom(fromFormat || VIDEO_FORMATS[0]);
        setTo(toFormat || VIDEO_FORMATS[1]);
        }
        setLockedFrom(lockFrom);
    }, [fromFormat, toFormat, lockFrom, mediaType]);

    const FORMATS = type === 'audio' ? AUDIO_FORMATS : VIDEO_FORMATS;

    // Drag & drop handlers
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files)
        .filter(file => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            return FORMATS.includes(ext || '');
        });
        if (droppedFiles.length) {
        setFiles(prev => [...prev, ...droppedFiles]);
        // Lock from according to first file
        const ext = droppedFiles[0].name.split('.').pop()?.toLowerCase();
        if (ext) {
            setFrom(ext);
            setLockedFrom(true);
        }
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files)
        .filter(file => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            return FORMATS.includes(ext || '');
        });
        if (selectedFiles.length) {
        setFiles(prev => [...prev, ...selectedFiles]);
        const ext = selectedFiles[0].name.split('.').pop()?.toLowerCase();
        if (ext) {
            setFrom(ext);
            setLockedFrom(true);
        }
        }
    };

    const removeFile = (index: number) => {
        const updated = [...files];
        updated.splice(index, 1);
        setFiles(updated);
        if (updated.length === 0) {
        setLockedFrom(lockFrom);
        setFrom(fromFormat || FORMATS[0]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTypeChange = (val: MediaType) => {
        setType(val);
        setFiles([]);
        setFrom(val === 'audio' ? AUDIO_FORMATS[0] : VIDEO_FORMATS[0]);
        setTo(val === 'audio' ? AUDIO_FORMATS[1] : VIDEO_FORMATS[1]);
        setLockedFrom(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length || from === to) return;
        setLoading(true);
        setError(null);

        try {
        // Si varios archivos: backend puede retornar un zip
        const formData = new FormData();
        files.forEach(f => formData.append('files', f));
        formData.append('from', from);
        formData.append('to', to);
        formData.append('type', type);

        const response = await fetch('/api/convert-media', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('No se pudo convertir los archivos.');

        const contentType = response.headers.get('content-type');
        const disposition = response.headers.get('content-disposition');
        let filename = 'convertido';
        if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
        } else {
            filename += files.length > 1 ? '.zip' : `.${to}`;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        } catch (err: any) {
        setError(err.message || 'Error inesperado');
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
            Convertir {type === 'audio' ? 'audio' : 'video'} online
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo: Audio / Vídeo */}
            {!mediaType && (
            <div className="flex justify-center mb-3 gap-3">
                <button
                type="button"
                onClick={() => handleTypeChange('audio')}
                className={`px-4 py-2 rounded ${type === 'audio' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}
                >
                Audio
                </button>
                <button
                type="button"
                onClick={() => handleTypeChange('video')}
                className={`px-4 py-2 rounded ${type === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}
                >
                Vídeo
                </button>
            </div>
            )}

            <div className="flex items-center justify-between gap-4">
            {/* Formato origen */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                Convertir de:
                </label>
                <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={lockedFrom}
                >
                {FORMATS.map(format => (
                    <option key={format} value={format}>
                    {format.toUpperCase()}
                    </option>
                ))}
                </select>
            </div>
            {/* Formato destino */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                a:
                </label>
                <select
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full border rounded px-3 py-2"
                >
                {FORMATS.filter(f => f !== from).map(format => (
                    <option key={format} value={format}>
                    {format.toUpperCase()}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {/* Drag & Drop area */}
            <div
            className="border-2 border-dashed border-blue-300 rounded p-6 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 flex flex-col items-center transition"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => fileInputRef.current?.click()}
            >
            <UploadCloud className="w-8 h-8 mb-2 text-blue-500" />
            <span className="text-blue-700 font-medium">
                Arrastra y suelta tus archivos aquí, o haz clic para seleccionar
            </span>
            <input
                ref={fileInputRef}
                type="file"
                accept={FORMATS.map(f => `.${f}`).join(',')}
                multiple
                className="hidden"
                onChange={handleFileChange}
            />
            </div>

            {/* Lista de archivos */}
            <div className="space-y-2">
            {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                <span className="text-sm truncate max-w-[85%]">{file.name}</span>
                <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Eliminar archivo"
                >
                    <X size={18} />
                </button>
                </div>
            ))}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
            type="submit"
            disabled={!files.length || from === to || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
            >
            {loading ? 'Convirtiendo...' : `Convertir ${type === 'audio' ? 'audio' : 'video'}`}
            </button>
        </form>
        </section>
    );
}
