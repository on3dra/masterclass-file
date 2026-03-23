---
name: brand-voice
description: "Define or extract a consistent brand voice that other skills can use. Two modes — Extract (analyze existing content you're proud of) or Build (strategically construct a voice from scratch). Use when starting a project, when copy sounds generic, or when output needs to sound like a specific person/brand. Triggers on: what's my voice, analyze my brand, help me define my voice, make this sound like me, voice guide, brand personality."
---

# Brand Voice Skill

Create a reusable voice profile that ensures all content sounds like YOU.

## Mode 1: Extract (recommended)

**Input**: 3-5 pieces of content the user is proud of (emails, posts, presentations, messages).

**Process**:
1. Analyze patterns across all samples:
   - **Tone**: formal vs casual, bold vs reserved, warm vs analytical
   - **Vocabulary**: recurring words, phrases they favor, words they avoid
   - **Rhythm**: sentence length patterns, use of fragments, paragraph structure
   - **Personality markers**: humor style, metaphor use, storytelling patterns
2. Identify what makes this voice distinctive vs generic
3. Generate voice profile document

## Mode 2: Build (interview)

**Process**:
1. Ask 5 targeted questions:
   - How would your best friend describe your communication style?
   - What writing do you admire? What do you hate?
   - If your brand was a person at a dinner party, how would they talk?
   - What words/phrases do you naturally use a lot?
   - What should your writing NEVER sound like?
2. Synthesize answers into voice profile

## Output format

Save to `Context/identity/tone-of-voice.md`:

```markdown
# Voice Profile

## Core Tone
[2-3 adjective description, e.g., "Direct, warm, slightly irreverent"]

## Communication Style
- Sentence structure: [short/long/mixed]
- Formality: [scale 1-5]
- Humor: [type and frequency]
- Jargon policy: [use/avoid/translate]

## Signature Patterns
- [3-5 specific patterns observed]

## Voice Don'ts
- [What to avoid — generic phrases, corporate speak, etc.]

## Example Rewrites
[Before/after examples showing the voice in action]
```
