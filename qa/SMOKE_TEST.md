# QA smoke test

Use this checklist before publishing a new version of the app.

## Automatic checks

Run:

```bash
npm run qa:smoke
```

Optional target:

```bash
TARGET_URL=https://nuno-saraiva.github.io/WarehouseNH/ npm run qa:smoke
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
- Reset: only test on a copied/test app, never on production data.
