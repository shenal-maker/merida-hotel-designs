/* ============================================
   Launcher B — "Ask the editor" inline column (V2 Editorial)
   Self-contained. Reads data-hotel from its own <script> tag.
   The static HTML already provides the heading + input + chips (so the section
   survives no-JS). This module:
     • binds the input/chips/submit
     • word-by-word reveals scripted responses
     • enforces a 4-turn visible window with "View earlier"
     • surfaces a feedback prompt after 3 user messages
     • smooth-scrolls the masthead "Ask the editor" link
   Uses (defensively):
     window.ChatbotResponses.match(hotel, query) → string | { text, ... }
     window.ChatbotResponses.welcome(hotel)      → string
     window.ChatbotFeedback.record(variant, vote)
   Falls back silently if those globals are missing.
   ============================================ */

(function () {
  'use strict';

  // ---- discover own script tag ----------------------------------------------
  var ownScript = document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('b-editor/editor.js') !== -1) return scripts[i];
      }
      return null;
    })();

  var HOTEL = (ownScript && ownScript.getAttribute('data-hotel')) || 'boutique';
  var VARIANT_ID = 'b'; // launcher B, shared brief feedback key family
  var REVEAL_MS_PER_WORD = 80;
  var MAX_VISIBLE_TURNS = 4;
  var FEEDBACK_AFTER_MSGS = 3;

  // ---- boot -----------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var section = document.querySelector('.editor-chat[data-hotel="' + HOTEL + '"]')
      || document.querySelector('.editor-chat');
    if (!section) return;

    wireNavScroll();
    wireSection(section);
  }

  // ---- masthead nav "Ask the editor →" smooth scroll ------------------------
  function wireNavScroll() {
    var link = document.querySelector('.masthead-nav-ask, a[data-ask-editor-link]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector('.editor-chat');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      // Focus the input after the scroll settles (a11y nicety)
      var input = target.querySelector('.editor-chat__input');
      if (input) {
        setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); } },
          prefersReducedMotion() ? 0 : 600);
      }
    });
  }

  // ---- wire the section -----------------------------------------------------
  function wireSection(section) {
    var form    = section.querySelector('.editor-chat__form');
    var input   = section.querySelector('.editor-chat__input');
    var wrap    = section.querySelector('.editor-chat__input-wrap');
    var submit  = section.querySelector('.editor-chat__submit');
    var thread  = section.querySelector('.editor-chat__thread');
    var chips   = section.querySelectorAll('.editor-chat__chip');

    if (!form || !input || !thread) return;

    // Custom-caret focus state
    if (wrap) {
      input.addEventListener('focus', function () { wrap.classList.add('is-focused'); });
      input.addEventListener('blur',  function () { wrap.classList.remove('is-focused'); });
    }

    // Disable submit while empty
    function syncSubmit() {
      if (!submit) return;
      submit.disabled = input.value.trim().length === 0;
    }
    syncSubmit();
    input.addEventListener('input', syncSubmit);

    // Submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = '';
      syncSubmit();
      askEditor(section, thread, q);
    });

    // Chips
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        var q = chip.getAttribute('data-prompt') || chip.textContent.trim();
        if (!q) return;
        askEditor(section, thread, q);
      });
    });

    // Welcome reply (quiet — not auto-popped, but seeded as the first editor note
    // so the thread isn't empty on first scroll). Per brief: clearly mention "demo".
    var welcome = safeWelcome(HOTEL);
    if (welcome) {
      appendEditorReply(section, thread, welcome, /*reveal*/ true);
    }
  }

  // ---- the ask/answer loop --------------------------------------------------
  function askEditor(section, thread, query) {
    // Track user message count on the section element
    var count = parseInt(section.getAttribute('data-msg-count') || '0', 10) + 1;
    section.setAttribute('data-msg-count', String(count));

    appendUserQuestion(section, thread, query);

    // Resolve response (defensive — global may not be loaded)
    var answerText = safeMatch(HOTEL, query);
    // tiny pause so the user-question render isn't instantly overridden
    setTimeout(function () {
      appendEditorReply(section, thread, answerText, /*reveal*/ true);
      if (count === FEEDBACK_AFTER_MSGS) {
        appendFeedbackPrompt(section, thread);
      }
    }, prefersReducedMotion() ? 0 : 220);
  }

  // ---- DOM builders ---------------------------------------------------------
  function appendUserQuestion(section, thread, query) {
    var turn = document.createElement('article');
    turn.className = 'editor-chat__turn editor-chat__turn--user';

    var qLabel = document.createElement('span');
    qLabel.className = 'editor-chat__q-label';
    qLabel.textContent = 'You asked';

    var q = document.createElement('p');
    q.className = 'editor-chat__q';
    q.appendChild(qLabel);
    q.appendChild(document.createTextNode(query));

    turn.appendChild(q);
    thread.appendChild(turn);
    enforceTurnWindow(section, thread);
  }

  function appendEditorReply(section, thread, text, reveal) {
    if (!text) return;
    var turn = document.createElement('article');
    turn.className = 'editor-chat__turn editor-chat__turn--editor';

    var p = document.createElement('p');
    p.className = 'editor-chat__a';

    var tag = document.createElement('span');
    tag.className = 'editor-chat__a-tag';
    tag.textContent = '[ The editor ]';
    p.appendChild(tag);

    if (reveal && !prefersReducedMotion()) {
      revealWordByWord(p, text);
    } else {
      p.appendChild(document.createTextNode(text));
    }

    turn.appendChild(p);
    thread.appendChild(turn);
    enforceTurnWindow(section, thread);
  }

  function appendFeedbackPrompt(section, thread) {
    // Don't double-add
    if (section.querySelector('.editor-chat__feedback')) return;

    var box = document.createElement('div');
    box.className = 'editor-chat__feedback';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Feedback on this chat experience');

    var q = document.createElement('p');
    q.className = 'editor-chat__feedback-q';
    q.textContent = 'How does this chat experience feel?';
    box.appendChild(q);

    var row = document.createElement('div');
    row.className = 'editor-chat__feedback-row';

    ['Useful', 'Just OK', 'Not for me'].forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'editor-chat__feedback-btn';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        safeRecord('v2', label);
        // Replace with a thank-you note in place
        var thanks = document.createElement('p');
        thanks.className = 'editor-chat__feedback-thanks';
        thanks.textContent = 'Thank you — noted.';
        box.replaceChildren ? box.replaceChildren(thanks) : (function () {
          while (box.firstChild) box.removeChild(box.firstChild);
          box.appendChild(thanks);
        })();
      });
      row.appendChild(btn);
    });

    box.appendChild(row);
    thread.appendChild(box);
  }

  // ---- word-by-word reveal --------------------------------------------------
  function revealWordByWord(container, text) {
    // Split on spaces but preserve them as separate text nodes so wrapping works.
    var tokens = String(text).split(/(\s+)/);
    var wordSpans = [];

    tokens.forEach(function (tok) {
      if (tok.length === 0) return;
      if (/^\s+$/.test(tok)) {
        var space = document.createElement('span');
        space.className = 'editor-chat__word-space';
        space.textContent = tok;
        container.appendChild(space);
      } else {
        var span = document.createElement('span');
        span.className = 'editor-chat__word';
        span.textContent = tok;
        container.appendChild(span);
        wordSpans.push(span);
      }
    });

    // Schedule reveals — 80ms per word
    wordSpans.forEach(function (span, i) {
      setTimeout(function () { span.classList.add('is-in'); }, i * REVEAL_MS_PER_WORD);
    });
  }

  // ---- 4-turn visible window ------------------------------------------------
  function enforceTurnWindow(section, thread) {
    var turns = thread.querySelectorAll('.editor-chat__turn');
    if (turns.length <= MAX_VISIBLE_TURNS) return;

    var collapseUpTo = turns.length - MAX_VISIBLE_TURNS;
    for (var i = 0; i < collapseUpTo; i++) {
      turns[i].classList.add('editor-chat__turn--collapsed');
    }

    // Insert / update the "View earlier" toggle as the first child
    var existing = thread.querySelector('.editor-chat__view-earlier');
    if (existing) {
      existing.textContent = 'View earlier (' + collapseUpTo + ') ↑';
      return;
    }

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'editor-chat__view-earlier';
    toggle.textContent = 'View earlier (' + collapseUpTo + ') ↑';
    toggle.addEventListener('click', function () {
      var collapsed = thread.querySelectorAll('.editor-chat__turn--collapsed');
      Array.prototype.forEach.call(collapsed, function (t) {
        t.classList.remove('editor-chat__turn--collapsed');
      });
      toggle.remove();
    });
    thread.insertBefore(toggle, thread.firstChild);
  }

  // ---- safe global accessors ------------------------------------------------
  function safeMatch(hotel, query) {
    try {
      if (window.ChatbotResponses && typeof window.ChatbotResponses.match === 'function') {
        var r = window.ChatbotResponses.match(hotel, query);
        if (typeof r === 'string') return r;
        if (r && typeof r.text === 'string') return r.text;
      }
    } catch (_) { /* swallow */ }
    return defaultFallback(query);
  }

  function safeWelcome(hotel) {
    try {
      if (window.ChatbotResponses && typeof window.ChatbotResponses.welcome === 'function') {
        var w = window.ChatbotResponses.welcome(hotel);
        if (typeof w === 'string') return w;
        if (w && typeof w.text === 'string') return w.text;
      }
    } catch (_) { /* swallow */ }
    return defaultWelcome(hotel);
  }

  function safeRecord(variant, vote) {
    try {
      if (window.ChatbotFeedback && typeof window.ChatbotFeedback.record === 'function') {
        window.ChatbotFeedback.record(variant, vote);
        return;
      }
    } catch (_) { /* swallow */ }
    // Fallback — local key, harmless
    try {
      var k = 'chatbot-' + VARIANT_ID + '-feedback';
      var arr = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push({ variant: variant, vote: vote, ts: Date.now() });
      localStorage.setItem(k, JSON.stringify(arr));
    } catch (_) { /* swallow */ }
  }

  function defaultWelcome(hotel) {
    // Quiet, magazine-voiced. Mentions "demo" per brief.
    if (hotel === 'treehouse') {
      return 'This is a demo of a chat experience. Ask whatever you would actually ask the house — your dates, your reason for coming — and a scripted reply will appear.';
    }
    return 'This is a demo of a chat experience. Ask whatever you would actually ask the house — your dates, your reason for coming — and a scripted reply will appear.';
  }

  function defaultFallback(query) {
    return 'I am a demo of a chat experience. Tell me what you would actually want to ask a hotel concierge — we are collecting feedback on what to build next.';
  }

  function prefersReducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (_) { return false; }
  }
})();
