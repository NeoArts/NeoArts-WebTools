import 'cookie';
import 'kleur/colors';
import './chunks/astro-designed-error-pages_DPPyoTvL.mjs';
import { g as decodeKey } from './chunks/astro/server_CJOAcbgq.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"customers/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/customers","isIndex":false,"type":"page","pattern":"^\\/customers\\/?$","segments":[[{"content":"customers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/customers.astro","pathname":"/customers","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"invoice/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/invoice","isIndex":false,"type":"page","pattern":"^\\/invoice\\/?$","segments":[[{"content":"invoice","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/invoice.astro","pathname":"/invoice","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"quote/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/quote","isIndex":false,"type":"page","pattern":"^\\/quote\\/?$","segments":[[{"content":"quote","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/quote.astro","pathname":"/quote","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://neoarts.github.io/NeoArst-WebTools","base":"/NeoArts-WebTools","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/customers.astro",{"propagation":"none","containsHead":true}],["C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/invoice.astro",{"propagation":"none","containsHead":true}],["C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/pages/quote.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/customers@_@astro":"pages/customers.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/quote@_@astro":"pages/quote.astro.mjs","\u0000@astro-page:src/pages/invoice@_@astro":"pages/invoice.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astrojs-manifest":"manifest_C6P8Hl5i.mjs","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/features/quote/components/Filters":"_astro/Filters.JgZtygwo.js","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/features/invoice/components/InvoiceGenerator":"_astro/InvoiceGenerator.BiEr5QCq.js","/astro/hoisted.js?q=0":"_astro/hoisted.WsOa4w3-.js","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/src/features/docs/components/Workspace":"_astro/Workspace.DaSsRRf5.js","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/node_modules/dompurify/dist/purify.es.js":"_astro/purify.es.DGIRlouP.js","@astrojs/react/client.js":"_astro/client.BmwHh9ou.js","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/node_modules/html2canvas/dist/html2canvas.esm.js":"_astro/html2canvas.esm.BfxBtG_O.js","C:/Users/aguan/Documents/TOMAS/NEOARTS/NeoArts-WebTools/NeoArts-WebTools/node_modules/canvg/lib/index.es.js":"_astro/index.es.CoO-MfbL.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/NeoArts-WebTools/_astro/customers.BZ7MJUDR.css","/NeoArts-WebTools/favicon.svg","/NeoArts-WebTools/icons/arrow.svg","/NeoArts-WebTools/icons/drag.svg","/NeoArts-WebTools/icons/DropArrow.svg","/NeoArts-WebTools/icons/logo_expanded.svg","/NeoArts-WebTools/icons/trash.svg","/NeoArts-WebTools/_astro/client.BmwHh9ou.js","/NeoArts-WebTools/_astro/Filters.JgZtygwo.js","/NeoArts-WebTools/_astro/html2canvas.esm.BfxBtG_O.js","/NeoArts-WebTools/_astro/index.B80Lgev0.js","/NeoArts-WebTools/_astro/index.es.CoO-MfbL.js","/NeoArts-WebTools/_astro/Input.DWtb1Xh8.js","/NeoArts-WebTools/_astro/InvoiceGenerator.BiEr5QCq.js","/NeoArts-WebTools/_astro/InvoiceGenerator.BjLB3huh.js","/NeoArts-WebTools/_astro/jsx-runtime.B4ELNKBR.js","/NeoArts-WebTools/_astro/purify.es.DGIRlouP.js","/NeoArts-WebTools/_astro/Workspace.DaSsRRf5.js","/NeoArts-WebTools/customers/index.html","/NeoArts-WebTools/invoice/index.html","/NeoArts-WebTools/quote/index.html","/NeoArts-WebTools/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"/mACTxWdWE0gb7LrSuHsfW354iRjd2vGBb9W94E8TxE=","experimentalEnvGetSecretEnabled":false});

export { manifest };
