module.exports=[8738,a=>{"use strict";var b=a.i(87924),c=a.i(50944),d=a.i(32560),e=a.i(48136),f=a.i(72131),g=a.i(38254),h=a.i(66680);let i={randomUUID:h.randomUUID},j=new Uint8Array(256),k=j.length,l=[];for(let a=0;a<256;++a)l.push((a+256).toString(16).slice(1));let m=function(a,b,c){if(i.randomUUID&&!b&&!a)return i.randomUUID();var d=a,e=c;let f=(d=d||{}).random??d.rng?.()??(k>j.length-16&&((0,h.randomFillSync)(j),k=0),j.slice(k,k+=16));if(f.length<16)throw Error("Random bytes length must be >= 16");if(f[6]=15&f[6]|64,f[8]=63&f[8]|128,b){if((e=e||0)<0||e+16>b.length)throw RangeError(`UUID byte range ${e}:${e+15} is out of buffer bounds`);for(let a=0;a<16;++a)b[e+a]=f[a];return b}return function(a,b=0){return(l[a[b+0]]+l[a[b+1]]+l[a[b+2]]+l[a[b+3]]+"-"+l[a[b+4]]+l[a[b+5]]+"-"+l[a[b+6]]+l[a[b+7]]+"-"+l[a[b+8]]+l[a[b+9]]+"-"+l[a[b+10]]+l[a[b+11]]+l[a[b+12]]+l[a[b+13]]+l[a[b+14]]+l[a[b+15]]).toLowerCase()}(f)};var n=a.i(70106);let o=(0,n.default)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),p=(0,n.default)("cooking-pot",[["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"u0tga0"}],["path",{d:"m4 8 16-4",key:"16g0ng"}],["path",{d:"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",key:"12cejc"}]]);var q=a.i(99570);function r({value:a,onValueChange:c,debounce:d=300,...e}){let[g,h]=(0,f.useState)(a),i=(0,f.useRef)(a);return a!==i.current&&(h(a),i.current=a),(0,f.useEffect)(()=>{if(d>0){let b=setTimeout(()=>{g!==a&&c(String(g))},d);return()=>clearTimeout(b)}},[g,d,c,a]),(0,b.jsx)("input",{...e,value:g,onChange:a=>h(a.target.value),onBlur:()=>{g!==a&&c(String(g))}})}function s({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,setCity:j,clientName:k,setClientName:l,clientAddress:n,setClientAddress:s,clientContact:t,setClientContact:u,clientPOBox:v,setClientPOBox:w,object:x,setObject:y,managerName:z,setManagerName:A,itemsArr:B,setItemsArr:C,currency:D}=(0,g.useInvoice)(),{language:E,dict:F}=(0,e.useLanguage)(),[G,H]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=a=>new Intl.NumberFormat("fr"===E?"fr-FR":"en-US",{style:"currency",currency:D||"XOF",minimumFractionDigits:2}).format(a),J=(0,f.useCallback)(()=>{""===G.designation&&0===G.quantity||(C([...B,{...G,id:m(),totalPrice:Number(G.quantity)*Number(G.unitPrice)}]),H({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[B,G,C]),K=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[B]);(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.quantity),0),[B]);let L=(0,f.useCallback)((a,b,c)=>{C(B.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[B,C]),M=(0,f.useCallback)(a=>{C(B.filter(b=>b.id!==a))},[B,C]),N=(0,f.useCallback)(()=>{C([])},[C]),O=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.quantity),0),[B]);return(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsxs)("div",{ref:a,id:"canvas",className:`bg-white w-[850px] text-black relative ${c<.8?"scale-small":""}`,children:[(0,b.jsxs)("div",{className:"flex justify-between items-start relative w-full mb-8 pt-10",children:[(0,b.jsx)("div",{className:"flex flex-col gap-4",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"text-gray-500 font-medium uppercase text-xs tracking-wider",children:"REF:"}),(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:F.reference,className:"w-40 font-bold text-lg bg-transparent"})]})})}),(0,b.jsxs)("div",{className:"text-right flex flex-col gap-2 p-2",children:[(0,b.jsx)("div",{className:"flex items-center justify-end gap-2",children:(0,b.jsx)(r,{value:i,dir:"rtl",onValueChange:j,placeholder:F.city,className:"w-40 font-medium bg-transparent"})}),(0,b.jsxs)("p",{className:"text-gray-600 font-semibold uppercase text-xs tracking-widest border-t pt-2",children:[F.date," ",new Date().toLocaleDateString("fr"===E?"fr-FR":"en-US")]})]})]}),(0,b.jsxs)("div",{className:"border h-35 w-full min-h-70",children:[(0,b.jsxs)("div",{className:"flex justify-between",children:[(0,b.jsx)("div",{className:"border-b h-15 p-5 w-full",children:(0,b.jsx)("h2",{children:F.billingAddress})}),(0,b.jsx)("div",{className:"border-b border-l h-15 p-5 w-full",children:(0,b.jsxs)("h2",{children:[F.deliveryAddress,":"]})})]}),(0,b.jsxs)("div",{className:"client-info space-y-3",children:[(0,b.jsxs)("div",{className:"editable-field flex items-center gap-2",children:[(0,b.jsxs)("span",{className:"label w-24",children:[F.client," :"]}),(0,b.jsx)(r,{value:k,onValueChange:l,placeholder:F.client,className:"flex-1 font-bold text-lg bg-transparent"})]}),(0,b.jsxs)("div",{className:"editable-field flex items-center gap-2",children:[(0,b.jsxs)("span",{className:"label w-24",children:[F.address," :"]}),(0,b.jsx)(r,{value:n,onValueChange:s,placeholder:F.address,className:"flex-1 bg-transparent"})]}),(0,b.jsxs)("div",{className:"flex gap-4",children:[(0,b.jsxs)("div",{className:"editable-field flex-1 flex items-center gap-2",children:[(0,b.jsxs)("span",{className:"label w-24",children:[F.contact," :"]}),(0,b.jsx)(r,{value:t,onValueChange:u,placeholder:F.contact,className:"flex-1 bg-transparent"})]}),(0,b.jsxs)("div",{className:"editable-field flex-1 flex items-center gap-2",children:[(0,b.jsxs)("span",{className:"label w-24",children:[F.poBox," :"]}),(0,b.jsx)(r,{value:v,onValueChange:w,placeholder:F.poBox,className:"flex-1 bg-transparent"})]})]}),(0,b.jsxs)("div",{className:"editable-field flex items-center gap-2 border-t pt-2 mt-2",children:[(0,b.jsxs)("span",{className:"label w-24",children:[F.object," :"]}),(0,b.jsx)(r,{value:x,onValueChange:y,placeholder:F.object,className:"flex-1 font-medium bg-transparent"})]})]})]}),(0,b.jsxs)("table",{children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{children:F.designation}),(0,b.jsx)("th",{children:F.unit}),(0,b.jsx)("th",{children:F.quantity}),(0,b.jsx)("th",{children:F.unitPrice}),(0,b.jsx)("th",{children:F.totalPrice})]})}),(0,b.jsxs)("tbody",{className:"relative",children:[B.map(a=>(0,b.jsxs)("tr",{children:[(0,b.jsxs)("td",{className:"relative p-0",children:[(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:a.designation,onValueChange:b=>L(a.id,"designation",b),placeholder:F.designation,className:"border-none outline-none w-full bg-transparent"})}),(0,b.jsx)(p,{id:"Delete",onClick:()=>M(a.id),className:"delete text-black absolute -left-7 top-1/2 -translate-y-1/2 size-5"})]}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>L(a.id,"unit",b),placeholder:F.unit,className:"bg-transparent w-full text-center"})})}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>L(a.id,"quantity",Number(b)),placeholder:F.quantity,className:"bg-transparent w-full text-center"})})}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>L(a.id,"unitPrice",Number(b)),placeholder:F.unitPrice,className:"bg-transparent w-full text-center font-medium"})})}),(0,b.jsx)("td",{children:(0,b.jsx)("h2",{children:I(a.totalPrice)})})]},a.id)),(0,b.jsxs)("tr",{children:[(0,b.jsxs)("td",{className:"relative p-0",children:[(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:G.designation,onValueChange:a=>H({...G,designation:a}),placeholder:F.designation,className:"border-none outline-none w-full bg-transparent"})}),(0,b.jsx)(o,{onClick:J,className:"uploade text-black absolute -left-7 top-1/2 -translate-y-1/2 size-6"})]}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:G.unit,onValueChange:a=>H({...G,unit:a}),placeholder:F.unit,className:"bg-transparent w-full text-center"})})}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:G.quantity,onValueChange:a=>{let b=Number(a);H(a=>({...a,quantity:b,totalPrice:b*Number(a.unitPrice)}))},placeholder:F.quantity,className:"bg-transparent w-full text-center"})})}),(0,b.jsx)("td",{className:"p-0",children:(0,b.jsx)("div",{className:"editable-field p-2",children:(0,b.jsx)(r,{value:G.unitPrice,onValueChange:a=>{let b=Number(a);H(a=>({...a,unitPrice:b,totalPrice:b*Number(a.quantity)}))},placeholder:F.unitPrice,className:"bg-transparent w-full text-center"})})}),(0,b.jsx)("td",{children:(0,b.jsx)("h2",{children:I(G.totalPrice)})})]})]})]}),(0,b.jsx)("table",{className:"totals",children:(0,b.jsxs)("tbody",{children:[(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{children:F.totalMaterial}),(0,b.jsx)("td",{children:O})]}),(0,b.jsxs)("tr",{children:[(0,b.jsx)("td",{children:F.totalHT}),(0,b.jsx)("td",{children:I(K)})]})]})}),(0,b.jsxs)("div",{className:"signature",children:[(0,b.jsx)("h2",{className:"font-semibold mb-3",children:F.managerName}),(0,b.jsx)(r,{value:z,onValueChange:A,dir:"rtl",placeholder:F.managerName,className:"border-none outline-none w-90"})]}),(0,b.jsx)(q.Button,{onClick:N,className:"mt-4 p-5 bg-red-500 text-white",children:F.clearAll})]})})}var t=a.i(15618),u=a.i(81560);function v({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,setCity:j,clientName:k,setClientName:l,clientAddress:n,setClientAddress:o,clientContact:p,setClientContact:s,clientPOBox:v,setClientPOBox:w,object:x,setObject:y,managerName:z,setManagerName:A,itemsArr:B,setItemsArr:C,currency:D}=(0,g.useInvoice)(),{dict:E,language:F}=(0,e.useLanguage)(),[G,H]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=a=>new Intl.NumberFormat("fr"===F?"fr-FR":"en-US",{style:"currency",currency:D||"XOF",minimumFractionDigits:2}).format(a),J=(0,f.useCallback)(()=>{""===G.designation&&0===G.quantity||(C([...B,{...G,id:m(),totalPrice:Number(G.quantity)*Number(G.unitPrice)}]),H({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[B,G,C]),K=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[B]),L=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.quantity),0),[B]),M=(0,f.useCallback)((a,b,c)=>{C(B.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[B,C]),N=(0,f.useCallback)(a=>{C(B.filter(b=>b.id!==a))},[B,C]);return(0,f.useCallback)(()=>{C([])},[C]),(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsxs)("div",{ref:a,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-lg ${c<.8?"scale-small":""}`,children:[(0,b.jsxs)("div",{className:"bg-slate-900 text-white p-12 flex justify-between items-start",children:[(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("h1",{className:"text-4xl font-light tracking-wide mb-2",children:E.invoice}),(0,b.jsxs)("div",{className:"flex items-center gap-2 text-slate-400",children:[(0,b.jsxs)("span",{className:"text-sm uppercase tracking-wider",children:[E.reference,":"]}),(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:"IV-2024-001",className:"bg-transparent border-b border-slate-700 text-white w-40 focus:border-white transition-colors"})]})]}),(0,b.jsx)("div",{className:"w-1/2 text-right",children:(0,b.jsxs)("div",{className:"flex justify-end items-center gap-2 mb-1",children:[(0,b.jsx)(r,{value:i,onValueChange:j,placeholder:"City",className:"bg-transparent border-b border-slate-700 text-white text-right w-32 focus:border-white"}),(0,b.jsxs)("span",{className:"text-slate-400",children:[","," ",new Date().toLocaleDateString("fr"===F?"fr-FR":"en-US")]})]})})]}),(0,b.jsxs)("div",{className:"p-12 pb-6 grid grid-cols-2 gap-12",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider mb-4",children:E.billedTo}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(r,{value:k,onValueChange:l,placeholder:"Client Company Name",className:"text-xl font-bold text-slate-900 w-full placeholder:text-slate-300"}),(0,b.jsx)(r,{value:n,onValueChange:o,placeholder:"Street Address",className:"text-sm text-slate-600 w-full"}),(0,b.jsxs)("div",{className:"flex gap-4",children:[(0,b.jsx)(r,{value:p,onValueChange:s,placeholder:"Contact Person",className:"text-sm text-slate-600 w-full"}),(0,b.jsx)(r,{value:v,onValueChange:w,placeholder:"BP",className:"text-sm text-slate-600 w-24"})]})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider mb-4",children:E.projectDetails}),(0,b.jsxs)("div",{className:"bg-slate-50 p-6 rounded-lg",children:[(0,b.jsxs)("label",{className:"block text-xs font-semibold text-slate-500 mb-1",children:[E.object," / ",E.description]}),(0,b.jsx)(r,{value:x,onValueChange:y,placeholder:E.object,className:"w-full text-slate-800 font-medium"})]})]})]}),(0,b.jsx)("div",{className:"px-12 py-6",children:(0,b.jsxs)("table",{className:"w-full",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{className:"border-b-2 border-slate-100",children:[(0,b.jsx)("th",{className:"py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2",children:E.description}),(0,b.jsx)("th",{className:"py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider",children:E.unit}),(0,b.jsx)("th",{className:"py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider",children:E.qty}),(0,b.jsx)("th",{className:"py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",children:E.unitPrice}),(0,b.jsx)("th",{className:"py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",children:E.totalPrice})]})}),(0,b.jsxs)("tbody",{className:"divide-y divide-slate-50",children:[B.map(a=>(0,b.jsxs)("tr",{className:"group hover:bg-slate-50 transition-colors",children:[(0,b.jsxs)("td",{className:"py-4 relative",children:[(0,b.jsx)(r,{value:a.designation,onValueChange:b=>M(a.id,"designation",b),placeholder:E.description,className:"w-full font-medium text-slate-700"}),(0,b.jsx)("button",{onClick:()=>N(a.id),className:"absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-all p-1 cursor-pointer",children:(0,b.jsx)(u.Trash2,{className:"w-4 h-4"})})]}),(0,b.jsx)("td",{className:"py-4 text-center",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>M(a.id,"unit",b),className:"text-center text-slate-500 w-16 mx-auto"})}),(0,b.jsx)("td",{className:"py-4 text-center",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>M(a.id,"quantity",Number(b)),className:"text-center font-semibold text-slate-700 w-16 mx-auto"})}),(0,b.jsx)("td",{className:"py-4 text-right",children:(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>M(a.id,"unitPrice",Number(b)),className:"text-right text-slate-500 w-24 ml-auto"})}),(0,b.jsx)("td",{className:"py-4 text-right font-bold text-slate-800",children:I(a.totalPrice)})]},a.id)),(0,b.jsxs)("tr",{className:"bg-slate-50",children:[(0,b.jsx)("td",{className:"py-4 relative pl-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(q.Button,{variant:"ghost",size:"sm",className:"h-6 w-6 p-0 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600",onClick:J,children:(0,b.jsx)(t.Plus,{className:"w-4 h-4"})}),(0,b.jsx)(r,{value:G.designation,onValueChange:a=>H({...G,designation:a}),placeholder:E.add,className:"w-full text-slate-500 italic bg-transparent"})]})}),(0,b.jsx)("td",{className:"py-4 text-center",children:(0,b.jsx)(r,{value:G.unit,onValueChange:a=>H({...G,unit:a}),className:"text-center text-slate-400 w-16 mx-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-4 text-center",children:(0,b.jsx)(r,{value:G.quantity,onValueChange:a=>{let b=Number(a);H(a=>({...a,quantity:b,totalPrice:b*a.unitPrice}))},className:"text-center text-slate-400 w-16 mx-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-4 text-right",children:(0,b.jsx)(r,{value:G.unitPrice,onValueChange:a=>{let b=Number(a);H(a=>({...a,unitPrice:b,totalPrice:a.quantity*b}))},className:"text-right text-slate-400 w-24 ml-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-4 text-right font-medium text-slate-400 pr-4",children:I(G.totalPrice)})]})]})]})}),(0,b.jsxs)("div",{className:"px-12 mt-12 flex justify-between items-end gap-12",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4",children:E.authorizedSignature}),(0,b.jsx)(r,{value:z,onValueChange:A,placeholder:E.managerName,className:"font-script text-2xl text-slate-800 w-full max-w-[250px] border-b border-slate-200 pb-2"})]}),(0,b.jsxs)("div",{className:"min-w-[300px] max-w-[50%] space-y-3",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center gap-4 text-slate-500 text-sm tabular-nums",children:[(0,b.jsx)("span",{className:"whitespace-nowrap",children:E.totalMaterial}),(0,b.jsx)("span",{className:"text-right break-all font-medium",children:L})]}),(0,b.jsxs)("div",{className:"flex justify-between items-center gap-4 pt-4 border-t border-slate-200 tabular-nums",children:[(0,b.jsx)("span",{className:"font-bold text-lg text-slate-900 whitespace-nowrap",children:E.total}),(0,b.jsx)("span",{className:"font-bold text-2xl text-slate-900 text-right break-all leading-tight",children:I(K)})]})]})]})]})})}function w({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,setCity:j,clientName:k,setClientName:l,clientAddress:n,setClientAddress:o,clientContact:p,setClientContact:s,clientPOBox:v,setClientPOBox:w,object:x,setObject:y,managerName:z,setManagerName:A,itemsArr:B,setItemsArr:C,currency:D}=(0,g.useInvoice)(),{dict:E,language:F}=(0,e.useLanguage)(),[G,H]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=a=>new Intl.NumberFormat("fr"===F?"fr-FR":"en-US",{style:"currency",currency:D||"XOF",minimumFractionDigits:2}).format(a),J=(0,f.useCallback)(()=>{""===G.designation&&0===G.quantity||(C([...B,{...G,id:m(),totalPrice:Number(G.quantity)*Number(G.unitPrice)}]),H({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[B,G,C]),K=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[B]),L=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.quantity),0),[B]),M=(0,f.useCallback)((a,b,c)=>{C(B.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[B,C]),N=(0,f.useCallback)(a=>{C(B.filter(b=>b.id!==a))},[B,C]);return(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsxs)("div",{ref:a,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl font-serif ${c<.8?"scale-small":""}`,children:[(0,b.jsxs)("div",{className:"flex h-48",children:[(0,b.jsxs)("div",{className:"w-1/3 bg-blue-900 p-8 flex flex-col justify-center text-white",children:[(0,b.jsx)("div",{className:"w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4",children:(0,b.jsx)("div",{className:"w-10 h-10 bg-white rounded-full"})}),(0,b.jsx)("h2",{className:"font-bold text-xl tracking-wider",children:"COMPANY"})]}),(0,b.jsx)("div",{className:"w-2/3 bg-gray-100 p-8 flex flex-col justify-between",children:(0,b.jsxs)("div",{className:"flex justify-between items-start",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-5xl font-bold text-blue-900 mb-2",children:E.invoice}),(0,b.jsxs)("div",{className:"flex items-center gap-2 text-gray-500",children:[(0,b.jsx)("span",{children:"#"}),(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:"INV-0000",className:"bg-transparent text-gray-600 w-32 focus:ring-0"})]})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)(r,{value:i,onValueChange:j,placeholder:"City",className:"text-right text-gray-600 w-32 bg-transparent"}),(0,b.jsx)("div",{className:"text-sm text-gray-500",children:new Date().toLocaleDateString("fr"===F?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})})]}),(0,b.jsxs)("div",{className:"p-10 flex gap-12",children:[(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("h3",{className:"text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block",children:E.billedTo}),(0,b.jsx)(r,{value:k,onValueChange:l,placeholder:"Recipient Name",className:"text-2xl font-bold text-gray-900 w-full mb-2 block"}),(0,b.jsx)(r,{value:n,onValueChange:o,placeholder:"Address Line",className:"text-gray-600 w-full text-sm"}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(r,{value:v,onValueChange:w,placeholder:"Zip/Postal",className:"text-gray-600 w-24 text-sm"}),(0,b.jsx)(r,{value:p,onValueChange:s,placeholder:E.contact,className:"text-gray-600 w-full text-sm"})]})]}),(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("h3",{className:"text-blue-900 font-bold uppercase text-xs tracking-widest mb-4 border-b-2 border-blue-900 pb-2 inline-block",children:E.projectDetails}),(0,b.jsx)(r,{value:x,onValueChange:y,placeholder:E.object,className:"w-full text-gray-700 bg-gray-50 p-2 border-l-4 border-gray-300"})]})]}),(0,b.jsxs)("div",{className:"px-10 mt-4",children:[(0,b.jsxs)("table",{className:"w-full",children:[(0,b.jsx)("thead",{className:"bg-blue-900 text-white",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"py-3 px-4 text-left font-semibold text-sm",children:E.description}),(0,b.jsx)("th",{className:"py-3 px-4 text-center font-semibold text-sm",children:E.unit}),(0,b.jsx)("th",{className:"py-3 px-4 text-center font-semibold text-sm",children:E.qty}),(0,b.jsx)("th",{className:"py-3 px-4 text-right font-semibold text-sm",children:E.price}),(0,b.jsx)("th",{className:"py-3 px-4 text-right font-semibold text-sm",children:E.total})]})}),(0,b.jsxs)("tbody",{children:[B.map((a,c)=>(0,b.jsxs)("tr",{className:c%2==0?"bg-white":"bg-gray-50",children:[(0,b.jsxs)("td",{className:"py-3 px-4 relative",children:[(0,b.jsx)(r,{value:a.designation,onValueChange:b=>M(a.id,"designation",b),className:"w-full font-medium text-gray-800 bg-transparent wrap-break-word whitespace-pre-wrap min-h-[1.5rem]"}),(0,b.jsx)("button",{onClick:()=>N(a.id),className:"absolute -left-6 top-3 text-red-500 hover:text-red-700 cursor-pointer",children:(0,b.jsx)(u.Trash2,{className:"w-4 h-4"})})]}),(0,b.jsx)("td",{className:"py-3 px-4 text-center",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>M(a.id,"unit",b),className:"text-center w-12 mx-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-center",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>M(a.id,"quantity",Number(b)),className:"text-center w-12 mx-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-right",children:(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>M(a.id,"unitPrice",Number(b)),className:"text-right w-24 ml-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-right font-bold text-gray-800 tabular-nums",children:I(a.totalPrice)})]},a.id)),(0,b.jsxs)("tr",{className:"bg-blue-50/50 outline outline-blue-200 outline-dashed",children:[(0,b.jsx)("td",{className:"py-3 px-4",children:(0,b.jsx)(r,{value:G.designation,onValueChange:a=>H({...G,designation:a}),placeholder:E.add,className:"w-full bg-transparent font-medium"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-center",children:(0,b.jsx)(r,{value:G.unit,onValueChange:a=>H({...G,unit:a}),className:"text-center w-12 mx-auto bg-transparent"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-center",children:(0,b.jsx)(r,{value:G.quantity,onValueChange:a=>H({...G,quantity:Number(a),totalPrice:Number(a)*G.unitPrice}),className:"text-center w-12 mx-auto bg-transparent font-mono"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-right",children:(0,b.jsx)(r,{value:G.unitPrice,onValueChange:a=>H({...G,unitPrice:Number(a),totalPrice:G.quantity*Number(a)}),className:"text-right w-24 ml-auto bg-transparent font-mono"})}),(0,b.jsx)("td",{className:"py-3 px-4 text-right font-bold text-blue-700",children:I(G.quantity*G.unitPrice)})]})]})]}),(0,b.jsx)("div",{className:"mt-4 flex items-center justify-center",children:(0,b.jsxs)(q.Button,{variant:"default",size:"sm",onClick:J,className:"bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer",children:[(0,b.jsx)(t.Plus,{className:"w-4 h-4 mr-2"})," ",E.add]})})]}),(0,b.jsxs)("div",{className:"px-10 mt-12 flex justify-between items-end gap-12 pb-16",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("div",{className:"text-xs text-gray-400 uppercase tracking-widest mb-4",children:E.authorizedSignature}),(0,b.jsx)(r,{value:z,onValueChange:A,placeholder:E.managerName,className:"text-lg font-serif italic text-gray-800 border-b border-gray-200 pb-1 w-full max-w-[250px]"})]}),(0,b.jsxs)("div",{className:"min-w-[400px] max-w-[50%] bg-blue-900 text-white p-8 rounded-2xl shadow-xl space-y-4 tabular-nums",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center gap-4 text-blue-100/70",children:[(0,b.jsx)("span",{className:"text-sm font-medium uppercase tracking-wider",children:E.totalMaterial}),(0,b.jsx)("span",{className:"text-xl font-bold break-all",children:L})]}),(0,b.jsxs)("div",{className:"pt-4 border-t border-blue-800 flex justify-between items-center gap-6",children:[(0,b.jsx)("span",{className:"text-lg font-bold uppercase tracking-widest text-blue-200",children:E.total}),(0,b.jsx)("span",{className:"text-2xl font-black text-white break-all text-right leading-tight",children:I(K)})]})]})]}),(0,b.jsx)("div",{className:"w-full bg-blue-900 h-4 mt-auto"})]})})}let x=(0,n.default)("hexagon",[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]]);function y({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,setCity:j,clientName:k,setClientName:l,clientAddress:n,setClientAddress:o,clientContact:p,setClientContact:s,clientPOBox:v,setClientPOBox:w,object:y,setObject:z,managerName:A,setManagerName:B,itemsArr:C,setItemsArr:D,currency:E}=(0,g.useInvoice)(),{language:F,dict:G}=(0,e.useLanguage)(),[H,I]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),J=a=>new Intl.NumberFormat("fr"===F?"fr-FR":"en-US",{style:"currency",currency:E||"XOF",minimumFractionDigits:2}).format(a),K=(0,f.useCallback)(()=>{""===H.designation&&0===H.quantity||(D([...C,{...H,id:m(),totalPrice:Number(H.quantity)*Number(H.unitPrice)}]),I({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[C,H,D]),L=(0,f.useMemo)(()=>C.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[C]),M=(0,f.useMemo)(()=>C.reduce((a,b)=>a+Number(b.quantity),0),[C]),N=(0,f.useCallback)((a,b,c)=>{D(C.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[C,D]),O=(0,f.useCallback)(a=>{D(C.filter(b=>b.id!==a))},[C,D]);return(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsxs)("div",{ref:a,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-gray-800 relative shadow-xl ${c<.8?"scale-small":""}`,children:[(0,b.jsx)("div",{className:"absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-bl-[100px] opacity-20 z-0"}),(0,b.jsx)("div",{className:"absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-tr-[100px] opacity-20 z-0"}),(0,b.jsxs)("div",{className:"p-12 relative z-10",children:[(0,b.jsxs)("div",{className:"flex justify-between items-end mb-12",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4 text-purple-600",children:[(0,b.jsx)(x,{className:"w-8 h-8 fill-current"}),(0,b.jsx)("span",{className:"font-bold text-2xl tracking-tighter",children:"CREATIVE"})]}),(0,b.jsxs)("div",{className:"text-gray-500",children:[(0,b.jsx)(r,{value:i,onValueChange:j,placeholder:"City",className:"bg-transparent w-32 border-b border-dashed border-gray-300 focus:border-purple-400"}),(0,b.jsx)("div",{className:"text-sm mt-1",children:new Date().toLocaleDateString("fr"===F?"fr-FR":"en-US")})]})]}),(0,b.jsxs)("div",{className:"text-right absolute -top-10 right-4 -z-100",children:[(0,b.jsx)("h1",{className:"text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-orange-400 opacity-80",children:G.invoice}),(0,b.jsxs)("div",{className:"flex items-center justify-end gap-2 mt-2",children:[(0,b.jsx)("span",{className:"font-bold text-gray-400",children:"#"}),(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:G.reference,className:"text-right font-mono text-xl w-32 bg-transparent text-gray-700 font-bold"})]})]})]}),(0,b.jsxs)("div",{className:"flex gap-8 mb-12",children:[(0,b.jsxs)("div",{className:"w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-100",children:[(0,b.jsx)("h3",{className:"text-purple-500 font-bold text-xs uppercase mb-4",children:G.billedTo}),(0,b.jsx)(r,{value:k,onValueChange:l,placeholder:G.client,className:"text-2xl font-bold text-gray-800 w-full mb-1 bg-transparent"}),(0,b.jsx)(r,{value:n,onValueChange:o,placeholder:G.address,className:"text-gray-500 w-full text-sm bg-transparent"}),(0,b.jsxs)("div",{className:"flex gap-2 mt-2",children:[(0,b.jsx)(r,{value:v,onValueChange:w,placeholder:"Zip",className:"text-gray-500 w-20 text-sm bg-white rounded px-2"}),(0,b.jsx)(r,{value:p,onValueChange:s,placeholder:G.contact,className:"text-gray-500 w-full text-sm bg-white rounded px-2"})]})]}),(0,b.jsxs)("div",{className:"w-1/2 flex flex-col justify-center pl-6 border-l-4 border-orange-300",children:[(0,b.jsx)("h3",{className:"text-orange-400 font-bold text-xs uppercase mb-2",children:G.projectDetails}),(0,b.jsx)(r,{value:y,onValueChange:z,placeholder:G.object,className:"text-lg text-gray-700 italic w-full bg-transparent"})]})]}),(0,b.jsxs)("div",{className:"mb-8",children:[(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider px-4",children:[(0,b.jsx)("div",{className:"col-span-5",children:G.description}),(0,b.jsx)("div",{className:"col-span-1 text-center",children:G.unit}),(0,b.jsx)("div",{className:"col-span-2 text-center",children:G.qty}),(0,b.jsx)("div",{className:"col-span-4 text-right",children:G.total})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[C.map(a=>(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 items-center bg-white border border-gray-100 shadow-xs rounded-xl p-4 hover:shadow-md transition-shadow relative group",children:[(0,b.jsxs)("div",{className:"col-span-5",children:[(0,b.jsx)(r,{value:a.designation,onValueChange:b=>N(a.id,"designation",b),className:"font-semibold text-gray-800 w-full bg-transparent"}),(0,b.jsxs)("div",{className:"text-xs text-gray-400 mt-1 flex gap-2",children:[(0,b.jsxs)("span",{children:[G.price,":"]}),(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>N(a.id,"unitPrice",Number(b)),className:"w-20 bg-gray-50 rounded px-1"})]}),(0,b.jsx)("button",{onClick:()=>O(a.id),className:"absolute -left-3 top-1/2 -translate-y-1/2 bg-red-100 text-red-500 p-1 rounded-full transition-opacity cursor-pointer shadow-sm",children:(0,b.jsx)(u.Trash2,{className:"w-3 h-3"})})]}),(0,b.jsx)("div",{className:"col-span-1 text-center",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>N(a.id,"unit",b),className:"text-center w-full bg-transparent text-gray-500 text-sm"})}),(0,b.jsx)("div",{className:"col-span-2 text-center",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>N(a.id,"quantity",Number(b)),className:"text-center w-14 mx-auto bg-purple-50 text-purple-700 font-bold rounded-lg py-1"})}),(0,b.jsx)("div",{className:"col-span-4 text-right font-bold text-gray-800 tabular-nums whitespace-nowrap",children:J(a.totalPrice)})]},a.id)),(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 items-center border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors",children:[(0,b.jsxs)("div",{className:"col-span-5 flex gap-2 items-center",children:[(0,b.jsx)(q.Button,{size:"icon",className:"h-8 w-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 cursor-pointer",onClick:K,children:(0,b.jsx)(t.Plus,{className:"w-4 h-4"})}),(0,b.jsx)(r,{value:H.designation,onValueChange:a=>I({...H,designation:a}),placeholder:G.add,className:"bg-transparent text-gray-500 w-full"})]}),(0,b.jsx)("div",{className:"col-span-1",children:(0,b.jsx)(r,{value:H.unit,onValueChange:a=>I({...H,unit:a}),className:"text-center w-full bg-transparent text-gray-400 text-sm"})}),(0,b.jsx)("div",{className:"col-span-2",children:(0,b.jsx)(r,{value:H.quantity,onValueChange:a=>{let b=Number(a);I(a=>({...a,quantity:b,totalPrice:b*a.unitPrice}))},className:"text-center w-14 mx-auto bg-gray-50 rounded py-1"})}),(0,b.jsxs)("div",{className:"col-span-4 text-right",children:[(0,b.jsx)(r,{value:H.unitPrice,onValueChange:a=>{let b=Number(a);I(a=>({...a,unitPrice:b,totalPrice:a.quantity*b}))},placeholder:G.price,className:"text-right w-20 ml-auto bg-transparent tabular-nums"}),(0,b.jsx)("div",{className:"text-xs text-gray-400 pr-2",children:J(H.totalPrice)})]})]})]})]}),(0,b.jsxs)("div",{className:"flex flex-col items-end mt-12",children:[(0,b.jsxs)("div",{className:"bg-slate-900 text-white p-8 rounded-2xl min-w-[350px] max-w-full shadow-2xl relative overflow-hidden tabular-nums",children:[(0,b.jsx)("div",{className:"absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"}),(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row justify-between gap-8 relative z-10",children:[(0,b.jsxs)("div",{className:"min-w-fit",children:[(0,b.jsx)("div",{className:"text-gray-400 text-xs uppercase mb-1",children:G.totalMaterial}),(0,b.jsx)("div",{className:"text-xl font-bold break-all",children:M})]}),(0,b.jsxs)("div",{className:"text-right flex-1",children:[(0,b.jsx)("div",{className:"text-gray-400 text-xs uppercase mb-1",children:G.total}),(0,b.jsx)("div",{className:"text-4xl font-black text-orange-400 break-all leading-tight",children:J(L)})]})]})]}),(0,b.jsxs)("div",{className:"mt-12 text-center w-full",children:[(0,b.jsx)(r,{value:A,onValueChange:B,placeholder:G.managerName,className:"text-center font-handwriting text-2xl text-purple-800 w-64 mx-auto border-b border-purple-200 pb-2"}),(0,b.jsx)("div",{className:"text-xs text-gray-400 uppercase tracking-widest mt-2",children:G.authorizedSignature})]})]})]})]})})}function z({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,setCity:j,clientName:k,setClientName:l,clientAddress:n,setClientAddress:o,clientContact:p,setClientContact:s,clientPOBox:v,setClientPOBox:w,object:x,setObject:y,managerName:z,setManagerName:A,itemsArr:B,setItemsArr:C,currency:D}=(0,g.useInvoice)(),{language:E,dict:F}=(0,e.useLanguage)(),[G,H]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),I=a=>new Intl.NumberFormat("fr"===E?"fr-FR":"en-US",{style:"currency",currency:D||"XOF",minimumFractionDigits:2}).format(a),J=(0,f.useCallback)(()=>{""===G.designation&&0===G.quantity||(C([...B,{...G,id:m(),totalPrice:Number(G.quantity)*Number(G.unitPrice)}]),H({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[B,G,C]),K=(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[B]);(0,f.useMemo)(()=>B.reduce((a,b)=>a+Number(b.quantity),0),[B]);let L=(0,f.useCallback)((a,b,c)=>{C(B.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[B,C]),M=(0,f.useCallback)(a=>{C(B.filter(b=>b.id!==a))},[B,C]);return(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsxs)("div",{ref:a,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-slate-800 relative shadow-xl font-sans ${c<.8?"scale-small":""}`,children:[(0,b.jsx)("div",{className:"h-2 w-full bg-[#1e293b]"}),(0,b.jsxs)("div",{className:"p-16",children:[(0,b.jsxs)("div",{className:"flex justify-between items-start mb-16",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-4xl font-serif text-[#1e293b] tracking-tight mb-2",children:F.invoice}),(0,b.jsxs)("div",{className:"text-sm text-slate-500 uppercase tracking-widest font-medium",children:[F.reference,":"," ",(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:"INV-001",className:"w-32 inline-block bg-transparent text-slate-700"})]})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("div",{className:"text-2xl font-serif text-[#1e293b] mb-1",children:"Company Name"}),(0,b.jsxs)("div",{className:"text-sm text-slate-500",children:[(0,b.jsx)(r,{value:i,onValueChange:j,placeholder:"City, Country",className:"text-right w-48 bg-transparent"}),(0,b.jsx)("div",{children:new Date().toLocaleDateString("fr"===E?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-12 mb-16",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2",children:F.billedTo}),(0,b.jsx)(r,{value:k,onValueChange:l,placeholder:F.client,className:"text-xl font-serif text-[#1e293b] w-full mb-1"}),(0,b.jsx)(r,{value:n,onValueChange:o,placeholder:F.address,className:"text-sm text-slate-500 w-full"}),(0,b.jsx)(r,{value:p,onValueChange:s,placeholder:F.contact,className:"text-sm text-slate-500 w-full"}),(0,b.jsx)(r,{value:v,onValueChange:w,placeholder:F.poBox,className:"text-sm text-slate-500 w-24"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2",children:F.projectDetails}),(0,b.jsx)(r,{value:x,onValueChange:y,placeholder:F.object,className:"text-md text-slate-700 w-full h-24 resize-none bg-slate-50 p-3 rounded-md"})]})]}),(0,b.jsx)("div",{className:"mb-12",children:(0,b.jsxs)("table",{className:"w-full",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{className:"border-b-2 border-[#1e293b]",children:[(0,b.jsx)("th",{className:"py-3 text-left text-xs font-bold text-[#1e293b] uppercase tracking-wider",children:F.description}),(0,b.jsx)("th",{className:"py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24",children:F.unit}),(0,b.jsx)("th",{className:"py-3 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider w-24",children:F.qty}),(0,b.jsx)("th",{className:"py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32",children:F.price}),(0,b.jsx)("th",{className:"py-3 text-right text-xs font-bold text-[#1e293b] uppercase tracking-wider w-32",children:F.total})]})}),(0,b.jsxs)("tbody",{className:"divide-y divide-slate-100",children:[B.map(a=>(0,b.jsxs)("tr",{className:"group hover:bg-slate-50",children:[(0,b.jsxs)("td",{className:"py-4 relative",children:[(0,b.jsx)(r,{value:a.designation,onValueChange:b=>L(a.id,"designation",b),className:"w-full font-medium text-slate-700 bg-transparent"}),(0,b.jsx)("button",{onClick:()=>M(a.id),className:"absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-opacity cursor-pointer",children:(0,b.jsx)(u.Trash2,{className:"w-4 h-4"})})]}),(0,b.jsx)("td",{className:"py-4",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>L(a.id,"unit",b),className:"w-full text-center text-slate-500 bg-transparent"})}),(0,b.jsx)("td",{className:"py-4",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>L(a.id,"quantity",Number(b)),className:"w-full text-center text-slate-500 bg-transparent"})}),(0,b.jsx)("td",{className:"py-4 text-right",children:(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>L(a.id,"unitPrice",Number(b)),className:"w-full text-right text-slate-500 bg-transparent"})}),(0,b.jsx)("td",{className:"py-4 text-right font-medium text-slate-900",children:I(a.totalPrice)})]},a.id)),(0,b.jsxs)("tr",{className:"bg-slate-50/50",children:[(0,b.jsxs)("td",{className:"py-3 pl-2 flex items-center gap-2",children:[(0,b.jsx)(q.Button,{size:"icon",variant:"ghost",onClick:J,className:"h-6 w-6 text-slate-400 hover:text-[#1e293b]",children:(0,b.jsx)(t.Plus,{className:"w-4 h-4"})}),(0,b.jsx)(r,{value:G.designation,onValueChange:a=>H({...G,designation:a}),placeholder:F.add,className:"w-full bg-transparent text-sm"})]}),(0,b.jsx)("td",{className:"py-3",children:(0,b.jsx)(r,{value:G.unit,onValueChange:a=>H({...G,unit:a}),className:"w-full text-center bg-transparent text-sm text-slate-400"})}),(0,b.jsx)("td",{className:"py-3",children:(0,b.jsx)(r,{value:G.quantity,onValueChange:a=>H({...G,quantity:Number(a),totalPrice:Number(a)*G.unitPrice}),className:"w-full text-center bg-transparent text-sm text-slate-400"})}),(0,b.jsx)("td",{className:"py-3 text-right",children:(0,b.jsx)(r,{value:G.unitPrice,onValueChange:a=>H({...G,unitPrice:Number(a),totalPrice:G.quantity*Number(a)}),className:"w-full text-right bg-transparent text-sm text-slate-400"})}),(0,b.jsx)("td",{className:"py-3 text-right text-sm text-slate-400 pr-2",children:I(G.totalPrice)})]})]})]})}),(0,b.jsx)("div",{className:"flex justify-end mb-20",children:(0,b.jsxs)("div",{className:"min-w-[320px] max-w-full space-y-1 tabular-nums",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500",children:[(0,b.jsx)("span",{className:"whitespace-nowrap",children:F.subtotal}),(0,b.jsx)("span",{className:"text-right break-all",children:I(K)})]}),(0,b.jsxs)("div",{className:"flex justify-between items-center gap-6 py-2 border-b border-slate-100 text-sm text-slate-500",children:[(0,b.jsx)("span",{className:"whitespace-nowrap",children:F.tax}),(0,b.jsx)("span",{className:"text-right break-all",children:I(0)})]}),(0,b.jsxs)("div",{className:"flex justify-between items-center gap-8 py-4 border-b-2 border-[#1e293b] text-xl font-serif text-[#1e293b]",children:[(0,b.jsx)("span",{className:"font-bold uppercase tracking-wider whitespace-nowrap",children:F.total}),(0,b.jsx)("span",{className:"font-bold break-all text-right",children:I(K)})]})]})}),(0,b.jsxs)("div",{className:"flex justify-between items-end",children:[(0,b.jsx)("div",{className:"text-xs text-slate-400"}),(0,b.jsxs)("div",{className:"text-center w-64",children:[(0,b.jsx)(r,{value:z,onValueChange:A,placeholder:F.managerName,className:"text-center font-cursive text-2xl text-[#1e293b] w-full mb-2"}),(0,b.jsx)("div",{className:"border-t border-slate-300 pt-2 text-xs uppercase tracking-widest text-slate-400",children:F.authorizedSignature})]})]})]}),(0,b.jsx)("div",{className:"absolute bottom-0 left-0 w-full h-2 bg-[#1e293b]"})]})})}function A({divRef:a,scale:c}){let{reference:d,setReference:h,city:i,clientName:j,setClientName:k,clientAddress:l,setClientAddress:n,clientContact:o,setClientContact:p,clientPOBox:s,setClientPOBox:v,object:w,setObject:x,managerName:y,setManagerName:z,itemsArr:A,setItemsArr:B,currency:C}=(0,g.useInvoice)(),{language:D,dict:E}=(0,e.useLanguage)(),[F,G]=(0,f.useState)({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}),H=a=>new Intl.NumberFormat("fr"===D?"fr-FR":"en-US",{style:"currency",currency:C||"XOF",minimumFractionDigits:2}).format(a),I=(0,f.useCallback)(()=>{""===F.designation&&0===F.quantity||(B([...A,{...F,id:m(),totalPrice:Number(F.quantity)*Number(F.unitPrice)}]),G({designation:"",unit:"U",quantity:0,unitPrice:0,totalPrice:0}))},[A,F,B]),J=(0,f.useMemo)(()=>A.reduce((a,b)=>a+Number(b.totalPrice??Number(b.quantity)*Number(b.unitPrice)),0),[A]),K=(0,f.useMemo)(()=>A.reduce((a,b)=>a+Number(b.quantity),0),[A]),L=(0,f.useCallback)((a,b,c)=>{B(A.map(d=>{if(""===d.designation&&0===d.quantity||d.id!==a)return d;let e={...d,designation:"designation"===b&&"string"==typeof c?c:d.designation,unit:"unit"===b&&"string"==typeof c?String(c):d.unit,quantity:"quantity"===b?Number(c):Number(d.quantity),unitPrice:"unitPrice"===b?Number(c):Number(d.unitPrice),totalPrice:0,id:d.id};return e.totalPrice=e.quantity*e.unitPrice,e}))},[A,B]),M=(0,f.useCallback)(a=>{B(A.filter(b=>b.id!==a))},[A,B]),N=()=>{switch(C){case"XOF":return(0,b.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"F CFA"});case"EUR":return(0,b.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"€"});case"USD":return(0,b.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"$US"});case"GBP":return(0,b.jsx)("span",{className:"text-[10px] text-zinc-400 shrink-0",children:"£GB"});default:return""}};return(0,b.jsx)("div",{className:"canvas-wrapper overflow-hidden",style:{transform:`scale(${c})`,transition:"transform 150ms ease"},children:(0,b.jsx)("div",{ref:a,id:"canvas",className:`bg-white w-[794px] min-h-[1123px] text-zinc-900 relative shadow-xl font-sans ${c<.8?"scale-small":""}`,children:(0,b.jsxs)("div",{className:"p-12 h-full flex flex-col",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center mb-16 select-none",children:[(0,b.jsx)("div",{className:"flex items-center gap-2",children:(0,b.jsx)("span",{className:"font-bold text-2xl tracking-tight uppercase",children:E.invoice})}),(0,b.jsxs)("div",{className:"flex items-center gap-4 text-sm font-medium text-zinc-500",children:[(0,b.jsxs)("div",{className:"px-3 py-1 bg-zinc-100 rounded-md flex items-center gap-1",children:[E.reference,":",(0,b.jsx)(r,{value:d,onValueChange:h,placeholder:"REF-XXXX",className:"bg-transparent text-zinc-900 w-24 p-0 h-auto border-none focus:ring-0 text-sm font-bold"})]}),(0,b.jsx)("div",{children:new Date().toLocaleDateString("fr"===D?"fr-FR":"en-US",{month:"short",day:"numeric",year:"numeric"})})]})]}),(0,b.jsxs)("div",{className:"bg-zinc-50 rounded-2xl p-8 mb-12 border border-zinc-100",children:[(0,b.jsxs)("div",{className:"flex gap-12",children:[(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block",children:E.from}),(0,b.jsx)("div",{className:"font-bold text-zinc-900 mb-1",children:"Company Inc."}),(0,b.jsxs)("div",{className:"text-sm text-zinc-500",children:["123 Tech Boulevard",(0,b.jsx)("br",{}),"San Francisco, CA",(0,b.jsx)("br",{}),(0,b.jsx)("span",{className:"inline-block mt-1",children:i})]})]}),(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block",children:E.billedTo}),(0,b.jsx)(r,{value:j,onValueChange:k,placeholder:E.client,className:"bg-transparent font-bold text-zinc-900 w-full mb-1 p-0 h-auto border-none focus:ring-0"}),(0,b.jsx)(r,{value:l,onValueChange:n,placeholder:E.address,className:"bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(r,{value:o,onValueChange:p,placeholder:E.contact,className:"bg-transparent text-sm text-zinc-500 w-full p-0 h-auto border-none focus:ring-0"}),(0,b.jsx)(r,{value:s,onValueChange:v,placeholder:E.poBox,className:"bg-transparent text-sm text-zinc-500 w-24 p-0 h-auto border-none focus:ring-0"})]})]})]}),(0,b.jsxs)("div",{className:"mt-8 pt-6 border-t border-zinc-200",children:[(0,b.jsx)("label",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block",children:E.projectDetails}),(0,b.jsx)(r,{value:w,onValueChange:x,placeholder:E.object,className:"bg-transparent text-zinc-700 w-full font-medium wrap-break-word whitespace-pre-wrap"})]})]}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 bg-zinc-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider mb-4",children:[(0,b.jsx)("div",{className:"col-span-4",children:E.description}),(0,b.jsx)("div",{className:"col-span-1 text-center",children:E.unit}),(0,b.jsx)("div",{className:"col-span-1 text-center",children:E.qty}),(0,b.jsx)("div",{className:"col-span-3 text-right",children:E.unitPrice}),(0,b.jsx)("div",{className:"col-span-3 text-right",children:E.total})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[A.map(a=>(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 bg-white border border-zinc-100 rounded-lg items-center hover:border-zinc-300 transition-colors group relative",children:[(0,b.jsxs)("div",{className:"col-span-4 font-medium text-zinc-800",children:[(0,b.jsx)(r,{value:a.designation,onValueChange:b=>L(a.id,"designation",b),className:"w-full bg-transparent wrap-break-word whitespace-pre-wrap"}),(0,b.jsx)("button",{onClick:()=>M(a.id),className:"absolute -left-3 top-1/2 -translate-y-1/2 text-white p-1 cursor-pointer z-50 bg-red-500 rounded-md shadow-sm hover:bg-red-600 transition-colors",children:(0,b.jsx)(u.Trash2,{className:"w-3 h-3"})})]}),(0,b.jsx)("div",{className:"col-span-1",children:(0,b.jsx)(r,{value:a.unit,onValueChange:b=>L(a.id,"unit",b),className:"w-full text-center text-zinc-500 bg-transparent text-sm"})}),(0,b.jsx)("div",{className:"col-span-1",children:(0,b.jsx)(r,{value:a.quantity,onValueChange:b=>L(a.id,"quantity",Number(b)),className:"w-full text-center font-mono bg-zinc-50 rounded text-zinc-700 text-sm py-1"})}),(0,b.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden",children:[(0,b.jsx)(r,{value:a.unitPrice,onValueChange:b=>L(a.id,"unitPrice",Number(b)),className:"w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"}),N()]}),(0,b.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-bold text-zinc-900 overflow-hidden",children:[(0,b.jsx)("span",{className:"text-sm",children:H(a.totalPrice).replace(/\s?[A-Z$€£]{1,3}$/,"")}),N()]})]},a.id)),(0,b.jsxs)("div",{className:"grid grid-cols-12 gap-4 px-4 py-3 border border-dashed border-zinc-200 rounded-lg items-center hover:bg-zinc-50 transition-colors cursor-text",children:[(0,b.jsxs)("div",{className:"col-span-4 flex items-center gap-2",children:[(0,b.jsx)(q.Button,{className:"w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-400 cursor-pointer",onClick:I,children:(0,b.jsx)(t.Plus,{className:"w-3 h-3"})}),(0,b.jsx)(r,{value:F.designation,onValueChange:a=>G({...F,designation:a}),placeholder:E.add,className:"w-full bg-transparent text-sm text-zinc-500"})]}),(0,b.jsx)("div",{className:"col-span-1",children:(0,b.jsx)(r,{value:F.unit,onValueChange:a=>G({...F,unit:a}),className:"w-full text-center bg-transparent text-sm text-zinc-400"})}),(0,b.jsx)("div",{className:"col-span-1 text-center",children:(0,b.jsx)(r,{value:F.quantity,onValueChange:a=>G({...F,quantity:Number(a),totalPrice:Number(a)*F.unitPrice}),className:"w-full text-center bg-transparent text-sm text-zinc-400"})}),(0,b.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-900 overflow-hidden",children:[(0,b.jsx)(r,{value:F.unitPrice,onValueChange:a=>G({...F,unitPrice:Number(a),totalPrice:F.quantity*Number(a)}),className:"w-full text-right bg-zinc-50 rounded text-sm py-1 px-1"}),N()]}),(0,b.jsxs)("div",{className:"col-span-3 flex items-center justify-end gap-1 font-mono font-medium text-zinc-400 overflow-hidden",children:[(0,b.jsx)("span",{className:"text-sm",children:H(F.totalPrice).replace(/\s?[A-Z$€£]{1,3}$/,"")}),N()]})]})]})]}),(0,b.jsx)("div",{className:"border-t border-zinc-100 pt-8 mt-8",children:(0,b.jsxs)("div",{className:"flex justify-between items-end",children:[(0,b.jsxs)("div",{className:"w-1/2",children:[(0,b.jsx)("div",{className:"text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4",children:E.authorizedSignature}),(0,b.jsx)(r,{value:y,onValueChange:z,placeholder:E.managerName,className:"bg-transparent text-xl font-handwriting text-zinc-800 w-full border-b border-zinc-200 pb-2"})]}),(0,b.jsxs)("div",{className:"w-2/3",children:[(0,b.jsxs)("div",{className:"flex justify-between mb-3 text-sm text-zinc-500",children:[(0,b.jsx)("span",{children:E.subtotal}),(0,b.jsx)("span",{className:"font-mono",children:H(J)})]}),(0,b.jsxs)("div",{className:"flex justify-between mb-3 text-sm text-zinc-500",children:[(0,b.jsx)("span",{children:E.totalMaterial}),(0,b.jsx)("span",{children:K})]}),(0,b.jsxs)("div",{className:"flex justify-between pt-4 border-t border-zinc-200 text-lg font-bold text-zinc-900 gap-4",children:[(0,b.jsx)("span",{className:"whitespace-nowrap",children:E.totalDue}),(0,b.jsx)("span",{className:"font-mono break-all text-right",children:H(J)})]})]})]})})]})})})}var B=a.i(97895),C=a.i(33441);let D=[{id:"default",name:"Default",color:"bg-white",border:"border-gray-200"},{id:"style1",name:"Modern",color:"bg-slate-800",border:"border-slate-600"},{id:"style2",name:"Corporate",color:"bg-blue-900",border:"border-blue-700"},{id:"style3",name:"Creative",color:"bg-purple-600",border:"border-purple-400"},{id:"style4",name:"Classic",color:"bg-[#fdfbf7]",border:"border-gray-400"},{id:"style5",name:"Tech",color:"bg-zinc-950",border:"border-green-500"}];function E({divRef:a}){let{style:c,setStyle:d}=(0,g.useInvoice)(),[e,h]=(0,f.useState)(1.1),i=(0,f.useCallback)(()=>h(a=>Math.min(1.5,+(a+.1).toFixed(2))),[]),j=(0,f.useCallback)(()=>h(a=>Math.max(.5,+(a-.1).toFixed(2))),[]);return(0,f.useEffect)(()=>{let a=a=>{let b="+"===a.key||"="===a.key||"NumpadAdd"===a.code,c="-"===a.key||"NumpadSubtract"===a.code;(a.ctrlKey||a.metaKey)&&b?(a.preventDefault(),i()):(a.ctrlKey||a.metaKey)&&c&&(a.preventDefault(),j())};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[i,j]),(0,b.jsx)("div",{className:"w-full gap-8",children:(0,b.jsx)("div",{className:"canvas-viewer p-4 flex flex-col items-center w-full",children:(()=>{switch(c){case"style1":return(0,b.jsx)(v,{divRef:a,scale:e});case"style2":return(0,b.jsx)(w,{divRef:a,scale:e});case"style3":return(0,b.jsx)(y,{divRef:a,scale:e});case"style4":return(0,b.jsx)(z,{divRef:a,scale:e});case"style5":return(0,b.jsx)(A,{divRef:a,scale:e});default:return(0,b.jsx)(s,{divRef:a,scale:e})}})()})})}let F=()=>{let{style:a,setStyle:c}=(0,g.useInvoice)();return(0,b.jsx)("div",{className:"w-full max-w-[700px] px-3",children:(0,b.jsx)("div",{className:"bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex gap-6 overflow-x-auto justify-center",children:D.map(d=>(0,b.jsxs)("button",{id:"Invoice_Choice_btn",onClick:()=>c(d.id),className:(0,B.cn)("relative w-20 h-28 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-end overflow-hidden group shadow-sm hover:shadow-md cursor-pointer",a===d.id?"border-primary rounded-xl! ring-2 ring-primary/30 scale-105 shadow-xl":"border-transparent hover:border-gray-200 hover:scale-105 opacity-80 hover:opacity-100"),children:[(0,b.jsxs)("div",{className:(0,B.cn)("absolute inset-0 w-full h-full",d.color),children:[(0,b.jsx)("div",{className:"absolute top-4 left-4 right-4 h-2 bg-current opacity-20 rounded-full"}),(0,b.jsx)("div",{className:"absolute top-8 left-4 w-1/3 h-2 bg-current opacity-20 rounded-full"}),(0,b.jsx)("div",{className:"absolute top-16 left-4 right-4 bottom-12 bg-white/10 rounded-lg border border-white/5"})]}),(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center z-10 opacity-0 transition-opacity duration-300",style:{opacity:+(a===d.id)},children:(0,b.jsx)("div",{className:"bg-primary text-white rounded-full p-2 shadow-lg scale-0 animate-in zoom-in duration-300",children:(0,b.jsx)(C.Check,{className:"w-5 h-5"})})}),(0,b.jsx)("div",{className:"relative z-20 w-full bg-white/95 backdrop-blur-sm py-2 text-center border-t border-gray-100",children:(0,b.jsx)("span",{className:(0,B.cn)("text-[10px] font-bold uppercase tracking-wider",a===d.id?"text-primary":"text-gray-500"),children:d.name})})]},d.id))})})};var G=a.i(6704),H=a.i(84505),I=a.i(96221),J=a.i(4720),K=a.i(14548),L=a.i(1027),M=a.i(33508);let N=(0,n.default)("settings-2",[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);var O=a.i(92258),P=a.i(92759),Q=a.i(20735),R=a.i(66718),S=a.i(87532),T=a.i(60246),U=a.i(83497),V=a.i(50522),W=a.i(8406);function X(){let{setClientName:a,setClientAddress:c,setClientContact:d,setClientPOBox:h,itemsArr:i,setItemsArr:j,setClientId:k}=(0,g.useInvoice)(),{t:l}=(0,e.useLanguage)(),[n,o]=(0,f.useState)(!1),[p,r]=(0,f.useState)("clients"),[s,u]=(0,f.useState)(""),[v,w]=(0,f.useState)([]),[x,y]=(0,f.useState)([]),[z,A]=(0,f.useState)(!1);(0,f.useEffect)(()=>{n&&(async()=>{A(!0);try{let a=localStorage.getItem("user");if(!a)return;let b=JSON.parse(a);if(window.electronAPI){let a=await window.electronAPI.getData("clients"===p?"clients":"products");a.success&&("clients"===p?w(a.data):y(a.data))}else{let a=await fetch("clients"===p?"/api/clients":"/api/products",{headers:{Authorization:`Bearer ${b.token}`}});if(a.ok){let b=await a.json();"clients"===p?w(b):y(b)}}}catch(a){console.error("Failed to fetch autofill data",a)}finally{A(!1)}})()},[n,p]);let B=v.filter(a=>{let b=s.toLowerCase();return`${a.firstName||""} ${a.name||""}`.toLowerCase().includes(b)||a.companyName&&a.companyName.toLowerCase().includes(b)||a.email&&a.email.toLowerCase().includes(b)||a.phone&&a.phone.toLowerCase().includes(b)}),C=x.filter(a=>a.name.toLowerCase().includes(s.toLowerCase()));return n?(0,b.jsxs)("div",{className:"fixed right-6 top-32 z-50 w-80 bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] animate-in slide-in-from-right-8 duration-300",children:[(0,b.jsxs)("div",{className:"bg-indigo-600 p-4 text-white flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 font-bold",children:[(0,b.jsx)(W.Sparkles,{className:"w-4 h-4 text-amber-300"}),(0,b.jsx)("span",{children:l("quickAssistantShort")})]}),(0,b.jsx)(q.Button,{variant:"ghost",size:"icon",className:"h-6 w-6 text-white hover:bg-white/20 rounded-full",onClick:()=>o(!1),children:(0,b.jsx)(M.X,{className:"w-4 h-4"})})]}),(0,b.jsxs)("div",{className:"flex border-b border-border/50 bg-muted/20",children:[(0,b.jsxs)("button",{className:`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${"clients"===p?"border-indigo-600 text-indigo-600":"border-transparent text-muted-foreground hover:bg-muted/50"}`,onClick:()=>{r("clients"),u("")},children:[(0,b.jsx)(T.Users,{className:"w-4 h-4"})," ",l("clients")]}),(0,b.jsxs)("button",{className:`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${"products"===p?"border-indigo-600 text-indigo-600":"border-transparent text-muted-foreground hover:bg-muted/50"}`,onClick:()=>{r("products"),u("")},children:[(0,b.jsx)(U.Package,{className:"w-4 h-4"})," ",l("catalog")]})]}),(0,b.jsx)("div",{className:"p-3 border-b border-border/50 bg-background/50",children:(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(S.Search,{className:"absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),(0,b.jsx)(R.Input,{autoFocus:!0,placeholder:l("searchQuickAssistant").replace("{type}","clients"===p?l("client"):l("article")),value:s,onChange:a=>u(a.target.value),className:"pl-9 bg-background h-9 text-sm rounded-xl"})]})}),(0,b.jsx)("div",{className:"flex-1 overflow-y-auto p-2 space-y-2 bg-muted/10",children:z?(0,b.jsx)("div",{className:"flex flex-col gap-2 p-2",children:[1,2,3,4].map(a=>(0,b.jsx)("div",{className:"h-12 bg-muted rounded-lg animate-pulse"},a))}):"clients"===p?B.length>0?B.map(e=>(0,b.jsxs)("button",{onClick:()=>{a(`${e.firstName?e.firstName+" ":""}${e.name}${e.companyName?` - ${e.companyName}`:""}`),c(e.address||""),d(e.phone||e.email||""),h(""),k(e.id),o(!1)},className:"w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-bold text-sm text-foreground group-hover:text-indigo-900 break-words mb-0.5",children:`${e.firstName?e.firstName+" ":""}${e.name}${e.companyName?` (${e.companyName})`:""}`}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground truncate max-w-[200px]",children:e.email||e.phone||l("noContact")})]}),(0,b.jsx)(V.ChevronRight,{className:"w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"})]},e.id)):(0,b.jsx)("div",{className:"p-8 text-center text-xs text-muted-foreground",children:l("noClientFound")}):C.length>0?C.map(a=>(0,b.jsxs)("button",{onClick:()=>{j([...i,{id:m(),designation:a.name,unit:"service"===a.type?l("servicePrestation"):l("unitPriceShort"),quantity:1,unitPrice:a.price,totalPrice:+a.price}]),o(!1)},className:"w-full text-left p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors group flex items-center justify-between",children:[(0,b.jsxs)("div",{className:"pr-2",children:[(0,b.jsx)("p",{className:"font-bold text-sm text-foreground group-hover:text-indigo-900 line-clamp-1",children:a.name}),(0,b.jsxs)("p",{className:"text-xs font-mono text-indigo-600 font-bold mt-0.5",children:[a.price.toLocaleString()," XOF"]})]}),(0,b.jsx)("div",{className:"shrink-0 bg-indigo-100 text-indigo-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",children:(0,b.jsx)(t.Plus,{className:"w-3.5 h-3.5"})})]},a.id)):(0,b.jsx)("div",{className:"p-8 text-center text-xs text-muted-foreground",children:l("noItemFound")})})]}):(0,b.jsx)(q.Button,{onClick:()=>o(!0),className:"fixed right-6 top-32 z-50 rounded-full size-12 shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-0 border-2 border-indigo-400/30 transition-all hover:scale-110",title:l("quickAssistant"),children:(0,b.jsx)(W.Sparkles,{className:"w-6 h-6 text-amber-300"})})}var Y=a.i(99209),Z=a.i(70430),$=a.i(44153),_=a.i(42966);let aa=(a,b="XOF",c="fr")=>new Intl.NumberFormat("fr"===c?"fr-FR":"en-US",{style:"currency",currency:b,minimumFractionDigits:2}).format(a),ab=a=>({totalht:a.reduce((a,b)=>a+(b.totalPrice||b.quantity*b.unitPrice),0),totalmaterial:a.reduce((a,b)=>a+Number(b.quantity),0)});function ac({initialData:a,invoiceId:c}){let[d,h]=(0,f.useState)(!1),i=(0,f.useRef)(null),{performAction:j,loading:k}=(0,$.useIPCAction)(),{t:l,language:m}=(0,e.useLanguage)(),{itemsArr:n,city:o,clientName:p,clientAddress:r,clientContact:s,clientPOBox:t,reference:u,object:v,managerName:w,amountWords:x,style:y,currency:z,setInvoiceData:A,clientId:C,totalMaterial:D,totalHT:R}=(0,g.useInvoice)(),[S,T]=(0,f.useState)(a?.type||"invoice"),[U,V]=(0,f.useState)(a?.status||"draft"),[W,ac]=(0,f.useState)(a?.dueDate?new Date(a.dueDate).toISOString().split("T")[0]:""),[ad,ae]=(0,f.useState)(a?.isRecurring||!1),[af,ag]=(0,f.useState)(a?.recurrenceFreq||"monthly"),[ah,ai]=(0,f.useState)(!1),[aj,ak]=(0,f.useState)(""),[al,am]=(0,f.useState)(!1),[an,ao]=(0,f.useState)([]),[ap,aq]=(0,f.useState)(!1),{addNotification:ar}=(0,Q.useNotifications)();(0,f.useEffect)(()=>{a&&A(a)},[a,A]),(0,f.useEffect)(()=>{ah&&(async()=>{aq(!0);try{if(window.electronAPI){let a=await window.electronAPI.getData("clients");a.success&&ao(a.data)}}catch(a){console.error("Failed to fetch clients",a)}finally{aq(!1)}})()},[ah]);let as=async()=>{if(!u||!p||0===n.length)return void G.default.error(l("fillFields"));h(!0);try{await at();let a={reference:u,city:o,clientName:p,clientAddress:r,clientContact:s,clientPOBox:t,object:v,items:n,totalHT:n.reduce((a,b)=>a+(b.totalPrice||b.quantity*b.unitPrice),0),totalMaterial:n.reduce((a,b)=>a+Number(b.quantity),0),managerName:w,amountWords:x,style:y,type:S,currencyCode:z,language:m},b=function(a){let{style:b}=a,c=a.language||"fr",d=_.translations[c]||_.translations.fr;switch(b){case"style1":return function(a,b,c){let{totalht:d,totalmaterial:e}=ab(a.items),f=Math.max(1,Math.ceil(a.items.length/11)),g=Array.from({length:f}).map((g,h)=>{let i=a.items.slice(11*h,(h+1)*11),j=h===f-1;return`
    <div class="page ${h>0?"page-break":""}">
      ${0===h?`
      <div class="header">
          <div class="logo-section">
              <h1>${"quote"===a.type?b.proforma:b.invoice}</h1>
              <div class="ref-row"><span class="label">${b.reference}:</span> <span class="value">${a.reference}</span></div>
          </div>
          <div class="date-section">
              <div class="city">${a.city}</div>
              <div class="date">${new Date().toLocaleDateString("fr"===c?"fr-FR":"en-US")}</div>
          </div>
      </div>

      <div class="info-grid">
          <div class="col">
              <h3>${b.billedTo}</h3>
              <div class="client-name">${a.clientName}</div>
              <div class="client-detail">${a.clientAddress||""}</div>
              <div class="client-detail">
                  ${a.clientContact||""}
                  ${a.clientPOBox?` - ${b.poBox} ${a.clientPOBox}`:""}
              </div>
          </div>
          <div class="col">
              <h3>${b.projectDetails}</h3>
              <div class="project-box">
                  <div class="label">${b.object}</div>
                  <div class="object">${a.object}</div>
              </div>
          </div>
      </div>`:'<div style="height: 50px;"></div>'}

      <table>
          <thead>
              <tr>
                  <th style="text-align:left; width: 40%">${b.description}</th>
                  <th style="text-align:center">${b.unit}</th>
                  <th style="text-align:center">${b.qty}</th>
                  <th style="text-align:right">${b.unitPrice}</th>
                  <th style="text-align:right">${b.totalPrice}</th>
              </tr>
          </thead>
          <tbody>
            ${i.map((b,d)=>`
            <tr class="${d%2==0?"":"bg-gray"}">
              <td style="text-align:left; word-break: break-word; max-width: 300px;">${b.designation}</td>
              <td style="text-align:center">${b.unit}</td>
              <td style="text-align:center">${b.quantity}</td>
              <td style="text-align:right; white-space: nowrap;">${aa(b.unitPrice,a.currencyCode,c)}</td>
              <td style="text-align:right; font-weight:bold; white-space: nowrap;">${aa(b.totalPrice||b.quantity*b.unitPrice,a.currencyCode,c)}</td>
            </tr>`).join("")}
          </tbody>
      </table>

      ${j?`
      <div class="footer-totals">
            <div class="footer-bottom">
                <div class="signature-area">
                    <div class="sig-label">${b.authorizedSignature}</div>
                    <div class="sig-name">${a.managerName}</div>
                </div>
                <div class="totals-section">
                    <div class="total-row subt">
                        <span>${b.totalMaterial}</span>
                        <span>${e}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${b.total}</span>
                        <span class="grand-val">${aa(d,a.currencyCode,c)}</span>
                    </div>
                </div>
            </div>
      </div>`:""}

      <div class="page-num">${h+1} / ${f}</div>
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
  <body>${g}</body>
  </html>`}(a,d,c);case"style2":return function(a,b,c){let{totalht:d,totalmaterial:e}=ab(a.items),f=Math.max(1,Math.ceil(a.items.length/14)),g=Array.from({length:f}).map((g,h)=>{let i=a.items.slice(14*h,(h+1)*14),j=h===f-1;return`<div class="page ${h>0?"page-break":""}">
       ${0===h?`
         <div class="header-band">
             <div class="logo-container">
                 <div class="logo-circle"></div>
             </div>
             <h2 class="company-name">COMPANY</h2>
         </div>
         <div class="header-main">
             <div class="left">
                 <h1 class="title">${"quote"===a.type?b.proforma:b.invoice}</h1>
                 <div class="meta"><span style="color:#64748b;">#</span> ${a.reference}</div>
             </div>
             <div class="right">
                 <div class="city-date">${a.city}</div>
                 <div class="date-sub">${new Date().toLocaleDateString("fr"===c?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
             </div>
         </div>
         <div class="info-block">
             <div class="info-col">
                 <h3>${b.billedTo}</h3>
                 <div class="client">${a.clientName}</div>
                 <div class="detail">${a.clientAddress||""}</div>
                 <div class="detail">
                    ${a.clientPOBox?`${b.poBox}: ${a.clientPOBox}`:""}
                    ${a.clientContact?`${b.contact}: ${a.clientContact}`:""}
                 </div>
             </div>
             <div class="info-col">
                 <h3>${b.description}</h3>
                 <div class="description-box">${a.object}</div>
             </div>
         </div>`:'<div style="height:40px"></div>'}

         <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left">${b.description}</th>
                        <th>${b.unit}</th>
                        <th>${b.qty}</th>
                        <th style="text-align:right">${b.unitPrice}</th>
                        <th style="text-align:right">${b.totalPrice}</th>
                    </tr>
                </thead>
                <tbody>
                    ${i.map((b,d)=>`
                    <tr class="${d%2==1?"bg-gray":""}">
                        <td style="text-align:left; word-break: break-word; max-width: 300px;">${b.designation}</td>
                        <td class="center">${b.unit}</td>
                        <td class="center">${b.quantity}</td>
                        <td style="text-align:right; white-space: nowrap;">${aa(b.unitPrice,a.currencyCode,c)}</td>
                        <td style="text-align:right; font-weight:bold; color:#1e293b; white-space: nowrap;">${aa(b.totalPrice||b.quantity*b.unitPrice,a.currencyCode,c)}</td>
                    </tr>`).join("")}
                </tbody>
            </table>
         </div>

         ${j?`
         <div class="summary">
             <div class="summary-box">
                 <div class="footer-layout">
                <div class="sig-area">
                    <div class="sig-label">${b.authorizedSignature}</div>
                    <div class="sig-name">${a.managerName}</div>
                </div>
                <div class="totals-area">
                    <div class="total-row subt"><span>${b.totalMaterial}</span> <span>${e}</span></div>
                    <div class="total-row subt"><span>${b.subtotal}</span> <span>${aa(d,a.currencyCode,c)}</span></div>
                    <div class="total-row grand"><span>${b.totalDue}</span> <span>${aa(d,a.currencyCode,c)}</span></div>
                </div>
            </div>
            <div class="footer-bar"></div>`:'<div class="footer-bar" style="position:absolute; bottom:0;"></div>'}
         <div class="page-num" style="position:absolute; bottom:20px; right:40px; font-size:10px; color:#9ca3af; z-index:20;">${h+1} / ${f}</div>
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
    </style></head><body>${g}</body></html>`}(a,d,c);case"style3":return function(a,b,c){let{totalht:d,totalmaterial:e}=ab(a.items),f=new Date().toLocaleDateString("fr"===c?"fr-FR":"en-US"),g=Math.max(1,Math.ceil(a.items.length/6)),h=`
        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: #fb923c; opacity: 0.15; border-bottom-left-radius: 200px; z-index: 0;"></div>
        <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: #a855f7; opacity: 0.15; border-top-right-radius: 200px; z-index: 0;"></div>
    `,i=Array.from({length:g}).map((i,j)=>{let k=a.items.slice(6*j,(j+1)*6),l=j===g-1;return`<div class="page ${j>0?"page-break":""}">
        ${h}
        <div class="content-wrapper">
            ${0===j?`
            <div class="header">
                <div>
                    <div class="brand">
                        <div class="hexagon"></div>
                        <span>CREATIVE</span>
                    </div>
                    <div class="sub-meta">
                        <span class="city">${a.city}</span>
                        <span class="date">${f}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <h1 class="main-title">${"quote"===a.type?b.proforma:b.invoice}</h1>
                    <div class="ref-badge"><span style="opacity:0.6;">#</span> ${a.reference}</div>
                </div>
            </div>

            <div class="client-box">
                <div class="billed-to">
                    <h3>${b.billedTo}</h3>
                    <div class="client-name">${a.clientName}</div>
                    <div class="client-addr">${a.clientAddress||""}</div>
                    <div class="client-addr">${a.clientContact||""}</div>
                    <div class="client-addr">${a.clientPOBox?`${b.poBox}: ${a.clientPOBox}`:""}</div>
                </div>
                <div class="project-desc">
                    <h3>${b.projectDetails}</h3>
                    <div class="desc-text">${a.object}</div>
                </div>
            </div>`:'<div style="height: 50px;"></div>'}

            <div class="grid-header">
                <div class="c-desc">${b.description}</div>
                <div class="c-unit">${b.unit}</div>
                <div class="c-qty">${b.qty}</div>
                <div class="c-total">${b.totalPrice}</div>
            </div>

            <div class="items-grid">
                ${k.map(d=>`
                <div class="item-card">
                    <div class="i-desc">
                        <div class="name">${d.designation}</div>
                        <div class="price-mini">${b.unitPrice}: ${aa(d.unitPrice,a.currencyCode,c)}</div>
                    </div>
                    <div class="i-unit">${d.unit}</div>
                    <div class="i-qty"><span>${d.quantity}</span></div>
                    <div class="i-total">${aa(d.totalPrice||d.quantity*d.unitPrice,a.currencyCode,c)}</div>
                </div>`).join("")}
            </div>

            ${l?`
            <div class="footer">
                <div class="summary-card">
                    <div class="sum-left">
                        <div class="label">${b.totalMaterial}</div>
                        <div class="val">${e}</div>
                    </div>
                    <div class="sum-right">
                         <div class="label">${b.totalDue}</div>
                         <div class="val-lg">${aa(d,a.currencyCode,c)}</div>
                    </div>
                </div>
                <div class="signature-block">
                    <div class="sig">${a.managerName}</div>
                    <div class="label">${b.authorizedSignature}</div>
                </div>
            </div>`:""}
        </div>
        <div class="page-num" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); font-size:10px; color:#9ca3af; z-index:20;">${j+1} / ${g}</div>
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
    </style></head><body>${i}</body></html>`}(a,d,c);case"style4":return function(a,b,c){let{totalht:d,totalmaterial:e}=ab(a.items),f=Math.max(1,Math.ceil(a.items.length/11)),g=Array.from({length:f}).map((g,h)=>{let i=a.items.slice(11*h,(h+1)*11),j=h===f-1;return`<div class="page ${h>0?"page-break":""}">
            <div class="top-accent"></div>
            <div class="inner-content">
            ${0===h?`
            <div class="header">
                <div class="header-left">
                    <h1 class="main-title">${"quote"===a.type?b.proforma:b.invoice}</h1>
                    <div class="ref-row">
                        <span class="ref-label">${b.reference}:</span>
                        <span class="ref-value">${a.reference}</span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="company-name">Company Name</div>
                    <div class="city-date">
                        <span class="city">${a.city}</span>,
                        <span class="date">${new Date().toLocaleDateString("fr"===c?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"})}</span>
                    </div>
                </div>
            </div>

            <div class="info-layout">
                <div class="billed-col">
                    <h3 class="sect-label">${b.billedTo}</h3>
                    <div class="client-name">${a.clientName}</div>
                    <div class="client-detail">${a.clientAddress||""}</div>
                    <div class="client-detail">${a.clientContact||""}</div>
                    <div class="client-detail">${a.clientPOBox?`${b.poBox} ${a.clientPOBox}`:""}</div>
                </div>
                <div class="project-col">
                    <h3 class="sect-label">${b.projectDetails}</h3>
                    <div class="object-box">${a.object}</div>
                </div>
            </div>`:'<div style="height:60px"></div>'}

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style="text-align:left">${b.description}</th>
                            <th style="width: 80px;">${b.unit}</th>
                            <th style="width: 80px;">${b.qty}</th>
                            <th style="width: 120px; text-align:right">${b.price}</th>
                            <th style="width: 140px; text-align:right">${b.total}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${i.map(b=>`
                        <tr>
                            <td style="text-align:left; font-weight: 500;">${b.designation}</td>
                            <td>${b.unit}</td>
                            <td>${b.quantity}</td>
                            <td style="text-align:right; color: #64748b;">${aa(b.unitPrice,a.currencyCode,c)}</td>
                            <td style="text-align:right; font-weight: 600; color: #0f172a;">${aa(b.totalPrice||b.quantity*b.unitPrice,a.currencyCode,c)}</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>

            ${j?`
            <div class="footer-area">
                <div class="totals-section">
                    <div class="total-row subt">
                        <span class="label">${b.subtotal}</span>
                        <span class="value">${aa(d,a.currencyCode,c)}</span>
                    </div>
                    <div class="total-row subt">
                        <span class="label">${b.totalMaterial}</span>
                        <span class="value">${e}</span>
                    </div>
                    <div class="total-row grand">
                        <span class="label">${b.total}</span>
                        <span class="value">${aa(d,a.currencyCode,c)}</span>
                    </div>
                </div>

                <div class="signature-section">
                    <div class="sig-note">

                    </div>
                    <div class="sig-block">
                        <div class="sig-name">${a.managerName}</div>
                        <div class="sig-label">${b.authorizedSignature}</div>
                    </div>
                </div>
            </div>`:""}
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:60px; font-size:10px; color:#94a3b8;">${h+1} / ${f}</div>
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
    </style></head><body>${g}</body></html>`}(a,d,c);case"style5":return function(a,b,c){let{totalht:d,totalmaterial:e}=ab(a.items),f=Math.max(1,Math.ceil(a.items.length/8)),g=Array.from({length:f}).map((g,h)=>{let i=a.items.slice(8*h,(h+1)*8),j=h===f-1;return`<div class="page ${h>0?"page-break":""}">
            <div class="content">
            ${0===h?`
            <div class="header">
                <div class="brand">
                    <div class="zap-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span class="brand-name">SaaS.bill</span>
                </div>
                <div class="meta-tags">
                    <div class="tag">
                        <span class="label">${b.reference}:</span>
                        <span class="val">${a.reference}</span>
                    </div>
                    <div class="date-tag">
                        ${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </div>
                </div>
            </div>

            <div class="main-info">
                <div class="info-grid">
                    <div class="info-card">
                        <label>${b.from}</label>
                        <div class="company">Company Inc.</div>
                        <div class="details">
                            123 Tech Boulevard<br>
                            San Francisco, CA<br>
                            ${a.city}
                        </div>
                    </div>
                    <div class="info-card">
                        <label>${b.billedTo}</label>
                        <div class="company">${a.clientName}</div>
                        <div class="details">
                            ${a.clientAddress||""}<br>
                            ${a.clientContact||""}<br>
                            ${a.clientPOBox?`${b.poBox} ${a.clientPOBox}`:""}
                        </div>
                    </div>
                </div>
                <div class="project-details">
                    <label>${b.projectDetails}</label>
                    <div class="project-text">${a.object}</div>
                </div>
            </div>`:'<div style="height:40px"></div>'}

            <div class="table-container">
                <div class="table-head">
                    <div class="col-desc">${b.description}</div>
                    <div class="col-unit">${b.unit}</div>
                    <div class="col-qty">${b.qty}</div>
                    <div class="col-price">${b.unitPrice}</div>
                    <div class="col-total">${b.total}</div>
                </div>
                <div class="table-body">
                    ${i.map(b=>`
                    <div class="table-row">
                        <div class="col-desc">
                            <div class="item-name">${b.designation}</div>
                        </div>
                        <div class="col-unit">${b.unit}</div>
                        <div class="col-qty">${b.quantity}</div>
                        <div class="col-price">${aa(b.unitPrice,a.currencyCode,c)}</div>
                        <div class="col-total">${aa(b.totalPrice||b.quantity*b.unitPrice,a.currencyCode,c)}</div>
                    </div>`).join("")}
                </div>
            </div>

            ${j?`
            <div class="footer">
                <div class="signature-block">
                    <label>${b.authorizedSignature}</label>
                    <div class="sig-name">${a.managerName}</div>
                </div>
                <div class="totals-block">
                    <div class="total-row">
                        <span>${b.subtotal}</span>
                        <span>${aa(d,a.currencyCode,c)}</span>
                    </div>
                    <div class="total-row">
                    <span class="label">${b.totalMaterial}</span>
                    <span class="value">${e}</span>
                    </div>
                    <div class="total-row grand">
                        <span>${b.totalDue}</span>
                        <span class="grand-val">${aa(d,a.currencyCode,c)}</span>
                    </div>
                </div>
            </div>`:""}
            </div>
            <div class="page-num" style="position:absolute; bottom:24px; right:48px; font-size:10px; color:#a1a1aa;">${h+1} / ${f}</div>
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
    </style></head><body>${g}</body></html>`}(a,d,c);default:return function(a,b,c){let d=new Date().toLocaleDateString("fr"===c?"fr-FR":"en-US"),{totalht:e,totalmaterial:f}=ab(a.items),g=Math.max(1,Math.ceil(a.items.length/14)),h=Array.from({length:g}).map((h,i)=>{let j=a.items.slice(14*i,(i+1)*14),k=i===g-1,l=a.items.slice((i+1)*14).reduce((a,b)=>a+(b.totalPrice||b.quantity*b.unitPrice),0);return`
  <div class="page ${i>0?"page-break":""}">
    ${0===i?`
    <div class="proforma-line" style="margin-top: 140px;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="font-size: 14px; font-weight: 500; color: #4b5563;">
          <span style="letter-spacing: 0.1em; color: #9ca3af; font-size: 10px;">REF:</span> ${a.reference}
        </div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: flex-end;">
        <div style="font-size: 16px; font-weight: 600;">${a.city}</div>
        <div style="font-size: 11px; font-weight: 500; color: #6b7280; border-top: 1px solid #e5e7eb; pt: 4px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
          ${b.date} ${d}
        </div>
      </div>
    </div>

    <div class="address-container">
      <div class="address-header">
        <div class="address-title">${b.billingAddress}</div>
        <div class="address-title">${b.deliveryAddress}</div>
      </div>
      <div class="client-info">
        <div style="margin-bottom: 12px; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${b.client} :</span> 
          <span style="font-size: 18px; font-weight: 800; color: #000;">${a.clientName}</span>
        </div>
        ${a.clientAddress?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${b.address} :</span> <span style="font-weight: 500;">${a.clientAddress}</span></div>`:""}
        <div style="display: flex; gap: 20px;">
          ${a.clientContact?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${b.contact} :</span> <span style="font-weight: 500;">${a.clientContact}</span></div>`:""}
          ${a.clientPOBox?`<div style="margin-bottom: 8px; display: flex;"><span class="label" style="width: 80px;">${b.poBox} :</span> <span style="font-weight: 500;">${a.clientPOBox}</span></div>`:""}
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #e5e7eb; display: flex; align-items: center;">
          <span class="label" style="width: 80px;">${b.object} :</span> 
          <span style="font-weight: 600; color: #111827;">${a.object}</span>
        </div>
      </div>
    </div>`:""}

    <div style="${i>0?"padding: 20px 30px;":""}">
      <table>
        <thead>
          <tr>
            <th>${b.description}</th>
            <th>${b.unit}</th>
            <th>${b.qty}</th>
            <th>${b.unitPrice}</th>
            <th>${b.totalPrice}</th>
          </tr>
        </thead>
        <tbody>
          ${j.map(b=>`
          <tr>
            <td>${b.designation}</td>
            <td>${b.unit}</td>
            <td>${b.quantity}</td>
            <td>${aa(b.unitPrice,a.currencyCode,c)}</td>
            <td>${aa(b.totalPrice||b.quantity*b.unitPrice,a.currencyCode,c)}</td>
          </tr>`).join("")}
        </tbody>
      </table>

      ${k&&l>0?`<div style="margin-top:8px; text-align:right; font-weight:bold;">${b.amountRemaining} : ${aa(l,a.currencyCode,c)}</div>`:""}

      ${k?`
      <table class="totals">
        <tr><td>${b.totalMaterial}</td><td>${f}</td></tr>
        <tr><td>${b.totalHT}</td><td>${aa(e,a.currencyCode,c)}</td></tr>
      </table>
      <div class="signature">
        <h2>${b.manager}</h2><br><br>
        <h1>${a.managerName}</h1>
      </div>`:""}
    </div>
    <div class="pageNumber">${i+1} / ${g}</div>
  </div>`}).join("");return`
<!DOCTYPE html>
<html lang="${c}">
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
<body>${h}</body>
</html>`}(a,d,c)}}(a),c=await window.electronAPI.generatePDF(b),d=new Blob([c],{type:"application/pdf"}),e=URL.createObjectURL(d),f=document.createElement("a");f.href=e,f.download=`Invoice_${u.replace(/\//g,"-")}.pdf`,document.body.appendChild(f),f.click(),document.body.removeChild(f),URL.revokeObjectURL(e),G.default.success(l("pdfSuccess"))}catch(a){console.error("PDF generation error",a),G.default.error(a.message||"Erreur lors de la génération du PDF")}finally{h(!1)}},at=async()=>{let a={reference:u||"",type:S,status:U,city:o||"",clientName:p||"",clientAddress:r||"",clientContact:s||"",clientPOBox:t||"",object:v||"",managerName:w||"",totalHT:n.reduce((a,b)=>a+(b.totalPrice||b.quantity*b.unitPrice),0),totalMaterial:n.reduce((a,b)=>a+Number(b.quantity),0),amountWords:x||"",items:n||[],currencyCode:z,style:y||"default",dueDate:W?new Date(W).toISOString():null,isRecurring:ad,recurrenceFreq:ad?af:null,clientId:C||null};if(!a.reference||!a.clientName||0===a.items.length)return void G.default.error(l("fillFields"));let b=c?[c,a]:[a];(await j("invoices",c?"update":"create",...b)).success&&(G.default.success(c?l("updateSuccess"):l("saveSuccess")),ar({user:"Système",action:c?"a modifié":"a créé",target:`la facture ${a.reference}`,type:"invoice",silent:!0}))},au=async()=>{if(!aj)return void G.default.error(l("invalidEmail"));if(!c){G.default.error(l("saveFirst")),ai(!1);return}am(!0);let a=c?[c,aj]:[aj];(await j("invoices","send",...a)).success&&(G.default.success(l("emailSentSuccess")),ai(!1),ak(""),V("pending"),setTimeout(at,100)),am(!1)};return(0,b.jsxs)("div",{className:"min-h-screen min-w-full bg-background pt-20 text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-hidden flex flex-col items-center p-6 md:p-10 lg:p-12 pb-32",children:[(0,b.jsxs)("div",{className:"fixed inset-0 z-0 pointer-events-none overflow-hidden",children:[(0,b.jsx)("div",{className:"absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse"}),(0,b.jsx)("div",{className:"absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"}),(0,b.jsx)("div",{className:"absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] animate-bounce-slow"}),(0,b.jsx)("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"})]}),(0,b.jsxs)("div",{className:"relative z-10 w-full max-w-8xl px- mb-16 flex justify-between items-center animate-fade-in-up",children:[(0,b.jsxs)("div",{className:"flex items-center gap-8",children:[(0,b.jsx)("div",{className:"p-5 bg-card/40 backdrop-blur-2xl rounded-lg border border-border/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-all duration-500",children:(0,b.jsx)(J.FileText,{className:"w-10 h-10 text-primary group-hover:scale-110 transition-transform"})}),(0,b.jsxs)("div",{className:"space-y-1.5",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"h-1 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"}),(0,b.jsx)("span",{className:"text-primary font-black text-[11px] uppercase tracking-[0.4em]",children:"Flow Engine v2"})]}),(0,b.jsx)("h1",{className:"text-5xl font-bold text-foreground tracking-tighter bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent",children:l("invoiceEditor")})]})]}),(0,b.jsx)("div",{className:"hidden lg:flex items-center gap-4",children:(0,b.jsxs)("div",{className:"px-6 py-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 group hover:border-white/20 transition-all",children:[(0,b.jsx)("div",{className:"size-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"}),(0,b.jsxs)("div",{className:"flex flex-col",children:[(0,b.jsx)("span",{className:"text-[10px] font-black text-white/40 uppercase tracking-widest leading-none",children:"Status"}),(0,b.jsx)("span",{className:"text-xs font-bold text-white tracking-tight",children:l("systemReady")})]})]})})]}),(0,b.jsx)(X,{}),(0,b.jsx)("div",{className:"w-full max-w-[1300px] px-8 mb-6 flex justify-end animate-fade-in-up",children:(0,b.jsxs)(Y.Popover,{children:[(0,b.jsx)(Y.PopoverTrigger,{asChild:!0,children:(0,b.jsxs)(q.Button,{variant:"outline",className:"gap-2 font-bold backdrop-blur-xl border-border/50 shadow-lg",children:[(0,b.jsx)(N,{className:"w-4 h-4"}),l("documentSettings")]})}),(0,b.jsxs)(Y.PopoverContent,{className:"w-80 p-4 space-y-4 bg-card/95 backdrop-blur-2xl border-border/50 text-foreground mr-8",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("h4",{className:"font-bold",children:l("documentType")}),(0,b.jsxs)("div",{className:"flex bg-muted rounded-lg p-1",children:[(0,b.jsx)("button",{onClick:()=>T("invoice"),className:(0,B.cn)("flex-1 text-xs py-1.5 rounded-md font-bold transition-all","invoice"===S?"bg-background shadow text-foreground":"text-muted-foreground"),children:l("invoice")}),(0,b.jsx)("button",{onClick:()=>T("quote"),className:(0,B.cn)("flex-1 text-xs py-1.5 rounded-md font-bold transition-all","quote"===S?"bg-background shadow text-foreground":"text-muted-foreground"),children:l("quote")})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("h4",{className:"font-bold",children:l("statut")}),(0,b.jsxs)("select",{value:U,onChange:a=>V(a.target.value),className:"w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",children:[(0,b.jsx)("option",{value:"draft",children:l("draft")}),(0,b.jsx)("option",{value:"pending",children:l("sent")}),(0,b.jsx)("option",{value:"paid",children:l("paid")})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(Z.Label,{className:"font-bold",children:l("dueDate")}),(0,b.jsx)("input",{type:"date",value:W,onChange:a=>ac(a.target.value),className:"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"})]}),(0,b.jsxs)("div",{className:"space-y-3 pt-3 border-t border-border/50",children:[(0,b.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,b.jsx)("input",{type:"checkbox",checked:ad,onChange:a=>ae(a.target.checked),className:"rounded text-primary focus:ring-primary w-4 h-4"}),(0,b.jsx)("span",{className:"text-sm font-bold",children:l("recurringInvoice")})]}),ad&&(0,b.jsx)("div",{className:"pl-6 animate-in slide-in-from-left-2 duration-300",children:(0,b.jsxs)("select",{value:af,onChange:a=>ag(a.target.value),className:"w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",children:[(0,b.jsx)("option",{value:"weekly",children:l("weekly")}),(0,b.jsx)("option",{value:"monthly",children:l("monthly")}),(0,b.jsx)("option",{value:"yearly",children:l("yearly")})]})})]})]})]})}),(0,b.jsx)(F,{}),(0,b.jsx)("div",{className:"relative z-10 flex-1 w-full max-w-[1300px] mt-5 flex justify-center animate-fade-in-up delay-100 px-8",children:(0,b.jsxs)("div",{className:"relative w-full group/canvas",children:[(0,b.jsx)("div",{className:"absolute -inset-10 bg-linear-to-tr from-primary/15 via-transparent to-secondary/15 rounded-lg blur-[80px] opacity-40 group-hover/canvas:opacity-70 transition duration-1000 pointer-events-none"}),(0,b.jsx)("div",{className:"relative bg-card/30 border border-border/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-lg overflow-hidden backdrop-blur-3xl p-1",children:(0,b.jsx)("div",{className:"bg-background/80 rounded-lg overflow-hidden",children:(0,b.jsx)(E,{divRef:i})})})]})}),(0,b.jsx)("div",{className:"fab-container",children:(0,b.jsxs)("div",{className:"relative flex items-center justify-center",children:[(0,b.jsx)("div",{className:"fab-item fab-item-left",children:(0,b.jsx)(q.Button,{onClick:at,disabled:d,className:(0,B.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",d&&"opacity-50"),title:l("save"),children:(0,b.jsx)(K.Save,{className:"h-7 w-7"})})}),(0,b.jsx)("div",{className:"fab-item fab-item-up",children:(0,b.jsx)(q.Button,{onClick:as,disabled:d,className:(0,B.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer",d&&"opacity-50"),title:l("download"),children:(0,b.jsx)(H.Download,{className:"h-7 w-7"})})}),(0,b.jsx)("div",{className:"fab-item fab-item-center",children:(0,b.jsx)(q.Button,{onClick:()=>{c?ai(!0):G.default.error(l("saveFirst"))},disabled:d,className:(0,B.cn)("h-14 w-14 rounded-lg shadow-2xl border border-white/10 bg-card/90 backdrop-blur-2xl text-foreground cursor-pointer ",d&&"opacity-50"),title:l("sendInvoiceEmail"),children:(0,b.jsx)(O.Mail,{className:"h-6 w-6"})})}),(0,b.jsxs)("div",{className:"relative z-10",children:[(0,b.jsx)("div",{className:"fab-glow"}),(0,b.jsx)(q.Button,{disabled:d,className:(0,B.cn)("h-18 w-18 rounded-lg bg-primary flex items-center justify-center fab-main-btn cursor-pointer",d&&"opacity-80 scale-95"),children:d?(0,b.jsx)(I.Loader2,{className:"h-8 w-8 animate-spin"}):(0,b.jsxs)("div",{className:"relative h-8 w-8",children:[(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0",children:(0,b.jsx)(L.Zap,{className:"h-8 w-8 fill-white"})}),(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rotate-0 group-hover:-rotate-90",children:(0,b.jsx)(M.X,{className:"h-8 w-8"})})]})})]})]})}),ah&&(0,b.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",children:(0,b.jsxs)("div",{className:"bg-card w-full max-w-md rounded-lg border border-border/50 shadow-2xl p-6 animate-fade-in-up",children:[(0,b.jsx)("h3",{className:"text-xl font-bold mb-2",children:l("sendInvoiceEmail")}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground mb-6",children:l("sendInvoiceEmailDesc")}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block",children:l("clientEmailAddress")}),(0,b.jsxs)("div",{className:"flex flex-col gap-3",children:[(0,b.jsxs)("select",{className:"w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer",onChange:a=>{let b=a.target.value;b&&ak(b)},value:"",children:[(0,b.jsx)("option",{value:"",disabled:!0,children:ap?"Chargement des clients...":"Choisir un client..."}),an.map(a=>a.email&&(0,b.jsxs)("option",{value:a.email,children:[a.firstName?a.firstName+" ":"",a.name," ",a.companyName?`(${a.companyName})`:""," - ",a.email]},a.id))]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"h-px bg-border/50 flex-1"}),(0,b.jsx)("span",{className:"text-[10px] text-muted-foreground font-bold uppercase tracking-widest",children:"OU"}),(0,b.jsx)("div",{className:"h-px bg-border/50 flex-1"})]}),(0,b.jsx)("input",{type:"email",value:aj,onChange:a=>ak(a.target.value),className:"w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors",placeholder:"Saisir une adresse e-mail manuellement..."})]})]}),(0,b.jsxs)("div",{className:"flex gap-3 pt-4",children:[(0,b.jsx)(q.Button,{variant:"outline",className:"flex-1 rounded-xl",onClick:()=>ai(!1),disabled:al,children:l("cancel")}),(0,b.jsxs)(q.Button,{className:"flex-1 rounded-xl gap-2",onClick:au,disabled:al||!aj,children:[al?(0,b.jsx)("div",{className:"h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"}):(0,b.jsx)(P.Send,{className:"w-4 h-4"}),l("send")]})]})]})]})})]})}var ad=a.i(33140);function ae(){return(0,b.jsxs)("div",{className:"min-h-screen min-w-full bg-background/50 flex flex-col items-center py-12 pb-32 pt-28 md:pt-28 lg:pt-28 animate-in fade-in duration-700",children:[(0,b.jsxs)("div",{className:"w-full max-w-8xl px-8 mb-16 flex justify-between items-center",children:[(0,b.jsxs)("div",{className:"flex items-center gap-8",children:[(0,b.jsx)(ad.Skeleton,{className:"p-5 size-20 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-xl"}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(ad.Skeleton,{className:"h-1 w-10 bg-primary/30 rounded-full"}),(0,b.jsx)(ad.Skeleton,{className:"h-3 w-32 bg-primary/10 rounded-full"})]}),(0,b.jsx)(ad.Skeleton,{className:"h-14 w-64 rounded-2xl bg-foreground/5 shadow-sm"})]})]}),(0,b.jsx)(ad.Skeleton,{className:"hidden lg:block h-14 w-40 rounded-2xl bg-muted/20 border border-border/40"})]}),(0,b.jsx)("div",{className:"w-full max-w-[1100px] px-8",children:(0,b.jsxs)("div",{className:"relative aspect-[3/4] md:aspect-[1/1.41] bg-card/30 border border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-3xl p-6 space-y-12",children:[(0,b.jsxs)("div",{className:"flex justify-between border-b pb-8 border-border/20",children:[(0,b.jsx)(ad.Skeleton,{className:"h-20 w-48 rounded-2xl bg-muted/20"}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsx)(ad.Skeleton,{className:"h-4 w-32 bg-muted/30 rounded-full ml-auto"}),(0,b.jsx)(ad.Skeleton,{className:"h-8 w-40 bg-muted/40 rounded-xl ml-auto"})]})]}),(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsx)(ad.Skeleton,{className:"h-4 w-24 bg-muted/20 rounded-full"}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-8",children:[(0,b.jsx)(ad.Skeleton,{className:"h-32 w-full rounded-2xl bg-muted/10 border border-border/10"}),(0,b.jsx)(ad.Skeleton,{className:"h-32 w-full rounded-2xl bg-muted/10 border border-border/10"})]})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(ad.Skeleton,{className:"h-10 w-full rounded-xl bg-muted/15"}),(0,b.jsx)(ad.Skeleton,{className:"h-40 w-full rounded-2xl bg-muted/5 border border-border/10"})]})]})})]})}function af(){let a=(0,c.useSearchParams)().get("id")||void 0,{session:e,data:f,loading:g}=(0,d.useIPCData)("invoices",a);return g||!e?(0,b.jsx)(ae,{}):(0,b.jsx)(ac,{initialData:f,invoiceId:a})}function ag(){return(0,b.jsx)(f.Suspense,{fallback:(0,b.jsx)(ae,{}),children:(0,b.jsx)(af,{})})}a.s(["default",()=>ag],8738)}];

//# sourceMappingURL=app_%28globale-layout%29_invoice_page_tsx_ab51e1fb._.js.map