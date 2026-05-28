import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  ArrowLeft,
  AlertTriangle,
  Database,
  MapPin,
  Package,
  Pill,
  Printer,
  QrCode,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";
import Shell from "../components/Shell";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[34px] bg-white p-7 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <h3 className="mt-4 text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            {value ?? "-"}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#1d1d1f]">
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}

function DataBox({ label, value }) {
  return (
    <div className="rounded-[24px] bg-[#f5f5f7] p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-3 break-all font-mono text-xs leading-6 text-neutral-800">
        {value}
      </p>
    </div>
  );
}

export default function DemoPage() {
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [trace, setTrace] = useState(null);
  const [dispensation, setDispensation] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadSummary() {
    const response = await api.get("/demo/summary");
    setSummary(response.data);
  }

  async function loadBatches() {
    const response = await api.get("/batches");
    setBatches(response.data);

    if (response.data.length > 0) {
      setSelectedBatch(response.data[0]);
      await loadTrace(response.data[0].id);
    }
  }

  async function resetDemo() {
    setLoading(true);

    try {
      await api.post("/demo/reset");
      setDispensation(null);
      await loadSummary();
      await loadBatches();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Erro ao recriar a demonstração FarmaChain."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTrace(batchId) {
    const response = await api.get(`/trace/batch/${batchId}`);
    setTrace(response.data);
  }

  async function dispenseMedicine() {
    if (!selectedBatch) {
      alert("Nenhum lote selecionado para dispensação.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/dispense", {
        batchId: selectedBatch.id,
        cpf: "123.456.789-00",
        prescriptionText:
          "Receita médica: Losartana 50 mg, uso contínuo, 1 comprimido ao dia.",
        quantity: 1,
        pharmacistName: "Farmacêutico Responsável",
        pharmacistCrf: "CRF-BA 00000"
      });

      setDispensation(response.data);

      await loadSummary();
      await loadBatches();
      await loadTrace(selectedBatch.id);
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao dispensar medicamento.");
    } finally {
      setLoading(false);
    }
  }

  function printQrLabel() {
    window.print();
  }

  useEffect(() => {
    resetDemo();
  }, []);

  return (
    <Shell>
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-black"
            >
              <ArrowLeft size={18} />
              Voltar para o início
            </Link>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={resetDemo}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={18} />
                Recriar demonstração
              </button>

              <button
                onClick={dispenseMedicine}
                disabled={loading || !selectedBatch}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserRoundCheck size={18} />
                Dispensar medicamento
              </button>
            </div>
          </div>

          <div className="mb-16 text-center">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-white">
              <ShieldCheck size={30} />
            </div>

            <h1 className="apple-title mx-auto max-w-5xl text-6xl font-semibold leading-[0.95] text-[#1d1d1f] md:text-8xl">
              Dispensação em tempo real.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-xl leading-9 text-neutral-600">
              Simule a entrega de um medicamento ao paciente, veja o CPF
              criptografado, o hash pseudonimizado, o GPS da unidade, o QR Code
              do lote e o bloco registrado no ledger.
            </p>
          </div>

          {summary && (
            <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              <StatCard icon={Database} label="Unidades" value={summary.units} />
              <StatCard
                icon={Pill}
                label="Medicamentos"
                value={summary.medicines}
              />
              <StatCard icon={Package} label="Lotes" value={summary.batches} />
              <StatCard
                icon={UserRoundCheck}
                label="Dispensações"
                value={summary.dispensations}
              />
              <StatCard
                icon={ShieldCheck}
                label="Blocos"
                value={summary.ledgerBlocks}
              />
            </section>
          )}

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                Lote demonstrativo.
              </h2>

              {selectedBatch ? (
                <div className="mt-7 space-y-4 text-sm leading-6 text-neutral-700">
                  <p>
                    <strong>Medicamento:</strong>{" "}
                    {selectedBatch.medicine_name}
                  </p>

                  <p>
                    <strong>Lote:</strong> {selectedBatch.batch_number}
                  </p>

                  <p>
                    <strong>Fabricante:</strong> {selectedBatch.manufacturer}
                  </p>

                  <p>
                    <strong>Distribuidor:</strong> {selectedBatch.distributor}
                  </p>

                  <p>
                    <strong>Estoque atual:</strong>{" "}
                    {selectedBatch.quantity_current}
                  </p>

                  <p>
                    <strong>Unidade:</strong> {selectedBatch.current_unit_name}
                  </p>

                  <p>
                    <strong>Distrito:</strong> {selectedBatch.district}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        selectedBatch.status === "ACTIVE"
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-red-600"
                      }
                    >
                      {selectedBatch.status}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-neutral-500">Nenhum lote carregado.</p>
              )}
            </Card>

            <Card className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <MapPin />
                <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                  Local de retirada.
                </h2>
              </div>

              {trace?.batch ? (
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[28px] bg-[#f5f5f7] p-6">
                    <p className="text-sm text-neutral-500">Unidade</p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {trace.batch.current_unit_name}
                    </h3>

                    <p className="mt-3 leading-7 text-neutral-600">
                      {trace.batch.address}
                    </p>

                    <p className="mt-3 text-sm text-neutral-500">
                      Distrito: {trace.batch.district}
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-[#f5f5f7] p-6">
                    <p className="text-sm text-neutral-500">
                      Coordenadas GPS
                    </p>

                    <h3 className="mt-2 break-all text-xl font-semibold">
                      {trace.batch.latitude}, {trace.batch.longitude}
                    </h3>

                    <a
                      className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                      href={`https://www.google.com/maps?q=${trace.batch.latitude},${trace.batch.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir no mapa
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-neutral-500">
                  Rastreamento ainda não carregado.
                </p>
              )}
            </Card>
          </section>

          {dispensation && (
            <section className="mt-8">
              <Card>
                <div className="flex items-center gap-3">
                  <ShieldCheck />
                  <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                    Dados protegidos.
                  </h2>
                </div>

                <p className="mt-4 max-w-3xl leading-8 text-neutral-600">
                  O CPF real não é exposto diretamente na blockchain. A
                  dispensação usa hash pseudonimizado, CPF criptografado e hash
                  da receita para preservar a rastreabilidade sem abrir dados
                  sensíveis.
                </p>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <DataBox
                    label="Hash pseudonimizado do paciente"
                    value={dispensation.privacy.patientHash}
                  />

                  <DataBox
                    label="CPF criptografado"
                    value={dispensation.privacy.encryptedCpf}
                  />

                  <DataBox
                    label="Hash da receita"
                    value={dispensation.blockchainBlock.payload.prescriptionHash}
                  />

                  <DataBox
                    label="Hash do bloco"
                    value={dispensation.blockchainBlock.block_hash}
                  />
                </div>
              </Card>
            </section>
          )}

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <QrCode />
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Etiqueta QR.
                  </h2>
                </div>

                <button
                  onClick={printQrLabel}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  <Printer size={16} />
                  Imprimir
                </button>
              </div>

              {trace?.qr?.qrCodeDataUrl ? (
                <div
                  id="qr-label"
                  className="mt-7 rounded-[30px] border-2 border-dashed border-neutral-300 bg-white p-5 text-center"
                >
                  <img
                    src={trace.qr.qrCodeDataUrl}
                    alt="QR Code do lote"
                    className="mx-auto h-64 w-64"
                  />

                  <h3 className="mt-5 text-xl font-semibold">
                    {trace.batch.medicine_name}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-500">
                    Lote: {trace.batch.batch_number}
                  </p>

                  <p className="text-sm text-neutral-500">
                    Validade:{" "}
                    {new Date(trace.batch.expiration_date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>

                  <p
                    className={
                      trace.batch.status === "ACTIVE"
                        ? "mt-4 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                        : "mt-4 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
                    }
                  >
                    Status: {trace.batch.status}
                  </p>

                  <p className="mt-4 break-all text-[10px] leading-5 text-neutral-400">
                    {trace.qr.traceUrl}
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-neutral-500">
                  QR Code ainda não disponível.
                </p>
              )}
            </Card>

            <Card className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <Package />
                <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                  Histórico blockchain.
                </h2>
              </div>

              <p className="mt-4 max-w-3xl leading-8 text-neutral-600">
                Cada evento crítico do lote gera um bloco encadeado por hash.
                A sequência abaixo mostra a história logística e sanitária do
                medicamento.
              </p>

              <div className="mt-7 space-y-4">
                {trace?.blockchain?.events?.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[28px] bg-[#f5f5f7] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
                        Bloco #{event.block_index}
                      </span>

                      <span className="text-sm font-semibold text-[#1d1d1f]">
                        {event.event_type}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-xs leading-6 text-neutral-600">
                      <p>
                        <strong>Hash anterior:</strong>{" "}
                        <span className="break-all font-mono">
                          {event.previous_hash}
                        </span>
                      </p>

                      <p>
                        <strong>Hash do bloco:</strong>{" "}
                        <span className="break-all font-mono">
                          {event.block_hash}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {trace?.blockchain?.valid === true && (
                  <div className="flex items-center gap-3 rounded-[28px] bg-emerald-50 p-5 text-emerald-700">
                    <ShieldCheck size={22} />
                    <p className="font-medium">
                      Cadeia blockchain validada. Nenhum bloco foi adulterado.
                    </p>
                  </div>
                )}

                {trace?.blockchain?.valid === false && (
                  <div className="flex items-center gap-3 rounded-[28px] bg-red-50 p-5 text-red-700">
                    <AlertTriangle size={22} />
                    <p className="font-medium">
                      A cadeia apresenta inconsistência.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        </div>
      </section>
    </Shell>
  );
}
