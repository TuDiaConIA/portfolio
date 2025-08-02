'use client'
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

type ConverterFormVideoProps = {
    fromFormat: string
    toFormat: string
    lockFrom?: boolean
    }

    // SOLO combinaciones soportadas (puedes ampliar esta lista)
    const SUPPORTED_PAIRS = [
    ['mp4', 'webm'],
    ['webm', 'mp4'],
    ['mp4', 'avi'],
    ['avi', 'mp4'],
    ['mp4', 'mov'],
    ['mov', 'mp4'],
    ['mp4', 'mkv'],
    ['mkv', 'mp4'],
    ]
    const FORMATS = Array.from(
    new Set(SUPPORTED_PAIRS.flat())
    )

    export default function ConverterFormVideo({
    fromFormat,
    toFormat,
    lockFrom = false
    }: ConverterFormVideoProps) {
    const [from, setFrom] = useState(fromFormat)
    const [to, setTo] = useState(toFormat)
    const [files, setFiles] = useState<File[]>([])
    const [lockedFrom, setLockedFrom] = useState<boolean>(lockFrom)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)

    // Opciones destino válidas para el "from" actual
    const toOptions = SUPPORTED_PAIRS
        .filter(([f, t]) => f === from && t !== from)
        .map(([_, t]) => t)

    // Ajusta el destino cuando cambia el origen
    useEffect(() => {
        setFrom(fromFormat)
        setLockedFrom(lockFrom)
    }, [fromFormat, lockFrom])

    useEffect(() => {
        if (!toOptions.includes(to)) {
        setTo(toOptions[0] || '')
        }
    }, [from, toOptions.join(',')])

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
        if (!files.length || from === to || !toOptions.includes(to)) return

        setLoading(true)
        const formData = new FormData()
        files.forEach(file => {
        formData.append('files', file)
        })
        formData.append('from', from)
        formData.append('to', to)
        formData.append('type', 'video')

        const response = await fetch('/api/convert-video', {
        method: 'POST',
        body: formData
        })

        if (response.ok) {
        const blob = await response.blob()
        const isZip = response.headers.get('content-type') === 'application/zip'
        const extension = isZip ? 'zip' : to
        const filename =
            files.length > 1
            ? `convertidos.${extension}`
            : `convertido-${files[0].name.split('.')[0]}.${to}`
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        }
        setLoading(false)
        setFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <section className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            Convertir vídeos online
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
                {FORMATS.map(format => (
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
                disabled={!toOptions.length}
                >
                {toOptions.map(format => (
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
            accept={FORMATS.map(f => `.${f}`).join(',')}
            multiple
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            name="files"
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
            disabled={!files.length || from === to || !toOptions.length || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
            >
            {loading ? 'Convirtiendo...' : 'Convertir vídeos'}
            </button>
        </form>
        </section>
    )
}
