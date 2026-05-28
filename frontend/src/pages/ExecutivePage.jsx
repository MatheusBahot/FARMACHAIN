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

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[34px] bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{label}</p>
        <Icon size={22} className="text-neutral-500" />
      </div>

      <h3 className="mt-8 text-5xl font-semibold tracking-tight">
        {value ?? "-"}
      </h3>
    </div>
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
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="apple-title text-6xl font-semibold leading-[0.95] md:text-8xl">
            Painel executivo.
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-neutral-600">
            Uma visão simples da assistência farmacêutica: estoque, lotes,
            dispensações, alertas, farmacovigilância e integridade blockchain.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Pill} label="Medicamentos" value={cards?.medicines} />
          <Stat icon={Package} label="Lotes" value={cards?.batches} />
          <Stat icon={ShieldCheck} label="Ativos" value={cards?.activeBatches} />
          <Stat icon={AlertTriangle} label="Bloqueados" value={cards?.blockedBatches} />
          <Stat icon={ClipboardList} label="Vencendo" value={cards?.expiringBatches} />
          <Stat icon={UserRoundCheck} label="Dispensações" value={cards?.dispensations} />
          <Stat icon={Activity} label="Eventos" value={cards?.pharmacovigilanceReports} />
          <Stat icon={Blocks} label="Blocos" value={cards?.blockchainBlocks} />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[42px] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin />
              <h2 className="text-3xl font-semibold tracking-tight">
                Distritos sanitários
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {data?.districts?.map((district) => (
                <div
                  key={district.district}
                  className="rounded-[24px] bg-[#f5f5f7] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{district.district}</h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {district.units} unidade(s) • {district.batches} lote(s)
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-blue-600">
                      {district.stock} un.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[42px] bg-black p-8 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck />
              <h2 className="text-3xl font-semibold tracking-tight">
                Blockchain
              </h2>
            </div>

            <h3 className="apple-title mt-12 text-6xl font-semibold">
              {data?.blockchain?.valid ? "Validada." : "Atenção."}
            </h3>

            <p className="mt-6 text-lg leading-8 text-neutral-300">
              O ledger verifica a sequência dos blocos por meio de hashes
              encadeados. Se algum registro for alterado, a cadeia deixa de ser
              válida.
            </p>

            <div className="mt-10 rounded-[28px] bg-white/10 p-6">
              <p className="text-sm text-neutral-400">
                Total de blocos verificados
              </p>

              <p className="mt-3 text-5xl font-semibold">
                {data?.blockchain?.totalBlocks ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
