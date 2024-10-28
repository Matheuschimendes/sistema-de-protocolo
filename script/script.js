
        // Declaração do objeto textos
        const textos = {
            falhaEletrica: `
                Prezados,

                Informamos que o equipamento está com alarme de falha elétrica.

                Segue protocolo do atendimento.
            `,
            equipamentoOk: `
                Prezados,

                Informamos que o equipamento está OK e operacional. O atendimento foi finalizado.

                Segue protocolo do atendimento.
            `,
            enviadoCampo: `
                Prezados,

                O chamado foi enviado para campo para verificação.

                Segue protocolo do atendimento.
            `,
            informacoesInsuficientes: `
                Prezados,

                Infelizmente não conseguimos seguir com a solicitação, pois as informações estão insuficientes. Favor, nos encaminhar as informações necessárias para que possamos atender.

                Segue protocolo do atendimento.
            `,
            cancelamentoChamado: `
                Prezados,

                O chamado foi cancelado conforme solicitado.

                Segue protocolo do atendimento.
            `,
            emailProtocolo: `
                Prezados,

                O protocolo foi enviado para o e-mail solicitado.

                Segue protocolo do atendimento.
            `,
            falhaEletricaOperacional: `
                Prezados,

                O equipamento está com alarme de falha elétrica, porém ainda se encontra operacional.

                Segue protocolo do atendimento.
            `
        };

        // Exibir ou ocultar o campo texto baseado no tipo de mensagem
        const tipoMensagem = document.getElementById("tipoMensagem");
        const textoSelect = document.getElementById("texto");
        const cancelamentoDiv = document.getElementById("cancelamentoDiv");
        const gerarTextoButton = document.getElementById("gerarTexto");
        const textoGerado = document.getElementById("textoGerado");

        // Objeto para textos de carimbo
        const textosCarimbo = {
            whatsappNocMassiva: function(inputs) {
                return `
                    # Carimbo WhatsApp - NOC MASSIVA

                    UNIDADE: ${inputs.unidade}
                    OLT: ${inputs.olt}
                    SLOT: ${inputs.slot}
                    PON: ${inputs.pon}
                    Serial da ONU: ${inputs.serialONU}
                    Contrato: ${inputs.contrato}
                `;
            },
            transferenciaCmoReparo: function(inputs) {
                return `
                    # Carimbo Transferência - CMO REPARO

                    Análise: ${inputs.analise}
                    Orientações: ${inputs.orientacoes}
                    Endereço: ${inputs.enderecoCmoReparo}
                    Horário de Funcionamento: ${inputs.horarioFuncionamento}
                    Telefone: ${inputs.telefoneCmoReparo}
                    E-mail: ${inputs.emailCmoReparo}
                `;
            },
            transferenciaCaParceiro: function(inputs) {
                return `
                    # Carimbo Transferência - CA - PARCEIRO

                    Análise: ${inputs.analiseParceiro}
                    Parceiro: ${inputs.parceiro}
                    Orientação: ${inputs.orientacaoParceiro}
                    Endereço: ${inputs.enderecoParceiro}
                    Horário de Funcionamento: ${inputs.horarioFuncionamentoParceiro}
                    Telefone: ${inputs.telefoneParceiro}
                `;
            }
        };

        tipoMensagem.addEventListener("change", function () {
            if (this.value === "texto") {
                textoSelect.style.display = "block";
                cancelamentoDiv.style.display = "none";
            } else if (this.value === "carimbo") {
                textoSelect.style.display = "none";
                cancelamentoDiv.style.display = "none";
                openCarimboModal(); // Abre o modal ao selecionar carimbo
            } else {
                textoSelect.style.display = "none";
                cancelamentoDiv.style.display = "none";
            }
        });

        // Mostra a div de cancelamento quando necessário
        textoSelect.addEventListener("change", function () {
            if (this.value === "cancelamentoChamado") {
                cancelamentoDiv.style.display = "block";
            } else {
                cancelamentoDiv.style.display = "none";
            }
        });

        // Gerar texto baseado na seleção
        gerarTextoButton.addEventListener("click", function () {
            const selectedTexto = textoSelect.value;
            if (tipoMensagem.value === "texto") {
                // Para textos comuns
                textoGerado.value = textos[selectedTexto] || "";
            } else if (tipoMensagem.value === "carimbo") {
                // Para carimbos
                const selectedCarimbo = selectCarimbo.value;
                const inputs = {};
                const inputFields = document.querySelectorAll(`#${selectedCarimbo + "Inputs"} input`);
                inputFields.forEach(input => {
                    inputs[input.id] = input.value;
                });

                textoGerado.value = textosCarimbo[selectedCarimbo](inputs);
            }
        });

        // Copiar texto gerado
        const copiarTextoButton = document.getElementById("copiarTexto");
        const alertMessage = document.getElementById("alertMessage");

        copiarTextoButton.addEventListener("click", function () {
            textoGerado.select();
            document.execCommand("copy");
            alertMessage.style.display = "block";
            setTimeout(() => {
                alertMessage.style.display = "none";
            }, 2000);
        });

        // Modal para carimbo
        const carimboModal = document.getElementById("carimboModal");
        const closeModal = document.getElementById("closeModal");
        const selectCarimbo = document.getElementById("selectCarimbo");
        const carimboInputsDiv = document.getElementById("carimboInputsDiv");

        function openCarimboModal() {
            carimboModal.style.display = "block";
        }

        closeModal.onclick = function () {
            carimboModal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target === carimboModal) {
                carimboModal.style.display = "none";
            }
        }

        // Evento para seleção do carimbo
        selectCarimbo.addEventListener("change", function () {
            const selectedValue = this.value;

            // Esconde todos os inputs
            const inputsToHide = ["whatsappNocMassivaInputs", "transferenciaCmoReparoInputs", "transferenciaCaParceiroInputs"];
            inputsToHide.forEach(id => {
                document.getElementById(id).style.display = "none";
                // Limpa os valores de entrada para cada seção de entrada oculta
                document.querySelectorAll(`#${id} input`).forEach(input => input.value = "");
            });

            // Mostra o input correspondente
            if (selectedValue) {
                document.getElementById(selectedValue + "Inputs").style.display = "block";
                carimboInputsDiv.style.display = "block"; // Exibe o div de inputs
            } else {
                carimboInputsDiv.style.display = "none"; // Esconde o div de inputs
            }
        });

        // Confirmação do carimbo
        document.getElementById("confirmarCarimbo").addEventListener("click", function () {
            const selectedCarimbo = selectCarimbo.value;
            const inputs = Array.from(document.querySelectorAll(`#${selectedCarimbo + "Inputs"} input`));
            const values = inputs.map(input => `${input.placeholder}: ${input.value}`).join("\n");

            const textoComCarimbo = `
                Carimbo Selecionado: ${selectedCarimbo}
                ${values}
            `;
            alert(textoComCarimbo); // Exibe o texto com os dados do carimbo

            carimboModal.style.display = "none"; // Fecha o modal após a confirmação
        });

        // Reabrir o modal ao selecionar a opção de carimbo
        tipoMensagem.addEventListener("change", function () {
            if (this.value === "carimbo") {
                openCarimboModal(); // Abre o modal ao selecionar carimbo
            }
        });