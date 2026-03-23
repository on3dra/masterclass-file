# Feedback Analyzer (CSV -> HTML)

Jednoduchy projekt pro Masterclass: vezme CSV se zpetnou vazbou a vygeneruje HTML report.

## Struktura

- `inputs/feedback.csv` - vstupni data
- `outputs/report.html` - vygenerovany report
- `scripts/generate-report.js` - generator reportu

## Jak spustit

Z rootu workspace:

```powershell
node "Projects/feedback-analyzer/scripts/generate-report.js"
```

Pak otevri:

- `Projects/feedback-analyzer/outputs/report.html`

## Poznamka k CSV

Script ocekava sloupce:

- `id`
- `date`
- `language`
- `rating` (1-5)
- `comment`
- `channel`

Pokud budou chybet, script se snazi fungovat i s casti sloupcu.
