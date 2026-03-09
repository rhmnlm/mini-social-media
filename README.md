# a-poc

A minimal Instagram-like social feed built with React + TypeScript.

## What it does

- Browse an infinite-scroll photo feed
- View post details and comments in a modal overlay (URL-preserving)
- Upload photos with a caption
- Deterministic avatar generation per username (no backend dependency)

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## .env setup

No `.env` file is needed. The API key is entered at runtime via the login screen and stored in `sessionStorage`.

## Key technical decisions

| Decision | Rationale |
|---|---|
| Modal-as-overlay routing via `backgroundLocation` state | Keeps the URL correct while rendering the post detail as a modal on top of the feed — deep-linkable and back-button safe |
| `useInfiniteQuery` for feed | Cursor-based pagination with automatic cache merging; `staleTime: 2min` to reduce redundant fetches |
| Axios interceptor for API key injection | Single place to wire auth; avoids repeating headers across every API call |
| Deterministic SVG avatars from username hash | No avatar upload flow needed; consistent identity across sessions |
| MIME-type validation (not extension) on file input | Extension can be spoofed; `file.type` reflects the browser's actual sniffing |
| CSS design tokens (`--color-*`) in `:root` | Single source of truth for colours — accent, borders, text hierarchy, and links all tokenised |
| `callbackRef` pattern in `useEscKey` | Avoids re-registering the `keydown` listener on every render; dep array is `[enabled]` only |

## Design system

All colours are defined as CSS custom properties in `App.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#E63946` | Primary CTA buttons, progress bar, error icons |
| `--color-border` | `#efefef` | All dividers and card borders |
| `--color-text` | `#111` | Body text, logo |
| `--color-text-secondary` | `#555` | Empty state labels |
| `--color-text-muted` | `#888` | Timestamps, subtitles |
| `--color-text-faint` | `#aaa` | Char count, resting icons |
| `--color-hover-dark` | `#333` | Dark button hover |
| `--color-link` | `#0095f6` | Hashtags, @mentions |

## Known tradeoffs

- **No dedicated pages folder** — `PostDetailPage` and `FeedLayout` live under `components/` rather than a `pages/` directory. Acceptable for this scope.
- **Pinned demo post** — `SIM_POST_ID` in `FeedLayout` hardcodes a specific post to the top of the feed, guaranteeing it has comments for the detail-view demonstration. If that post is ever deleted from the server, it silently drops to a 404 and the pin is skipped. Treat it as demo scaffolding only.
- **Right panel reserved** — `aside.right-panel` is intentionally empty, reserved for future content (fun trivia, trending topics) once a suitable data source is available.
