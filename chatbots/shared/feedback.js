/* Shared feedback module for all 4 chatbot patterns.
   Writes ratings + notes to localStorage, keyed per variant.
   ?feedback=1 in the URL renders an owner-facing viewer card. */
(function () {
  "use strict";

  var KEY_PREFIX = "chatbot-feedback-";

  function safeStorage() {
    try {
      var t = "__t__";
      window.localStorage.setItem(t, t);
      window.localStorage.removeItem(t);
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  function record(variantId, rating, note) {
    var store = safeStorage();
    if (!store || !variantId) return false;
    var key = KEY_PREFIX + String(variantId);
    var existing;
    try {
      existing = JSON.parse(store.getItem(key) || "[]");
      if (!Array.isArray(existing)) existing = [];
    } catch (e) {
      existing = [];
    }
    existing.push({
      ts: new Date().toISOString(),
      rating: rating || "",
      note: note || ""
    });
    try {
      store.setItem(key, JSON.stringify(existing));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getAll() {
    var store = safeStorage();
    if (!store) return [];
    var out = [];
    for (var i = 0; i < store.length; i++) {
      var k = store.key(i);
      if (!k || k.indexOf(KEY_PREFIX) !== 0) continue;
      var variantId = k.slice(KEY_PREFIX.length);
      var entries;
      try {
        entries = JSON.parse(store.getItem(k) || "[]");
        if (!Array.isArray(entries)) entries = [];
      } catch (e) {
        entries = [];
      }
      for (var j = 0; j < entries.length; j++) {
        var e = entries[j] || {};
        out.push({
          variantId: variantId,
          ts: e.ts || "",
          rating: e.rating || "",
          note: e.note || ""
        });
      }
    }
    out.sort(function (a, b) { return (b.ts || "").localeCompare(a.ts || ""); });
    return out;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildViewer(rows) {
    var wrap = document.createElement("aside");
    wrap.setAttribute("role", "complementary");
    wrap.setAttribute("aria-label", "Chatbot feedback viewer");
    wrap.style.cssText = [
      "position:fixed",
      "top:24px",
      "right:24px",
      "width:min(560px, calc(100vw - 48px))",
      "max-height:calc(100vh - 48px)",
      "overflow:auto",
      "z-index:2147483000",
      "background:#f7f3ea",
      "color:#1a1714",
      "border:1px solid #1a1714",
      "padding:20px 22px",
      "font-family:'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      "font-size:12px",
      "line-height:1.5",
      "box-shadow:0 24px 60px rgba(0,0,0,0.15)"
    ].join(";");

    var header = document.createElement("div");
    header.style.cssText = "display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:16px;";
    var title = document.createElement("div");
    title.style.cssText = "font-size:11px;letter-spacing:0.15em;text-transform:uppercase;";
    title.textContent = "[ Chatbot feedback · " + rows.length + " entries ]";
    var closer = document.createElement("button");
    closer.type = "button";
    closer.textContent = "× close";
    closer.style.cssText = "background:none;border:1px solid #1a1714;color:#1a1714;font:inherit;padding:4px 8px;cursor:pointer;";
    closer.addEventListener("click", function () { wrap.remove(); });
    header.appendChild(title);
    header.appendChild(closer);
    wrap.appendChild(header);

    if (!rows.length) {
      var empty = document.createElement("p");
      empty.textContent = "No feedback recorded yet.";
      empty.style.cssText = "margin:0;color:#5a4f44;";
      wrap.appendChild(empty);
      return wrap;
    }

    var table = document.createElement("table");
    table.style.cssText = "width:100%;border-collapse:collapse;font:inherit;";
    var thead = document.createElement("thead");
    thead.innerHTML =
      "<tr>" +
      "<th style='text-align:left;padding:6px 8px;border-bottom:1px solid #1a1714;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;'>When</th>" +
      "<th style='text-align:left;padding:6px 8px;border-bottom:1px solid #1a1714;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;'>Variant</th>" +
      "<th style='text-align:left;padding:6px 8px;border-bottom:1px solid #1a1714;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;'>Rating</th>" +
      "<th style='text-align:left;padding:6px 8px;border-bottom:1px solid #1a1714;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;'>Note</th>" +
      "</tr>";
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var when = r.ts ? r.ts.replace("T", " ").slice(0, 16) : "—";
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td style='padding:6px 8px;border-bottom:1px solid rgba(26,23,20,0.15);vertical-align:top;white-space:nowrap;'>" + escapeHtml(when) + "</td>" +
        "<td style='padding:6px 8px;border-bottom:1px solid rgba(26,23,20,0.15);vertical-align:top;'>" + escapeHtml(r.variantId) + "</td>" +
        "<td style='padding:6px 8px;border-bottom:1px solid rgba(26,23,20,0.15);vertical-align:top;'>" + escapeHtml(r.rating) + "</td>" +
        "<td style='padding:6px 8px;border-bottom:1px solid rgba(26,23,20,0.15);vertical-align:top;'>" + escapeHtml(r.note) + "</td>";
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);

    var foot = document.createElement("div");
    foot.style.cssText = "margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;";
    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "Copy JSON";
    copyBtn.style.cssText = "background:none;border:1px solid #1a1714;color:#1a1714;font:inherit;padding:6px 10px;cursor:pointer;";
    copyBtn.addEventListener("click", function () {
      var text = JSON.stringify(rows, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = "Copy JSON"; }, 1500);
        });
      }
    });
    foot.appendChild(copyBtn);
    wrap.appendChild(foot);

    return wrap;
  }

  function viewIfRequested() {
    if (typeof window === "undefined" || !window.location) return;
    var qs = window.location.search || "";
    if (qs.indexOf("feedback=1") === -1) return;
    if (!document.body) return;
    if (document.getElementById("chatbot-feedback-viewer")) return;
    var rows = getAll();
    var node = buildViewer(rows);
    node.id = "chatbot-feedback-viewer";
    document.body.appendChild(node);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", viewIfRequested);
  } else {
    viewIfRequested();
  }

  window.ChatbotFeedback = {
    record: record,
    getAll: getAll,
    viewIfRequested: viewIfRequested
  };
})();
