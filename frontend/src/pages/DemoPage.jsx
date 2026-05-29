import { useEffect, useState } from "react";
import {
  LockKeyhole,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";
import Shell from "../components/Shell";
import { api } from "../services/api";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-neutral-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function inputClass() {
  return "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
}

export default function DemoPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [trace, setTrace] = useState(null);
  const [dispensation, setDispensation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patientName: "Maria de Souza Santos",
    cpf: "123.456.789-00",
    susCard: "898 0012 3456 7890",
    prescriptionText:
      "Receita médica: Losartana Potássica 50 mg, uso contínuo, 1 comprimido ao dia por 30 dias.",
    quantity: 1,
    pharmacistName: "Farmacêutico Responsável",
    pharmacistCrf: "CRF-BA 00000",
    theoreticalConsumption: [
      {
        medicine: "Losartana Potássica 50 mg",
        dosage: "1 comprimido ao dia",
        estimatedMonthlyConsumption: 30,
        treatment: "Uso contínuo"
      }
    ]
  });

  async function loadBatches() {
    const response = await api.get("/batches");
    setBatches(response.data);

    if (response.data.length > 0 && !selectedBatchId) {
      setSelectedBatchId(response.data[0].id);
      await loadTrace(response.data[0].id);
    }
  }

  async function loadTrace(batchId) {
    if (!batchId) return;

    const response = await api.get(`/trace/batch/${batchId}`);
    setTrace(response.data);
  }

  async function dispenseMedicine(event) {
    event.preventDefault();

    if (!selectedBatchId) {
      alert("Cadastre ou selecione um lote primeiro.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/dispense", {
        batchId: selectedBatchId,
        ...form,
        quantity: Number(form.quantity)
      });

      setDispensation(response.data);
      await loadBatches();
      await loadTrace(selectedBatchId);

      alert("Dispensação registrada e vinculada ao paciente.");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao dispensar medicamento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatches();
  }, []);

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-blue-600">
            Dispensação robusta
          </p>

          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            Produto.
            <br />
            Paciente.
            <br />
            Blockchain.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-neutral-600">
            Vincule o medicamento ao consumidor final usando nome, CPF, Cartão
            SUS, consumo teórico, farmacêutico responsável, GPS e registro no
            ledger.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={dispenseMedicine}
            className="rounded-[38px] bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <UserRoundCheck size={25} />
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Dados da dispensação
              </h2>
            </div>

            <div className="mt-7 grid gap-4">
              <Field label="Lote do medicamento">
                <select
                  className={inputClass()}
                  value={selectedBatchId}
                  onChange={async (e) => {
                    setSelectedBatchId(e.target.value);
                    await loadTrace(e.target.value);
                    setDispensation(null);
                  }}
                  required
                >
                  <option value="">Selecione um lote</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.medicine_name} — {batch.batch_number}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Nome do paciente">
                <input
                  className={inputClass()}
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  required
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CPF">
                  <input
                    className={inputClass()}
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    required
                  />
                </Field>

                <Field label="Cartão SUS">
                  <input
                    className={inputClass()}
                    value={form.susCard}
                    onChange={(e) =>
                      setForm({ ...form, susCard: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="Receita / prescrição">
                <textarea
                  className={`${inputClass()} min-h-28`}
                  value={form.prescriptionText}
                  onChange={(e) =>
                    setForm({ ...form, prescriptionText: e.target.value })
                  }
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Quantidade">
                  <input
                    type="number"
                    className={inputClass()}
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field label="Farmacêutico">
                  <input
                    className={inputClass()}
                    value={form.pharmacistName}
                    onChange={(e) =>
                      setForm({ ...form, pharmacistName: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field label="CRF">
                  <input
                    className={inputClass()}
                    value={form.pharmacistCrf}
                    onChange={(e) =>
                      setForm({ ...form, pharmacistCrf: e.target.value })
                    }
                    required
                  />
                </Field>
              </div>

              <button
                disabled={loading}
                className="rounded-full bg-blue-600 px-6 py-3 text-[13px] font-medium text-white disabled:opacity-50"
              >
                Dispensar e vincular ao paciente
              </button>
            </div>
          </form>

          <div className="rounded-[38px] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Package size={25} />
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Medicamento selecionado
              </h2>
            </div>

            {trace?.batch ? (
              <div className="mt-7 space-y-4 text-[14px]">
                <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                  <p className="text-xs text-neutral-500">Medicamento</p>
                  <h3 className="mt-1 text-xl font-semibold">
                    {trace.batch.medicine_name}
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                    <p className="text-xs text-neutral-500">Lote</p>
                    <h3 className="mt-1 font-semibold">{trace.batch.batch_number}</h3>
                  </div>

                  <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                    <p className="text-xs text-neutral-500">Estoque</p>
                    <h3 className="mt-1 font-semibold">
                      {trace.batch.quantity_current} unidade(s)
                    </h3>
                  </div>

                  <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                    <p className="text-xs text-neutral-500">Fabricante</p>
                    <h3 className="mt-1 font-semibold">{trace.batch.manufacturer}</h3>
                  </div>

                  <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                    <p className="text-xs text-neutral-500">Distribuidor</p>
                    <h3 className="mt-1 font-semibold">{trace.batch.distributor}</h3>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <p className="text-xs text-neutral-500">GPS da retirada</p>
                  </div>

                  <h3 className="mt-2 font-semibold">
                    {trace.batch.current_unit_name}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    {trace.batch.latitude}, {trace.batch.longitude}
                  </p>
                </div>

                {trace?.qr?.traceUrl && (
                  <a
                    href={trace.qr.traceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] text-white"
                  >
                    <QrCode size={16} />
                    Abrir histórico via QR
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-7 text-sm text-neutral-500">
                Nenhum lote carregado. Cadastre um lote primeiro.
              </p>
            )}
          </div>
        </div>

        {dispensation && (
          <section className="mt-8 rounded-[38px] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck size={25} />
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                Produto vinculado ao paciente.
              </h2>
            </div>

            <p className="mt-3 max-w-3xl text-[14px] leading-7 text-neutral-600">
              A dispensação foi registrada no ledger. O produto agora está
              vinculado ao paciente por hash, com CPF e Cartão SUS
              criptografados.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <div className="flex items-center gap-2">
                  <LockKeyhole size={18} />
                  <p className="text-xs text-neutral-500">Hash do paciente</p>
                </div>

                <p className="mt-2 break-all font-mono text-xs">
                  {dispensation.patient.patientHash}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5">
                <div className="flex items-center gap-2">
                  <LockKeyhole size={18} />
                  <p className="text-xs text-neutral-500">CPF criptografado</p>
                </div>

                <p className="mt-2 break-all font-mono text-xs">
                  {dispensation.patient.encryptedCpf}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#f5f5f7] p-5 md:col-span-2">
                <p className="text-xs text-neutral-500">
                  Consumo teórico informado
                </p>

                <pre className="mt-2 overflow-auto rounded-2xl bg-white p-4 text-xs">
                  {JSON.stringify(
                    dispensation.patient.theoreticalConsumption,
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="rounded-[24px] bg-black p-5 text-white md:col-span-2">
                <p className="text-xs text-neutral-400">Hash do bloco</p>
                <p className="mt-2 break-all font-mono text-xs">
                  {dispensation.blockchainBlock.block_hash}
                </p>
              </div>
            </div>
          </section>
        )}
      </section>
    </Shell>
  );
}
