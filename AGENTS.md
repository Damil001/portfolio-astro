# Agent notes

## Visual language

Measured from the served Webflow homepage (`damil.webflow/index.html`) with `getComputedStyle`. Tokens live in `src/styles/tokens.css`. Use the custom properties, not raw hex, in new UI.

### Colours

- `--color-ink` (`#1b0a2f`) — headings
- `--color-text` (`#000000`) — body, FAQ, secondary button label
- `--color-text-on-dark` (`#f0f0f0`) — primary button label
- `--color-page` (`#ffffff`) — page background
- `--color-reset` (`#333333`) — colour of unset body text from the Webflow reset. Designed copy sets its own colour.
- `--color-focus` (`#4d65ff`) — `:focus-visible` ring, 0.125rem, offset 0.125rem
- `--color-orange` (`#ff5e00`) — declared on the export `:root`. The current page does not paint it.
- `--color-green` (`#15674c`) — old homepage only
- Primary button fill is `--gradient-button` (`#292929` to `#3d3d3d`). Border `#525252` on the top and sides, no bottom border.
- Secondary button fill is `--gradient-button-secondary` (`#e5e5e5` to `#fafafa`). Border `#fafafa`, same shape.
- `--color-glass` and `--color-glass-border` — testimonial inner panel and the “how it works” panel
- `--color-progress` (`#1391b0`) and `--color-progress-soft` (`#1391b033`) — the step line and the numbered circles
- `--color-company` (`#0000008f`) — testimonial company line
- Hero and footer fade to the page colour over the bottom or top 15% (`--gradient-hero-fade`, `--gradient-footer-fade`)

### Type

Display is Plus Jakarta Sans, weight 700. UI and body copy are Space Grotesk, weight 400. Both are self-hosted. The export also loads Inter, Manrope, and a missing Aeonik trial; the current page does not use them.

Desktop (992px and up):

- H1 4rem / 1.1 / tracking -2px
- H2 3rem / 1.1 / tracking -2px
- H4 1.5rem / 1.3 / tracking -1.5px
- H5 1.125rem / 1.1
- Body 1rem / 1.2
- Large (quotes) 1.25rem / 1.2 / tracking -1.5px
- FAQ 1.125rem / 700, Plus Jakarta Sans
- Button 1rem / 1 / tracking 0.3px, Space Grotesk

Below 992px: H1 2.75rem, H2 2.5rem, H4 1.75rem. H4 is larger on tablet than on desktop. Keep that.

Below 768px: H1 and H2 2.25rem, H4 1.5rem with line-height 1.4, H5 1.25rem, large text 1.125rem.

### Spacing

One rem scale, root 16px: 0.5, 1, 1.25, 2, 3, 4, 5, 6. Section padding is `--space-section`: 6rem, then 5rem below 992px, then 3.5rem below 768px. `--space-md` drops from 2rem to 1.25rem below 768px.

Gutter is 5% (`--gutter`). Column max is 80rem (`--container`). Hero content max is 53.75rem. Hero subcopy max is 26.25rem. Footer subcopy max is 28.125rem.

Project grid gap 1.25rem. Service grid gap 2rem. Hero stack gap 3rem, hero header gap 2rem, button gap 1.5rem.

### Radii, borders, shadows

- `--radius-card` 0.25rem — project cards
- `--radius-control` 0.5rem — buttons, testimonial inner, timeline panel
- `--radius-panel` 1.25rem — testimonial card

No box-shadows on the homepage. The Relume style guide in the export defines a shadow scale the current page does not use. Do not add shadows to match that library.

### Motion

The footer button splits its label and shifts letters up on hover: 0.5s, ease `power4.inOut`, stagger 0.03s. Mouse leave is 0.4s, same ease, stagger from a random character. Hero buttons do not do this.

FAQ answers start collapsed. The open and close timing is owned by Webflow’s interaction runtime and is not in the stylesheet, so there is no duration token for it.

### What is absent

No dark theme. No site header on the current homepage. Gradients are limited to the two buttons and the hero/footer fades. Orange and the old green are in the token set because they exist in the export, and they are not the current page’s palette.
