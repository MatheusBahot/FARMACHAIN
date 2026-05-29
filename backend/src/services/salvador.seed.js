const districts = [
  ["Centro Histórico", "Rua do Carro, 72, Nazaré", -12.9777, -38.5108],
  ["Itapagipe", "Rua Henrique Dias, 249, Bonfim", -12.9237, -38.5082],
  ["São Caetano/Valéria", "Rua Amparo São Francisco, São Caetano", -12.9409, -38.4824],
  ["Liberdade", "Rua Conde de Porto Alegre, IAPI", -12.9506, -38.4915],
  ["Brotas", "Largo das Sete Portas, Barbalho", -12.9755, -38.4934],
  ["Barra/Rio Vermelho", "Av. Centenário, Complexo Garcia", -13.0016, -38.5174],
  ["Boca do Rio", "Rua Brasília, Guilherme Marback, Imbuí", -12.9863, -38.4384],
  ["Itapuã", "Rua A, Caminho 02, Mussurunga", -12.9433, -38.3636],
  ["Cabula/Beiru", "Rua Jurucutus, Saboeiro", -12.9566, -38.4375],
  ["Pau da Lima", "Rua Antônio Ribeiro, Vale dos Lagos", -12.9369, -38.4339],
  ["Subúrbio Ferroviário", "Rua José Pires Castelo Branco, Praia Grande", -12.8772, -38.4724],
  ["Cajazeiras", "Rua Endeu Nascimento, Cajazeiras III", -12.9022, -38.4051]
];

const units = [
  ["CAF Salvador - Central de Abastecimento Farmacêutico", "CAF", "Centro Histórico", "Rua da Grécia, 3, Comércio", -12.9718, -38.5126],

  ["UBS 19º Centro de Saúde Pelourinho", "UBS", "Centro Histórico", "Avenida JJ Seabra, 147, Baixa dos Sapateiros", -12.9748, -38.5079],
  ["USF Dona Iraci Isabel da Silva - Gamboa", "USF", "Centro Histórico", "Rua Gabriel Soares, 58, Aflitos", -12.9851, -38.5226],

  ["UBS Clementino Fraga", "UBS", "Barra/Rio Vermelho", "Av. Centenário, Complexo Municipal Centenário", -13.0016, -38.5174],
  ["USF Lealdina Barros - Vale da Muriçoca", "USF", "Barra/Rio Vermelho", "Rua Sérgio de Carvalho, Engenho Velho da Federação", -12.9998, -38.5099],
  ["USF Ivone Silveira - Calabar", "USF", "Barra/Rio Vermelho", "Rua Maria Pinho, Calabar", -13.0004, -38.5154],

  ["UBS Barbalho", "UBS", "Brotas", "Rua Dr. Péricles Esteves Cardoso, Barbalho", -12.9667, -38.4978],
  ["USF Candeal Pequeno", "USF", "Brotas", "Rua 18 de Agosto, Candeal Pequeno", -12.9959, -38.4875],
  ["USF Vale do Matatu", "USF", "Brotas", "Rua Edson Saldanha, Vale do Matatu", -12.9884, -38.4935],

  ["UBS Arenoso", "UBS", "Cabula/Beiru", "Rua Direta do Arenoso, 100", -12.9481, -38.4288],
  ["UBS Barreiras", "UBS", "Cabula/Beiru", "Estrada das Barreiras, Cabula", -12.9536, -38.4508],
  ["USF Sussuarana", "USF", "Cabula/Beiru", "Av. Ulisses Guimarães, Sussuarana", -12.9318, -38.4296],

  ["USF Imbuí", "USF", "Boca do Rio", "Rua Professor Jairo Simões, Bate Facho", -12.9755, -38.4399],
  ["USF Parque de Pituaçu", "USF", "Boca do Rio", "Rua Araújo Bastos, Pituaçu", -12.9687, -38.4192],

  ["USF Itapuã", "USF", "Itapuã", "Rua da Ilha, Itapuã", -12.9502, -38.3617],
  ["USF Mussurunga I", "USF", "Itapuã", "Setor E, Caminho 16, Mussurunga", -12.9338, -38.3668],
  ["USF KM 17", "USF", "Itapuã", "Rua Edmundo Espínola, KM 17", -12.9238, -38.3486],

  ["USF Liberdade", "USF", "Liberdade", "Estrada da Liberdade, 175", -12.9513, -38.4958],
  ["USF IAPI", "USF", "Liberdade", "Rua Dalmiro São Pedro, Jardim Eldorado", -12.9489, -38.4867],

  ["USF San Martin", "USF", "São Caetano/Valéria", "Avenida San Martin, Fazenda Grande do Retiro", -12.9345, -38.4752],
  ["USF Jaqueira do Carneiro", "USF", "São Caetano/Valéria", "Fazenda Grande do Retiro", -12.9398, -38.4781],
  ["USF Lagoa da Paixão", "USF", "São Caetano/Valéria", "Nova Brasília de Valéria", -12.8642, -38.4327],

  ["USF Canabrava", "USF", "Pau da Lima", "Rua Bem Te Vi, Canabrava", -12.9297, -38.4257],
  ["USF São Marcos", "USF", "Pau da Lima", "São Marcos", -12.9288, -38.4163],

  ["USF Plataforma", "USF", "Subúrbio Ferroviário", "Rua Formosa, Plataforma", -12.9031, -38.4742],
  ["USF Rio Sena", "USF", "Subúrbio Ferroviário", "Rio Sena", -12.8861, -38.4735],
  ["USF Colinas de Periperi", "USF", "Subúrbio Ferroviário", "Rua do Roxinho, Periperi", -12.8668, -38.4809],

  ["UBS Castelo Branco", "UBS", "Cajazeiras", "Rua A, 3ª Etapa, Castelo Branco", -12.9124, -38.4223],
  ["USF Fazenda Grande III", "USF", "Cajazeiras", "Rua Demerval de Souza Gusmão, Cajazeiras", -12.8998, -38.4149],
  ["USF Cajazeiras V", "USF", "Cajazeiras", "Cajazeiras V", -12.9008, -38.4076],

  ["USF Joanes Leste", "USF", "Itapagipe", "Conjunto Joanes Leste, Lobato", -12.9132, -38.4857],
  ["USF Joanes Centro Oeste", "USF", "Itapagipe", "Conjunto Joanes Centro Oeste, Lobato", -12.9144, -38.4876],
  ["USF Fiais", "USF", "Itapagipe", "Santa Luzia do Lobato", -12.9157, -38.4938]
];

const theoreticalMedicines = [
  {
    name: "Losartana Potássica 50 mg",
    activeIngredient: "Losartana Potássica",
    concentration: "50 mg",
    pharmaceuticalForm: "Comprimido",
    therapeuticClass: "Anti-hipertensivo",
    storageTemperature: "15 °C a 30 °C"
  },
  {
    name: "Metformina 850 mg",
    activeIngredient: "Cloridrato de Metformina",
    concentration: "850 mg",
    pharmaceuticalForm: "Comprimido",
    therapeuticClass: "Antidiabético",
    storageTemperature: "15 °C a 30 °C"
  },
  {
    name: "Dipirona 500 mg/mL",
    activeIngredient: "Dipirona Monoidratada",
    concentration: "500 mg/mL",
    pharmaceuticalForm: "Solução oral",
    therapeuticClass: "Analgésico e antitérmico",
    storageTemperature: "15 °C a 30 °C"
  }
];

module.exports = {
  districts,
  units,
  theoreticalMedicines
};
