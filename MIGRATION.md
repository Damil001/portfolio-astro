# Migration

Source: Webflow export in `damil.webflow/`, published 26 Oct 2026, and the live page at https://damil.webflow.io/. Target: Astro, in this folder. The export is the source of layout and copy. Raster images that the zip left out are on the published CDN and will be pulled from there.

## Status

- **doing:** Design system — reading computed styles from the served export, then writing tokens, a `/style-guide` page, and `AGENTS.md`.
- **done:** Survey. Baseline comparison of the untouched Astro starter against the local export at 1200px: **65.21%**. Original page height 6563px, starter height 800px. The percentage is high for an empty page because both images were padded to the taller height on white, and much of the original page is light. The height gap is the real result. The loop runs. Decisions, taken from the recommendations after the question form was dismissed: rebuild the current homepage only; copy lives in a data file in the repo; booking buttons use the footer mailto; project links stay unlabeled as links until a URL exists.
- **notDone:** homepage, anything after the homepage, remainder write-up
- **needsYou:** nothing right now

## Templates

The live site is one page. The export also contains leftovers that are not linked from it.

### Homepage — in scope

`index.html`, also https://damil.webflow.io/. One template, one URL. No header. Sections, in order:

1. Hero — “Your marketing & engineering partner”, two buttons
2. Intro — two statements about Damil
3. Recent projects — Attentive, DataVisor, Shipwell, Findem, TSIA
4. Services — five cards. The development card is a logo marquee
5. How it works — four steps
6. Testimonials — Kerry Searle, Johannes Fraundorfer
7. FAQs — five items, accordion
8. Footer — mailto call to action, LinkedIn, GitHub, X

Shared region: the footer is part of this page, not a separate template. There is no site nav on the current design.

### Not the current site

| File | What it is |
| --- | --- |
| `old-home.html` | Previous portfolio. Navbar (Services, Project, Experience, FAQs), green type, empty CMS lists for projects and experience, an email field whose form is `method="get"` with no backend, LinkedIn and GitHub. |
| `detail_projects.html` | Empty CMS template. Body is scripts only. |
| `detail_experience.html` | Empty CMS template. Same. |
| `style-guide.html` | Relume client-first component library. Not linked from the homepage. |
| `401.html` | Webflow password page. Auth posts to `/.wf_auth`, which does not exist outside Webflow. |
| `animation-test.html` | Scratch page: “Damil Jamil” and the word React. Not linked. |

## Breakpoints

Read from `damil.webflow.css`. Webflow’s defaults, not a framework’s.

| Name | Query | Type that changes |
| --- | --- | --- |
| Large | `min-width: 1440px` | Almost nothing. One project-card border rule. |
| Desktop | 992px–1439px | Base styles. H1 4rem, H2 3rem. |
| Tablet | `max-width: 991px` | H1 2.75rem, H2 2.5rem. |
| Mobile landscape | `max-width: 767px` | H1 and H2 both 2.25rem. |
| Mobile | `max-width: 479px` | No further change to H1/H2. Older homepage classes shrink here; the current page mostly inherits 767. |

Comparison widths: 1440, 1200, 991, 767, 479. The page score is the worst of those.

Container: `.container-large` is `80rem` (1280px). Page gutters: `.padding-global` is 5% each side. Section padding on the current page is mostly `6rem` (`.padding-huge`), reduced in the tablet and mobile queries.

## Content

The current homepage is authored once in the HTML. Five projects, five services, four steps, two testimonials, five FAQs. “View project” and the hero buttons point at `#`. The footer button is `mailto:damiljamil63@gmail.com`.

The old homepage expected two Webflow CMS collections (projects, experience). The export contains the list markup and no items (`w-dyn-bind-empty`). The detail templates are empty. There is no CMS data in this folder and none on the live URL.

## Fonts

The current page uses two families, both on Google Fonts, both fine to self-host:

- Plus Jakarta Sans — headings (H1, H2, H4, H5), weight 700
- Space Grotesk — body, buttons, testimonials, weight 400

Also loaded and not used by the current page: Inter, Manrope.

Aeonik is declared (`AeonikTRIAL-Regular1.otf`) and used by a few unused classes (`heading-style-h3`, `.text-size-small`, the animation-test label). The font file is not in the export. Aeonik is a commercial face; the filename is a trial. It will not be self-hosted. The current page does not need it.

## Interactions

- FAQ accordion is a Webflow interaction (answers start at height 0).
- Footer “Book a 20-min call” splits the label into letters and shifts them on hover (GSAP + SplitType). Hero buttons do not.
- Development service card repeats a row of inline SVG logos. The track is laid out in flex; any motion comes from Webflow interactions, not a CSS keyframe in the export.
- Focus ring in the export: `0.125rem solid #4d65ff`.

## Cannot come across

- Webflow password page and `/.wf_auth`.
- Empty project and experience CMS records, and their empty detail templates. Nothing was published to copy.
- Aeonik trial file, missing from the zip.
- Raster files missing from the zip, present on the CDN, so these can come across: project shots `Frame 23 (8, 9, 11, 12, 13)` and Johannes’s portrait `Frame 2147225665.png`. Kerry’s portrait is a base64 JPEG inside an SVG, so it is already in the HTML.
- Hero and “View project” links that are `#`. There is no destination to preserve.
- The Relume style guide and the animation-test page, unless you want them.
- Webflow hosting, forms backend, and IX2 runtime. Behaviour gets rebuilt; the generated markup and stylesheet do not get copied.

## Scores

| Page | Width | Score | Heights (original / rebuild) |
| --- | --- | --- | --- |
| Untouched Astro starter vs export | 1200 | 65.21% | 6563 / 800 |

Measured with `scripts/compare.mjs` (Chrome, full page, pixelmatch threshold 0.1). This is a baseline, not a rebuilt page. Browser tools in the editor were unavailable, so the capture used local Chrome.
