
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

Segue protocolo do chamado: {{PROTOCOLO}}
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
        textareaTextoGerado.value = textos[tipoTexto].replace('{{PROTOCOLO}}',  protocolo);
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
