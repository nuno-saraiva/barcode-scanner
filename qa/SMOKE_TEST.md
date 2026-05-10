# QA smoke test

Use this checklist before publishing a new version of the app.

Environment roles:

- `WarehouseNH` is the main/production app.
- `ArmazemNH` is the staging/test app.
- Run functional/destructive tests only in `ArmazemNH`.

## Automatic checks

Run:

```bash
npm run qa:staging
```

Production check, read-only/smoke only:

```bash
npm run qa:production
```

Custom target:

```bash
node qa/smoke-test.mjs --target=https://nuno-saraiva.github.io/ArmazemNH/
```

The script checks:

- page loads on desktop, tablet and mobile viewports;
- the app can enter through the user selector;
- language buttons are visible;
- tablet layout does not create page-level horizontal overflow;
- the warehouse visual map opens;
- main navigation areas are reachable.

## Manual checks

- Mobile: open menu, switch every section, close menu.
- Tablet: confirm there is no white space to the right of the app.
- Stock: open Warehouse map, click `Ver mapa`, close overlay.
- Orders: create an order draft, add product by search, remove line.
- Returns: create return draft, add by EAN, issue entry guide only on test data.
- Languages: switch PT, GB and ES and verify card titles and descriptions.
- Reset: only test in `ArmazemNH`, never in `WarehouseNH`.
