# jadewowgreen (Madrid portfolio)

**SP26 subtree:** this folder lives inside the **[SP26 repo](../README.md)** at `jadewowgreen/`. **Edit and commit here**; the **jadewowgreen** GitHub repo and Pages deploy from that mirror, not from the SP26 root alone.

**Live site:** [jadewowgreen.github.io/jadewowgreen/](https://jadewowgreen.github.io/jadewowgreen/)

## What this is

First-generation informatics student portfolio: **Madrid on Film**, Spring 2026 in Spain (Madrid, Segovia, Toledo, Tenerife). Episode-based narrative, personal photos only, a **sounds like** line per episode (links open Spotify search for that track), tropical island art direction inspired by Weezer's "Island in the Sun", light vanilla JS.

## Repository layout

| Path | Role |
|------|------|
| [`index.html`](index.html) | Root entry for GitHub Pages |
| [`site/index.html`](site/index.html) | Main portfolio page (edit here) |
| [`site/styles.css`](site/styles.css) | Layout and design system |
| [`site/script.js`](site/script.js) | Cursor and reveal effects |
| [`images/`](images/) | Photo assets (referenced from `site/` as `../images/`) |
| [`docs/`](docs/) | Copy of `site/`, `images/`, and root `index.html` for Pages **only if** the GitHub repo publishes from the **`/docs`** folder |

### GitHub Pages: root vs docs

If **Settings → Pages → Build and deployment** uses **Folder: `/docs`**, GitHub serves **`docs/site/index.html`** at `…/jadewowgreen/site/`, **not** the root `site/` folder. That is why new episodes can disappear: **`docs/` was out of date.**

**Option A (simplest):** Set Pages to publish from **`/` (root)**. Then only `site/` and `images/` at the repo root matter; you can delete `docs/` on the mirror or leave it unused.

**Option B:** Keep publishing from **`/docs`**. After any change to `site/` or `images/`, run from `jadewowgreen/`:

```bash
./sync-docs-for-pages.sh
```

Then commit the updated `docs/` and push the **jadewowgreen** GitHub repo so Pages rebuilds.

Canonical source of truth stays **`site/`** and **`images/`**; `docs/` is a deploy mirror when the Pages source is `/docs`.

## Local preview

1. Open the repo (or this subtree) in your editor.
2. Serve from repo root (`index.html` redirects to `site/`) or open `site/index.html` (e.g. Live Server, or `python3 -m http.server` from `site/`).

## Connect

- Instagram: [@j.adezhao](https://instagram.com/j.adezhao)
- GitHub: [@jadewowgreen](https://github.com/jadewowgreen)

## Related in SP26

- Informatics portfolio: [`../matchaxmoxie/README.md`](../matchaxmoxie/README.md)
- IU lab (SP26): [`../j-adezhao/WORKSPACE.md`](../j-adezhao/WORKSPACE.md) · profile copy [`../j-adezhao/README.md`](../j-adezhao/README.md)

## Local preview

1. Open the repo in your editor.
2. Serve from repo root (`index.html`) or open `index.html` (e.g. Live Server, or `python3 -m http.server`).

## Connect

- Instagram: [@j.adezhao](https://instagram.com/j.adezhao)
- GitHub: [@jadewowgreen](https://github.com/jadewowgreen)

## Related in SP26

- Informatics portfolio: [`../matchaxmoxie/README.md`](../matchaxmoxie/README.md)
- IU lab (SP26): [`../j-adezhao/WORKSPACE.md`](../j-adezhao/WORKSPACE.md) · profile copy [`../j-adezhao/README.md`](../j-adezhao/README.md)
