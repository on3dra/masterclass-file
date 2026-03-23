const fs = require("node:fs");
const path = require("node:path");

const defaultBaseDir = path.resolve(__dirname, "..");
let inputPath = path.join(defaultBaseDir, "inputs", "feedback.csv");
let outputPath = path.join(defaultBaseDir, "outputs", "report.html");

// Optional overrides so we can reuse the generator in other PACT projects.
// Usage:
// node generate-report.js --input "Projects/masterclass-project/inputs/feedback.csv" --output "Projects/masterclass-project/outputs/report.html"
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  const next = process.argv[i + 1];
  if ((arg === "--input" || arg === "-i") && next) {
    inputPath = path.resolve(process.cwd(), next);
    i += 1;
  }
  if ((arg === "--output" || arg === "-o") && next) {
    outputPath = path.resolve(process.cwd(), next);
    i += 1;
  }
}

const POSITIVE_WORDS = [
  "great",
  "excellent",
  "super",
  "good",
  "skvela",
  "skvele",
  "rychle",
  "prehledne",
  "libi",
];

const NEGATIVE_WORDS = [
  "bad",
  "slow",
  "confusing",
  "crash",
  "pada",
  "nejde",
  "chybi",
  "nejasny",
  "pomal",
];

const TOPIC_KEYWORDS = {
  "Support": ["podpora", "support", "help", "napoved"],
  "Performance": ["slow", "pomal", "lag", "rychlost"],
  "UX / UI": ["ux", "ui", "onboarding", "prehled", "confusing"],
  "Billing": ["billing", "platba", "faktura"],
  "Authentication": ["hesla", "heslo", "login", "reset"],
  "Features": ["feature", "filtry", "dark mode", "notifikace"],
};

const TOPIC_RECOMMENDATIONS = {
  "Support": "Zkrať reakční dobu podpory a doplň 3-5 nejčastějších odpovědí do FAQ (včetně příkladů).",
  "Performance": "Najdi nejčastější příčiny zpomalení (vstupy, síť, cache) a přidej měření: čas načtení + p95 latency.",
  "UX / UI": "Udělej onboarding jednodušší: jasnější první obrazovka, kontrolní seznam kroků a lepší texty v klíčových screens.",
  "Billing": "Uprav checkout/billing tak, aby byl samovysvětlovací: ceny, změny plánu a stav platby bez zbytečných kroků.",
  "Authentication": "Zlepši flow login/reset: validace vstupů, konkrétní chybové hlášky a rychlý path k obnovení účtu.",
  "Features": "Komunikuj nové/klíčové funkce přímo v UI (tooltips + microcopy) a přidej rychlé průvodce pro filtry a notifikace.",
  "Other": "Projdi top negativní komentáře ručně a nastav jasné další kroky (bug fix vs. UX změna vs. komunikace).",
};

const STOPWORDS = new Set([
  // Common Czech (partial) + English stopwords. Kept short, since we also filter by token length.
  "a",
  "ale",
  "asi",
  "do",
  "i",
  "jak",
  "k",
  "který",
  "která",
  "které",
  "kterým",
  "ktery",
  "ktera",
  "ktere",
  "ke",
  "mezi",
  "mi",
  "mnoho",
  "ne",
  "nej",
  "o",
  "od",
  "opravdu",
  "pro",
  "prave",
  "proto",
  "se",
  "si",
  "s",
  "tak",
  "tady",
  "to",
  "u",
  "ve",
  "v",
  "za",
  "z",
  "with",
  "and",
  "or",
  "the",
  "a",
  "an",
  "to",
  "for",
  "of",
  "in",
  "on",
  "at",
  "but",
  "is",
  "are",
  "was",
  "were",
  "it",
  "this",
  "that",
  "be",
  "as",
  "by",
  "from",
  "not",
]);

