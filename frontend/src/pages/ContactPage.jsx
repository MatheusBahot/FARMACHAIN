import Shell from "../components/Shell";

export default function ContactPage() {
  return (
    <Shell>
      <section className="px-6 py-24 text-center">
        <h1 className="text-6xl font-semibold tracking-[-0.06em] md:text-8xl">
          Contato.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          Projeto FarmaChain para rastreabilidade, logística farmacêutica,
          controle de estoque, QR Code, blockchain e farmacovigilância.
        </p>

        <div className="mx-auto mt-12 max-w-xl rounded-[34px] bg-white p-8 text-left shadow-sm">
          <p><strong>E-mail:</strong> contato@farmachain.local</p>
          <p className="mt-3"><strong>Local:</strong> Salvador, Bahia, Brasil</p>
          <p className="mt-3"><strong>Finalidade:</strong> demonstração acadêmica e tecnológica.</p>
        </div>
      </section>
    </Shell>
  );
}
