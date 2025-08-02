import Head from 'next/head'
import ConverterForm from '../components/ConverterFormImages'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <>
        <Head>
            <title>Conversor de Imágenes Online Gratis | ImageFormatX</title>
            <link rel="icon" href="/favicon.ico" />
            <meta
            name="description"
            content="Convierte JPG, PNG, WEBP, AVIF, GIF y JPEG online gratis, rápido y seguro con ImageFormatX."
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://imageformatx.com/" />
        </Head>
        <div id="converter-form">
            <ConverterForm fromFormat="jpg" toFormat="webp" lockFrom={false} />
        </div>
        <section className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-slate-800">
            <p className="text-base text-slate-700 my-6">
            <strong>ImageFormatX</strong> es el conversor online de imágenes más sencillo y rápido. Convierte <b>JPG, PNG, WEBP, AVIF, GIF, JPEG</b> gratis y sin instalar programas, desde cualquier dispositivo. Sube tu archivo, elige el formato de salida y descarga tu imagen convertida en segundos.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">¿Por qué elegir ImageFormatX?</h2>
            <ul className="list-disc ml-6 space-y-2 text-base">
            <li><strong>Rápido y gratis:</strong> Conversión inmediata, sin costes y sin registro.</li>
            <li><strong>Privacidad total:</strong> Tus imágenes se eliminan automáticamente tras la conversión.</li>
            <li><strong>Compatible con todos los dispositivos:</strong> PC, Mac, iOS, Android, tablets y más.</li>
            <li><strong>Calidad óptima:</strong> Mantén la máxima calidad posible al convertir imágenes.</li>
            <li><strong>Amplio soporte de formatos:</strong> JPG, PNG, WEBP, AVIF, GIF, JPEG.</li>
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-4">Beneficios de convertir tus imágenes online</h2>
            <ul className="list-disc ml-6 space-y-2 text-base">
            <li><strong>Optimiza el peso de tus imágenes</strong> para que tu web cargue más rápido.</li>
            <li><strong>Consigue transparencia</strong> con PNG, WebP y AVIF para logos o gráficos.</li>
            <li><strong>Genera animaciones</strong> en GIF o WebP animado fácilmente.</li>
            <li><strong>Aumenta la compatibilidad</strong> en cualquier navegador o dispositivo.</li>
            <li><strong>Mejora tu SEO</strong> al reducir el tamaño y acelerar tu web.</li>
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-4">Preguntas frecuentes sobre ImageFormatX</h2>
            <div className="space-y-4">
            <div>
                <strong>¿Cómo convierto imágenes?</strong>
                <p>Solo tienes que subir tu imagen, elegir el formato de destino y hacer clic en "Convertir".</p>
            </div>
            <div>
                <strong>¿Es gratis para siempre?</strong>
                <p>Sí, todas las funciones de ImageFormatX son gratuitas y sin registro.</p>
            </div>
            <div>
                <strong>¿Mis imágenes son privadas?</strong>
                <p>Sí, las imágenes se eliminan automáticamente tras la conversión y nadie tiene acceso a tus archivos.</p>
            </div>
            <div>
                <strong>¿Hay límites de uso?</strong>
                <p>No, puedes convertir tantas imágenes como quieras, sin restricciones.</p>
            </div>
            <div>
                <strong>¿Funciona bien en móvil?</strong>
                <p>Sí, puedes usar ImageFormatX desde cualquier móvil o tablet, además de PC y Mac.</p>
            </div>
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-4">Comparativa de formatos de imagen</h2>
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
        </section>
        <div className="h-28" />
        <Footer />
        </>
    )
}
