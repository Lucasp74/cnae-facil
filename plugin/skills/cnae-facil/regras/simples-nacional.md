# Simples Nacional: anexo, Fator R e atividades proibidas

No Simples Nacional, o imposto depende do **anexo** em que a atividade cai, e o anexo depende do CNAE e da descrição real da atividade. Escolher o CNAE certo, e montar a empresa para cair no anexo mais barato que a lei permite, é a forma legal de pagar menos.

Fonte: Lei Complementar nº 123/2006, art. 18 (texto compilado do Planalto) e Resolução CGSN nº 140/2018, consultados em 12/11/2026.

## Limites

| Porte | Receita bruta anual |
|---|---|
| Microempresa (ME) | até R$ 360.000 |
| Empresa de pequeno porte (EPP) | de R$ 360.000 até R$ 4.800.000 |

Acima de R$ 4.800.000 a empresa sai do Simples. O MEI tem regras próprias: veja [mei.md](mei.md).

## Os 5 anexos

A alíquota sobe por faixa de receita. A tabela mostra a alíquota nominal da primeira faixa (receita dos últimos 12 meses até R$ 180.000), só para comparar os anexos entre si.

| Anexo | Para quem | Alíquota inicial |
|---|---|---|
| I | Comércio (revenda de mercadorias) | 4% |
| II | Indústria (venda do que a própria empresa fabrica) | 4,5% |
| III | Serviços da lista do art. 18, § 5º-B e § 5º-D, e serviços do Anexo V com Fator R de 28% ou mais | 6% |
| IV | Construção, vigilância, limpeza, conservação e advocacia (§ 5º-C) | 4,5% + INSS patronal pago fora do Simples |
| V | Serviços intelectuais e técnicos do § 5º-I, quando o Fator R fica abaixo de 28% | 15,5% |

A diferença entre o Anexo III (6%) e o Anexo V (15,5%) é a maior economia possível para empresas de serviço, e ela depende do Fator R.

## Fator R: como sair do Anexo V para o Anexo III

**Fator R = folha de salários dos últimos 12 meses ÷ receita bruta dos últimos 12 meses** (LC 123, art. 18, § 5º-K).

- **Fator R de 28% ou mais:** a atividade é tributada no **Anexo III** (§ 5º-J).
- **Fator R abaixo de 28%:** a atividade vai para o **Anexo V** (§ 5º-M).

A folha inclui salários, pró-labore dos sócios, 13º e o FGTS e o INSS patronal sobre eles. Por isso, muitas empresas de serviço definem um pró-labore que deixe o Fator R em 28% ou mais. Antes de fazer isso, compare com o contador: pró-labore maior também gera INSS e Imposto de Renda na pessoa física.

### Atividades sujeitas ao Fator R

Ficam no **Anexo III com Fator R de 28% ou mais**, e no **Anexo V abaixo disso**:

- Todo o § 5º-D: administração e locação de imóveis de terceiros; academias de dança, capoeira, ioga, artes marciais, atividades físicas, natação e escolas de esportes; **elaboração de programas de computador**, inclusive jogos, desenvolvidos no estabelecimento da empresa; **licenciamento ou cessão de uso de software**; **criação e manutenção de sites**, feitos no estabelecimento da empresa; montagem de estandes para feiras; laboratórios de análises clínicas ou de patologia; tomografia, diagnóstico por imagem e ressonância; serviços de prótese em geral.
- Do § 5º-B: fisioterapia; arquitetura e urbanismo; medicina, inclusive laboratorial, e enfermagem; odontologia e prótese dentária; psicologia, psicanálise, terapia ocupacional, acupuntura, podologia, fonoaudiologia, clínicas de nutrição e de vacinação e bancos de leite.
- Todo o § 5º-I: medicina veterinária; comissaria, despachantes, tradução e interpretação; engenharia, medição, cartografia, topografia, geologia, geodésia, testes, suporte e análises técnicas e tecnológicas, pesquisa, **design**, desenho e agronomia; **representação comercial** e intermediação de negócios; perícia, leilão e avaliação; **auditoria, economia, consultoria, gestão, organização, controle e administração**; **jornalismo e publicidade**; agenciamento, exceto de mão de obra; e outros serviços de atividade intelectual, técnica, científica, desportiva, artística ou cultural que não estejam nos Anexos III ou IV.

