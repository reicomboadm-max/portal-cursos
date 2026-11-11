import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-sm font-bold text-gray-400">Portal Cursos</span>
          </div>
          <p className="text-xs text-gray-500">
            Prepare-se com os melhores cursos para concursos públicos. Acesso via Google Drive.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Suporte
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/5 text-xs text-gray-600">
          Portal Cursos Concursos - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
