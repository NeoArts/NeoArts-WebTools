import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DvulLDto.mjs';
import { manifest } from './manifest_O0THKNfL.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/customers.astro.mjs');
const _page2 = () => import('./pages/invoice.astro.mjs');
const _page3 = () => import('./pages/providers.astro.mjs');
const _page4 = () => import('./pages/quote.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');


const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/customers.astro", _page1],
    ["src/pages/invoice.astro", _page2],
    ["src/pages/providers.astro", _page3],
    ["src/pages/quote.astro", _page4],
    ["src/pages/index.astro", _page5]
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
    "middlewareSecret": "52e7cb03-8111-4df3-a090-bbb9ea040d5c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
