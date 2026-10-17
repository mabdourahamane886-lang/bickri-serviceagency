(() => {
  "use strict";

  const API_ORIGIN = "https://bickri-codex-system.vercel.app";
  const STORAGE_KEY = "bickri_ai_conversations_v1";
  const THEME_KEY = "bickri_ai_theme_v1";
  const PLUGINS_KEY = "bickri_ai_plugins_v1";
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const MAX_FILE_TEXT = 30000;
  const allowedExtensions = /\.(txt|md|json|csv|ts|tsx|js|jsx|py|html|css|xml|log)$/i;
  const icons = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>',
    export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg>',
    attach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m20.5 11.5-8.8 8.8a5.2 5.2 0 0 1-7.4-7.4l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.2 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.5"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a4 4 0 0 0-5.1 5.1L4 17a2.1 2.1 0 0 0 3 3l5.6-5.6a4 4 0 0 0 5.1-5.1l-2.4 2.4-3-3z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5m-7 7 7-7 7 7"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m14 5 5 5M4 20l4.3-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.3 16z"/></svg>',
    retry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.7-2L20 12M4 12l2.7 5a7 7 0 0 0 11.7-2"/></svg>',
    like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm0 10h10a2 2 0 0 0 2-1.6l1.3-7A2 2 0 0 0 18.3 9H14l.7-3.5A2 2 0 0 0 12.8 3L7 10z"/></svg>',
    dislike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 14V4H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm0-10h10a2 2 0 0 1 2 1.6l1.3 7a2 2 0 0 1-2 2.4H14l.7 3.5a2 2 0 0 1-1.9 2.5L7 14z"/></svg>',
    speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/></svg>'
  };

  const $ = (selector) => document.querySelector(selector);
  const ui = {
    sidebar: $("#sidebar"),
    backdrop: $("#sidebarBackdrop"),
    list: $("#conversationList"),
    search: $("#searchInput"),
    newChat: $("#newChatButton"),
    openSidebar: $("#openSidebar"),
    closeSidebar: $("#closeSidebar"),
    welcome: $("#welcomeScreen"),
    messages: $("#messages"),
    chatView: $("#chatView"),
    composer: $("#composer"),
    input: $("#messageInput"),
    send: $("#sendButton"),
    attach: $("#attachButton"),
    file: $("#fileInput"),
    attachments: $("#attachmentStrip"),
    notice: $("#notice"),
    image: $("#imageButton"),
    voice: $("#voiceButton"),
    voiceStatus: $("#voiceStatus"),
    pluginButton: $("#pluginButton"),
    pluginDialog: $("#pluginsDialog"),
    pluginList: $("#pluginList"),
    settingsDialog: $("#settingsDialog"),
    theme: $("#themeSelect"),
    connection: $("#connectionState"),
    share: $("#shareButton"),
    modelButton: $("#modelButton"),
    modelPopover: $("#modelPopover"),
    jump: $("#jumpBottom"),
    template: $("#conversationTemplate")
  };

  const state = {
    conversations: loadConversations(),
    activeId: null,
    busy: false,
    controller: null,
    attachments: [],
    pluginCatalog: [],
    enabledPlugins: loadPlugins(),
    recognition: null,
    listening: false,
    pendingEdit: null,
    isNearBottom: true
  };

  function makeId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadConversations() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter((item) => item && typeof item.id === "string" && Array.isArray(item.messages))
        .map((item) => ({
          id: item.id,
          title: typeof item.title === "string" ? item.title : "Nouvelle conversation",
          updatedAt: Number(item.updatedAt) || Date.now(),
          messages: item.messages.filter((message) => message && ["user", "assistant"].includes(message.role) && typeof message.content === "string"),
          contents: Array.isArray(item.contents) ? item.contents : [],
          pending: item.pending || null
        })).sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error("Impossible de lire les conversations locales.", error);
      return [];
    }
  }

  function loadPlugins() {
    try {
      const value = JSON.parse(localStorage.getItem(PLUGINS_KEY) || "[]");
      return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
    } catch (error) {
      console.error("Impossible de lire les préférences d’outils.", error);
      return [];
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
      localStorage.setItem(PLUGINS_KEY, JSON.stringify(state.enabledPlugins));
    } catch (error) {
      console.error("Impossible d’enregistrer les données locales.", error);
      showNotice("Le navigateur n’a pas pu enregistrer les changements. Vérifiez l’espace de stockage disponible.");
    }
  }

  function activeConversation() {
    return state.conversations.find((conversation) => conversation.id === state.activeId) || null;
  }

  function showNotice(message) {
    ui.notice.textContent = message;
    ui.notice.classList.remove("hidden");
  }

  function clearNotice() {
    ui.notice.textContent = "";
    ui.notice.classList.add("hidden");
  }

  function apiUrl(route) {
    return `/api/${route}`;
  }

  async function requestJson(route, options = {}) {
    const response = await fetch(apiUrl(route), {
      ...options,
      headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
      credentials: "same-origin",
      cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = typeof data.error === "string" ? data.error : `Le service Bickri a répondu avec le code ${response.status}.`;
      throw new Error(message);
    }
    return data;
  }

  function setTheme(theme) {
    const value = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = value;
    ui.theme.value = value;
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (error) {
      console.error("Impossible d’enregistrer le thème.", error);
    }
  }

  function setConnection(isReady, text) {
    ui.connection.classList.toggle("error", !isReady);
    ui.connection.lastElementChild.textContent = text;
  }

  function closeSidebar() {
    ui.sidebar.classList.remove("open");
    ui.backdrop.classList.remove("visible");
  }

  function openSidebar() {
    ui.sidebar.classList.add("open");
    ui.backdrop.classList.add("visible");
  }

  function renderConversationList() {
    const query = ui.search.value.trim().toLocaleLowerCase("fr");
    const conversations = state.conversations.filter((conversation) =>
      !query || conversation.title.toLocaleLowerCase("fr").includes(query) ||
      conversation.messages.some((message) => message.content.toLocaleLowerCase("fr").includes(query))
    );
    ui.list.replaceChildren();
    if (!conversations.length) {
      const empty = document.createElement("p");
      empty.className = "history-empty";
      empty.textContent = query ? "Aucun résultat." : "Vos nouvelles conversations apparaîtront ici.";
      ui.list.append(empty);
      return;
    }
    for (const conversation of conversations) {
      const item = ui.template.content.firstElementChild.cloneNode(true);
      item.classList.toggle("active", conversation.id === state.activeId);
      const open = item.querySelector(".history-open");
      open.textContent = conversation.title;
      open.title = conversation.title;
      open.addEventListener("click", () => {
        if (state.busy) return;
        state.activeId = conversation.id;
        state.pendingEdit = null;
        clearNotice();
        closeSidebar();
        renderAll();
      });
      const more = item.querySelector(".history-more");
      const menu = item.querySelector(".history-menu");
      more.addEventListener("click", (event) => {
        event.stopPropagation();
        document.querySelectorAll(".history-menu").forEach((other) => {
          if (other !== menu) other.classList.add("hidden");
        });
        menu.classList.toggle("hidden");
      });
      menu.addEventListener("click", (event) => event.stopPropagation());
      menu.querySelector('[data-action="rename"]').addEventListener("click", () => {
        menu.classList.add("hidden");
        const title = window.prompt("Nom de la conversation", conversation.title);
        if (title && title.trim()) {
          conversation.title = title.trim().slice(0, 80);
          conversation.updatedAt = Date.now();
          saveState();
          renderConversationList();
        }
      });
      menu.querySelector('[data-action="export"]').addEventListener("click", () => {
        menu.classList.add("hidden");
        exportConversation(conversation);
      });
      menu.querySelector('[data-action="delete"]').addEventListener("click", () => {
        menu.classList.add("hidden");
        if (!window.confirm(`Supprimer « ${conversation.title} » ?`)) return;
        state.conversations = state.conversations.filter((itemConversation) => itemConversation.id !== conversation.id);
        if (state.activeId === conversation.id) state.activeId = null;
        saveState();
        renderAll();
      });
      ui.list.append(item);
    }
  }

  function renderAll() {
    renderConversationList();
    renderMessages();
  }

  function appendInlineMarkdown(target, text) {
    const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
    let cursor = 0;
    let match;
    while ((match = pattern.exec(text))) {
      target.append(document.createTextNode(text.slice(cursor, match.index)));
      const token = match[0];
      const element = document.createElement(token.startsWith("`") ? "code" : token.startsWith("**") || token.startsWith("__") ? "strong" : "em");
      element.textContent = token.replace(/^(`|\*\*|__|\*|_)/, "").replace(/(`|\*\*|__|\*|_)$/, "");
      target.append(element);
      cursor = pattern.lastIndex;
    }
    target.append(document.createTextNode(text.slice(cursor)));
  }

  function renderMarkdown(target, markdown) {
    const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    let list = null;
    let paragraph = [];
    let quote = [];
    let codeLines = null;
    let codeLanguage = "";

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const p = document.createElement("p");
      appendInlineMarkdown(p, paragraph.join(" "));
      target.append(p);
      paragraph = [];
    };
    const flushList = () => {
      if (!list) return;
      target.append(list);
      list = null;
    };
    const flushQuote = () => {
      if (!quote.length) return;
      const blockquote = document.createElement("blockquote");
      quote.forEach((line) => {
        const p = document.createElement("p");
        appendInlineMarkdown(p, line);
        blockquote.append(p);
      });
      target.append(blockquote);
      quote = [];
    };
    const flushTextBlocks = () => {
      flushParagraph();
      flushList();
      flushQuote();
    };

    for (const line of lines) {
      const fence = line.match(/^\s*```([\w.+-]*)\s*$/);
      if (fence && codeLines === null) {
        flushTextBlocks();
        codeLanguage = fence[1] || "code";
        codeLines = [];
        continue;
      }
      if (fence && codeLines !== null) {
        const wrapper = document.createElement("div");
        wrapper.className = "code-block";
        const header = document.createElement("div");
        header.className = "code-head";
        const label = document.createElement("span");
        label.textContent = codeLanguage;
        const copy = document.createElement("button");
        copy.type = "button";
        copy.textContent = "Copier le code";
        const source = codeLines.join("\n");
        copy.addEventListener("click", () => copyText(source, copy));
        header.append(label, copy);
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = source;
        pre.append(code);
        wrapper.append(header, pre);
        target.append(wrapper);
        codeLines = null;
        continue;
      }
      if (codeLines !== null) {
        codeLines.push(line);
        continue;
      }
      if (!line.trim()) {
        flushTextBlocks();
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushTextBlocks();
        const element = document.createElement(`h${heading[1].length}`);
        appendInlineMarkdown(element, heading[2]);
        target.append(element);
        continue;
      }
      const quoteLine = line.match(/^\s*&gt;\s?(.*)$|^\s*>\s?(.*)$/);
      if (quoteLine) {
        flushParagraph();
        flushList();
        quote.push(quoteLine[1] || quoteLine[2] || "");
        continue;
      }
      const listLine = line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);
      if (listLine) {
        flushParagraph();
        flushQuote();
        const nextList = /^\d/.test(listLine[1]) ? "ol" : "ul";
        if (!list || list.tagName.toLowerCase() !== nextList) {
          flushList();
          list = document.createElement(nextList);
        }
        const li = document.createElement("li");
        appendInlineMarkdown(li, listLine[2]);
        list.append(li);
        continue;
      }
      flushList();
      flushQuote();
      paragraph.push(line);
    }
    if (codeLines !== null) {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = codeLines.join("\n");
      pre.append(code);
      target.append(pre);
    }
    flushTextBlocks();
  }

  function makeToolButton(label, icon, handler, selected = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `message-tool${selected ? " selected" : ""}`;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = icon;
    button.addEventListener("click", handler);
    return button;
  }

  function renderMessages() {
    const conversation = activeConversation();
    const hasMessages = Boolean(conversation?.messages.length);
    ui.welcome.classList.toggle("hidden", hasMessages);
    ui.messages.classList.toggle("hidden", !hasMessages);
    ui.messages.replaceChildren();
    if (!conversation) {
      ui.input.disabled = state.busy;
      ui.send.innerHTML = state.busy ? icons.stop : icons.send;
      ui.send.classList.toggle("stop", state.busy);
      return;
    }
    for (const message of conversation.messages) {
      const article = document.createElement("article");
      article.className = `message ${message.role}`;
      const avatar = document.createElement("span");
      avatar.className = "message-avatar";
      avatar.textContent = message.role === "assistant" ? "b" : "V";
      avatar.setAttribute("aria-hidden", "true");
      const content = document.createElement("div");
      content.className = "message-content";
      const body = document.createElement("div");
      body.className = "message-body";
      const isEditing = state.pendingEdit?.messageId === message.id;
      if (isEditing) {
        const editor = document.createElement("textarea");
        editor.className = "edit-textarea";
        editor.value = message.content;
        editor.style.cssText = "width:100%;min-height:90px;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font:inherit";
        const actions = document.createElement("div");
        actions.className = "approval-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Annuler";
        cancel.addEventListener("click", () => {
          state.pendingEdit = null;
          renderMessages();
        });
        const submit = document.createElement("button");
        submit.type = "button";
        submit.className = "approve";
        submit.textContent = "Envoyer";
        submit.addEventListener("click", () => editMessage(conversation, message, editor.value));
        actions.append(cancel, submit);
        body.append(editor, actions);
      } else if (message.role === "user") {
        body.textContent = message.content;
        if (Array.isArray(message.attachments)) {
          for (const name of message.attachments) {
            const chip = document.createElement("span");
            chip.className = "attachment-chip";
            chip.textContent = `▤ ${name}`;
            body.append(chip);
          }
        }
      } else if (message.content) {
        renderMarkdown(body, message.content);
      }
      content.append(body);
      if (message.role === "assistant" && message.pending?.length) {
        const card = document.createElement("section");
        card.className = "approval-card";
        const heading = document.createElement("h3");
        heading.textContent = "Votre approbation est requise";
        const description = document.createElement("p");
        description.textContent = "L’assistant demande l’autorisation d’effectuer une action. Rien ne sera exécuté sans votre accord.";
        const actions = document.createElement("div");
        actions.className = "approval-actions";
        for (const [decision, label] of [["reject", "Refuser"], ["approve", "Approuver"]]) {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = label;
          if (decision === "approve") button.className = "approve";
          button.disabled = state.busy;
          button.addEventListener("click", () => resolveApproval(conversation, message, decision));
          actions.append(button);
        }
        card.append(heading, description, actions);
        content.append(card);
      }
      if (message.image) {
        const result = document.createElement("div");
        result.className = "image-result";
        const title = document.createElement("strong");
        title.textContent = "Image générée";
        const image = document.createElement("img");
        image.src = message.image;
        image.alt = "Image générée par Bickri AI";
        image.loading = "lazy";
        const download = document.createElement("a");
        download.href = message.image;
        download.download = "bickri-image.png";
        download.textContent = "Télécharger l’image";
        download.style.cssText = "display:inline-block;margin-top:9px;color:var(--accent);font-size:11px";
        result.append(title, image, download);
        content.append(result);
      }
      if (message.error) {
        const error = document.createElement("div");
        error.className = "message-error";
        error.textContent = message.error;
        content.append(error);
      }
      if (message.loading) {
        const loading = document.createElement("div");
        loading.className = "typing-indicator";
        loading.setAttribute("aria-label", "Bickri AI répond");
        loading.innerHTML = "<i></i><i></i><i></i>";
        content.append(loading);
      }
      const tools = document.createElement("div");
      tools.className = "message-tools";
      if (!message.loading && message.role === "assistant" && message.content) {
        tools.append(makeToolButton("Copier la réponse", icons.copy, (event) => copyText(message.content, event.currentTarget)));
        tools.append(makeToolButton("Écouter la réponse", icons.speak, (event) => speakText(message.content, event.currentTarget)));
        tools.append(makeToolButton("Bonne réponse", icons.like, () => rateMessage(conversation, message, "up"), message.rating === "up"));
        tools.append(makeToolButton("Mauvaise réponse", icons.dislike, () => rateMessage(conversation, message, "down"), message.rating === "down"));
        const lastUser = [...conversation.messages].reverse().find((entry) => entry.role === "user");
        const lastAssistant = [...conversation.messages].reverse().find((entry) => entry.role === "assistant" && entry.content);
        if (lastUser && lastAssistant?.id === message.id && !state.busy) {
          tools.append(makeToolButton("Régénérer la réponse", icons.retry, () => retryMessage(conversation, lastUser)));
        }
      }
      if (message.role === "user" && !message.loading && !state.busy) {
        tools.append(makeToolButton("Modifier le message", icons.edit, () => {
          state.pendingEdit = { messageId: message.id };
          renderMessages();
          ui.messages.querySelector(".edit-textarea")?.focus();
        }));
      }
      content.append(tools);
      article.append(avatar, content);
      ui.messages.append(article);
    }
    ui.input.disabled = state.busy;
    ui.send.innerHTML = state.busy ? icons.stop : icons.send;
    ui.send.classList.toggle("stop", state.busy);
    ui.send.setAttribute("aria-label", state.busy ? "Arrêter la réponse" : "Envoyer le message");
    if (state.isNearBottom) requestAnimationFrame(() => ui.chatView.scrollTo({ top: ui.chatView.scrollHeight, behavior: "smooth" }));
  }

  function createConversation(firstMessage) {
    const conversation = {
      id: makeId(),
      title: firstMessage.trim().replace(/\s+/g, " ").slice(0, 46) || "Nouvelle conversation",
      updatedAt: Date.now(),
      messages: [],
      contents: [],
      pending: null
    };
    if (firstMessage.trim().length > 46) conversation.title = `${conversation.title.trim()}…`;
    state.conversations.unshift(conversation);
    state.activeId = conversation.id;
    return conversation;
  }

  function updateConversation(conversation) {
    conversation.updatedAt = Date.now();
    state.conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    saveState();
    renderConversationList();
  }

  function appendUserAndAssistant(conversation, message, attachments = []) {
    const user = { id: makeId(), role: "user", content: message, attachments, createdAt: Date.now() };
    const assistant = { id: makeId(), role: "assistant", content: "", loading: true, createdAt: Date.now() };
    conversation.messages.push(user, assistant);
    conversation.pending = null;
    updateConversation(conversation);
    renderMessages();
    return { user, assistant };
  }

  async function askAssistant(conversation, assistant, request, initialContents = conversation.contents) {
    state.busy = true;
    state.controller = new AbortController();
    clearNotice();
    renderMessages();
    let contents = initialContents;
    try {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const payload = { ...request, contents, plugins: availableEnabledPlugins(), language: "fr-FR" };
        const data = await requestJson("ai/agent", {
          method: "POST",
          body: JSON.stringify(payload),
          signal: state.controller.signal
        });
        if (Array.isArray(data.contents)) {
          contents = data.contents;
          conversation.contents = contents;
        }
        if (Array.isArray(data.pending) && data.pending.length) {
          assistant.pending = data.pending;
          assistant.loading = false;
          conversation.pending = data.pending;
          assistant.content = typeof data.answer === "string" ? data.answer : "";
          break;
        }
        if (typeof data.answer === "string") {
          assistant.content = data.answer;
          assistant.loading = false;
          assistant.pending = null;
          break;
        }
        if (!data.continue) {
          throw new Error("Le service IA n’a pas renvoyé de réponse. Réessayez dans un instant.");
        }
        request = {};
      }
      if (assistant.loading) {
        assistant.loading = false;
        assistant.content = assistant.content || "La réponse est longue. Envoyez « continue » pour la poursuivre.";
      }
    } catch (error) {
      assistant.loading = false;
      if (error.name === "AbortError") {
        assistant.error = "Réponse arrêtée.";
      } else {
        assistant.error = error instanceof Error ? error.message : "Une erreur est survenue.";
      }
    } finally {
      state.busy = false;
      state.controller = null;
      updateConversation(conversation);
      renderAll();
    }
  }

  function availableEnabledPlugins() {
    return state.pluginCatalog.filter((plugin) => plugin.available && state.enabledPlugins.includes(plugin.id)).map((plugin) => plugin.id);
  }

  async function sendMessage(value = ui.input.value) {
    const text = value.trim();
    if ((!text && !state.attachments.length) || state.busy) return;
    clearNotice();
    const prompt = text || "Analyse les fichiers joints et aide-moi à les comprendre.";
    const attachedText = state.attachments.map((file) => `\n\nFichier joint : ${file.name}\n\n${file.text}`).join("");
    const messageText = `${prompt}${attachedText}`;
    let conversation = activeConversation();
    if (!conversation) conversation = createConversation(messageText);
    state.pendingEdit = null;
    const attachments = state.attachments.map((file) => file.name);
    state.attachments = [];
    renderAttachments();
    ui.input.value = "";
    resizeInput();
    const { assistant } = appendUserAndAssistant(conversation, messageText, attachments);
    await askAssistant(conversation, assistant, { message: messageText });
  }

  function contentsFromMessages(messages) {
    return messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    }));
  }

  async function editMessage(conversation, message, updatedText) {
    const text = updatedText.trim();
    if (!text || state.busy) return;
    const index = conversation.messages.findIndex((entry) => entry.id === message.id);
    if (index < 0) return;
    const prior = conversation.messages.slice(0, index);
    conversation.contents = contentsFromMessages(prior);
    conversation.messages = [...prior, { ...message, content: text, attachments: [] }];
    state.pendingEdit = null;
    const assistant = { id: makeId(), role: "assistant", content: "", loading: true, createdAt: Date.now() };
    conversation.messages.push(assistant);
    updateConversation(conversation);
    renderMessages();
    await askAssistant(conversation, assistant, { message: text }, conversation.contents);
  }

  async function retryMessage(conversation, userMessage) {
    if (state.busy) return;
    const index = conversation.messages.findIndex((entry) => entry.id === userMessage.id);
    if (index < 0) return;
    conversation.contents = contentsFromMessages(conversation.messages.slice(0, index));
    conversation.messages = conversation.messages.slice(0, index + 1);
    const assistant = { id: makeId(), role: "assistant", content: "", loading: true, createdAt: Date.now() };
    conversation.messages.push(assistant);
    await askAssistant(conversation, assistant, { message: userMessage.content }, conversation.contents);
  }

  async function resolveApproval(conversation, assistant, decision) {
    if (!assistant.pending || state.busy) return;
    await askAssistant(conversation, assistant, { decision }, conversation.contents);
    if (!assistant.pending) conversation.pending = null;
    updateConversation(conversation);
  }

  function rateMessage(conversation, message, rating) {
    message.rating = message.rating === rating ? null : rating;
    updateConversation(conversation);
    renderMessages();
  }

  function newChat() {
    if (state.busy) return;
    state.activeId = null;
    state.pendingEdit = null;
    state.attachments = [];
    clearNotice();
    renderAttachments();
    renderAll();
    closeSidebar();
    ui.input.value = "";
    ui.input.focus();
  }

  function renderAttachments() {
    ui.attachments.replaceChildren();
    ui.attachments.classList.toggle("hidden", !state.attachments.length);
    for (const [index, file] of state.attachments.entries()) {
      const chip = document.createElement("div");
      chip.className = "pending-attachment";
      const name = document.createElement("span");
      name.textContent = `▤ ${file.name}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Retirer ${file.name}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        state.attachments.splice(index, 1);
        renderAttachments();
      });
      chip.append(name, remove);
      ui.attachments.append(chip);
    }
  }

  async function addFiles(fileList) {
    clearNotice();
    for (const file of Array.from(fileList || [])) {
      if (file.size > MAX_FILE_SIZE) {
        showNotice(`${file.name} dépasse la limite de 2 Mo.`);
        continue;
      }
      if (!allowedExtensions.test(file.name)) {
        showNotice(`Format non pris en charge pour ${file.name}. Joignez un fichier texte ou de code.`);
        continue;
      }
      try {
        const text = await file.text();
        state.attachments.push({ name: file.name, text: text.slice(0, MAX_FILE_TEXT) });
      } catch (error) {
        console.error("Impossible de lire le fichier joint.", error);
        showNotice(`Impossible de lire ${file.name}.`);
      }
    }
    renderAttachments();
    ui.input.focus();
  }

  async function generateImage() {
    const prompt = ui.input.value.trim();
    if (!prompt || state.busy) {
      showNotice("Écrivez une description avant de demander une image.");
      return;
    }
    let conversation = activeConversation();
    if (!conversation) conversation = createConversation(prompt);
    const user = { id: makeId(), role: "user", content: `Créer une image : ${prompt}`, createdAt: Date.now() };
    const assistant = { id: makeId(), role: "assistant", content: "Je prépare votre image…", loading: true, createdAt: Date.now() };
    conversation.messages.push(user, assistant);
    updateConversation(conversation);
    renderMessages();
    ui.input.value = "";
    resizeInput();
    state.busy = true;
    state.controller = new AbortController();
    renderMessages();
    try {
      const data = await requestJson("ai/images", {
        method: "POST",
        body: JSON.stringify({ prompt, mode: "create" }),
        signal: state.controller.signal
      });
      if (typeof data.image !== "string") throw new Error("Le service n’a pas renvoyé d’image.");
      assistant.content = "";
      assistant.image = data.image;
      assistant.loading = false;
    } catch (error) {
      assistant.loading = false;
      assistant.error = error.name === "AbortError" ? "Génération arrêtée." : error.message;
    } finally {
      state.busy = false;
      state.controller = null;
      updateConversation(conversation);
      renderAll();
    }
  }

  function exportConversation(conversation) {
    if (!conversation) {
      showNotice("Aucune conversation à exporter.");
      return;
    }
    const content = [`# ${conversation.title}`, "", ...conversation.messages.flatMap((message) => [
      `## ${message.role === "user" ? "Vous" : "Bickri AI"}`, "", message.content || (message.image ? "[Image générée]" : ""), ""
    ])].join("\n");
    downloadFile(`${safeFilename(conversation.title)}.md`, content, "text/markdown;charset=utf-8");
  }

  function exportAll() {
    const data = JSON.stringify(state.conversations, null, 2);
    downloadFile("bickri-ai-conversations.json", data, "application/json;charset=utf-8");
  }

  function safeFilename(value) {
    return (value || "conversation").toLocaleLowerCase("fr").replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "conversation";
  }

  function downloadFile(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyText(value, button) {
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copié";
      window.setTimeout(() => { button.textContent = original; }, 1300);
    } catch (error) {
      console.error("Impossible de copier dans le presse-papiers.", error);
      showNotice("Le navigateur n’a pas autorisé l’accès au presse-papiers.");
    }
  }

  function speakText(value, button) {
    if (!("speechSynthesis" in window)) {
      showNotice("La lecture vocale n’est pas prise en charge dans ce navigateur.");
      return;
    }
    window.speechSynthesis.cancel();
    const plainText = value.replace(/```[\s\S]*?```/g, " bloc de code ").replace(/`([^`]+)`/g, "$1").replace(/https?:\/\/\S+/g, " lien ").slice(0, 5000);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = "fr-FR";
    utterance.rate = 1;
    utterance.onstart = () => { button.classList.add("selected"); };
    utterance.onend = () => { button.classList.remove("selected"); };
    utterance.onerror = () => {
      button.classList.remove("selected");
      showNotice("La lecture vocale a échoué.");
    };
    window.speechSynthesis.speak(utterance);
  }

  function resizeInput() {
    ui.input.style.height = "auto";
    ui.input.style.height = `${Math.min(ui.input.scrollHeight, 190)}px`;
  }

  async function loadServices() {
    try {
      const [health, agent] = await Promise.all([
        requestJson("health"),
        requestJson("ai/agent")
      ]);
      state.pluginCatalog = Array.isArray(agent.plugins) ? agent.plugins : [];
      const available = new Set(state.pluginCatalog.filter((plugin) => plugin.available).map((plugin) => plugin.id));
      state.enabledPlugins = state.enabledPlugins.filter((id) => available.has(id));
      saveState();
      renderPlugins();
      setConnection(Boolean(health.status === "ok" && health.config?.ai), health.status === "ok" ? "IA connectée" : "IA indisponible");
    } catch (error) {
      console.error("Impossible de joindre le service Bickri AI.", error);
      setConnection(false, "Service indisponible");
      renderPlugins();
    }
  }

  function renderPlugins() {
    ui.pluginList.replaceChildren();
    if (!state.pluginCatalog.length) {
      const status = document.createElement("p");
      status.className = "settings-note";
      status.textContent = "Les outils n’ont pas pu être chargés. Vérifiez la connexion au service.";
      ui.pluginList.append(status);
      return;
    }
    for (const plugin of state.pluginCatalog) {
      const row = document.createElement("label");
      row.className = `plugin-row${plugin.available ? "" : " disabled"}`;
      const copy = document.createElement("span");
      copy.className = "plugin-copy";
      const title = document.createElement("strong");
      title.textContent = plugin.name;
      const description = document.createElement("p");
      description.textContent = plugin.available ? plugin.description : plugin.reason || "Non disponible";
      copy.append(title, description);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = plugin.available && state.enabledPlugins.includes(plugin.id);
      checkbox.disabled = !plugin.available;
      checkbox.setAttribute("aria-label", `Activer ${plugin.name}`);
      checkbox.addEventListener("change", () => {
        state.enabledPlugins = checkbox.checked
          ? [...new Set([...state.enabledPlugins, plugin.id])]
          : state.enabledPlugins.filter((id) => id !== plugin.id);
        saveState();
      });
      row.append(copy, checkbox);
      ui.pluginList.append(row);
    }
  }

  function setupVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      ui.voice.disabled = true;
      ui.voice.title = "La dictée vocale n’est pas disponible dans ce navigateur.";
      return;
    }
    state.recognition = new Recognition();
    state.recognition.lang = "fr-FR";
    state.recognition.interimResults = true;
    state.recognition.continuous = false;
    state.recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
      ui.input.value = transcript;
      resizeInput();
    };
    state.recognition.onerror = (event) => {
      state.listening = false;
      ui.voice.classList.remove("listening");
      ui.voiceStatus.textContent = event.error === "not-allowed" ? "Autorisez le microphone dans le navigateur." : "La dictée vocale a échoué.";
      ui.voiceStatus.classList.remove("hidden");
    };
    state.recognition.onend = () => {
      state.listening = false;
      ui.voice.classList.remove("listening");
      ui.voiceStatus.classList.add("hidden");
    };
  }

  function toggleVoice() {
    if (!state.recognition) return;
    if (state.listening) {
      state.recognition.stop();
      return;
    }
    try {
      state.listening = true;
      ui.voice.classList.add("listening");
      ui.voiceStatus.textContent = "Écoute en cours…";
      ui.voiceStatus.classList.remove("hidden");
      state.recognition.start();
    } catch (error) {
      console.error("Impossible de démarrer la dictée vocale.", error);
      state.listening = false;
      ui.voice.classList.remove("listening");
      ui.voiceStatus.textContent = "Le microphone n’a pas pu démarrer.";
      ui.voiceStatus.classList.remove("hidden");
    }
  }

  function handleStop() {
    state.controller?.abort();
  }

  ui.newChat.innerHTML = `${icons.plus}<span>Nouvelle conversation</span>`;
  ui.attach.innerHTML = icons.attach;
  ui.voice.innerHTML = icons.mic;
  ui.pluginButton.innerHTML = icons.tools;
  ui.send.innerHTML = icons.send;
  ui.share.innerHTML = icons.export;
  ui.openSidebar.innerHTML = icons.menu;
  ui.closeSidebar.innerHTML = icons.close;
  $(".search-icon").innerHTML = icons.search;

  ui.newChat.addEventListener("click", newChat);
  ui.openSidebar.addEventListener("click", openSidebar);
  ui.closeSidebar.addEventListener("click", closeSidebar);
  ui.backdrop.addEventListener("click", closeSidebar);
  ui.search.addEventListener("input", renderConversationList);
  ui.composer.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.busy) handleStop();
    else void sendMessage();
  });
  ui.input.addEventListener("input", resizeInput);
  ui.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (state.busy) handleStop();
      else void sendMessage();
    }
  });
  ui.attach.addEventListener("click", () => ui.file.click());
  ui.file.addEventListener("change", () => {
    void addFiles(ui.file.files);
    ui.file.value = "";
  });
  ui.image.addEventListener("click", () => void generateImage());
  ui.voice.addEventListener("click", toggleVoice);
  ui.pluginButton.addEventListener("click", () => ui.pluginDialog.showModal());
  ui.share.addEventListener("click", () => exportConversation(activeConversation()));
  ui.modelButton.addEventListener("click", () => ui.modelPopover.classList.toggle("hidden"));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".model-wrap")) ui.modelPopover.classList.add("hidden");
    if (!event.target.closest(".history-item")) document.querySelectorAll(".history-menu").forEach((menu) => menu.classList.add("hidden"));
  });
  ui.chatView.addEventListener("scroll", () => {
    state.isNearBottom = ui.chatView.scrollHeight - ui.chatView.scrollTop - ui.chatView.clientHeight < 120;
    ui.jump.classList.toggle("hidden", state.isNearBottom || !activeConversation()?.messages.length);
  });
  $("#jumpBottomButton").addEventListener("click", () => {
    state.isNearBottom = true;
    ui.chatView.scrollTo({ top: ui.chatView.scrollHeight, behavior: "smooth" });
  });
  document.querySelectorAll(".suggestion-card").forEach((button) => {
    button.addEventListener("click", () => {
      ui.input.value = button.dataset.prompt || "";
      resizeInput();
      ui.input.focus();
    });
  });
  $("#settingsButton").addEventListener("click", () => ui.settingsDialog.showModal());
  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  ui.theme.addEventListener("change", () => setTheme(ui.theme.value));
  $("#exportAllButton").addEventListener("click", exportAll);
  $("#clearAllButton").addEventListener("click", () => {
    if (!state.conversations.length) return showNotice("Il n’y a aucune conversation à supprimer.");
    if (!window.confirm("Supprimer définitivement toutes les conversations enregistrées sur cet appareil ?")) return;
    state.conversations = [];
    state.activeId = null;
    saveState();
    renderAll();
    ui.settingsDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      ui.search.focus();
    }
    if (event.key === "Escape") closeSidebar();
  });

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem("bcx_theme") || "dark";
  } catch (error) {
    console.error("Impossible de lire le thème enregistré.", error);
  }
  setTheme(savedTheme);
  if (state.conversations.length) state.activeId = state.conversations[0].id;
  setupVoice();
  renderAll();
  void loadServices();
})();
