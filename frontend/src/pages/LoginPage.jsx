import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Box,
  MapPin,
  QrCode,
  ShieldCheck,
  Truck,
  UserRoundCheck,
  Activity
} from "lucide-react";

function ImageCard({ image, title, text, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-black ${className}`}>
      <img src={image} alt={title} className="h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
        <p className="mt-2 max-w-xs text-[13px] leading-6 text-white/85">{text}</p>
      </div>
    </div>
  );
}

function MiniFeature({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-[13px] font-semibold">{title}</h4>
        <p className="mt-1 text-[11px] leading-5 text-neutral-500">{text}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  function login() {
    localStorage.setItem("farmachain-auth", "true");
    navigate("/inicio");
  }

  return (
    <main className="min-h-screen bg-white text-[#1d1d1f]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo/farmachain-logo.png"
              alt="FarmaChain"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-[14px] font-semibold tracking-tight">FarmaChain</span>
          </div>

          <nav className="hidden items-center gap-9 text-[12px] text-neutral-700 md:flex">
            <a href="#tecnologia" className="hover:text-black">FarmaChain</a>
            <a href="#contato" className="hover:text-black">Contato</a>
            <button
              onClick={login}
              className="rounded-full bg-black px-5 py-2.5 text-[12px] font-medium text-white"
            >
              Acessar plataforma
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-16 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-blue-600">
            Rastreabilidade farmacêutica
          </p>

          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] md:text-6xl">
            Tecnologia, segurança e transparência em cada etapa.
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-8 text-neutral-600">
            O FarmaChain utiliza blockchain, QR Code, criptografia e dados
            inteligentes para rastrear medicamentos da origem ao paciente.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={login}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[13px] font-medium text-white"
            >
              Acessar plataforma
              <ArrowRight size={16} />
            </button>

            <a
              href="#contato"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-neutral-700"
            >
              Falar com nossa equipe
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/images/logo/farmachain-logo.png"
            alt="Cápsula tecnológica FarmaChain"
            className="w-full max-w-[520px] rounded-[36px] object-cover"
          />
        </div>
      </section>

      <section id="tecnologia" className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <ImageCard
            image="/images/logistica-farmaceutica.jpg"
            title="Logística farmacêutica"
            text="Rastreamento em tempo real da cadeia de suprimentos."
            className="h-[260px]"
          />

          <ImageCard
            image="/images/controle-estoque.jpg"
            title="Controle de estoque"
            text="Gestão inteligente de estoque, validade e disponibilidade."
            className="h-[260px]"
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ImageCard
            image="/images/medicamentos-lote.jpg"
            title="Lotes e validade"
            text="Controle por lote, fabricante, distribuidor e prazo de validade."
            className="h-[210px]"
          />

          <ImageCard
            image="/images/qr-code-medicamento.jpg"
            title="QR Code"
            text="Geração de QR único para cada lote cadastrado."
            className="h-[210px]"
          />

          <ImageCard
            image="/images/farmaceutico-tablet.jpg"
            title="Farmacovigilância"
            text="Eventos adversos, recall e ações preventivas."
            className="h-[210px]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 md:grid-cols-5">
          <MiniFeature icon={Box} title="Blockchain" text="Registros imutáveis e auditáveis." />
          <MiniFeature icon={MapPin} title="GPS" text="Localização vinculada à retirada." />
          <MiniFeature icon={UserRoundCheck} title="Dispensação" text="Paciente vinculado com proteção de dados." />
          <MiniFeature icon={Truck} title="Transparência" text="Histórico logístico acessível." />
          <MiniFeature icon={ShieldCheck} title="Segurança" text="Dados criptografados e rastreáveis." />
        </div>
      </section>

      <section id="contato" className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-[34px] bg-[#f5f5f7] p-8 md:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            Contato e acesso à plataforma.
          </h2>
          <p className="mt-4 max-w-2xl text-[14px] leading-7 text-neutral-600">
            Projeto FarmaChain para demonstração acadêmica e tecnológica em
            logística farmacêutica, blockchain, rastreabilidade, QR Code,
            farmacovigilância e proteção de dados.
          </p>
          <button
            onClick={login}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-[13px] font-medium text-white"
          >
            Entrar no sistema
          </button>
        </div>
      </section>

      <footer className="border-t border-black/10 px-6 py-6 text-[11px] leading-6 text-neutral-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>Copyright © 2026 FarmaChain. Todos os direitos reservados.</p>
          <p>Política de Privacidade &nbsp; Política de vendas &nbsp; Avisos legais &nbsp; Mapa do site &nbsp; Brasil</p>
        </div>
      </footer>
    </main>
  );
}
