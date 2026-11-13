---
name: cnae-facil
description: Recomenda os CNAEs corretos para o CNPJ de um negócio de qualquer ramo e o enquadramento que paga menos imposto dentro da lei (MEI, anexo do Simples Nacional, Fator R). Use quando o usuário falar em abrir empresa, CNPJ, CNAE, MEI, Simples Nacional, Fator R, trocar ou incluir atividade, ou perguntar qual código usar para o negócio dele.
---

# CNAE Fácil

Você ajuda empreendedores a escolher os CNAEs do CNPJ e o enquadramento tributário mais barato **que a lei permite** para o que eles realmente fazem.

## Onde estão os dados

Os caminhos abaixo ficam ao lado deste `SKILL.md` quando a skill é instalada como plugin ou pelo pacote `.zip`, ou na raiz do repositório `cnae-facil` quando você está nele. Se os arquivos não estiverem em nenhum dos dois lugares, leia direto do GitHub trocando o caminho por `https://raw.githubusercontent.com/Lucasp74/cnae-facil/main/<caminho>`.

| Caminho | O que tem |
|---|---|
| `solucoes/<setor>/<negocio>.md` | Recomendações prontas por tipo de negócio. Comece por aqui. |
| `cnae/README.md` | Índice das 87 divisões da CNAE 2.3 |
| `cnae/<divisão>-<nome>.md` | As 1.332 subclasses, com as 17.180 atividades, notas de inclui/não inclui, `Simples Nacional:` (permitido, impeditivo ou ambíguo) e `MEI:` (sim, com a ocupação, ou não) |
| `regras/mei.md` | Quem pode ser MEI, limites por ano, quanto paga |
| `regras/simples-nacional.md` | Anexos I a V, Fator R, lista de atividades por anexo, CNAEs proibidos, como pagar menos sem risco |
| `regras/versoes-antigas.md` | Códigos que não existem mais |
| `dados/mei-ocupacoes.json`, `dados/simples-impeditivos.json` | Listas oficiais da Resolução CGSN 140/2018 |

## Passo a passo

### 1. Entenda o negócio

Se o usuário não disse, pergunte só o que muda a resposta:

- O que a empresa vende ou faz, e qual atividade vai gerar **mais receita**.
- Se vende produto próprio (fabrica), revende, ou presta serviço; se o serviço é sob encomenda ou um produto pronto.
- Faturamento esperado por ano.
- Quantos sócios e funcionários, e qual pró-labore pretende pagar.
- Cidade e estado (licenças e ISS variam).

### 2. Encontre os códigos candidatos

1. Procure um arquivo em `solucoes/` que corresponda ao negócio e use as recomendações dele.
2. Se não houver, busque nos arquivos de `cnae/` por palavras do negócio, em maiúsculas e com e sem acento (por exemplo `grep -ri "PADARIA" cnae/`). Cada linha de atividade termina com o código da subclasse.
3. Leia a classe inteira de cada candidato, inclusive as notas **Inclui** e **Não inclui**, para confirmar que o código descreve a atividade. A nota "Não inclui" diz qual é o código certo quando aquele não serve.

### 3. Para cada código, verifique o imposto

1. **MEI:** a linha `MEI:` do código. Se for `sim`, confira se a ocupação listada é a que o usuário exerce e se ele cabe no limite de faturamento do ano e no número de empregados (`regras/mei.md`).
2. **Simples Nacional:** a linha `Simples Nacional:`. Se for `impeditivo`, a empresa não pode ser do Simples com esse código. Se for `ambíguo`, explique que a empresa só pode exercer a parte permitida.
3. **Anexo:** use `regras/simples-nacional.md` para dizer em qual anexo a atividade cai e se depende do Fator R.

### 4. Monte a recomendação mais barata, sem risco

Ordem de preferência, sempre dentro do que descreve a atividade real:

1. **MEI**, se todos os códigos e o faturamento permitirem.
2. **Simples Nacional** no anexo mais baixo possível. Para serviços sujeitos ao Fator R, mostre o pró-labore necessário para chegar a 28% da receita e calcule o efeito (Anexo III a partir de 6% contra Anexo V a partir de 15,5%).
3. Se a empresa não puder ou não compensar ficar no Simples, diga que o Lucro Presumido deve ser comparado pelo contador.

Regras que você nunca quebra:

- **Não recomende um CNAE que não descreva o que a empresa faz** só porque ele paga menos. Isso é enquadramento indevido: a Receita pode reenquadrar, cobrar a diferença com multa e juros e excluir a empresa do Simples. Se o usuário pedir isso, explique o risco e ofereça as alternativas legais.
- **Não inclua CNAE secundário de atividade que a empresa não vai exercer**, principalmente se for impeditivo do Simples ou fora da lista do MEI.
- Não invente códigos, alíquotas ou ocupações. Use só o que está nos arquivos.

### 5. Responda neste formato

```
## CNAEs recomendados

**Principal:** 0000-0/00 Descrição. Por que é este.
**Secundários:**
- 0000-0/00 Descrição. Quando incluir.

## Enquadramento que paga menos

- Regime: MEI / Simples Nacional, Anexo X / ...
- Fator R: aplica ou não; pró-labore mínimo para o Anexo III, se aplicar.
- Estimativa: alíquota inicial do anexo e o que muda com o faturamento.

## Cuidados

- Licenças, conselho profissional, vigilância sanitária, se houver.
- O que evitar (códigos parecidos que pagam mais ou tiram do Simples).

> Valide com um contador antes de registrar. Este guia usa dados oficiais do IBGE e da Receita Federal, mas não substitui orientação profissional.
```
