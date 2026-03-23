---
name: content-calendar
description: "Vytvoří týdenní obsahový kalendář + konkrétní návrhy postů (LinkedIn/X/email) v daném brand voice a s ohledem na obor."
---

# Content Calendar Skill

Vytvoř týdenní obsahový kalendář z `brand voice + obor` tak, aby měl každý den:
- jasný post/asset (ne obecné rady)
- konkrétní hook (1-2 věty)
- 3–5 bodů pro hlavní sdělení
- CTA (další krok)
- návrh formátu a případně typ obrázku/screen

## Input (zdroje)
1. Primárně načti:
   - `Context/identity/tone-of-voice.md` (tón a styl)
2. Podle potřeby použij:
   - `Projects/content-calendar/inputs/brief.md` (cíle, publikum, platformy)
   - `Projects/content-calendar/inputs/topics.md` (seznam témat)

## Process
1. Přečti `tone-of-voice.md` a shrň si styl do 3–5 klíčových pravidel.
2. Přečti `brief.md` a `topics.md` (pokud existují) a vyplň chybějící informace z kontextu.
3. Vygeneruj **týdenní plán** (po–nebo po 7 dní) pro platformy uvedené v briefu.
4. Každý návrh postu piš přímo tak, aby se dal zkopírovat (bez “záleží” a “můžeš…”).
5. Ulož výstup do:
   - `Projects/content-calendar/outputs/calendar.md`

## Output format (calendar.md)
---
# Content calendar — [Week, date range]
## Cíl a audience
...
## Témata tento týden (top 5)
...
---

## Kalendář (Mon–Sun)
- **Mon (LinkedIn)**: ...
- **Tue (X)**: ...
- ...

## Připravené návrhy (copy-ready)
### Day: Mon
- Hook:
- Body (bullets):
- CTA:
- Hashtags:
- Asset idea:

(opakuj pro každý den včetně všech platforem v briefu)

## Follow-ups / repurpose
- Co atomizovat do Stories/shortu/email follow-up v průběhu týdne.

## Tvrdé pravidlo
Používej češtinu a tykání. Jazyk a strukturu drž přes `tone-of-voice.md`.

