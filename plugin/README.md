# CNAE Fácil

Plugin que ajuda empreendedores de qualquer ramo a escolher os códigos CNAE certos para o CNPJ e o enquadramento tributário que paga menos imposto dentro da lei: MEI, anexo do Simples Nacional e Fator R.

## O que ele faz

A skill `cnae-facil` entende o negócio, encontra os códigos nas 1.332 subclasses da CNAE 2.3 do IBGE, confere se cada código pode ser MEI e se é permitido no Simples Nacional, segundo a Resolução CGSN 140/2018, e recomenda o CNAE principal, os secundários e o regime mais barato que a lei permite. Ela nunca indica um código que não descreva a atividade real.

## Como usar

Depois de instalar, pergunte em português, por exemplo: "Vou abrir uma padaria que fabrica e vende pão. Qual CNAE uso e como pago menos imposto?". A skill é ativada sozinha. Também é possível chamá-la com `/cnae-facil:cnae-facil`.

## Configuração

Nenhuma. O plugin não usa chaves, senhas nem conexões externas: todos os dados oficiais estão dentro dele.

## Aviso

As recomendações são informativas e não substituem um contador.

Projeto, fontes e licença: https://github.com/Lucasp74/cnae-facil
