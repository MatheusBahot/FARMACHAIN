import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Shell({ children }) {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `text-[12px] transition ${
      isActive ? "text-black font-medium" : "text-neutral-500 hover:text-black"
    }`;

  function logout() {
    localStorage.removeItem("farmachain-auth");
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5">
          <Link to="/inicio" className="flex items-center gap-2">
            <img
              src="/images/logo/farmachain-logo.png"
              alt="FarmaChain"
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-[13px] font-semibold tracking-tight">
              FarmaChain
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/inicio" className={navClass}>Início</NavLink>
            <NavLink to="/executivo" className={navClass}>Painel</NavLink>
            <NavLink to="/inventario" className={navClass}>Inventário</NavLink>
            <NavLink to="/admin" className={navClass}>Cadastro</NavLink>
            <NavLink to="/farmacovigilancia" className={navClass}>Vigilância</NavLink>
            <NavLink to="/demo" className={navClass}>Dispensação</NavLink>
          </nav>

          <button
            onClick={logout}
            className="rounded-full bg-black px-4 py-1.5 text-[12px] text-white"
          >
            Sair
          </button>
        </div>
      </header>

      {children}
    </main>
  );
}