function tokenizeWords(text) {
  const raw = String(text || "")
    .toLowerCase()
    .match(/\p{L}[\p{L}\p{N}]*/gu);
  const tokens = raw || [];
  return tokens.filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function computeTopWords(rows, topN = 25) {
  const counts = new Map();
  for (const r of rows) {
    const comment = r.comment || "";
    for (const w of tokenizeWords(comment)) {
      counts.set(w, (counts.get(w) || 0) + 1);
    }
  }

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const max = sorted.length ? sorted[0][1] : 0;
  return {
    max,
    words: sorted.slice(0, topN).map(([word, count]) => ({ word, count })),
  };
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  out.push(current.trim());
  return out;
}

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j += 1) {
      row[headers[j]] = (values[j] || "").trim();
    }
    rows.push(row);
  }

  return rows;
}

function safeInt(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 1 || n > 5) return null;
  return n;
}

function classifySentiment(comment, rating) {
  const lowered = String(comment || "").toLowerCase();
  const posHits = POSITIVE_WORDS.filter((w) => lowered.includes(w)).length;
  const negHits = NEGATIVE_WORDS.filter((w) => lowered.includes(w)).length;

  if (rating !== null) {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";
  }

  if (posHits > negHits) return "positive";
  if (negHits > posHits) return "negative";
  return "neutral";
}

function detectTopic(comment) {
  const lowered = String(comment || "").toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((k) => lowered.includes(k))) return topic;
  }
  return "Other";
}

function bar(percent, cls) {
  const width = Math.max(2, Number(percent.toFixed(2)));
  return `<div class="bar-row"><div class="label">${percent.toFixed(
    1
  )}%</div><div class="bar ${cls}" style="width:${width}%"></div></div>`;
}

