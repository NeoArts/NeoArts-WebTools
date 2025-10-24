import{j as e}from"./jsx-runtime.PRPpl5vZ.js";import"./index.RYns6xqu.js";const m={primary:`
        bg-black text-white border-black
        hover:bg-gray-800 hover:border-gray-800
        focus:ring-4 focus:ring-gray-200
        disabled:bg-gray-300 disabled:border-gray-300
        active:bg-gray-800
    `,secondary:`
        bg-white text-gray-900 border-purple-600 border
        hover:bg-purple-50 hover:text-purple-700
        focus:ring-4 focus:ring-purple-200
        disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300
        active:bg-purple-100
    `,tertiary:`
        bg-transparent text-purple-600 border-transparent
        hover:bg-purple-50 hover:text-purple-700
        focus:ring-4 focus:ring-purple-200
        disabled:text-gray-400
        active:bg-purple-100
    `,danger:`
        bg-red-600 text-white border-red-600
        hover:bg-red-700 hover:border-red-700
        focus:ring-4 focus:ring-red-200
        disabled:bg-red-300 disabled:border-red-300
        active:bg-red-800
    `,success:`
        bg-green-600 text-white border-green-600
        hover:bg-green-700 hover:border-green-700
        focus:ring-4 focus:ring-green-200
        disabled:bg-green-300 disabled:border-green-300
        active:bg-green-800
    `},f={sm:"px-3 py-1.5 text-sm font-medium min-h-[32px]",md:"px-4 py-2 text-sm font-medium min-h-[40px]",lg:"px-6 py-3 text-base font-medium min-h-[48px]"};function v({children:n,text:o,onClick:i,disabled:s=!1,variant:l="primary",size:d="md",icon:t,iconPosition:a="left",fullWidth:g=!1,loading:r=!1,className:c=""}){const b=n||o,p=`
        ${`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${g?"w-full":""}
    `}
        ${m[l]}
        ${f[d]}
        ${c}
    `.replace(/\s+/g," ").trim(),u=()=>{!s&&!r&&i()};return e.jsxs("button",{onClick:u,disabled:s||r,className:p,children:[r&&e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),t&&a==="left"&&!r&&e.jsx("span",{className:"flex-shrink-0",children:t}),b,t&&a==="right"&&!r&&e.jsx("span",{className:"flex-shrink-0",children:t})]})}export{v as B};
