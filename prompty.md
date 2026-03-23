# Cursor Masterclass — Kompletní prompty

Exportováno: 23. 3. 2026

---

## Blok 0 — Setupový prompt

*Ověří připravenost prostředí pro workshop*

```
Zkontroluj, zda je moje prostředí připraveno na Cursor Masterclass. Ověř: 1) Spouštíš se v Agent mode, 2) Spusť node -v a zkontroluj, zda je Node.js nainstalován, 3) Spusť gh auth status a zkontroluj přihlášení GitHub CLI, 4) Ověř, zda funguje terminál. U všeho, co chybí nebo nefunguje, vysvětli problém a zeptej se, zda chci pomoci s opravou.
```

---

## Blok 3 — PACT Scaffolding

*Vytvoří kompletní strukturu workspace*

```
Vytvoř PACT workspace strukturu v aktuálním adresáři:
- .cursorrules (prázdný soubor, naplníme později)
- Projects/masterclass-project/inputs/ (prázdná složka)
- Projects/masterclass-project/outputs/ (prázdná složka)
- Agents/ (prázdná složka)
- Context/identity/ (prázdná složka)
- Context/goals/ (prázdná složka)
- Tools/ (prázdná složka)
Vytvoř pouze strukturu, nic víc.
```

---

## Blok 3 — Context Export

*Exportuje vaši paměť z ChatGPT/Claude do kontextového souboru*

```
Export all of my stored memories and any context you've learned about me from past conversations. Preserve my words verbatim where possible, especially for instructions and preferences.

## Categories (output in this order):

### 1. Instructions
Rules I've explicitly asked you to follow — tone, format, style, "always do X", "never do Y", corrections to your behavior. Only from stored memories, not current conversation.

### 2. Identity
Name, location, languages, timezone, personal context relevant to work style.

### 3. Career
Current roles, companies, general skill areas. Keep it brief.

### 4. Active Projects
Projects I'm currently working on. ONE entry per project. Include:
- What it does (1–2 sentences)
- Tech stack: language, framework, key libraries, DB, hosting/deploy
- Current status / what's actively in progress
- Key architectural decisions or constraints
- Repo name or path if known
- Tag as [ACTIVE] or [ARCHIVED]

### 5. Preferences & Working Style
Opinions, tastes, workflow habits that apply broadly across projects.

### 6. Cursor-Specific Context
- Preferred AI behavior in code (verbosity level, inline comments, test coverage)
- Code style & formatting (Prettier config, linting rules, indentation)
- Naming conventions (camelCase, kebab-case, PascalCase, etc.)
- Folder/file structure patterns I follow
- Languages and frameworks to prefer or avoid
- Any known .cursor/rules/ content or conventions
- How I prefer diffs and suggestions to be presented

---

## Output format

Use section headers matching the categories above. Within each section, use plain bullet points — no dates.
For Active Projects, use this format per project:

---
**[PROJECT NAME]** [ACTIVE/ARCHIVED]
- What: ...
- Stack: ...
- Status: ...
- Decisions: ...
- Repo: ...
---

## Final step — critical

After the export, generate a second code block in clean Markdown formatted as a Cursor project context file. This file should:
- Start with a heading: # Developer Context
- Include a short intro paragraph summarizing who I am as a developer
- Include a "## Active Projects" section with all active projects formatted clearly
- Include a "## Tech Preferences" section
- Include a "## Working Style" section
- Include a "## AI Behavior Preferences" section for Cursor-specific instructions
- Be concise, no fluff — this file will be read by an AI on every prompt
- End with: *Last updated: [today's date]*
```

---

## Blok 3 — Extrakce z obsahu

*Analyzuje váš styl z ukázek*

```
Analyzuj můj styl psaní z těchto ukázek. Jaké vzory vidíš v mém tónu, slovní zásobě a rytmu? Vygeneruj na základě toho soubor tone-of-voice.md.
```

---

## Blok 3 — Režim pohovoru

*5 otázek → tone-of-voice.md*

```
Potřebuji vytvořit soubor tone-of-voice.md. Zeptej se mě na 5 otázek o tom, jak píšu a komunikuji – můj styl, čemu se vyhýbám, na co jsem hrdý/á. Pak vygeneruj soubor z mých odpovědí.
```

---

## Blok 3 — Těžba z historie

*Vytěží vzory z vašich konverzací*

```
Podívej se na mé nedávné konverzace v tomto workspace. Jaké vzory vidíš v tom, jak píšu? Vygeneruj na základě toho soubor tone-of-voice.md.
```

---

## Blok 3 — Vlastní brand guide

*Shrne existující dokumentaci*

```
Shrň toto do souboru tone-of-voice.md a current-priorities.md.
```

---

## Blok 3 — Rules z Contextu

*Vygeneruje .cursorrules ze souborů Context/*

```
Na základě souborů Context/, které jsme právě vytvořili, vygeneruj soubor .cursorrules.
```

---

## Blok 3 — Rules z historie

*Najde opakující se instrukce v konverzacích*

```
Projdi mé nedávné konverzace v Cursoru. Jaké instrukce neustále opakuji? Vygeneruj .cursorrules, abych je přestal/a opakovat.
```

---

## Blok 3 — Test pravidel

*Ověří, že pravidla a kontext fungují*

```
Přečti data z Projects/masterclass-project/inputs/ a vytvoř zprávu v outputs/.
```

---

## Blok 4 — MCP Setup pro Notion

*Připojí Cursor k vašemu Notion workspace*

```
Nastav MCP server, abych se mohl/a z Cursoru připojit k Notionu.
```

---

## Blok 4 — Marketing Orchestrátor

*Subagent, který diagnostikuje a řídí workflow*

```
Jsi marketingový stratég. Když uživatel přinese výzvu, zeptej se na 2–3 kvalifikační otázky. Pak doporuč sekvenci skills a proveď ji. Dostupné: brand-voice → positioning-angles → direct-response-copy → content-atomizer
```

---

## Blok 8 — Vyhledávač projektu

*Navrhne 3 projekty na míru vaší práci*

```
Na základě všeho co o mě víš – navrhni 3 nápady na mikroaplikace, které by mi skutečně ušetřily čas nebo vyřešily reálný problém v mé práci. Pro každý: dej mu název, popiš ho jednou větou, uveď, co by bylo potřeba k jeho sestavení v Cursoru dnes (do 2 hodin), a ohodnoť náročnost (začátečník / pokročilý / expert). Návrhy udělej konkrétní pro moji skutečnou práci, ne generické nápady.
```

---

## Deploy prompt

*Z lokálního projektu na živou URL*

```
Mám hotový projekt [popiš co jsi vytvořil] a chci ho dostat na internet.

Potřebuju projít celou cestu:
1. Inicializovat Git a pushnout kód na GitHub
2. Propojit GitHub repo s Vercelem (nebo Railway), aby se projekt automaticky nasadil
3. Ověřit, že mám živou URL

Zatím nemám nic z toho nastavené — proveď mě od začátku. Pokud mi něco chybí (GitHub účet, git, gh CLI), řekni co a jak to nainstalovat.

Chci, aby výsledek fungoval tak, že při každém dalším git push se změny automaticky promítnou na webu.
```

---

*Cursor Masterclass © 2026 Aibility · aibility.cz*