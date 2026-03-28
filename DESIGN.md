# Design System Specification: Architectural Play

## 1. Overview & Creative North Star
**Creative North Star: "The Elevated Modular"**

This design system moves beyond the literal interpretation of "plastic blocks" and enters the realm of premium architectural modularity. We are not building a toy; we are building a structured, high-end digital environment that uses the "brick" as a metaphor for precision, reliability, and tactile joy. 

The system breaks the "template" look by leaning into **intentional asymmetry** and **exaggerated physical weight**. While most modern UIs strive for weightlessness, this system celebrates the "thud"—the feeling of a solid object being placed on a premium surface. We achieve a "High-End Editorial" feel by pairing rigid, thick-bordered containers with expansive, sophisticated white space and razor-sharp typography.

---

## 2. Colors
Our palette is a sophisticated nod to primary tones, balanced by a heavy, grounding neutral. 

- **Primary (#F4C542):** Used for "Hero" bricks and primary actions.
- **Secondary (#1E6F9F):** Used for deep-focus areas and navigational anchors.
- **Tertiary (#E63946):** Used for high-alert elements and "accent" studs in the layout.
- **Surface & Background (#FCF9F8 / #EAE4DA):** The "Floor" upon which our bricks sit.

### The "Solid-State" Rule
In this system, we prohibit gradients and blurs. This is a world of **solid-state color**. Depth is achieved through the interaction of hex codes, not opacity shifts. 

### Surface Hierarchy & Nesting
Instead of using 1px dividers, we use the **Surface Container Scale** to define depth.
- **Level 0 (Base):** `surface` (#FCF9F8) – The foundation.
- **Level 1 (The Brick):** `surface_container` (#F0EDEC) – A standard module.
- **Level 2 (The Nested Inset):** `surface_container_high` (#EBE7E7) – Used for "well" effects within a brick.

### The Border Mandate
Every functional "brick" must be contained by a solid `on_background` (#111111) border. 
- **Standard Border:** 2px.
- **Component/Hero Border:** 4px.
**Pro-tip:** Never use a 1px border. It looks accidental. A 2px or 4px border looks intentional.

---

## 3. Typography
We utilize a high-contrast pairing to balance playfulness with editorial authority.

- **Display & Headlines (Plus Jakarta Sans):** These are our "Statement" pieces. They should be set with tight letter-spacing (-0.02em) and Bold/ExtraBold weights. This font provides the "modern, slightly playful" energy required.
- **Body & Titles (Manrope):** A highly legible, geometric sans-serif that maintains the modular feel without sacrificing readability in long-form content.

**Editorial Hierarchy:**
- **Display LG (3.5rem):** Reserved for Hero sections. Should always be `on_background`.
- **Headline MD (1.75rem):** Used for the title of a major "Brick" section.
- **Label MD (0.75rem):** All-caps with increased letter-spacing (0.05em) for small metadata.

---

## 4. Elevation & Depth
In this system, depth is **physical**, not atmospheric. 

### The Stacked Principle
We avoid traditional "light source" drop shadows. Instead, we use **Hard Offset Shadows** or **Ambient Tonal Lifts**.
- **The "Brick Lift":** For floating elements, use a 4px offset shadow (x: 4px, y: 4px) with 0 blur, using the `on_surface` color at 100% opacity. This creates a 3D "extruded" effect.
- **Ambient Softness:** When a softer touch is needed, use the `on_surface` color at 8% opacity with a large 32px blur, but keep the 4px border—this ensures the "brick" never loses its structural integrity.

### Modular Spacing
Use the **Spacing Scale** religiously to maintain the grid. 
- All Bricks should have a minimum of `spacing.8` (2rem) between them.
- Internal padding within a Brick should be `spacing.6` (1.5rem).

---

## 5. Components

### Block Buttons
Buttons are the most tactile part of the system.
- **Primary:** `primary_container` (#F4C542) background, 4px black border, `display-sm` type.
- **Interaction:** On hover, use a `scale(1.05)` transform. On active (click), use a `scale(0.95)` transform. No color change—only physical movement.

### Block Cards
- **Styling:** `surface_container_lowest` (#FFFFFF) background with a 2px `on_background` border.
- **Corner Radius:** `rounded.md` (0.75rem).
- **Layout:** Use "Header Bricks"—a sub-section at the top of the card with a solid background color (Yellow, Blue, or Red) to categorize content.

### Chat Bubbles (The "Rounded Rect")
- Unlike standard bubbles, these use `rounded.lg` (1rem) on three corners and `rounded.none` on the origin corner to simulate a "locked-in" brick.
- Always use a 2px border.

### Input Fields
- **Minimalist approach:** No background color (`transparent`).
- **Border:** 2px `on_background` border that thickens to 4px on focus.
- **Placeholder:** `on_surface_variant` at 50% opacity.

### Navigation "Studs"
- Use `tertiary_container` (#E63946) for notification badges. They should be perfect circles (`rounded.full`) with a 2px black border, sitting half-on/half-off the edge of a brick.

---

## 6. Do's and Don'ts

### Do
- **Do** treat the screen like a physical grid. Every element should feel like it was "snapped" into place.
- **Do** use `spacing.20` (5rem) for section vertical spacing to let the "heavy" elements breathe.
- **Do** use intentional asymmetry—try a 4-column brick next to an 8-column brick rather than two 6-column bricks.

### Don't
- **Don't** use gradients. If you need depth, use a different color token.
- **Don't** use 1px lines. They disappear against the "thick" brand language.
- **Don't** use "Grey." Use `surface_dim` or `surface_container` variants to keep the palette warm and premium.
- **Don't** use standard easing. Use `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for "pop" animations that feel like a physical spring.