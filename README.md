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

## Known tradeoffs

- **No dedicated pages folder** — `PostDetailPage` and `FeedLayout` live under `components/` rather than a `pages/` directory. Acceptable for this scope.
