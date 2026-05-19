# 💰 SmartCash — Gerenciador Financeiro Pessoal

O **SmartCash** é uma aplicação web leve, moderna e responsiva voltada para o gerenciamento de finanças pessoais em tempo real. Desenvolvido utilizando o paradigma de Single Page Application (SPA) com JavaScript Vanilla puro, o sistema permite que usuários registrem suas receitas e despesas, visualizem o impacto imediato no saldo líquido através de componentes visuais reativos com cores dinâmicas e contem com a persistência estável de seus dados diretamente no dispositivo local.

O projeto foi projetado com foco em alta performance, acessibilidade e usabilidade (UI/UX), utilizando uma paleta de cores em tons pastel que minimiza a fadiga visual e maximiza a intuitividade do dashboard financeiro.



## 🚀 Link de Acesso

A aplicação está publicada e pronta para uso através do GitHub Pages:
🔗 **[Acessar o SmartCash](https://yslander.github.io/smartcash/)**



## 📑 Índice
1. [Especificação de Requisitos](#-especificação-de-requisitos)
   - [Requisitos Funcionais (RF)](#requisitos-funcionais-rf)
   - [Requisitos Não Funcionais (RNF)](#requisitos-não-funcionais-rnf)
2. [Arquitetura e Funcionamento do Sistema](#-arquitetura-e-funcionamento-do-sistema)
3. [Guia de Utilização Passo a Passo](#-guia-de-utilização-passo-a-passo)
4. [Práticas Recomendadas de Desenvolvimento](#-práticas-recomendadas-de-desenvolvimento)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Estrutura do Repositório](#-estrutura-do-repositório)



## 📋 Especificação de Requisitos

A engenharia de requisitos do SmartCash foi estruturada para garantir que a aplicação atenda perfeitamente aos objetivos de negócio e proporcione uma experiência técnica robusta e resiliente.

### Requisitos Funcionais (RF)
Os Requisitos Funcionais descrevem as ações, comportamentos e recursos que o software deve oferecer diretamente ao usuário final.

* **RF-001: Registro de Transações:** O sistema deve permitir a entrada de novas transações financeiras por meio de um formulário contendo: descrição textual, valor numérico decimal positivo e tipo de movimentação (Entrada ou Saída).
* **RF-002: Validação de Campos Obrigatórios:** O sistema deve impedir o envio de dados vazios ou nulos, utilizando mecanismos nativos para alertar o usuário sobre campos não preenchidos antes de processar a requisição.
* **RF-003: Listagem Dinâmica (Histórico):** O sistema deve exibir um histórico cronológico de todas as transações adicionadas, atualizando a interface em tempo real (sem necessidade de recarregamento da página).
* **RF-004: Cálculo Automatizado de Totais:** O sistema deve recalcular instantaneamente os valores consolidados de:
    * *Total de Entradas:* Somatória de todas as movimentações do tipo "+".
    * *Total de Saídas:* Somatória de todas as movimentações do tipo "-".
    * *Saldo Atual:* Diferença matemática entre o Total de Entradas e o Total de Saídas.
* **RF-005: Sinalização Visual de Estados:** O sistema deve modificar dinamicamente a identidade visual dos componentes com base nos dados:
    * Linhas de Entrada e Card de Entradas com fundo verde sutil (`#e6f7ee`).
    * Linhas de Saída e Card de Saídas com fundo vermelho sutil (`#fdebee`).
    * Card de Saldo Geral alternando dinamicamente entre verde (se $\ge 0$) ou vermelho (se $< 0$).
* **RF-006: Exclusão de Itens (Lixeira):** O usuário deve poder remover qualquer transação individual do histórico clicando em um botão de exclusão. O sistema deve expurgar o item e atualizar imediatamente todos os cálculos da tela.
* **RF-007: Persistência Permanente Local:** Toda alteração na lista de transações (inclusão ou exclusão) deve ser gravada automaticamente no dispositivo do usuário, garantindo que os dados não sumam ao fechar a aba ou atualizar a página ($F5$).

### Requisitos Não Funcionais (RNF)
Os Requisitos Não Funcionais determinam as propriedades, características de qualidade e restrições técnicas globais do sistema.

* **RNF-001: Arquitetura sem Frameworks (Vanilla Architecture):** O core da aplicação deve ser construído puramente com HTML5, CSS3 e JavaScript Moderno (ES6+), proibindo o uso de dependências pesadas, frameworks (React, Angular) ou bibliotecas de terceiros para manipulação do DOM.
* **RNF-002: Persistência sem Backend (Serverless Client-Side):** A persistência de dados deve ser resolvida exclusivamente no lado do cliente utilizando a API do `LocalStorage`, eliminando a dependência de bancos de dados relacionais hospedados ou conexões de rede externas.
* **RNF-003: Design Responsivo (Multiplataforma):** A interface do usuário deve ser projetada utilizando técnicas modernas de layout (`CSS Grid` e `Flexbox`), adaptando-se automaticamente a qualquer resolução de tela (smartphones, tablets, notebooks e desktops) sem quebras de layout.
* **RNF-004: Performance Elevada e Baixa Latência:** A manipulação do DOM deve ser otimizada para garantir que operações de renderização e filtragem ocorram em tempo de execução imediato ($\le 16	ext{ms}$, mantendo uma taxa estável de 60 FPS na transição de elementos).
* **RNF-005: Formatação Regionalizada:** Todos os valores numéricos devem ser convertidos na interface para a moeda local brasileira (Real — `R$`), forçando o travamento de duas casas decimais e trocando o separador de ponto americano por vírgula.
* **RNF-006: Versionamento Semântico e Histórico Limpo:** O projeto deve utilizar Git para o controle de versão, com commits granulares divididos por marcos de entrega claros e documentados.



## 🧠 Arquitetura e Funcionamento do Sistema

O SmartCash adota um fluxo unidirecional de estado focado na memória RAM e sincronizado de forma assíncrona com o armazenamento físico do navegador:

```
[ Usuário interage com o Formulário ]
                │
                ▼
[ Evento 'submit' capturado no JavaScript ]
                │
                ▼
[ Validação via HTML5 / Higienização de Strings (.trim()) ]
                │
                ▼
[ Geração de Objeto com ID Único (Date.now()) e Tipo Correto ]
                │
                ▼
[ Atualização do Estado Global (Array 'transacoes') ]
        │               │               │
        ▼               ▼               ▼
[.reduce() Computa] [.forEach() Renderiza] [JSON.stringify()]
[Novos Totais de ] [Novas Tags <li> no  ] [Grava no        ]
[Saldo e Cores   ] [Extrato do HTML     ] [LocalStorage    ]
```

1.  **Gerenciamento de Estado:** O estado central da aplicação é um array de objetos JavaScript chamado `transacoes`. Cada objeto representa uma ficha cadastral estruturada contendo: `id`, `descricao`, `valor` e `tipo`.
2.  **Abstração Matemática:** O cálculo das parciais de finanças não utiliza variáveis globais acumuladoras expostas a mutações erráticas. Ele faz uso do método funcional `.reduce()`, que varre o estado central e condensa a matriz de objetos em um único float consolidado de forma pura e performática.
3.  **Delegação Dinâmica de Eventos:** Para otimizar o uso de memória, os botões de exclusão (lixeiras) gerados dinamicamente não recebem ouvintes individuais. O sistema aplica um único `addEventListener` na lista pai (`<ul>`), capturando os cliques por borbulhamento (*event bubbling*) e extraindo o identificador por meio de atributos customizados `data-id`.



## 🛠️ Guia de Utilização Passo a Passo

Para utilizar o SmartCash no seu dia a dia, siga as instruções simples abaixo:

### 1. Cadastrando uma Receita (Ganho)
1. No campo **Descrição**, digite a origem do dinheiro (Ex: `Salário Mensal`, `Venda de Notebook`, `Freela`).
2. No campo **Valor (R$)**, insira a quantia recebida (Ex: `3500.00`). Não é necessário digitar o símbolo R$.
3. No seletor de **Tipo**, selecione a opção **Entrada (+)**.
4. Clique no botão **Adicionar Transação**. 
   * *Resultado:* O card "Entradas" e o "Saldo Atual" subirão imediatamente, e o card de Saldo adotará a cor verde. O item constará no histórico com fundo verde pastel.

### 2. Cadastrando uma Despesa (Gasto)
1. No campo **Descrição**, insira o nome do gasto (Ex: `Conta de Luz`, `Supermercado`, `Combustível`).
2. No campo **Valor (R$)**, insira a quantia gasta (Ex: `120.50`).
3. No seletor de **Tipo**, selecione a opção **Saída (-)**.
4. Clique no botão **Adicionar Transação**.
   * *Resultado:* O card "Saídas" subirá, o "Saldo Atual" diminuirá de forma proporcional e a linha no histórico exibirá um tom vermelho sutil. Se as suas saídas superarem as entradas, o card de Saldo Geral mudará automaticamente para a cor vermelha de alerta.

### 3. Excluindo um Registro Incorreto
1. Vá até a seção **Histórico** na parte inferior da tela.
2. Identifique a transação que deseja remover.
3. Clique no botão cinza com o ícone da **lixeira** ($	ext{}$) localizado no canto direito da linha.
   * *Resultado:* O item desaparecerá da tela imediatamente e todos os valores do painel superior serão recalculados na mesma hora.

### 4. Testando a Persistência (Memória)
1. Insira duas ou três movimentações no sistema.
2. Atualize a página pressionando a tecla **F5** ou feche a aba do seu navegador.
3. Abra a aplicação novamente.
   * *Resultado:* Você notará que o histórico e os cartões de resumo continuam exatamente no mesmo estado em que você os deixou.



## 📅 Planejamento de Desenvolvimento

| Descrição Técnica | Status |
| :--- | :--- | :--- |
| Estruturação semântica (HTML5) e design fluido (CSS3) | Concluído 🚀 |
| Motor de processamento JavaScript, listeners de formulário e reatividade visual | Concluído 🚀 |
| Persistência estável com a API LocalStorage do navegador | Concluído 🚀 |
| Ciclo CRUD com delegação de eventos para exclusão reativa de itens | Concluído 🚀 |
| Disponível em [text](https://github.com/users/Yslander/projects/1)

## 💎 Práticas Recomendadas de Desenvolvimento

O SmartCash foi codificado sob rígidos padrões de excelência de engenharia de software para garantir que o código fonte permaneça limpo, sustentável e fácil de escalar por qualquer equipe de desenvolvimento.

### 1. Separação Estrita de Responsabilidades (SoC)
Os três pilares da aplicação foram completamente isolados em arquivos distintos, evitando o acoplamento espaguete comum em projetos iniciantes:
* `index.html` possui a única e estrita função de definir o esqueleto semântico estrutural.
* `style.css` centraliza exclusivamente as regras estéticas, variáveis de cores e comportamento responsivo.
* `script.js` detém toda a responsabilidade de inteligência lógica, cálculos de estado e manipulação de dados.

### 2. Higienização e Sanitização de Entradas (Data Cleansing)
Para mitigar erros de inserção por parte dos usuários, o JavaScript processa ativamente os dados antes de inseri-los no array:
* Uso do método `.trim()` para remover espaços em branco desnecessários inseridos acidentalmente nas extremidades do texto da descrição.
* Conversão tipada estrita através do `parseFloat()` para neutralizar o comportamento padrão do navegador de ler inputs numéricos como strings, blindando o software contra erros de concatenação bizarros (como $10 + 10 = 1010$).

### 3. Imutabilidade e Paradigma Funcional no JavaScript
Evitou-se o uso de estruturas de repetição imperativas tradicionais (como laços `for` ou `while`), que dependem do controle manual de índices e são mais suscetíveis a bugs de vazamento de escopo. Em seu lugar, adotou-se o paradigma funcional com **High-Order Array Methods**:
* `.filter()`: Garante imutabilidade ao gerar novos arrays filtrados ao invés de destruir ou modificar diretamente o array original na memória durante deleções ou separação de tipos.
* `.reduce()`: Centraliza e isola o comportamento matemático eliminando loops externos e variáveis acumuladoras temporárias instáveis.
* `.forEach()`: Abstrai a iteração de desenho do DOM de forma limpa e direta.

### 4. Prevenção Contra Efeitos Colaterais na Interface (UI Flashes)
Durante a renderização do histórico, a função executa preventivamente a instrução `listaTransacoes.innerHTML = ''`. Essa higienização zera o painel de exibição antes de desenhar o estado atualizado do array. Essa abordagem evita o bug comum de duplicação de registros antigos na tela ao adicionar um novo elemento à lista.

### 5. Versionamento Estratégico com Git e GitHub
O ciclo de vida do desenvolvimento foi mapeado utilizando ramificações de commits granulares organizados em marcos claros (*milestones*), facilitando processos de auditoria de código e reversão de versões em ambientes de produção:
* Criação da infraestrutura semântica (HTML) e design fluído (CSS).
* Implementação do motor de processamento, listeners de formulário e reatividade visual condicional.
* Desenvolvimento do ecossistema de armazenamento assíncrono com a API LocalStorage do navegador.
* Finalização do ciclo de CRUD local com a delegação de eventos para exclusão reativa de itens.



## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica, acessibilidade e validação declarativa de formulários com atributos `required`.
* **CSS3:** Estilização modular com variáveis globais nativas (`:root`), layouts fluídos com `Flexbox` / `Grid Media Queries`, e transições suaves de animação.
* **JavaScript (ES6+):** Motor lógico, manipulação de eventos, gerenciamento funcional de arrays, armazenamento nativo em disco e controle avançado de elementos do DOM.
* **FontAwesome (v6):** Provedor oficial da biblioteca de ícones vetoriais de alta resolução para as lixeiras e cartões informativos.



## 📂 Estrutura do Repositório

```
smartcash/
│
├── index.html          # Esqueleto de marcação estrutural e formulários
├── style.css           # Arquitetura de estilos, variáveis e responsividade
├── script.js           # Core lógico, manipulação de DOM e persistência
└── README.md           # Documentação técnica completa do ecossistema
```


Desenvolvido com foco em código limpo, performance e alta usabilidade por **Yslander**. 🚀
