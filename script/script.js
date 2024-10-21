// Declaração do objeto textos
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

    Seguimos a abertura do seu chamado no protocolo: {{PROTOCOLO}} 

    Porém identificamos que não existem informações o suficiente para seguir a análise de seu chamado. 
    Pedimos que os senhores nos respondam com as seguintes informações, por gentileza.
    `,

    emailProtocolo: `
    Prezados,

    Informo que foi gerado o protocolo: {{PROTOCOLO}}, e que seu caso foi enviado para a equipe de analistas. Logo mais retornaremos com atualizações sobre o seu caso.
    `,

    falhaEletricaOperacional: `
    Prezados, 

    Verificamos que houve uma falha elétrica no local, porém o equipamento já se encontra operacional, poderia validar por gentileza?

    Segue protocolo do chamado: {{PROTOCOLO}}`,

    cancelamentoChamado: `
    Prezados,

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
const numeroChamadoInput = document.getElementById('numeroChamado'); 
const btnGerarTexto = document.getElementById('gerarTexto'); // Novo botão para gerar texto

// Inicializa o botão de gerar texto como oculto
btnGerarTexto.style.display = 'none';

// Função para validar o formato do protocolo
function validarProtocolo(protocolo) {
    const regex = /^\d{8}-\d{5}$/; // Formato: DDMMAAAA-XXXXX
    return regex.test(protocolo);
}

// Função para validar o número do chamado
function validarNumeroChamado(chamado) {
    const regex = /^\d{8}-\d{5}$/; // Formato: DDMMAAAA-XXXXX
    return regex.test(chamado);
}

// Função para verificar se os campos estão preenchidos corretamente
function verificarCampos() {
    const protocolo = inputProtocolo.value;
    const tipoTexto = selectTexto.value;

    if (validarProtocolo(protocolo) && tipoTexto) {
        btnGerarTexto.style.display = 'block'; // Mostra o botão se os campos estiverem corretos
    } else {
        btnGerarTexto.style.display = 'none'; // Esconde o botão caso contrário
    }
}

// Adiciona eventos de input e change para monitorar alterações nos campos
inputProtocolo.addEventListener('input', verificarCampos);
selectTexto.addEventListener('change', verificarCampos);

// Adiciona o evento para mostrar/esconder o campo "Número do Chamado"
selectTexto.addEventListener('change', () => {
    const tipoTexto = selectTexto.value;

    if (tipoTexto === 'cancelamentoChamado') {
        cancelamentoDiv.style.display = 'block';  
    } else {
        cancelamentoDiv.style.display = 'none';  
    }
});

// Função para gerar o texto
btnGerarTexto.addEventListener('click', () => {
    const tipoTexto = selectTexto.value;
    const numeroChamado = numeroChamadoInput.value;
    const protocolo = inputProtocolo.value;

    if (tipoTexto === 'cancelamentoChamado' && numeroChamado) {
        if (!validarProtocolo(protocolo) || !validarNumeroChamado(numeroChamado)) {
            alertMessage.innerHTML = 'Formato inválido! Use DDMMAAAA-XXXXX.';
            alertMessage.style.display = 'block';

            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 2000);
            return; // Saia da função se a validação falhar
        }

        const texto = textos.cancelamentoChamado
            .replace('{{CHAMADO}}', numeroChamado)
            .replace('{{PROTOCOLO}}', protocolo);

        textareaTextoGerado.value = texto;

    } else if (tipoTexto) { // Se um tipo de texto foi selecionado
        if (!validarProtocolo(protocolo)) {
            alertMessage.innerHTML = 'Formato inválido para o protocolo! Use DDMMAAAA-XXXXX.';
            alertMessage.style.display = 'block';

            setTimeout(() => {
                alertMessage.style.display = 'none';
            }, 2000);
            return; // Saia da função se a validação falhar
        }

        // Gera o texto com o protocolo
        const texto = textos[tipoTexto].replace('{{PROTOCOLO}}', protocolo);
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
    showAlert('Texto copiado!');
});

// Função para mostrar alerta com mensagem personalizada
function showAlert(message) {
    alertMessage.innerHTML = message;
    alertMessage.style.display = 'block'; 
    setTimeout(() => {
        alertMessage.style.display = 'none'; 
    }, 2000);
}
