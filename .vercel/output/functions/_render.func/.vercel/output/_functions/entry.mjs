import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DvulLDto.mjs';
import { manifest } from './manifest_DOOaggP7.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/customers.astro.mjs');
const _page2 = () => import('./pages/invoice.astro.mjs');
const _page3 = () => import('./pages/providers.astro.mjs');
const _page4 = () => import('./pages/quote/quote-generator.astro.mjs');
const _page5 = () => import('./pages/quote.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');


const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/customers.astro", _page1],
    ["src/pages/invoice.astro", _page2],
    ["src/pages/providers.astro", _page3],
    ["src/pages/quote/quote-generator.astro", _page4],
    ["src/pages/quote.astro", _page5],
    ["src/pages/index.astro", _page6]
]);
const serverIslandMap = new Map();
const middleware = (_, next) => next();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware
});
const _args = {
    "middlewareSecret": "b87215a6-c7ae-44cd-824d-75807d15c396",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
