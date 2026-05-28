import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Blocks,
  ClipboardList,
  MapPin,
  Package,
  Pill,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";
import { api } from "../services/api";
import Shell from "../components/Shell";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value, helper }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">{value}</h3>
          {helper && <p className="mt-2 text-xs text-gray-400">{helper}</p>}
        </div>
        <div className="rounded-2xl bg-gray-100 p-3">
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}

export default function ExecutivePage() {
  const [data, setData] = useState(null);

  async function load() {
    const response = await api.get("/dashboard/executive");
    setData(response.data);
  }

  useEffect(() => {
    load();
  }, []);

  const cards = data?.cards;

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Painel executivo
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
            Visão ampla da assistência farmacêutica.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Indicadores de estoque, lotes, farmacovigilância, dispensações,
            validade e integridade do ledger blockchain.
          </p>
        </div>

        {cards && (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Pill} label="Medicamentos" value={cards.medicines} />
            <Stat icon={Package} label="Lotes totais" value={cards.batches} />
            <Stat icon={ShieldCheck} label="Lotes ativos" value={cards.activeBatches} />
            <Stat icon={AlertTriangle} label="Lotes bloqueados" value={cards.blockedBatches} />
            <Stat icon={ClipboardList} label="Vencendo em 90 dias" value={cards.expiringBatches} />
            <Stat icon={UserRoundCheck} label="Dispensações" value={cards.dispensations} />
            <Stat icon={Activity} label="Farmacovigilância" value={cards.pharmacovigilanceReports} />
            <Stat icon={Blocks} label="Blocos blockchain" value={cards.blockchainBlocks} />
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <MapPin />
              <h2 className="text-2xl font-semibold">Distritos sanitários</h2>
            </div>

            <div className="mt-6 space-y-3">
              {data?.districts?.map((district) => (
                <div
                  key={district.district}
                  className="rounded-2xl bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{district.district}</h3>
                      <p className="text-sm text-gray-500">
                        {district.units} unidade(s) • {district.batches} lote(s)
                      </p>
                    </div>
                    <p className="text-sm font-medium text-blue-600">
                      {district.stock} un.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <ShieldCheck />
              <h2 className="text-2xl font-semibold">Integridade blockchain</h2>
            </div>

            <div className="mt-6 rounded-[1.7rem] bg-black p-6 text-white">
              <p className="text-sm text-gray-400">Status da cadeia</p>
              <h3 className="mt-2 text-3xl font-semibold">
                {data?.blockchain?.valid ? "Validada" : "Inconsistente"}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-300">
                A cadeia é verificada comparando o hash de cada bloco com o hash
                anterior. Qualquer alteração indevida quebra a sequência.
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Medicamentos mais dispensados</h3>
              <div className="mt-4 space-y-3">
                {data?.topMedicines?.map((item) => (
                  <div key={item.name} className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.total_dispensed} dispensado(s)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Shell>
  );
}
