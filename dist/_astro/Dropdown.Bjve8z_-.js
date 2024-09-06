import{r as d,R as c}from"./index.B52nOzfP.js";var p={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var m=d,v=Symbol.for("react.element"),x=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,y=m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function f(t,e,a){var r,s={},n=null,l=null;a!==void 0&&(n=""+a),e.key!==void 0&&(n=""+e.key),e.ref!==void 0&&(l=e.ref);for(r in e)_.call(e,r)&&!h.hasOwnProperty(r)&&(s[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)s[r]===void 0&&(s[r]=e[r]);return{$$typeof:v,type:t,key:n,ref:l,props:s,_owner:y.current}}i.Fragment=x;i.jsx=f;i.jsxs=f;p.exports=i;var o=p.exports;function b({options:t}){const e=c.useRef(null),[a,r]=c.useState(""),[s,n]=c.useState(!1);return d.useEffect(()=>{t.length>0&&r(t[0])},[]),o.jsxs("div",{className:"relative z-10",children:[o.jsxs("div",{className:"flex justify-between items-center p-2 cursor-pointer bg-gray-100 rounded-md",onClick:()=>n(!s),children:[o.jsx("input",{ref:e,type:"text",placeholder:"Select an option",value:a,className:"cursor-pointer max-w-48 bg-gray-100 focus:outline-none",onChange:()=>{}}),o.jsx("img",{src:"/icons/DropArrow.svg",alt:"dropdown arrow",className:"w-8"})]}),o.jsx("div",{className:"relative",children:o.jsx("div",{className:`${s?"visible":"hidden"} border border-gray-300 transition-all overflow-hidden absolute top-0 w-full`,children:t.map((l,u)=>o.jsx("div",{className:"p-2 cursor-pointer bg-white hover:bg-gray-100",onClick:()=>{r(l),n(!1)},children:l},u))})})]})}export{b as default};
