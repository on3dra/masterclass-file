---
name: weekly-report
description: "Generate a weekly report from daily logs. Use when you want to summarize the week, create a status report, or review what was accomplished. Triggers on: weekly report, summarize this week, what did I do this week, weekly summary, status update."
---

# Weekly Report Generator

Create a structured weekly summary from daily logs or notes.

## Process

1. Search the `daily_logs/` folder for files from the last 7 days
2. Read each file and extract:
   - Key accomplishments
   - Decisions made
   - Blockers or issues encountered
   - Metrics or numbers mentioned
3. Organize into the report template below
4. Save to `reports/YYYY-WW.md`

## Output format

```markdown
# Weekly Report — [Week Number], [Year]
**Period**: [Monday date] – [Friday date]

## Highlights
- [Top 3 accomplishments this week]

## Completed
- [List of finished tasks/deliverables]

## In Progress
- [Tasks started but not finished]

## Blockers
- [Issues that need resolution]

## Key Metrics
- [Any relevant numbers]

## Next Week
- [Planned priorities]
```
