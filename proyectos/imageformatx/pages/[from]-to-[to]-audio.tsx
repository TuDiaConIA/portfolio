import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ConverterFormVideo from '../components/ConverterFormVideo'

export default function VideoFormatPage() {
    const router = useRouter();
    const { from, to } = router.query as { from?: string; to?: string };
    const [fromFormat, setFromFormat] = useState('mp4');
    const [toFormat, setToFormat] = useState('webm');

    useEffect(() => {
        let detectedFrom = from, detectedTo = to;
        if (!detectedFrom || !detectedTo) {
            const match = router.asPath.match(/\/([a-z0-9]+)-to-([a-z0-9]+)-video/i);
            if (match) [, detectedFrom, detectedTo] = match;
        }
        if (detectedFrom) setFromFormat(detectedFrom);
        if (detectedTo) setToFormat(detectedTo);
    }, [router.query, router.asPath, from, to]);

    const VIDEO_FORMATS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
    const prettyFrom = fromFormat?.toUpperCase() || '';
    const prettyTo = toFormat?.toUpperCase() || '';
    const title = `Convertir ${prettyFrom} a ${prettyTo} Online Gratis | ImageFormatX`;
    const description = `Convierte vídeos ${prettyFrom} a ${prettyTo} de forma rápida y gratuita. Compatible con todos los navegadores y sistemas.`;

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={`https://imageformatx.com/${fromFormat}-to-${toFormat}-video`} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://imageformatx.com/${fromFormat}-to-${toFormat}-video`} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `¿Cómo convierto vídeos ${prettyFrom} a ${prettyTo}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `Solo tienes que subir tus vídeos ${prettyFrom}, seleccionar ${prettyTo} como formato de salida y pulsar convertir. Podrás descargar el resultado al instante.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "¿Puedo convertir varios vídeos a la vez?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sí, puedes subir y convertir vídeos en lote. Si hay más de uno, recibirás un ZIP."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "¿Mantiene la calidad?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sí, se prioriza la máxima calidad en cada conversión, ideal para uso profesional o personal."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "¿Es gratis y privado?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sí, todas las funciones son gratuitas y los archivos se eliminan automáticamente tras la conversión."
                            }
                        }
                    ]
                })
            }} />
        </Head>

        <main id="main-content">
            <div id="converter-form">
                <ConverterFormVideo
                    fromFormat={fromFormat}
                    toFormat={toFormat}
                    lockFrom={true}
                />
            </div>

            <section className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-slate-800">
                <p className="text-base text-slate-700 my-6">
                    Convierte <b>{prettyFrom} a {prettyTo}</b> online sin instalar nada. Sube tus archivos de vídeo, selecciona el formato de destino y descarga el resultado gratis y en segundos. Perfecto para YouTube, Instagram, edición y más.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Conversiones populares de vídeo</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-blue-600 font-medium text-sm mb-8">
                    {[
                        ['MP4 a WEBM', '/mp4-to-webm-video'],
                        ['WEBM a MP4', '/webm-to-mp4-video'],
                        ['MOV a MP4', '/mov-to-mp4-video'],
                        ['AVI a MP4', '/avi-to-mp4-video'],
                        ['MKV a MP4', '/mkv-to-mp4-video'],
                        ['MP4 a AVI', '/mp4-to-avi-video'],
                        ['MP4 a MOV', '/mp4-to-mov-video'],
                        ['MP4 a MKV', '/mp4-to-mkv-video'],
                    ].map(([text, url]) => (
                        <li key={url}>
                            <Link href={`${url}#converter`} scroll={false} className="hover:underline">
                                {text}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Comparativa de formatos de vídeo */}
                <h2 className="text-2xl font-bold mt-8 mb-4">Comparativa de formatos de vídeo</h2>
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

                <h2 className="text-2xl font-bold mt-8 mb-4">Ventajas de convertir {prettyFrom} a {prettyTo} online</h2>
                <ul className="list-disc ml-6 space-y-2 text-base">
                    <li><strong>Convierte sin instalar nada</strong> en cualquier dispositivo.</li>
                    <li><strong>Archivos privados</strong>: se eliminan tras la conversión.</li>
                    <li><strong>Compatible con todos los sistemas</strong>: Windows, Mac, Android, iOS, Linux.</li>
                    <li><strong>Resultados de alta calidad</strong> listos para usar.</li>
                    <li><strong>Descarga directa o ZIP si subes varios archivos.</strong></li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">Preguntas frecuentes sobre la conversión de {prettyFrom} a {prettyTo}</h2>
                <div className="space-y-4">
                    <div>
                        <strong>¿Cómo convierto archivos {prettyFrom} a {prettyTo}?</strong>
                        <p>Sube tus vídeos {prettyFrom}, selecciona {prettyTo} y haz clic en "Convertir". Descarga tus archivos convertidos al instante.</p>
                    </div>
                    <div>
                        <strong>¿Puedo convertir varios archivos a la vez?</strong>
                        <p>Sí, puedes subir y convertir archivos en lote. Si hay más de uno, recibirás un ZIP.</p>
                    </div>
                    <div>
                        <strong>¿Es gratis y privado?</strong>
                        <p>Sí, todas las funciones son gratuitas y los archivos se eliminan automáticamente tras la conversión.</p>
                    </div>
                    <div>
                        <strong>¿Funciona desde móvil?</strong>
                        <p>Sí, puedes convertir desde móvil, tablet o PC, en cualquier sistema operativo.</p>
                    </div>
                    <div>
                        <strong>¿Mantiene la calidad?</strong>
                        <p>Sí, se prioriza la máxima calidad en cada conversión, ideal para uso profesional o personal.</p>
                    </div>
                </div>
            </section>
        </main>
        </>
    )
}
