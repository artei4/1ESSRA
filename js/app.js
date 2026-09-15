// Regra de negócio específica do formulário do Rock in Rio.

// 1. Mapeamento dos elementos do DOM
const campoNome = document.getElementById('campoNome');
const campoCpf = document.getElementById('campoCpf');
const campoEmail = document.getElementById('campoEmail');
const campoCelular = document.getElementById('campoCelular');
const campoArtista = document.getElementById('campoArtista');
const listaArtistas = document.getElementById('listaArtistas');
const btnCadastrar = document.getElementById('btnCadastrar');
const divResultado = document.getElementById('painelResultado');

// 2. Popula o Datalist com a massa de dados do festival.
function popularDatalistArtistas(lista) {
    listaArtistas.innerHTML = '';
    lista.forEach((artista) => {
        const option = document.createElement('option');
        option.value = `[${artista.origem}] ${artista.nome} (${artista.estilo}) - ${artista.dia}`;
        listaArtistas.appendChild(option);
    });
}

// 3. Máscaras de CPF e celular.
campoCpf.addEventListener('input', function () {
    let valor = campoCpf.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campoCpf.value = valor;
});

campoCelular.addEventListener('input', function () {
    let valor = campoCelular.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    campoCelular.value = valor;
});

// 4. Processamento do formulário e geração do comprovante.
btnCadastrar.addEventListener('click', function () {
    const camposObrigatorios = [campoNome, campoCpf, campoEmail, campoArtista];
    let temCampoVazio = false;

    camposObrigatorios.forEach((campo) => {
        if (campo.value.trim() === '') {
            campo.classList.add('campo-erro');
            temCampoVazio = true;
        } else {
            campo.classList.remove('campo-erro');
        }
    });

    if (temCampoVazio) {
        divResultado.className = 'msg-erro';
        divResultado.innerText = 'Atenção: Preencha todos os campos obrigatórios em destaque!';
        return;
    }

    if (!validarCPF(campoCpf.value)) {
        campoCpf.classList.add('campo-erro');
        divResultado.className = 'msg-erro';
        divResultado.innerText = 'Atenção: O CPF digitado é inválido!';
        return;
    }

    campoCpf.classList.remove('campo-erro');

    const dadosReserva = {
        nome: campoNome.value.trim(),
        cpf: campoCpf.value.trim(),
        email: campoEmail.value.trim(),
        celular: campoCelular.value.trim(),
        artista: campoArtista.value.trim()
    };

    const conteudoComprovante = [
        '=== PRÉ-CADASTRO DE INGRESSO ROCK IN RIO ===',
        `Nome: ${dadosReserva.nome}`,
        `CPF: ${dadosReserva.cpf}`,
        `E-mail: ${dadosReserva.email}`,
        `Celular: ${dadosReserva.celular || 'Não informado'}`,
        `Atração Selecionada: ${dadosReserva.artista}`,
        '==========================================='
    ].join('\n');

    const nomeSeguro = dadosReserva.nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    salvarDadosEmTXT(conteudoComprovante, `ingresso_${nomeSeguro || 'usuario'}.txt`);

    divResultado.className = 'msg-sucesso';
    divResultado.innerText = `Intenção de compra registrada com sucesso para: ${dadosReserva.artista}! Comprovante exportado.`;
});

// Inicialização da aplicação.
popularDatalistArtistas(artistasData);
