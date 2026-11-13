// Monta a pasta plugin/ que o Claude instala: a skill com os dados ao lado dela.
// Rode depois de mudar a skill, cnae/, regras/, dados/ ou solucoes/: node scripts/empacotar.mjs
import { copyFileSync, readdirSync, rmSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Aumente a cada versão publicada: quem instalou só recebe a atualização quando este número muda.
const version = "1.0.1";

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
// O portal do diretório da Anthropic acha o ícone por este caminho, sem precisar do campo "icon".
copiar(join(raiz, "assets", "icone.png"), join(plugin, ".claude-plugin", "icon.png"));

writeFileSync(join(plugin, "README.md"), `# CNAE Fácil

Plugin que ajuda empreendedores de qualquer ramo a escolher os códigos CNAE certos para o CNPJ e o enquadramento tributário que paga menos imposto dentro da lei: MEI, anexo do Simples Nacional e Fator R.

## O que ele faz

A skill \`cnae-facil\` entende o negócio, encontra os códigos nas 1.332 subclasses da CNAE 2.3 do IBGE, confere se cada código pode ser MEI e se é permitido no Simples Nacional, segundo a Resolução CGSN 140/2018, e recomenda o CNAE principal, os secundários e o regime mais barato que a lei permite. Ela nunca indica um código que não descreva a atividade real.

## Como usar

Depois de instalar, pergunte em português, por exemplo: "Vou abrir uma padaria que fabrica e vende pão. Qual CNAE uso e como pago menos imposto?". A skill é ativada sozinha. Também é possível chamá-la com \`/cnae-facil:cnae-facil\`.

## Configuração

Nenhuma. O plugin não usa chaves, senhas nem conexões externas: todos os dados oficiais estão dentro dele.

## Aviso

As recomendações são informativas e não substituem um contador.

Projeto, fontes e licença: https://github.com/Lucasp74/cnae-facil
`);
console.log(`plugin/ montado (versão ${version}).`);
