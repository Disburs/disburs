# Brand kit

The Disburs logo and the banners for the X and LinkedIn accounts. All of it is
drawn by one script, so the files never drift from each other.

| Path | What it is |
|---|---|
| `generate.mjs` | Draws everything below |
| `banners/x-banner.png` | X header, 1500 x 500 |
| `banners/linkedin-cover.png` | LinkedIn company cover, 1128 x 191 (saved at double size) |
| `../public/logos/disburs.png` and `.svg` | The logo on mint. Use as the profile photo |
| `../public/logos/disburs-dark.*` | The logo on dark green |
| `../public/logos/disburs-light.*` | The logo on white, for documents and slides |
| `../public/logos/disburs-mark.svg` | The mark alone, no background |
| `preview-x.png` | How the X profile will look. A local check, not committed |

## Rebuild

```bash
node brand/generate.mjs
```

```
Writing:
  public/logos/disburs.png
  ...
  brand/banners/x-banner.png
  brand/banners/linkedin-cover.png
  brand/preview-x.png
Done.
```

It needs internet, to load the website fonts from Google Fonts.

To try another line on the banners:

```bash
node brand/generate.mjs --tagline "Payroll that lands in seconds."
```

To change it for good, edit the `COPY` block at the top of `generate.mjs`.

## The same mark in the website

The website draws the mark in code, in two places. Change them together with
the `mark` shapes in `generate.mjs`:

- `components/LogoMark.tsx`: menu bar, footer and every signed-in screen.
- `lib/logo-image.tsx`: favicon, phone icon and share card.
