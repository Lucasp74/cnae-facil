// Monta a pasta plugin/ que o Claude instala: a skill com os dados ao lado dela.
// Rode depois de mudar a skill, cnae/, regras/, dados/ ou solucoes/: node scripts/empacotar.mjs
import { copyFileSync, readdirSync, rmSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Aumente a cada versão publicada: quem instalou só recebe a atualização quando este número muda.
const version = "1.0.0";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const plugin = join(raiz, "plugin");
const skill = join(plugin, "skills", "cnae-facil");

// cpSync recursivo derruba o Node 24 no Windows quando o caminho tem acento; copia arquivo por arquivo.
const copiar = (de, para) => {
  if (!statSync(de).isDirectory()) return copyFileSync(de, para);
  mkdirSync(para, { recursive: true });
  for (const nome of readdirSync(de)) copiar(join(de, nome), join(para, nome));
};

rmSync(plugin, { recursive: true, force: true });
mkdirSync(join(skill, "dados"), { recursive: true });
mkdirSync(join(plugin, ".claude-plugin"));

copiar(join(raiz, ".claude", "skills", "cnae-facil", "SKILL.md"), join(skill, "SKILL.md"));
for (const pasta of ["cnae", "regras", "solucoes"]) copiar(join(raiz, pasta), join(skill, pasta));
for (const f of ["mei-ocupacoes.json", "simples-impeditivos.json"]) copiar(join(raiz, "dados", f), join(skill, "dados", f));

writeFileSync(join(plugin, ".claude-plugin", "plugin.json"), JSON.stringify({
  name: "cnae-facil",
  displayName: "CNAE Fácil",
  version,
  description: "Recomenda os CNAEs corretos para o CNPJ de qualquer negócio e o enquadramento que paga menos imposto dentro da lei (MEI, Simples Nacional, Fator R), com dados oficiais do IBGE e da Receita Federal.",
  author: { name: "Lucasp74", url: "https://github.com/Lucasp74" },
  homepage: "https://github.com/Lucasp74/cnae-facil",
  repository: "https://github.com/Lucasp74/cnae-facil",
  license: "MIT",
  keywords: ["cnae", "cnpj", "mei", "simples-nacional", "empreendedorismo", "brasil"],
}, null, 2) + "\n");

writeFileSync(join(plugin, "README.md"), `# CNAE Fácil (plugin)

Pasta gerada por \`scripts/empacotar.mjs\`; não edite à mão. O projeto, as fontes e as instruções estão em https://github.com/Lucasp74/cnae-facil.
`);
console.log(`plugin/ montado (versão ${version}).`);
