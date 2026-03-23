# Cursor Masterclass — Agenda

Exportováno: 23. 3. 2026

---

## 09:00–09:15 · Vítejte na Cursor Masterclass (15 min)

Vítejte! Dnes se naučíte pracovat s Cursorem — AI editorem, který mění způsob, jakým lidé tvoří software, weby a automatizace. Nemusíte být programátor. Stačí umět popsat, co chcete, a Cursor to udělá za vás.

Během dne projdeme vše od základů až po pokročilé techniky. Na konci budete mít vlastní projekt nasazený na internetu.

---

## 09:15–10:00 · Ukázky od týmu Aibility (45 min)

### Co se naučíte

Uvidíte reálné workflow z praxe týmu Aibility — jak Cursor používáme každý den pro marketing, obsah, data a automatizaci. Cílem je ukázat, co je možné, než se pustíte do vlastní práce.

---

## 10:00–10:35 · Základy Cursoru (35 min)

### Co se naučíte

Porozumíte čtyřem režimům Cursoru (Agent, Plan, Ask, Debug), kdy který použít, a naučíte se základní smyčku: prompt → výsledek → kontrola → iterace.

### Praktická reference

### Nastavení Cursoru

Než začnete cvičení, ověřte si, že máte vše správně nastavené. Pokud něco chybí, máte prompt, který vám pomůže to vyřešit.

### Cvičení — Vyčistěte nepořádná data

Cíl: Vzít nepořádná data, získat čistý výstup. Zvyknout si na smyčku prompt → výsledek → iterace.

Každý dostane stejné nepořádné CSV (200 řádků fiktivní zákaznické zpětné vazby — smíšené jazyky, nekonzistentní hodnocení, duplicitní záznamy, chybějící data).

---

## 10:35–10:45 · Přestávka (10 min)

Krátká přestávka na kávu. ☕

---

## 10:45–11:35 · Kontext, struktura a pravidla (50 min)

### Co se naučíte

Kontext je jako psací stůl — správné papíry = Cursor pracuje skvěle. Naučíte se strukturu PACT, vytáhnete si svůj existující kontext z ChatGPT/Claude, vytvoříte si vlastní identitu a pravidla pro Cursor.

### Praktická reference — struktura PACT

```
my-workspace/
├── .cursor/rules/
├── Projects/
│   └── masterclass-project/
│       ├── inputs/
│       └── outputs/
├── Agents/
├── Context/
│   ├── identity/
│   └── goals/
└── Tools/
```

### Cvičení — 5 kroků

---

## 11:35–12:35 · Skills, subagenti, příkazy a MCP (60 min)

### Co se naučíte

Naučíte se instalovat a vytvářet Skills, nastavovat subagenty pro specializované úkoly, psát vlastní příkazy a připojit Cursor k externím nástrojům přes MCP.

### Praktická reference — Skills

Skill = složka se souborem SKILL.md. Cursor ho načítá automaticky. Instalujte přes npx ze skills.sh:

### Praktická reference — Subagenti vs Skills

```
Je úkol složitý s více kroky?
├─ ANO → Potřebuje vlastní kontextové okno?
│   ├─ ANO → SUBAGENT
│   └─ NE  → SKILL
└─ NE  → SKILL
```

### Praktická reference — MCP

Pluginy z Cursor Marketplace bundlují skills + MCP servery + pravidla. Nebo nastavte ručně přes .cursor/mcp.json.

### Cvičení — Vyberte si alespoň 2

Cíl: Odejít s alespoň jedním novým skillem a jednou novou schopností (subagent, příkaz nebo MCP) přidanou do vašeho workspace.

### Prompty

Ke stažení: brand-voice content-atomizer linkedin-writer researcher

---

## 12:35–13:15 · Oběd (40 min)

Dobrou chuť! 🍽️

---

## 13:15–13:45 · Jak dostat projekt na internet (30 min)

### Co se naučíte

Nasadíte svůj projekt z lokálního počítače na internet. Od git init po živou URL za pár minut.

### Prompt — nechte Cursor, ať vás provede

Zkopírujte do Cursor chatu (Agent mode). Doplňte popis svého projektu a Cursor vás provede celým procesem.

### Cvičení — Deploy krok za krokem

---

## 13:45–14:00 · Přestávka (15 min)

Krátká přestávka před volným stavěním. ☕

---

## 14:00–16:10 · Volné stavění (130 min)

### Co se naučíte

Postavíte vlastní projekt od nuly — nebo rozšíříte to, co jste vytvořili dopoledne. Tým Aibility obchází a pomáhá.

### Nevíte, co stavět?

### Inspirace z reálných workflow Aibility

Toto jsou věci, které náš tým skutečně postavil — ne demo aplikace, ne hypotetické příklady.

---

## 16:10–16:40 · Sdílení výsledků (30 min)

### Co se naučíte

Dobrovolníci sdílejí, co postavili. 3–5 minut každý — sdílení obrazovky, procházení projektu, povídání o překvapeních a výzvách.

Svůj projekt můžete sdílet i na Sdílení zkušeností — ostatní si ho budou moci prohlédnout.

---

## 16:40–17:00 · Zakončení a další kroky (20 min)

### Rekapitulace: 4 vrstvy

- Základy Cursoru — mluvte se soubory, ne s chatboty
- Kontext a struktura — pravidla a nastavení jsou vaše páka
- Skills + Subagenti + Příkazy + MCP — specializované znalosti, orchestrace, externí připojení
- Nasaďte to — od lokálního po živé za minuty

### Mentální model

> ChatGPT = volání experta po telefonu
>             Cursor = mít experta sedícího vedle vás
>             Cursor + Skills + Subagenti + MCP = mít celý tým specialistů

### Oslavte úspěch

Dnes jste se naučili pracovat s Cursorem jako profíci. Stáhněte si certifikát, sdílejte ho na LinkedIn a ukažte ostatním, co umíte.

### Zdroje a další kroky

- Certifikát — stáhněte si a sdílejte na LinkedIn
- Knihovna promptů — všechny prompty z dnešního dne
- Cursor Manuál — kompletní průvodce
- Ke stažení — skills, agenti, pravidla, příkazy
- 70+ scénářů — co zkusit dál
- skills.sh · Cursor Marketplace · cursor.directory

---
