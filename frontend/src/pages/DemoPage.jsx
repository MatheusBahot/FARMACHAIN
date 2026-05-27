import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import {
  ShieldCheck,
  Package,
  QrCode,
  MapPin,
  UserRoundCheck,
  Database,
  RefreshCw,
  Pill,
  AlertTriangle,
  Printer,
  ArrowLeft
} from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="mt-2 text-3xl font-semibold">{value}</h3>
        </div>
        <div className="rounded-2xl bg-gray-100 p-3">
          <Icon size={26} />
        </div>
      </div>
    </Card>
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
    } finally {
      setLoading(false);
    }
  }

  async function loadTrace(batchId) {
    const response = await api.get(`/trace/batch/${batchId}`);
    setTrace(response.data);
  }

  async function dispenseMedicine() {
    if (!selectedBatch) return;

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
    <main className="min-h-screen bg-[#f5f7fb]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
            <ArrowLeft size={18} />
            Voltar para apresentação
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetDemo}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-white transition hover:bg-gray-800"
            >
              <RefreshCw size={18} />
              Recriar demonstração
            </button>

            <button
              onClick={dispenseMedicine}
              disabled={loading || !selectedBatch}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <UserRoundCheck size={18} />
              Dispensar medicamento
            </button>
          </div>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-sm text-white">
            <ShieldCheck size={16} />
            Demonstração operacional
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-gray-950">
            Dispensação, CPF criptografado, GPS e QR Code do lote.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
            Este painel simula a rotina real do FarmaChain: um lote é cadastrado,
            recebe QR Code, é armazenado na UBS, dispensado ao paciente e registrado
            no ledger blockchain.
          </p>
        </div>

        {summary && (
          <section className="grid gap-4 md:grid-cols-5">
            <StatCard icon={Database} label="Unidades" value={summary.units} />
            <StatCard icon={Pill} label="Medicamentos" value={summary.medicines} />
            <StatCard icon={Package} label="Lotes" value={summary.batches} />
            <StatCard icon={UserRoundCheck} label="Dispensações" value={summary.dispensations} />
            <StatCard icon={ShieldCheck} label="Blocos" value={summary.ledgerBlocks} />
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <h2 className="text-xl font-semibold">Lote demonstrativo</h2>

            {selectedBatch ? (
              <div className="mt-5 space-y-3 text-sm">
                <p><strong>Medicamento:</strong> {selectedBatch.medicine_name}</p>
                <p><strong>Lote:</strong> {selectedBatch.batch_number}</p>
                <p><strong>Fabricante:</strong> {selectedBatch.manufacturer}</p>
                <p><strong>Distribuidor:</strong> {selectedBatch.distributor}</p>
                <p><strong>Estoque atual:</strong> {selectedBatch.quantity_current}</p>
                <p><strong>Unidade:</strong> {selectedBatch.current_unit_name}</p>
                <p><strong>Distrito:</strong> {selectedBatch.district}</p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">Nenhum lote carregado.</p>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <MapPin />
              <h2 className="text-xl font-semibold">Local de retirada baseado em GPS</h2>
            </div>

            {trace?.batch ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Unidade</p>
                  <h3 className="mt-1 font-semibold">{trace.batch.current_unit_name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{trace.batch.address}</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Coordenadas</p>
                  <h3 className="mt-1 font-semibold">
                    {trace.batch.latitude}, {trace.batch.longitude}
                  </h3>
                  <a
                    className="mt-3 inline-block text-sm font-medium text-blue-600"
                    href={`https://www.google.com/maps?q=${trace.batch.latitude},${trace.batch.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir no mapa
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">Rastreamento ainda não carregado.</p>
            )}
          </Card>
        </section>

        {dispensation && (
          <section className="mt-8">
            <Card>
              <div className="flex items-center gap-3">
                <ShieldCheck />
                <h2 className="text-xl font-semibold">Dispensação com dados protegidos</h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Hash pseudonimizado do paciente</p>
                  <p className="mt-2 break-all font-mono text-xs">
                    {dispensation.privacy.patientHash}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">CPF criptografado</p>
                  <p className="mt-2 break-all font-mono text-xs">
                    {dispensation.privacy.encryptedCpf}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Hash da receita</p>
                  <p className="mt-2 break-all font-mono text-xs">
                    {dispensation.blockchainBlock.payload.prescriptionHash}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Hash do bloco</p>
                  <p className="mt-2 break-all font-mono text-xs">
                    {dispensation.blockchainBlock.block_hash}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <QrCode />
                <h2 className="text-xl font-semibold">Etiqueta QR imprimível</h2>
              </div>

              <button
                onClick={printQrLabel}
                className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-sm text-white"
              >
                <Printer size={16} />
                Imprimir
              </button>
            </div>

            {trace?.qr?.qrCodeDataUrl ? (
              <div id="qr-label" className="mt-5 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-5 text-center">
                <img
                  src={trace.qr.qrCodeDataUrl}
                  alt="QR Code do lote"
                  className="mx-auto h-64 w-64"
                />
                <h3 className="mt-4 text-lg font-semibold">
                  {trace.batch.medicine_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Lote: {trace.batch.batch_number}
                </p>
                <p className="text-sm text-gray-500">
                  Validade: {new Date(trace.batch.expiration_date).toLocaleDateString("pt-BR")}
                </p>
                <p className="mt-3 break-all text-[10px] text-gray-400">
                  {trace.qr.traceUrl}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">QR Code ainda não disponível.</p>
            )}
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Package />
              <h2 className="text-xl font-semibold">Histórico logístico blockchain</h2>
            </div>

            <div className="mt-5 space-y-4">
              {trace?.blockchain?.events?.map((event) => (
                <div key={event.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-gray-950 px-3 py-1 text-xs text-white">
                      Bloco #{event.block_index}
                    </span>
                    <span className="text-sm font-medium">{event.event_type}</span>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-gray-600">
                    <p>
                      <strong>Hash anterior:</strong>{" "}
                      <span className="break-all font-mono">{event.previous_hash}</span>
                    </p>
                    <p>
                      <strong>Hash do bloco:</strong>{" "}
                      <span className="break-all font-mono">{event.block_hash}</span>
                    </p>
                  </div>
                </div>
              ))}

              {trace?.blockchain?.valid === true && (
                <div className="flex items-center gap-2 rounded-2xl bg-green-50 p-4 text-green-700">
                  <ShieldCheck size={20} />
                  Cadeia blockchain validada: nenhum bloco foi adulterado.
                </div>
              )}

              {trace?.blockchain?.valid === false && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-red-700">
                  <AlertTriangle size={20} />
                  A cadeia apresenta inconsistência.
                </div>
              )}
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}
