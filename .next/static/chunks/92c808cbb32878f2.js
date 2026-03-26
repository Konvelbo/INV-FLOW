(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3162,e=>{"use strict";let t;var a=e.i(43476),s=e.i(18566),i=e.i(68344),l=e.i(83773),r=e.i(71645),n=e.i(49874);let o="u">typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),d=new Uint8Array(16),c=[];for(let e=0;e<256;++e)c.push((e+256).toString(16).slice(1));let x=function(e,a,s){if(o&&!a&&!e)return o();var i=e,l=s;let r=(i=i||{}).random??i.rng?.()??function(){if(!t){if("u"<typeof crypto||!crypto.getRandomValues)throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");t=crypto.getRandomValues.bind(crypto)}return t(d)}();if(r.length<16)throw Error("Random bytes length must be >= 16");if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,a){if((l=l||0)<0||l+16>a.length)throw RangeError(`UUID byte range ${l}:${l+15} is out of buffer bounds`);for(let e=0;e<16;++e)a[l+e]=r[e];return a}return function(e,t=0){return(c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]).toLowerCase()}(r)};var p=e.i(75254);let u=(0,p.default)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),m=(0,p.default)("cooking-pot",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"u0tga0"}],["path",{d:"m4 8 16-4",key:"16g0ng"}],["path",{d:"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",key:"12cejc"}]]);var h=e.i(19455);function g({value:e,onValueChange:t,debounce:s=300,...i}){let[l,n]=(0,r.useState)(e),o=(0,r.useRef)(e);return e!==o.current&&(n(e),o.current=e),(0,r.useEffect)(()=>{if(s>0){let a=setTimeout(()=>{l!==e&&t(String(l))},s);return()=>clearTimeout(a)}},[l,s,t,e]),(0,a.jsx)("input",{...i,value:l,onChange:e=>n(e.target.value),onBlur:()=>{l!==e&&t(String(l))}})}function b({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,setCity:d,clientName:c,setClientName:p,clientAddress:b,setClientAddress:f,clientContact:v,setClientContact:y,clientPOBox:j,setClientPOBox:w,object:N,setObject:k,managerName:$,setManagerName:C,itemsArr:P,setItemsArr:z,currency:q}=(0,n.useInvoice)(),{language:S,dict:V}=(0,l.useLanguage)(),[D,F]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=e=>new Intl.NumberFormat("fr"===S?"fr-FR":"en-US",{style:"currency",currency:q||"XOF",minimumFractionDigits:2}).format(e),M=(0,r.useCallback)(()=>{""===D.designation&&0===D.quantity||(z([...P,{...D,id:x(),totalPrice:Number(D.quantity)*Number(D.unitPrice)}]),F({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[P,D,z]),U=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[P]);(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.quantity),0),[P]);let B=(0,r.useCallback)((e,t,a)=>{z(P.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[P,z]),R=(0,r.useCallback)(e=>{z(P.filter(t=>t.id!==e))},[P,z]),A=(0,r.useCallback)(()=>{z([])},[z]),T=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.quantity),0),[P]);return(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsxs)("div",{ref:e,id:"canvas",className:`bg-white w-[850px] text-black relative ${t<.8?"scale-small":""}`,children:[(0,a.jsxs)("div",{className:"flex justify-between items-start relative w-full mb-8 pt-10",children:[(0,a.jsx)("div",{className:"flex flex-col gap-4",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("span",{className:"text-gray-500 font-medium uppercase text-xs tracking-wider",children:"REF:"}),(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:V.reference,className:"w-40 font-bold text-lg bg-transparent"})]})})}),(0,a.jsxs)("div",{className:"text-right flex flex-col gap-2 p-2",children:[(0,a.jsx)("div",{className:"flex items-center justify-end gap-2",children:(0,a.jsx)(g,{value:o,dir:"rtl",onValueChange:d,placeholder:V.city,className:"w-40 font-medium bg-transparent"})}),(0,a.jsxs)("p",{className:"text-gray-600 font-semibold uppercase text-xs tracking-widest border-t pt-2",children:[V.date," ",new Date().toLocaleDateString("fr"===S?"fr-FR":"en-US")]})]})]}),(0,a.jsxs)("div",{className:"border h-35 w-full min-h-70",children:[(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("div",{className:"border-b h-15 p-5 w-full",children:(0,a.jsx)("h2",{children:V.billingAddress})}),(0,a.jsx)("div",{className:"border-b border-l h-15 p-5 w-full",children:(0,a.jsxs)("h2",{children:[V.deliveryAddress,":"]})})]}),(0,a.jsxs)("div",{className:"client-info space-y-3",children:[(0,a.jsxs)("div",{className:"editable-field flex items-center gap-2",children:[(0,a.jsxs)("span",{className:"label w-24",children:[V.client," :"]}),(0,a.jsx)(g,{value:c,onValueChange:p,placeholder:V.client,className:"flex-1 font-bold text-lg bg-transparent"})]}),(0,a.jsxs)("div",{className:"editable-field flex items-center gap-2",children:[(0,a.jsxs)("span",{className:"label w-24",children:[V.address," :"]}),(0,a.jsx)(g,{value:b,onValueChange:f,placeholder:V.address,className:"flex-1 bg-transparent"})]}),(0,a.jsxs)("div",{className:"flex gap-4",children:[(0,a.jsxs)("div",{className:"editable-field flex-1 flex items-center gap-2",children:[(0,a.jsxs)("span",{className:"label w-24",children:[V.contact," :"]}),(0,a.jsx)(g,{value:v,onValueChange:y,placeholder:V.contact,className:"flex-1 bg-transparent"})]}),(0,a.jsxs)("div",{className:"editable-field flex-1 flex items-center gap-2",children:[(0,a.jsxs)("span",{className:"label w-24",children:[V.poBox," :"]}),(0,a.jsx)(g,{value:j,onValueChange:w,placeholder:V.poBox,className:"flex-1 bg-transparent"})]})]}),(0,a.jsxs)("div",{className:"editable-field flex items-center gap-2 border-t pt-2 mt-2",children:[(0,a.jsxs)("span",{className:"label w-24",children:[V.object," :"]}),(0,a.jsx)(g,{value:N,onValueChange:k,placeholder:V.object,className:"flex-1 font-medium bg-transparent"})]})]})]}),(0,a.jsxs)("table",{children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:V.designation}),(0,a.jsx)("th",{children:V.unit}),(0,a.jsx)("th",{children:V.quantity}),(0,a.jsx)("th",{children:V.unitPrice}),(0,a.jsx)("th",{children:V.totalPrice})]})}),(0,a.jsxs)("tbody",{className:"relative",children:[P.map(e=>(0,a.jsxs)("tr",{children:[(0,a.jsxs)("td",{className:"relative p-0",children:[(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:e.designation,onValueChange:t=>B(e.id,"designation",t),placeholder:V.designation,className:"border-none outline-none w-full bg-transparent"})}),(0,a.jsx)(m,{id:"Delete",onClick:()=>R(e.id),className:"delete text-black absolute -left-7 top-1/2 -translate-y-1/2 size-5"})]}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>B(e.id,"unit",t),placeholder:V.unit,className:"bg-transparent w-full text-center"})})}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>B(e.id,"quantity",Number(t)),placeholder:V.quantity,className:"bg-transparent w-full text-center"})})}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>B(e.id,"unitPrice",Number(t)),placeholder:V.unitPrice,className:"bg-transparent w-full text-center font-medium"})})}),(0,a.jsx)("td",{children:(0,a.jsx)("h2",{children:I(e.totalPrice)})})]},e.id)),(0,a.jsxs)("tr",{children:[(0,a.jsxs)("td",{className:"relative p-0",children:[(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:D.designation,onValueChange:e=>F({...D,designation:e}),placeholder:V.designation,className:"border-none outline-none w-full bg-transparent"})}),(0,a.jsx)(u,{onClick:M,className:"uploade text-black absolute -left-7 top-1/2 -translate-y-1/2 size-6"})]}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:D.unit,onValueChange:e=>F({...D,unit:e}),placeholder:V.unit,className:"bg-transparent w-full text-center"})})}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:D.quantity,onValueChange:e=>{let t=Number(e);F(e=>({...e,quantity:t,totalPrice:t*Number(e.unitPrice)}))},placeholder:V.quantity,className:"bg-transparent w-full text-center"})})}),(0,a.jsx)("td",{className:"p-0",children:(0,a.jsx)("div",{className:"editable-field p-2",children:(0,a.jsx)(g,{value:D.unitPrice,onValueChange:e=>{let t=Number(e);F(e=>({...e,unitPrice:t,totalPrice:t*Number(e.quantity)}))},placeholder:V.unitPrice,className:"bg-transparent w-full text-center"})})}),(0,a.jsx)("td",{children:(0,a.jsx)("h2",{children:I(D.totalPrice)})})]})]})]}),(0,a.jsx)("table",{className:"totals",children:(0,a.jsxs)("tbody",{children:[(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:V.totalMaterial}),(0,a.jsx)("td",{children:T})]}),(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:V.totalHT}),(0,a.jsx)("td",{children:I(U)})]})]})}),(0,a.jsxs)("div",{className:"signature",children:[(0,a.jsx)("h2",{className:"font-semibold mb-3",children:V.managerName}),(0,a.jsx)(g,{value:$,onValueChange:C,dir:"rtl",placeholder:V.managerName,className:"border-none outline-none w-90"})]}),(0,a.jsx)(h.Button,{onClick:A,className:"mt-4 p-5 bg-red-500 text-white",children:V.clearAll})]})})}var f=e.i(7233),v=e.i(27612);function y({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,setCity:d,clientName:c,setClientName:p,clientAddress:u,setClientAddress:m,clientContact:b,setClientContact:y,clientPOBox:j,setClientPOBox:w,object:N,setObject:k,managerName:$,setManagerName:C,itemsArr:P,setItemsArr:z,currency:q}=(0,n.useInvoice)(),{dict:S,language:V}=(0,l.useLanguage)(),[D,F]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=e=>new Intl.NumberFormat("fr"===V?"fr-FR":"en-US",{style:"currency",currency:q||"XOF",minimumFractionDigits:2}).format(e),M=(0,r.useCallback)(()=>{""===D.designation&&0===D.quantity||(z([...P,{...D,id:x(),totalPrice:Number(D.quantity)*Number(D.unitPrice)}]),F({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[P,D,z]),U=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[P]),B=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.quantity),0),[P]),R=(0,r.useCallback)((e,t,a)=>{z(P.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[P,z]),A=(0,r.useCallback)(e=>{z(P.filter(t=>t.id!==e))},[P,z]);return(0,r.useCallback)(()=>{z([])},[z]),(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsxs)("div",{ref:e,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-lg ${t<.8?"scale-small":""}`,children:[(0,a.jsxs)("div",{className:"bg-slate-900 text-white p-12 flex justify-between items-start",children:[(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("h1",{className:"text-4xl font-light tracking-wide mb-2",children:S.invoice}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-slate-400",children:[(0,a.jsxs)("span",{className:"text-sm uppercase tracking-wider",children:[S.reference,":"]}),(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:"IV-2024-001",className:"bg-transparent border-b border-slate-700 text-white w-40 focus:border-white transition-colors"})]})]}),(0,a.jsx)("div",{className:"w-1/2 text-right",children:(0,a.jsxs)("div",{className:"flex justify-end items-center gap-2 mb-1",children:[(0,a.jsx)(g,{value:o,onValueChange:d,placeholder:"City",className:"bg-transparent border-b border-slate-700 text-white text-right w-32 focus:border-white"}),(0,a.jsxs)("span",{className:"text-slate-400",children:[","," ",new Date().toLocaleDateString("fr"===V?"fr-FR":"en-US")]})]})})]}),(0,a.jsxs)("div",{className:"p-12 pb-6 grid grid-cols-2 gap-12",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider mb-4",children:S.billedTo}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(g,{value:c,onValueChange:p,placeholder:"Client Company Name",className:"text-xl font-bold text-slate-900 w-full placeholder:text-slate-300"}),(0,a.jsx)(g,{value:u,onValueChange:m,placeholder:"Street Address",className:"text-sm text-slate-600 w-full"}),(0,a.jsxs)("div",{className:"flex gap-4",children:[(0,a.jsx)(g,{value:b,onValueChange:y,placeholder:"Contact Person",className:"text-sm text-slate-600 w-full"}),(0,a.jsx)(g,{value:j,onValueChange:w,placeholder:"BP",className:"text-sm text-slate-600 w-24"})]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider mb-4",children:S.projectDetails}),(0,a.jsxs)("div",{className:"bg-slate-50 p-6 rounded-lg",children:[(0,a.jsxs)("label",{className:"block text-xs font-semibold text-slate-500 mb-1",children:[S.object," / ",S.description]}),(0,a.jsx)(g,{value:N,onValueChange:k,placeholder:S.object,className:"w-full text-slate-800 font-medium"})]})]})]}),(0,a.jsx)("div",{className:"px-12 py-6",children:(0,a.jsxs)("table",{className:"w-full",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{className:"border-b-2 border-slate-100",children:[(0,a.jsx)("th",{className:"py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2",children:S.description}),(0,a.jsx)("th",{className:"py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider",children:S.unit}),(0,a.jsx)("th",{className:"py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider",children:S.qty}),(0,a.jsx)("th",{className:"py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",children:S.unitPrice}),(0,a.jsx)("th",{className:"py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",children:S.totalPrice})]})}),(0,a.jsxs)("tbody",{className:"divide-y divide-slate-50",children:[P.map(e=>(0,a.jsxs)("tr",{className:"group hover:bg-slate-50 transition-colors",children:[(0,a.jsxs)("td",{className:"py-4 relative",children:[(0,a.jsx)(g,{value:e.designation,onValueChange:t=>R(e.id,"designation",t),placeholder:S.description,className:"w-full font-medium text-slate-700"}),(0,a.jsx)("button",{onClick:()=>A(e.id),className:"absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-all p-1 cursor-pointer",children:(0,a.jsx)(v.Trash2,{className:"w-4 h-4"})})]}),(0,a.jsx)("td",{className:"py-4 text-center",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>R(e.id,"unit",t),className:"text-center text-slate-500 w-16 mx-auto"})}),(0,a.jsx)("td",{className:"py-4 text-center",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>R(e.id,"quantity",Number(t)),className:"text-center font-semibold text-slate-700 w-16 mx-auto"})}),(0,a.jsx)("td",{className:"py-4 text-right",children:(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>R(e.id,"unitPrice",Number(t)),className:"text-right text-slate-500 w-24 ml-auto"})}),(0,a.jsx)("td",{className:"py-4 text-right font-bold text-slate-800",children:I(e.totalPrice)})]},e.id)),(0,a.jsxs)("tr",{className:"bg-slate-50",children:[(0,a.jsx)("td",{className:"py-4 relative pl-4",children:(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)(h.Button,{variant:"ghost",size:"sm",className:"h-6 w-6 p-0 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600",onClick:M,children:(0,a.jsx)(f.Plus,{className:"w-4 h-4"})}),(0,a.jsx)(g,{value:D.designation,onValueChange:e=>F({...D,designation:e}),placeholder:S.add,className:"w-full text-slate-500 italic bg-transparent"})]})}),(0,a.jsx)("td",{className:"py-4 text-center",children:(0,a.jsx)(g,{value:D.unit,onValueChange:e=>F({...D,unit:e}),className:"text-center text-slate-400 w-16 mx-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-4 text-center",children:(0,a.jsx)(g,{value:D.quantity,onValueChange:e=>{let t=Number(e);F(e=>({...e,quantity:t,totalPrice:t*e.unitPrice}))},className:"text-center text-slate-400 w-16 mx-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-4 text-right",children:(0,a.jsx)(g,{value:D.unitPrice,onValueChange:e=>{let t=Number(e);F(e=>({...e,unitPrice:t,totalPrice:e.quantity*t}))},className:"text-right text-slate-400 w-24 ml-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-4 text-right font-medium text-slate-400 pr-4",children:I(D.totalPrice)})]})]})]})}),(0,a.jsxs)("div",{className:"px-12 mt-12 flex justify-between items-end gap-12",children:[(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("p",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4",children:S.authorizedSignature}),(0,a.jsx)(g,{value:$,onValueChange:C,placeholder:S.managerName,className:"font-script text-2xl text-slate-800 w-full max-w-[250px] border-b border-slate-200 pb-2"})]}),(0,a.jsxs)("div",{className:"min-w-[300px] max-w-[50%] space-y-3",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center gap-4 text-slate-500 text-sm tabular-nums",children:[(0,a.jsx)("span",{className:"whitespace-nowrap",children:S.totalMaterial}),(0,a.jsx)("span",{className:"text-right break-all font-medium",children:B})]}),(0,a.jsxs)("div",{className:"flex justify-between items-center gap-4 pt-4 border-t border-slate-200 tabular-nums",children:[(0,a.jsx)("span",{className:"font-bold text-lg text-slate-900 whitespace-nowrap",children:S.total}),(0,a.jsx)("span",{className:"font-bold text-2xl text-slate-900 text-right break-all leading-tight",children:I(U)})]})]})]})]})})}function j({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,setCity:d,clientName:c,setClientName:p,clientAddress:u,setClientAddress:m,clientContact:b,setClientContact:y,clientPOBox:j,setClientPOBox:w,object:N,setObject:k,managerName:$,setManagerName:C,itemsArr:P,setItemsArr:z,currency:q}=(0,n.useInvoice)(),{dict:S,language:V}=(0,l.useLanguage)(),[D,F]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=e=>new Intl.NumberFormat("fr"===V?"fr-FR":"en-US",{style:"currency",currency:q||"XOF",minimumFractionDigits:2}).format(e),M=(0,r.useCallback)(()=>{""===D.designation&&0===D.quantity||(z([...P,{...D,id:x(),totalPrice:Number(D.quantity)*Number(D.unitPrice)}]),F({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[P,D,z]),U=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[P]),B=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.quantity),0),[P]),R=(0,r.useCallback)((e,t,a)=>{z(P.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[P,z]),A=(0,r.useCallback)(e=>{z(P.filter(t=>t.id!==e))},[P,z]);return(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsxs)("div",{ref:e,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl font-serif ${t<.8?"scale-small":""}`,children:[(0,a.jsxs)("div",{className:"flex h-48",children:[(0,a.jsxs)("div",{className:"w-1/3 bg-blue-900 p-8 flex flex-col justify-center text-white",children:[(0,a.jsx)("div",{className:"w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4",children:(0,a.jsx)("div",{className:"w-10 h-10 bg-white rounded-full"})}),(0,a.jsx)("h2",{className:"font-bold text-xl tracking-wider",children:"COMPANY"})]}),(0,a.jsx)("div",{className:"w-2/3 bg-gray-100 p-8 flex flex-col justify-between",children:(0,a.jsxs)("div",{className:"flex justify-between items-start",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-5xl font-bold text-blue-900 mb-2",children:S.invoice}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-gray-500",children:[(0,a.jsx)("span",{children:"#"}),(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:"INV-0000",className:"bg-transparent text-gray-600 w-32 focus:ring-0"})]})]}),(0,a.jsxs)("div",{className:"text-right",children:[(0,a.jsx)(g,{value:o,onValueChange:d,placeholder:"City",className:"text-right text-gray-600 w-32 bg-transparent"}),(0,a.jsx)("div",{className:"text-sm text-gray-500",children:new Date().toLocaleDateString("fr"===V?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})})]}),(0,a.jsxs)("div",{className:"p-10 flex gap-12",children:[(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("h3",{className:"text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block",children:S.billedTo}),(0,a.jsx)(g,{value:c,onValueChange:p,placeholder:"Recipient Name",className:"text-2xl font-bold text-gray-900 w-full mb-2 block"}),(0,a.jsx)(g,{value:u,onValueChange:m,placeholder:"Address Line",className:"text-gray-600 w-full text-sm"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(g,{value:j,onValueChange:w,placeholder:"Zip/Postal",className:"text-gray-600 w-24 text-sm"}),(0,a.jsx)(g,{value:b,onValueChange:y,placeholder:S.contact,className:"text-gray-600 w-full text-sm"})]})]}),(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("h3",{className:"text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block",children:S.projectDetails}),(0,a.jsx)(g,{value:N,onValueChange:k,placeholder:S.object,className:"w-full text-gray-700 bg-gray-50 p-2 border-l-4 border-gray-300"})]})]}),(0,a.jsxs)("div",{className:"px-10 mt-4",children:[(0,a.jsxs)("table",{className:"w-full",children:[(0,a.jsx)("thead",{className:"bg-blue-900 text-white",children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{className:"py-3 px-4 text-left font-semibold text-sm",children:S.description}),(0,a.jsx)("th",{className:"py-3 px-4 text-center font-semibold text-sm",children:S.unit}),(0,a.jsx)("th",{className:"py-3 px-4 text-center font-semibold text-sm",children:S.qty}),(0,a.jsx)("th",{className:"py-3 px-4 text-right font-semibold text-sm",children:S.price}),(0,a.jsx)("th",{className:"py-3 px-4 text-right font-semibold text-sm",children:S.total})]})}),(0,a.jsxs)("tbody",{children:[P.map((e,t)=>(0,a.jsxs)("tr",{className:t%2==0?"bg-white":"bg-gray-50",children:[(0,a.jsxs)("td",{className:"py-3 px-4 relative",children:[(0,a.jsx)(g,{value:e.designation,onValueChange:t=>R(e.id,"designation",t),className:"w-full font-medium text-gray-800 bg-transparent wrap-break-word whitespace-pre-wrap min-h-[1.5rem]"}),(0,a.jsx)("button",{onClick:()=>A(e.id),className:"absolute -left-6 top-3 text-red-500 hover:text-red-700 cursor-pointer",children:(0,a.jsx)(v.Trash2,{className:"w-4 h-4"})})]}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>R(e.id,"unit",t),className:"text-center w-12 mx-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>R(e.id,"quantity",Number(t)),className:"text-center w-12 mx-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-right",children:(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>R(e.id,"unitPrice",Number(t)),className:"text-right w-24 ml-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-right font-bold text-gray-800 tabular-nums",children:I(e.totalPrice)})]},e.id)),(0,a.jsxs)("tr",{className:"bg-blue-50/50 outline outline-blue-200 outline-dashed",children:[(0,a.jsx)("td",{className:"py-3 px-4",children:(0,a.jsx)(g,{value:D.designation,onValueChange:e=>F({...D,designation:e}),placeholder:S.add,className:"w-full bg-transparent font-medium"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(0,a.jsx)(g,{value:D.unit,onValueChange:e=>F({...D,unit:e}),className:"text-center w-12 mx-auto bg-transparent"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-center",children:(0,a.jsx)(g,{value:D.quantity,onValueChange:e=>F({...D,quantity:Number(e),totalPrice:Number(e)*D.unitPrice}),className:"text-center w-12 mx-auto bg-transparent font-mono"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-right",children:(0,a.jsx)(g,{value:D.unitPrice,onValueChange:e=>F({...D,unitPrice:Number(e),totalPrice:D.quantity*Number(e)}),className:"text-right w-24 ml-auto bg-transparent font-mono"})}),(0,a.jsx)("td",{className:"py-3 px-4 text-right font-bold text-blue-700",children:I(D.quantity*D.unitPrice)})]})]})]}),(0,a.jsx)("div",{className:"mt-4 flex items-center justify-center",children:(0,a.jsxs)(h.Button,{variant:"default",size:"sm",onClick:M,className:"bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer",children:[(0,a.jsx)(f.Plus,{className:"w-4 h-4 mr-2"})," ",S.add]})})]}),(0,a.jsxs)("div",{className:"px-10 mt-12 flex justify-between items-end gap-12 pb-16",children:[(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("div",{className:"text-xs text-gray-400 uppercase tracking-widest mb-4",children:S.authorizedSignature}),(0,a.jsx)(g,{value:$,onValueChange:C,placeholder:S.managerName,className:"text-lg font-serif italic text-gray-800 border-b border-gray-200 pb-1 w-full max-w-[250px]"})]}),(0,a.jsxs)("div",{className:"min-w-[400px] max-w-[50%] bg-blue-900 text-white p-8 rounded-2xl shadow-xl space-y-4 tabular-nums",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center gap-4 text-blue-100/70",children:[(0,a.jsx)("span",{className:"text-sm font-medium uppercase tracking-wider",children:S.totalMaterial}),(0,a.jsx)("span",{className:"text-xl font-bold break-all",children:B})]}),(0,a.jsxs)("div",{className:"pt-4 border-t border-blue-800 flex justify-between items-center gap-6",children:[(0,a.jsx)("span",{className:"text-lg font-bold uppercase tracking-widest text-blue-200",children:S.total}),(0,a.jsx)("span",{className:"text-2xl font-black text-white break-all text-right leading-tight",children:I(U)})]})]})]}),(0,a.jsx)("div",{className:"w-full bg-blue-900 h-4 mt-auto"})]})})}let w=(0,p.default)("hexagon",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]]);function N({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,setCity:d,clientName:c,setClientName:p,clientAddress:u,setClientAddress:m,clientContact:b,setClientContact:y,clientPOBox:j,setClientPOBox:N,object:k,setObject:$,managerName:C,setManagerName:P,itemsArr:z,setItemsArr:q,currency:S}=(0,n.useInvoice)(),{language:V,dict:D}=(0,l.useLanguage)(),[F,I]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),M=e=>new Intl.NumberFormat("fr"===V?"fr-FR":"en-US",{style:"currency",currency:S||"XOF",minimumFractionDigits:2}).format(e),U=(0,r.useCallback)(()=>{""===F.designation&&0===F.quantity||(q([...z,{...F,id:x(),totalPrice:Number(F.quantity)*Number(F.unitPrice)}]),I({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[z,F,q]),B=(0,r.useMemo)(()=>z.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[z]),R=(0,r.useMemo)(()=>z.reduce((e,t)=>e+Number(t.quantity),0),[z]),A=(0,r.useCallback)((e,t,a)=>{q(z.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[z,q]),T=(0,r.useCallback)(e=>{q(z.filter(t=>t.id!==e))},[z,q]);return(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsxs)("div",{ref:e,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl ${t<.8?"scale-small":""}`,children:[(0,a.jsx)("div",{className:"absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-bl-[100px] opacity-20 z-0"}),(0,a.jsx)("div",{className:"absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-tr-[100px] opacity-20 z-0"}),(0,a.jsxs)("div",{className:"p-12 relative z-10",children:[(0,a.jsxs)("div",{className:"flex justify-between items-end mb-12",children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"flex items-center gap-2 mb-4 text-purple-600",children:[(0,a.jsx)(w,{className:"w-8 h-8 fill-current"}),(0,a.jsx)("span",{className:"font-bold text-2xl tracking-tighter",children:"CREATIVE"})]}),(0,a.jsxs)("div",{className:"text-gray-500",children:[(0,a.jsx)(g,{value:o,onValueChange:d,placeholder:"City",className:"bg-transparent w-32 border-b border-dashed border-gray-300 focus:border-purple-400"}),(0,a.jsx)("div",{className:"text-sm mt-1",children:new Date().toLocaleDateString("fr"===V?"fr-FR":"en-US")})]})]}),(0,a.jsxs)("div",{className:"text-right absolute -top-10 right-4 -z-100",children:[(0,a.jsx)("h1",{className:"text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-orange-400 opacity-80",children:D.invoice}),(0,a.jsxs)("div",{className:"flex items-center justify-end gap-2 mt-2",children:[(0,a.jsx)("span",{className:"font-bold text-gray-400",children:"#"}),(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:D.reference,className:"text-right font-mono text-xl w-32 bg-transparent text-gray-700 font-bold"})]})]})]}),(0,a.jsxs)("div",{className:"flex gap-8 mb-12",children:[(0,a.jsxs)("div",{className:"w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-100",children:[(0,a.jsx)("h3",{className:"text-purple-500 font-bold text-xs uppercase mb-4",children:D.billedTo}),(0,a.jsx)(g,{value:c,onValueChange:p,placeholder:D.client,className:"text-2xl font-bold text-gray-800 w-full mb-1 bg-transparent"}),(0,a.jsx)(g,{value:u,onValueChange:m,placeholder:D.address,className:"text-gray-500 w-full text-sm bg-transparent"}),(0,a.jsxs)("div",{className:"flex gap-2 mt-2",children:[(0,a.jsx)(g,{value:j,onValueChange:N,placeholder:"Zip",className:"text-gray-500 w-20 text-sm bg-white rounded px-2"}),(0,a.jsx)(g,{value:b,onValueChange:y,placeholder:D.contact,className:"text-gray-500 w-full text-sm bg-white rounded px-2"})]})]}),(0,a.jsxs)("div",{className:"w-1/2 flex flex-col justify-center pl-6 border-l-4 border-orange-300",children:[(0,a.jsx)("h3",{className:"text-orange-400 font-bold text-xs uppercase mb-2",children:D.projectDetails}),(0,a.jsx)(g,{value:k,onValueChange:$,placeholder:D.object,className:"text-lg text-gray-700 italic w-full bg-transparent"})]})]}),(0,a.jsxs)("div",{className:"mb-8",children:[(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider px-4",children:[(0,a.jsx)("div",{className:"col-span-5",children:D.description}),(0,a.jsx)("div",{className:"col-span-1 text-center",children:D.unit}),(0,a.jsx)("div",{className:"col-span-2 text-center",children:D.qty}),(0,a.jsx)("div",{className:"col-span-4 text-right",children:D.total})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[z.map(e=>(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 items-center bg-white border border-gray-100 shadow-xs rounded-xl p-4 hover:shadow-md transition-shadow relative group",children:[(0,a.jsxs)("div",{className:"col-span-5",children:[(0,a.jsx)(g,{value:e.designation,onValueChange:t=>A(e.id,"designation",t),className:"font-semibold text-gray-800 w-full bg-transparent"}),(0,a.jsxs)("div",{className:"text-xs text-gray-400 mt-1 flex gap-2",children:[(0,a.jsxs)("span",{children:[D.price,":"]}),(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>A(e.id,"unitPrice",Number(t)),className:"w-20 bg-gray-50 rounded px-1"})]}),(0,a.jsx)("button",{onClick:()=>T(e.id),className:"absolute -left-3 top-1/2 -translate-y-1/2 bg-red-100 text-red-500 p-1 rounded-full transition-opacity cursor-pointer shadow-sm",children:(0,a.jsx)(v.Trash2,{className:"w-3 h-3"})})]}),(0,a.jsx)("div",{className:"col-span-1 text-center",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>A(e.id,"unit",t),className:"text-center w-full bg-transparent text-gray-500 text-sm"})}),(0,a.jsx)("div",{className:"col-span-2 text-center",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>A(e.id,"quantity",Number(t)),className:"text-center w-14 mx-auto bg-purple-50 text-purple-700 font-bold rounded-lg py-1"})}),(0,a.jsx)("div",{className:"col-span-4 text-right font-bold text-gray-800 tabular-nums whitespace-nowrap",children:M(e.totalPrice)})]},e.id)),(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 items-center border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors",children:[(0,a.jsxs)("div",{className:"col-span-5 flex gap-2 items-center",children:[(0,a.jsx)(h.Button,{size:"icon",className:"h-8 w-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 cursor-pointer",onClick:U,children:(0,a.jsx)(f.Plus,{className:"w-4 h-4"})}),(0,a.jsx)(g,{value:F.designation,onValueChange:e=>I({...F,designation:e}),placeholder:D.add,className:"bg-transparent text-gray-500 w-full"})]}),(0,a.jsx)("div",{className:"col-span-1",children:(0,a.jsx)(g,{value:F.unit,onValueChange:e=>I({...F,unit:e}),className:"text-center w-full bg-transparent text-gray-400 text-sm"})}),(0,a.jsx)("div",{className:"col-span-2",children:(0,a.jsx)(g,{value:F.quantity,onValueChange:e=>{let t=Number(e);I(e=>({...e,quantity:t,totalPrice:t*e.unitPrice}))},className:"text-center w-14 mx-auto bg-gray-50 rounded py-1"})}),(0,a.jsxs)("div",{className:"col-span-4 text-right",children:[(0,a.jsx)(g,{value:F.unitPrice,onValueChange:e=>{let t=Number(e);I(e=>({...e,unitPrice:t,totalPrice:e.quantity*t}))},placeholder:D.price,className:"text-right w-20 ml-auto bg-transparent tabular-nums"}),(0,a.jsx)("div",{className:"text-xs text-gray-400 pr-2",children:M(F.totalPrice)})]})]})]})]}),(0,a.jsxs)("div",{className:"flex flex-col items-end mt-12",children:[(0,a.jsxs)("div",{className:"bg-slate-900 text-white p-8 rounded-2xl min-w-[350px] max-w-full shadow-2xl relative overflow-hidden tabular-nums",children:[(0,a.jsx)("div",{className:"absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"}),(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between gap-8 relative z-10",children:[(0,a.jsxs)("div",{className:"min-w-fit",children:[(0,a.jsx)("div",{className:"text-gray-400 text-xs uppercase mb-1",children:D.totalMaterial}),(0,a.jsx)("div",{className:"text-xl font-bold break-all",children:R})]}),(0,a.jsxs)("div",{className:"text-right flex-1",children:[(0,a.jsx)("div",{className:"text-gray-400 text-xs uppercase mb-1",children:D.total}),(0,a.jsx)("div",{className:"text-4xl font-black text-orange-400 break-all leading-tight",children:M(B)})]})]})]}),(0,a.jsxs)("div",{className:"mt-12 text-center w-full",children:[(0,a.jsx)(g,{value:C,onValueChange:P,placeholder:D.managerName,className:"text-center font-handwriting text-2xl text-purple-800 w-64 mx-auto border-b border-purple-200 pb-2"}),(0,a.jsx)("div",{className:"text-xs text-gray-400 uppercase tracking-widest mt-2",children:D.authorizedSignature})]})]})]})]})})}function k({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,setCity:d,clientName:c,setClientName:p,clientAddress:u,setClientAddress:m,clientContact:b,setClientContact:y,clientPOBox:j,setClientPOBox:w,object:N,setObject:k,managerName:$,setManagerName:C,itemsArr:P,setItemsArr:z,currency:q}=(0,n.useInvoice)(),{language:S,dict:V}=(0,l.useLanguage)(),[D,F]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=e=>new Intl.NumberFormat("fr"===S?"fr-FR":"en-US",{style:"currency",currency:q||"XOF",minimumFractionDigits:2}).format(e),M=(0,r.useCallback)(()=>{""===D.designation&&0===D.quantity||(z([...P,{...D,id:x(),totalPrice:Number(D.quantity)*Number(D.unitPrice)}]),F({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[P,D,z]),U=(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[P]);(0,r.useMemo)(()=>P.reduce((e,t)=>e+Number(t.quantity),0),[P]);let B=(0,r.useCallback)((e,t,a)=>{z(P.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[P,z]),R=(0,r.useCallback)(e=>{z(P.filter(t=>t.id!==e))},[P,z]);return(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsxs)("div",{ref:e,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-xl font-sans ${t<.8?"scale-small":""}`,children:[(0,a.jsx)("div",{className:"h-2 w-full bg-[#1e293b]"}),(0,a.jsxs)("div",{className:"p-16",children:[(0,a.jsxs)("div",{className:"flex justify-between items-start mb-16",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-4xl font-serif text-[#1e293b] tracking-tight mb-2",children:V.invoice}),(0,a.jsxs)("div",{className:"text-sm text-slate-500 uppercase tracking-widest font-medium",children:[V.reference,":"," ",(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:"INV-001",className:"w-32 inline-block bg-transparent text-slate-700"})]})]}),(0,a.jsxs)("div",{className:"text-right",children:[(0,a.jsx)("div",{className:"text-2xl font-serif text-[#1e293b] mb-1",children:"Company Name"}),(0,a.jsxs)("div",{className:"text-sm text-slate-500",children:[(0,a.jsx)(g,{value:o,onValueChange:d,placeholder:"City, Country",className:"text-right w-48 bg-transparent"}),(0,a.jsx)("div",{children:new Date().toLocaleDateString("fr"===S?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-12 mb-16",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2",children:V.billedTo}),(0,a.jsx)(g,{value:c,onValueChange:p,placeholder:V.client,className:"text-xl font-serif text-[#1e293b] w-full mb-1"}),(0,a.jsx)(g,{value:u,onValueChange:m,placeholder:V.address,className:"text-sm text-slate-500 w-full"}),(0,a.jsx)(g,{value:b,onValueChange:y,placeholder:V.contact,className:"text-sm text-slate-500 w-full"}),(0,a.jsx)(g,{value:j,onValueChange:w,placeholder:V.poBox,className:"text-sm text-slate-500 w-24"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2",children:V.projectDetails}),(0,a.jsx)(g,{value:N,onValueChange:k,placeholder:V.object,className:"text-md text-slate-700 w-full h-24 resize-none bg-slate-50 p-3 rounded-md"})]})]}),(0,a.jsx)("div",{className:"mb-12",children:(0,a.jsxs)("table",{className:"w-full",children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{className:"border-b-2 border-[#1e293b]",children:[(0,a.jsx)("th",{className:"py-3 text-left text-xs font-bold text-[#1e293b] uppercase tracking-wider",children:V.description}),(0,a.jsx)("th",{className:"py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24",children:V.unit}),(0,a.jsx)("th",{className:"py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24",children:V.qty}),(0,a.jsx)("th",{className:"py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32",children:V.price}),(0,a.jsx)("th",{className:"py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32",children:V.total})]})}),(0,a.jsxs)("tbody",{className:"divide-y divide-slate-100",children:[P.map(e=>(0,a.jsxs)("tr",{className:"group hover:bg-slate-50",children:[(0,a.jsxs)("td",{className:"py-4 relative",children:[(0,a.jsx)(g,{value:e.designation,onValueChange:t=>B(e.id,"designation",t),className:"w-full font-medium text-slate-700 bg-transparent"}),(0,a.jsx)("button",{onClick:()=>R(e.id),className:"absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-opacity cursor-pointer",children:(0,a.jsx)(v.Trash2,{className:"w-4 h-4"})})]}),(0,a.jsx)("td",{className:"py-4",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>B(e.id,"unit",t),className:"w-full text-center text-slate-500 bg-transparent"})}),(0,a.jsx)("td",{className:"py-4",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>B(e.id,"quantity",Number(t)),className:"w-full text-center text-slate-500 bg-transparent"})}),(0,a.jsx)("td",{className:"py-4 text-right",children:(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>B(e.id,"unitPrice",Number(t)),className:"w-full text-right text-slate-500 bg-transparent"})}),(0,a.jsx)("td",{className:"py-4 text-right font-medium text-slate-900",children:I(e.totalPrice)})]},e.id)),(0,a.jsxs)("tr",{className:"bg-slate-50/50",children:[(0,a.jsxs)("td",{className:"py-3 pl-2 flex items-center gap-2",children:[(0,a.jsx)(h.Button,{size:"icon",variant:"ghost",onClick:M,className:"h-6 w-6 text-slate-400 hover:text-[#1e293b]",children:(0,a.jsx)(f.Plus,{className:"w-4 h-4"})}),(0,a.jsx)(g,{value:D.designation,onValueChange:e=>F({...D,designation:e}),placeholder:V.add,className:"w-full bg-transparent text-sm"})]}),(0,a.jsx)("td",{className:"py-3",children:(0,a.jsx)(g,{value:D.unit,onValueChange:e=>F({...D,unit:e}),className:"w-full text-center bg-transparent text-sm text-slate-400"})}),(0,a.jsx)("td",{className:"py-3",children:(0,a.jsx)(g,{value:D.quantity,onValueChange:e=>F({...D,quantity:Number(e),totalPrice:Number(e)*D.unitPrice}),className:"w-full text-center bg-transparent text-sm text-slate-400"})}),(0,a.jsx)("td",{className:"py-3 text-right",children:(0,a.jsx)(g,{value:D.unitPrice,onValueChange:e=>F({...D,unitPrice:Number(e),totalPrice:D.quantity*Number(e)}),className:"w-full text-right bg-transparent text-sm text-slate-400"})}),(0,a.jsx)("td",{className:"py-3 text-right text-sm text-slate-400 pr-2",children:I(D.totalPrice)})]})]})]})}),(0,a.jsx)("div",{className:"flex justify-end mb-20",children:(0,a.jsxs)("div",{className:"min-w-[320px] max-w-full space-y-1 tabular-nums",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500",children:[(0,a.jsx)("span",{className:"whitespace-nowrap",children:V.subtotal}),(0,a.jsx)("span",{className:"text-right break-all",children:I(U)})]}),(0,a.jsxs)("div",{className:"flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500",children:[(0,a.jsx)("span",{className:"whitespace-nowrap",children:V.tax}),(0,a.jsx)("span",{className:"text-right break-all",children:I(0)})]}),(0,a.jsxs)("div",{className:"flex justify-between items-center gap-8 py-4 border-b-2 border-[#1e293b] text-xl font-serif text-[#1e293b]",children:[(0,a.jsx)("span",{className:"font-bold uppercase tracking-wider whitespace-nowrap",children:V.total}),(0,a.jsx)("span",{className:"font-bold break-all text-right",children:I(U)})]})]})}),(0,a.jsxs)("div",{className:"flex justify-between items-end",children:[(0,a.jsx)("div",{className:"text-xs text-slate-400"}),(0,a.jsxs)("div",{className:"text-center w-64",children:[(0,a.jsx)(g,{value:$,onValueChange:C,placeholder:V.managerName,className:"text-center font-cursive text-2xl text-[#1e293b] w-full mb-2"}),(0,a.jsx)("div",{className:"border-t border-slate-300 pt-2 text-xs uppercase tracking-widest text-slate-400",children:V.authorizedSignature})]})]})]}),(0,a.jsx)("div",{className:"absolute bottom-0 left-0 w-full h-2 bg-[#1e293b]"})]})})}function $({divRef:e,scale:t}){let{reference:s,setReference:i,city:o,clientName:d,setClientName:c,clientAddress:p,setClientAddress:u,clientContact:m,setClientContact:b,clientPOBox:y,setClientPOBox:j,object:w,setObject:N,managerName:k,setManagerName:$,itemsArr:C,setItemsArr:P,currency:z}=(0,n.useInvoice)(),{language:q,dict:S}=(0,l.useLanguage)(),[V,D]=(0,r.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),F=e=>new Intl.NumberFormat("fr"===q?"fr-FR":"en-US",{style:"currency",currency:z||"XOF",minimumFractionDigits:2}).format(e),I=(0,r.useCallback)(()=>{""===V.designation&&0===V.quantity||(P([...C,{...V,id:x(),totalPrice:Number(V.quantity)*Number(V.unitPrice)}]),D({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[C,V,P]),M=(0,r.useMemo)(()=>C.reduce((e,t)=>e+Number(t.totalPrice??Number(t.quantity)*Number(t.unitPrice)),0),[C]),U=(0,r.useMemo)(()=>C.reduce((e,t)=>e+Number(t.quantity),0),[C]),B=(0,r.useCallback)((e,t,a)=>{P(C.map(s=>{if(""===s.designation&&0===s.quantity||s.id!==e)return s;let i={...s,designation:"designation"===t&&"string"==typeof a?a:s.designation,unit:"unit"===t&&"string"==typeof a?String(a):s.unit,quantity:"quantity"===t?Number(a):Number(s.quantity),unitPrice:"unitPrice"===t?Number(a):Number(s.unitPrice),totalPrice:0,id:s.id};return i.totalPrice=i.quantity*i.unitPrice,i}))},[C,P]),R=(0,r.useCallback)(e=>{P(C.filter(t=>t.id!==e))},[C,P]),A=()=>{switch(z){case"XOF":return(0,a.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"F CFA"});case"EUR":return(0,a.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"€"});case"USD":return(0,a.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"$US"});case"GBP":return(0,a.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"£GB"});default:return""}};return(0,a.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${t})`,transition:"transform 150ms ease"},children:(0,a.jsx)("div",{ref:e,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-zinc-900 relative shadow-xl font-sans ${t<.8?"scale-small":""}`,children:(0,a.jsxs)("div",{className:"p-12 h-full flex flex-col",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-16 select-none",children:[(0,a.jsx)("div",{className:"flex items-center gap-2",children:(0,a.jsx)("span",{className:"font-bold text-2xl tracking-tight uppercase",children:S.invoice})}),(0,a.jsxs)("div",{className:"flex items-center gap-4 text-sm font-medium text-zinc-500",children:[(0,a.jsxs)("div",{className:"px-3 py-1 bg-zinc-100 rounded-md flex items-center gap-1",children:[S.reference,":",(0,a.jsx)(g,{value:s,onValueChange:i,placeholder:"REF-XXXX",className:"bg-transparent text-zinc-900 w-24 p-0 h-auto border-none focus:ring-0 text-sm font-bold"})]}),(0,a.jsx)("div",{children:new Date().toLocaleDateString("fr"===q?"fr-FR":"en-US",{month:"short",day:"numeric",year:"numeric"})})]})]}),(0,a.jsxs)("div",{className:"bg-zinc-50 rounded-2xl p-8 mb-12 border border-zinc-100",children:[(0,a.jsxs)("div",{className:"flex gap-12",children:[(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block",children:S.from}),(0,a.jsx)("div",{className:"font-bold text-zinc-900 mb-1",children:"Company Inc."}),(0,a.jsxs)("div",{className:"text-sm text-zinc-500",children:["123 Tech Boulevard",(0,a.jsx)("br",{}),"San Francisco, CA",(0,a.jsx)("br",{}),(0,a.jsx)("span",{className:"inline-block mt-1",children:o})]})]}),(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block",children:S.billedTo}),(0,a.jsx)(g,{value:d,onValueChange:c,placeholder:S.client,className:"bg-transparent font-bold text-zinc-900 w-full mb-1 p-0 h-auto border-none focus:ring-0"}),(0,a.jsx)(g,{value:p,onValueChange:u,placeholder:S.address,className:"bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(g,{value:m,onValueChange:b,placeholder:S.contact,className:"bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"}),(0,a.jsx)(g,{value:y,onValueChange:j,placeholder:S.poBox,className:"bg-transparent text-sm text-zinc-500 w-24 p-0 h-auto border-none focus:ring-0"})]})]})]}),(0,a.jsxs)("div",{className:"mt-8 pt-6 border-t border-zinc-200",children:[(0,a.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block",children:S.projectDetails}),(0,a.jsx)(g,{value:w,onValueChange:N,placeholder:S.object,className:"bg-transparent text-zinc-700 w-full font-medium wrap-break-word whitespace-pre-wrap"})]})]}),(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider mb-4",children:[(0,a.jsx)("div",{className:"col-span-4",children:S.description}),(0,a.jsx)("div",{className:"col-span-1 text-center",children:S.unit}),(0,a.jsx)("div",{className:"col-span-1 text-center",children:S.qty}),(0,a.jsx)("div",{className:"col-span-3 text-right",children:S.unitPrice}),(0,a.jsx)("div",{className:"col-span-3 text-right",children:S.total})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[C.map(e=>(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 bg-white border border-zinc-100 rounded-lg items-center hover:border-zinc-300 transition-colors group relative",children:[(0,a.jsxs)("div",{className:"col-span-4 font-medium text-zinc-800",children:[(0,a.jsx)(g,{value:e.designation,onValueChange:t=>B(e.id,"designation",t),className:"w-full bg-transparent wrap-break-word whitespace-pre-wrap"}),(0,a.jsx)("button",{onClick:()=>R(e.id),className:"absolute -left-3 top-1/2 -translate-y-1/2 text-white p-1 cursor-pointer z-50 bg-red-500 rounded-md shadow-sm hover:bg-red-600 transition-colors",children:(0,a.jsx)(v.Trash2,{className:"w-3 h-3"})})]}),(0,a.jsx)("div",{className:"col-span-1",children:(0,a.jsx)(g,{value:e.unit,onValueChange:t=>B(e.id,"unit",t),className:"w-full text-center text-zinc-500 bg-transparent text-sm"})}),(0,a.jsx)("div",{className:"col-span-1",children:(0,a.jsx)(g,{value:e.quantity,onValueChange:t=>B(e.id,"quantity",Number(t)),className:"w-full text-center font-mono bg-zinc-50 rounded text-zinc-700 text-sm py-1"})}),(0,a.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden",children:[(0,a.jsx)(g,{value:e.unitPrice,onValueChange:t=>B(e.id,"unitPrice",Number(t)),className:"w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"}),A()]}),(0,a.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-bold text-zinc-900 overflow-hidden",children:[(0,a.jsx)("span",{className:"text-sm",children:F(e.totalPrice).replace(/\s?[A-Z$€£]{1,3}$/,"")}),A()]})]},e.id)),(0,a.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 border border-dashed border-zinc-200 rounded-lg items-center hover:bg-zinc-50 transition-colors cursor-text",children:[(0,a.jsxs)("div",{className:"col-span-4 flex items-center gap-2",children:[(0,a.jsx)(h.Button,{className:"w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-400 cursor-pointer",onClick:I,children:(0,a.jsx)(f.Plus,{className:"w-3 h-3"})}),(0,a.jsx)(g,{value:V.designation,onValueChange:e=>D({...V,designation:e}),placeholder:S.add,className:"w-full bg-transparent text-sm text-zinc-500"})]}),(0,a.jsx)("div",{className:"col-span-1",children:(0,a.jsx)(g,{value:V.unit,onValueChange:e=>D({...V,unit:e}),className:"w-full text-center bg-transparent text-sm text-zinc-400"})}),(0,a.jsx)("div",{className:"col-span-1 text-center",children:(0,a.jsx)(g,{value:V.quantity,onValueChange:e=>D({...V,quantity:Number(e),totalPrice:Number(e)*V.unitPrice}),className:"w-full text-center bg-transparent text-sm text-zinc-400"})}),(0,a.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden",children:[(0,a.jsx)(g,{value:V.unitPrice,onValueChange:e=>D({...V,unitPrice:Number(e),totalPrice:V.quantity*Number(e)}),className:"w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"}),A()]}),(0,a.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-400 overflow-hidden",children:[(0,a.jsx)("span",{className:"text-sm",children:F(V.totalPrice).replace(/\s?[A-Z$€£]{1,3}$/,"")}),A()]})]})]})]}),(0,a.jsx)("div",{className:"border-t border-zinc-100 pt-8 mt-8",children:(0,a.jsxs)("div",{className:"flex justify-between items-end",children:[(0,a.jsxs)("div",{className:"w-1/2",children:[(0,a.jsx)("div",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",children:S.authorizedSignature}),(0,a.jsx)(g,{value:k,onValueChange:$,placeholder:S.managerName,className:"bg-transparent text-xl font-handwriting text-zinc-800 w-full border-b border-zinc-200 pb-2"})]}),(0,a.jsxs)("div",{className:"w-2/3",children:[(0,a.jsxs)("div",{className:"flex justify-between mb-3 text-sm text-zinc-500",children:[(0,a.jsx)("span",{children:S.subtotal}),(0,a.jsx)("span",{className:"font-mono",children:F(M)})]}),(0,a.jsxs)("div",{className:"flex justify-between mb-3 text-sm text-zinc-500",children:[(0,a.jsx)("span",{children:S.totalMaterial}),(0,a.jsx)("span",{children:U})]}),(0,a.jsxs)("div",{className:"flex justify-between pt-4 border-t border-zinc-200 text-lg font-bold text-zinc-900 gap-4",children:[(0,a.jsx)("span",{className:"whitespace-nowrap",children:S.totalDue}),(0,a.jsx)("span",{className:"font-mono break-all text-right",children:F(M)})]})]})]})})]})})})}var C=e.i(47163),P=e.i(43531);let z=[{id:"default",name:"Default",color:"bg-white",border:"border-gray-200"},{id:"style1",name:"Modern",color:"bg-slate-800",border:"border-slate-600"},{id:"style2",name:"Corporate",color:"bg-blue-900",border:"border-blue-700"},{id:"style3",name:"Creative",color:"bg-purple-600",border:"border-purple-400"},{id:"style4",name:"Classic",color:"bg-[#fdfbf7]",border:"border-gray-400"},{id:"style5",name:"Tech",color:"bg-zinc-950",border:"border-green-500"}];function q({divRef:e}){let{style:t,setStyle:s}=(0,n.useInvoice)(),[i,l]=(0,r.useState)(1.1),o=(0,r.useCallback)(()=>l(e=>Math.min(1.5,+(e+.1).toFixed(2))),[]),d=(0,r.useCallback)(()=>l(e=>Math.max(.5,+(e-.1).toFixed(2))),[]);return(0,r.useEffect)(()=>{let e=e=>{let t="+"===e.key||"="===e.key||"NumpadAdd"===e.code,a="-"===e.key||"NumpadSubtract"===e.code;(e.ctrlKey||e.metaKey)&&t?(e.preventDefault(),o()):(e.ctrlKey||e.metaKey)&&a&&(e.preventDefault(),d())};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[o,d]),(0,a.jsx)("div",{className:"w-full gap-8",children:(0,a.jsx)("div",{className:"canvas-viewer p-4 flex flex-col items-center w-full",children:(()=>{switch(t){case"style1":return(0,a.jsx)(y,{divRef:e,scale:i});case"style2":return(0,a.jsx)(j,{divRef:e,scale:i});case"style3":return(0,a.jsx)(N,{divRef:e,scale:i});case"style4":return(0,a.jsx)(k,{divRef:e,scale:i});case"style5":return(0,a.jsx)($,{divRef:e,scale:i});default:return(0,a.jsx)(b,{divRef:e,scale:i})}})()})})}let S=()=>{let{style:e,setStyle:t}=(0,n.useInvoice)();return(0,a.jsx)("div",{className:"w-full max-w-[700px] px-3",children:(0,a.jsx)("div",{className:"bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex gap-6 overflow-x-auto justify-center",children:z.map(s=>(0,a.jsxs)("button",{id:"Invoice_Choice_btn",onClick:()=>t(s.id),className:(0,C.cn)("relative w-20 h-28 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-end overflow-hidden group shadow-sm hover:shadow-md cursor-pointer",e===s.id?"border-primary rounded-xl! ring-2 ring-primary/30 scale-105 shadow-xl":"border-transparent hover:border-gray-200 hover:scale-105 opacity-80 hover:opacity-100"),children:[(0,a.jsxs)("div",{className:(0,C.cn)("absolute inset-0 w-full h-full",s.color),children:[(0,a.jsx)("div",{className:"absolute top-4 left-4 right-4 h-2 bg-current opacity-20 rounded-full"}),(0,a.jsx)("div",{className:"absolute top-8 left-4 w-1/3 h-2 bg-current opacity-20 rounded-full"}),(0,a.jsx)("div",{className:"absolute top-16 left-4 right-4 bottom-12 bg-white/10 rounded-lg border border-white/5"})]}),(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center z-10 opacity-0 transition-opacity duration-300",style:{opacity:+(e===s.id)},children:(0,a.jsx)("div",{className:"bg-primary text-white rounded-full p-2 shadow-lg scale-0 animate-in zoom-in duration-300",children:(0,a.jsx)(P.Check,{className:"w-5 h-5"})})}),(0,a.jsx)("div",{className:"relative z-20 w-full bg-white/95 backdrop-blur-sm py-2 text-center border-t border-gray-100",children:(0,a.jsx)("span",{className:(0,C.cn)("text-[10px] font-bold uppercase tracking-wider",e===s.id?"text-primary":"text-gray-500"),children:s.name})})]},s.id))})})};var V=e.i(5766),D=e.i(40160),F=e.i(31278),I=e.i(78583),M=e.i(56909),U=e.i(39312),B=e.i(37727);let R=(0,p.default)("settings-2",[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);var A=e.i(63488),T=e.i(14764),O=e.i(41416),L=e.i(93479),E=e.i(55436),_=e.i(61911),X=e.i(88844),Y=e.i(63059),H=e.i(83086);function K(){let{setClientName:e,setClientAddress:t,setClientContact:s,setClientPOBox:i,itemsArr:o,setItemsArr:d,setClientId:c}=(0,n.useInvoice)(),{t:p}=(0,l.useLanguage)(),[u,m]=(0,r.useState)(!1),[g,b]=(0,r.useState)("clients"),[v,y]=(0,r.useState)(""),[j,w]=(0,r.useState)([]),[N,k]=(0,r.useState)([]),[$,C]=(0,r.useState)(!1);(0,r.useEffect)(()=>{u&&(async()=>{C(!0);try{let e=localStorage.getItem("user");if(!e)return;let t=JSON.parse(e);if(window.electronAPI){let e=await window.electronAPI.getData("clients"===g?"clients":"products");e.success&&("clients"===g?w(e.data):k(e.data))}else{let e=await fetch("clients"===g?"/api/clients":"/api/products",{headers:{Authorization:`Bearer ${t.token}`}});if(e.ok){let t=await e.json();"clients"===g?w(t):k(t)}}}catch(e){console.error("Failed to fetch autofill data",e)}finally{C(!1)}})()},[u,g]);let P=j.filter(e=>{let t=v.toLowerCase();return`${e.firstName||""} ${e.name||""}`.toLowerCase().includes(t)||e.companyName&&e.companyName.toLowerCase().includes(t)||e.email&&e.email.toLowerCase().includes(t)||e.phone&&e.phone.toLowerCase().includes(t)}),z=N.filter(e=>e.name.toLowerCase().includes(v.toLowerCase()));return u?(0,a.jsxs)("div",{className:"fixed right-6 top-32 z-50 w-80 bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] animate-in slide-in-from-right-8 duration-300",children:[(0,a.jsxs)("div",{className:"bg-indigo-600 p-4 text-white flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2 font-bold",children:[(0,a.jsx)(H.Sparkles,{className:"w-4 h-4 text-amber-300"}),(0,a.jsx)("span",{children:p("quickAssistantShort")})]}),(0,a.jsx)(h.Button,{variant:"ghost",size:"icon",className:"h-6 w-6 text-white hover:bg-white/20 rounded-full",onClick:()=>m(!1),children:(0,a.jsx)(B.X,{className:"w-4 h-4"})})]}),(0,a.jsxs)("div",{className:"flex border-b border-border/50 bg-muted/20",children:[(0,a.jsxs)("button",{className:`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${"clients"===g?"border-indigo-600 text-indigo-600":"border-transparent text-muted-foreground hover:bg-muted/50"}`,onClick:()=>{b("clients"),y("")},children:[(0,a.jsx)(_.Users,{className:"w-4 h-4"})," ",p("clients")]}),(0,a.jsxs)("button",{className:`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${"products"===g?"border-indigo-600 text-indigo-600":"border-transparent text-muted-foreground hover:bg-muted/50"}`,onClick:()=>{b("products"),y("")},children:[(0,a.jsx)(X.Package,{className:"w-4 h-4"})," ",p("catalog")]})]}),(0,a.jsx)("div",{className:"p-3 border-b border-border/50 bg-background/50",children:(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(E.Search,{className:"absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),(0,a.jsx)(L.Input,{autoFocus:!0,placeholder:p("searchQuickAssistant").replace("{type}","clients"===g?p("client"):p("article")),value:v,onChange:e=>y(e.target.value),className:"pl-9 bg-background h-9 text-sm rounded-xl"})]})}),(0,a.jsx)("div",{className:"flex-1 overflow-y-auto p-2 space-y-2 bg-muted/10",children:$?(0,a.jsx)("div",{className:"flex flex-col gap-2 p-2",children:[1,2,3,4].map(e=>(0,a.jsx)("div",{className:"h-12 bg-muted rounded-lg animate-pulse"},e))}):"clients"===g?P.length>0?P.map(l=>(0,a.jsxs)("button",{onClick:()=>{e(`${l.firstName?l.firstName+" ":""}${l.name}${l.companyName?` - ${l.companyName}`:""}`),t(l.address||""),s(l.phone||l.email||""),i(""),c(l.id),m(!1)},className:"w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-bold text-sm text-foreground group-hover:text-indigo-900 break-words mb-0.5",children:`${l.firstName?l.firstName+" ":""}${l.name}${l.companyName?` (${l.companyName})`:""}`}),(0,a.jsx)("p",{className:"text-xs text-muted-foreground truncate max-w-[200px]",children:l.email||l.phone||p("noContact")})]}),(0,a.jsx)(Y.ChevronRight,{className:"w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"})]},l.id)):(0,a.jsx)("div",{className:"p-8 text-center text-xs text-muted-foreground",children:p("noClientFound")}):z.length>0?z.map(e=>(0,a.jsxs)("button",{onClick:()=>{d([...o,{id:x(),designation:e.name,unit:"service"===e.type?p("servicePrestation"):p("unitPriceShort"),quantity:1,unitPrice:e.price,totalPrice:+e.price}]),m(!1)},className:"w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"pr-2",children:[(0,a.jsx)("p",{className:"font-bold text-sm text-foreground group-hover:text-indigo-900 line-clamp-1",children:e.name}),(0,a.jsxs)("p",{className:"text-xs font-mono text-indigo-600 font-bold mt-0.5",children:[e.price.toLocaleString()," XOF"]})]}),(0,a.jsx)("div",{className:"shrink-0 bg-indigo-100 text-indigo-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",children:(0,a.jsx)(f.Plus,{className:"w-3.5 h-3.5"})})]},e.id)):(0,a.jsx)("div",{className:"p-8 text-center text-xs text-muted-foreground",children:p("noItemFound")})})]}):(0,a.jsx)(h.Button,{onClick:()=>m(!0),className:"fixed right-6 top-32 z-50 rounded-full size-12 shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-0 border-2 border-indigo-400/30 transition-all hover:scale-110",title:p("quickAssistant"),children:(0,a.jsx)(H.Sparkles,{className:"w-6 h-6 text-amber-300"})})}var Z=e.i(37822),G=e.i(10204),J=e.i(71902),Q=e.i(69253);let W=(e,t="XOF",a="fr")=>new Intl.NumberFormat("fr"===a?"fr-FR":"en-US",{style:"currency",currency:t,minimumFractionDigits:2}).format(e),ee=e=>({totalht:e.reduce((e,t)=>e+(t.totalPrice||t.quantity*t.unitPrice),0),totalmaterial:e.reduce((e,t)=>e+Number(t.quantity),0)});function et({initialData:e,invoiceId:t}){let[s,i]=(0,r.useState)(!1),o=(0,r.useRef)(null),{performAction:d,loading:c}=(0,J.useIPCAction)(),{t:x,language:p}=(0,l.useLanguage)(),{itemsArr:u,city:m,clientName:g,clientAddress:b,clientContact:f,clientPOBox:v,reference:y,object:j,managerName:w,amountWords:N,style:k,currency:$,setInvoiceData:P,clientId:z,totalMaterial:L,totalHT:E}=(0,n.useInvoice)(),[_,X]=(0,r.useState)(e?.type||"invoice"),[Y,H]=(0,r.useState)(e?.status||"draft"),[et,ea]=(0,r.useState)(e?.dueDate?new Date(e.dueDate).toISOString().split("T")[0]:""),[es,ei]=(0,r.useState)(e?.isRecurring||!1),[el,er]=(0,r.useState)(e?.recurrenceFreq||"monthly"),[en,eo]=(0,r.useState)(!1),[ed,ec]=(0,r.useState)(""),[ex,ep]=(0,r.useState)(!1),[eu,em]=(0,r.useState)([]),[eh,eg]=(0,r.useState)(!1),{addNotification:eb}=(0,O.useNotifications)();(0,r.useEffect)(()=>{e&&P(e)},[e,P]),(0,r.useEffect)(()=>{en&&(async()=>{eg(!0);try{if(window.electronAPI){let e=await window.electronAPI.getData("clients");e.success&&em(e.data)}}catch(e){console.error("Failed to fetch clients",e)}finally{eg(!1)}})()},[en]);let ef=async()=>{if(!y||!g||0===u.length)return void V.default.error(x("fillFields"));i(!0);try{await ev();let e={reference:y,city:m,clientName:g,clientAddress:b,clientContact:f,clientPOBox:v,object:j,items:u,totalHT:u.reduce((e,t)=>e+(t.totalPrice||t.quantity*t.unitPrice),0),totalMaterial:u.reduce((e,t)=>e+Number(t.quantity),0),managerName:w,amountWords:N,style:k,type:_,currencyCode:$,language:p},t=function(e){let{style:t}=e,a=e.language||"fr",s=Q.translations[a]||Q.translations.fr;switch(t){case"style1":return function(e,t,a){let{totalht:s,totalmaterial:i}=ee(e.items),l=Math.max(1,Math.ceil(e.items.length/11)),r=Array.from({length:l}).map((r,n)=>{let o=e.items.slice(11*n,(n+1)*11),d=n===l-1;return`
    <div class="page ${n>0?"page-break":""}">
      ${0===n?`
      <div class="header">
          <div class="logo-section">
              <h1>${"quote"===e.type?t.proforma:t.invoice}</h1>
              <div class="ref-row"><span class="label">${t.reference}:</span> <span class="value">${e.reference}</span></div>
          </div>
          <div class="date-section">
              <div class="city">${e.city}</div>
              <div class="date">${new Date().toLocaleDateString("fr"===a?"fr-FR":"en-US")}</div>
          </div>
      </div>

      <div class="info-grid">
          <div class="col">
              <h3>${t.billedTo}</h3>
              <div class="client-name">${e.clientName}</div>
              <div class="client-detail">${e.clientAddress||""}</div>
              <div class="client-detail">
                  ${e.clientContact||""}
                  ${e.clientPOBox?` - ${t.poBox} ${e.clientPOBox}`:""}
              </div>
          </div>
          <div class="col">
              <h3>${t.projectDetails}</h3>
              <div class="project-box">
                  <div class="label">${t.object}</div>
                  <div class="object">${e.object}</div>
              </div>
          </div>
      </div>`:'<div style="height: 50px;"></div>'}

      <table>
          <thead>
              <tr>
                  <th style="text-align:left; width: 40%">${t.description}</th>
                  <th style="text-align:center">${t.unit}</th>
                  <th style="text-align:center">${t.qty}</th>
                  <th style="text-align:right">${t.unitPrice}</th>
                  <th style="text-align:right">${t.totalPrice}</th>
              </tr>
          </thead>
          <tbody>
            ${o.map((t,s)=>`
            <tr class="${s%2==0?"":"bg-gray"}">
              <td style="text-align:left; word-break: break-word; max-width: 300px;">${t.designation}</td>
              <td style="text-align:center">${t.unit}</td>
              <td style="text-align:center">${t.quantity}</td>
              <td style="text-align:right; white-space: nowrap;">${W(t.unitPrice,e.currencyCode,a)}</td>
              <td style="text-align:right; font-weight:bold; white-space: nowrap;">${W(t.totalPrice||t.quantity*t.unitPrice,e.currencyCode,a)}</td>
            </tr>`).join("")}
          </tbody>
      </table>

      ${d?`
      <div class="footer-totals">
            <div class="footer-bottom">
                <div class="signature-area">
                    <div class="sig-label">${t.authorizedSignature}</div>
                    <div class="sig-name">${e.managerName}</div>
                </div>
                <div class="totals-section">
                    <div class="total-row subt">
                        <span>${t.totalMaterial}</span>
                        <span>${i}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${t.total}</span>
                        <span class="grand-val">${W(s,e.currencyCode,a)}</span>
                    </div>
                </div>
            </div>
      </div>`:""}

      <div class="page-num">${n+1} / ${l}</div>
    </div>`}).join("");return`
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
    body { margin: 0; background: #eee; font-family: 'Inter', sans-serif; color: #334155; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 0; position: relative; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .page-break { page-break-before: always; }
    .header { background: #0f172a; color: white; padding: 48px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section h1 { margin: 0; font-weight: 300; font-size: 36px; letter-spacing: 0.05em; margin-bottom: 8px;}
    .ref-row { color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
    .ref-row .value { color: white; border-bottom: 1px solid #334155; padding-bottom: 2px; }
    .date-section { text-align: right; }
    .city { border-bottom: 1px solid #334155; padding-bottom: 2px; color: white; margin-bottom: 4px; display: inline-block; min-width: 100px; text-align: right;}
    .date { color: #94a3b8; font-size: 14px; }

    .info-grid { display: flex; padding: 48px; gap: 48px; }
    .col { flex: 1; }
    h3 { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 16px; text-transform: uppercase; }
    .client-name { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px; line-height: 1.2; }
    .client-detail { font-size: 14px; color: #475569; margin-bottom: 4px; }

    .project-box { background: #f8fafc; padding: 24px; border-radius: 8px; }
    .project-box .label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
    .object { font-size: 16px; font-weight: 500; color: #1e293b; }

    table { width: 100%; padding: 0 48px; border-collapse: separate; border-spacing: 0; }
    th { color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 10px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 16px 10px; font-size: 14px; color: #334155; border-bottom: 1px solid #f8fafc; }
    .bg-gray { background-color: #f8fafc; }

    .footer-totals { padding: 48px 0; margin-top: 16px; }
    .footer-bottom { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 48px; gap: 40px; }
    .signature-area { flex: 1; text-align: left; }
    .sig-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; }
    .sig-name { font-family: 'Inter', cursive; font-size: 24px; font-style: italic; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; }

    .totals-section { min-width: 320px; max-width: 50%; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; gap: 20px; }
    .total-row.subt { color: #64748b; border-bottom: 1px solid #f1f5f9; }
    .total-row.grand { padding-top: 20px; color: #1e293b; font-size: 20px; font-weight: 700; border-bottom: 2px solid #1e293b; }
    .grand-val { font-size: 24px; word-break: break-all; text-align: right; }

    .page-num { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #cbd5e1; }
  </style>
  </head>
  <body>${r}</body>
  </html>`}(e,s,a);case"style2":return function(e,t,a){let{totalht:s,totalmaterial:i}=ee(e.items),l=Math.max(1,Math.ceil(e.items.length/14)),r=Array.from({length:l}).map((r,n)=>{let o=e.items.slice(14*n,(n+1)*14),d=n===l-1;return`<div class="page ${n>0?"page-break":""}">
       ${0===n?`
         <div class="header-band">
             <div class="logo-container">
                 <div class="logo-circle"></div>
             </div>
             <h2 class="company-name">COMPANY</h2>
         </div>
         <div class="header-main">
             <div class="left">
                 <h1 class="title">${"quote"===e.type?t.proforma:t.invoice}</h1>
                 <div class="meta"><span style="color:#64748b;">#</span> ${e.reference}</div>
             </div>
             <div class="right">
                 <div class="city-date">${e.city}</div>
                 <div class="date-sub">${new Date().toLocaleDateString("fr"===a?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
             </div>
         </div>
         <div class="info-block">
             <div class="info-col">
                 <h3>${t.billedTo}</h3>
                 <div class="client">${e.clientName}</div>
                 <div class="detail">${e.clientAddress||""}</div>
                 <div class="detail">
                    ${e.clientPOBox?`${t.poBox}: ${e.clientPOBox}`:""}
                    ${e.clientContact?`${t.contact}: ${e.clientContact}`:""}
                 </div>
             </div>
             <div class="info-col">
                 <h3>${t.description}</h3>
                 <div class="description-box">${e.object}</div>
             </div>
         </div>`:'<div style="height:40px"></div>'}

         <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left">${t.description}</th>
                        <th>${t.unit}</th>
                        <th>${t.qty}</th>
                        <th style="text-align:right">${t.unitPrice}</th>
                        <th style="text-align:right">${t.totalPrice}</th>
                    </tr>
                </thead>
                <tbody>
                    ${o.map((t,s)=>`
                    <tr class="${s%2==1?"bg-gray":""}">
                        <td style="text-align:left; word-break: break-word; max-width: 300px;">${t.designation}</td>
                        <td class="center">${t.unit}</td>
                        <td class="center">${t.quantity}</td>
                        <td style="text-align:right; white-space: nowrap;">${W(t.unitPrice,e.currencyCode,a)}</td>
                        <td style="text-align:right; font-weight:bold; color:#1e293b; white-space: nowrap;">${W(t.totalPrice||t.quantity*t.unitPrice,e.currencyCode,a)}</td>
                    </tr>`).join("")}
                </tbody>
            </table>
         </div>

         ${d?`
         <div class="summary">
             <div class="summary-box">
                 <div class="footer-layout">
                <div class="sig-area">
                    <div class="sig-label">${t.authorizedSignature}</div>
                    <div class="sig-name">${e.managerName}</div>
                </div>
                <div class="totals-area">
                    <div class="total-row subt"><span>${t.totalMaterial}</span> <span>${i}</span></div>
                    <div class="total-row subt"><span>${t.subtotal}</span> <span>${W(s,e.currencyCode,a)}</span></div>
                    <div class="total-row grand"><span>${t.totalDue}</span> <span>${W(s,e.currencyCode,a)}</span></div>
                </div>
            </div>
            <div class="footer-bar"></div>`:'<div class="footer-bar" style="position:absolute; bottom:0;"></div>'}
         <div class="page-num" style="position:absolute; bottom:20px; right:40px; font-size:10px; color:#9ca3af; z-index:20;">${n+1} / ${l}</div>
       </div>`}).join("");return`<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
    body { font-family: 'Merriweather', serif; background: #eee; color: #374151; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: white; padding: 0; position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }

    .header-band { position:absolute; top:0; left:0; bottom:0; width: 33%; background: #1e3a8a; color: white; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; z-index: 10; height: 200px; }
    .logo-container { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .logo-circle { width: 40px; height: 40px; background: white; border-radius: 50%; }
    .company-name { font-weight: 700; font-size: 20px; letter-spacing: 0.05em; margin: 0; }

    .header-main { margin-left: 33%; background: #f3f4f6; height: 200px; padding: 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { color: #1e3a8a; font-size: 48px; font-weight: 900; margin: 0; line-height: 1; margin-bottom: 8px; }
    .meta { font-size: 18px; color: #6b7280; display: flex; align-items: center; gap: 8px; }
    .right { text-align: right; }
    .city-date { font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 4px; }
    .date-sub { font-size: 14px; color: #6b7280; font-style: italic; }

    .info-block { display: flex; padding: 40px; gap: 48px; margin-top: 0px; }
    .info-col { flex: 1; }
    h3 { color: #1e3a8a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 16px; display: inline-block; }
    .client { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .detail { font-size: 14px; color: #4b5563; margin-bottom: 4px; }
    .description-box { background: #f9fafb; border-left: 4px solid #d1d5db; padding: 12px; font-style: italic; color: #4b5563; }

    .table-container { padding: 0 40px; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #1e3a8a; color: white; }
    th { padding: 12px 16px; font-size: 14px; font-weight: 600; text-align: center; }
    td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb; color: #374151; }
    .bg-gray { background: #f8fafc; }
    .center { text-align: center; }

    .summary { display: flex; justify-content: flex-end; padding: 40px; }
    .summary-box { background: #f3f4f6; padding: 0; width: 100%; border-radius: 8px; }
    .footer-layout { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px; gap: 40px; }
    .sig-area { flex: 1; }
    .sig-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 32px; font-weight: 700; }
    .sig-name { font-size: 20px; font-style: italic; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; display: inline-block; min-width: 200px; }

    .totals-area { min-width: 320px; max-width: 50%; background: #1e3a8a; color: #fff; padding: 32px; border-radius: 16px; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; gap: 20px; }
    .total-row.subt { color: #bfdbfe; }
    .total-row.grand { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-top: 16px; font-size: 18px; font-weight: 800; }
    .total-row.grand span:last-child { font-size: 24px; word-break: break-all; text-align: right; }

    .footer-bar { height: 16px; background: #1e3a8a; margin-top: 48px; }
    </style></head><body>${r}</body></html>`}(e,s,a);case"style3":return function(e,t,a){let{totalht:s,totalmaterial:i}=ee(e.items),l=new Date().toLocaleDateString("fr"===a?"fr-FR":"en-US"),r=Math.max(1,Math.ceil(e.items.length/6)),n=`
        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: #fb923c; opacity: 0.15; border-bottom-left-radius: 200px; z-index: 0;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: #a855f7; opacity: 0.15; border-top-right-radius: 200px; z-index: 0;"></div>
    `,o=Array.from({length:r}).map((o,d)=>{let c=e.items.slice(6*d,(d+1)*6),x=d===r-1;return`<div class="page ${d>0?"page-break":""}">
        ${n}
        <div class="content-wrapper">
            ${0===d?`
            <div class="header">
                <div>
                    <div class="brand">
                        <div class="hexagon"></div>
                        <span>CREATIVE</span>
                    </div>
                    <div class="sub-meta">
                        <span class="city">${e.city}</span>
                        <span class="date">${l}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <h1 class="main-title">${"quote"===e.type?t.proforma:t.invoice}</h1>
                    <div class="ref-badge"><span style="opacity:0.6;">#</span> ${e.reference}</div>
                </div>
            </div>

            <div class="client-box">
                <div class="billed-to">
                    <h3>${t.billedTo}</h3>
                    <div class="client-name">${e.clientName}</div>
                    <div class="client-addr">${e.clientAddress||""}</div>
                    <div class="client-addr">${e.clientContact||""}</div>
                    <div class="client-addr">${e.clientPOBox?`${t.poBox}: ${e.clientPOBox}`:""}</div>
                </div>
                <div class="project-desc">
                    <h3>${t.projectDetails}</h3>
                    <div class="desc-text">${e.object}</div>
                </div>
            </div>`:'<div style="height: 50px;"></div>'}

            <div class="grid-header">
                <div class="c-desc">${t.description}</div>
                <div class="c-unit">${t.unit}</div>
                <div class="c-qty">${t.qty}</div>
                <div class="c-total">${t.totalPrice}</div>
            </div>

            <div class="items-grid">
                ${c.map(s=>`
                <div class="item-card">
                    <div class="i-desc">
                        <div class="name">${s.designation}</div>
                        <div class="price-mini">${t.unitPrice}: ${W(s.unitPrice,e.currencyCode,a)}</div>
                    </div>
                    <div class="i-unit">${s.unit}</div>
                    <div class="i-qty"><span>${s.quantity}</span></div>
                    <div class="i-total">${W(s.totalPrice||s.quantity*s.unitPrice,e.currencyCode,a)}</div>
                </div>`).join("")}
            </div>

            ${x?`
            <div class="footer">
                <div class="summary-card">
                    <div class="sum-left">
                        <div class="label">${t.totalMaterial}</div>
                        <div class="val">${i}</div>
                    </div>
                    <div class="sum-right">
                         <div class="label">${t.totalDue}</div>
                         <div class="val-lg">${W(s,e.currencyCode,a)}</div>
                    </div>
                </div>
                <div class="signature-block">
                    <div class="sig">${e.managerName}</div>
                    <div class="label">${t.authorizedSignature}</div>
                </div>
            </div>`:""}
        </div>
        <div class="page-num" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); font-size:10px; color:#9ca3af; z-index:20;">${d+1} / ${r}</div>
        </div>`}).join("");return`<!DOCTYPE html><html><head><style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Caveat:wght@700&display=swap');
        body { margin: 0; background: #eee; font-family: 'Outfit', sans-serif; color: #1f2937; }
        .page { width: 794px; min-height: 1123px; margin: 0 auto; background: white; padding: 0; position: relative; box-sizing: border-box; overflow: hidden; }
        .page-break { page-break-before: always; }

        .content-wrapper { position: relative; z-index: 10; padding: 48px; }

        .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
        .brand { display: flex; align-items: center; gap: 8px; color: #7e22ce; font-weight: 800; font-size: 24px; letter-spacing: -0.05em; margin-bottom: 8px; }
        .hexagon { width: 32px; height: 32px; background: currentColor; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .sub-meta { color: #6b7280; font-size: 14px; }
        .city { border-bottom: 1px dashed #d1d5db; padding-bottom: 2px; margin-right: 8px; }
        .main-title { font-size: 55px; font-weight: 900; margin: 0; line-height: 1; background: linear-gradient(to right, #9333ea, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.9; }
        .ref-badge { font-size: 20px; font-weight: 700; color: #374151; margin-top: 4px; font-family: monospace; }

        .client-box { display: flex; gap: 32px; margin-bottom: 40px; margin-top: 150px;}
        .billed-to { flex: 1; background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; }
        .project-desc { flex: 1; padding-left: 24px; border-left: 4px solid #fdba74; display: flex; flex-direction: column; justify-content: center; }

        h3 { color: #a855f7; margin: 0 0 16px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .project-desc h3 { color: #fb923c; }

        .client-name { font-size: 24px; font-weight: 800; color: #1f2937; margin-bottom: 8px; }
        .client-addr { font-size: 14px; color: #4b5563; margin-bottom: 2px; }
        .desc-text { font-size: 18px; color: #374151; font-style: italic; line-height: 1.4; }

        .grid-header { display: flex; font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 16px; margin-bottom: 12px; }
        .c-desc { flex: 1; } .c-unit { width: 60px; text-align: center; } .c-qty { width: 60px; text-align: center; } .c-total { width: 240px; text-align: right; }

        .items-grid { display: flex; flex-direction: column; gap: 12px; }
        .item-card { display: flex; align-items: center; background: white; border: 1px solid #f3f4f6; padding: 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .i-desc { flex: 1; }
        .i-desc .name { font-weight: 700; color: #1f2937; font-size: 14px; margin-bottom: 2px; }
        .i-desc .price-mini { font-size: 12px; color: #9ca3af; }
        .i-unit { width: 60px; text-align: center; font-size: 14px; color: #6b7280; }
        .i-qty { width: 60px; text-align: center; }
        .i-qty span { display: inline-block; background: #faf5ff; color: #7e22ce; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 14px; }
        .i-total { width: auto; min-width: 240px; text-align: right; font-weight: 800; font-size: 14px; color: #1f2937; white-space: nowrap; font-variant-numeric: tabular-nums; }

        .footer { margin-top: 64px; display: flex; flex-direction: column; align-items: flex-end; }
        .summary-card { background: #1e293b; color: white; padding: 32px; border-radius: 24px; min-width: 60%; max-width: 90%; display: flex; justify-content: space-between; gap: 20px; box-shadow: 0 20px 40px -10px rgba(126, 34, 206, 0.3); position: relative; overflow: hidden; font-variant-numeric: tabular-nums; }
        .summary-card::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; }

        .label { font-size: 10px; font-weight: 700; opacity: 0.7; letter-spacing: 0.05em; margin-bottom: 4px; }
        .val { font-size: 20px; font-weight: 700; }
        .val-lg { font-size: 32px; font-weight: 800; color: #fb923c; word-break: break-all; }
        .sum-right { text-align: right; }

        .signature-block { margin-top: 48px; text-align: center; width: 100%; }
        .sig { font-family: 'Caveat', cursive; font-size: 32px; color: #7e22ce; margin-bottom: 8px; }
        .signature-block .label { color: #9ca3af; letter-spacing: 0.2em; }
    </style></head><body>${o}</body></html>`}(e,s,a);case"style4":return function(e,t,a){let{totalht:s,totalmaterial:i}=ee(e.items),l=Math.max(1,Math.ceil(e.items.length/11)),r=Array.from({length:l}).map((r,n)=>{let o=e.items.slice(11*n,(n+1)*11),d=n===l-1;return`<div class="page ${n>0?"page-break":""}">
            <div class="top-accent"></div>
            <div class="inner-content">
            ${0===n?`
            <div class="header">
                <div class="header-left">
                    <h1 class="main-title">${"quote"===e.type?t.proforma:t.invoice}</h1>
                    <div class="ref-row">
                        <span class="ref-label">${t.reference}:</span>
                        <span class="ref-value">${e.reference}</span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="company-name">Company Name</div>
                    <div class="city-date">
                        <span class="city">${e.city}</span>,
                        <span class="date">${new Date().toLocaleDateString("fr"===a?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})}</span>
                    </div>
                </div>
            </div>

            <div class="info-layout">
                <div class="billed-col">
                    <h3 class="sect-label">${t.billedTo}</h3>
                    <div class="client-name">${e.clientName}</div>
                    <div class="client-detail">${e.clientAddress||""}</div>
                    <div class="client-detail">${e.clientContact||""}</div>
                    <div class="client-detail">${e.clientPOBox?`${t.poBox} ${e.clientPOBox}`:""}</div>
                </div>
                <div class="project-col">
                    <h3 class="sect-label">${t.projectDetails}</h3>
                    <div class="object-box">${e.object}</div>
                </div>
            </div>`:'<div style="height:60px"></div>'}

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style="text-align:left">${t.description}</th>
                            <th style="width: 80px;">${t.unit}</th>
                            <th style="width: 80px;">${t.qty}</th>
                            <th style="width: 120px; text-align:right">${t.price}</th>
                            <th style="width: 140px; text-align:right">${t.total}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${o.map(t=>`
                        <tr>
                            <td style="text-align:left; font-weight: 500;">${t.designation}</td>
                            <td>${t.unit}</td>
                            <td>${t.quantity}</td>
                            <td style="text-align:right; color: #64748b;">${W(t.unitPrice,e.currencyCode,a)}</td>
                            <td style="text-align:right; font-weight: 600; color: #0f172a;">${W(t.totalPrice||t.quantity*t.unitPrice,e.currencyCode,a)}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>

            ${d?`
            <div class="footer-area">
                <div class="totals-section">
                    <div class="total-row subt">
                        <span class="label">${t.subtotal}</span>
                        <span class="value">${W(s,e.currencyCode,a)}</span>
                    </div>
                    <div class="total-row subt">
                        <span class="label">${t.totalMaterial}</span>
                        <span class="value">${i}</span>
                    </div>
                    <div class="total-row grand">
                        <span class="label">${t.total}</span>
                        <span class="value">${W(s,e.currencyCode,a)}</span>
                    </div>
                </div>

                <div class="signature-section">
                    <div class="sig-note">

                    </div>
                    <div class="sig-block">
                        <div class="sig-name">${e.managerName}</div>
                        <div class="sig-label">${t.authorizedSignature}</div>
                    </div>
                </div>
            </div>`:""}
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:60px; font-size:10px; color:#94a3b8;">${n+1} / ${l}</div>
            <div class="bottom-accent"></div>
        </div>`}).join("");return`<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background: #eee; color: #334155; margin: 0; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; }
    .page-break { page-break-before: always; }

    .top-accent { height: 8px; background: #1e293b; width: 100%; }
    .bottom-accent { position: absolute; bottom: 0; left: 0; height: 8px; background: #1e293b; width: 100%; }

    .inner-content { padding: 60px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
    .main-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 400; color: #1e293b; margin: 0 0 8px 0; letter-spacing: -0.02em; }
    .ref-row { font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; }
    .ref-value { color: #334155; margin-left: 4px; }

    .header-right { text-align: right; }
    .company-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #1e293b; margin-bottom: 4px; }
    .city-date { font-size: 14px; color: #64748b; }
    .city { color: #334155; font-weight: 500; }

    .info-layout { display: flex; gap: 48px; margin-bottom: 60px; }
    .billed-col { flex: 1; }
    .project-col { flex: 1; }

    .sect-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
    .client-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e293b; margin-bottom: 8px; }
    .client-detail { font-size: 14px; color: #64748b; margin-bottom: 2px; }

    .object-box { font-size: 15px; color: #475569; background: #f8fafc; padding: 16px; border-radius: 6px; line-height: 1.5; }

    .table-wrapper { margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1e293b; border-bottom: 2px solid #1e293b; text-align: center; }
    td { padding: 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569; }

    .footer-area { margin-top: 40px; }
    .totals-section { width: 320px; margin-left: auto; margin-bottom: 60px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-variant-numeric: tabular-nums; }
    .total-row.subt { color: #64748b; border-bottom: 1px solid #f1f5f9; }
    .total-row.grand { padding-top: 16px; border-bottom: 2px solid #1e293b; color: #1e293b; font-size: 20px; font-family: 'Playfair Display', serif; font-weight: 700; word-break: break-all; gap: 10px; }

    .signature-section { display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-note { font-size: 12px; color: #94a3b8; font-style: italic; max-width: 250px; }
    .sig-block { text-align: center; width: 200px; }
    .sig-name { font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px; }
    .sig-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
    </style></head><body>${r}</body></html>`}(e,s,a);case"style5":return function(e,t,a){let{totalht:s,totalmaterial:i}=ee(e.items),l=Math.max(1,Math.ceil(e.items.length/8)),r=Array.from({length:l}).map((r,n)=>{let o=e.items.slice(8*n,(n+1)*8),d=n===l-1;return`<div class="page ${n>0?"page-break":""}">
            <div class="content">
            ${0===n?`
            <div class="header">
                <div class="brand">
                    <div class="zap-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span class="brand-name">SaaS.bill</span>
                </div>
                <div class="meta-tags">
                    <div class="tag">
                        <span class="label">${t.reference}:</span>
                        <span class="val">${e.reference}</span>
                    </div>
                    <div class="date-tag">
                        ${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </div>
                </div>
            </div>

            <div class="main-info">
                <div class="info-grid">
                    <div class="info-card">
                        <label>${t.from}</label>
                        <div class="company">Company Inc.</div>
                        <div class="details">
                            123 Tech Boulevard<br>
                            San Francisco, CA<br>
                            ${e.city}
                        </div>
                    </div>
                    <div class="info-card">
                        <label>${t.billedTo}</label>
                        <div class="company">${e.clientName}</div>
                        <div class="details">
                            ${e.clientAddress||""}<br>
                            ${e.clientContact||""}<br>
                            ${e.clientPOBox?`${t.poBox} ${e.clientPOBox}`:""}
                        </div>
                    </div>
                </div>
                <div class="project-details">
                    <label>${t.projectDetails}</label>
                    <div class="project-text">${e.object}</div>
                </div>
            </div>`:'<div style="height:40px"></div>'}

            <div class="table-container">
                <div class="table-head">
                    <div class="col-desc">${t.description}</div>
                    <div class="col-unit">${t.unit}</div>
                    <div class="col-qty">${t.qty}</div>
                    <div class="col-price">${t.unitPrice}</div>
                    <div class="col-total">${t.total}</div>
                </div>
                <div class="table-body">
                    ${o.map(t=>`
                    <div class="table-row">
                        <div class="col-desc">
                            <div class="item-name">${t.designation}</div>
                        </div>
                        <div class="col-unit">${t.unit}</div>
                        <div class="col-qty">${t.quantity}</div>
                        <div class="col-price">${W(t.unitPrice,e.currencyCode,a)}</div>
                        <div class="col-total">${W(t.totalPrice||t.quantity*t.unitPrice,e.currencyCode,a)}</div>
                    </div>`).join("")}
                </div>
            </div>

            ${d?`
            <div class="footer">
                <div class="signature-block">
                    <label>${t.authorizedSignature}</label>
                    <div class="sig-name">${e.managerName}</div>
                </div>
                <div class="totals-block">
                    <div class="total-row">
                        <span>${t.subtotal}</span>
                        <span>${W(s,e.currencyCode,a)}</span>
                    </div>
                    <div class="total-row">
                    <span class="label">${t.totalMaterial}</span>
                    <span class="value">${i}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${t.totalDue}</span>
                        <span class="grand-val">${W(s,e.currencyCode,a)}</span>
                    </div>
                </div>
            </div>`:""}
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#a1a1aa;">${n+1} / ${l}</div>
        </div>`}).join("");return`<!DOCTYPE html><html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@600&display=swap');
    body { font-family: 'Inter', sans-serif; background: #f4f4f5; color: #18181b; margin: 0; }
    .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; position: relative; box-sizing: border-box; }
    .page-break { page-break-before: always; }

    .content { padding: 48px; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 64px; }
    .brand { display: flex; align-items: center; gap: 8px; }
    .zap-icon { width: 32px; height: 32px; background: #18181b; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 6px; }
    .brand-name { font-weight: 700; font-size: 18px; letter-spacing: -0.02em; }

    .meta-tags { display: flex; gap: 16px; align-items: center; font-size: 14px; font-weight: 500; color: #71717a; }
    .tag { background: #f4f4f5; padding: 4px 12px; border-radius: 6px; display: flex; gap: 4px; }
    .tag .val { color: #18181b; font-weight: 700; }

    .main-info { background: #fafafa; border-radius: 24px; padding: 32px; border: 1px solid #f4f4f5; margin-bottom: 48px; }
    .info-grid { display: flex; gap: 48px; padding-bottom: 24px; border-bottom: 1px solid #e4e4e7; margin-bottom: 24px; }
    .info-card { flex: 1; }
    label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; display: block; margin-bottom: 12px; }
    .company { font-weight: 700; color: #18181b; margin-bottom: 4px; }
    .details { font-size: 14px; color: #71717a; line-height: 1.5; }

    .project-text { font-size: 15px; font-weight: 500; color: #3f3f46; }

    .table-head { background: #18181b; color: #fff; border-radius: 8px; display: flex; padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
    .table-row { display: flex; align-items: center; padding: 12px 16px; border: 1px solid #f4f4f5; border-radius: 8px; margin-bottom: 8px; font-size: 14px; }

    .col-desc { flex: 1; }
    .col-unit { width: 50px; text-align: center; color: #71717a; }
    .col-qty { width: 50px; text-align: center; font-weight: 600; background: #f4f4f5; border-radius: 6px; padding: 4px 0; margin: 0 4px; }
    .col-price { width: 110px; text-align: right; font-weight: 500; color: #71717a; }
    .col-total { width: 130px; text-align: right; font-weight: 700; color: #18181b; }

    .item-name { font-weight: 500; color: #18181b; }

    .footer { margin-top: 32px; padding-top: 32px; border-top: 1px solid #f4f4f5; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature-block { width: 300px; }
    .sig-name { font-family: 'Dancing Script', cursive; font-size: 28px; color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; margin-bottom: 8px; }

    .totals-block { width: 400px; font-variant-numeric: tabular-nums; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; color: #71717a; margin-bottom: 12px; }
    .total-row.grand { border-top: 1px solid #e4e4e7; padding-top: 16px; margin-top: 16px; color: #18181b; font-weight: 700; font-size: 24px; }
    .grand-val { font-size: 32px; font-weight: 800; word-break: break-all; text-align: right; margin-left: 10px; }
    </style></head><body>${r}</body></html>`}(e,s,a);default:return function(e,t,a){let s=new Date().toLocaleDateString("fr"===a?"fr-FR":"en-US"),{totalht:i,totalmaterial:l}=ee(e.items),r=Math.max(1,Math.ceil(e.items.length/14)),n=Array.from({length:r}).map((n,o)=>{let d=e.items.slice(14*o,(o+1)*14),c=o===r-1,x=e.items.slice((o+1)*14).reduce((e,t)=>e+(t.totalPrice||t.quantity*t.unitPrice),0);return`
  <div class="page ${o>0?"page-break":""}">
    ${0===o?`
    <div class="proforma-line" style="margin-top: 140px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="font-size: 14px; font-weight: 500; color: #4b5563;">
          <span style="letter-spacing: 0.1em; color: #9ca3af; font-size: 10px;">REF:</span> ${e.reference}
        </div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: flex-end;">
        <div style="font-size: 16px; font-weight: 600;">${e.city}</div>
        <div style="font-size: 11px; font-weight: 500; color: #6b7280; border-top: 1px solid #e5e7eb; pt: 4px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
          ${t.date} ${s}
        </div>
      </div>
    </div>

    <div class="address-container">
      <div class="address-header">
        <div class="address-title">${t.billingAddress}</div>
        <div class="address-title">${t.deliveryAddress}</div>
      </div>
      <div class="client-info">
        <div style="margin-bottom: 12px; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${t.client} :</span> 
          <span style="font-size: 18px; font-weight: 800; color: #000;">${e.clientName}</span>
        </div>
        ${e.clientAddress?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${t.address} :</span> <span style="font-weight: 500;">${e.clientAddress}</span></div>`:""}
        <div style="display: flex; gap: 20px;">
          ${e.clientContact?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${t.contact} :</span> <span style="font-weight: 500;">${e.clientContact}</span></div>`:""}
          ${e.clientPOBox?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${t.poBox} :</span> <span style="font-weight: 500;">${e.clientPOBox}</span></div>`:""}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #e5e7eb; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${t.object} :</span> 
          <span style="font-weight: 600; color: #111827;">${e.object}</span>
        </div>
      </div>
    </div>`:""}

    <div style="${o>0?"padding: 20px 30px;":""}">
      <table>
        <thead>
          <tr>
            <th>${t.description}</th>
            <th>${t.unit}</th>
            <th>${t.qty}</th>
            <th>${t.unitPrice}</th>
            <th>${t.totalPrice}</th>
          </tr>
        </thead>
        <tbody>
          ${d.map(t=>`
          <tr>
            <td>${t.designation}</td>
            <td>${t.unit}</td>
            <td>${t.quantity}</td>
            <td>${W(t.unitPrice,e.currencyCode,a)}</td>
            <td>${W(t.totalPrice||t.quantity*t.unitPrice,e.currencyCode,a)}</td>
          </tr>`).join("")}
        </tbody>
      </table>

      ${c&&x>0?`<div style="margin-top:8px; text-align:right; font-weight:bold;">${t.amountRemaining} : ${W(x,e.currencyCode,a)}</div>`:""}

      ${c?`
      <table class="totals">
        <tr><td>${t.totalMaterial}</td><td>${l}</td></tr>
        <tr><td>${t.totalHT}</td><td>${W(i,e.currencyCode,a)}</td></tr>
      </table>
      <div class="signature">
        <h2>${t.manager}</h2><br><br>
        <h1>${e.managerName}</h1>
      </div>`:""}
    </div>
    <div class="pageNumber">${o+1} / ${r}</div>
  </div>`}).join("");return`
<!DOCTYPE html>
<html lang="${a}">
<head>
<meta charset="UTF-8" />
<style>
  body { margin: 0; padding: 0; background: #eee; font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 12px; color: #000; }
  .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 40px 30px; box-sizing: border-box; position: relative; }
  .page-break { page-break-before: always; }
  .pageNumber { position: absolute; bottom: 30px; right: 30px; font-size: 12px; font-weight: 500; color: #4b5563; }
  .proforma-line { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
  .address-container { border: 1px solid #000; background: #fff; }
  .address-header { display: flex; border-bottom: 1px solid #000; height: 35px; font-size: 14px; }
  .address-title { width: 50%; padding: 10px; font-weight: 800; border-right: 1px solid #000; text-transform: uppercase; letter-spacing: 0.1em; background: #f8fafc; color: #475569; }
  .address-title:last-child { border-right: none; }
  .client-info { padding: 20px; }
  .client-info p { margin-bottom: 10px; font-size: 16px; line-height: 1.5; color: #1e293b; }
  .client-info .label { color: #94a3b8; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th, td { border: 1px solid #000; padding: 10px 8px; font-size: 12px; }
  th { font-weight: bold; text-align: center; font-size: 15px; background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.02em; }
  .totals { width: 40%; margin-left: auto; margin-top: 10px; background-color: #eee; }
  .signature { margin-top: 30px; text-align: right; font-weight: bold; }
</style>
</head>
<body>${n}</body>
</html>`}(e,s,a)}}(e),a=await window.electronAPI.generatePDF(t),s=new Blob([a],{type:"application/pdf"}),i=URL.createObjectURL(s),l=document.createElement("a");l.href=i,l.download=`Invoice_${y.replace(/\//g,"-")}.pdf`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(i),V.default.success(x("pdfSuccess"))}catch(e){console.error("PDF generation error",e),V.default.error(e.message||"Erreur lors de la génération du PDF")}finally{i(!1)}},ev=async()=>{let e={reference:y||"",type:_,status:Y,city:m||"",clientName:g||"",clientAddress:b||"",clientContact:f||"",clientPOBox:v||"",object:j||"",managerName:w||"",totalHT:u.reduce((e,t)=>e+(t.totalPrice||t.quantity*t.unitPrice),0),totalMaterial:u.reduce((e,t)=>e+Number(t.quantity),0),amountWords:N||"",items:u||[],currencyCode:$,style:k||"default",dueDate:et?new Date(et).toISOString():null,isRecurring:es,recurrenceFreq:es?el:null,clientId:z||null};if(!e.reference||!e.clientName||0===e.items.length)return void V.default.error(x("fillFields"));let a=t?[t,e]:[e];(await d("invoices",t?"update":"create",...a)).success&&(V.default.success(t?x("updateSuccess"):x("saveSuccess")),eb({user:"Système",action:t?"a modifié":"a créé",target:`la facture ${e.reference}`,type:"invoice",silent:!0}))},ey=async()=>{if(!ed)return void V.default.error(x("invalidEmail"));if(!t){V.default.error(x("saveFirst")),eo(!1);return}ep(!0);let e=t?[t,ed]:[ed];(await d("invoices","send",...e)).success&&(V.default.success(x("emailSentSuccess")),eo(!1),ec(""),H("pending"),setTimeout(ev,100)),ep(!1)};return(0,a.jsxs)("div",{className:"min-h-screen min-w-full bg-background pt-20 text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden flex flex-col items-center p-6 md:p-10 lg:p-12 pb-32",children:[(0,a.jsxs)("div",{className:"fixed inset-0 z-0 pointer-events-none overflow-hidden",children:[(0,a.jsx)("div",{className:"absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse"}),(0,a.jsx)("div",{className:"absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"}),(0,a.jsx)("div",{className:"absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-bounce-slow"}),(0,a.jsx)("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"})]}),(0,a.jsxs)("div",{className:"relative z-10 w-full max-w-8xl px- mb-16 flex justify-between items-center animate-fade-in-up",children:[(0,a.jsxs)("div",{className:"flex items-center gap-8",children:[(0,a.jsx)("div",{className:"p-5 bg-card/40 backdrop-blur-2xl rounded-lg border border-border/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-all duration-500",children:(0,a.jsx)(I.FileText,{className:"w-10 h-10 text-primary group-hover:scale-110 transition-transform"})}),(0,a.jsxs)("div",{className:"space-y-1.5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)("div",{className:"h-1 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"}),(0,a.jsx)("span",{className:"text-primary font-black text-[11px] uppercase tracking-[0.4em]",children:"Flow Engine v2"})]}),(0,a.jsx)("h1",{className:"text-5xl font-bold text-foreground tracking-tighter bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent",children:x("invoiceEditor")})]})]}),(0,a.jsx)("div",{className:"hidden lg:flex items-center gap-4",children:(0,a.jsxs)("div",{className:"px-6 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group hover:border-white/20 transition-all",children:[(0,a.jsx)("div",{className:"size-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"}),(0,a.jsxs)("div",{className:"flex flex-col",children:[(0,a.jsx)("span",{className:"text-[10px] font-black text-white/40 uppercase tracking-widest leading-none",children:"Status"}),(0,a.jsx)("span",{className:"text-xs font-bold text-white tracking-tight",children:x("systemReady")})]})]})})]}),(0,a.jsx)(K,{}),(0,a.jsx)("div",{className:"w-full max-w-[1300px] px-8 mb-6 flex justify-end animate-fade-in-up",children:(0,a.jsxs)(Z.Popover,{children:[(0,a.jsx)(Z.PopoverTrigger,{asChild:!0,children:(0,a.jsxs)(h.Button,{variant:"outline",className:"gap-2 font-bold backdrop-blur-xl border-border/50 shadow-lg",children:[(0,a.jsx)(R,{className:"w-4 h-4"}),x("documentSettings")]})}),(0,a.jsxs)(Z.PopoverContent,{className:"w-80 p-4 space-y-4 bg-card/95 backdrop-blur-2xl border-border/50 text-foreground mr-8",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)("h4",{className:"font-bold",children:x("documentType")}),(0,a.jsxs)("div",{className:"flex bg-muted rounded-lg p-1",children:[(0,a.jsx)("button",{onClick:()=>X("invoice"),className:(0,C.cn)("flex-1 text-xs py-1.5 rounded-md font-bold transition-all","invoice"===_?"bg-background shadow text-foreground":"text-muted-foreground"),children:x("invoice")}),(0,a.jsx)("button",{onClick:()=>X("quote"),className:(0,C.cn)("flex-1 text-xs py-1.5 rounded-md font-bold transition-all","quote"===_?"bg-background shadow text-foreground":"text-muted-foreground"),children:x("quote")})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)("h4",{className:"font-bold",children:x("statut")}),(0,a.jsxs)("select",{value:Y,onChange:e=>H(e.target.value),className:"w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",children:[(0,a.jsx)("option",{value:"draft",children:x("draft")}),(0,a.jsx)("option",{value:"pending",children:x("sent")}),(0,a.jsx)("option",{value:"paid",children:x("paid")})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(G.Label,{className:"font-bold",children:x("dueDate")}),(0,a.jsx)("input",{type:"date",value:et,onChange:e=>ea(e.target.value),className:"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"})]}),(0,a.jsxs)("div",{className:"space-y-3 pt-3 border-t border-border/50",children:[(0,a.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,a.jsx)("input",{type:"checkbox",checked:es,onChange:e=>ei(e.target.checked),className:"rounded text-primary focus:ring-primary w-4 h-4"}),(0,a.jsx)("span",{className:"text-sm font-bold",children:x("recurringInvoice")})]}),es&&(0,a.jsx)("div",{className:"pl-6 animate-in slide-in-from-left-2 duration-300",children:(0,a.jsxs)("select",{value:el,onChange:e=>er(e.target.value),className:"w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",children:[(0,a.jsx)("option",{value:"weekly",children:x("weekly")}),(0,a.jsx)("option",{value:"monthly",children:x("monthly")}),(0,a.jsx)("option",{value:"yearly",children:x("yearly")})]})})]})]})]})}),(0,a.jsx)(S,{}),(0,a.jsx)("div",{className:"relative z-10 flex-1 w-full max-w-[1300px] mt-5 flex justify-center animate-fade-in-up delay-100 px-8",children:(0,a.jsxs)("div",{className:"relative w-full group/canvas",children:[(0,a.jsx)("div",{className:"absolute -inset-10 bg-linear-to-tr from-primary/15 via-transparent to-secondary/15 rounded-lg blur-[80px] opacity-40 group-hover/canvas:opacity-70 transition duration-1000 pointer-events-none"}),(0,a.jsx)("div",{className:"relative bg-card/30 border border-border/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-lg overflow-hidden backdrop-blur-3xl p-1",children:(0,a.jsx)("div",{className:"bg-background/80 rounded-lg overflow-hidden",children:(0,a.jsx)(q,{divRef:o})})})]})}),(0,a.jsx)("div",{className:"fab-container",children:(0,a.jsxs)("div",{className:"relative flex items-center justify-center",children:[(0,a.jsx)("div",{className:"fab-item fab-item-left",children:(0,a.jsx)(h.Button,{onClick:ev,disabled:s,className:(0,C.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",s&&"opacity-50"),title:x("save"),children:(0,a.jsx)(M.Save,{className:"h-7 w-7"})})}),(0,a.jsx)("div",{className:"fab-item fab-item-up",children:(0,a.jsx)(h.Button,{onClick:ef,disabled:s,className:(0,C.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",s&&"opacity-50"),title:x("download"),children:(0,a.jsx)(D.Download,{className:"h-7 w-7"})})}),(0,a.jsx)("div",{className:"fab-item fab-item-center",children:(0,a.jsx)(h.Button,{onClick:()=>{t?eo(!0):V.default.error(x("saveFirst"))},disabled:s,className:(0,C.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground cursor-pointer ",s&&"opacity-50"),title:x("sendInvoiceEmail"),children:(0,a.jsx)(A.Mail,{className:"h-6 w-6"})})}),(0,a.jsxs)("div",{className:"relative z-10",children:[(0,a.jsx)("div",{className:"fab-glow"}),(0,a.jsx)(h.Button,{disabled:s,className:(0,C.cn)("h-18 w-18 rounded-lg bg-primary flex items-center justify-center fab-main-btn cursor-pointer",s&&"opacity-80 scale-95"),children:s?(0,a.jsx)(F.Loader2,{className:"h-8 w-8 animate-spin"}):(0,a.jsxs)("div",{className:"relative h-8 w-8",children:[(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0",children:(0,a.jsx)(U.Zap,{className:"h-8 w-8 fill-white"})}),(0,a.jsx)("div",{className:"absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rotate-0 group-hover:-rotate-90",children:(0,a.jsx)(B.X,{className:"h-8 w-8"})})]})})]})]})}),en&&(0,a.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",children:(0,a.jsxs)("div",{className:"bg-card w-full max-w-md rounded-lg border border-border/50 shadow-2xl p-6 animate-fade-in-up",children:[(0,a.jsx)("h3",{className:"text-xl font-bold mb-2",children:x("sendInvoiceEmail")}),(0,a.jsx)("p",{className:"text-sm text-muted-foreground mb-6",children:x("sendInvoiceEmailDesc")}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block",children:x("clientEmailAddress")}),(0,a.jsxs)("div",{className:"flex flex-col gap-3",children:[(0,a.jsxs)("select",{className:"w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer",onChange:e=>{let t=e.target.value;t&&ec(t)},value:"",children:[(0,a.jsx)("option",{value:"",disabled:!0,children:eh?"Chargement des clients...":"Choisir un client..."}),eu.map(e=>e.email&&(0,a.jsxs)("option",{value:e.email,children:[e.firstName?e.firstName+" ":"",e.name," ",e.companyName?`(${e.companyName})`:""," - ",e.email]},e.id))]}),(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("div",{className:"h-px bg-border/50 flex-1"}),(0,a.jsx)("span",{className:"text-[10px] text-muted-foreground font-bold uppercase tracking-widest",children:"OU"}),(0,a.jsx)("div",{className:"h-px bg-border/50 flex-1"})]}),(0,a.jsx)("input",{type:"email",value:ed,onChange:e=>ec(e.target.value),className:"w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors",placeholder:"Saisir une adresse e-mail manuellement..."})]})]}),(0,a.jsxs)("div",{className:"flex gap-3 pt-4",children:[(0,a.jsx)(h.Button,{variant:"outline",className:"flex-1 rounded-xl",onClick:()=>eo(!1),disabled:ex,children:x("cancel")}),(0,a.jsxs)(h.Button,{className:"flex-1 rounded-xl gap-2",onClick:ey,disabled:ex||!ed,children:[ex?(0,a.jsx)("div",{className:"h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"}):(0,a.jsx)(T.Send,{className:"w-4 h-4"}),x("send")]})]})]})]})})]})}var ea=e.i(2747);function es(){return(0,a.jsxs)("div",{className:"min-h-screen min-w-full bg-background/50 flex flex-col items-center py-12 pb-32 pt-28 md:pt-28 lg:pt-28 animate-in fade-in duration-700",children:[(0,a.jsxs)("div",{className:"w-full max-w-8xl px-8 mb-16 flex justify-between items-center",children:[(0,a.jsxs)("div",{className:"flex items-center gap-8",children:[(0,a.jsx)(ea.Skeleton,{className:"p-5 size-20 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-xl"}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)(ea.Skeleton,{className:"h-1 w-10 bg-primary/30 rounded-full"}),(0,a.jsx)(ea.Skeleton,{className:"h-3 w-32 bg-primary/10 rounded-full"})]}),(0,a.jsx)(ea.Skeleton,{className:"h-14 w-64 rounded-2xl bg-foreground/5 shadow-sm"})]})]}),(0,a.jsx)(ea.Skeleton,{className:"hidden lg:block h-14 w-40 rounded-2xl bg-muted/20 border border-border/40"})]}),(0,a.jsx)("div",{className:"w-full max-w-[1100px] px-8",children:(0,a.jsxs)("div",{className:"relative aspect-[3/4] md:aspect-[1/1.41] bg-card/30 border border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-3xl p-6 space-y-12",children:[(0,a.jsxs)("div",{className:"flex justify-between border-b pb-8 border-border/20",children:[(0,a.jsx)(ea.Skeleton,{className:"h-20 w-48 rounded-2xl bg-muted/20"}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(ea.Skeleton,{className:"h-4 w-32 bg-muted/30 rounded-full ml-auto"}),(0,a.jsx)(ea.Skeleton,{className:"h-8 w-40 bg-muted/40 rounded-xl ml-auto"})]})]}),(0,a.jsxs)("div",{className:"space-y-6",children:[(0,a.jsx)(ea.Skeleton,{className:"h-4 w-24 bg-muted/20 rounded-full"}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-8",children:[(0,a.jsx)(ea.Skeleton,{className:"h-32 w-full rounded-2xl bg-muted/10 border border-border/10"}),(0,a.jsx)(ea.Skeleton,{className:"h-32 w-full rounded-2xl bg-muted/10 border border-border/10"})]})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsx)(ea.Skeleton,{className:"h-10 w-full rounded-xl bg-muted/15"}),(0,a.jsx)(ea.Skeleton,{className:"h-40 w-full rounded-2xl bg-muted/5 border border-border/10"})]})]})})]})}function ei(){let e=(0,s.useSearchParams)().get("id")||void 0,{session:t,data:l,loading:r}=(0,i.useIPCData)("invoices",e);return r||!t?(0,a.jsx)(es,{}):(0,a.jsx)(et,{initialData:l,invoiceId:e})}function el(){return(0,a.jsx)(r.Suspense,{fallback:(0,a.jsx)(es,{}),children:(0,a.jsx)(ei,{})})}e.s(["default",()=>el],3162)}]);