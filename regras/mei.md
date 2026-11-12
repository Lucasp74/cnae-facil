# MEI: quem pode ser e quanto paga

O MEI é o regime mais barato para quem cabe nele: paga um valor fixo por mês, sem percentual sobre o faturamento. Por isso, a primeira pergunta para pagar menos imposto é se o negócio pode ser MEI.

Fontes: Lei Complementar nº 123/2006, arts. 18-A e 18-C; Lei Complementar nº 238/2026; Resolução CGSN nº 140/2018, Anexo XI. Consultados em 12/11/2026.

## Quem pode ser MEI

Todas estas condições ao mesmo tempo:

1. **Faturamento dentro do limite** (tabela abaixo).
2. **Exercer só ocupações da lista oficial** (Anexo XI da Resolução CGSN 140/2018). Todos os CNAEs do CNPJ, principal e secundários, precisam estar na lista.
3. **Ser empresário individual**, sem sócio, e não participar de outra empresa como sócio ou titular.
4. **Ter no máximo 1 empregado**, recebendo um salário mínimo ou o piso da categoria. A partir de 2027, até 2 empregados (LC 238/2026).

## Limite de faturamento

| Ano | Limite anual | Limite mensal proporcional no ano de abertura |
|---|---|---|
| 2026 | R$ 81.000 | R$ 6.750 por mês |
| 2027 | R$ 110.000 | R$ 9.166,67 por mês |
| A partir de 2028 | R$ 140.000 | R$ 11.666,67 por mês |

Os novos limites vêm da Lei Complementar 238, de 21/10/2026. O **MEI transportador autônomo de cargas** (Tabela B do Anexo XI) tem limite próprio de **R$ 251.600** por ano (LC 123/2006, art. 18-F).

## A lista de ocupações

- **467 ocupações** na Tabela A (MEI em geral) e **4** na Tabela B (transportador autônomo de cargas), cobrindo **351 CNAEs**.
- Lista completa, com o CNAE de cada ocupação e se ela paga ISS ou ICMS: [../dados/mei-ocupacoes.json](../dados/mei-ocupacoes.json).
- Nos arquivos de [../cnae/](../cnae/), cada subclasse diz `MEI: sim` (com as ocupações) ou `MEI: não`.

Um CNAE aparecer na lista não basta: a ocupação descrita precisa ser a que a pessoa exerce. O mesmo código pode valer para "manicure" e não para "salão de beleza com funcionários", porque o segundo passa do limite de empregados.

## Quanto o MEI paga

Um valor fixo mensal (DAS-MEI) formado por:

- **INSS:** 5% do salário mínimo;
- **ICMS:** R$ 1, se a ocupação for de comércio ou indústria;
- **ISS:** R$ 5, se a ocupação for de serviço.

Ocupações que pagam ISS e ICMS somam os dois. Na lista de ocupações, os campos `iss` e `icms` dizem qual se aplica.

## Quando o MEI deixa de compensar

- **Faturamento perto do limite:** passar até 20% do limite tira a empresa do MEI a partir de janeiro do ano seguinte, pagando imposto sobre o excesso. Passar mais de 20% desenquadra com efeito retroativo a 1º de janeiro, e a empresa paga como ME no Simples sobre o ano todo (LC 123/2006, art. 18-A, § 7º).
- **Precisa de sócio ou de mais empregados:** vira ME no Simples Nacional. Veja [simples-nacional.md](simples-nacional.md).
- **Atividade fora da lista**, como a maioria das profissões intelectuais regulamentadas (advogado, médico, engenheiro, programador como "desenvolvedor de software"): não pode ser MEI. O caminho costuma ser ME no Simples, cuidando do Fator R.
