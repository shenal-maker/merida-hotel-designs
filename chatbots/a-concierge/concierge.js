/* =========================================================
   Concierge — Launcher A (V1 Cinematic)
   Self-contained vanilla module. Reads data-hotel from its
   own <script> tag, mounts launcher + panel on DOMContentLoaded.
   Depends on:
     window.ChatbotResponses.match(hotel, query)
     window.ChatbotResponses.welcome(hotel)
     window.ChatbotFeedback.record(variant, rating, note)
   Fails silently if responses module is missing.
   ========================================================= */
(function () {
  'use strict';

  /* -------- read data-hotel from script tag -------- */
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.indexOf('concierge.js') !== -1) {
          return scripts[i];
        }
      }
      return null;
    })();

  var HOTEL = (currentScript && currentScript.getAttribute('data-hotel')) || 'boutique';
  var VARIANT = 'v1';
  var IDLE_FEEDBACK_MS = 30000;
  var TYPING_MS_PER_CHAR = 30;

  /* -------- reduced motion -------- */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- state -------- */
  var launcherEl = null;
  var panelEl = null;
  var streamEl = null;
  var inputEl = null;
  var sendBtnEl = null;
  var closeBtnEl = null;

  var isOpen = false;
  var userMessageCount = 0;
  var feedbackSurfaced = false;
  var idleTimer = null;
  var lastFocusedBeforeOpen = null;
  var welcomePrinted = false;

  /* =========================================================
     Build DOM
     ========================================================= */
  function mount() {
    if (!window.ChatbotResponses ||
        typeof window.ChatbotResponses.match !== 'function' ||
        typeof window.ChatbotResponses.welcome !== 'function') {
      // fail silently — never render a broken launcher
      return;
    }

    // host body bg hint so panel can swap canopy vs ink
    if (HOTEL === 'treehouse') {
      document.body.setAttribute('data-concierge-bg', 'canopy');
    } else {
      document.body.setAttribute('data-concierge-bg', 'ink');
    }

    // ---- Launcher ----
    launcherEl = document.createElement('button');
    launcherEl.type = 'button';
    launcherEl.className = 'concierge-launcher';
    launcherEl.setAttribute('aria-label', 'Open concierge chat');
    launcherEl.setAttribute('aria-expanded', 'false');
    launcherEl.setAttribute('aria-controls', 'concierge-panel');
    launcherEl.innerHTML =
      '<span class="concierge-launcher__dot" aria-hidden="true"></span>' +
      '<span class="concierge-launcher__label">Concierge</span>';

    launcherEl.addEventListener('click', openPanel);

    // ---- Panel ----
    panelEl = document.createElement('aside');
    panelEl.className = 'concierge-panel';
    panelEl.id = 'concierge-panel';
    panelEl.setAttribute('role', 'dialog');
    panelEl.setAttribute('aria-modal', 'true');
    panelEl.setAttribute('aria-labelledby', 'concierge-title');
    panelEl.setAttribute('aria-hidden', 'true');

    panelEl.innerHTML =
      '<div class="concierge-header">' +
        '<h2 class="concierge-header__title" id="concierge-title">Concierge</h2>' +
        '<button type="button" class="concierge-header__close" aria-label="Close concierge">×</button>' +
      '</div>' +
      '<div class="concierge-stream" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<form class="concierge-input" autocomplete="off">' +
        '<input type="text" class="concierge-input__field" ' +
                'placeholder="Ask the house..." ' +
                'aria-label="Ask the concierge" ' +
                'autocomplete="off" />' +
        '<button type="submit" class="concierge-input__send">Send</button>' +
      '</form>';

    document.body.appendChild(launcherEl);
    document.body.appendChild(panelEl);

    streamEl   = panelEl.querySelector('.concierge-stream');
    inputEl    = panelEl.querySelector('.concierge-input__field');
    sendBtnEl  = panelEl.querySelector('.concierge-input__send');
    closeBtnEl = panelEl.querySelector('.concierge-header__close');

    closeBtnEl.addEventListener('click', closePanel);
    panelEl.querySelector('.concierge-input').addEventListener('submit', handleSubmit);

    document.addEventListener('keydown', onKeydown);

    // entrance — delayed 2400ms
    if (prefersReducedMotion) {
      launcherEl.classList.add('is-revealed');
      launcherEl.style.opacity = '1';
      launcherEl.style.transform = 'none';
    } else {
      window.setTimeout(function () {
        launcherEl.classList.add('is-revealed');
      }, 2400);
    }
  }

  /* =========================================================
     Open / close
     ========================================================= */
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    lastFocusedBeforeOpen = document.activeElement;

    panelEl.classList.add('is-open');
    panelEl.setAttribute('aria-hidden', 'false');
    launcherEl.setAttribute('aria-expanded', 'true');

    if (!welcomePrinted) {
      printWelcome();
      welcomePrinted = true;
    }

    // focus the input shortly after open
    window.setTimeout(function () {
      if (inputEl) inputEl.focus();
    }, prefersReducedMotion ? 0 : 280);

    startIdleTimer();
  }

  function closePanel() {
    if (!isOpen) return;
    isOpen = false;

    panelEl.classList.remove('is-open');
    panelEl.setAttribute('aria-hidden', 'true');
    launcherEl.setAttribute('aria-expanded', 'false');

    clearIdleTimer();

    if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === 'function') {
      lastFocusedBeforeOpen.focus();
    } else if (launcherEl) {
      launcherEl.focus();
    }
  }

  function onKeydown(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key === 'Tab') {
      trapFocus(e);
    }
  }

  function trapFocus(e) {
    var focusable = panelEl.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    var list = Array.prototype.filter.call(focusable, function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!list.length) return;

    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* =========================================================
     Messages
     ========================================================= */
  function printWelcome() {
    var welcome = window.ChatbotResponses.welcome(HOTEL);
    // ensure demo notice is present
    if (welcome && welcome.toLowerCase().indexOf('demo') === -1) {
      welcome = welcome + ' (This is a demo chat — your feedback shapes what we build.)';
    }
    appendBotMessage(welcome || "Welcome. This is a demo concierge — ask anything you'd ask a hotel.");
  }

  function appendUserMessage(text) {
    var el = document.createElement('div');
    el.className = 'concierge-msg concierge-msg--user';
    el.textContent = text;
    streamEl.appendChild(el);
    scrollStream();
  }

  function appendBotMessage(text) {
    var el = document.createElement('div');
    el.className = 'concierge-msg concierge-msg--bot';

    var span = document.createElement('span');
    span.className = 'concierge-msg__text';
    el.appendChild(span);

    var cursor = document.createElement('span');
    cursor.className = 'concierge-msg__cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '▍';
    el.appendChild(cursor);

    streamEl.appendChild(el);
    scrollStream();

    if (prefersReducedMotion) {
      span.textContent = text;
      el.classList.add('is-done');
      return;
    }

    typeCharByChar(span, text, function () {
      el.classList.add('is-done');
      scrollStream();
    });
  }

  function typeCharByChar(node, text, done) {
    var i = 0;
    function step() {
      if (i >= text.length) {
        if (done) done();
        return;
      }
      node.textContent += text.charAt(i);
      i++;
      scrollStream();
      window.setTimeout(step, TYPING_MS_PER_CHAR);
    }
    step();
  }

  function scrollStream() {
    if (!streamEl) return;
    streamEl.scrollTop = streamEl.scrollHeight;
  }

  /* =========================================================
     Submit handling
     ========================================================= */
  function handleSubmit(e) {
    e.preventDefault();
    if (!inputEl) return;
    var raw = (inputEl.value || '').trim();
    if (!raw) return;

    inputEl.value = '';
    appendUserMessage(raw);
    userMessageCount++;
    resetIdleTimer();

    var reply = '';
    try {
      reply = window.ChatbotResponses.match(HOTEL, raw);
    } catch (err) {
      reply = "I'm sorry — something tangled. Could you try that again?";
    }
    if (!reply) {
      reply = "I'm a demo concierge. Tell me what you'd actually want to ask a hotel — we're collecting feedback.";
    }

    // small pause before bot starts typing — feels less canned
    window.setTimeout(function () {
      appendBotMessage(reply);
      maybeSurfaceFeedback();
    }, prefersReducedMotion ? 0 : 420);
  }

  /* =========================================================
     Feedback prompt
     ========================================================= */
  function maybeSurfaceFeedback() {
    if (feedbackSurfaced) return;
    if (userMessageCount < 3) return;
    surfaceFeedback();
  }

  function surfaceFeedback() {
    if (feedbackSurfaced || !streamEl) return;
    feedbackSurfaced = true;
    clearIdleTimer();

    var card = document.createElement('div');
    card.className = 'concierge-feedback';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', 'Rate this chat experience');
    card.innerHTML =
      '<p class="concierge-feedback__prompt">How does this chat experience feel?</p>' +
      '<div class="concierge-feedback__row">' +
        '<button type="button" class="concierge-feedback__btn" data-rating="useful">Useful</button>' +
        '<button type="button" class="concierge-feedback__btn" data-rating="ok">Just OK</button>' +
        '<button type="button" class="concierge-feedback__btn" data-rating="not-for-me">Not for me</button>' +
      '</div>' +
      '<p class="concierge-feedback__thanks">Thank you — noted.</p>';

    Array.prototype.forEach.call(
      card.querySelectorAll('.concierge-feedback__btn'),
      function (btn) {
        btn.addEventListener('click', function () {
          var rating = btn.getAttribute('data-rating');
          recordFeedback(rating);
          card.classList.add('is-acknowledged');
        });
      }
    );

    streamEl.appendChild(card);
    scrollStream();
  }

  function recordFeedback(rating) {
    try {
      if (window.ChatbotFeedback && typeof window.ChatbotFeedback.record === 'function') {
        window.ChatbotFeedback.record(VARIANT, rating, { hotel: HOTEL, turns: userMessageCount });
      } else {
        // fallback — preserve the convention from the brief
        var key = 'chatbot-feedback-' + VARIANT;
        var existing = [];
        try { existing = JSON.parse(window.localStorage.getItem(key) || '[]'); } catch (_) {}
        existing.push({ rating: rating, hotel: HOTEL, turns: userMessageCount, ts: Date.now() });
        window.localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch (_) {
      // swallow — feedback is best-effort
    }
  }

  /* =========================================================
     Idle timer
     ========================================================= */
  function startIdleTimer() {
    clearIdleTimer();
    idleTimer = window.setTimeout(function () {
      if (!feedbackSurfaced) surfaceFeedback();
    }, IDLE_FEEDBACK_MS);
  }
  function resetIdleTimer() {
    if (feedbackSurfaced) return;
    startIdleTimer();
  }
  function clearIdleTimer() {
    if (idleTimer) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  /* =========================================================
     Boot
     ========================================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
