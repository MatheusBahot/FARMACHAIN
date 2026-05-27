import {
  PackageCheck,
  ShieldCheck,
  QrCode,
  MapPin,
  Activity,
  Database,
  Truck,
  Pill,
  ClipboardCheck,
  RadioTower,
  LockKeyhole,
  FileSearch
} from "lucide-react";

export const modules = [
  {
    icon: Pill,
    title: "Medicamentos essenciais",
    description:
      "Cadastro de medicamentos vinculados à RENAME e à REMUME, com princípio ativo, concentração, forma farmacêutica e regras sanitárias."
  },
  {
    icon: PackageCheck,
    title: "Controle de lotes",
    description:
      "Rastreamento por lote, fabricante, distribuidor, validade, quantidade inicial, estoque atual e status sanitário."
  },
  {
    icon: Truck,
    title: "Logística farmacêutica",
    description:
      "Registro da jornada do medicamento desde o fornecedor até a unidade de saúde e posterior dispensação ao paciente."
  },
  {
    icon: QrCode,
    title: "QR Code imprimível",
    description:
      "Cada lote recebe uma etiqueta com QR Code para leitura rápida, conferência em campo e rastreabilidade pública controlada."
  },
  {
    icon: LockKeyhole,
    title: "CPF protegido",
    description:
      "A dispensação usa hash e criptografia para proteger os dados do paciente, evitando exposição direta de informações sensíveis."
  },
  {
    icon: MapPin,
    title: "GPS da retirada",
    description:
      "A unidade de dispensação fica associada a coordenadas geográficas para auditoria territorial e gestão por distrito sanitário."
  },
  {
    icon: Activity,
    title: "Farmacovigilância",
    description:
      "Eventos adversos podem ser relacionados ao medicamento, lote, fabricante, unidade e paciente pseudonimizado."
  },
  {
    icon: FileSearch,
    title: "Auditoria blockchain",
    description:
      "Eventos críticos geram blocos encadeados por hash, permitindo verificar integridade e histórico logístico."
  }
];

export const flowSteps = [
  {
    number: "01",
    title: "Cadastro",
    description:
      "O medicamento é registrado com dados técnicos, classe terapêutica e vínculo com listas essenciais."
  },
  {
    number: "02",
    title: "Lote",
    description:
      "O lote recebe fabricante, distribuidor, validade, quantidade e QR Code imprimível."
  },
  {
    number: "03",
    title: "Estoque",
    description:
      "A entrada na unidade é registrada com quantidade, localização, status e responsável."
  },
  {
    number: "04",
    title: "Dispensação",
    description:
      "O paciente recebe o medicamento, o estoque baixa e o CPF é protegido por criptografia."
  },
  {
    number: "05",
    title: "Rastreio",
    description:
      "A leitura do QR Code exibe toda a história logística e a validação blockchain."
  }
];

export const imagePanels = [
  {
    icon: Database,
    title: "Dados organizados",
    subtitle: "Estoque, lote, validade e distribuição em uma base única."
  },
  {
    icon: RadioTower,
    title: "Monitoramento inteligente",
    subtitle: "Alertas para vencimento, ruptura de estoque e recall sanitário."
  },
  {
    icon: ShieldCheck,
    title: "Segurança e transparência",
    subtitle: "Registros auditáveis com proteção aos dados do paciente."
  }
];
