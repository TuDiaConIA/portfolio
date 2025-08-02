import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ConverterFormDocument from '../components/ConverterFormDocument'
import Footer from '../components/Footer'


const DOCUMENT_FORMATS = ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'epub', 'csv', 'xls']

export default function DocumentConverterPage() {
    const router = useRouter()
    const { from, to } = router.query as { from?: string; to?: string }
    const [fromFormat, setFromFormat] = useState('pdf')
    const [toFormat, setToFormat] = useState('docx')

    useEffect(() => {
        if (from && DOCUMENT_FORMATS.includes(from)) setFromFormat(from)
        if (to && DOCUMENT_FORMATS.includes(to)) setToFormat(to)
    }, [from, to])

    const prettyFrom = fromFormat?.toUpperCase() || ''
    const prettyTo = toFormat?.toUpperCase() || ''
    const title = `Convertir ${prettyFrom} a ${prettyTo} (Documentos) Online Gratis | ImageFormatX`
    const description = `Convierte documentos ${prettyFrom} a ${prettyTo} gratis, rápido y seguro. Compatible con PDF, DOCX, XLSX, PPTX, TXT, EPUB, CSV y más.`

    return (
        <>
        <Head>
            <title>Conversor de documentos online - ImageFormatX</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={`https://imageformatx.com/document-converter`} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://imageformatx.com/document-converter" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                {
                    "@type": "Question",
                    "name": "¿Cómo convierto documentos?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sube tus archivos, elige el formato de salida y haz clic en Convertir. Descarga al instante."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Puedo convertir varios archivos?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, puedes subir y convertir archivos en lote. Si hay más de uno, recibirás un ZIP."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Es gratis y privado?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, todo es gratuito y los archivos se eliminan automáticamente tras la conversión."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Funciona en móvil?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, puedes convertir desde móvil, tablet o PC, en cualquier sistema operativo."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Mantiene el formato?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, se prioriza la máxima fidelidad en cada conversión, ideal para uso profesional o personal."
                    }
                }
                ]
            })
            }} />
        </Head>

        <main id="main-content">
            {/* Formulario para documentos */}
            <div id="converter-form">
            <ConverterFormDocument
                fromFormat={fromFormat}
                toFormat={toFormat}
                lockFrom={false}
            />
            </div>

            {/* Bloques SEO, comparativa, FAQ */}
            <section className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-slate-800">
            <p className="text-base text-slate-700 my-6">
                Convierte <b>{prettyFrom} a {prettyTo}</b> online sin instalar nada. Sube tus documentos, selecciona el formato de destino y descarga el resultado gratis en segundos.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Conversiones populares de documentos</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-blue-600 font-medium text-sm mb-8">
                {[
                ['PDF a DOCX', '/document-converter?from=pdf&to=docx'],
                ['DOCX a PDF', '/document-converter?from=docx&to=pdf'],
                ['PDF a TXT', '/document-converter?from=pdf&to=txt'],
                ['TXT a PDF', '/document-converter?from=txt&to=pdf'],
                ['DOCX a TXT', '/document-converter?from=docx&to=txt'],
                ['TXT a DOCX', '/document-converter?from=txt&to=docx'],
                ['XLSX a CSV', '/document-converter?from=xlsx&to=csv'],
                ['CSV a XLSX', '/document-converter?from=csv&to=xlsx'],
                ['XLS a CSV', '/document-converter?from=xls&to=csv'],
                ['CSV a XLS', '/document-converter?from=csv&to=xls'],
                ].map(([text, url]) => (
                <li key={url}>
                    <Link href={url} scroll={false} className="hover:underline">{text}</Link>
                </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Comparativa de formatos de documentos</h2>
            <div className="overflow-auto mb-10">
                <table className="min-w-full table-auto border border-slate-300 text-sm">
                <thead className="bg-slate-100 text-left">
                    <tr>
                    {[
                        'Formato', 'Editable', 'Peso', 'Compatibilidad', 'Ideal para'
                    ].map((header) => (
                        <th key={header} className="border px-3 py-2">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                    ['PDF', 'No', 'Medio', 'Universal', 'Envíos, impresión'],
                    ['DOCX', 'Sí', 'Variable', 'Office, Google Docs', 'Edición, trabajo'],
                    ['TXT', 'Sí', 'Muy bajo', 'Universal', 'Notas rápidas, código'],
                    ['XLSX', 'Sí', 'Variable', 'Excel, Google Sheets', 'Datos, tablas'],
                    ['CSV', 'Sí', 'Muy bajo', 'Universal', 'Datos simples'],
                    ['XLS', 'Sí', 'Variable', 'Excel clásico', 'Datos antiguos'],
                    ['EPUB', 'No', 'Bajo', 'Ebooks', 'Lectura digital'],
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

            <h2 className="text-2xl font-bold mt-8 mb-4">Preguntas frecuentes sobre la conversión de documentos</h2>
            <div className="space-y-4">
                <div>
                <strong>¿Cómo convierto documentos?</strong>
                <p>Sube tus archivos, elige el formato de salida y haz clic en "Convertir". Descarga al instante.</p>
                </div>
                <div>
                <strong>¿Puedo convertir varios archivos?</strong>
                <p>Sí, puedes subir y convertir archivos en lote. Si hay más de uno, recibirás un ZIP.</p>
                </div>
                <div>
                <strong>¿Es gratis y privado?</strong>
                <p>Sí, todo es gratuito y los archivos se eliminan automáticamente tras la conversión.</p>
                </div>
                <div>
                <strong>¿Funciona en móvil?</strong>
                <p>Sí, puedes convertir desde móvil, tablet o PC, en cualquier sistema operativo.</p>
                </div>
                <div>
                <strong>¿Mantiene el formato?</strong>
                <p>Sí, se prioriza la máxima fidelidad en cada conversión, ideal para uso profesional o personal.</p>
                </div>
            </div>
            </section>
        </main>
        <Footer />
        </>
        
    )
    
}

