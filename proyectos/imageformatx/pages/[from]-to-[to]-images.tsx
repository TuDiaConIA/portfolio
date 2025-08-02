import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ConverterForm from '../components/ConverterFormImages'

export default function FormatPage() {
    const router = useRouter();

    const { from, to } = router.query as { from?: string; to?: string };
    const [fromFormat, setFromFormat] = useState('jpg');
    const [toFormat, setToFormat] = useState('webp');

    useEffect(() => {
        let detectedFrom = from, detectedTo = to;
        if (!detectedFrom || !detectedTo) {
        const match = router.asPath.match(/\/([a-z]+)-to-([a-z]+)/i);
        if (match) {
            [, detectedFrom, detectedTo] = match;
        }
        }
        if (detectedFrom) setFromFormat(detectedFrom);
        if (detectedTo) setToFormat(detectedTo);

        // Scroll directo al h1, calculando offset sticky header
        if (typeof window !== 'undefined') {
        const shouldScroll =
            window.location.hash === '#converter' ||
            router.asPath.match(/\/[a-z]+-to-[a-z]+/i);
        if (shouldScroll) {
            setTimeout(() => {
            const el = document.getElementById('converter-title');
            const navbar = document.querySelector('header');
            const offset = navbar ? navbar.getBoundingClientRect().height : 70;
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const top = rect.top + scrollTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            }, 120);
        }
        }
    }, [router.query, router.asPath, from, to]);

    return (
        <>
        <Head>
            <title>Convertir {fromFormat.toUpperCase()} a {toFormat.toUpperCase()} Online Gratis | ImageFormatX</title>
            <meta
            name="description"
            content={`Convierte imágenes ${fromFormat.toUpperCase()} a ${toFormat.toUpperCase()} gratis y al instante. Herramienta online rápida, segura y optimizada para SEO.`}
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={`https://imageformatx.com/${fromFormat}-to-${toFormat}`} />
            <meta property="og:title" content={`Convertir ${fromFormat.toUpperCase()} a ${toFormat.toUpperCase()} Online`} />
            <meta
            property="og:description"
            content={`Convierte imágenes fácilmente sin instalar nada. Compatible con JPG, PNG, WEBP, y más.`}
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://imageformatx.com/${fromFormat}-to-${toFormat}`} />
            {/* Rich Snippet FAQ para SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                {
                    "@type": "Question",
                    "name": "¿Puedo convertir varias imágenes a la vez?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, puedes seleccionar y convertir varias imágenes al mismo tiempo. Recibirás un archivo ZIP con todas tus imágenes convertidas."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Se conserva la calidad original?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, nuestro conversor prioriza mantener la máxima calidad posible en cada formato, permitiéndote descargar imágenes óptimas para impresión o web."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Hay límites de tamaño o cantidad?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, puedes convertir tantas imágenes como necesites, sin restricciones de tamaño por archivo o cantidad diaria."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Qué pasa con mis archivos?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Por seguridad y privacidad, tus archivos se eliminan automáticamente del servidor tras la conversión. Nadie accede a tus imágenes."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Soporta conversión a formatos modernos?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, puedes convertir fácilmente a formatos modernos como WebP y AVIF para ahorrar espacio y acelerar tu sitio web."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Funciona desde el móvil?",
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, la web está optimizada para móvil, tablet y PC."
                    }
                }
                ]
            })
            }} />
        </Head>

        <main id="main-content">
            <div id="converter-form">
            <ConverterForm fromFormat={fromFormat} toFormat={toFormat} lockFrom={false} />
            </div>

            {/* === CONTENIDO SEO Y COPYWRITING === */}
            <section className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-slate-800">

            {/* Texto SEO-friendly */}
            <p className="text-base text-slate-700 my-6">
                <strong>ImageFormatX</strong> es el conversor online más rápido y sencillo para transformar tus imágenes entre <b>JPG, PNG, WEBP, AVIF, GIF y JPEG</b> desde cualquier dispositivo, sin instalar nada y totalmente gratis. Olvídate de programas complicados: simplemente sube tus archivos, elige el formato de salida y descarga las imágenes listas para usar. Ideal para webmasters, diseñadores, fotógrafos, creadores de contenido y usuarios que buscan optimizar sus imágenes para la web, redes sociales o cualquier proyecto digital.
            </p>

            {/* ¿Por qué convertir...? */}
            <h2 className="text-2xl font-bold mt-8 mb-4">¿Por qué convertir imágenes online con ImageFormatX?</h2>
            <ul className="list-disc ml-6 space-y-2 text-base">
                <li><strong>Rápido y sin registro:</strong> Sube y convierte en segundos, sin crear cuenta ni dejar tu email.</li>
                <li><strong>100% gratis:</strong> Todas las funciones son gratuitas, sin marcas de agua ni límites ocultos.</li>
                <li><strong>Privacidad garantizada:</strong> Tus archivos se eliminan automáticamente después de la conversión.</li>
                <li><strong>Soporte para todos los formatos populares:</strong> JPG, PNG, WEBP, GIF, AVIF, JPEG y más.</li>
                <li><strong>Compatible con móvil y escritorio:</strong> Usa ImageFormatX desde cualquier dispositivo.</li>
                <li><strong>Resultados de alta calidad:</strong> Conserva la máxima calidad de tus imágenes al convertir.</li>
            </ul>

            {/* Beneficios de convertir */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Beneficios de convertir tus imágenes a otros formatos</h2>
            <ul className="list-disc ml-6 space-y-2 text-base">
                <li><strong>Reduce el tamaño de tus archivos</strong> para cargar más rápido en tu web o compartir por email.</li>
                <li><strong>Obtén transparencia</strong> (PNG, WebP, AVIF) para logotipos y gráficos.</li>
                <li><strong>Activa animaciones</strong> convirtiendo a GIF o WebP animado.</li>
                <li><strong>Mejora la compatibilidad</strong> entre diferentes sistemas y navegadores.</li>
                <li><strong>Optimiza para SEO</strong>: Google premia las webs rápidas y optimizadas en imágenes.</li>
            </ul>

            {/* Conversiones populares */}
            <h2 className="text-3xl font-bold text-center text-slate-900 mt-10">Otras conversiones populares</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-blue-600 font-medium text-sm">
                {[
                ['PNG a JPG', '/png-to-jpg'],
                ['WEBP a PNG', '/webp-to-png'],
                ['JPEG a AVIF', '/jpeg-to-avif'],
                ['GIF a WEBP', '/gif-to-webp'],
                ['AVIF a JPG', '/avif-to-jpg'],
                ['JPG a PNG', '/jpg-to-png'],
                ].map(([text, url]) => (
                <li key={url}>
                    <Link href={`${url}#converter`} scroll={false} className="hover:underline">
                    {text}
                    </Link>
                </li>
                ))}
            </ul>

            {/* Comparación de formatos */}
            <h2 className="text-2xl font-bold">Comparación de formatos de imagen</h2>
            <div className="overflow-auto">
                <table className="min-w-full table-auto border border-slate-300 text-sm mt-4">
                <thead className="bg-slate-100 text-left">
                    <tr>
                    {[
                        'Formato', 'Tamaño', 'Calidad', 'Transparencia', 'Animaciones', 'Compresión', 'Soporte', 'Ideal para'
                    ].map((header) => (
                        <th key={header} className="border px-3 py-2">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                    ['AVIF', 'Muy pequeño', 'Excelente', 'Sí', 'Sí', 'Con y sin pérdida', 'Navegadores modernos', 'Webs ultra optimizadas'],
                    ['WEBP', 'Muy pequeño', 'Muy buena', 'Sí', 'Sí', 'Con y sin pérdida', 'Navegadores modernos', 'Optimizar páginas web'],
                    ['PNG', 'Grande', 'Excelente', 'Sí', 'No', 'Sin pérdida', 'Universal', 'Diseños, logos'],
                    ['JPEG', 'Medio', 'Buena', 'No', 'No', 'Con pérdida', 'Universal', 'Fotografías'],
                    ['JPG', 'Medio', 'Buena', 'No', 'No', 'Con pérdida', 'Universal', 'Fotografías'],
                    ['GIF', 'Grande', 'Limitada (256 colores)', 'Sí', 'Sí', 'Sin pérdida', 'Universal', 'Animaciones simples'],
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

            {/* FAQ mejorada */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Preguntas frecuentes sobre la conversión de imágenes</h2>
            <div className="space-y-4">
                <div>
                <strong>¿Puedo convertir varias imágenes a la vez?</strong>
                <p>Sí, puedes seleccionar y convertir varias imágenes al mismo tiempo. Recibirás un archivo ZIP con todas tus imágenes convertidas.</p>
                </div>
                <div>
                <strong>¿Se conserva la calidad original?</strong>
                <p>Sí, nuestro conversor prioriza mantener la máxima calidad posible en cada formato, permitiéndote descargar imágenes óptimas para impresión o web.</p>
                </div>
                <div>
                <strong>¿Hay límites de tamaño o cantidad?</strong>
                <p>No, puedes convertir tantas imágenes como necesites, sin restricciones de tamaño por archivo o cantidad diaria.</p>
                </div>
                <div>
                <strong>¿Qué pasa con mis archivos?</strong>
                <p>Por seguridad y privacidad, tus archivos se eliminan automáticamente del servidor tras la conversión. Nadie accede a tus imágenes.</p>
                </div>
                <div>
                <strong>¿Soporta conversión a formatos modernos?</strong>
                <p>Sí, puedes convertir fácilmente a formatos modernos como <b>WebP</b> y <b>AVIF</b> para ahorrar espacio y acelerar tu sitio web.</p>
                </div>
                <div>
                <strong>¿Funciona desde el móvil?</strong>
                <p>Sí, la web está optimizada para móvil, tablet y PC.</p>
                </div>
            </div>
            </section>
        </main>
        </>
  )
}
