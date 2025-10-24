import{j as e}from"./jsx-runtime.PRPpl5vZ.js";import{r as C}from"./index.RYns6xqu.js";const I={sm:"px-3 py-1.5 text-sm min-h-[32px]",md:"px-3 py-2 text-sm min-h-[40px]",lg:"px-4 py-3 text-base min-h-[48px]"},z={default:`
        border-gray-300 bg-white text-gray-900
        focus:border-black focus:ring-black
        hover:border-gray-400
    `,error:`
        border-red-300 bg-white text-gray-900
        focus:border-red-500 focus:ring-red-500
        hover:border-red-400
    `,success:`
        border-green-300 bg-white text-gray-900
        focus:border-green-500 focus:ring-green-500
        hover:border-green-400
    `},R=C.forwardRef(({id:t,type:d,label:n,value:c,labelPosition:o="top",placeholder:m,onInput:x,onChange:f,disabled:p=!1,max:g,min:u,size:h="md",variant:b="default",error:s,helperText:a,required:i=!1,icon:r,iconPosition:l="left",className:y=""},v)=>{const w=s?"error":b,N=`
        
        w-full border rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        placeholder:text-gray-400
    
        ${I[h]}
        ${z[w]}
        ${r?l==="left"?"pl-10":"pr-10":""}
        ${y}
    `.replace(/\s+/g," ").trim(),j=`
        w-full flex gap-2 
        ${o==="top"?"flex-col":"flex-row items-start"}
    `,$=`
        text-sm font-medium text-gray-700
        ${o==="left"?"min-w-fit whitespace-nowrap mt-2":""}
        ${i?"after:content-['*'] after:ml-0.5 after:text-red-500":""}
    `;return e.jsxs("div",{className:j,children:[n&&e.jsxs("label",{htmlFor:t,className:$,children:[n,":"]}),e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[r&&l==="left"&&e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400",children:r}),e.jsx("input",{ref:v,id:t,name:t,type:d,max:g,min:u,className:N,value:c,placeholder:m,onChange:f||x,disabled:p,required:i,"aria-describedby":s?`${t}-error`:a?`${t}-helper`:void 0,"aria-invalid":s?"true":"false"}),r&&l==="right"&&e.jsx("div",{className:"absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400",children:r})]}),s&&e.jsxs("p",{id:`${t}-error`,className:"mt-1 text-sm text-red-600 flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),s]}),a&&!s&&e.jsx("p",{id:`${t}-helper`,className:"mt-1 text-sm text-gray-500",children:a})]})]})});R.displayName="Input";export{R as I};
