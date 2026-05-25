(() => {
    "use strict";

    const STORAGE_KEYS = {
        history: "protocolador.history.v4",
        favorites: "protocolador.favorites.v4",
        form: "protocolador.form.v4",
        theme: "protocolador.theme.v1",
        sidebar: "protocolador.sidebar.v1",
        layout: "protocolador.layout.v1",
        workspace: "protocolador.workspace.v1"
    };

    const HISTORY_LIMIT = 18;
    const RECENT_PROTOCOL_LIMIT = 7;

    const TEXT_TEMPLATES = {
        falhaEletrica: {
            label: "Falha Elétrica",
            build: (data, strict) => [
                "Prezados,",
                "",
                "Verificamos que o equipamento está com alarme de falha elétrica. Poderiam validar essa informação, por gentileza?",
                "",
                `Segue protocolo do chamado: ${token(data.protocolo, "Protocolo", strict)}`
            ].join("\n")
        },
        equipamentoOk: {
            label: "Equipamento OK",
            build: (data, strict) => [
                "Prezados,",
                "",
                "Verificamos que o equipamento se encontra operacional. Poderiam validar essa informação, por gentileza?",
                "",
                `Segue protocolo do chamado: ${token(data.protocolo, "Protocolo", strict)}`
            ].join("\n")
        },
        enviadoCampo: {
            label: "Enviado para Campo",
            build: (data, strict) => [
                "Prezados,",
                "",
                `Seguimos com a abertura do chamado no protocolo: ${token(data.protocolo, "Protocolo", strict)}.`,
                "",
                "Foi identificada uma falha no equipamento e o técnico em campo foi acionado para tratativa.",
                "",
                "Permanecemos à disposição para qualquer dúvida."
            ].join("\n")
        },
        informacoesInsuficientes: {
            label: "Informações Insuficientes",
            build: (data, strict) => [
                "Prezados,",
                "",
                "No momento não foi possível identificar a origem da falha. Precisamos de mais informações para seguir com a análise.",
                "",
                `Segue protocolo do chamado: ${token(data.protocolo, "Protocolo", strict)}`
            ].join("\n")
        },
        cancelamentoChamado: {
            label: "Cancelamento de Chamado",
            build: (data, strict) => [
                "Prezados,",
                "",
                `Informamos que o chamado de número ${token(data.numeroChamado, "Número do chamado", strict)} foi cancelado.`,
                "",
                `Segue protocolo do chamado: ${token(data.protocolo, "Protocolo", strict)}`
            ].join("\n")
        },
        emailProtocolo: {
            label: "E-mail com Protocolo",
            build: (data, strict) => [
                "Prezados,",
                "",
                `Informamos que foi gerado o protocolo ${token(data.protocolo, "Protocolo", strict)} e o caso foi encaminhado para a equipe de analistas.`,
                "",
                "Retornaremos em breve com novas atualizações."
            ].join("\n")
        },
        falhaEletricaOperacional: {
            label: "Falha Elétrica mas Operacional",
            build: (data, strict) => [
                "Prezados,",
                "",
                "Verificamos alarme de falha elétrica no equipamento, porém ele segue operacional.",
                "",
                "Solicitamos validação dessa condição para continuidade do atendimento.",
                "",
                `Segue protocolo do chamado: ${token(data.protocolo, "Protocolo", strict)}`
            ].join("\n")
        }
    };

    const STAMP_TEMPLATES = {
        whatsappNocMassiva: {
            label: "WhatsApp - NOC MASSIVA",
            fields: [
                { id: "unidade", label: "Unidade", placeholder: "Ex: Unidade Centro" },
                { id: "olt", label: "OLT", placeholder: "Ex: OLT-03" },
                { id: "slot", label: "Slot", placeholder: "Ex: 04" },
                { id: "pon", label: "PON", placeholder: "Ex: 06" },
                { id: "serialONU", label: "Serial ONU", placeholder: "Ex: ONU12345" },
                { id: "contrato", label: "Contrato", placeholder: "Ex: 778899" }
            ],
            build: (data, strict) => [
                "CARIMBO: WHATSAPP - NOC MASSIVA",
                `Protocolo: ${token(data.protocolo, "Protocolo", strict)}`,
                "",
                `Unidade: ${token(data.carimboValues.unidade, "Unidade", strict)}`,
                `OLT: ${token(data.carimboValues.olt, "OLT", strict)}`,
                `Slot: ${token(data.carimboValues.slot, "Slot", strict)}`,
                `PON: ${token(data.carimboValues.pon, "PON", strict)}`,
                `Serial ONU: ${token(data.carimboValues.serialONU, "Serial ONU", strict)}`,
                `Contrato: ${token(data.carimboValues.contrato, "Contrato", strict)}`
            ].join("\n")
        },
        transferenciaCmoReparo: {
            label: "Transferência - CMO REPARO",
            fields: [
                {
                    id: "analise",
                    label: "Análise",
                    type: "select",
                    options: [
                        "Falha massiva identificada",
                        "Equipamento sem resposta",
                        "Sinal degradado",
                        "Instabilidade intermitente",
                        "Necessária validação em campo"
                    ]
                },
                {
                    id: "orientacoes",
                    label: "Orientações",
                    type: "select",
                    options: [
                        "Acionar equipe local para validação",
                        "Validar energia e aterramento",
                        "Reiniciar equipamento e coletar logs",
                        "Confirmar conectividade após tratativa",
                        "Retornar com evidência fotográfica"
                    ]
                },
                {
                    id: "horarioFuncionamento",
                    label: "Horário",
                    type: "select",
                    options: [
                        "08:00 às 18:00",
                        "09:00 às 18:00",
                        "Horário comercial",
                        "24x7"
                    ]
                },
                {
                    id: "telefoneCmoReparo",
                    label: "Telefone",
                    placeholder: "Ex: (85) 99999-9999"
                },
                {
                    id: "emailCmoReparo",
                    label: "E-mail",
                    inputType: "email",
                    placeholder: "Ex: equipe@empresa.com"
                }
            ],
            build: (data, strict) => [
                "CARIMBO: TRANSFERÊNCIA - CMO REPARO",
                `Protocolo: ${token(data.protocolo, "Protocolo", strict)}`,
                "",
                `Análise: ${token(data.carimboValues.analise, "Análise", strict)}`,
                `Orientações: ${token(data.carimboValues.orientacoes, "Orientações", strict)}`,
                `Horário de funcionamento: ${token(data.carimboValues.horarioFuncionamento, "Horário", strict)}`,
                `Telefone: ${token(data.carimboValues.telefoneCmoReparo, "Telefone", strict)}`,
                `E-mail: ${token(data.carimboValues.emailCmoReparo, "E-mail", strict)}`
            ].join("\n")
        },
        transferenciaCaParceiro: {
            label: "Transferência - CA - PARCEIRO",
            fields: [
                {
                    id: "analiseParceiro",
                    label: "Análise",
                    type: "select",
                    options: [
                        "Chamado direcionado para parceiro",
                        "Atendimento depende de agenda do parceiro",
                        "Necessária análise presencial do parceiro",
                        "Ponto fora do escopo da equipe interna"
                    ]
                },
                {
                    id: "parceiro",
                    label: "Parceiro",
                    type: "select",
                    options: [
                        "Parceiro Regional 01",
                        "Parceiro Regional 02",
                        "Parceiro Regional 03",
                        "Parceiro Local"
                    ]
                },
                {
                    id: "orientacaoParceiro",
                    label: "Orientação",
                    type: "select",
                    options: [
                        "Direcionar para parceiro responsável",
                        "Agendar visita técnica com parceiro",
                        "Confirmar disponibilidade de atendimento",
                        "Retornar com protocolo do parceiro"
                    ]
                },
                {
                    id: "horarioFuncionamentoParceiro",
                    label: "Horário",
                    type: "select",
                    options: [
                        "08:00 às 17:00",
                        "08:00 às 18:00",
                        "09:00 às 18:00",
                        "Horário comercial"
                    ]
                },
                {
                    id: "telefoneParceiro",
                    label: "Telefone",
                    placeholder: "Ex: (85) 98888-8888"
                },
                {
                    id: "emailParceiro",
                    label: "E-mail",
                    inputType: "email",
                    placeholder: "Ex: parceiro@empresa.com"
                }
            ],
            build: (data, strict) => [
                "CARIMBO: TRANSFERÊNCIA - CA - PARCEIRO",
                `Protocolo: ${token(data.protocolo, "Protocolo", strict)}`,
                "",
                `Análise: ${token(data.carimboValues.analiseParceiro, "Análise", strict)}`,
                `Parceiro: ${token(data.carimboValues.parceiro, "Parceiro", strict)}`,
                `Orientação: ${token(data.carimboValues.orientacaoParceiro, "Orientação", strict)}`,
                `Horário de funcionamento: ${token(data.carimboValues.horarioFuncionamentoParceiro, "Horário", strict)}`,
                `Telefone: ${token(data.carimboValues.telefoneParceiro, "Telefone", strict)}`,
                `E-mail: ${token(data.carimboValues.emailParceiro, "E-mail", strict)}`
            ].join("\n")
        }
    };

    const state = {
        mode: "texto",
        nav: "textos",
        history: [],
        favorites: {
            textos: [],
            carimbos: []
        },
        sidebarCollapsed: false,
        theme: "light",
        layoutModel: "sophisticated",
        workspaceLayout: "balanced",
        commandItems: [],
        commandIndex: -1
    };

    const elements = {
        app: document.querySelector(".app"),
        html: document.documentElement,
        railNav: document.querySelector(".rail"),
        railNavItems: Array.from(document.querySelectorAll(".rail-btn[data-nav]")),
        formCard: document.querySelector(".form-card"),
        sidebarNav: document.querySelector(".sidebar-nav"),
        navItems: Array.from(document.querySelectorAll(".nav-item")),
        protocolo: document.getElementById("protocolo"),
        texto: document.getElementById("texto"),
        numeroChamado: document.getElementById("numeroChamado"),
        cancelamentoDiv: document.getElementById("cancelamentoDiv"),
        selectCarimbo: document.getElementById("selectCarimbo"),
        carimboFieldsContainer: document.getElementById("carimboFieldsContainer"),
        tabTexto: document.getElementById("tabTexto"),
        tabCarimbo: document.getElementById("tabCarimbo"),
        textoSection: document.getElementById("textoSection"),
        carimboSection: document.getElementById("carimboSection"),
        toggleFavorite: document.getElementById("toggleFavorite"),
        gerarTexto: document.getElementById("gerarTexto"),
        copiarTexto: document.getElementById("copiarTexto"),
        limparFormulario: document.getElementById("limparFormulario"),
        textoGerado: document.getElementById("textoGerado"),
        mensagemTipo: document.getElementById("mensagemTipo"),
        contadorCaracteres: document.getElementById("contadorCaracteres"),
        validationBox: document.getElementById("validationBox"),
        validationList: document.getElementById("validationList"),
        historicoPanel: document.getElementById("historicoPanel"),
        historicoList: document.getElementById("historicoList"),
        limparHistorico: document.getElementById("limparHistorico"),
        favoritosPanel: document.getElementById("favoritosPanel"),
        favoritosList: document.getElementById("favoritosList"),
        configPanel: document.getElementById("configPanel"),
        darkModeCheckbox: document.getElementById("darkModeCheckbox"),
        themeToggle: document.getElementById("themeToggle"),
        sidebarToggle: document.getElementById("sidebarToggle"),
        clearStorage: document.getElementById("clearStorage"),
        layoutModelSelect: document.getElementById("layoutModelSelect"),
        workspaceLayoutSelect: document.getElementById("workspaceLayoutSelect"),
        quickSearch: document.getElementById("quickSearch"),
        commandResults: document.getElementById("commandResults"),
        recentProtocols: document.getElementById("recentProtocols"),
        saveStatus: document.getElementById("saveStatus"),
        requiredStatus: document.getElementById("requiredStatus"),
        currentTemplate: document.getElementById("currentTemplate"),
        toast: document.getElementById("toast")
    };

    let toastTimer = null;
    let saveTimer = null;

    init();

    function init() {
        renderCarimboFields();
        loadPersistedState();
        bindEvents();

        setMode(state.mode, { focus: false, keepNav: false });
        toggleCancelamentoField();
        toggleCarimboFieldGroups({ focus: false });

        renderHistory();
        renderFavorites();
        renderRecentProtocols();
        syncFavoriteButton();
        updatePreview();
        updateFormContext();
        applyTheme(state.theme, { persist: false });
        applyLayoutModel(state.layoutModel, { persist: false });
        applyWorkspaceLayout(state.workspaceLayout, { persist: false });
        applySidebarState(state.sidebarCollapsed, { persist: false });
        persistFormState();

        requestAnimationFrame(() => {
            elements.protocolo.focus();
        });
    }

    function bindEvents() {
        elements.tabTexto.addEventListener("click", () => {
            setSidebar("textos");
        });

        elements.tabCarimbo.addEventListener("click", () => {
            setSidebar("carimbos");
        });

        if (elements.sidebarNav) {
            elements.sidebarNav.addEventListener("click", (event) => {
                const button = event.target.closest(".nav-item");
                if (!button) {
                    return;
                }

                setSidebar(button.dataset.nav);
            });
        }

        if (elements.railNav) {
            elements.railNav.addEventListener("click", (event) => {
                const button = event.target.closest(".rail-btn[data-nav]");
                if (!button) {
                    return;
                }

                setSidebar(button.dataset.nav);
            });
        }

        elements.formCard.addEventListener("input", (event) => {
            handleFormChange(event.target);
        });

        elements.formCard.addEventListener("change", (event) => {
            handleFormChange(event.target);
        });

        elements.gerarTexto.addEventListener("click", handleGenerate);
        elements.copiarTexto.addEventListener("click", handleCopy);
        elements.limparFormulario.addEventListener("click", handleClearForm);
        elements.limparHistorico.addEventListener("click", handleClearHistory);
        elements.toggleFavorite.addEventListener("click", toggleCurrentFavorite);
        elements.favoritosList.addEventListener("click", handleFavoriteClick);
        elements.historicoList.addEventListener("click", handleHistoryClick);
        elements.recentProtocols.addEventListener("click", handleRecentProtocolClick);

        elements.themeToggle.addEventListener("click", () => {
            const next = state.theme === "dark" ? "light" : "dark";
            applyTheme(next);
        });

        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener("click", () => {
                applySidebarState(!state.sidebarCollapsed);
            });
        }

        elements.darkModeCheckbox.addEventListener("change", () => {
            applyTheme(elements.darkModeCheckbox.checked ? "dark" : "light");
        });

        if (elements.layoutModelSelect) {
            elements.layoutModelSelect.addEventListener("change", () => {
                applyLayoutModel(elements.layoutModelSelect.value);
                if (state.layoutModel === "compact") {
                    showToast("Modelo compacto ativado.");
                    return;
                }

                if (state.layoutModel === "focus") {
                    showToast("Modelo focus ativado.");
                    return;
                }

                showToast("Modelo sofisticado ativado.");
            });
        }

        if (elements.workspaceLayoutSelect) {
            elements.workspaceLayoutSelect.addEventListener("change", () => {
                applyWorkspaceLayout(elements.workspaceLayoutSelect.value);
                showToast("Layout de trabalho atualizado.");
            });
        }

        elements.clearStorage.addEventListener("click", handleClearLocalData);

        elements.textoGerado.addEventListener("input", () => {
            updateCharacterCounter();
            schedulePersistFormState();
        });

        elements.quickSearch.addEventListener("input", handleQuickSearchInput);
        elements.quickSearch.addEventListener("keydown", handleQuickSearchKeydown);
        elements.commandResults.addEventListener("click", handleCommandClick);

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".command-wrap")) {
                closeCommandResults();
            }
        });

        document.addEventListener("keydown", handleShortcuts);
    }

    function handleFormChange(target) {
        if (target.id === "protocolo") {
            target.value = formatProtocol(target.value);
        }

        if (target.id === "texto") {
            toggleCancelamentoField({ focus: true });
            syncFavoriteButton();
        }

        if (target.id === "selectCarimbo") {
            toggleCarimboFieldGroups({ focus: true });
            syncFavoriteButton();
        }

        if (target && target.classList) {
            target.classList.remove("field-invalid");
        }

        updatePreview();
        updateFormContext();
        schedulePersistFormState();

        if (!validate(collectValues()).length) {
            hideValidation();
            clearFieldValidationStyles();
        }
    }

    function setSidebar(nav) {
        state.nav = nav;
        updateSidebarVisual();

        if (nav === "textos") {
            hideAuxPanels();
            setMode("texto", { focus: true, keepNav: true });
            return;
        }

        if (nav === "carimbos") {
            hideAuxPanels();
            setMode("carimbo", { focus: true, keepNav: true });
            return;
        }

        if (nav === "historico") {
            hideAuxPanels();
            focusHistoryPanel();
            return;
        }

        if (nav === "favoritos") {
            showAuxPanel("favoritos");
            return;
        }

        if (nav === "configuracoes") {
            showAuxPanel("config");
        }
    }

    function updateSidebarVisual() {
        elements.navItems.forEach((item) => {
            item.classList.toggle("is-active", item.dataset.nav === state.nav);
        });

        elements.railNavItems.forEach((item) => {
            item.classList.toggle("is-active", item.dataset.nav === state.nav);
        });
    }

    function hideAuxPanels() {
        elements.favoritosPanel.classList.add("is-hidden");
        elements.configPanel.classList.add("is-hidden");
    }

    function showAuxPanel(panel) {
        hideAuxPanels();

        if (panel === "favoritos") {
            elements.favoritosPanel.classList.remove("is-hidden");
            elements.favoritosPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        if (panel === "config") {
            elements.configPanel.classList.remove("is-hidden");
            elements.configPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    function focusHistoryPanel() {
        elements.historicoPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        elements.historicoPanel.classList.add("is-focus");
        setTimeout(() => {
            elements.historicoPanel.classList.remove("is-focus");
        }, 900);
    }

    function setMode(mode, options = {}) {
        const { focus = true, keepNav = false } = options;
        state.mode = mode;

        const isTexto = mode === "texto";
        elements.tabTexto.classList.toggle("is-active", isTexto);
        elements.tabCarimbo.classList.toggle("is-active", !isTexto);
        elements.tabTexto.setAttribute("aria-selected", String(isTexto));
        elements.tabCarimbo.setAttribute("aria-selected", String(!isTexto));

        elements.textoSection.classList.toggle("is-hidden", !isTexto);
        elements.carimboSection.classList.toggle("is-hidden", isTexto);
        elements.mensagemTipo.innerHTML = `<i class="ti ti-layout-list" aria-hidden="true"></i>Modo: ${isTexto ? "Textos" : "Carimbos"}`;

        if (!keepNav) {
            state.nav = isTexto ? "textos" : "carimbos";
            updateSidebarVisual();
        }

        if (isTexto) {
            toggleCancelamentoField({ focus: false });
        } else {
            toggleCarimboFieldGroups({ focus: false });
        }

        syncFavoriteButton();
        hideValidation();
        updatePreview();
        updateFormContext();
        schedulePersistFormState();

        if (focus) {
            if (isTexto) {
                elements.texto.focus();
            } else {
                elements.selectCarimbo.focus();
            }
        }
    }

    function renderCarimboFields() {
        const fragment = document.createDocumentFragment();

        Object.entries(STAMP_TEMPLATES).forEach(([carimboId, config]) => {
            const section = document.createElement("section");
            section.className = "carimbo-group is-hidden";
            section.dataset.carimboId = carimboId;

            const title = document.createElement("p");
            title.className = "carimbo-title";
            title.textContent = config.label;

            const grid = document.createElement("div");
            grid.className = "field-grid-2";

            config.fields.forEach((field) => {
                const wrapper = document.createElement("div");
                wrapper.className = "field-group";

                const label = document.createElement("label");
                label.setAttribute("for", field.id);
                label.textContent = `${field.label} *`;

                wrapper.appendChild(label);

                if (field.type === "select") {
                    const select = document.createElement("select");
                    select.id = field.id;

                    const firstOption = document.createElement("option");
                    firstOption.value = "";
                    firstOption.textContent = field.selectPlaceholder || "--Selecione--";
                    select.appendChild(firstOption);

                    (field.options || []).forEach((optionValue) => {
                        const option = document.createElement("option");
                        option.value = optionValue;
                        option.textContent = optionValue;
                        select.appendChild(option);
                    });

                    wrapper.appendChild(select);
                } else {
                    const input = document.createElement("input");
                    input.id = field.id;
                    input.type = field.inputType || "text";
                    input.placeholder = field.placeholder;
                    input.autocomplete = "off";
                    wrapper.appendChild(input);
                }

                grid.appendChild(wrapper);
            });

            section.appendChild(title);
            section.appendChild(grid);
            fragment.appendChild(section);
        });

        elements.carimboFieldsContainer.innerHTML = "";
        elements.carimboFieldsContainer.appendChild(fragment);
    }

    function toggleCancelamentoField(options = {}) {
        const { focus = false } = options;
        const show = state.mode === "texto" && elements.texto.value === "cancelamentoChamado";
        elements.cancelamentoDiv.classList.toggle("is-hidden", !show);

        if (show && focus) {
            elements.numeroChamado.focus();
        }
    }

    function toggleCarimboFieldGroups(options = {}) {
        const { focus = false } = options;
        const selected = elements.selectCarimbo.value;
        const groups = elements.carimboFieldsContainer.querySelectorAll(".carimbo-group");

        groups.forEach((group) => {
            group.classList.toggle("is-hidden", group.dataset.carimboId !== selected);
        });

        if (focus && selected) {
            const activeGroup = elements.carimboFieldsContainer.querySelector(`.carimbo-group[data-carimbo-id="${selected}"]`);
            const firstInput = activeGroup ? activeGroup.querySelector("input, select") : null;
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    function collectValues() {
        const carimboId = elements.selectCarimbo.value;
        const carimboValues = {};
        const config = STAMP_TEMPLATES[carimboId];

        if (config) {
            config.fields.forEach((field) => {
                const input = document.getElementById(field.id);
                carimboValues[field.id] = input ? input.value.trim() : "";
            });
        }

        return {
            mode: state.mode,
            protocolo: elements.protocolo.value.trim(),
            textoId: elements.texto.value,
            numeroChamado: elements.numeroChamado.value.trim(),
            carimboId,
            carimboValues
        };
    }

    function validate(values) {
        return collectValidationIssues(values).map((issue) => issue.message);
    }

    function showValidation(errors) {
        elements.validationList.innerHTML = "";

        errors.forEach((errorMessage) => {
            const li = document.createElement("li");
            li.textContent = errorMessage;
            elements.validationList.appendChild(li);
        });

        elements.validationBox.classList.remove("is-hidden");
    }

    function hideValidation() {
        elements.validationBox.classList.add("is-hidden");
        elements.validationList.innerHTML = "";
    }

    function buildMessage(values, strict) {
        if (values.mode === "texto") {
            if (!values.textoId) {
                return strict ? "" : "Selecione um template de texto para iniciar a pré-visualização.";
            }

            const template = TEXT_TEMPLATES[values.textoId];
            if (!template) {
                return "";
            }

            return normalizeText(template.build(values, strict));
        }

        if (!values.carimboId) {
            return strict ? "" : "Selecione um carimbo para iniciar a pré-visualização.";
        }

        const carimboTemplate = STAMP_TEMPLATES[values.carimboId];
        if (!carimboTemplate) {
            return "";
        }

        return normalizeText(carimboTemplate.build(values, strict));
    }

    function updatePreview() {
        const values = collectValues();
        const preview = buildMessage(values, false);

        if (!elements.textoGerado.matches(":focus")) {
            elements.textoGerado.value = preview;
        }

        updateCharacterCounter();
    }

    function handleGenerate() {
        const values = collectValues();
        const issues = collectValidationIssues(values);
        const errors = issues.map((issue) => issue.message);
        applyValidationStyles(issues);

        if (errors.length > 0) {
            showValidation(errors);
            showToast("Preencha os campos obrigatórios para gerar o texto.");
            updateFormContext(issues);

            const firstIssue = issues.find((issue) => issue.fieldId);
            const firstField = firstIssue ? document.getElementById(firstIssue.fieldId) : null;
            if (firstField) {
                firstField.focus();
            }

            return;
        }

        hideValidation();
        clearFieldValidationStyles();

        const message = buildMessage(values, true);
        if (!message) {
            showToast("Não foi possível gerar o texto.");
            return;
        }

        elements.textoGerado.value = message;
        updateCharacterCounter();

        addHistory(values, message);
        persistFormState();
        updateFormContext();
        showToast("Texto gerado com sucesso.");
    }

    async function handleCopy() {
        const text = elements.textoGerado.value.trim();

        if (!text) {
            showToast("Não há conteúdo para copiar.");
            return;
        }

        const values = collectValues();
        const issues = collectValidationIssues(values);
        const errors = issues.map((issue) => issue.message);

        if (errors.length && text.includes("[")) {
            applyValidationStyles(issues);
            showValidation(errors);
            showToast("Finalize os campos pendentes antes de copiar.");
            updateFormContext(issues);
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
        } catch (_error) {
            fallbackCopy(text);
        }

        showToast("Texto copiado com sucesso.");
    }

    function fallbackCopy(text) {
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
    }

    function handleClearForm() {
        elements.protocolo.value = "";
        elements.texto.value = "";
        elements.numeroChamado.value = "";
        elements.selectCarimbo.value = "";

        Object.values(STAMP_TEMPLATES).forEach((stamp) => {
            stamp.fields.forEach((field) => {
                const input = document.getElementById(field.id);
                if (input) {
                    input.value = "";
                }
            });
        });

        elements.textoGerado.value = "";

        toggleCancelamentoField();
        toggleCarimboFieldGroups({ focus: false });
        hideValidation();
        clearFieldValidationStyles();
        updateCharacterCounter();
        updatePreview();
        updateFormContext();
        persistFormState();

        elements.protocolo.focus();
        showToast("Formulário limpo.");
    }

    function addHistory(values, text) {
        const entry = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            mode: values.mode,
            protocolo: values.protocolo,
            text,
            templateId: values.mode === "texto" ? values.textoId : values.carimboId,
            templateLabel: values.mode === "texto"
                ? resolveTextoLabel(values.textoId)
                : resolveCarimboLabel(values.carimboId),
            snapshot: {
                textoId: values.textoId,
                numeroChamado: values.numeroChamado,
                carimboId: values.carimboId,
                carimboValues: values.carimboValues
            }
        };

        state.history = [
            entry,
            ...state.history.filter((item) => item.text !== entry.text)
        ].slice(0, HISTORY_LIMIT);

        persistHistory();
        renderHistory();
        renderRecentProtocols();
    }

    function renderHistory() {
        elements.historicoList.innerHTML = "";

        if (state.history.length === 0) {
            const empty = document.createElement("li");
            empty.className = "history-item";
            empty.innerHTML = "<span class=\"history-preview\">Nenhum protocolo gerado ainda.</span>";
            elements.historicoList.appendChild(empty);
            return;
        }

        state.history.forEach((entry) => {
            const item = document.createElement("li");
            item.className = "history-item";
            item.dataset.historyId = String(entry.id);

            const title = document.createElement("span");
            title.className = "history-title";
            title.textContent = `${formatDate(entry.createdAt)} • ${entry.templateLabel} • ${entry.protocolo || "Sem protocolo"}`;

            const preview = document.createElement("p");
            preview.className = "history-preview";
            preview.textContent = entry.text;

            item.appendChild(title);
            item.appendChild(preview);
            elements.historicoList.appendChild(item);
        });
    }

    function handleHistoryClick(event) {
        const item = event.target.closest(".history-item[data-history-id]");
        if (!item) {
            return;
        }

        const entryId = Number(item.dataset.historyId);
        const entry = state.history.find((historyEntry) => historyEntry.id === entryId);

        if (!entry) {
            return;
        }

        loadHistoryEntry(entry);
        showToast("Histórico aplicado no formulário.");
    }

    function loadHistoryEntry(entry) {
        if (entry.mode === "texto") {
            setMode("texto", { focus: false, keepNav: true });
            elements.texto.value = entry.snapshot.textoId || "";
            toggleCancelamentoField({ focus: false });
            elements.numeroChamado.value = entry.snapshot.numeroChamado || "";
        } else {
            setMode("carimbo", { focus: false, keepNav: true });
            elements.selectCarimbo.value = entry.snapshot.carimboId || "";
            toggleCarimboFieldGroups({ focus: false });

            const carimboValues = entry.snapshot.carimboValues || {};
            Object.keys(carimboValues).forEach((fieldId) => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.value = carimboValues[fieldId];
                }
            });
        }

        elements.protocolo.value = formatProtocol(entry.protocolo || "");
        elements.textoGerado.value = entry.text || "";
        updateCharacterCounter();
        syncFavoriteButton();
        updateFormContext();
        persistFormState();
    }

    function handleClearHistory() {
        if (state.history.length === 0) {
            showToast("Histórico já está vazio.");
            return;
        }

        const confirmed = window.confirm("Deseja limpar todo o histórico de protocolos?");
        if (!confirmed) {
            return;
        }

        state.history = [];
        persistHistory();
        renderHistory();
        renderRecentProtocols();
        showToast("Histórico limpo.");
    }

    function renderRecentProtocols() {
        elements.recentProtocols.innerHTML = "";

        const unique = [];
        const seen = new Set();

        state.history.forEach((entry) => {
            if (entry.protocolo && !seen.has(entry.protocolo)) {
                seen.add(entry.protocolo);
                unique.push(entry.protocolo);
            }
        });

        unique.slice(0, RECENT_PROTOCOL_LIMIT).forEach((protocolo) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.dataset.protocolo = protocolo;
            chip.textContent = protocolo;
            elements.recentProtocols.appendChild(chip);
        });

        if (unique.length === 0) {
            const text = document.createElement("span");
            text.className = "history-title";
            text.textContent = "Nenhum protocolo recente.";
            elements.recentProtocols.appendChild(text);
        }
    }

    function handleRecentProtocolClick(event) {
        const chip = event.target.closest(".chip[data-protocolo]");
        if (!chip) {
            return;
        }

        elements.protocolo.value = formatProtocol(chip.dataset.protocolo);
        updatePreview();
        updateFormContext();
        persistFormState();
        elements.protocolo.focus();
    }

    function toggleCurrentFavorite() {
        const current = getCurrentTemplateSelection();
        if (!current.id) {
            showToast("Selecione um template antes de favoritar.");
            return;
        }

        const bucket = current.mode === "texto" ? state.favorites.textos : state.favorites.carimbos;
        const exists = bucket.includes(current.id);

        if (exists) {
            const index = bucket.indexOf(current.id);
            bucket.splice(index, 1);
            showToast("Favorito removido.");
        } else {
            bucket.unshift(current.id);
            showToast("Favorito salvo.");
        }

        persistFavorites();
        renderFavorites();
        syncFavoriteButton();
    }

    function getCurrentTemplateSelection() {
        if (state.mode === "texto") {
            return { mode: "texto", id: elements.texto.value };
        }

        return { mode: "carimbo", id: elements.selectCarimbo.value };
    }

    function syncFavoriteButton() {
        const current = getCurrentTemplateSelection();
        const bucket = current.mode === "texto" ? state.favorites.textos : state.favorites.carimbos;
        const isFavorite = Boolean(current.id) && bucket.includes(current.id);
        const label = isFavorite ? "Remover favorito" : "Salvar favorito";

        elements.toggleFavorite.innerHTML = `<i class="ti ${isFavorite ? "ti-star-filled" : "ti-star"}" aria-hidden="true"></i>${label}`;
        elements.toggleFavorite.setAttribute("aria-label", label);
    }

    function renderFavorites() {
        elements.favoritosList.innerHTML = "";

        const items = [];

        state.favorites.textos.forEach((templateId) => {
            if (TEXT_TEMPLATES[templateId]) {
                items.push({ mode: "texto", id: templateId, label: TEXT_TEMPLATES[templateId].label });
            }
        });

        state.favorites.carimbos.forEach((templateId) => {
            if (STAMP_TEMPLATES[templateId]) {
                items.push({ mode: "carimbo", id: templateId, label: STAMP_TEMPLATES[templateId].label });
            }
        });

        if (items.length === 0) {
            const empty = document.createElement("li");
            empty.className = "favorite-item";
            empty.textContent = "Nenhum favorito salvo.";
            elements.favoritosList.appendChild(empty);
            return;
        }

        items.forEach((itemData) => {
            const item = document.createElement("li");
            item.className = "favorite-item";

            const button = document.createElement("button");
            button.type = "button";
            button.dataset.favoriteId = itemData.id;
            button.dataset.favoriteMode = itemData.mode;
            button.textContent = `${itemData.mode === "texto" ? "Texto" : "Carimbo"}: ${itemData.label}`;

            item.appendChild(button);
            elements.favoritosList.appendChild(item);
        });
    }

    function handleFavoriteClick(event) {
        const button = event.target.closest("button[data-favorite-id]");
        if (!button) {
            return;
        }

        const mode = button.dataset.favoriteMode;
        const templateId = button.dataset.favoriteId;

        if (mode === "texto") {
            setMode("texto", { focus: false, keepNav: true });
            elements.texto.value = templateId;
            toggleCancelamentoField({ focus: true });
        } else {
            setMode("carimbo", { focus: false, keepNav: true });
            elements.selectCarimbo.value = templateId;
            toggleCarimboFieldGroups({ focus: true });
        }

        updatePreview();
        syncFavoriteButton();
        updateFormContext();
        persistFormState();
    }

    function handleQuickSearchInput() {
        const query = normalizeForSearch(elements.quickSearch.value.trim());

        if (!query) {
            closeCommandResults();
            return;
        }

        const results = [];

        Object.entries(TEXT_TEMPLATES).forEach(([id, template]) => {
            if (normalizeForSearch(template.label).includes(query)) {
                results.push({ type: "texto", id, label: template.label, meta: "Template de texto" });
            }
        });

        Object.entries(STAMP_TEMPLATES).forEach(([id, template]) => {
            if (normalizeForSearch(template.label).includes(query)) {
                results.push({ type: "carimbo", id, label: template.label, meta: "Template de carimbo" });
            }
        });

        state.history.forEach((entry) => {
            if (entry.protocolo && normalizeForSearch(entry.protocolo).includes(query)) {
                results.push({ type: "protocolo", id: entry.protocolo, label: entry.protocolo, meta: "Protocolo recente" });
            }
        });

        state.commandItems = dedupeCommandResults(results).slice(0, 8);
        state.commandIndex = state.commandItems.length ? 0 : -1;

        renderCommandResults();
    }

    function dedupeCommandResults(results) {
        const map = new Map();

        results.forEach((result) => {
            const key = `${result.type}-${result.id}`;
            if (!map.has(key)) {
                map.set(key, result);
            }
        });

        return Array.from(map.values());
    }

    function renderCommandResults() {
        elements.commandResults.innerHTML = "";

        if (state.commandItems.length === 0) {
            const item = document.createElement("li");
            item.className = "command-item";
            item.innerHTML = "<small>Nenhum resultado encontrado.</small>";
            elements.commandResults.appendChild(item);
            elements.commandResults.classList.remove("is-hidden");
            return;
        }

        state.commandItems.forEach((result, index) => {
            const li = document.createElement("li");
            const button = document.createElement("button");
            button.type = "button";
            button.className = `command-item${index === state.commandIndex ? " is-active" : ""}`;
            button.dataset.commandIndex = String(index);
            button.innerHTML = `${result.label}<small>${result.meta}</small>`;
            li.appendChild(button);
            elements.commandResults.appendChild(li);
        });

        elements.commandResults.classList.remove("is-hidden");
    }

    function closeCommandResults() {
        state.commandItems = [];
        state.commandIndex = -1;
        elements.commandResults.classList.add("is-hidden");
        elements.commandResults.innerHTML = "";
    }

    function handleQuickSearchKeydown(event) {
        if (state.commandItems.length === 0) {
            if (event.key === "Escape") {
                closeCommandResults();
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            state.commandIndex = (state.commandIndex + 1) % state.commandItems.length;
            renderCommandResults();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            state.commandIndex = (state.commandIndex - 1 + state.commandItems.length) % state.commandItems.length;
            renderCommandResults();
        }

        if (event.key === "Enter") {
            event.preventDefault();
            const selected = state.commandItems[state.commandIndex];
            if (selected) {
                executeCommandItem(selected);
            }
        }

        if (event.key === "Escape") {
            closeCommandResults();
        }
    }

    function handleCommandClick(event) {
        const button = event.target.closest("button[data-command-index]");
        if (!button) {
            return;
        }

        const index = Number(button.dataset.commandIndex);
        const selected = state.commandItems[index];
        if (selected) {
            executeCommandItem(selected);
        }
    }

    function executeCommandItem(item) {
        if (item.type === "texto") {
            setSidebar("textos");
            elements.texto.value = item.id;
            toggleCancelamentoField({ focus: true });
        }

        if (item.type === "carimbo") {
            setSidebar("carimbos");
            elements.selectCarimbo.value = item.id;
            toggleCarimboFieldGroups({ focus: true });
        }

        if (item.type === "protocolo") {
            elements.protocolo.value = formatProtocol(item.id);
            elements.protocolo.focus();
        }

        updatePreview();
        syncFavoriteButton();
        updateFormContext();
        persistFormState();
        elements.quickSearch.value = "";
        closeCommandResults();
    }

    function handleShortcuts(event) {
        if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key === "Enter") {
            const target = event.target;

            if (target === elements.quickSearch) {
                return;
            }

            if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
                event.preventDefault();
                handleGenerate();
                return;
            }
        }

        const key = event.key.toLowerCase();

        if ((event.ctrlKey || event.metaKey) && key === "k") {
            event.preventDefault();
            elements.quickSearch.focus();
            elements.quickSearch.select();
        }

        if ((event.ctrlKey || event.metaKey) && key === "enter") {
            event.preventDefault();
            handleGenerate();
        }

        if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === "c") {
            event.preventDefault();
            handleCopy();
        }

        if (event.altKey && key === "1") {
            event.preventDefault();
            setSidebar("textos");
        }

        if (event.altKey && key === "2") {
            event.preventDefault();
            setSidebar("carimbos");
        }

        if (event.altKey && key === "3") {
            event.preventDefault();
            setSidebar("historico");
        }
    }

    function applyTheme(theme, options = {}) {
        const { persist = true } = options;

        state.theme = theme === "dark" ? "dark" : "light";
        elements.html.setAttribute("data-theme", state.theme);

        const isDark = state.theme === "dark";
        elements.themeToggle.innerHTML = `<i class="ti ${isDark ? "ti-sun" : "ti-moon"}" aria-hidden="true"></i>`;
        elements.themeToggle.classList.toggle("is-active", isDark);
        elements.themeToggle.title = isDark ? "Alternar para modo claro" : "Alternar para modo escuro";
        elements.themeToggle.setAttribute("aria-label", elements.themeToggle.title);
        elements.themeToggle.setAttribute("aria-pressed", String(isDark));
        elements.darkModeCheckbox.checked = isDark;

        if (persist) {
            localStorage.setItem(STORAGE_KEYS.theme, state.theme);
        }
    }

    function applyLayoutModel(model, options = {}) {
        const { persist = true } = options;
        const allowed = new Set(["sophisticated", "compact", "focus"]);
        state.layoutModel = allowed.has(model) ? model : "sophisticated";

        elements.html.setAttribute("data-layout", state.layoutModel);

        if (elements.layoutModelSelect) {
            elements.layoutModelSelect.value = state.layoutModel;
        }

        if (persist) {
            localStorage.setItem(STORAGE_KEYS.layout, state.layoutModel);
        }
    }

    function applyWorkspaceLayout(layout, options = {}) {
        const { persist = true } = options;
        const allowed = new Set(["balanced", "formFirst", "previewFirst", "stacked"]);
        state.workspaceLayout = allowed.has(layout) ? layout : "balanced";

        elements.html.setAttribute("data-workspace", state.workspaceLayout);

        if (elements.workspaceLayoutSelect) {
            elements.workspaceLayoutSelect.value = state.workspaceLayout;
        }

        if (persist) {
            localStorage.setItem(STORAGE_KEYS.workspace, state.workspaceLayout);
        }
    }

    function handleClearLocalData() {
        const confirmed = window.confirm("Limpar histórico, favoritos e último formulário salvo?");
        if (!confirmed) {
            return;
        }

        localStorage.removeItem(STORAGE_KEYS.history);
        localStorage.removeItem(STORAGE_KEYS.favorites);
        localStorage.removeItem(STORAGE_KEYS.form);
        localStorage.removeItem(STORAGE_KEYS.theme);
        localStorage.removeItem(STORAGE_KEYS.sidebar);
        localStorage.removeItem(STORAGE_KEYS.layout);
        localStorage.removeItem(STORAGE_KEYS.workspace);

        state.history = [];
        state.favorites = { textos: [], carimbos: [] };
        state.sidebarCollapsed = false;
        state.layoutModel = "sophisticated";
        state.workspaceLayout = "balanced";
        applyTheme("light", { persist: false });
        applyLayoutModel("sophisticated", { persist: false });
        applyWorkspaceLayout("balanced", { persist: false });
        applySidebarState(false, { persist: false });

        renderHistory();
        renderFavorites();
        renderRecentProtocols();
        handleClearForm();

        showToast("Dados locais removidos.");
    }

    function persistFormState() {
        const values = collectValues();
        const payload = {
            mode: state.mode,
            protocolo: values.protocolo,
            textoId: values.textoId,
            numeroChamado: values.numeroChamado,
            carimboId: values.carimboId,
            carimboValues: values.carimboValues,
            textoGerado: elements.textoGerado.value
        };

        const saved = writeJson(STORAGE_KEYS.form, payload);
        if (saved) {
            setSaveStatus("saved");
        } else {
            setSaveStatus("error");
        }
    }

    function loadPersistedState() {
        const persistedTheme = localStorage.getItem(STORAGE_KEYS.theme);
        if (persistedTheme === "dark" || persistedTheme === "light") {
            state.theme = persistedTheme;
        }

        const persistedSidebar = localStorage.getItem(STORAGE_KEYS.sidebar);
        state.sidebarCollapsed = persistedSidebar === "1";

        const persistedLayout = localStorage.getItem(STORAGE_KEYS.layout);
        if (persistedLayout === "compact" || persistedLayout === "sophisticated" || persistedLayout === "focus") {
            state.layoutModel = persistedLayout;
        }

        const persistedWorkspace = localStorage.getItem(STORAGE_KEYS.workspace);
        if (persistedWorkspace === "balanced"
            || persistedWorkspace === "formFirst"
            || persistedWorkspace === "previewFirst"
            || persistedWorkspace === "stacked") {
            state.workspaceLayout = persistedWorkspace;
        }

        const savedHistory = readJson(STORAGE_KEYS.history, []);
        state.history = Array.isArray(savedHistory) ? savedHistory : [];

        const savedFavorites = readJson(STORAGE_KEYS.favorites, { textos: [], carimbos: [] });
        state.favorites = {
            textos: Array.isArray(savedFavorites.textos) ? savedFavorites.textos : [],
            carimbos: Array.isArray(savedFavorites.carimbos) ? savedFavorites.carimbos : []
        };

        const savedForm = readJson(STORAGE_KEYS.form, null);
        if (!savedForm) {
            return;
        }

        state.mode = savedForm.mode === "carimbo" ? "carimbo" : "texto";

        elements.protocolo.value = formatProtocol(savedForm.protocolo || "");
        elements.texto.value = savedForm.textoId || "";
        elements.numeroChamado.value = savedForm.numeroChamado || "";
        elements.selectCarimbo.value = savedForm.carimboId || "";

        const carimboValues = savedForm.carimboValues || {};
        Object.keys(carimboValues).forEach((fieldId) => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.value = carimboValues[fieldId];
            }
        });

        if (typeof savedForm.textoGerado === "string") {
            elements.textoGerado.value = savedForm.textoGerado;
        }

        updateCharacterCounter();
        setSaveStatus("saved");
    }

    function persistHistory() {
        writeJson(STORAGE_KEYS.history, state.history);
    }

    function persistFavorites() {
        writeJson(STORAGE_KEYS.favorites, state.favorites);
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Falha ao salvar dados locais", error);
            return false;
        }
    }

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                return fallback;
            }

            return JSON.parse(raw);
        } catch (error) {
            console.error("Falha ao ler dados locais", error);
            return fallback;
        }
    }

    function resolveTextoLabel(templateId) {
        return TEXT_TEMPLATES[templateId] ? TEXT_TEMPLATES[templateId].label : "Texto";
    }

    function resolveCarimboLabel(templateId) {
        return STAMP_TEMPLATES[templateId] ? STAMP_TEMPLATES[templateId].label : "Carimbo";
    }

    function token(value, fallbackLabel, strict) {
        const cleanValue = (value || "").trim();
        if (cleanValue) {
            return cleanValue;
        }

        return strict ? "" : `[${fallbackLabel}]`;
    }

    function normalizeText(text) {
        return text
            .split("\n")
            .map((line) => line.replace(/[\t ]+$/g, ""))
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) {
            return "Data inválida";
        }

        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    function updateCharacterCounter() {
        elements.contadorCaracteres.innerHTML = `<i class="ti ti-cursor-text" aria-hidden="true"></i>${elements.textoGerado.value.length} caracteres`;
    }

    function collectValidationIssues(values) {
        const issues = [];

        if (!values.protocolo) {
            issues.push({
                fieldId: "protocolo",
                label: "Protocolo",
                message: "Informe o número do protocolo."
            });
        }

        if (values.mode === "texto") {
            if (!values.textoId) {
                issues.push({
                    fieldId: "texto",
                    label: "Template de texto",
                    message: "Selecione um template de texto."
                });
            }

            if (values.textoId === "cancelamentoChamado" && !values.numeroChamado) {
                issues.push({
                    fieldId: "numeroChamado",
                    label: "Número do chamado cancelado",
                    message: "Informe o número do chamado cancelado."
                });
            }
        }

        if (values.mode === "carimbo") {
            if (!values.carimboId) {
                issues.push({
                    fieldId: "selectCarimbo",
                    label: "Tipo de carimbo",
                    message: "Selecione um tipo de carimbo."
                });
            }

            const selected = STAMP_TEMPLATES[values.carimboId];
            if (selected) {
                selected.fields.forEach((field) => {
                    if (!values.carimboValues[field.id]) {
                        issues.push({
                            fieldId: field.id,
                            label: field.label,
                            message: `Preencha o campo ${field.label}.`
                        });
                    }
                });
            }
        }

        return issues;
    }

    function formatProtocol(value) {
        const digits = (value || "").replace(/\D/g, "").slice(0, 13);
        const main = digits.slice(0, 8);
        const sequence = digits.slice(8, 13);

        if (!sequence) {
            return main;
        }

        return `${main}-${sequence}`;
    }

    function normalizeForSearch(value) {
        return (value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function clearFieldValidationStyles() {
        const fields = elements.formCard.querySelectorAll("input, select");
        fields.forEach((field) => {
            field.classList.remove("field-invalid");
        });
    }

    function applyValidationStyles(issues) {
        clearFieldValidationStyles();

        issues.forEach((issue) => {
            if (!issue.fieldId) {
                return;
            }

            const field = document.getElementById(issue.fieldId);
            if (field) {
                field.classList.add("field-invalid");
            }
        });
    }

    function updateFormContext(issuesParam) {
        const values = collectValues();
        const issues = Array.isArray(issuesParam) ? issuesParam : collectValidationIssues(values);
        const pending = issues.length;

        if (pending === 0) {
            elements.requiredStatus.textContent = "Tudo pronto para gerar";
        } else if (pending === 1) {
            elements.requiredStatus.textContent = "1 campo obrigatório pendente";
        } else {
            elements.requiredStatus.textContent = `${pending} campos obrigatórios pendentes`;
        }

        if (values.mode === "texto") {
            elements.currentTemplate.textContent = values.textoId
                ? `Texto: ${resolveTextoLabel(values.textoId)}`
                : "Texto: não selecionado";
        } else {
            elements.currentTemplate.textContent = values.carimboId
                ? `Carimbo: ${resolveCarimboLabel(values.carimboId)}`
                : "Carimbo: não selecionado";
        }
    }

    function schedulePersistFormState() {
        setSaveStatus("pending");

        if (saveTimer) {
            clearTimeout(saveTimer);
        }

        saveTimer = setTimeout(() => {
            persistFormState();
            saveTimer = null;
        }, 240);
    }

    function setSaveStatus(status) {
        if (!elements.saveStatus) {
            return;
        }

        elements.saveStatus.classList.remove("is-pending", "is-saved", "is-error");

        if (status === "pending") {
            elements.saveStatus.classList.add("is-pending");
            elements.saveStatus.textContent = "Alterações pendentes";
            return;
        }

        if (status === "error") {
            elements.saveStatus.classList.add("is-error");
            elements.saveStatus.textContent = "Falha ao salvar";
            return;
        }

        const time = new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date());

        elements.saveStatus.classList.add("is-saved");
        elements.saveStatus.textContent = `Salvo às ${time}`;
    }

    function applySidebarState(collapsed, options = {}) {
        const { persist = true } = options;
        state.sidebarCollapsed = Boolean(collapsed);

        if (elements.app) {
            elements.app.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
        }

        if (elements.sidebarToggle) {
            elements.sidebarToggle.setAttribute("aria-pressed", String(state.sidebarCollapsed));
            elements.sidebarToggle.textContent = state.sidebarCollapsed ? "Mostrar menu" : "Ocultar menu";
        }

        if (persist) {
            localStorage.setItem(STORAGE_KEYS.sidebar, state.sidebarCollapsed ? "1" : "0");
        }
    }

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add("show");

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = setTimeout(() => {
            elements.toast.classList.remove("show");
        }, 2000);
    }
})();
