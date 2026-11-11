---
name: premium-color-design
description: Create cohesive, premium website color systems inspired by rich jewel tones paired with warm milky neutrals. Use when designing, redesigning, or reviewing a website/app UI, selecting a palette, defining design tokens, or implementing colors in CSS/Tailwind.
---

# Premium Website Color Design Skill

## Purpose
Create distinctive, polished, usable website color systems using rich, confident accent colors paired with soft warm neutrals. Favor intentional contrast, generous neutral space, and consistent semantic color roles over decorating every component.

## User's color taste
The preferred visual direction is **rich color + warm, soft neutral**:
- Royal blue + light cream
- Wine red + light sandal
- Orange + milk
- Cherry + alabaster
- Midnight indigo + vanilla
- Forest green + leaf
- Plum + milk

Treat these as palette families, not instructions to use all colors on the same page. Pick one primary palette per project, then optionally add one restrained supporting accent.

## Palette library
The HEX values below are proposed starting points. Confirm them in context and run contrast checks before production.

### 1. Royal Blue & Cream — confident, clean, premium
- Primary: `#2457C5`
- Primary hover: `#1B439C`
- Deep ink: `#14284B`
- Background: `#FFF8E9`
- Surface: `#FFFDF7`
- Border: `#E7DFC9`
- Muted text: `#625F58`
- Accent: `#D9A441`

### 2. Wine & Sandal — editorial, luxurious, warm
- Primary: `#76283B`
- Primary hover: `#5B1D2D`
- Deep ink: `#321922`
- Background: `#F4E7D7`
- Surface: `#FFF9F2`
- Border: `#E1CDBB`
- Muted text: `#665751`
- Accent: `#B78A63`

### 3. Orange & Milk — energetic, friendly, food/creator brands
- Primary: `#C94F16`
- Primary hover: `#A83D10`
- Deep ink: `#352219`
- Background: `#FFF7EC`
- Surface: `#FFFFFF`
- Border: `#EADBCB`
- Muted text: `#6C5B50`
- Accent: `#E6A23C`

### 4. Cherry & Alabaster — bold, expressive, contemporary
- Primary: `#B92343`
- Primary hover: `#8F1933`
- Deep ink: `#351820`
- Background: `#F8F3EE`
- Surface: `#FFFCF8`
- Border: `#E8D9D8`
- Muted text: `#66545A`
- Accent: `#E8A2A8`

### 5. Midnight Indigo & Vanilla — cinematic, technical, sophisticated
- Primary: `#30356F`
- Primary hover: `#222650`
- Deep ink: `#171A35`
- Background: `#FBF5E6`
- Surface: `#FFFCF4`
- Border: `#E4DDC9`
- Muted text: `#5E5E70`
- Accent: `#9B9FE3`

### 6. Forest & Leaf — natural, grounded, wellness-oriented
- Primary: `#245B45`
- Primary hover: `#194432`
- Deep ink: `#172C24`
- Background: `#F2F5E9`
- Surface: `#FCFDF8`
- Border: `#D8E1D1`
- Muted text: `#566258`
- Accent: `#91AC70`

### 7. Plum & Milk — creative, boutique, refined
- Primary: `#673B70`
- Primary hover: `#4E2B56`
- Deep ink: `#2B1B30`
- Background: `#FBF6F1`
- Surface: `#FFFFFF`
- Border: `#E5D9E5`
- Muted text: `#625765`
- Accent: `#C3A0C9`

### 8. Teal & Oat Milk — calm, modern, trustworthy
- Primary: `#176B68`
- Primary hover: `#10524F`
- Deep ink: `#173634`
- Background: `#F6F3E9`
- Surface: `#FFFEFA`
- Border: `#D9E2DA`
- Muted text: `#53615D`
- Accent: `#D2A86A`

### 9. Cobalt & Porcelain — crisp, modern, product-led
- Primary: `#2448A8`
- Primary hover: `#1A347C`
- Deep ink: `#17213C`
- Background: `#F5F7FC`
- Surface: `#FFFFFF`
- Border: `#DDE3F0`
- Muted text: `#586174`
- Accent: `#77A6E8`

### 10. Terracotta & Linen — handcrafted, warm, approachable
- Primary: `#A84E3A`
- Primary hover: `#833A2B`
- Deep ink: `#38231E`
- Background: `#F7EFE5`
- Surface: `#FFFAF4`
- Border: `#E7D6C6`
- Muted text: `#68564D`
- Accent: `#C89B72`

