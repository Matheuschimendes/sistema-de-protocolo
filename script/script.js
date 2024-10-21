const textos = {
    falhaEletrica: `
Prezados,

Verificamos que o equipamento está com alarme de falha elétrica, poderia verificar e validar essa informação por gentileza?

Segue protocolo do chamado: {{PROTOCOLO}}`,

    equipamentoOk: `
Prezados, 

Verificamos que o equipamento se encontra operacional, poderia validar por gentileza?

Segue protocolo do chamado: {{PROTOCOLO}}`,

    enviadoCampo: `
Prezados, 

Seguimos a abertura de seu chamado no protocolo: {{PROTOCOLO}} 

Informamos que foi encontrada uma falha no equipamento, técnico em campo foi acionado e enviado até o local realizando reconfiguração do equipamento e restabelecendo a conexão.

Qualquer dúvida estamos à disposição.`,

    informacoesInsuficientes: `
Prezados, 

Seguimos a abertura do seu chamado no protocolo:  {{PROTOCOLO}} 

Porem identificamos que não existem informações o suficiente para seguir a análise de seu chamado. 
Pedimos que os senhores nos respondam com as seguintes informações, por gentileza.
`,

    emailProtocolo: `
Prezados,

Informo que foi gerado o protocolo:  {{PROTOCOLO}}, e que seu caso foi enviado para a equipe de analistas. Logo mais retornaremos com atualizações sobre o seu caso.
`,

    falhaEletricaOperacional: `
Prezados, 

Verificamos que houve uma falha elétrica no local, porém o equipamento já se encontra operacional, poderia validar por gentileza?

Segue protocolo do chamado: {{PROTOCOLO}}`,

    cancelamentoChamado: `
Prezados, bom dia!

Informo que essa solicitação está sendo tratada no chamado {{PROTOCOLO}}.

Por isso, o chamado que foi recentemente aberto {{CHAMADO}} será cancelado.
`
};

// Pegando os elementos do DOM
const inputProtocolo = document.getElementById('protocolo');
const selectTexto = document.getElementById('texto');
const textareaTextoGerado = document.getElementById('textoGerado');
const btnCopiarTexto = document.getElementById('copiarTexto');
const alertMessage = document.getElementById('alertMessage');
const cancelamentoDiv = document.getElementById('cancelamentoDiv');
const numeroChamadoInput = document.getElementById('numeroChamado'); // Correto aqui
const btnAtualizarTexto = document.getElementById('atualizarTexto');

// Evento para mostrar/esconder o campo "Número do Chamado" e o botão "Atualizar"
selectTexto.addEventListener('change', () => {
    const tipoTexto = selectTexto.value;

    if (tipoTexto === 'cancelamentoChamado') {
        cancelamentoDiv.style.display = 'block';  // Mostra o campo para o número do chamado
        btnAtualizarTexto.style.display = 'block';  // Mostra o botão "Atualizar"
    } else {
        cancelamentoDiv.style.display = 'none';  // Esconde o campo se não for "Chamado Cancelado"
        btnAtualizarTexto.style.display = 'none';  // Esconde o botão "Atualizar"
    }
});

// Função para atualizar o texto gerado
btnAtualizarTexto.addEventListener('click', () => {
    const tipoTexto = selectTexto.value;
    const numeroChamado = numeroChamadoInput.value;

    if (tipoTexto === 'cancelamentoChamado' && numeroChamado) {
        const protocolo = inputProtocolo.value;
        const texto = textos.cancelamentoChamado
            .replace('{{CHAMADO}}', numeroChamado)
            .replace('{{PROTOCOLO}}', protocolo);
        
        textareaTextoGerado.value = texto;
    } else {
        alertMessage.innerText = 'Por favor, preencha todos os campos necessários.';
        alertMessage.style.display = 'block';
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, 2000);
    }
});

// Função para copiar o texto gerado
btnCopiarTexto.addEventListener('click', () => {
    textareaTextoGerado.select();
    document.execCommand('copy');
    showAlert();
});

// Função para mostrar alerta de "Texto copiado"
function showAlert() {
    alertMessage.style.display = 'block'; // Exibe o alerta
    setTimeout(() => {
        alertMessage.style.display = 'none'; // Remove após 2 segundos
    }, 2000);
}
