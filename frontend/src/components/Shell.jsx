import { Link, NavLink } from "react-router-dom";
import { Pill } from "lucide-react";

export default function Shell({ children }) {
  const navClass = ({ isActive }) =>
    `text-sm transition ${
      isActive ? "text-gray-950 font-semibold" : "text-gray-500 hover:text-gray-950"
    }`;

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-gray-950">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
              <Pill size={21} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none tracking-tight">
                FarmaChain
              </p>
              <p className="text-xs text-gray-500">
                Blockchain para logística farmacêutica
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <NavLink to="/" className={navClass}>Início</NavLink>
            <NavLink to="/executivo" className={navClass}>Executivo</NavLink>
            <NavLink to="/admin" className={navClass}>Cadastro</NavLink>
            <NavLink to="/farmacovigilancia" className={navClass}>Farmacovigilância</NavLink>
            <NavLink to="/demo" className={navClass}>Demo</NavLink>
          </nav>

          <Link
            to="/admin"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Novo lote
          </Link>
        </div>
      </header>

      {children}
    </main>
  );
}
