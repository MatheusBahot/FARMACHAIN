import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  ShieldCheck,
  Package,
  MapPin,
  Pill,
  Truck,
  CalendarClock,
  Building2,
  UserRoundCheck
} from "lucide-react";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
        <Icon size={22} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="mt-1 break-words text-lg font-semibold">{value}</h3>
    </div>
  );
}

export default function TracePage() {
  const { batchId } = useParams();
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadTrace() {
    try {
      const response = await api.get(`/trace/batch/${batchId}`);
      setTrace(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrace();
  }, [batchId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-gray-600">Carregando rastreabilidade do lote...</p>
      </main>
    );
  }

  if (!trace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Lote não encontrado</h1>
          <Link to="/" className="mt-4 inline-block text-blue-600">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const batch = trace.batch;

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
          <ArrowLeft size={18} />
          Voltar para o FarmaChain
        </Link>

        <div className="mt-8 rounded-[2.5rem] bg-gray-950 p-8 text-white md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
            <ShieldCheck size={16} />
            Rastreabilidade pública do lote
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight">
            {batch.medicine_name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
            Esta página foi aberta por QR Code e apresenta a história logística,
            sanitária e blockchain do lote selecionado.
          </p>

          <div className="mt-8 rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-gray-400">Identificação do lote</p>
            <p className="mt-1 break-all font-mono text-lg">{batch.batch_number}</p>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={Pill} label="Princípio ativo" value={batch.active_ingredient} />
          <InfoCard icon={Package} label="Forma e concentração" value={`${batch.pharmaceutical_form} • ${batch.concentration}`} />
          <InfoCard icon={Building2} label="Fabricante" value={batch.manufacturer} />
          <InfoCard icon={Truck} label="Distribuidor" value={batch.distributor} />
          <InfoCard icon={CalendarClock} label="Validade" value={new Date(batch.expiration_date).toLocaleDateString("pt-BR")} />
          <InfoCard icon={Package} label="Estoque atual" value={`${batch.quantity_current} unidade(s)`} />
          <InfoCard icon={MapPin} label="Unidade atual" value={batch.current_unit_name} />
          <InfoCard icon={ShieldCheck} label="Blockchain" value={trace.blockchain.valid ? "Cadeia validada" : "Inconsistência detectada"} />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <MapPin />
            <h2 className="text-2xl font-semibold">Localização logística</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="mt-1 font-medium">{batch.address}</p>
              <p className="mt-2 text-sm text-gray-500">Distrito: {batch.district}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">GPS</p>
              <p className="mt-1 font-medium">{batch.latitude}, {batch.longitude}</p>
              <a
                href={`https://www.google.com/maps?q=${batch.latitude},${batch.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-medium text-blue-600"
              >
                Abrir no mapa
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserRoundCheck />
            <h2 className="text-2xl font-semibold">Dispensações registradas</h2>
          </div>

          <div className="mt-5 space-y-4">
            {trace.dispensations.length === 0 && (
              <p className="text-gray-500">Ainda não há dispensação registrada para este lote.</p>
            )}

            {trace.dispensations.map((item) => (
              <div key={item.id} className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Paciente pseudonimizado</p>
                <p className="mt-2 break-all font-mono text-xs">{item.patient_hash}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <p className="text-sm"><strong>Quantidade:</strong> {item.quantity}</p>
                  <p className="text-sm"><strong>Farmacêutico:</strong> {item.pharmacist_name}</p>
                  <p className="text-sm"><strong>Data:</strong> {new Date(item.created_at).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck />
            <h2 className="text-2xl font-semibold">Eventos blockchain</h2>
          </div>

          <div className="mt-5 space-y-4">
            {trace.blockchain.events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-gray-950 px-3 py-1 text-xs text-white">
                    Bloco #{event.block_index}
                  </span>
                  <span className="text-sm font-semibold">{event.event_type}</span>
                </div>

                <p className="mt-3 text-xs text-gray-500">Hash do bloco</p>
                <p className="mt-1 break-all font-mono text-xs">{event.block_hash}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
