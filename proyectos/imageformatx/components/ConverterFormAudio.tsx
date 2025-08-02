'use client'
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

// Formatos de audio soportados
const AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a']

// Solo permitidas conversiones directas entre estos
const SUPPORTED = new Set([
    'mp3:wav',   'wav:mp3',
    'ogg:mp3',   'mp3:ogg',
    'flac:mp3',  'mp3:flac',
    'aac:mp3',   'mp3:aac',
    'm4a:mp3',   'mp3:m4a',
    'wav:ogg',   'ogg:wav',
    'flac:wav',  'wav:flac',
    'aac:wav',   'wav:aac',
    'm4a:wav',   'wav:m4a',
    // Puedes añadir más combinaciones si tu backend las soporta
    ])

    type ConverterFormAudioProps = {
    fromFormat: string
    toFormat: string
    lockFrom?: boolean
    }

    export default function ConverterFormAudio({
    fromFormat,
    toFormat,
    lockFrom = false,
    }: ConverterFormAudioProps) {
    const [from, setFrom] = useState(fromFormat)
    const [to, setTo] = useState(toFormat)
    const [files, setFiles] = useState<File[]>([])
    const [lockedFrom, setLockedFrom] = useState(lockFrom)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setFrom(fromFormat)
        setTo(toFormat)
        setLockedFrom(lockFrom)
    }, [fromFormat, toFormat, lockFrom])

    // Solo permite conversiones soportadas
    const validTos = AUDIO_FORMATS.filter((f) => f !== from && SUPPORTED.has(`${from}:${f}`))
    const isSupported = from !== to && SUPPORTED.has(`${from}:${to}`)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const selectedFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...selectedFiles])
    }

    const removeFile = (index: number) => {
        const updated = [...files]
        updated.splice(index, 1)
        setFiles(updated)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!files.length || from === to || !isSupported) return

        setLoading(true)
        for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('from', from)
        formData.append('to', to)
        formData.append('type', 'audio')

        const response = await fetch('/api/convert-audio', {
            method: 'POST',
            body: formData,
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `convertido-${file.name.split('.')[0]}.${to}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
        }
        setLoading(false)
        setFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <section className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Convertir audios online
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Convertir de:</label>
                <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={lockedFrom}
                >
                {AUDIO_FORMATS.map(format => (
                    <option key={format} value={format}>
                    {format.toUpperCase()}
                    </option>
                ))}
                </select>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">a:</label>
                <select
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full border rounded px-3 py-2"
                >
                {validTos.map(format => (
                    <option key={format} value={format}>
                    {format.toUpperCase()}
                    </option>
                ))}
                </select>
            </div>
            </div>

            <input
            ref={fileInputRef}
            type="file"
            accept={AUDIO_FORMATS.map(f => `.${f}`).join(',')}
            multiple
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            />

            <div className="space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                <span className="text-sm truncate max-w-[85%]">{file.name}</span>
                <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                >
                    <X size={18} />
                </button>
                </div>
            ))}
            </div>

            <button
            type="submit"
            disabled={!files.length || from === to || !isSupported || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
            >
            {loading ? 'Convirtiendo...' : 'Convertir audios'}
            </button>
        </form>
        </section>
    )
}
