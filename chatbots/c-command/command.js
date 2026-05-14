/* ============================================
   CHATBOT C — [ / ASK ] mono command bar (V3 Brutalist)
   Self-mounts at DOMContentLoaded. Reads data-hotel from its <script> tag.
   Fails silently if window.ChatbotResponses isn't available.
   ============================================ */
(function () {
  "use strict";

  // --- Resolve hotel from this script's data-hotel attribute ---
  var currentScript = document.currentScript;
  if (!currentScript) {
    // Fallback for older browsers / defer ordering
    var scripts = document.getElementsByTagName("script");
    for (var s = scripts.length - 1; s >= 0; s--) {
      if (scripts[s].src && scripts[s].src.indexOf("c-command/command.js") !== -1) {
        currentScript = scripts[s];
        break;
      }
    }
  }
  var HOTEL = (currentScript && currentScript.getAttribute("data-hotel")) || "boutique";
  var VARIANT_ID = "v3";

  // --- Slash command registry ---
  var COMMANDS = [
    { cmd: "/rooms",        target: "#rooms",    label: "THE COLLECTION" },
    { cmd: "/art",          target: "#art",      label: "TREEHOUSE × SOHO" },
    { cmd: "/location",     target: "#location", label: "MÉRIDA, MX" },
    { cmd: "/offers",       target: "#offers",   label: "ALLOCATIONS" },
    { cmd: "/availability", target: "#booking",  label: "DATE PICKER" }
  ];

  // --- Boot once DOM is ready ---
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (!window.ChatbotResponses || typeof window.ChatbotResponses.match !== "function") {
      // Fail silently — no launcher visible.
      return;
    }

    // --- 1. Inject nav button ---
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "cmdbar-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "cmdbar-modal");
    trigger.setAttribute("aria-label", "Open command bar — press slash to open");
    trigger.textContent = "[ / ASK ]";

    // Insertion: place before the menu button if present, else append.
    var menuBtn = nav.querySelector(".nav-menu-btn");
    if (menuBtn && menuBtn.parentNode) {
      menuBtn.parentNode.insertBefore(trigger, menuBtn);
    } else {
      nav.appendChild(trigger);
    }

    // --- 2. Build modal markup ---
    var backdrop = document.createElement("div");
    backdrop.className = "cmdbar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    var modal = document.createElement("div");
    modal.className = "cmdbar-modal";
    modal.id = "cmdbar-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Command bar — type a command or question");
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = [
      '<div class="cmdbar-hint" id="cmdbar-hint">[ TYPE A COMMAND OR QUESTION ]</div>',
      '<div class="cmdbar-input-wrap">',
        '<input type="text" class="cmdbar-input" id="cmdbar-input"',
          ' autocomplete="off" autocapitalize="off" spellcheck="false"',
          ' aria-labelledby="cmdbar-hint"',
          ' aria-autocomplete="list" aria-controls="cmdbar-list"',
          ' placeholder="/rooms, /art, or ask a question…">',
      '</div>',
      '<div class="cmdbar-body">',
        '<div class="cmdbar-welcome" id="cmdbar-welcome"></div>',
        '<ul class="cmdbar-list" id="cmdbar-list" role="listbox" aria-label="Slash commands"></ul>',
        '<hr class="cmdbar-divider" hidden id="cmdbar-divider">',
        '<div class="cmdbar-log" id="cmdbar-log" role="log" aria-live="polite"></div>',
      '</div>',
      '<div class="cmdbar-foot">',
        '<span class="cmdbar-foot-left">[ ENTER ↵ TO RUN ]</span>',
        '<span class="cmdbar-foot-right">[ ESC TO CLOSE ]</span>',
      '</div>'
    ].join("");

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    var input = modal.querySelector(".cmdbar-input");
    var list  = modal.querySelector(".cmdbar-list");
    var log   = modal.querySelector(".cmdbar-log");
    var divider = modal.querySelector(".cmdbar-divider");
    var welcome = modal.querySelector(".cmdbar-welcome");

    // --- Welcome (demo notice). "Bienvenida" gets es-MX. ---
    var welcomeText = (window.ChatbotResponses.welcome && window.ChatbotResponses.welcome(HOTEL)) || "";
    var welcomeHtml = escapeHtml(welcomeText).replace(
      /^Bienvenida\.?/,
      '<span lang="es-MX">$&</span>'
    );
    welcome.innerHTML = '<strong>[ DEMO ]</strong> ' + welcomeHtml;

    // --- State ---
    var lastFocused = null;
    var msgCount = 0;
    var idleTimer = null;
    var feedbackShown = false;
    var inertSiblings = [];
    var activeIndex = 0;
    var filtered = COMMANDS.slice();

    // --- Helpers ---
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function getInertSiblings() {
      return Array.prototype.filter.call(document.body.children, function (el) {
        return el !== backdrop && el !== modal && el.nodeType === 1;
      });
    }

    function isTypingTarget(el) {
      if (!el) return false;
      var tag = el.tagName;
      if (!tag) return false;
      if (el.isContentEditable) return true;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return false;
    }

    function smoothScrollTo(selector) {
      var node = document.querySelector(selector);
      if (!node) return false;
      var navEl = document.querySelector(".nav");
      var offset = (navEl && navEl.offsetHeight) ? navEl.offsetHeight + 16 : 80;
      var top = node.getBoundingClientRect().top + window.pageYOffset - offset;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: top,
        behavior: reduce ? "auto" : "smooth"
      });
      return true;
    }

    // --- Render slash-command list ---
    function renderList(query) {
      var q = String(query || "").trim().toLowerCase();
      if (q === "" || q === "/") {
        filtered = COMMANDS.slice();
      } else {
        filtered = COMMANDS.filter(function (c) {
          return c.cmd.indexOf(q) === 0 || c.cmd.toLowerCase().indexOf(q.replace(/^\//, "")) !== -1;
        });
      }

      list.innerHTML = "";

      if (!filtered.length) {
        var empty = document.createElement("li");
        empty.className = "cmdbar-list-empty";
        empty.textContent = "[ NO COMMAND MATCHED — PRESS ENTER TO ASK AS QUESTION ]";
        list.appendChild(empty);
        activeIndex = -1;
        return;
      }

      filtered.forEach(function (c, i) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cmdbar-item";
        btn.setAttribute("data-cmd", c.cmd);
        btn.setAttribute("data-target", c.target);
        btn.setAttribute("aria-selected", "false");

        btn.innerHTML = [
          '<span class="cmdbar-item-cmd">' + escapeHtml(c.cmd) + '</span>',
          '<span class="cmdbar-item-arrow">→ <span class="cmdbar-item-label">' + escapeHtml(c.label) + '</span></span>',
          '<span class="cmdbar-item-enter">[ ↵ ENTER ]</span>'
        ].join("");

        btn.addEventListener("mouseenter", function () { setActiveIndex(i); });
        btn.addEventListener("click", function () { runCommand(c); });

        li.appendChild(btn);
        list.appendChild(li);
      });

      activeIndex = 0;
      setActiveIndex(0);
    }

    function setActiveIndex(i) {
      var items = list.querySelectorAll(".cmdbar-item");
      activeIndex = Math.max(0, Math.min(i, items.length - 1));
      items.forEach(function (el, n) {
        if (n === activeIndex) {
          el.classList.add("cmdbar-active");
          el.setAttribute("aria-selected", "true");
        } else {
          el.classList.remove("cmdbar-active");
          el.setAttribute("aria-selected", "false");
        }
      });
    }

    // --- Actions ---
    function runCommand(c) {
      // Slash commands jump — close then scroll. (Log stays for free-text Q&A.)
      close();
      requestAnimationFrame(function () {
        smoothScrollTo(c.target);
      });
    }

    function runFreeText(text) {
      var trimmed = String(text || "").trim();
      if (!trimmed) return;

      var result = window.ChatbotResponses.match(HOTEL, trimmed);
      var responseLines = formatResponse(trimmed, result);

      addLogEntry(trimmed, responseLines.text, responseLines.ref);

      msgCount += 1;
      resetIdleTimer();
      maybeOfferFeedback();
    }

    function formatResponse(query, result) {
      var raw = (result && result.text) || "";
      var upper = raw.toUpperCase();
      // Truncate to ~3 sentences so the terminal reads tight.
      var sentences = upper.split(/(?<=[.!?])\s+/);
      var clipped = sentences.slice(0, 3).join(" ");
      var intent = (result && result.intent) || "default";
      var ref;
      if (intent === "default") {
        ref = "REFERENCE: DEMO MODE — NO LIVE CONCIERGE.";
      } else {
        ref = "REFERENCE: " + intent.toUpperCase();
      }
      return { text: clipped, ref: ref };
    }

    function addLogEntry(prompt, response, ref) {
      // Show divider once log is populated
      divider.hidden = false;

      var entry = document.createElement("div");
      entry.className = "cmdbar-log-entry";

      var p = document.createElement("div");
      p.className = "cmdbar-log-prompt";
      p.textContent = prompt.toUpperCase();

      var r = document.createElement("div");
      r.className = "cmdbar-log-response";
      r.textContent = response;

      entry.appendChild(p);
      entry.appendChild(r);

      if (ref) {
        var refEl = document.createElement("div");
        refEl.className = "cmdbar-log-ref";
        refEl.textContent = ref;
        entry.appendChild(refEl);
      }

      log.appendChild(entry);
      // Scroll body to bottom
      var body = modal.querySelector(".cmdbar-body");
      if (body) body.scrollTop = body.scrollHeight;
    }

    // --- Feedback prompt after 3 messages or idle ---
    function maybeOfferFeedback() {
      if (feedbackShown) return;
      if (msgCount >= 3) showFeedback();
    }

    function resetIdleTimer() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        if (!feedbackShown && msgCount > 0) showFeedback();
      }, 30000);
    }

    function showFeedback() {
      feedbackShown = true;
      var entry = document.createElement("div");
      entry.className = "cmdbar-log-entry";
      entry.innerHTML = [
        '<div class="cmdbar-log-prompt">[ FEEDBACK PROMPT ]</div>',
        '<div class="cmdbar-log-response">HOW DOES THIS CHAT EXPERIENCE FEEL?</div>',
        '<ul class="cmdbar-list" style="padding:0.4rem 0 0;">',
          '<li><button type="button" class="cmdbar-item" data-rating="useful"><span class="cmdbar-item-cmd">/useful</span><span class="cmdbar-item-arrow">→ <span class="cmdbar-item-label">YES, KEEP BUILDING</span></span><span class="cmdbar-item-enter">[ ↵ ]</span></button></li>',
          '<li><button type="button" class="cmdbar-item" data-rating="just-ok"><span class="cmdbar-item-cmd">/just-ok</span><span class="cmdbar-item-arrow">→ <span class="cmdbar-item-label">IT IS FINE</span></span><span class="cmdbar-item-enter">[ ↵ ]</span></button></li>',
          '<li><button type="button" class="cmdbar-item" data-rating="not-for-me"><span class="cmdbar-item-cmd">/not-for-me</span><span class="cmdbar-item-arrow">→ <span class="cmdbar-item-label">NOT FOR ME</span></span><span class="cmdbar-item-enter">[ ↵ ]</span></button></li>',
        '</ul>'
      ].join("");
      log.appendChild(entry);

      entry.querySelectorAll("[data-rating]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var rating = btn.getAttribute("data-rating");
          if (window.ChatbotFeedback && typeof window.ChatbotFeedback.record === "function") {
            window.ChatbotFeedback.record(VARIANT_ID, rating, HOTEL);
          }
          btn.parentNode.parentNode.querySelectorAll("[data-rating]").forEach(function (b) {
            b.disabled = true;
          });
          addLogEntry("/" + rating, "RECORDED. THANK YOU.", "REFERENCE: FEEDBACK LOG");
        });
      });

      var body = modal.querySelector(".cmdbar-body");
      if (body) body.scrollTop = body.scrollHeight;
    }

    // --- Open / close ---
    function open() {
      if (modal.classList.contains("cmdbar-open")) return;
      lastFocused = document.activeElement;
      inertSiblings = getInertSiblings();
      inertSiblings.forEach(function (el) { el.setAttribute("inert", ""); });

      backdrop.classList.add("cmdbar-open");
      modal.classList.add("cmdbar-open");
      modal.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      // Reset list to full set
      renderList("");
      requestAnimationFrame(function () {
        input.focus();
        input.select();
      });
      resetIdleTimer();
    }

    function close() {
      if (!modal.classList.contains("cmdbar-open")) return;
      backdrop.classList.remove("cmdbar-open");
      modal.classList.remove("cmdbar-open");
      modal.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      inertSiblings.forEach(function (el) { el.removeAttribute("inert"); });
      inertSiblings = [];

      input.value = "";

      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      } else {
        trigger.focus();
      }
    }

    // --- Event wiring ---
    trigger.addEventListener("click", open);
    backdrop.addEventListener("click", close);

    // Global `/` to open, Esc to close
    document.addEventListener("keydown", function (e) {
      var isOpen = modal.classList.contains("cmdbar-open");
      // Open with `/`
      if (!isOpen && e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (isTypingTarget(document.activeElement)) return;
        // Skip if menu overlay is open (don't double-trap)
        var menu = document.querySelector(".menu-overlay.active");
        if (menu) return;
        e.preventDefault();
        open();
        return;
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      // Focus trap: Tab cycles within modal
      if (e.key === "Tab") {
        var focusables = modal.querySelectorAll(
          'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      // Arrow nav over list
      if (document.activeElement === input) {
        if (e.key === "ArrowDown") {
          if (filtered.length) {
            e.preventDefault();
            setActiveIndex(activeIndex + 1);
          }
          return;
        }
        if (e.key === "ArrowUp") {
          if (filtered.length) {
            e.preventDefault();
            setActiveIndex(activeIndex - 1);
          }
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
          return;
        }
      }
    });

    // Live filter as user types
    input.addEventListener("input", function () {
      renderList(input.value);
      resetIdleTimer();
    });

    function handleSubmit() {
      var raw = input.value;
      var trimmed = raw.trim();
      if (!trimmed) return;

      // Slash command path
      if (trimmed.charAt(0) === "/") {
        var lower = trimmed.toLowerCase();
        // Exact match
        var exact = COMMANDS.filter(function (c) { return c.cmd === lower; })[0];
        if (exact) {
          runCommand(exact);
          return;
        }
        // Or active selection from filtered list
        if (filtered.length && activeIndex >= 0 && filtered[activeIndex]) {
          runCommand(filtered[activeIndex]);
          return;
        }
        // No match — treat as free text question
      }

      // Free-text path
      runFreeText(trimmed);
      input.value = "";
      renderList("");
    }

    // --- Initial render (closed state) ---
    renderList("");
  });
})();
