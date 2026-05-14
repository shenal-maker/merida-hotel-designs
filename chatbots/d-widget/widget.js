/* ============================================================
   Launcher D — Standard chat widget (V4 Minimal)

   A cleaner, quieter take on the Intercom/Drift/Crisp pattern.
   Self-mounts on DOMContentLoaded using its <script data-hotel="..."> attr.

   Behavior:
   - Pill launcher bottom-right, slides up at 1500ms
   - Notification dot until first open
   - Auto-message bubble at 8s (skipped if user has interacted before)
   - 380×600 panel opens on click, focus trapped, ESC closes
   - Threaded chat with typing animation, quick-action chips
   - Uses window.ChatbotResponses + window.ChatbotFeedback.record('v4', ...)
   - Respects prefers-reduced-motion
   - Fails silently if ChatbotResponses is missing
   ============================================================ */
(function () {
  "use strict";

  // ---- Guards ------------------------------------------------------------

  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!window.ChatbotResponses || typeof window.ChatbotResponses.match !== "function") {
    return; // fail silently — no launcher visible
  }

  // ---- Config ------------------------------------------------------------

  var SCRIPT = document.currentScript || (function () {
    var s = document.querySelectorAll("script[data-hotel]");
    return s[s.length - 1];
  })();
  var HOTEL = (SCRIPT && SCRIPT.getAttribute("data-hotel")) === "treehouse" ? "treehouse" : "boutique";
  var STORAGE_SEEN = "chatbot-d-seen-" + HOTEL;
  var FEEDBACK_VARIANT = "v4";

  var HOTEL_LABEL = HOTEL === "treehouse" ? "Tree House" : "Boutique by The Museo";
  var HOTEL_INITIAL = HOTEL === "treehouse" ? "T" : "B";
  var AUTO_PROMPT_TEXT = HOTEL === "treehouse"
    ? "Looking for the right room?"
    : "Looking for the perfect room?";

  var ENTRY_DELAY = 1500;
  var AUTO_PROMPT_DELAY = 8000;
  var IDLE_FEEDBACK_MS = 30000;
  var FEEDBACK_AFTER_N_USER_MSGS = 3;

  var REDUCED_MOTION = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- State -------------------------------------------------------------

  var state = {
    opened: false,
    everOpened: false,
    promptShown: false,
    feedbackShown: false,
    userMsgCount: 0,
    lastUserAt: 0,
    pendingTypingTimer: null,
    pendingAutoPromptTimer: null,
    idleTimer: null,
    previouslyFocused: null
  };

  // ---- DOM utilities -----------------------------------------------------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null) continue;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.indexOf("on") === 0 && typeof v === "function") {
          node.addEventListener(k.slice(2), v);
        } else if (k === "style" && typeof v === "object") {
          for (var s in v) node.style[s] = v[s];
        } else {
          node.setAttribute(k, v);
        }
      }
    }
    if (children) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c == null) continue;
        if (typeof c === "string") node.appendChild(document.createTextNode(c));
        else node.appendChild(c);
      }
    }
    return node;
  }

  function lucideIcon(name, opts) {
    // Inline a <i data-lucide> placeholder. We hydrate once Lucide is available.
    opts = opts || {};
    var i = el("i", {
      "data-lucide": name,
      "aria-hidden": "true",
      class: opts.class || ""
    });
    return i;
  }

  function hydrateLucide(root) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      // Lucide.createIcons accepts a root option in newer versions; fall back if not.
      try {
        window.lucide.createIcons({
          attrs: { "stroke-width": 1.75 }
        });
      } catch (e) {
        try { window.lucide.createIcons(); } catch (_) {}
      }
    } else {
      // Lucide not loaded yet — try again shortly. V4 loads it `defer`.
      window.setTimeout(function () { hydrateLucide(root); }, 80);
    }
  }

  function safeLocal(method, key, value) {
    try {
      if (method === "get") return window.localStorage.getItem(key);
      if (method === "set") return window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  // ---- Build the launcher -----------------------------------------------

  var root = el("div", {
    class: "cw-root",
    "data-hotel": HOTEL
  });

  // The launcher pill
  var launcher = el("button", {
    class: "cw-launcher",
    type: "button",
    "aria-haspopup": "dialog",
    "aria-expanded": "false",
    "aria-controls": "cw-panel-" + HOTEL,
    "aria-label": "Open chat with " + HOTEL_LABEL
  }, [
    el("span", { class: "cw-launcher-icon" }, [ lucideIcon("message-circle") ]),
    el("span", { class: "cw-launcher-label", text: "Help" }),
    el("span", { class: "cw-notif-dot", "aria-hidden": "true" })
  ]);

  // The auto-message prompt
  var prompt = el("div", {
    class: "cw-prompt",
    role: "status",
    "aria-live": "polite"
  }, [
    el("span", { text: "👋 " + AUTO_PROMPT_TEXT }),
    (function () {
      var btn = el("button", {
        class: "cw-prompt-close",
        type: "button",
        "aria-label": "Dismiss message"
      }, [ lucideIcon("x") ]);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        dismissPrompt();
      });
      return btn;
    })()
  ]);
  // Clicking the prompt body itself opens the panel.
  prompt.addEventListener("click", function (e) {
    if (e.target.closest(".cw-prompt-close")) return;
    openPanel();
  });

  // The panel
  var panel = el("div", {
    class: "cw-panel",
    id: "cw-panel-" + HOTEL,
    role: "dialog",
    "aria-modal": "false",
    "aria-labelledby": "cw-title-" + HOTEL,
    hidden: ""
  });

  var avatar = el("div", { class: "cw-avatar", "aria-hidden": "true", text: HOTEL_INITIAL });
  var headerText = el("div", { class: "cw-header-text" }, [
    el("span", { class: "cw-header-name", id: "cw-title-" + HOTEL, text: HOTEL_LABEL }),
    el("span", { class: "cw-header-status", text: "Online · usually replies in seconds" })
  ]);
  var closeBtn = el("button", {
    class: "cw-close",
    type: "button",
    "aria-label": "Close chat"
  }, [ lucideIcon("x") ]);
  closeBtn.addEventListener("click", closePanel);

  var header = el("div", { class: "cw-header" }, [ avatar, headerText, closeBtn ]);

  var stream = el("div", {
    class: "cw-stream",
    role: "log",
    "aria-live": "polite",
    "aria-atomic": "false"
  });

  var chipsBar = el("div", { class: "cw-chips", role: "toolbar", "aria-label": "Suggested questions" });

  var input = el("input", {
    class: "cw-input",
    type: "text",
    autocomplete: "off",
    spellcheck: "false",
    "aria-label": "Send a message",
    placeholder: "Send a message..."
  });
  var sendBtn = el("button", {
    class: "cw-send",
    type: "submit",
    "aria-label": "Send message",
    disabled: ""
  }, [ lucideIcon("arrow-up") ]);

  var composer = el("form", { class: "cw-composer", "aria-label": "Compose a message" }, [ input, sendBtn ]);
  composer.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    handleUserMessage(v);
    input.value = "";
    sendBtn.disabled = true;
  });
  input.addEventListener("input", function () {
    sendBtn.disabled = !input.value.trim();
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  var foot = el("div", {
    class: "cw-foot",
    html: 'Demo of a chat experience'
  });

  panel.appendChild(header);
  panel.appendChild(stream);
  panel.appendChild(chipsBar);
  panel.appendChild(composer);
  panel.appendChild(foot);

  root.appendChild(prompt);
  root.appendChild(launcher);
  root.appendChild(panel);

  // ---- Mount -------------------------------------------------------------

  function mount() {
    document.body.appendChild(root);

    // Hydrate icons (lucide is loaded `defer` on the page).
    hydrateLucide(root);

    // Wire launcher click
    launcher.addEventListener("click", openPanel);

    // Entry animation
    var entry = function () {
      launcher.classList.add("is-entered");
      // Reflect "seen" state from localStorage (no notification dot if returning)
      if (safeLocal("get", STORAGE_SEEN)) {
        launcher.classList.add("is-seen");
      } else {
        // Schedule the 8s auto-message for first-time visitors only.
        state.pendingAutoPromptTimer = window.setTimeout(function () {
          if (state.opened) return;
          state.promptShown = true;
          prompt.classList.add("is-visible");
        }, AUTO_PROMPT_DELAY);
      }
    };

    if (REDUCED_MOTION) {
      entry();
    } else {
      window.setTimeout(entry, ENTRY_DELAY);
    }

    // Global Esc handler
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.opened) {
        closePanel();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  // ---- Behaviors ---------------------------------------------------------

  function dismissPrompt() {
    state.promptShown = false;
    prompt.classList.remove("is-visible");
  }

  function openPanel() {
    if (state.opened) return;
    state.opened = true;
    state.everOpened = true;

    state.previouslyFocused = document.activeElement;

    safeLocal("set", STORAGE_SEEN, "1");
    if (state.pendingAutoPromptTimer) {
      window.clearTimeout(state.pendingAutoPromptTimer);
      state.pendingAutoPromptTimer = null;
    }
    dismissPrompt();

    launcher.classList.add("is-open", "is-seen");
    launcher.setAttribute("aria-expanded", "true");

    panel.removeAttribute("hidden");
    // next frame for transition
    window.requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });

    // Seed welcome if empty
    if (!stream.firstChild) {
      seedWelcome();
    }

    // Focus the input
    window.setTimeout(function () {
      input.focus();
    }, REDUCED_MOTION ? 0 : 200);

    // Focus trap
    panel.addEventListener("keydown", trapFocus);

    armIdleTimer();
  }

  function closePanel() {
    if (!state.opened) return;
    state.opened = false;

    panel.classList.remove("is-open");
    launcher.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");

    panel.removeEventListener("keydown", trapFocus);

    var finalize = function () {
      panel.setAttribute("hidden", "");
    };
    if (REDUCED_MOTION) finalize();
    else window.setTimeout(finalize, 240);

    if (state.previouslyFocused && typeof state.previouslyFocused.focus === "function") {
      try { state.previouslyFocused.focus(); } catch (_) { launcher.focus(); }
    } else {
      launcher.focus();
    }

    if (state.idleTimer) {
      window.clearTimeout(state.idleTimer);
      state.idleTimer = null;
    }
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    var focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    var enabled = [];
    for (var i = 0; i < focusable.length; i++) {
      var f = focusable[i];
      if (!f.hasAttribute("disabled") && f.offsetParent !== null) enabled.push(f);
    }
    if (!enabled.length) return;
    var first = enabled[0];
    var last = enabled[enabled.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ---- Messages ----------------------------------------------------------

  function seedWelcome() {
    var welcome = window.ChatbotResponses.welcome
      ? window.ChatbotResponses.welcome(HOTEL)
      : null;
    if (welcome) {
      appendBotMessage(welcome, /* skipTyping */ true);
    }
    // Seed default suggestion chips
    var defaultChips = HOTEL === "treehouse"
      ? ["See rooms", "Check availability", "Ask about Mérida"]
      : ["See rooms", "Check availability", "Ask about Mérida"];
    renderChips(defaultChips);
  }

  function appendUserMessage(text) {
    var bubble = el("div", { class: "cw-msg-bubble" }, [ document.createTextNode(text) ]);
    var row = el("div", { class: "cw-msg cw-msg--user" }, [ bubble ]);
    stream.appendChild(row);
    scrollStream();
  }

  function appendBotMessage(text, skipTyping) {
    var bubble = el("div", { class: "cw-msg-bubble" });
    var avatarEl = el("div", { class: "cw-msg-avatar", "aria-hidden": "true", text: HOTEL_INITIAL });
    var row = el("div", { class: "cw-msg cw-msg--bot" }, [ avatarEl, bubble ]);
    stream.appendChild(row);
    scrollStream();

    if (skipTyping || REDUCED_MOTION) {
      bubble.textContent = text;
      return;
    }

    // Subtle staged reveal: show typing indicator, then swap in text.
    var dots = el("div", { class: "cw-typing", "aria-hidden": "true" }, [
      el("span"), el("span"), el("span")
    ]);
    bubble.appendChild(dots);

    var delay = Math.min(900, 380 + text.length * 6);
    state.pendingTypingTimer = window.setTimeout(function () {
      bubble.removeChild(dots);
      bubble.textContent = text;
      scrollStream();
    }, delay);
  }

  function renderChips(items) {
    chipsBar.innerHTML = "";
    if (!items || !items.length) {
      chipsBar.style.display = "none";
      return;
    }
    chipsBar.style.display = "";
    for (var i = 0; i < items.length; i++) {
      (function (label) {
        var btn = el("button", {
          class: "cw-chip",
          type: "button",
          text: label
        });
        btn.addEventListener("click", function () {
          handleUserMessage(label);
        });
        chipsBar.appendChild(btn);
      })(items[i]);
    }
  }

  function scrollStream() {
    // Use rAF so the new node is laid out first.
    window.requestAnimationFrame(function () {
      stream.scrollTop = stream.scrollHeight;
    });
  }

  function handleUserMessage(text) {
    if (!text) return;
    state.userMsgCount += 1;
    state.lastUserAt = Date.now();

    appendUserMessage(text);

    var resp;
    try {
      resp = window.ChatbotResponses.match(HOTEL, text);
    } catch (e) {
      resp = { text: "Something went wrong. Try again?", suggestions: [] };
    }

    // Stage the bot reply slightly after the user's send
    var staged = REDUCED_MOTION ? 0 : 280;
    window.setTimeout(function () {
      appendBotMessage(resp.text);
      // After typing finishes, render new suggestion chips.
      var renderAt = REDUCED_MOTION ? 0 : (380 + (resp.text || "").length * 6) + 40;
      window.setTimeout(function () {
        renderChips(resp.suggestions || []);
        maybeShowFeedback();
      }, renderAt);
    }, staged);

    armIdleTimer();
  }

  // ---- Feedback prompt ---------------------------------------------------

  function maybeShowFeedback() {
    if (state.feedbackShown) return;
    if (state.userMsgCount < FEEDBACK_AFTER_N_USER_MSGS) return;
    showFeedback();
  }

  function armIdleTimer() {
    if (state.idleTimer) window.clearTimeout(state.idleTimer);
    if (state.feedbackShown) return;
    state.idleTimer = window.setTimeout(function () {
      if (state.opened && !state.feedbackShown && state.userMsgCount >= 1) {
        showFeedback();
      }
    }, IDLE_FEEDBACK_MS);
  }

  function showFeedback() {
    if (state.feedbackShown) return;
    state.feedbackShown = true;

    var card = el("div", { class: "cw-feedback", role: "group", "aria-label": "Feedback" });
    var q = el("p", { class: "cw-feedback-q", text: "How does this chat experience feel?" });
    var row = el("div", { class: "cw-feedback-row" });

    ["Useful", "Just OK", "Not for me"].forEach(function (label) {
      var btn = el("button", {
        class: "cw-feedback-btn",
        type: "button",
        text: label
      });
      btn.addEventListener("click", function () {
        var buttons = card.querySelectorAll(".cw-feedback-btn");
        for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;

        if (window.ChatbotFeedback && typeof window.ChatbotFeedback.record === "function") {
          try {
            window.ChatbotFeedback.record(FEEDBACK_VARIANT, {
              hotel: HOTEL,
              rating: label,
              messageCount: state.userMsgCount
            });
          } catch (_) {}
        }

        var thanks = el("p", {
          class: "cw-feedback-thanks",
          text: "Thanks — noted."
        });
        card.appendChild(thanks);
      });
      row.appendChild(btn);
    });

    card.appendChild(q);
    card.appendChild(row);
    stream.appendChild(card);
    scrollStream();
  }

})();
