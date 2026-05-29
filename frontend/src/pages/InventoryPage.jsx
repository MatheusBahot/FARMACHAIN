import { useEffect, useState } from "react";
import {
  Building2,
  Boxes,
  MapPin,
  Package,
  Pill,
  Warehouse
} from "lucide-react";
import Shell from "../components/Shell";
import { api } from "../services/api";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[30px] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-neutral-500">{label}</p>
        <Icon size={21} />
      </div>
      <h3 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">
        {value}
      </h3>
    </div>
  );
}

export default function InventoryPage() {
  const [caf, setCaf] = useState([]);
  const [districts, setDistricts] = useState([]);

  async function loadInventory() {
    const [cafResponse, districtsResponse] = await Promise.all([
      api.get("/inventory/caf"),
      api.get("/inventory/districts")
    ]);

    setCaf(cafResponse.data);
    setDistricts(districtsResponse.data);
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const totalCaf = caf.reduce(
    (sum, item) => sum + Number(item.current_quantity || 0),
    0
  );

  const totalDistrictUnits = districts.reduce(
    (sum, district) => sum + district.units.length,
    0
  );

  const totalDistrictStock = districts.reduce((sum, district) => {
    return (
      sum +
      district.units.reduce((unitSum, unit) => {
        return (
          unitSum +
          unit.inventory.reduce(
            (itemSum, item) => itemSum + Number(item.currentQuantity || 0),
            0
          )
        );
      }, 0)
    );
  }, 0);

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-blue-600">
            Inventário FarmaChain
          </p>

          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            CAF.
            <br />
            UBS.
            <br />
            Distritos sanitários.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-neutral-600">
            Inventário teórico da Central de Abastecimento Farmacêutico e das
            unidades básicas de saúde distribuídas pelos 12 distritos sanitários
            de Salvador.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Stat icon={Warehouse} label="Estoque teórico da CAF" value={totalCaf} />
          <Stat icon={Building2} label="Unidades UBS/USF" value={totalDistrictUnits} />
          <Stat icon={Boxes} label="Estoque teórico UBS" value={totalDistrictStock} />
        </div>

        <section className="mt-8 rounded-[38px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Warehouse size={25} />
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Inventário da CAF
            </h2>
          </div>

          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-neutral-600">
            A CAF funciona como centro de abastecimento e distribuição teórica
            do projeto, concentrando medicamentos antes da redistribuição para
            UBS e USF.
          </p>

          <div className="mt-7 overflow-hidden rounded-[26px] border border-neutral-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#f5f5f7] text-neutral-500">
                <tr>
                  <th className="px-5 py-4">Medicamento</th>
                  <th className="px-5 py-4">Princípio ativo</th>
                  <th className="px-5 py-4">Quantidade</th>
                  <th className="px-5 py-4">Mínimo</th>
                  <th className="px-5 py-4">Máximo</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {caf.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-100">
                    <td className="px-5 py-4 font-medium">{item.medicine_name}</td>
                    <td className="px-5 py-4 text-neutral-600">{item.active_ingredient}</td>
                    <td className="px-5 py-4">{item.current_quantity}</td>
                    <td className="px-5 py-4">{item.minimum_quantity}</td>
                    <td className="px-5 py-4">{item.maximum_quantity}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex items-center gap-3">
            <MapPin size={25} />
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Inventário teórico por distrito
            </h2>
          </div>

          <div className="grid gap-6">
            {districts.map((district) => (
              <div
                key={district.districtId}
                className="rounded-[38px] bg-white p-8 shadow-sm"
              >
                <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                  {district.districtName}
                </h3>

                <p className="mt-2 text-[13px] text-neutral-500">
                  {district.units.length} unidade(s) cadastrada(s)
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {district.units.map((unit) => (
                    <div
                      key={unit.unitId}
                      className="rounded-[28px] bg-[#f5f5f7] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">{unit.unitName}</h4>
                          <p className="mt-1 text-xs text-neutral-500">
                            {unit.unitType}
                          </p>
                        </div>

                        <Building2 size={20} />
                      </div>

                      <div className="mt-5 space-y-3">
                        {unit.inventory.map((item) => (
                          <div
                            key={item.inventoryId}
                            className="rounded-[20px] bg-white p-4"
                          >
                            <div className="flex items-center gap-2">
                              <Pill size={16} />
                              <p className="text-[13px] font-medium">
                                {item.medicineName}
                              </p>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-neutral-500">
                              <p>Teórico: {item.theoreticalQuantity}</p>
                              <p>Atual: {item.currentQuantity}</p>
                              <p>Mín.: {item.minimumQuantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </Shell>
  );
}