## Palette selection rules
1. Understand the website's purpose, audience, brand personality, content density, and existing logo/assets before choosing colors.
2. Select **one main palette**. Add a secondary palette only if it serves a real purpose.
3. For technical products, dashboards, engineering portfolios, and SaaS: start with Royal Blue & Cream, Midnight Indigo & Vanilla, or Cobalt & Porcelain.
4. For food, fitness, wellness, and hospitality: start with Orange & Milk, Forest & Leaf, or Terracotta & Linen.
5. For premium/editorial/creative brands: start with Wine & Sandal, Cherry & Alabaster, or Plum & Milk.
6. Use warm neutrals for most page surfaces; rich colors should establish hierarchy rather than fill every section.
7. Do not infer that a color is accessible based on its name. Validate the actual foreground/background pair.

## UI color roles
Define semantic tokens before implementing components:
- `--color-primary`: main brand/action color
- `--color-primary-hover`: hover/pressed state
- `--color-on-primary`: text/icons on primary surfaces
- `--color-background`: overall page background
- `--color-surface`: cards, menus, modals, inputs
- `--color-surface-muted`: subtle secondary panels
- `--color-text`: main text
- `--color-text-muted`: supporting text, after contrast validation
- `--color-border`: dividers and component outlines
- `--color-accent`: limited highlight color
- `--color-success`, `--color-warning`, `--color-danger`, `--color-info`: semantic status colors, separately tested

Do not use the primary color for every heading, icon, border, and card. Use hierarchy, typography, spacing, and surface changes as well as color.

## Suggested distribution
Use this as a starting point, not a strict rule:
- 65–75% warm neutral backgrounds and surfaces
- 15–25% text, dark structure, and secondary surfaces
- 5–10% primary/accent color combined

Keep large, saturated blocks intentional. Avoid rainbow gradients, excessive glow, and unrelated accent colors unless the brand specifically calls for them.

## Accessibility and quality gates
- Meet WCAG AA contrast targets: at least **4.5:1 for normal text** and **3:1 for large text**. Check meaningful UI boundaries and graphics separately.
- Check each real pairing: body text/background, muted text/background, button label/button fill, link/background, input border/surface, focus ring/surface, badges, charts, and disabled states.
- Do not use color as the only indicator of status or meaning; pair it with labels, icons, patterns, or shape.
- Never assume white text works on every saturated accent. Test it. If it fails, darken the fill or use a different text color.
- Avoid low-contrast placeholder text and thin text on tinted surfaces.
- Review both light and dark mode separately; do not automatically invert colors.
- Check the palette in mobile layouts, outdoor brightness, grayscale, and common color-vision simulations.
- Contrast must be measured in the rendered implementation, not guessed from HEX values.

## Implementation guidance
Use design tokens instead of hardcoding colors across components. Adapt the syntax to the project's existing stack; do not introduce a new framework solely for color styling.

### CSS custom properties example
```css
:root {
  --color-primary: #2457C5;
  --color-primary-hover: #1B439C;
  --color-on-primary: #FFFFFF;
  --color-background: #FFF8E9;
  --color-surface: #FFFDF7;
  --color-surface-muted: #F3ECD9;
  --color-text: #182238;
  --color-text-muted: #625F58;
  --color-border: #E7DFC9;
  --color-accent: #D9A441;
}
```

### Tailwind guidance
- If the project already uses Tailwind, map the semantic tokens into its theme/config or use CSS variables such as `bg-[var(--color-background)]`.
- Prefer semantic classes/tokens such as `bg-background`, `text-foreground`, `border-border`, and `bg-primary` where the project's design system supports them.
- Do not mix arbitrary HEX values throughout JSX/TSX.
- Preserve existing component APIs and project conventions.

## Design behavior
- Use primary colors for primary actions, selected navigation, key links, and limited emphasis.
- Use deep ink colors for long-form text rather than saturated brand colors.
- Use cream/milk/vanilla/alabaster shades for page and card surfaces.
- Use accents sparingly for small highlights, illustrations, chart emphasis, or decorative details.
- Use clear hover, focus, active, selected, error, success, and disabled states.
- Keep motion and gradients subordinate to readability and content hierarchy.

