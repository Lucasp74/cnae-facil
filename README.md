# CNAE Fácil

Descubra quais CNAEs colocar no CNPJ do seu negócio, de qualquer ramo, e qual enquadramento paga menos imposto dentro da lei. Os dados são oficiais (IBGE e Receita Federal) e estão em Markdown, prontos para você ler e para o Claude, o ChatGPT ou qualquer IA usar.

> [!WARNING]
> Este repositório é informativo e não substitui um contador. Valide a escolha dos CNAEs e do regime tributário antes de registrar ou alterar sua empresa.

## O que tem aqui

- **Todos os 1.332 CNAEs válidos para CNPJ** (CNAE-Subclasses 2.3), com as **17.180 atividades** que cada um cobre, escritas em linguagem normal. Procure "padaria", "manicure" ou "desenvolvimento de software" e o código aparece.
- **Para cada CNAE:** se pode ser **MEI** (e com qual ocupação) e se é **permitido no Simples Nacional**, segundo as listas oficiais da Receita.
- **Regras para pagar menos imposto sem risco:** limites do MEI (incluindo os novos valores de 2027 e 2028), anexos do Simples e o **Fator R**, que pode baixar o imposto de serviços de 15,5% para 6%.
- **Soluções prontas** por tipo de negócio, com o CNAE principal, os secundários e o enquadramento recomendado.

## Como usar

### Com o Claude Code

```bash
git clone https://github.com/Lucasp74/cnae-facil.git
cd cnae-facil
claude
```

Pergunte, por exemplo: *"Vou abrir uma loja de bolos caseiros com entrega. Quais CNAEs uso e como pago menos imposto?"*. A skill `cnae-facil` é carregada automaticamente nesta pasta.

Para usar a skill em qualquer projeto, copie a pasta [.claude/skills/cnae-facil](.claude/skills/cnae-facil) para `~/.claude/skills/`. Ela lê os dados direto do GitHub quando o repositório não está na máquina.

### Com outras IAs

Clone o repositório e peça para a IA seguir o [AGENTS.md](AGENTS.md). Ou copie o [TEMPLATE-EMPREENDEDOR.md](TEMPLATE-EMPREENDEDOR.md) para o seu projeto, preencha os dados do negócio e peça para a IA completar a recomendação.

### Sem IA

1. Veja se existe uma solução pronta em [solucoes/](solucoes/).
2. Se não existir, abra o [índice da CNAE](cnae/README.md) ou use a busca do GitHub neste repositório com uma palavra do seu negócio.
3. Confira o enquadramento em [regras/mei.md](regras/mei.md) e [regras/simples-nacional.md](regras/simples-nacional.md).

## Estrutura

| Pasta ou arquivo | Conteúdo |
|---|---|
| [solucoes/](solucoes/) | Recomendações por tipo de negócio |
| [cnae/](cnae/) | As 87 divisões da CNAE 2.3, uma por arquivo, geradas da API do IBGE |
| [regras/](regras/) | MEI, Simples Nacional e Fator R, códigos antigos |
| [dados/](dados/) | Listas oficiais da Resolução CGSN 140/2018: ocupações do MEI e CNAEs proibidos no Simples |
| [.claude/skills/cnae-facil/](.claude/skills/cnae-facil/SKILL.md) | Skill do Claude Code |
| [scripts/gerar_cnae.mjs](scripts/gerar_cnae.mjs) | Gera a pasta `cnae/` (`node scripts/gerar_cnae.mjs`) |

## Fontes

- CNAE-Subclasses 2.3: [API de dados do IBGE](https://servicodados.ibge.gov.br/api/v2/cnae/subclasses) e [CONCLA](https://concla.ibge.gov.br/estrutura/atividades-economicas-estrutura/cnae).
- MEI e Simples Nacional: Lei Complementar 123/2006, Lei Complementar 238/2026 e Resolução CGSN 140/2018 (Anexos VI, VII e XI).

Dados consultados em 12/11/2026.

## Apoie o projeto

<p align="center"><img src="assets/apoio.svg" alt="Apoio ao projeto: R$ 0,00 de R$ 5.000,00 (0%)" width="720"></p>

> [!IMPORTANT]
> **Apoie via Pix · R$ 0,00 de R$ 5.000,00 (0%)**
>
> O CNAE Fácil é gratuito e aberto. Seu apoio paga a revisão das soluções por um contador e mantém os dados atualizados quando a lei muda.
>
> Quer aparecer na lista de apoiadores? Escreva o nome no comentário do Pix.

<p align="center">Chave Pix aleatória:<br><code>8f7ec13f-121a-4f03-8438-3a35b502a945</code></p>

### Apoiadores

Seja o primeiro.

## Contribua

Conhece bem um ramo de negócio? Escreva uma solução seguindo o [modelo](solucoes/MODELO.md) e abra um pull request. Toda solução precisa citar a fonte de cada regra.

## Licença

[MIT](LICENSE)
