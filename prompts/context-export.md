# Context Export Prompt

Tento prompt vložte do ChatGPT, Claude nebo jiného AI asistenta, se kterým už komunikujete. Exportuje vaše uložené vzpomínky a preference do strukturovaného souboru, který pak můžete vložit do `Context/identity/` ve vašem PACT workspace.

---

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
