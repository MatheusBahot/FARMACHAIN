import { useEffect, useState } from "react";
import {
  PackagePlus,
  Pill,
  Printer,
  QrCode,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { api } from "../services/api";
import Shell from "../components/Shell";

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

export default function AdminPage() {
  const [medicines, setMedicines] = useState([]);
  const [units, setUnits] = useState([]);
  const [createdBatch, setCreatedBatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const [medicineForm, setMedicineForm] = useState({
    name: "",
    activeIngredient: "",
    concentration: "",
    pharmaceuticalForm: "",
    therapeuticClass: "",
    renameItem: true,
    remumeItem: true,
    controlled: false,
    storageTemperature: "15 °C a 30 °C"
  });

  const [batchForm, setBatchForm] = useState({
    medicineId: "",
    batchNumber: "",
    manufacturer: "",
    distributor: "",
    manufacturingDate: "",
    expirationDate: "",
    quantityInitial: 100,
    currentUnitId: ""
  });

  async function loadData() {
    const [medicinesResponse, unitsResponse] = await Promise.all([
      api.get("/medicines"),
      api.get("/units")
    ]);

    setMedicines(medicinesResponse.data);
    setUnits(unitsResponse.data);

    if (medicinesResponse.data.length > 0 && !batchForm.medicineId) {
      setBatchForm((old) => ({
        ...old,
        medicineId: medicinesResponse.data[0].id
      }));
    }

    if (unitsResponse.data.length > 0 && !batchForm.currentUnitId) {
      setBatchForm((old) => ({
        ...old,
        currentUnitId: unitsResponse.data[0].id
      }));
    }
  }

  async function createMedicine(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/medicines", medicineForm);

      setMedicineForm({
        name: "",
        activeIngredient: "",
        concentration: "",
        pharmaceuticalForm: "",
        therapeuticClass: "",
        renameItem: true,
        remumeItem: true,
        controlled: false,
        storageTemperature: "15 °C a 30 °C"
      });

      await loadData();

      alert("Medicamento cadastrado com sucesso e registrado no ledger.");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao cadastrar medicamento.");
    } finally {
      setLoading(false);
    }
  }

  async function createBatch(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/batches", {
        ...batchForm,
        quantityInitial: Number(batchForm.quantityInitial)
      });

      const detail = await api.get(`/batches/${response.data.batch.id}`);

      setCreatedBatch({
        ...response.data,
        detail: detail.data
      });

      alert("Lote cadastrado, registrado na blockchain e QR Code gerado.");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao cadastrar lote.");
    } finally {
      setLoading(false);
    }
  }

  function printLabel() {
    window.print();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-blue-600">
            Cadastro e rastreabilidade
          </p>

          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            Medicamento.
            <br />
            Lote.
            <br />
            QR Code.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-neutral-600">
            Cadastre o medicamento, registre o lote, gere a etiqueta QR e use a
            página de rastreabilidade para acompanhar toda a história logística.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={createMedicine}
            className="rounded-[38px] bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Pill size={24} />
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                Novo medicamento
              </h2>
            </div>

            <div className="mt-7 grid gap-4">
              <Field label="Nome do medicamento">
                <input
                  className={inputClass()}
                  value={medicineForm.name}
                  onChange={(e) =>
                    setMedicineForm({ ...medicineForm, name: e.target.value })
                  }
                  placeholder="Ex.: Losartana Potássica 50 mg"
                  required
                />
              </Field>

              <Field label="Princípio ativo">
                <input
                  className={inputClass()}
                  value={medicineForm.activeIngredient}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      activeIngredient: e.target.value
                    })
                  }
                  placeholder="Ex.: Losartana Potássica"
                  required
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Concentração">
                  <input
                    className={inputClass()}
                    value={medicineForm.concentration}
                    onChange={(e) =>
                      setMedicineForm({
                        ...medicineForm,
                        concentration: e.target.value
                      })
                    }
                    placeholder="Ex.: 50 mg"
                    required
                  />
                </Field>

                <Field label="Forma farmacêutica">
                  <input
                    className={inputClass()}
                    value={medicineForm.pharmaceuticalForm}
                    onChange={(e) =>
                      setMedicineForm({
                        ...medicineForm,
                        pharmaceuticalForm: e.target.value
                      })
                    }
                    placeholder="Ex.: Comprimido"
                    required
                  />
                </Field>
              </div>

              <Field label="Classe terapêutica">
                <input
                  className={inputClass()}
                  value={medicineForm.therapeuticClass}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      therapeuticClass: e.target.value
                    })
                  }
                  placeholder="Ex.: Anti-hipertensivo"
                />
              </Field>

              <Field label="Condição de armazenamento">
                <input
                  className={inputClass()}
                  value={medicineForm.storageTemperature}
                  onChange={(e) =>
                    setMedicineForm({
                      ...medicineForm,
                      storageTemperature: e.target.value
                    })
                  }
                  placeholder="Ex.: 15 °C a 30 °C"
                />
              </Field>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="rounded-2xl bg-[#f5f5f7] p-4 text-[13px]">
                  <input
                    type="checkbox"
                    checked={medicineForm.renameItem}
                    onChange={(e) =>
                      setMedicineForm({
                        ...medicineForm,
                        renameItem: e.target.checked
                      })
                    }
                  />{" "}
                  RENAME
                </label>

                <label className="rounded-2xl bg-[#f5f5f7] p-4 text-[13px]">
                  <input
                    type="checkbox"
                    checked={medicineForm.remumeItem}
                    onChange={(e) =>
                      setMedicineForm({
                        ...medicineForm,
                        remumeItem: e.target.checked
                      })
                    }
                  />{" "}
                  REMUME
                </label>

                <label className="rounded-2xl bg-[#f5f5f7] p-4 text-[13px]">
                  <input
                    type="checkbox"
                    checked={medicineForm.controlled}
                    onChange={(e) =>
                      setMedicineForm({
                        ...medicineForm,
                        controlled: e.target.checked
                      })
                    }
                  />{" "}
                  Controlado
                </label>
              </div>

              <button
                disabled={loading}
                className="rounded-full bg-black px-6 py-3 text-[13px] font-medium text-white disabled:opacity-50"
              >
                Cadastrar medicamento
              </button>
            </div>
          </form>

          <form
            onSubmit={createBatch}
            className="rounded-[38px] bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PackagePlus size={24} />
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                Novo lote
              </h2>
            </div>

            <div className="mt-7 grid gap-4">
              <Field label="Medicamento">
                <select
                  className={inputClass()}
                  value={batchForm.medicineId}
                  onChange={(e) =>
                    setBatchForm({ ...batchForm, medicineId: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Unidade de destino">
                <select
                  className={inputClass()}
                  value={batchForm.currentUnitId}
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      currentUnitId: e.target.value
                    })
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} — {unit.district}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Número do lote">
                <input
                  className={inputClass()}
                  value={batchForm.batchNumber}
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      batchNumber: e.target.value
                    })
                  }
                  placeholder="Ex.: LOS-SSA-2026-B02"
                  required
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Fabricante">
                  <input
                    className={inputClass()}
                    value={batchForm.manufacturer}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        manufacturer: e.target.value
                      })
                    }
                    placeholder="Ex.: Fabricante Farma Brasil S.A."
                    required
                  />
                </Field>

                <Field label="Distribuidor">
                  <input
                    className={inputClass()}
                    value={batchForm.distributor}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        distributor: e.target.value
                      })
                    }
                    placeholder="Ex.: Distribuidora Nordeste LTDA"
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Fabricação">
                  <input
                    type="date"
                    className={inputClass()}
                    value={batchForm.manufacturingDate}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        manufacturingDate: e.target.value
                      })
                    }
                    required
                  />
                </Field>

                <Field label="Validade">
                  <input
                    type="date"
                    className={inputClass()}
                    value={batchForm.expirationDate}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        expirationDate: e.target.value
                      })
                    }
                    required
                  />
                </Field>

                <Field label="Quantidade">
                  <input
                    type="number"
                    className={inputClass()}
                    value={batchForm.quantityInitial}
                    onChange={(e) =>
                      setBatchForm({
                        ...batchForm,
                        quantityInitial: e.target.value
                      })
                    }
                    required
                  />
                </Field>
              </div>

              <button
                disabled={loading}
                className="rounded-full bg-blue-600 px-6 py-3 text-[13px] font-medium text-white disabled:opacity-50"
              >
                Cadastrar lote e gerar QR
              </button>
            </div>
          </form>
        </div>

        {createdBatch && (
          <section className="mt-8 rounded-[38px] bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <QrCode size={25} />
                  <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                    QR Code gerado.
                  </h2>
                </div>

                <p className="mt-3 max-w-2xl text-[14px] leading-7 text-neutral-600">
                  Imprima essa etiqueta e cole na embalagem. Ao escanear, a
                  página pública exibirá o histórico completo do medicamento.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={printLabel}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] text-white"
                >
                  <Printer size={16} />
                  Imprimir
                </button>

                <a
                  href={createdBatch.detail.qr.traceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[13px] text-white"
                >
                  <ExternalLink size={16} />
                  Abrir rastreio
                </a>
              </div>
            </div>

            <div
              id="qr-label"
              className="mt-7 max-w-sm rounded-[30px] border-2 border-dashed border-neutral-300 bg-white p-6 text-center"
            >
              <img
                src={createdBatch.detail.qr.qrCodeDataUrl}
                alt="QR Code do lote"
                className="mx-auto h-56 w-56"
              />

              <h3 className="mt-4 text-lg font-semibold">
                {createdBatch.detail.batch.medicine_name}
              </h3>

              <p className="mt-1 text-xs text-neutral-500">
                Lote: {createdBatch.detail.batch.batch_number}
              </p>

              <p className="text-xs text-neutral-500">
                Fabricante: {createdBatch.detail.batch.manufacturer}
              </p>

              <p className="text-xs text-neutral-500">
                Distribuidor: {createdBatch.detail.batch.distributor}
              </p>

              <p className="text-xs text-neutral-500">
                Validade:{" "}
                {new Date(
                  createdBatch.detail.batch.expiration_date
                ).toLocaleDateString("pt-BR")}
              </p>

              <p className="mt-3 rounded-full bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-700">
                Escaneie para rastrear
              </p>

              <p className="mt-3 break-all text-[10px] text-neutral-400">
                {createdBatch.detail.qr.traceUrl}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-green-50 p-4 text-[14px] text-green-700">
              <ShieldCheck size={20} />
              Lote registrado no ledger blockchain-like e QR Code pronto para
              impressão.
            </div>
          </section>
        )}
      </section>
    </Shell>
  );
}
