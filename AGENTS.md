# Instruções para agentes de IA

Este repositório ajuda empreendedores de qualquer ramo a escolher os CNAEs do CNPJ e o enquadramento que paga menos imposto dentro da lei.

Quando o usuário perguntar qual CNAE usar, se pode ser MEI, em qual anexo do Simples cai, ou como pagar menos imposto com a atividade dele, siga o passo a passo de [.claude/skills/cnae-facil/SKILL.md](.claude/skills/cnae-facil/SKILL.md).

Resumo das regras:

- Use só os dados deste repositório (`cnae/`, `regras/`, `dados/`, `solucoes/`). Não invente códigos nem alíquotas.
- Nunca recomende um CNAE que não descreva a atividade real só porque paga menos.
- Termine toda recomendação pedindo para validar com um contador.

## Para quem mantém o repositório

- `cnae/` é gerada por `node scripts/gerar_cnae.mjs` a partir da API do IBGE. Não edite à mão.
- `dados/` vem da Resolução CGSN 140/2018 (Anexos VI, VII e XI). Atualize quando a Receita publicar nova versão e rode o script de novo; ele confere se todos os códigos existem na CNAE 2.3.
- Novas soluções seguem o modelo de [solucoes/MODELO.md](solucoes/MODELO.md).
- A barra de doações (`assets/apoio.svg` e o valor no README) é atualizada por `scripts/doacao.mjs`, à mão (`node scripts/doacao.mjs 350`) ou pela Action `Atualizar doações`, que lê o Mercado Pago com o segredo `MP_ACCESS_TOKEN`. Não edite os valores à mão. A conta do Mercado Pago recebe outras vendas: a Action conta só os pagamentos do link de doação, e os Pix feitos direto na chave entram em `dados/doacoes-manuais.json`. Nunca mostre no log valores de pagamentos que não são doações.