### Sempre no Anexo III, sem Fator R

Creches, escolas, cursos de idiomas e cursos livres; agência de correios terceirizada; agência de viagem; autoescola; lotérica; instalação, reparo e manutenção em geral; transporte municipal de passageiros; escritório de contabilidade; produções artísticas e culturais; corretagem de seguros (LC 123, art. 18, § 5º-B).

## CNAEs que impedem o Simples

- **Impeditivos** (Anexo VI da Resolução CGSN 140/2018): 101 códigos, como bancos, seguradoras, holdings, geração de energia, fabricação de cigarros, armas e automóveis, **aluguel de imóveis próprios** (6810-2/02), locação de mão de obra temporária e cartórios. Uma empresa com qualquer um deles no CNPJ, como atividade principal ou secundária, não pode optar pelo Simples.
- **Ambíguos** (Anexo VII): 22 códigos que misturam atividade permitida e proibida, como transporte escolar, fretamento e "outras atividades de serviços prestados às empresas" (8299-7/99). A empresa pode optar pelo Simples declarando que exerce só a parte permitida.

A lista completa está em [../dados/simples-impeditivos.json](../dados/simples-impeditivos.json), e cada código aparece marcado nos arquivos de [../cnae/](../cnae/).

## Como escolher o CNAE para pagar menos, sem risco

1. **O CNAE principal é o da atividade que mais gera receita.** Não escolha um código só porque cai num anexo mais barato: se ele não descrever o que a empresa faz, a Receita pode reenquadrar a atividade, cobrar a diferença com multa e excluir a empresa do Simples.
2. **Entre códigos que descrevem a atividade com a mesma precisão, prefira o de anexo mais barato.** Exemplo: quem vende software pronto (licença) cabe em 6203-1/00; quem desenvolve sob encomenda, em 6201-5/01. Os dois estão sujeitos ao Fator R, mas dizer exatamente o que a empresa faz evita enquadramentos errados de ISS no município.
3. **Não inclua CNAE secundário de atividade que a empresa não vai exercer.** Um secundário impeditivo tira a empresa do Simples, e um secundário de Anexo V sem Fator R pode encarecer a receita daquela atividade.
4. **Separe receitas por anexo.** No Simples, cada receita é tributada no anexo da atividade que a gerou. Uma loja que também presta serviço de instalação paga Anexo I sobre as vendas e Anexo III sobre a instalação.
5. **Para serviços do Fator R, planeje o pró-labore** com o contador para ficar em 28% ou mais.
6. **Confira se dá para ser MEI** primeiro: é o regime mais barato para quem cabe nele. Veja [mei.md](mei.md).

## Fora do Simples: Lucro Presumido, em uma linha

No Lucro Presumido, o IRPJ é calculado sobre uma base presumida de 8% da receita para comércio e indústria e 32% para a maioria dos serviços (Lei 9.249/1995, art. 15). Para serviços com margem alta e folha baixa, às vezes sai mais barato que o Anexo V do Simples. A comparação depende dos números da empresa e deve ser feita pelo contador.

## Reforma tributária

A Lei Complementar 214/2025 cria a CBS e o IBS, que substituem aos poucos PIS, Cofins, ICMS e ISS a partir de 2027. Empresas do Simples continuam no Simples, mas passam a ter a opção de recolher CBS e IBS por fora para dar crédito aos clientes empresariais. Essa escolha muda a conta e deve ser feita com o contador.
