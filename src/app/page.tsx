import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Status do Sistema: &nbsp;
          <code className="font-mono font-bold text-emerald-600">Online 🚀</code>
        </p>
      </div>

      <div className="relative flex place-items-center my-16">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
            <GraduationCap size={64} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Saber Pedagógico
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Sua infraestrutura Next.js + Prisma está configurada e pronta para o deploy na Hostinger.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8 w-full max-w-3xl">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Prisma ORM
              </div>
              <p className="text-sm text-slate-500">Configurado com binários compatíveis com Linux Debian (Hostinger).</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Standalone
              </div>
              <p className="text-sm text-slate-500">Output otimizado para execução via node server.js.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <div className="flex items-center gap-2 mb-2 font-bold text-slate-800">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Tailwind CSS
              </div>
              <p className="text-sm text-slate-500">Estilização moderna configurada no App Router.</p>
            </div>
          </div>

          <button className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
            Acessar Sistema <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}