function buildHtml(data) {
  const {
    total,
    avgRating,
    posPct,
    neuPct,
    negPct,
    ratingCounts,
    channelCounts,
    languageCounts,
    topicCounts,
    trend,
    enrichedRows,
    worstComments,
    recommendations,
    languages,
    channels,
    topicTop,
    topWords,
    topNegativeWords,
    topWordsMax,
    topNegativeWordsMax,
  } = data;

  const ratingBar = (n, label) => {
    const count = ratingCounts[n] || 0;
    const pct = total > 0 ? (count / total) * 100 : 0;
    const cls = n <= 2 ? "negative" : n === 3 ? "neutral" : "positive";
    return `<div class="bar-row"><div class="label">${label}</div><div class="bar ${cls}" style="width:${Math.max(
      2,
      pct
    )}%"></div><div class="bar-meta">${count}</div></div>`;
  };

  const languagesHtml = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang, count]) => `<li><strong>${escapeHtml(lang)}</strong>: ${count}</li>`)
    .join("");

  const topicsHtml = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, count]) => `<li><strong>${escapeHtml(topic)}</strong>: ${count}</li>`)
    .join("");

  const worstHtml = worstComments
    .slice(0, 8)
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.date)}</td><td>${escapeHtml(
          item.channel
        )}</td><td>${escapeHtml(item.topic)}</td><td class="comment-cell">${escapeHtml(
          item.comment
        )}</td></tr>`
    )
    .join("");

  const wordsToHtml = (wordsList, max, isNegative) => {
    const safeMax = max || 0;
    if (!wordsList || !wordsList.length || safeMax <= 0) {
      return `<div class="muted">Zadne slova k zobrazeni.</div>`;
    }
    return wordsList
      .map((w) => {
        const pct = safeMax ? (w.count / safeMax) * 100 : 0;
        const cls = isNegative ? "neg" : "";
        return `<div class="word-item">
          <div class="word-name">${escapeHtml(w.word)}</div>
          <div class="word-bar-wrap">
            <div class="word-bar-inner ${cls}" style="width:${pct.toFixed(1)}%"></div>
          </div>
          <div class="word-count">${w.count}</div>
        </div>`;
      })
      .join("");
  };

  const topWordsHtml = wordsToHtml(topWords, topWordsMax, false);
  const topNegativeWordsHtml = wordsToHtml(topNegativeWords, topNegativeWordsMax, true);

  const rowsJson = JSON.stringify(enrichedRows)
    .replaceAll("</script>", "<\\/script>");
  const aggJson = JSON.stringify({
    total,
    avgRating,
    posPct,
    neuPct,
    negPct,
    ratingCounts,
    channelCounts,
    languages,
    channels,
    topicTop,
    trend,
  }).replaceAll("</script>", "<\\/script>");

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Feedback Report</title>
  <style>
    :root{
      --bg:#f6f7fb; --card:#ffffff; --text:#172030; --muted:#5a6478;
      --border:#ebedf3; --shadow: 0 2px 10px rgba(0,0,0,0.05);
      --positive:#25c26e; --neutral:#7f8aa3; --negative:#ff5c73;
      --chip:#f2f4ff;
    }
    body.dark{
      --bg:#0b1220; --card:#0f1a2e; --text:#e6eefc; --muted:#a3b1d6;
      --border:rgba(255,255,255,0.12); --shadow:none; --chip: rgba(94, 120, 255, 0.14);
    }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .card { background: var(--card); border-radius: 14px; padding: 18px; margin-bottom: 14px; box-shadow: var(--shadow); border: 1px solid rgba(0,0,0,0.02); }
    body.dark .card{ border-color: var(--border); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
    h1 { margin-top: 0; margin-bottom: 6px; }
    h3 { margin-top: 0; }
    .kpi { font-size: 26px; font-weight: 700; margin-top: 4px; }
    .muted { color: var(--muted); font-size: 14px; }
    .topbar{ display:flex; align-items:flex-start; justify-content:space-between; gap: 12px; }
    .btn{
      border: 1px solid var(--border); background: var(--chip); color: var(--text);
      padding: 8px 10px; border-radius: 10px; cursor: pointer; font-weight: 600;
    }
    .bar-row { display: flex; align-items: center; gap: 10px; margin: 8px 0; }
    .label { width: 64px; font-size: 13px; color: var(--muted); }
    .bar { height: 12px; border-radius: 99px; min-width: 10px; }
    .bar-meta{ margin-left:auto; color: var(--muted); font-size: 12px; min-width: 30px; text-align:right; }
    .positive { background: var(--positive); }
    .neutral { background: var(--neutral); }
    .negative { background: var(--negative); }
    ul { margin-top: 8px; padding-left: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
    th { color: var(--muted); font-size: 13px; text-transform: uppercase; }
    .footer { color: var(--muted); font-size: 12px; margin-top: 8px; }
    .comment-cell{ max-width: 520px; }
    .clamp{ display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow:hidden; }
    .filters{ display:flex; flex-wrap:wrap; gap: 10px; align-items:flex-end; }
    .field{ display:flex; flex-direction:column; gap: 6px; }
    select,input{ font: inherit; padding: 10px; border-radius: 12px; border: 1px solid var(--border); background: transparent; color: var(--text); }
    input::placeholder{ color: var(--muted); }
    canvas{ max-width: 100%; }
    .table-wrap{ overflow:auto; border-radius: 12px; border: 1px solid var(--border); }
    .table-wrap table{ min-width: 980px; }
    .tag{
      display:inline-block; padding: 4px 8px; border-radius: 999px; background: var(--chip);
      color: var(--text); font-size: 12px; font-weight: 700; margin-right: 6px;
    }
    .word-item{ display:flex; align-items:center; gap: 10px; margin: 8px 0; }
    .word-name{ width: 130px; font-size: 13px; color: var(--muted); font-weight: 800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .word-bar-wrap{ flex: 1; background: rgba(79,124,255,0.10); border-radius: 999px; padding: 3px; }
    .word-bar-inner{ height: 8px; border-radius: 999px; background: rgba(79,124,255,0.55); width: 10%; }
    .word-bar-inner.neg{ background: rgba(255,92,115,0.60); }
    .word-count{ min-width: 42px; text-align:right; color: var(--muted); font-size: 12px; font-weight: 700; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="topbar">
        <div>
          <h1>Analyzator zpětné vazby</h1>
          <div class="muted">Automatický report z CSV dat (rating 1–5 + textové komentáře)</div>
        </div>
        <button class="btn" id="themeToggle" type="button">Dark mode</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="muted">Počet záznamů</div>
        <div class="kpi">${total}</div>
      </div>
      <div class="card">
        <div class="muted">Průměrné hodnocení</div>
        <div class="kpi">${avgRating.toFixed(2)} / 5</div>
      </div>
      <div class="card">
        <div class="muted">Negativní sentiment</div>
        <div class="kpi">${negPct.toFixed(1)}%</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Sentiment</h3>
        <div class="bars">
          ${bar(posPct, "positive")}
          ${bar(neuPct, "neutral")}
          ${bar(negPct, "negative")}
        </div>
        <div class="footer">Sentiment je heuristika: rating 1–2 = negativní, 4–5 = pozitivní, jinak dle slov.</div>
      </div>
      <div class="card">
        <h3>Distribuce ratingů</h3>
        ${ratingBar(1, "1")}
        ${ratingBar(2, "2")}
        ${ratingBar(3, "3")}
        ${ratingBar(4, "4")}
        ${ratingBar(5, "5")}
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Komentáře: trendy podle data</h3>
        <canvas id="trendChart" height="120"></canvas>
        <div class="footer">Osa X = datum, osa Y = průměrné hodnocení. Kritické = rating 1–2.</div>
      </div>
      <div class="card">
        <h3>Grafy (rating / sentiment / kanály)</h3>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          <div>
            <canvas id="ratingChart" height="120"></canvas>
          </div>
          <div>
            <canvas id="channelChart" height="120"></canvas>
          </div>
        </div>
        <div class="footer">Pokud se grafy nenačtou, stále bude fungovat tabulka a filtrování.</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Jazyky</h3>
        <ul>${languagesHtml}</ul>
      </div>
      <div class="card">
        <h3>Top témata</h3>
        <ul>${topicsHtml}</ul>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Nejčastější slova</h3>
        ${topWordsHtml}
      </div>
      <div class="card">
        <h3>Nejčastější slova (negativní)</h3>
        ${topNegativeWordsHtml}
      </div>
    </div>

    <div class="card">
      <h3>Doporučení (podle top kritických témat)</h3>
      <div id="recommendations">
        ${recommendations
          .map(
            (r) =>
              `<div style="margin-top:8px;">
                <span class="tag">${escapeHtml(r.topic)}</span>
                <span class="muted">kritické zmínky: ${r.criticalCount}</span>
                <div style="margin-top:6px;">${escapeHtml(r.text)}</div>
              </div>`
          )
          .join("")}
      </div>
      <div class="footer">Příští iterace: přidej “deep-dive” pro vybrané téma a export výsledků.</div>
    </div>

    <div class="card">
      <h3>Projděte komentáře</h3>
      <div class="filters">
        <div class="field">
          <label class="muted" for="filterLanguage">Jazyk</label>
          <select id="filterLanguage">
            <option value="__all__">Všechny</option>
            ${languages.map((l) => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="muted" for="filterChannel">Kanál</label>
          <select id="filterChannel">
            <option value="__all__">Všechny</option>
            ${channels.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="muted" for="filterSentiment">Sentiment</label>
          <select id="filterSentiment">
            <option value="__all__">Všechny</option>
            <option value="positive">Pozitivní</option>
            <option value="neutral">Neutrální</option>
            <option value="negative">Negativní</option>
          </select>
        </div>
        <div class="field">
          <label class="muted" for="filterRating">Rating</label>
          <select id="filterRating">
            <option value="__all__">Všechny</option>
            <option value="critical">1–2 (kritické)</option>
            <option value="mid">3 (neutrální)</option>
            <option value="good">4–5 (dobré)</option>
          </select>
        </div>
        <div class="field" style="min-width: 260px;">
          <label class="muted" for="filterSearch">Hledat</label>
          <input id="filterSearch" placeholder="např. onboarding, slow, reset..." />
        </div>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
        <button class="btn" id="exportCsv" type="button">Export CSV (filtrované)</button>
        <button class="btn" id="exportJson" type="button">Export JSON (filtrované)</button>
      </div>

      <div class="table-wrap" style="margin-top:12px;">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Lang</th>
              <th>Channel</th>
              <th>Rating</th>
              <th>Topic</th>
              <th>Sentiment</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody id="rowsBody">
          </tbody>
        </table>
      </div>
      <div class="footer">Tip: zkus “1–2 (kritické)” + vyhledat klíčové slovo. Tabulka se aktualizuje bez znovugenerování reportu.</div>
    </div>

    <div class="card">
      <h3>Rizikové komentáře (rating 1–2)</h3>
      <div class="table-wrap" style="margin-top:12px;">
        <table style="min-width: 780px;">
          <thead>
            <tr><th>Date</th><th>Channel</th><th>Topic</th><th>Comment</th></tr>
          </thead>
          <tbody>
            ${
              worstHtml ||
              "<tr><td colspan='4'>Zadne kriticke komentare.</td></tr>"
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    const FEEDBACK_ROWS = ${rowsJson};
    const AGG = ${aggJson};

    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      themeToggle.textContent = body.classList.contains("dark") ? "Light mode" : "Dark mode";
      try { localStorage.setItem("fa_theme", body.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
    });
    try {
      const saved = localStorage.getItem("fa_theme");
      if (saved === "dark") {
        body.classList.add("dark");
        themeToggle.textContent = "Light mode";
      }
    } catch (e) {}

    function matchesRating(row, mode) {
      if (mode === "__all__") return true;
      if (mode === "critical") return row.rating !== null && row.rating <= 2;
      if (mode === "mid") return row.rating === 3;
      if (mode === "good") return row.rating !== null && row.rating >= 4;
      return true;
    }

    function filterRows(rows) {
      const lang = document.getElementById("filterLanguage").value;
      const channel = document.getElementById("filterChannel").value;
      const sentiment = document.getElementById("filterSentiment").value;
      const ratingMode = document.getElementById("filterRating").value;
      const search = document.getElementById("filterSearch").value.trim().toLowerCase();

      return rows.filter((r) => {
        if (lang !== "__all__" && r.language !== lang) return false;
        if (channel !== "__all__" && r.channel !== channel) return false;
        if (sentiment !== "__all__" && r.sentiment !== sentiment) return false;
        if (!matchesRating(r, ratingMode)) return false;
        if (search) {
          const hay = String(r.comment || "") + " " + String(r.topic || "");
          if (!hay.toLowerCase().includes(search)) return false;
        }
        return true;
      });
    }

    function renderTable() {
      const rowsBody = document.getElementById("rowsBody");
      const filtered = filterRows(FEEDBACK_ROWS);
      rowsBody.innerHTML = "";

      const max = 200; // aby report zůstal svižný
      const slice = filtered.slice(0, max);

      for (const r of slice) {
        const tr = document.createElement("tr");

        const tdDate = document.createElement("td");
        tdDate.textContent = r.date || "";
        tr.appendChild(tdDate);

        const tdLang = document.createElement("td");
        tdLang.textContent = r.language || "";
        tr.appendChild(tdLang);

        const tdChannel = document.createElement("td");
        tdChannel.textContent = r.channel || "";
        tr.appendChild(tdChannel);

        const tdRating = document.createElement("td");
        tdRating.textContent = r.rating === null ? "" : String(r.rating);
        tr.appendChild(tdRating);

        const tdTopic = document.createElement("td");
        tdTopic.textContent = r.topic || "";
        tr.appendChild(tdTopic);

        const tdSent = document.createElement("td");
        tdSent.textContent = r.sentiment || "";
        tr.appendChild(tdSent);

        const tdComment = document.createElement("td");
        const div = document.createElement("div");
        div.className = "clamp";
        div.textContent = r.comment || "";
        tdComment.appendChild(div);
        tr.appendChild(tdComment);

        rowsBody.appendChild(tr);
      }

      if (filtered.length > max) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 7;
        td.className = "muted";
        td.textContent = "Zobrazuji prvních " + max + " z " + filtered.length + " nalezených.";
        tr.appendChild(td);
        rowsBody.appendChild(tr);
      }
    }

    function initCharts() {
      if (!window.Chart) return;

      // rating distribution
      const ratingCtx = document.getElementById("ratingChart");
      if (ratingCtx) {
        new Chart(ratingCtx, {
          type: "bar",
          data: {
            labels: ["1", "2", "3", "4", "5"],
            datasets: [
              {
                label: "Počet",
                data: ["1", "2", "3", "4", "5"].map((k) => AGG.ratingCounts[k] || 0),
                backgroundColor: [
                  getComputedStyle(document.body).getPropertyValue("--negative").trim() || "#ff5c73",
                  getComputedStyle(document.body).getPropertyValue("--negative").trim() || "#ff5c73",
                  getComputedStyle(document.body).getPropertyValue("--neutral").trim() || "#7f8aa3",
                  getComputedStyle(document.body).getPropertyValue("--positive").trim() || "#25c26e",
                  getComputedStyle(document.body).getPropertyValue("--positive").trim() || "#25c26e",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
          },
        });
      }

      // channel distribution (top 6)
      const channelsSorted = Object.entries(AGG.channelCounts || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const channelCtx = document.getElementById("channelChart");
      if (channelCtx && channelsSorted.length) {
        new Chart(channelCtx, {
          type: "doughnut",
          data: {
            labels: channelsSorted.map((x) => x[0]),
            datasets: [
              {
                data: channelsSorted.map((x) => x[1]),
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { position: "bottom" } },
          },
        });
      }

      // trend
      const trendCtx = document.getElementById("trendChart");
      if (trendCtx && AGG.trend && AGG.trend.dates && AGG.trend.dates.length) {
        new Chart(trendCtx, {
          type: "line",
          data: {
            labels: AGG.trend.dates,
            datasets: [
              {
                label: "Avg rating",
                data: AGG.trend.avgRatings,
                borderColor: "#4f7cff",
                backgroundColor: "rgba(79,124,255,0.15)",
                tension: 0.25,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } },
            },
          },
        });
      }
    }

    function downloadText(filename, text, mimeType) {
      const blob = new Blob([text], { type: mimeType || "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function escapeCsvCell(value) {
      const s = value === null || value === undefined ? "" : String(value);
      if (/[",\n\r]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
      return s;
    }

    function filteredToCsv(rows) {
      const headers = ["id", "date", "language", "rating", "channel", "topic", "sentiment", "comment"];
      const lines = [headers.join(",")];
      for (const r of rows) {
        lines.push(
          headers.map((h) => escapeCsvCell(r[h])).join(",")
        );
      }
      return lines.join("\n");
    }

    function init() {
      renderTable();
      initCharts();

      const ids = ["filterLanguage", "filterChannel", "filterSentiment", "filterRating", "filterSearch"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", renderTable);
        if (el) el.addEventListener("change", renderTable);
      }

      const exportCsv = document.getElementById("exportCsv");
      if (exportCsv) {
        exportCsv.addEventListener("click", () => {
          const filtered = filterRows(FEEDBACK_ROWS);
          const csv = filteredToCsv(filtered);
          downloadText("feedback_filtered.csv", csv, "text/csv;charset=utf-8");
        });
      }

      const exportJson = document.getElementById("exportJson");
      if (exportJson) {
        exportJson.addEventListener("click", () => {
          const filtered = filterRows(FEEDBACK_ROWS);
          downloadText(
            "feedback_filtered.json",
            JSON.stringify(filtered, null, 2),
            "application/json;charset=utf-8"
          );
        });
      }
    }

    window.addEventListener("DOMContentLoaded", init);
  </script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const raw = fs.readFileSync(inputPath, "utf8");
  const rows = parseCsv(raw);

  const sentiments = { positive: 0, neutral: 0, negative: 0 };
  const languageCounts = {};
  const topicCounts = {};
  const channelCounts = {};
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const worstComments = [];
  const ratings = [];
  const enrichedRows = [];
  const topicNegativeCounts = {};

  const trendByDate = {}; // dateISO -> { sumRating, countRating, criticalCount }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  for (const row of rows) {
    const rating = safeInt(row.rating);
    const comment = row.comment || "";
    const language = row.language || "unknown";
    const channel = row.channel || "unknown";
    const topic = detectTopic(comment);
    const dateISO = (row.date || "").trim();
    const sentiment = classifySentiment(comment, rating);

    if (rating !== null) ratings.push(rating);

    sentiments[sentiment] += 1;
    languageCounts[language] = (languageCounts[language] || 0) + 1;
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;

    if (rating !== null) ratingCounts[rating] += 1;

    enrichedRows.push({
      id: row.id || "",
      date: dateISO,
      language,
      rating,
      channel,
      comment,
      topic,
      sentiment,
    });

    if (dateISO && dateRegex.test(dateISO) && rating !== null) {
      if (!trendByDate[dateISO]) {
        trendByDate[dateISO] = { sumRating: 0, countRating: 0, criticalCount: 0 };
      }
      trendByDate[dateISO].sumRating += rating;
      trendByDate[dateISO].countRating += 1;
      if (rating <= 2) trendByDate[dateISO].criticalCount += 1;
    }

    if (rating !== null && rating <= 2) {
      worstComments.push({
        date: dateISO,
        channel,
        topic,
        comment,
      });
      topicNegativeCounts[topic] = (topicNegativeCounts[topic] || 0) + 1;
    }
  }

  const total = rows.length;
  const avgRating =
    ratings.length > 0 ? ratings.reduce((sum, n) => sum + n, 0) / ratings.length : 0;

  const posPct = total > 0 ? (sentiments.positive / total) * 100 : 0;
  const neuPct = total > 0 ? (sentiments.neutral / total) * 100 : 0;
  const negPct = total > 0 ? (sentiments.negative / total) * 100 : 0;

  const trendDates = Object.keys(trendByDate).sort();
  const avgRatingsTrend = trendDates.map((d) => {
    const t = trendByDate[d];
    return t.countRating > 0 ? t.sumRating / t.countRating : 0;
  });

  const trend = { dates: trendDates, avgRatings: avgRatingsTrend };

  const languages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .map((x) => x[0]);
  const channels = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .map((x) => x[0]);

  const topicTop = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((x) => x[0]);

  const topCriticalTopicsNoOther = Object.entries(topicNegativeCounts)
    .filter(([t]) => t !== "Other")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const fallbackCriticalTopics = Object.entries(topicNegativeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const topicsForRecs =
    topCriticalTopicsNoOther.length > 0 ? topCriticalTopicsNoOther : fallbackCriticalTopics;

  const recommendations =
    topicsForRecs.length > 0
      ? topicsForRecs.map(([topic, count]) => ({
          topic,
          criticalCount: count,
          text: TOPIC_RECOMMENDATIONS[topic] || TOPIC_RECOMMENDATIONS.Other,
        }))
      : [
          {
            topic: "Other",
            criticalCount: 0,
            text: TOPIC_RECOMMENDATIONS.Other,
          },
        ];

  // Seřadit rizikové komentáře: nejnovější nahoře (ISO string seřadí chronologicky)
  worstComments.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const topWordsResult = computeTopWords(enrichedRows, 25);
  const topWords = topWordsResult.words;
  const topWordsMax = topWordsResult.max;

  const negativeRows = enrichedRows.filter((r) => r.sentiment === "negative");
  const topNegativeWordsResult = computeTopWords(negativeRows, 25);
  const topNegativeWords = topNegativeWordsResult.words;
  const topNegativeWordsMax = topNegativeWordsResult.max;

  const html = buildHtml({
    total,
    avgRating,
    posPct,
    neuPct,
    negPct,
    ratingCounts,
    channelCounts,
    languageCounts,
    topicCounts,
    trend,
    enrichedRows,
    worstComments,
    recommendations,
    languages,
    channels,
    topicTop,
    topWords,
    topNegativeWords,
    topWordsMax,
    topNegativeWordsMax,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");
  console.log(`Report generated: ${outputPath}`);
}

main();
