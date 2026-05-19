// 1. Mapeamento do Formulário e das Entradas de Dados (Inputs)
const form = document.querySelector('#form-transacao');
const inputDescricao = document.querySelector('#descricao');
const inputValor = document.querySelector('#valor');
const inputTipo = document.querySelector('#tipo');

// 2. Mapeamento dos Cards de Resumo
const cardEntradas = document.querySelector('#total-entradas');
const cardSaidas = document.querySelector('#total-saidas');
const cardSaldoTotal = document.querySelector('#saldo-total');

// 3. Mapeamento da Lista do Extrato
const listaTransacoes = document.querySelector('#lista-transacoes');

// 4. Nossa lista de transações (Começa vazia)
let transacoes = [];

// 5. Escutar o momento em que o usuário envia o formulário
form.addEventListener('submit', function(evento) {
    // Evita que a página recarregue e limpe os dados da tela
    evento.preventDefault();

    // Capturando os valores exatos digitados nas caixinhas
    const descricao = inputDescricao.value.trim();
    const valor = parseFloat(inputValor.value);
    const tipo = inputTipo.value;

    // 6. Criando a ficha cadastral (Objeto) da transação
    const novaTransacao = {
        id: Date.now(), // Gera um ID único baseado no tempo atual
        descricao: descricao,
        valor: valor,
        tipo: tipo
    };

    // 7. Empurrando a nova transação para dentro da nossa lista (Array)
    transacoes.push(novaTransacao);

    // Executa a matemática e atualiza os cards da tela
    atualizarResumo();

    // Redesenha a lista atualizada na tela do usuário
    renderizarLista();

    // Limpa os campos do formulário para o usuário digitar a próxima
    form.reset();
});

// 8. Função para calcular os totais e atualizar os cards na tela
function atualizarResumo() {
    // A) Somando todas as Entradas (+) com .reduce()
    const totalEntradas = transacoes
        .filter(t => t.tipo === '+')
        .reduce((acumulador, t) => acumulador + t.valor, 0);

    // B) Somando todas as Saídas (-) com .filter() e .reduce()
    const totalSaidas = transacoes
        .filter(t => t.tipo === '-')
        .reduce((acumulador, t) => acumulador + t.valor, 0);

    // C) Calculando o Saldo Líquido (Entradas menos Saídas)
    const saldoTotal = totalEntradas - totalSaidas;

    // D) Injetando os valores calculados diretamente no HTML (Formatados em R$)
    cardEntradas.textContent = `R$ ${totalEntradas.toFixed(2).replace('.', ',')}`;
    cardSaidas.textContent = `R$ ${totalSaidas.toFixed(2).replace('.', ',')}`;
    cardSaldoTotal.textContent = `R$ ${saldoTotal.toFixed(2).replace('.', ',')}`;

    // E) Lógica de sinalização de cor dinâmica para o Card de Saldo Atual
    const cardTotalContainer = cardSaldoTotal.closest('.card'); // Captura a caixinha inteira do card

    if (saldoTotal >= 0) {
        // Se o saldo for positivo, usa o fundo verde que combinamos
        cardTotalContainer.style.backgroundColor = 'var(--cor-entrada)';
    } else {
        // Se o saldo for negativo, muda o fundo para o vermelho de alerta
        cardTotalContainer.style.backgroundColor = 'var(--cor-saida)';
    }
}

// 9. Função para desenhar a lista de transações na tela
function renderizarLista() {
    // Limpa a lista no HTML antes de desenhar para não duplicar os itens antigos
    listaTransacoes.innerHTML = '';

    // Passa de item em item da nossa lista (Array) usando o .forEach()
    transacoes.forEach(function(transacao) {
        // A) Cria o elemento de lista (<li>) na memória do JavaScript
        const li = document.createElement('li');

        // B) Descobre se a transação é positiva ou negativa para aplicar a classe certa
        const classeCSS = transacao.tipo === '+' ? 'positivo' : 'negativo';
        li.classList.add('item-transacao', classeCSS);

        // C) Cria o sinal visual (+ ou -) para exibir antes do valor
        const sinal = transacao.tipo === '+' ? '' : '- ';

        // D) Monta o esqueleto interno de textos e o botão de lixeira dentro do <li>
        li.innerHTML = `
            <span>${transacao.descricao}</span>
            <span>${sinal}R$ ${transacao.valor.toFixed(2).replace('.', ',')}</span>
            <button class="btn-excluir"><i class="fa-solid fa-trash"></i></button>
        `;

        // E) Pega essa linha montada e joga ela para dentro da nossa lista real na tela (<ul>)
        listaTransacoes.appendChild(li);
    });
}