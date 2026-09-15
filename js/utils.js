// Funções genéricas e reutilizáveis da aplicação.

/** Valida matematicamente um CPF brasileiro. */
function validarCPF(cpf) {
    const cpfNumerico = cpf.replace(/\D/g, '');
    if (cpfNumerico.length !== 11 || /^(\d)\1{10}$/.test(cpfNumerico)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpfNumerico.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpfNumerico.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpfNumerico.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === Number(cpfNumerico.charAt(10));
}

/** Gera e baixa um arquivo de texto usando Blob. */
function salvarDadosEmTXT(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