## Required workflow
1. Inspect the existing project, framework, theme tokens, logo, and components before editing.
2. Ask for the site's purpose only if it cannot be inferred from the project/context.
3. Recommend 2–3 palette candidates with short rationale when the choice is open; otherwise use the user's specified palette.
4. Define semantic tokens and approved foreground/background pairings.
5. Apply the palette consistently across navigation, hero, cards, forms, buttons, tables, charts, footer, and responsive states.
6. Run contrast checks on actual pairings and fix failures.
7. Review screenshots at desktop and mobile sizes, plus hover/focus/error/success states.
8. Report which palette was chosen, where it was applied, any contrast exceptions, and any remaining checks.

## Do not
- Use all palette families on one page without a clear information-architecture reason.
- Choose colors based on trend alone.
- use pale text on pale backgrounds or saturated text on similarly saturated backgrounds.
- hardcode color values repeatedly when tokens are available.
- remove existing brand colors or redesign the entire UI without permission.
- claim WCAG compliance without testing the implemented color pairs.

## Definition of done
- One coherent palette is selected and documented.
- Semantic tokens are implemented and reused.
- Text, actions, borders, focus states, and status colors have been reviewed.
- Contrast has been tested on actual component pairings.
- Responsive layouts remain readable and visually consistent.
- No unrelated UI or functionality has been changed.


## Expanded palette library: 20 additional directions
These are proposed screen HEX values. Treat them as starting points; test actual UI contrast and pairings before production.

### 11. Sapphire & Champagne
- Primary: `#1746A2`
- Deep: `#102A56`
- Background: `#FFF7E7`
- Surface: `#FFFCF5`
- Accent: `#D8B56D`
- Mood: polished, premium, confident

### 12. Emerald & Pearl
- Primary: `#087F5B`
- Deep: `#064E3B`
- Background: `#F5F8F1`
- Surface: `#FFFFFF`
- Accent: `#B8D8C0`
- Mood: fresh, premium, sustainable

### 13. Amethyst & Rosewater
- Primary: `#6D35A5`
- Deep: `#351B55`
- Background: `#FFF5F8`
- Surface: `#FFFFFF`
- Accent: `#E9AFC4`
- Mood: expressive, creative, elegant

### 14. Ruby & Blush
- Primary: `#B5163A`
- Deep: `#620D27`
- Background: `#FFF3F1`
- Surface: `#FFFCFA`
- Accent: `#F0A5AF`
- Mood: confident, warm, fashion-forward

### 15. Sapphire & Ice Blue
- Primary: `#175CD3`
- Deep: `#142C58`
- Background: `#F0F7FF`
- Surface: `#FFFFFF`
- Accent: `#75D5F0`
- Mood: crisp, digital, technology-focused

### 16. Peacock & Peach
- Primary: `#006D77`
- Deep: `#173D43`
- Background: `#FFF1E8`
- Surface: `#FFFCF8`
- Accent: `#F4A987`
- Mood: playful, modern, distinctive

### 17. Cobalt & Tangerine
- Primary: `#2447D8`
- Deep: `#17265E`
- Background: `#FFF8EF`
- Surface: `#FFFFFF`
- Accent: `#F47721`
- Mood: energetic, bold, startup-friendly

### 18. Indigo & Electric Lime
- Primary: `#282A75`
- Deep: `#17183D`
- Background: `#F7F7EE`
- Surface: `#FFFFFF`
- Accent: `#C7F464`
- Mood: futuristic, experimental, high-impact

### 19. Charcoal & Electric Violet
- Primary: `#7C3AED`
- Deep: `#181622`
- Background: `#F7F5FC`
- Surface: `#FFFFFF`
- Accent: `#B9A0FF`
- Mood: AI, developer tools, creative software

### 20. Midnight & Neon Cyan
- Primary: `#22D3EE`
- Deep: `#101827`
- Background: `#F4F8FC`
- Surface: `#FFFFFF`
- Accent: `#6577FF`
- Mood: futuristic, technical, high contrast
- Note: use the cyan as a highlight, not automatically as small text on white

### 21. Graphite & Hot Pink
- Primary: `#E72D78`
- Deep: `#24202A`
- Background: `#FFF5F8`
- Surface: `#FFFFFF`
- Accent: `#F7A8CE`
- Mood: expressive, youthful, bold

### 22. Violet & Butter Yellow
- Primary: `#6842C2`
- Deep: `#30204F`
- Background: `#FFF9DF`
- Surface: `#FFFEF5`
- Accent: `#F1CC4E`
- Mood: optimistic, creative, memorable

