import Head from 'next/head'
import Link from 'next/link'
import ConverterFormAudio from '../components/ConverterFormAudio'

export default function AudioConverterPage() {
  // Formatos base por defecto
    const fromFormat = 'mp3'
    const toFormat = 'wav'

    return (
        <>
        <Head>
            <title>Conversor de audio online (MP3, WAV, OGG, AAC, FLAC, M4A) | ImageFormatX</title>
            <meta
            name="description"
            content="Convierte archivos de audio entre MP3, WAV, OGG, AAC, FLAC y M4A gratis y online. Sin instalar programas, fácil y seguro."
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://imageformatx.com/audio-converter" />
            <meta property="og:title" content="Conversor de audio online | ImageFormatX" />
            <meta property="og:description" content="Convierte entre MP3, WAV, OGG, AAC, FLAC, M4A y más gratis y online." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://imageformatx.com/audio-converter" />
        </Head>

        <main>
            <ConverterFormAudio
            fromFormat={fromFormat}
            toFormat={toFormat}
            lockFrom={false}
            />

            <section className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-slate-800">
            <h2 className="text-2xl font-bold text-center mb-4">Conversiones populares de audio</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-blue-600 font-medium text-sm mb-8">
                {[
                ['MP3 a WAV', '/mp3-to-wav-media'],
                ['WAV a MP3', '/wav-to-mp3-media'],
                ['OGG a MP3', '/ogg-to-mp3-media'],
                ['MP3 a OGG', '/mp3-to-ogg-media'],
                ['FLAC a MP3', '/flac-to-mp3-media'],
                ['AAC a MP3', '/aac-to-mp3-media'],
                ['M4A a MP3', '/m4a-to-mp3-media'],
                ].map(([text, url]) => (
                <li key={url}>
                    <Link href={url} className="hover:underline">
                    {text}
                    </Link>
                </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">Comparativa de formatos de audio</h2>
            <div className="overflow-auto mb-10">
                <table className="min-w-full table-auto border border-slate-300 text-sm">
                <thead className="bg-slate-100 text-left">
                    <tr>
                    {[
                        'Formato', 'Calidad', 'Tamaño', 'Compatibilidad', 'Compresión', 'Ideal para'
                    ].map((header) => (
                        <th key={header} className="border px-3 py-2">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                    ['MP3', 'Alta', 'Pequeño', 'Universal', 'Con pérdida', 'Música, podcast'],
                    ['WAV', 'Sin pérdida', 'Grande', 'Universal', 'Sin compresión', 'Edición profesional'],
                    ['OGG', 'Alta', 'Pequeño', 'Web', 'Con pérdida', 'Web, juegos'],
                    ['AAC', 'Muy alta', 'Pequeño', 'Apple/iTunes', 'Con pérdida', 'Música, streaming'],
                    ['FLAC', 'Sin pérdida', 'Medio', 'Moderna', 'Sin pérdida', 'Audio Hi-Fi'],
                    ['M4A', 'Alta', 'Pequeño', 'Apple', 'Con pérdida', 'Música iOS'],
                    ].map((row) => (
                    <tr key={row[0]}>
                        {row.map((cell, idx) => (
                        <td key={idx} className="border px-3 py-2">{cell}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Preguntas frecuentes sobre el conversor de audio</h2>
            <div className="space-y-4">
                <div>
                <strong>¿Cómo convierto un audio?</strong>
                <p>Sube tu archivo de audio, selecciona el formato de salida y pulsa "Convertir audios". Descarga el resultado al instante.</p>
                </div>
                <div>
                <strong>¿Es gratis?</strong>
                <p>Sí, todas las funciones de ImageFormatX son gratuitas y sin registro.</p>
                </div>
                <div>
                <strong>¿Pierde calidad el audio?</strong>
                <p>Solo si conviertes entre formatos con compresión con pérdida (ej: WAV a MP3). Para máxima calidad, usa FLAC o WAV.</p>
                </div>
                <div>
                <strong>¿Hay límites?</strong>
                <p>No, puedes convertir todos los audios que necesites, sin restricciones.</p>
                </div>
                <div>
                <strong>¿Mis archivos son privados?</strong>
                <p>Sí, se eliminan automáticamente tras la conversión y nadie accede a tus datos.</p>
                </div>
            </div>
            </section>
        </main>
        </>
    )
}
