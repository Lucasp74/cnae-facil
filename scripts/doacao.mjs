// Atualiza a barra de doações (assets/apoio.svg) e o valor no README.
//
//   node scripts/doacao.mjs 350          -> define o total arrecadado à mão
//   node scripts/doacao.mjs --mercadopago -> soma os pagamentos feitos pelo link de doação do Mercado Pago
//                                            (precisa da variável MP_ACCESS_TOKEN) e os de dados/doacoes-manuais.json
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

// Doação usada como referência: o primeiro pagamento feito pelo link de doação (R$ 1, 13/11/2026).
// Todo pagamento que veio do mesmo link conta como doação. O link de pagamento só é usado para doações,
// então isso separa as doações das outras vendas da conta.
const REFERENCIA = "189357668020";

async function api(caminho, parametros = {}) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN não definido");
  const url = new URL(caminho, "https://api.mercadopago.com");
  Object.entries(parametros).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Mercado Pago respondeu ${r.status} em ${url.pathname}`);
  return r.json();
}

// O link de pagamento cria uma preferência; cada pagamento por ele fica num pedido (merchant order)
// com o id dessa preferência e o título do link. Pagamentos sem pedido (Pix na chave, maquininha) não são do link.
async function origem(p) {
  if (!p.order?.id) return null;
  const pedido = await api(`/merchant_orders/${p.order.id}`);
  return { preferencia: pedido.preference_id || null, titulo: pedido.items?.[0]?.title?.trim() || null };
}

// Mesmo link: mesma preferência ou, se o link gerar uma preferência por visita, mesmo título.
export const mesmoLink = (o, ref) =>
  !!o && ((!!ref.preferencia && o.preferencia === ref.preferencia) || (!!ref.titulo && o.titulo === ref.titulo));

async function totalMercadoPago() {
  const ref = await origem(await api(`/v1/payments/${REFERENCIA}`));
  if (!ref || (!ref.preferencia && !ref.titulo))
    throw new Error(`O pagamento de referência ${REFERENCIA} não tem pedido do link; confira o número em scripts/doacao.mjs.`);

  const pagamentos = [];
  for (let offset = 0; ; offset += 100) {
    const { results, paging } = await api("/v1/payments/search", {
      sort: "date_created", criteria: "desc", range: "date_created", begin_date: INICIO, end_date: "NOW", limit: 100, offset,
    });
    pagamentos.push(...results);
    if (offset + 100 >= paging.total) break;
  }
  const doacoes = [];
  for (const p of pagamentos.filter(p => p.status === "approved"))
    if (mesmoLink(await origem(p), ref)) doacoes.push(p);

  // O repositório e o log da Action são públicos, e a conta recebe outras vendas:
  // o log mostra só as doações (data e valor), nunca quem doou nem nada das outras vendas.
  console.log(`Link de doação reconhecido por ${ref.preferencia ? "preferência" : "título"}. Doações: ${doacoes.length}.`);
  for (const p of doacoes) console.log(`- ${p.date_approved?.slice(0, 10)} ${reais(p.transaction_amount)}`);
  return doacoes.reduce((s, p) => s + p.transaction_amount, 0);
}

// Pix feitos direto para a chave não têm como ser separados das outras vendas pela API.
// Eles entram à mão em dados/doacoes-manuais.json.
const manuais = () => ler("dados/doacoes-manuais.json").doacoes.reduce((s, d) => s + d.valor, 0);
const ler = p => JSON.parse(readFileSync(new URL(p, raiz), "utf8"));

function teste() {
  const ok = (c, m) => { if (!c) { console.error("FALHOU:", m); process.exit(1); } };
  ok(reais(1234.5) === "R$ 1.234,50", `reais: ${reais(1234.5)}`);
  ok(porcentagem(350) === 7 && porcentagem(9999) === 100, "porcentagem");
  ok(svg(350).includes('width="42"') && svg(9999).includes('width="600" height="12" rx="6" fill="#9be38a"'), "largura da barra");
  const ref = { preferencia: "1-a", titulo: "Doação" };
  ok(mesmoLink({ preferencia: "1-a", titulo: "x" }, ref) && mesmoLink({ preferencia: "1-b", titulo: "Doação" }, ref), "mesmo link");
  ok(!mesmoLink(null, ref) && !mesmoLink({ preferencia: "2", titulo: "Camiseta" }, ref), "outra venda");
  ok(!mesmoLink({ preferencia: null, titulo: null }, { preferencia: null, titulo: null }), "referência vazia");
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
