// Gera a pasta cnae/ a partir da API oficial do IBGE (CNAE-Subclasses 2.3)
// e das listas oficiais do Simples Nacional e do MEI em dados/.
// Uso: node scripts/gerar_cnae.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const API = "https://servicodados.ibge.gov.br/api/v2/cnae/subclasses";
const raiz = new URL("..", import.meta.url);
const ler = p => JSON.parse(readFileSync(new URL(p, raiz), "utf8"));

const subclasses = await (await fetch(API)).json();
const { impeditivos, ambiguos } = ler("dados/simples-impeditivos.json");
const { ocupacoes } = ler("dados/mei-ocupacoes.json");

// Formatação dos códigos
const fmtSub = id => id.replace(/^(\d{4})(\d)(\d{2})$/, "$1-$2/$3");
const fmtClasse = id => id.replace(/^(\d{2})(\d{2})(\d)$/, "$1.$2-$3");
const fmtGrupo = id => id.replace(/^(\d{2})(\d)$/, "$1.$2");
// O IBGE escreve as atividades em ordem de índice ("TAQUIGRAFIA; SERVIÇO DE").
// Aqui o texto depois do último "; " vai para o começo ("SERVIÇO DE TAQUIGRAFIA").
export const ordemNatural = s => s.replace(/^(.*); ([^;]+)$/, "$2 $1");
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 6).join("-");

const meiPorCnae = new Map();
for (const o of ocupacoes) {
  if (!meiPorCnae.has(o.cnae)) meiPorCnae.set(o.cnae, []);
  meiPorCnae.get(o.cnae).push(o);
}
const imp = new Set(impeditivos), amb = new Set(ambiguos);

// Agrupa seção > divisão > grupo > classe > subclasse
const divisoes = new Map();
for (const s of subclasses) {
  const c = s.classe, g = c.grupo, d = g.divisao;
  if (!divisoes.has(d.id)) divisoes.set(d.id, { d, grupos: new Map() });
  const div = divisoes.get(d.id);
  if (!div.grupos.has(g.id)) div.grupos.set(g.id, { g, classes: new Map() });
  const gr = div.grupos.get(g.id);
  if (!gr.classes.has(c.id)) gr.classes.set(c.id, { c, subs: [] });
  gr.classes.get(c.id).subs.push(s);
}

const pasta = new URL("cnae/", raiz);
rmSync(pasta, { recursive: true, force: true });
mkdirSync(pasta);

const linhaSimples = cod => imp.has(cod)
  ? "**impeditivo**: este código não pode ser usado por empresa do Simples Nacional (Anexo VI da Resolução CGSN 140/2018)"
  : amb.has(cod)
    ? "**ambíguo**: o código abrange atividades permitidas e proibidas no Simples; a empresa declara na opção que exerce só a parte permitida (Anexo VII da Resolução CGSN 140/2018)"
    : "permitido";

const linhaMei = cod => {
  const occ = meiPorCnae.get(cod);
  if (!occ) return "não";
  return "**sim**: " + occ.map(o => `${o.ocupacao}${o.tabela === "B" ? " (MEI transportador autônomo de cargas)" : ""}`).join("; ");
};

