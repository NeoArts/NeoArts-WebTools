import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BzIrKru-.mjs';
import { manifest } from './manifest_CZlJoRjC.mjs';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/customers.astro.mjs');
const _page2 = () => import('./pages/invoice.astro.mjs');
const _page3 = () => import('./pages/quote.astro.mjs');
const _page4 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/customers.astro", _page1],
    ["src/pages/invoice.astro", _page2],
    ["src/pages/quote.astro", _page3],
    ["src/pages/index.astro", _page4]
]);
const serverIslandMap = new Map();

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "c35b6030-df24-4b3d-9dd8-cb0bb8c2dc48",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
