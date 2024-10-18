
const textos = {
    falhaEletrica: `# Falha elétrica #

Prezados, boa noite.

Verificamos que o equipamento está com alarme de falha elétrica, poderia verificar e validar essa informação por gentileza?

Segue protocolo do chamado `,

    equipamentoOk: `# Equipamento ok #

Prezados, boa noite!

Verificamos que o equipamento se encontra operacional, poderia validar por gentileza?

Segue protocolo do chamado `,

    enviadoCampo: `# Enviado para CAMPO #

Prezados, boa tarde.

Seguimos a abertura de seu chamado no protocolo:

Informamos que foi encontrada uma falha no equipamento, técnico em campo foi acionado e enviado até o local realizando reconfiguração do equipamento e restabelecendo a conexão.

Qualquer dúvida estamos à disposição.`,

informacoesInsuficientes: `# Informações insuficientes. #

Prezados, boa tarde.

Seguimos a abertura do seu chamado no protocolo: 

Porem identificamos que não existem informações o suficiente para seguir a análise de seu chamado. Pedimos que os senhores nos respondam com as seguintes informações, por gentileza:
`,

    cancelamentoChamado: `# Chamado Cancelado #

Prezados, bom dia!

Informo que essa solicitação está sendo tratada no chamado #24092024-32771 - INC0225576 - [High] LINK-DEDICADO-WIRELINK-CE-ESTACIO-IGUATU-186.225.38.219. 

Por isso, o chamado que foi recentemente aberto 26092024-18714 será cancelado.
`,

    emailProtocolo: `# E-mail com protocolo #

Prezados, boa tarde!

Informo que foi gerado o protocolo: 17102024-76174, e que seu caso foi enviado para a equipe de analistas. Logo mais retornaremos com atualizações sobre o seu caso.
`,

    falhaEletricaOperacional: `# Falha elétrica mas operacional #

Prezados, boa tarde.

Verificamos que houve uma falha elétrica no local, porém o equipamento já se encontra operacional, poderia validar por gentileza?

Segue protocolo do chamado 26092024-82853.
`
};

//Cada uma dessas linhas está pegando um elemento HTML pelo seu id usando document.getElementById.
const inputProtocolo = document.getElementById('protocolo');
const selectTexto = document.getElementById('texto');
const textareaTextoGerado = document.getElementById('textoGerado');
const btnCopiarTexto = document.getElementById('copiarTexto');
const alertMessage = document.getElementById('alertMessage');


//Evento change: Um evento change é adicionado ao dropdown selectTexto. 
//Isso significa que toda vez que o usuário selecionar um novo tipo de mensagem, o código dentro dessa função será executado.

selectTexto.addEventListener('change', () => {

    const protocolo = inputProtocolo.value; //pega o valor do protocolo digitado
    const tipoTexto = selectTexto.value;   //Pega o valor selecionado no dropdown

    if (tipoTexto && textos[tipoTexto]) {
        textareaTextoGerado.value = textos[tipoTexto] + protocolo;
    } else {
        textareaTextoGerado.value = '';
    }
});

btnCopiarTexto.addEventListener('click', () => { //Esse evento é adicionado ao botão btnCopiarTexto
    textareaTextoGerado.select();
    document.execCommand('copy');
    showAlert();
});

function showAlert() {
    alertMessage.style.display = 'block';
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 2000);
}
