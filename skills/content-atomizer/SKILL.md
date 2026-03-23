---
name: content-atomizer
description: "Transform one piece of content into platform-optimized assets across LinkedIn, Twitter/X, Instagram, TikTok, and YouTube. Use when someone has existing content (blog post, newsletter, podcast, video) and wants to maximize distribution. Triggers on: repurpose this, turn this into social posts, atomize this content, create social content from, LinkedIn post from this, thread from this."
---

# Content Atomizer

Take one piece of content and transform it into platform-native posts.

## Input
- One source piece (blog post, newsletter, podcast transcript, video script, or any long-form content)
- Target platforms (default: all)

## Process

1. **Extract core ideas**: Read the source. Identify the 3-5 strongest standalone ideas, stories, or data points.

2. **For each platform, apply its native format**:

   **LinkedIn** (1300 chars max for preview):
   - Hook line (pattern interrupt or bold claim)
   - Story or insight (personal angle preferred)
   - Actionable takeaway
   - Soft CTA or question

   **Twitter/X** (thread or single):
   - Lead tweet = strongest standalone insight
   - Thread: 3-7 tweets, each self-contained
   - Use line breaks for readability

   **Instagram** (carousel or single):
   - Slide 1: Hook headline
   - Slides 2-8: One idea per slide, large text
   - Final slide: CTA
   - Caption: storytelling version

   **TikTok/Reels** (script):
   - Hook in first 2 seconds
   - One clear idea per video
   - 30-60 seconds optimal

3. **Adapt voice**: Match the author's tone from the source content. Don't make it sound generic.

4. **Output**: Save each platform's content as a separate section in the output file.

## Output format
```markdown
# Atomized Content from: [Source Title]

## LinkedIn Post
[content]

## Twitter/X Thread
[content]

## Instagram Carousel
[content]

## TikTok Script
[content]
```
