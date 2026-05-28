import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { api } from "../services/api";
import Shell from "../components/Shell";

function inputClass() {
  return "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
}

export default function PharmacovigilancePage() {
  const [batches, setBatches] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    batchId: "",
    severity: "MODERATE",
    eventDescription: ""
  });

  async function load() {
    const [batchesResponse, reportsResponse] = await Promise.all([
      api.get("/batches"),
      api.get("/pharmacovigilance")
    ]);

    setBatches(batchesResponse.data);
    setReports(reportsResponse.data);

    if (batchesResponse.data[0]) {
      setForm((old) => ({
        ...old,
        batchId: batchesResponse.data[0].id
      }));
    }
  }

  async function submit(event) {
    event.preventDefault();

    await api.post("/pharmacovigilance", form);

    setForm({
      batchId: batches[0]?.id || "",
      severity: "MODERATE",
      eventDescription: ""
    });

    await load();

    alert("Evento de farmacovigilância registrado no ledger.");
  }

  async function blockBatch(batchId) {
    const reason = prompt("Motivo do bloqueio sanitário do lote:");

    if (!reason) return;

    await api.post(`/recall/block/${batchId}`, {
      reason,
      responsible: "Gestor de Farmacovigilância"
    });

    await load();

    alert("Lote bloqueado e evento registrado na blockchain.");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Farmacovigilância
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
            Eventos adversos ligados ao lote.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Registre suspeitas de reações adversas, relacione-as ao lote e,
            quando necessário, bloqueie o lote para investigação sanitária.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={submit}
            className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Activity />
              <h2 className="text-2xl font-semibold">Novo evento adverso</h2>
            </div>

            <div className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-medium text-gray-700">Lote</span>
                <select
                  className={`${inputClass()} mt-2`}
                  value={form.batchId}
                  onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                  required
                >
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.medicine_name} — {batch.batch_number}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-medium text-gray-700">Gravidade</span>
                <select
                  className={`${inputClass()} mt-2`}
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                >
                  <option value="MILD">Leve</option>
                  <option value="MODERATE">Moderada</option>
                  <option value="SEVERE">Grave</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-medium text-gray-700">Descrição</span>
                <textarea
                  className={`${inputClass()} mt-2 min-h-36`}
                  value={form.eventDescription}
                  onChange={(e) => setForm({ ...form, eventDescription: e.target.value })}
                  placeholder="Descreva a suspeita de reação adversa..."
                  required
                />
              </label>

              <button className="rounded-full bg-black px-6 py-4 font-medium text-white">
                Registrar evento
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle />
              <h2 className="text-2xl font-semibold">Ação sanitária</h2>
            </div>

            <p className="mt-4 leading-7 text-gray-600">
              Caso um lote apresente eventos graves ou repetidos, o gestor pode
              bloquear o lote. O QR Code passará a indicar o status bloqueado
              na rastreabilidade pública.
            </p>

            <div className="mt-6 space-y-3">
              {batches.map((batch) => (
                <div key={batch.id} className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{batch.medicine_name}</h3>
                      <p className="text-sm text-gray-500">
                        {batch.batch_number} • Status: {batch.status}
                      </p>
                    </div>

                    <button
                      onClick={() => blockBatch(batch.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      Bloquear lote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck />
            <h2 className="text-2xl font-semibold">Notificações registradas</h2>
          </div>

          <div className="mt-6 space-y-4">
            {reports.length === 0 && (
              <p className="text-gray-500">Nenhuma notificação registrada.</p>
            )}

            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl bg-gray-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{report.medicine_name}</h3>
                    <p className="text-sm text-gray-500">
                      Lote {report.batch_number} • Gravidade {report.severity}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {report.status}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-gray-700">
                  {report.event_description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
