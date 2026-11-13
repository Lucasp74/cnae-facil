# CNAE Fácil

## Apoie o projeto

<p align="center"><img src="assets/apoio.svg" alt="Apoio ao projeto: R$ 1,00 de R$ 5.000,00 (0%)" width="720"></p>

> [!IMPORTANT]
> **Apoie via Pix · R$ 1,00 de R$ 5.000,00 (0%)**
>
> O CNAE Fácil é gratuito e aberto. Seu apoio paga a revisão das soluções por um contador e mantém os dados atualizados quando a lei muda.
>
> Quem apoiar entra na [lista de apoiadores](#apoiadores). Escreva seu nome no comentário do Pix.

<p align="center"><a href="https://link.mercadopago.com.br/cnaefacil"><strong>Doe qualquer valor pelo Mercado Pago</strong></a><br>Pix, cartão ou boleto</p>

<p align="center">Ou copie a chave Pix:<br><code>8f7ec13f-121a-4f03-8438-3a35b502a945</code></p>

## O que é

Descubra quais CNAEs colocar no CNPJ do seu negócio, de qualquer ramo, e qual enquadramento paga menos imposto dentro da lei. Os dados são oficiais (IBGE e Receita Federal) e estão em Markdown, prontos para você ler e para o Claude, o ChatGPT ou qualquer IA usar.

<p align="center"><a href="https://github.com/Lucasp74/cnae-facil/releases/latest/download/cnae-facil-skill.zip"><img src="assets/botao-baixar.svg" alt="Baixar a skill para o Claude (cnae-facil-skill.zip)" width="360"></a><br><a href="#no-chat-do-claude-claudeai-e-app">Como instalar</a></p>

> [!WARNING]
> Este repositório é informativo e não substitui um contador. Valide a escolha dos CNAEs e do regime tributário antes de registrar ou alterar sua empresa.

## O que tem aqui

- **Todos os 1.332 CNAEs válidos para CNPJ** (CNAE-Subclasses 2.3), com as **17.180 atividades** que cada um cobre, escritas em linguagem normal. Procure "padaria", "manicure" ou "desenvolvimento de software" e o código aparece.
- **Para cada CNAE:** se pode ser **MEI** (e com qual ocupação) e se é **permitido no Simples Nacional**, segundo as listas oficiais da Receita.
- **Regras para pagar menos imposto sem risco:** limites do MEI (incluindo os novos valores de 2027 e 2028), anexos do Simples e o **Fator R**, que pode baixar o imposto de serviços de 15,5% para 6%.
- **Soluções prontas** por tipo de negócio, com o CNAE principal, os secundários e o enquadramento recomendado.

## Como usar

### Atalho com "/"

Depois de instalar, a skill é ativada sozinha quando você fala de CNAE, CNPJ, MEI ou Simples Nacional. Para chamá-la direto, digite `/` na caixa de mensagem, escolha o comando da tabela e escreva a pergunta na mesma linha:

| Onde você instalou | Comando |
|---|---|
| Plugin no Claude Code | `/cnae-facil:cnae-facil` |
| Pacote `.zip` no app ou no claude.ai | `/anthropic-skills:cnae-facil` |
| Repositório clonado, abrindo o Claude Code na pasta | `/cnae-facil` |

Exemplo:

```
/cnae-facil:cnae-facil Vou abrir uma padaria que fabrica e vende pão. Qual CNAE uso e como pago menos imposto?
```

Não precisa decorar: digite `/cnae` e o Claude mostra o comando certo na lista.

### Instale o plugin no Claude Code

Dentro de uma sessão do Claude Code (terminal ou aba Code do app), rode:

```
/plugin marketplace add Lucasp74/cnae-facil
/plugin install cnae-facil@cnae-facil
```

Depois pergunte, por exemplo: *"Vou abrir uma loja de bolos caseiros com entrega. Quais CNAEs uso e como pago menos imposto?"*. A skill é ativada sozinha, ou chame com `/cnae-facil:cnae-facil`.

Para receber atualizações: `/plugin marketplace update cnae-facil`.

### No chat do Claude (claude.ai e app)

<p><a href="https://github.com/Lucasp74/cnae-facil/releases/latest/download/cnae-facil-skill.zip"><img src="assets/botao-baixar.svg" alt="Baixar a skill para o Claude (cnae-facil-skill.zip)" width="360"></a></p>

1. Clique no botão acima. O arquivo `cnae-facil-skill.zip` (cerca de 480 KB) vai para a pasta de downloads. **Não descompacte.**
2. No Claude, abra **Configurações → Skills**, clique em **+ Adicionar** e escolha a opção de enviar uma skill.
3. Selecione o arquivo `cnae-facil-skill.zip` e confirme. A skill aparece na aba **Meus**: deixe-a ativada.
4. Confira se a execução de código está ligada, em **Configurações → Recursos**.
5. Abra um chat novo e pergunte, por exemplo: *"Qual CNAE uso para uma padaria e como pago menos imposto?"*. Ou chame direto com `/anthropic-skills:cnae-facil` seguido da pergunta.

O botão sempre baixa a versão mais recente. Versões anteriores ficam em [Releases](https://github.com/Lucasp74/cnae-facil/releases).

### Clonando o repositório

```bash
git clone https://github.com/Lucasp74/cnae-facil.git
cd cnae-facil
claude
```

A skill é carregada automaticamente nesta pasta. Chame com `/cnae-facil` seguido da pergunta.

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
| [.claude/skills/cnae-facil/](.claude/skills/cnae-facil/SKILL.md) | Skill do Claude Code (texto original) |
| [plugin/](plugin/) | Plugin instalável, gerado por `node scripts/empacotar.mjs` |
| [scripts/gerar_cnae.mjs](scripts/gerar_cnae.mjs) | Gera a pasta `cnae/` (`node scripts/gerar_cnae.mjs`) |

## Fontes

- CNAE-Subclasses 2.3: [API de dados do IBGE](https://servicodados.ibge.gov.br/api/v2/cnae/subclasses) e [CONCLA](https://concla.ibge.gov.br/estrutura/atividades-economicas-estrutura/cnae).
- MEI e Simples Nacional: Lei Complementar 123/2006, Lei Complementar 238/2026 e Resolução CGSN 140/2018 (Anexos VI, VII e XI).

Dados consultados em 12/11/2026.

## Contribua

Conhece bem um ramo de negócio? Escreva uma solução seguindo o [modelo](solucoes/MODELO.md) e abra um pull request. Toda solução precisa citar a fonte de cada regra.

## Apoiadores

Seja o primeiro.

## Licença

A classificação CNAE (IBGE/CONCLA), as leis e as resoluções reproduzidas aqui, como a Lei Complementar 123/2006 e a Resolução CGSN 140/2018, são **atos oficiais do poder público** e, pelo art. 8º, inciso IV, da Lei nº 9.610/1998, não são objeto de proteção autoral. Os scripts e os textos explicativos deste repositório estão sob a licença MIT. Veja [LICENSE](LICENSE).
