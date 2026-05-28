import { Link } from "react-router-dom";
import Shell from "../components/Shell";
import {
  Activity,
  ArrowRight,
  Blocks,
  LayoutDashboard,
  PackagePlus,
  QrCode,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";

function ModuleCard({ icon: Icon, title, text, to }) {
  return (
    <Link
      to={to}
      className="rounded-[36px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <Icon size={28} />
      <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-neutral-600">
        {text}
      </p>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
        Abrir
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <Shell>
      <section className="px-6 py-20 text-center">
        <h1 className="mx-auto max-w-5xl text-6xl font-semibold tracking-[-0.06em] md:text-8xl">
          Plataforma FarmaChain.
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-neutral-600">
          Área operacional para acessar os módulos de blockchain, estoque,
          cadastro de lotes, QR Code, dispensação, farmacovigilância e auditoria.
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            icon={LayoutDashboard}
            title="Painel executivo"
            text="Indicadores gerais de medicamentos, lotes, estoque, validade, distritos e blocos blockchain."
            to="/executivo"
          />

          <ModuleCard
            icon={PackagePlus}
            title="Cadastro e QR"
            text="Cadastre medicamento e lote. O QR Code é gerado automaticamente para impressão."
            to="/admin"
          />

          <ModuleCard
            icon={UserRoundCheck}
            title="Dispensação"
            text="Simule a retirada do medicamento pelo paciente com CPF criptografado e GPS da unidade."
            to="/demo"
          />

          <ModuleCard
            icon={Activity}
            title="Farmacovigilância"
            text="Registre eventos adversos, analise riscos e bloqueie lotes para recall sanitário."
            to="/farmacovigilancia"
          />

          <ModuleCard
            icon={Blocks}
            title="Blockchain"
            text="Consulte eventos registrados em blocos encadeados por hash e valide a integridade da cadeia."
            to="/executivo"
          />

          <ModuleCard
            icon={QrCode}
            title="Rastreabilidade"
            text="Leia o QR Code do lote e visualize a história logística completa do medicamento."
            to="/admin"
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[48px] bg-black p-10 text-center text-white md:p-16">
          <ShieldCheck className="mx-auto" size={36} />
          <h2 className="mt-8 text-5xl font-semibold tracking-[-0.05em]">
            Blockchain acessível após login.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-neutral-300">
            Os módulos internos concentram os registros críticos da operação:
            cadastro, lote, estoque, dispensação, QR Code, recall e auditoria.
          </p>
        </div>
      </section>
    </Shell>
  );
}
