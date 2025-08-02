export default function Footer() {
    return (
        <footer className="w-full bg-slate-900 text-slate-100 text-center py-4 mt-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-1 items-center">
            <span>
            Hecho por <b>Sara Hidalgo Caro</b> &copy; 2025
            </span>
            <a
            href="mailto:sarahidalgocaro97@gmail.com"
            className="underline text-blue-300 hover:text-blue-400"
            >
            sarahidalgocaro97@gmail.com
            </a>
        </div>
        </footer>
    );
}
