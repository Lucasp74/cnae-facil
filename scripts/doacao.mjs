// Atualiza a barra de doações (assets/apoio.svg) e o valor no README.
//
//   node scripts/doacao.mjs 350          -> define o total arrecadado à mão
//   node scripts/doacao.mjs --mercadopago -> soma as doações pelo link do Mercado Pago (precisa da
//                                            variável MP_ACCESS_TOKEN) e as de dados/doacoes-manuais.json
//   node scripts/doacao.mjs --teste      -> confere os cálculos
import { readFileSync, writeFileSync } from "node:fs";

const META = 5000;
const INICIO = "2026-11-12T00:00:00.000-03:00"; // lançamento: pagamentos antes disso não contam
const raiz = new URL("..", import.meta.url);

export const reais = v => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v).replace(/\s/g, " ");
export const porcentagem = v => Math.min(100, Math.floor((v / META) * 100));

export function svg(total) {
  const pct = porcentagem(total);
  const largura = Math.round((600 * Math.min(total, META)) / META);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="170" viewBox="0 0 720 170" role="img" aria-label="Apoie o projeto: ${reais(total)} de ${reais(META)} (${pct}%)">
  <!-- Gerado por scripts/doacao.mjs; não edite à mão. -->
  <rect width="720" height="170" rx="16" fill="#0f2a24"/>
  <rect x="24" y="24" width="4" height="122" rx="2" fill="#9be38a"/>
  <g font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">
    <text x="48" y="60" fill="#ffffff" font-size="26" font-weight="700">Apoie o CNAE Fácil</text>
    <text x="48" y="88" fill="#d6e5df" font-size="15">Seu apoio mantém os dados atualizados e paga a revisão por contador.</text>
    <text x="48" y="122" fill="#ffffff" font-size="18" font-weight="700">${reais(total)} / ${reais(META)}</text>
    <text x="648" y="122" fill="#9be38a" font-size="16" font-weight="700" text-anchor="end">${pct}%</text>
  </g>
  <rect x="48" y="134" width="600" height="12" rx="6" fill="#2b4740"/>
  <rect x="48" y="134" width="${largura}" height="12" rx="6" fill="#9be38a"/>
</svg>
`;
}

// Troca "R$ X de R$ 5.000,00 (Y%)" no README, no alerta e no texto alternativo da imagem.
export const atualizaReadme = (texto, total) =>
  texto.replace(/R\$ [\d.]+,\d{2} de R\$ [\d.]+,\d{2} \(\d+%\)/g, `${reais(total)} de ${reais(META)} (${porcentagem(total)}%)`);

async function totalMercadoPago() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN não definido");
  const pagamentos = [];
  for (let offset = 0; ; offset += 100) {
    const url = new URL("https://api.mercadopago.com/v1/payments/search");
    Object.entries({ sort: "date_created", criteria: "desc", range: "date_created", begin_date: INICIO, end_date: "NOW", limit: 100, offset })
      .forEach(([k, v]) => url.searchParams.set(k, v));
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`Mercado Pago respondeu ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const { results, paging } = await r.json();
    pagamentos.push(...results);
    if (offset + 100 >= paging.total) break;
  }
  const aprovados = pagamentos.filter(p => p.status === "approved");
  const doacoes = aprovados.filter(ehDoacao);
  // O repositório e o log da Action são públicos, e a conta recebe outros pagamentos:
  // nunca mostre valores ou dados de pagamentos que não são doações.
  console.log(`Pagamentos aprovados na conta desde ${INICIO}: ${aprovados.length}. Doações identificadas: ${doacoes.length}.`);
  for (const p of doacoes) console.log(`- ${p.date_approved?.slice(0, 10)} ${reais(p.transaction_amount)} ${p.payment_method_id}`);
  // Diagnóstico do teste de R$ 1: mostra só os campos que podem identificar o link de doação.
  for (const p of aprovados.filter(p => p.transaction_amount === 1)) {
    console.log("Teste R$ 1:", JSON.stringify({
      description: p.description, external_reference: p.external_reference, operation_type: p.operation_type,
      payment_method_id: p.payment_method_id, poi: p.point_of_interaction?.type, poi_sub: p.point_of_interaction?.sub_type,
      item: p.additional_info?.items?.[0]?.title, metadata: Object.keys(p.metadata || {}),
    }));
  }
  return doacoes.reduce((s, p) => s + p.transaction_amount, 0);
}

// Como reconhecer um pagamento feito pelo link de doação. Será definido depois do teste de R$ 1;
// até lá nenhum pagamento da API é contado, para não somar outras vendas da conta.
const ehDoacao = p => false;

// Pix feitos direto para a chave não têm como ser separados das outras vendas pela API.
// Eles entram à mão em dados/doacoes-manuais.json.
const manuais = () => ler("dados/doacoes-manuais.json").doacoes.reduce((s, d) => s + d.valor, 0);
const ler = p => JSON.parse(readFileSync(new URL(p, raiz), "utf8"));

function teste() {
  const ok = (c, m) => { if (!c) { console.error("FALHOU:", m); process.exit(1); } };
  ok(reais(1234.5) === "R$ 1.234,50", `reais: ${reais(1234.5)}`);
  ok(porcentagem(350) === 7 && porcentagem(9999) === 100, "porcentagem");
  ok(svg(350).includes('width="42"') && svg(9999).includes('width="600" height="12" rx="6" fill="#9be38a"'), "largura da barra");
  ok(atualizaReadme("x R$ 0,00 de R$ 5.000,00 (0%) y", 350) === "x R$ 350,00 de R$ 5.000,00 (7%) y", "readme");
  console.log("OK");
}

const arg = process.argv[2];
if (arg === "--teste") teste();
else {
  const total = arg === "--mercadopago" ? (await totalMercadoPago()) + manuais() : Number(arg);
  if (!Number.isFinite(total) || total < 0) { console.error("Uso: node scripts/doacao.mjs <total> | --mercadopago | --teste"); process.exit(1); }
  writeFileSync(new URL("assets/apoio.svg", raiz), svg(total));
  const readme = new URL("README.md", raiz);
  writeFileSync(readme, atualizaReadme(readFileSync(readme, "utf8"), total));
  console.log(`Total: ${reais(total)} (${porcentagem(total)}%)`);
}
