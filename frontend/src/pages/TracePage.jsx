import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import {
  Activity,
  Building2,
  CalendarClock,
  MapPin,
  Package,
  Pill,
  ShieldCheck,
  Thermometer,
  Truck,
  UserRoundCheck
} from "lucide-react";

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <Icon size={22} />
      <p className="mt-6 text-xs text-neutral-500">{label}</p>
      <h3 className="mt-1 break-words text-[16px] font-semibold">
        {value || "Não informado"}
      </h3>
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
    } catch (error) {
      console.error(error);
      setTrace(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrace();
  }, [batchId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <p className="text-sm text-neutral-500">
          Carregando histórico do medicamento...
        </p>
      </main>
    );
  }

  if (!trace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-5">
        <div className="rounded-[34px] bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Lote não encontrado.
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Verifique se o QR Code corresponde a um lote cadastrado.
          </p>
        </div>
      </main>
    );
  }

  const batch = trace.batch;
  const lastDispensation =
    trace.dispensations && trace.dispensations.length > 0
      ? trace.dispensations[trace.dispensations.length - 1]
      : null;

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-10 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[44px] bg-black p-10 text-center text-white md:p-16">
          <img
            src="/images/logo/farmachain-logo.png"
            alt="FarmaChain"
            className="mx-auto h-20 w-20 rounded-full object-cover"
          />

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
            Histórico rastreável
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
            {batch.medicine_name}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-neutral-300">
            Esta página foi aberta pelo QR Code da embalagem e mostra o ciclo
            logístico do medicamento, do cadastro do lote à dispensação final.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Info icon={Pill} label="Medicamento" value={batch.medicine_name} />
          <Info icon={Package} label="Lote" value={batch.batch_number} />
          <Info icon={Building2} label="Fabricante" value={batch.manufacturer} />
          <Info icon={Truck} label="Distribuidor" value={batch.distributor} />
          <Info
            icon={CalendarClock}
            label="Validade"
            value={new Date(batch.expiration_date).toLocaleDateString("pt-BR")}
          />
          <Info icon={ShieldCheck} label="Status sanitário" value={batch.status} />
          <Info icon={MapPin} label="Unidade atual" value={batch.current_unit_name} />
          <Info
            icon={Package}
            label="Estoque atual"
            value={`${batch.quantity_current} unidade(s)`}
          />
        </div>

        <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            Condições de armazenamento e localização.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-[#f5f5f7] p-5">
              <div className="flex items-center gap-2">
                <Thermometer size={20} />
                <p className="text-xs text-neutral-500">Armazenamento</p>
              </div>

              <h3 className="mt-3 font-semibold">
                {batch.storage_temperature || "15 °C a 30 °C"}
              </h3>
            </div>

            <div className="rounded-[24px] bg-[#f5f5f7] p-5">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <p className="text-xs text-neutral-500">Endereço</p>
              </div>

              <h3 className="mt-3 font-semibold">{batch.address}</h3>
              <p className="mt-2 text-xs text-neutral-500">
                Distrito: {batch.district}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f5f5f7] p-5">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <p className="text-xs text-neutral-500">GPS</p>
              </div>

              <h3 className="mt-3 font-semibold">
                {batch.latitude}, {batch.longitude}
              </h3>

              <a
                href={`https://www.google.com/maps?q=${batch.latitude},${batch.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-medium text-blue-600"
              >
                Abrir no mapa
              </a>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">
            Movimentações logísticas.
          </h2>

          <div className="mt-6 space-y-4">
            {trace.movements.length === 0 && (
              <p className="text-sm text-neutral-500">
                Nenhuma movimentação registrada.
              </p>
            )}

            {trace.movements.map((movement) => (
              <div
                key={movement.id}
                className="rounded-[24px] bg-[#f5f5f7] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{movement.movement_type}</h3>
                  <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                    {movement.quantity} unidade(s)
                  </span>
                </div>

                <p className="mt-3 text-sm text-neutral-600">
                  Responsável: {movement.responsible || "Não informado"}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Data: {new Date(movement.created_at).toLocaleString("pt-BR")}
                </p>

                {movement.notes && (
                  <p className="mt-3 text-sm text-neutral-600">
                    {movement.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {lastDispensation && (
          <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <UserRoundCheck size={24} />
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Consumidor final.
              </h2>
            </div>

            <p className="mt-3 max-w-3xl text-[14px] leading-7 text-neutral-600">
              O consumidor final aparece de forma protegida. O CPF real não é
              exibido em texto puro; o sistema apresenta hash pseudonimizado e
              CPF criptografado.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <p className="text-xs text-neutral-500">
                  Paciente pseudonimizado
                </p>
                <p className="mt-2 break-all font-mono text-xs">
                  {lastDispensation.patient_hash}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <p className="text-xs text-neutral-500">CPF criptografado</p>
                <p className="mt-2 break-all font-mono text-xs">
                  {lastDispensation.patient_encrypted_cpf}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <p className="text-xs text-neutral-500">Farmacêutico</p>
                <h3 className="mt-2 font-semibold">
                  {lastDispensation.pharmacist_name} —{" "}
                  {lastDispensation.pharmacist_crf}
                </h3>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <p className="text-xs text-neutral-500">
                  Data da dispensação
                </p>
                <h3 className="mt-2 font-semibold">
                  {new Date(lastDispensation.created_at).toLocaleString("pt-BR")}
                </h3>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5 md:col-span-2">
                <p className="text-xs text-neutral-500">Hash da receita</p>
                <p className="mt-2 break-all font-mono text-xs">
                  {lastDispensation.prescription_hash}
                </p>
              </div>
            </div>
          </section>
        )}

        {!lastDispensation && (
          <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <UserRoundCheck size={24} />
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Consumidor final.
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Este lote ainda não possui dispensação registrada. Após a
              dispensação, esta área exibirá o paciente pseudonimizado, CPF
              criptografado, farmacêutico responsável, data, GPS e hash da
              receita.
            </p>
          </section>
        )}

        <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <Activity size={24} />
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Farmacovigilância.
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {trace.pharmacovigilance.length === 0 && (
              <p className="text-sm text-neutral-500">
                Nenhum evento adverso registrado para este lote.
              </p>
            )}

            {trace.pharmacovigilance.map((event) => (
              <div key={event.id} className="rounded-[24px] bg-[#f5f5f7] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">Evento adverso</h3>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                    {event.severity}
                  </span>
                </div>

                <p className="mt-3 text-sm text-neutral-600">
                  {event.event_description}
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Status: {event.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[34px] bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} />
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Blockchain do medicamento.
            </h2>
          </div>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Cada evento crítico gera um bloco encadeado por hash. A validade da
            cadeia é verificada comparando o hash atual com o hash anterior.
          </p>

          <div className="mt-6 rounded-[24px] bg-black p-5 text-white">
            <p className="text-xs text-neutral-400">Status da cadeia</p>
            <h3 className="mt-2 text-3xl font-semibold">
              {trace.blockchain.valid ? "Validada" : "Inconsistente"}
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {trace.blockchain.events.map((event) => (
              <div key={event.id} className="rounded-[24px] bg-[#f5f5f7] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                    Bloco #{event.block_index}
                  </span>

                  <span className="text-sm font-semibold">
                    {event.event_type}
                  </span>
                </div>

                <p className="mt-4 text-xs text-neutral-500">Hash anterior</p>
                <p className="mt-1 break-all font-mono text-xs">
                  {event.previous_hash}
                </p>

                <p className="mt-4 text-xs text-neutral-500">Hash do bloco</p>
                <p className="mt-1 break-all font-mono text-xs">
                  {event.block_hash}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
