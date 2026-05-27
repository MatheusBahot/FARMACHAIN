import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  MapPin,
  Pill,
  Sparkles
} from "lucide-react";
import { modules, flowSteps, imagePanels } from "../data/farmachainContent";

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function IllustrationPanel({ item, index }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative">
        <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-950 text-white">
          <Icon size={30} />
        </div>

        <h3 className="text-2xl font-semibold text-gray-950">{item.title}</h3>
        <p className="mt-3 leading-7 text-gray-600">{item.subtitle}</p>

        <div className="mt-8 grid grid-cols-5 gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 rounded-full ${
                i % 3 === 0 ? "bg-blue-500" : i % 4 === 0 ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] text-gray-950">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-white">
              <Pill size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">FarmaChain</p>
              <p className="text-xs text-gray-500">Salvador • Blockchain logística</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
            <a href="#modulos" className="hover:text-gray-950">Módulos</a>
            <a href="#fluxo" className="hover:text-gray-950">Fluxo</a>
            <a href="#qr" className="hover:text-gray-950">QR Code</a>
            <Link to="/demo" className="hover:text-gray-950">Demo</Link>
          </nav>

          <Link
            to="/demo"
            className="rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Abrir demonstração
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="absolute left-1/2 top-0 h-[520px] w-[780px] -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute right-0 top-32 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
              <Sparkles size={16} />
              Rastreabilidade farmacêutica inteligente
            </div>

            <h1 className="mt-7 text-5xl font-semibold tracking-tight text-gray-950 md:text-7xl">
              Do lote ao paciente, com blockchain, QR Code e segurança.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
              O FarmaChain é uma plataforma para logística farmacêutica municipal,
              controle de estoque, validade, fabricante, distribuidor,
              dispensação protegida e farmacovigilância, com foco em Salvador.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-medium text-white transition hover:bg-blue-700"
              >
                Ver demonstração em tempo real
                <ArrowRight size={18} />
              </Link>

              <a
                href="#modulos"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
              >
                Conhecer módulos
              </a>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                CPF protegido
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                QR imprimível
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Auditoria por hash
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-300/40 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-300/40 blur-2xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Lote rastreado</p>
                    <h2 className="text-2xl font-semibold">LOS-SSA-2026-A01</h2>
                  </div>
                  <div className="rounded-2xl bg-gray-950 p-3 text-white">
                    <QrCode />
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-gray-950 p-5 text-white">
                  <p className="text-sm text-gray-400">Medicamento</p>
                  <h3 className="mt-1 text-3xl font-semibold">Losartana 50 mg</h3>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-gray-400">Fabricante</p>
                      <p className="mt-1 text-sm">Farma Brasil S.A.</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-gray-400">Distribuidor</p>
                      <p className="mt-1 text-sm">Nordeste Medicamentos</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-gray-400">Unidade</p>
                      <p className="mt-1 text-sm">UBS Federação</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="mt-1 text-sm text-emerald-300">Ativo e rastreável</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <ShieldCheck className="text-emerald-600" />
                    <div>
                      <p className="font-medium">Bloco blockchain validado</p>
                      <p className="text-sm text-gray-500">Hash anterior + hash atual íntegros</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <MapPin className="text-blue-600" />
                    <div>
                      <p className="font-medium">Retirada com GPS</p>
                      <p className="text-sm text-gray-500">Salvador, distrito Barra/Rio Vermelho</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section id="modulos" className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Plataforma ampla
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Um ecossistema completo para gestão farmacêutica municipal.
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-600">
            O projeto não é apenas um cadastro. Ele integra estoque, lote,
            validade, dispensação, auditoria, geolocalização, QR Code e
            farmacovigilância em uma experiência única.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, index) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 text-white">
                  <Icon size={25} />
                </div>
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{module.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {imagePanels.map((item, index) => (
            <IllustrationPanel key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section id="fluxo" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2.5rem] bg-gray-950 p-8 text-white md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Como funciona
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              A jornada do medicamento fica visível do cadastro à dispensação.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {flowSteps.map((step) => (
              <div key={step.number} className="rounded-[1.7rem] bg-white/8 p-5">
                <p className="text-4xl font-semibold text-blue-300">{step.number}</p>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="qr" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Etiqueta inteligente
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              QR Code gerado no cadastro do lote, pronto para impressão.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Ao cadastrar um lote, o FarmaChain cria uma rota pública de
              rastreabilidade e um QR Code. Esse QR pode ser impresso, colado no
              medicamento ou na caixa logística e lido posteriormente por celular.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-4 font-medium text-white"
              >
                Gerar QR na demonstração
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-sm">
            <div className="mx-auto max-w-sm rounded-[2rem] border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-3xl bg-white shadow-inner">
                <QrCode size={150} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Etiqueta do lote</h3>
              <p className="mt-2 text-sm text-gray-500">
                LOS-SSA-2026-A01 • Losartana 50 mg • Validade 01/2028
              </p>
              <p className="mt-4 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                Pronto para impressão
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2.5rem] bg-blue-600 p-10 text-white md:p-14">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Uma solução chamativa para demonstrar tecnologia aplicada à saúde pública.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">
            O FarmaChain pode evoluir para login por perfil, painel de estoque,
            mapa de Salvador, alertas de vencimento, recall sanitário, relatórios
            em PDF e blockchain permissionada real.
          </p>

          <Link
            to="/demo"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-blue-700"
          >
            Abrir painel demonstrativo
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
