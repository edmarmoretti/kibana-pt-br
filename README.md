# kibana-pt-br
Kibana com a interface de painéis traduzido para o português do Brasil

Código fonte: https://github.com/edmarmoretti/kibana

## Principais alterações feitas no código original

* Tradução para pt-BR da interface pública dos painéis.

* Opção para definir notas de rodapé, inclusive com links, nos quadros dos painéis.

* Opção para definir resumos nos quadros dos painéis.

* Ordenamento da lista de opções nos filtros que utilizem siglas de meses do ano.

* Ordenamento da lista de opções nos filtros que utilizam números.

* Remoção de ',00' nas tabelas, labels internos dos gráficos e tooltips.

* Cálculo da altura da página do painel e envio ao cliente web via postmessage.

* Posicionamento dos títulos dos eixos à esquerda (eixo horizontal) e ao final do eixo (eixo vertical).

* Mudança na cor dos títulos dos eixos para uso de uma cor mais clara.

* Remoção da linha dos eixos verticais em gráficos do tipo barras horizontais.

* Correção na inclusão dos labels internos, evitando ultrapassar os limites das margens e a sobreposição.

* Alteração no comportamento da opção de "split charts", bloqueando a apresentação de mais de um gráfico quando os dados, para o primeiro gráfico, não estiverem com todas as séries preenchidas.

* Remoção da string "all docs" mostrada em alguns tipos de gráfico.

* Maior espaço para inclusão dos títulos dos quadros.

* Maior espaço para apresentação dos itens da legenda.

* Opção para exportar um gráfico em PNG.

* Alteração no layout do quadro com a lista de controles (filtros) para permitir expandir/recolher a lista.

* Remoção da string órfã "string - " nos grandes números quando o título é definido como um espaço em branco.

* Alteração na forma como a remoção de "00" é feita nos tooltips, mantendo o ",00" quando o título da coluna é terminada com "(R$)".
  
* Remoção das opções de filtragem existentes nas legendas dos gráficos e das tabelas.