### 23. Coral & Aqua
- Primary: `#E65D52`
- Deep: `#633238`
- Background: `#F0FBF9`
- Surface: `#FFFFFF`
- Accent: `#38BFC1`
- Mood: lively, friendly, fresh

### 24. Lavender & Sage
- Primary: `#7764A8`
- Deep: `#38354D`
- Background: `#F8F5FB`
- Surface: `#FFFFFF`
- Accent: `#A9BE9B`
- Mood: calm, thoughtful, wellness-oriented

### 25. Dusty Rose & Cocoa
- Primary: `#A85D70`
- Deep: `#493039`
- Background: `#F8EFEA`
- Surface: `#FFFAF6`
- Accent: `#D9A9A0`
- Mood: warm, editorial, boutique

### 26. Olive & Marigold
- Primary: `#626B2F`
- Deep: `#343A20`
- Background: `#FAF4E5`
- Surface: `#FFFCF4`
- Accent: `#E7AD28`
- Mood: earthy, confident, distinctive

### 27. Chocolate & Sky
- Primary: `#68432F`
- Deep: `#30231D`
- Background: `#F8F1E8`
- Surface: `#FFFCF8`
- Accent: `#6BB9E8`
- Mood: grounded with a surprising fresh accent

### 28. Terracotta & Teal
- Primary: `#B6543B`
- Deep: `#3D302B`
- Background: `#F7EFE5`
- Surface: `#FFFBF6`
- Accent: `#258A83`
- Mood: artistic, warm, balanced

### 29. Burgundy & Powder Blue
- Primary: `#74263B`
- Deep: `#381B2A`
- Background: `#F1F6FB`
- Surface: `#FFFFFF`
- Accent: `#8EB8DF`
- Mood: sophisticated with a cool contrast

### 30. Pine & Copper
- Primary: `#1E5946`
- Deep: `#17372D`
- Background: `#F7F2E8`
- Surface: `#FFFCF7`
- Accent: `#C7794A`
- Mood: crafted, rich, natural

## Color exploration modes
When the user asks for "more color", do not merely generate more near-identical palettes. Offer varied families:
- **Jewel tones:** sapphire, emerald, ruby, amethyst, peacock, garnet.
- **Warm and earthy:** terracotta, copper, marigold, olive, cocoa, clay.
- **Pastels:** lavender, powder blue, blush, mint, peach, butter yellow.
- **High-energy:** cobalt with tangerine, violet with lime, coral with aqua.
- **Futuristic:** midnight, electric cyan, ultraviolet, acid lime, graphite.
- **Nature-inspired:** pine, fern, moss, ocean teal, sky, sand.
- **Dark premium:** ink, plum, burgundy, forest, copper, champagne.
- **Bright editorial:** cherry, coral, saffron, ultramarine, pale pink.

## Multi-color website rule
A user may want a website to feel colorful, not merely own a long palette list. Build a controlled multi-color system:
1. Choose one stable neutral or dark foundation.
2. Choose one primary brand color.
3. Add 2–3 supporting accents for distinct content categories, illustrations, charts, or feature cards.
4. Assign each accent a repeatable purpose; don't distribute random colors across every component.
5. Keep text and interactive controls accessible and consistent.
6. If using gradients, use them in selected hero art, backgrounds, or decorative areas, not behind every paragraph and control.
7. For dashboards, use distinct series colors and labels; do not rely on color alone to explain the data.
8. Preserve a clear primary call to action even when the overall interface is colorful.

## Optional expressive gradient recipes
Use these only when they support the brand and remain legible:
- Sapphire → violet: `linear-gradient(135deg, #2457C5, #7C3AED)`
- Cherry → coral: `linear-gradient(135deg, #B92343, #F47767)`
- Teal → cyan: `linear-gradient(135deg, #176B68, #22D3EE)`
- Indigo → electric violet: `linear-gradient(135deg, #30356F, #8B5CF6)`
- Tangerine → marigold: `linear-gradient(135deg, #C94F16, #F1CC4E)`
- Forest → mint: `linear-gradient(135deg, #245B45, #8CCFB0)`
- Plum → rose: `linear-gradient(135deg, #673B70, #D77FA5)`

Do not put white text on a gradient without checking contrast at every relevant point along the gradient. Use a solid overlay or darken the gradient if necessary.
