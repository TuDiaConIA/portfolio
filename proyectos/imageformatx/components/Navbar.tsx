import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                {/* Logo + texto */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo.webp"
                        alt="Logo de ImageFormatX"
                        width={150}
                        height={150}
                        quality={75}
                        className="object-contain"
                    />
                </Link>

                {/* Categorías separadas */}
                <ul className="flex space-x-6 text-sm font-medium text-slate-700">
                    <li>
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            Imágenes
                        </Link>
                    </li>
                    <li>
                        <Link href="/audio-converter" className="hover:text-blue-600 transition-colors">
                            Audio
                        </Link>
                    </li>
                    <li>
                        <Link href="/video-converter" className="hover:text-blue-600 transition-colors">
                            Vídeo
                        </Link>
                    </li>
                    <li>
                        <Link href="/document-converter" className="hover:text-blue-600 transition-colors">Documentos</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