const indice = [];
let totalSub = 0, totalAtiv = 0, totalMei = 0;
for (const [id, { d, grupos }] of [...divisoes].sort()) {
  const arquivo = `${id}-${slug(d.descricao)}.md`;
  const se = d.secao;
  const out = [
    `# Divisão ${id}: ${d.descricao}`,
    "",
    `Seção ${se.id}: ${se.descricao}`,
    "",
    "Fonte: IBGE, CNAE-Subclasses 2.3 (API servicodados.ibge.gov.br). Simples Nacional e MEI: Resolução CGSN 140/2018, Anexos VI, VII e XI. Arquivo gerado por `scripts/gerar_cnae.mjs`; não edite à mão.",
    "",
    "Cada atividade aparece na ordem natural e termina com o código da subclasse, para que uma busca por palavra já mostre o código.",
    "",
  ];
  let subsDiv = 0;
  for (const { g, classes } of [...grupos.values()].sort((a, b) => a.g.id.localeCompare(b.g.id))) {
    out.push(`## Grupo ${fmtGrupo(g.id)}: ${g.descricao}`, "");
    for (const { c, subs } of [...classes.values()].sort((a, b) => a.c.id.localeCompare(b.c.id))) {
      out.push(`### Classe ${fmtClasse(c.id)}: ${c.descricao}`, "");
      for (const nota of c.observacoes || []) {
        const [titulo, ...itens] = nota.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const t = titulo.replace(/\s*-\s*/, ": ").replace(/:\s*$/, "");
        out.push(`**${t.startsWith("Esta classe NÃO") ? "Não inclui" : t.startsWith("Esta classe compreende") ? "Inclui" : t.split(":")[0]}:**`);
        const resto = titulo.includes(" - ") ? [titulo.slice(titulo.indexOf(" - ") + 3)] : [];
        // O IBGE marca subitens com "#-" e deixa alguns "##" soltos no texto.
        for (const item of [...resto, ...itens]) {
          const sub = /^#+-/.test(item);
          out.push(`${sub ? "  " : ""}- ${item.replace(/^#*-\s*/, "").replace(/#+/g, "").trim()}`);
        }
        out.push("");
      }
      for (const s of subs.sort((a, b) => a.id.localeCompare(b.id))) {
        const cod = fmtSub(s.id);
        out.push(`#### ${cod}: ${s.descricao}`, "");
        out.push(`- Simples Nacional: ${linhaSimples(cod)}`);
        out.push(`- MEI: ${linhaMei(cod)}`, "");
        const ativ = [...new Set((s.atividades || []).map(ordemNatural))].sort((a, b) => a.localeCompare(b, "pt-BR"));
        out.push("Atividades:", "");
        for (const a of ativ) out.push(`- ${a} \`${cod}\``);
        out.push("");
        totalSub++; subsDiv++; totalAtiv += (s.atividades || []).length;
        if (meiPorCnae.has(cod)) totalMei++;
      }
    }
  }
  writeFileSync(new URL(arquivo, pasta), out.join("\n"));
  indice.push({ se, id, desc: d.descricao, arquivo, n: subsDiv });
}

// Índice por seção
const idx = [
  "# Índice da CNAE 2.3",
  "",
  `${totalSub} subclasses e ${totalAtiv} atividades, em ${indice.length} arquivos (um por divisão). ${totalMei} subclasses têm ao menos uma ocupação permitida ao MEI.`,
  "",
  "Para achar um código pela descrição do negócio, procure a palavra em todos os arquivos desta pasta (por exemplo, `grep -ri \"padaria\" cnae/`).",
  "",
];
let secAtual = null;
for (const e of indice.sort((a, b) => a.se.id.localeCompare(b.se.id) || a.id.localeCompare(b.id))) {
  if (e.se.id !== secAtual) { secAtual = e.se.id; idx.push("", `## Seção ${e.se.id}: ${e.se.descricao}`, ""); }
  idx.push(`- [${e.id}: ${e.desc}](${e.arquivo}) (${e.n} subclasses)`);
}
writeFileSync(new URL("README.md", pasta), idx.join("\n") + "\n");

// Conferência: os números precisam bater com a CNAE 2.3 e com os anexos oficiais
const confere = (cond, msg) => { if (!cond) { console.error("ERRO:", msg); process.exit(1); } };
confere(totalSub === 1332, `esperava 1332 subclasses, veio ${totalSub}`);
confere(indice.length === 87, `esperava 87 divisões, veio ${indice.length}`);
confere(ordemNatural("TAQUIGRAFIA; SERVIÇO DE") === "SERVIÇO DE TAQUIGRAFIA", "ordemNatural");
const codigos = new Set(subclasses.map(s => fmtSub(s.id)));
for (const c of [...imp, ...amb, ...meiPorCnae.keys()]) confere(codigos.has(c), `código ${c} das listas oficiais não existe na CNAE 2.3`);
console.log(`OK: ${totalSub} subclasses, ${totalAtiv} atividades, ${indice.length} arquivos, ${totalMei} subclasses com MEI.`);
