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

    Informamos que não foi possível identificar a origem da falha, precisamos de mais informações para seguirmos com a análise, poderiam nos informar?

    Segue protocolo do chamado: {{PROTOCOLO}}`,

    cancelamentoChamado: `
    Prezados,

    Informamos que o chamado de número {{NUMERO_CHAMADO}} foi cancelado. 

    Segue protocolo do chamado: {{PROTOCOLO}}`,

    emailProtocolo: `
    Prezados,

    Agradecemos pelo seu contato. O protocolo gerado para sua solicitação é: {{PROTOCOLO}}. 

    Caso tenha mais dúvidas, estamos à disposição.`,

    falhaEletricaOperacional: `
    Prezados,

    Verificamos que o equipamento está com alarme de falha elétrica, porém encontra-se operacional. Poderiam validar essa informação por gentileza?

    Segue protocolo do chamado: {{PROTOCOLO}}`
};

const tipoMensagemSelect = document.getElementById("tipoMensagem");
const textoSelect = document.getElementById("texto");
const cancelamentoDiv = document.getElementById("cancelamentoDiv");
const gerarTextoButton = document.getElementById("gerarTexto");
const textoGeradoTextarea = document.getElementById("textoGerado");
const copiarTextoButton = document.getElementById("copiarTexto");
const alertMessage = document.getElementById("alertMessage");

// Modal
const carimboModal = document.getElementById("carimboModal");
const closeModal = document.getElementById("closeModal");
const carimboSelect = document.getElementById("selectCarimbo");
const carimboInputsDiv = document.getElementById("carimboInputsDiv");

// Função para abrir o modal
function openModal() {
    carimboModal.style.display = "block";
}

// Função para fechar o modal
closeModal.onclick = function() {
    carimboModal.style.display = "none";
}

// Fecha o modal se o usuário clicar fora dele
window.onclick = function(event) {
    if (event.target === carimboModal) {
        carimboModal.style.display = "none";
    }
}

// Event listener para o tipo de mensagem
tipoMensagemSelect.addEventListener("change", function() {
    if (this.value === "texto") {
        textoSelect.style.display = "block";
        cancelamentoDiv.style.display = "none";
        carimboInputsDiv.style.display = "none";
    } else if (this.value === "carimbo") {
        textoSelect.style.display = "none";
        openModal(); // Abre o modal ao selecionar carimbo
        cancelamentoDiv.style.display = "none";
    } else {
        textoSelect.style.display = "none";
        cancelamentoDiv.style.display = "none";
        carimboInputsDiv.style.display = "none";
    }
});

// Event listener para o texto
textoSelect.addEventListener("change", function() {
    if (this.value === "cancelamentoChamado") {
        cancelamentoDiv.style.display = "block";
    } else {
        cancelamentoDiv.style.display = "none";
    }
});

// Event listener para o carimbo
carimboSelect.addEventListener("change", function() {
    const selectedValue = this.value;

    // Esconde todos os inputs
    const inputsToHide = ["whatsappNocMassivaInputs", "transferenciaCmoReparoInputs", "transferenciaCaParceiroInputs"];
    inputsToHide.forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    // Mostra o input correspondente
    if (selectedValue) {
        document.getElementById(selectedValue + "Inputs").style.display = "block";
        carimboInputsDiv.style.display = "block"; // Exibe o div de inputs
    } else {
        carimboInputsDiv.style.display = "none"; // Esconde o div de inputs
    }
});

// Gerar texto
gerarTextoButton.addEventListener("click", function() {
    const protocolo = document.getElementById("protocolo").value;
    let mensagemGerada = "";

    if (tipoMensagemSelect.value === "texto") {
        const textoEscolhido = textoSelect.value;
        if (textoEscolhido) {
            mensagemGerada = textos[textoEscolhido].replace("{{PROTOCOLO}}", protocolo);
            if (textoEscolhido === "cancelamentoChamado") {
                const numeroChamado = document.getElementById("numeroChamado").value;
                mensagemGerada = mensagemGerada.replace("{{NUMERO_CHAMADO}}", numeroChamado);
            }
        }
    } else if (tipoMensagemSelect.value === "carimbo") {
        const carimboEscolhido = carimboSelect.value;
        if (carimboEscolhido) {
            // Aqui você pode adicionar a lógica para gerar texto com base no carimbo
            mensagemGerada = "Carimbo escolhido: " + carimboEscolhido;
            // Adicionar lógica para preencher a mensagem gerada com dados dos inputs específicos.
            if (carimboEscolhido === "whatsappNocMassiva") {
                const unidade = document.getElementById("unidade").value;
                const olt = document.getElementById("olt").value;
                const slot = document.getElementById("slot").value;
                const pon = document.getElementById("pon").value;
                const serialONU = document.getElementById("serialONU").value;
                const contrato = document.getElementById("contrato").value;

                mensagemGerada = `
                Carimbo WhatsApp - NOC MASSIVA:
                Unidade: ${unidade}
                OLT: ${olt}
                Slot: ${slot}
                PON: ${pon}
                Serial ONU: ${serialONU}
                Contrato: ${contrato}
                `;
            } else if (carimboEscolhido === "transferenciaCmoReparo") {
                const analise = document.getElementById("analise").value;
                const orientacoes = document.getElementById("orientacoes").value;
                const enderecoCmoReparo = document.getElementById("enderecoCmoReparo").value;
                const horarioFuncionamento = document.getElementById("horarioFuncionamento").value;
                const telefoneCmoReparo = document.getElementById("telefoneCmoReparo").value;
                const emailCmoReparo = document.getElementById("emailCmoReparo").value;

                mensagemGerada = `
                Carimbo Transferência - CMO REPARO:
                Análise: ${analise}
                Orientações: ${orientacoes}
                Endereço: ${enderecoCmoReparo}
                Horário de Funcionamento: ${horarioFuncionamento}
                Telefone: ${telefoneCmoReparo}
                E-mail: ${emailCmoReparo}
                `;
            } else if (carimboEscolhido === "transferenciaCaParceiro") {
                const analiseParceiro = document.getElementById("analiseParceiro").value;
                const parceiro = document.getElementById("parceiro").value;
                const orientacaoParceiro = document.getElementById("orientacaoParceiro").value;
                const enderecoParceiro = document.getElementById("enderecoParceiro").value;
                const horarioFuncionamentoParceiro = document.getElementById("horarioFuncionamentoParceiro").value;
                const telefoneParceiro = document.getElementById("telefoneParceiro").value;
                const emailParceiro = document.getElementById("emailParceiro").value;

                mensagemGerada = `
                Carimbo Transferência - CA - PARCEIRO:
                Análise: ${analiseParceiro}
                Parceiro: ${parceiro}
                Orientação: ${orientacaoParceiro}
                Endereço: ${enderecoParceiro}
                Horário de Funcionamento: ${horarioFuncionamentoParceiro}
                Telefone: ${telefoneParceiro}
                E-mail: ${emailParceiro}
                `;
            }
        }
    }

    textoGeradoTextarea.value = mensagemGerada;
});

// Copiar texto
copiarTextoButton.addEventListener("click", function() {
    textoGeradoTextarea.select();
    document.execCommand("copy");
    alertMessage.style.display = "block";
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 2000);
});

// Confirmação de carimbo
document.getElementById("confirmarCarimbo").addEventListener("click", function() {
    const carimboEscolhido = carimboSelect.value;
    if (carimboEscolhido) {
        // Fecha o modal
        closeModal.click();
    }
});