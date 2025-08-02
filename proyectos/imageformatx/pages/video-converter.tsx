import Head from 'next/head'
import ConverterFormVideo from '../components/ConverterFormVideo'
import Link from 'next/link'
import Footer from '../components/Footer'


export default function VideoConverterPage() {
    // Defecto: mp4 a webm
    const fromFormat = 'mp4'
    const toFormat = 'webm'

    return (
        <>
        <Head>
            <title>Conversor de video online - ImageFormatX</title>
            <link rel="icon" href="/favicon.ico" />
            <meta
            name="description"
            content="Convierte vídeos entre formatos populares como MP4, WEBM, AVI, MOV y MKV de forma gratuita y online. Sin instalar programas, resultados inmediatos y seguros."
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://imageformatx.com/video-converter" />
            <meta property="og:title" content="Conversor de vídeo online | ImageFormatX" />
            <meta property="og:description" content="Convierte vídeos entre formatos: MP4, WEBM, AVI, MOV, MKV y más." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://imageformatx.com/video-converter" />
        </Head>

        <main>
            <ConverterFormVideo
            fromFormat={fromFormat}
            toFormat={toFormat}
            lockFrom={false}
            />

            <section className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-slate-800">
            <h2 className="text-2xl font-bold text-center mb-4">Conversiones populares de vídeo</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-blue-600 font-medium text-sm mb-8">
                {[
                ['MP4 a WEBM', '/mp4-to-webm-media'],
                ['WEBM a MP4', '/webm-to-mp4-media'],
                ['MP4 a AVI', '/mp4-to-avi-media'],
                ['AVI a MP4', '/avi-to-mp4-media'],
                ['MP4 a MOV', '/mp4-to-mov-media'],
                ['MOV a MP4', '/mov-to-mp4-media'],
                ['MP4 a MKV', '/mp4-to-mkv-media'],
                ['MKV a MP4', '/mkv-to-mp4-media'],
                ].map(([text, url]) => (
                <li key={url}>
                    <Link href={url} className="hover:underline">
                    {text}
                    </Link>
                </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">Comparativa de formatos de vídeo</h2>
            <div className="overflow-auto mb-10">
                <table className="min-w-full table-auto border border-slate-300 text-sm">
                <thead className="bg-slate-100 text-left">
                    <tr>
                    {[
                        'Formato', 'Calidad', 'Tamaño', 'Compatibilidad', 'Audio incluido', 'Ideal para'
                    ].map((header) => (
                        <th key={header} className="border px-3 py-2">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                    ['MP4', 'Muy alta', 'Pequeño', 'Universal', 'Sí', 'YouTube, móvil, web'],
                    ['WEBM', 'Alta', 'Muy pequeño', 'Web/Chrome', 'Sí', 'HTML5/web'],
                    ['MOV', 'Alta', 'Grande', 'Apple/QuickTime', 'Sí', 'Edición, Apple'],
                    ['AVI', 'Media', 'Grande', 'Windows', 'Sí', 'Edición clásica'],
                    ['MKV', 'Muy alta', 'Variable', 'VLC/Avanzado', 'Sí', 'Vídeos largos, subtítulos'],
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

            <h2 className="text-xl font-bold mt-8 mb-4">Preguntas frecuentes sobre el conversor de vídeo</h2>
            <div className="space-y-4">
                <div>
                <strong>¿Cómo convierto un vídeo?</strong>
                <p>Sube tu vídeo, selecciona el formato de salida y pulsa "Convertir vídeos". Descarga tu archivo convertido al instante.</p>
                </div>
                <div>
                <strong>¿Es gratis?</strong>
                <p>Sí, todas las funciones de ImageFormatX son gratuitas y sin registro.</p>
                </div>
                <div>
                <strong>¿Mantiene la calidad?</strong>
                <p>Sí, se prioriza la máxima calidad en cada conversión.</p>
                </div>
                <div>
                <strong>¿Hay límite de uso?</strong>
                <p>No, puedes convertir todos los vídeos que necesites, sin restricciones.</p>
                </div>
                <div>
                <strong>¿Mis vídeos son privados?</strong>
                <p>Sí, tus vídeos se eliminan automáticamente tras la conversión y nadie accede a ellos.</p>
                </div>
            </div>
            </section>
        </main>
        <Footer />
        </>
    )
}
