import{j as Y}from"./jsx-runtime.PRPpl5vZ.js";import{r as d}from"./index.RYns6xqu.js";import{n as Z}from"./notificationStorage.CtUieeNQ.js";let q={data:""},K=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||q,Q=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,V=/\/\*[^]*?\*\/|  +/g,F=/\n+/g,w=(e,t)=>{let r="",o="",s="";for(let i in e){let a=e[i];i[0]=="@"?i[1]=="i"?r=i+" "+a+";":o+=i[1]=="f"?w(a,i):i+"{"+w(a,i[1]=="k"?"":t)+"}":typeof a=="object"?o+=w(a,t?t.replace(/([^,])+/g,n=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):i):a!=null&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=w.p?w.p(i,a):i+":"+a+";")}return r+(t&&s?t+"{"+s+"}":s)+o},v={},M=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+M(e[r]);return t}return e},J=(e,t,r,o,s)=>{let i=M(e),a=v[i]||(v[i]=(l=>{let u=0,p=11;for(;u<l.length;)p=101*p+l.charCodeAt(u++)>>>0;return"go"+p})(i));if(!v[a]){let l=i!==e?e:(u=>{let p,c,f=[{}];for(;p=Q.exec(u.replace(V,""));)p[4]?f.shift():p[3]?(c=p[3].replace(F," ").trim(),f.unshift(f[0][c]=f[0][c]||{})):f[0][p[1]]=p[2].replace(F," ").trim();return f[0]})(e);v[a]=w(s?{["@keyframes "+a]:l}:l,r?"":"."+a)}let n=r&&v.g?v.g:null;return r&&(v.g=v[a]),((l,u,p,c)=>{c?u.data=u.data.replace(c,l):u.data.indexOf(l)===-1&&(u.data=p?l+u.data:u.data+l)})(v[a],t,o,n),a},X=(e,t,r)=>e.reduce((o,s,i)=>{let a=t[i];if(a&&a.call){let n=a(r),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;a=l?"."+l:n&&typeof n=="object"?n.props?"":w(n,""):n===!1?"":n}return o+s+(a??"")},"");function j(e){let t=this||{},r=e.call?e(t.p):e;return J(r.unshift?r.raw?X(r,[].slice.call(arguments,1),t.p):r.reduce((o,s)=>Object.assign(o,s&&s.call?s(t.p):s),{}):r,K(t.target),t.g,t.o,t.k)}let R,P,z;j.bind({g:1});let x=j.bind({k:1});function ee(e,t,r,o){w.p=t,R=e,P=r,z=o}function E(e,t){let r=this||{};return function(){let o=arguments;function s(i,a){let n=Object.assign({},i),l=n.className||s.className;r.p=Object.assign({theme:P&&P()},n),r.o=/ *go\d+/.test(l),n.className=j.apply(r,o)+(l?" "+l:"");let u=e;return e[0]&&(u=n.as||e,delete n.as),z&&u[0]&&z(n),R(u,n)}return s}}var te=e=>typeof e=="function",T=(e,t)=>te(e)?e(t):e,re=(()=>{let e=0;return()=>(++e).toString()})(),H=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),ae=20,A="default",W=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:o}=t;return W(e,{type:e.toasts.find(a=>a.id===o.id)?1:0,toast:o});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(a=>a.id===s||s===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+i}))}}},S=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:ae}},h={},G=(e,t=A)=>{h[t]=W(h[t]||_,e),S.forEach(([r,o])=>{r===t&&o(h[t])})},B=e=>Object.keys(h).forEach(t=>G(e,t)),oe=e=>Object.keys(h).find(t=>h[t].toasts.some(r=>r.id===e)),O=(e=A)=>t=>{G(t,e)},ie={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},se=(e={},t=A)=>{let[r,o]=d.useState(h[t]||_),s=d.useRef(h[t]);d.useEffect(()=>(s.current!==h[t]&&o(h[t]),S.push([t,o]),()=>{let a=S.findIndex(([n])=>n===t);a>-1&&S.splice(a,1)}),[t]);let i=r.toasts.map(a=>{var n,l,u;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((n=e[a.type])==null?void 0:n.removeDelay)||e?.removeDelay,duration:a.duration||((l=e[a.type])==null?void 0:l.duration)||e?.duration||ie[a.type],style:{...e.style,...(u=e[a.type])==null?void 0:u.style,...a.style}}});return{...r,toasts:i}},ne=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:r?.id||re()}),$=e=>(t,r)=>{let o=ne(t,e,r);return O(o.toasterId||oe(o.id))({type:2,toast:o}),o.id},m=(e,t)=>$("blank")(e,t);m.error=$("error");m.success=$("success");m.loading=$("loading");m.custom=$("custom");m.dismiss=(e,t)=>{let r={type:3,toastId:e};t?O(t)(r):B(r)};m.dismissAll=e=>m.dismiss(void 0,e);m.remove=(e,t)=>{let r={type:4,toastId:e};t?O(t)(r):B(r)};m.removeAll=e=>m.remove(void 0,e);m.promise=(e,t,r)=>{let o=m.loading(t.loading,{...r,...r?.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let i=t.success?T(t.success,s):void 0;return i?m.success(i,{id:o,...r,...r?.success}):m.dismiss(o),s}).catch(s=>{let i=t.error?T(t.error,s):void 0;i?m.error(i,{id:o,...r,...r?.error}):m.dismiss(o)}),e};var le=1e3,de=(e,t="default")=>{let{toasts:r,pausedAt:o}=se(e,t),s=d.useRef(new Map).current,i=d.useCallback((c,f=le)=>{if(s.has(c))return;let g=setTimeout(()=>{s.delete(c),a({type:4,toastId:c})},f);s.set(c,g)},[]);d.useEffect(()=>{if(o)return;let c=Date.now(),f=r.map(g=>{if(g.duration===1/0)return;let k=(g.duration||0)+g.pauseDuration-(c-g.createdAt);if(k<0){g.visible&&m.dismiss(g.id);return}return setTimeout(()=>m.dismiss(g.id,t),k)});return()=>{f.forEach(g=>g&&clearTimeout(g))}},[r,o,t]);let a=d.useCallback(O(t),[t]),n=d.useCallback(()=>{a({type:5,time:Date.now()})},[a]),l=d.useCallback((c,f)=>{a({type:1,toast:{id:c,height:f}})},[a]),u=d.useCallback(()=>{o&&a({type:6,time:Date.now()})},[o,a]),p=d.useCallback((c,f)=>{let{reverseOrder:g=!1,gutter:k=8,defaultPosition:I}=f||{},D=r.filter(b=>(b.position||I)===(c.position||I)&&b.height),U=D.findIndex(b=>b.id===c.id),L=D.filter((b,N)=>N<U&&b.visible).length;return D.filter(b=>b.visible).slice(...g?[L+1]:[0,L]).reduce((b,N)=>b+(N.height||0)+k,0)},[r]);return d.useEffect(()=>{r.forEach(c=>{if(c.dismissed)i(c.id,c.removeDelay);else{let f=s.get(c.id);f&&(clearTimeout(f),s.delete(c.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:l,startPause:n,endPause:u,calculateOffset:p}}},ce=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ue=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,pe=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,fe=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ce} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ue} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${pe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,me=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ge=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${me} 1s linear infinite;
`,be=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ye=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,he=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${be} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ye} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ve=E("div")`
  position: absolute;
`,xe=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,we=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ee=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${we} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$e=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?d.createElement(Ee,null,t):t:r==="blank"?null:d.createElement(xe,null,d.createElement(ge,{...o}),r!=="loading"&&d.createElement(ve,null,r==="error"?d.createElement(fe,{...o}):d.createElement(he,{...o})))},ke=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ce=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Se="0%{opacity:0;} 100%{opacity:1;}",Te="0%{opacity:1;} 100%{opacity:0;}",je=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Oe=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,De=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=H()?[Se,Te]:[ke(r),Ce(r)];return{animation:t?`${x(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Ne=d.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?De(e.position||t||"top-center",e.visible):{opacity:0},i=d.createElement($e,{toast:e}),a=d.createElement(Oe,{...e.ariaProps},T(e.message,e));return d.createElement(je,{className:e.className,style:{...s,...r,...e.style}},typeof o=="function"?o({icon:i,message:a}):d.createElement(d.Fragment,null,i,a))});ee(d.createElement);var Pe=({id:e,className:t,style:r,onHeightUpdate:o,children:s})=>{let i=d.useCallback(a=>{if(a){let n=()=>{let l=a.getBoundingClientRect().height;o(e,l)};n(),new MutationObserver(n).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return d.createElement("div",{ref:i,className:t,style:r},s)},ze=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:H()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...s}},Ae=j`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,C=16,Ie=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:s,toasterId:i,containerStyle:a,containerClassName:n})=>{let{toasts:l,handlers:u}=de(r,i);return d.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:C,left:C,right:C,bottom:C,pointerEvents:"none",...a},className:n,onMouseEnter:u.startPause,onMouseLeave:u.endPause},l.map(p=>{let c=p.position||t,f=u.calculateOffset(p,{reverseOrder:e,gutter:o,defaultPosition:t}),g=ze(c,f);return d.createElement(Pe,{id:p.id,key:p.id,onHeightUpdate:u.updateHeight,className:p.visible?Ae:"",style:g},p.type==="custom"?T(p.message,p):s?s(p):d.createElement(Ne,{toast:p,position:c}))}))},y=m;const Re=()=>Y.jsx(Ie,{position:"top-right",reverseOrder:!1,gutter:8,containerClassName:"",containerStyle:{},toastOptions:{duration:4e3,style:{background:"#fff",color:"#374151",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.25)",borderRadius:"12px",border:"1px solid #e5e7eb",padding:"16px 20px",fontSize:"14px",fontFamily:"Poppins, sans-serif",maxWidth:"400px"},success:{duration:4e3,style:{background:"#f0fdf4",color:"#166534",border:"1px solid #bbf7d0"},iconTheme:{primary:"#16a34a",secondary:"#f0fdf4"}},error:{duration:5e3,style:{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca"},iconTheme:{primary:"#dc2626",secondary:"#fef2f2"}},loading:{duration:1/0,style:{background:"#fefce8",color:"#a16207",border:"1px solid #fde047"},iconTheme:{primary:"#eab308",secondary:"#fefce8"}}}});class He{static async saveToStorage(t,r,o,s,i){try{await Z.addNotification({title:t,message:r,type:o,category:s,actionUrl:i})}catch(a){console.error("Failed to save notification to storage:",a)}}static success(t,r){return this.saveToStorage("Éxito",t,"success","system"),y.success(t,{duration:4e3,...r})}static error(t,r){return console.error("Error:",t),this.saveToStorage("Error",t,"error","system"),y.error(t,{duration:5e3,...r})}static loading(t="Procesando...",r){return y.loading(t,{...r})}static info(t,r){return this.saveToStorage("Información",t,"info","system"),y(t,{icon:"ℹ️",style:{background:"#eff6ff",color:"#1e40af",border:"1px solid #bfdbfe"},duration:4e3,...r})}static warning(t,r){return this.saveToStorage("Advertencia",t,"warning","system"),y(t,{icon:"⚠️",style:{background:"#fffbeb",color:"#d97706",border:"1px solid #fed7aa"},duration:4500,...r})}static dismiss(t){return y.dismiss(t)}static dismissAll(){return y.dismiss()}static promise(t,r,o){return y.promise(t,r,{loading:{style:{background:"#fefce8",color:"#a16207",border:"1px solid #fde047"}},success:{style:{background:"#f0fdf4",color:"#166534",border:"1px solid #bbf7d0"}},error:{style:{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca"}},...o})}static invoiceGenerated(t){return this.saveToStorage("Cuenta de Cobro Generada",`La cuenta de cobro ${t} ha sido generada exitosamente`,"success","invoice","/invoice"),this.success(`✅ Cuenta de cobro ${t} generada exitosamente`,{duration:6e3,style:{fontSize:"15px",fontWeight:"500"}})}static invoiceError(t){return this.saveToStorage("Error en Cuenta de Cobro",`Error al generar la cuenta de cobro${t?`: ${t}`:""}`,"error","invoice"),this.error(`❌ Error al generar la cuenta de cobro${t?`: ${t}`:". Por favor, intente nuevamente."}`,{duration:6e3})}static invoiceSaved(){return this.saveToStorage("Cuenta de Cobro Guardada","La cuenta de cobro ha sido guardada en el historial","success","invoice","/invoice"),this.success("💾 Cuenta de cobro guardada en el historial")}static validationError(t){const r=t.length===1?t[0]:`Por favor corrige los siguientes errores:
${t.join(`
`)}`;return this.error(r,{duration:7e3,style:{whiteSpace:"pre-line",maxWidth:"500px"}})}static dataLoaded(t,r="elementos"){return this.success(`📊 ${t} ${r} cargados exitosamente`,{duration:3e3})}static dataSaved(t="datos"){return this.success(`💾 ${t} guardados correctamente`,{duration:3e3})}static operationCancelled(){return this.info("❌ Operación cancelada")}static updateToast(t,r,o){return r==="success"?y.success(o,{id:t}):y.error(o,{id:t})}}export{He as N,Re as T};
