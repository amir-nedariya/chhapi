(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8951],{15091:(e,t,a)=>{Promise.resolve().then(a.bind(a,32104))},22467:(e,t,a)=>{"use strict";a.d(t,{Af:()=>s,WK:()=>i,kI:()=>r,v9:()=>o});let r=async e=>({data:{message:"Fund created successfully"}}),s=async()=>({data:{data:{totalFundsReceived:1e6,totalFundsUsed:45e4,currentBalance:55e4}}}),o=async e=>({data:{message:"Fund usage recorded"}}),i=async()=>({data:{data:[{_id:"f1",title:"Medical Camp Equipment",amountUsed:5e4,date:"2026-06-10",usedBy:{name:"Dr. Arvind"},description:"Purchased beds and medicines."},{_id:"f2",title:"Orphanage Food Drive",amountUsed:15e3,date:"2026-06-05",usedBy:{name:"Super Admin"},description:"Monthly ration."},{_id:"f3",title:"School Building Repair",amountUsed:12e4,date:"2026-05-20",usedBy:{name:"Ramesh Engineer"},description:"Roofing materials."}]}})},32104:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>l});var r=a(95155),s=a(12115),o=a(22467),i=a(38434);let n=(0,a(78340).A)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]),l=()=>{let[e,t]=(0,s.useState)({title:"",year:new Date().getFullYear(),month:new Date().getMonth()+1,totalAmount:""}),[a,l]=(0,s.useState)(!1),d=a=>{t({...e,[a.target.name]:a.target.value})},c=async a=>{if(a.preventDefault(),!e.title||!e.year||!e.month||!e.totalAmount)return void i.Ay.error("All fields are required");try{l(!0),await (0,o.kI)({title:e.title,year:Number(e.year),month:Number(e.month),totalAmount:Number(e.totalAmount)}),i.Ay.success("Fund created successfully"),t({title:"",year:new Date().getFullYear(),month:new Date().getMonth()+1,totalAmount:""})}catch(e){i.Ay.error(e?.response?.data?.message||"Failed to create fund")}finally{l(!1)}};return(0,r.jsxs)("div",{className:"max-w-xl",children:[(0,r.jsx)("h2",{className:"text-xl font-semibold text-white mb-6",children:"Create New Fund"}),(0,r.jsxs)("form",{onSubmit:c,className:"bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm text-gray-400 mb-1",children:"Fund Title"}),(0,r.jsx)("input",{type:"text",name:"title",value:e.title,onChange:d,placeholder:"Fund April 2026",className:"w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm text-gray-400 mb-1",children:"Year"}),(0,r.jsx)("input",{type:"number",name:"year",value:e.year,onChange:d,className:"w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm text-gray-400 mb-1",children:"Month"}),(0,r.jsx)("select",{name:"month",value:e.month,onChange:d,className:"w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400",children:["January","February","March","April","May","June","July","August","September","October","November","December"].map((e,t)=>(0,r.jsx)("option",{value:t+1,children:e},t))})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:"block text-sm text-gray-400 mb-1",children:"Total Amount (₹)"}),(0,r.jsx)("input",{type:"number",name:"totalAmount",value:e.totalAmount,onChange:d,placeholder:"5000",className:"w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"})]}),(0,r.jsxs)("button",{disabled:a,className:"w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2.5 rounded-lg transition disabled:opacity-50",children:[(0,r.jsx)(n,{size:18}),a?"Creating...":"Create Fund"]})]})]})}},38434:(e,t,a)=>{"use strict";let r,s;a.d(t,{l$:()=>ee,Ay:()=>et,oR:()=>M});var o,i=a(12115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",r="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?a=o+" "+i+";":r+="f"==o[1]?u(i,o):o+"{"+u(i,"k"==o[1]?"":t)+"}":"object"==typeof i?r+=u(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(o,i):o+":"+i+";")}return a+(t&&s?t+"{"+s+"}":s)+r},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function f(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var o;let i=m(e),n=p[i]||(p[i]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(i));if(!p[n]){let t=i!==e?e:(e=>{let t,a,r=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?r.shift():t[3]?(a=t[3].replace(c," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(c," ").trim();return r[0]})(e);p[n]=u(s?{["@keyframes "+n]:t}:t,a?"":"."+n)}let f=a&&p.g?p.g:null;return a&&(p.g=p[n]),o=p[n],f?t.data=t.data.replace(f,o):-1===t.data.indexOf(o)&&(t.data=r?o+t.data:t.data+o),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let o=t[s];if(o&&o.call){let e=o(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+r+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}f.bind({g:1});let h,y,b,g=f.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;a.p=Object.assign({theme:y&&y()},n),a.o=/ *go\d+/.test(l),n.className=f.apply(a,r)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),b&&d[0]&&b(n),h(d,n)}return t?t(s):s}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(r=0,()=>(++r).toString()),k=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},A="default",N=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return N(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},j=[],E={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},$=(e,t=A)=>{C[t]=N(C[t]||E,e),j.forEach(([e,a])=>{e===t&&a(C[t])})},D=e=>Object.keys(C).forEach(t=>$(e,t)),F=(e=A)=>t=>{$(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},_=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return F(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},M=(e,t)=>_("blank")(e,t);M.error=_("error"),M.success=_("success"),M.loading=_("loading"),M.custom=_("custom"),M.dismiss=(e,t)=>{let a={type:3,toastId:e};t?F(t)(a):D(a)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let a={type:4,toastId:e};t?F(t)(a):D(a)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,a)=>{let r=M.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?v(t.success,e):void 0;return s?M.success(s,{id:r,...a,...null==a?void 0:a.success}):M.dismiss(r),e}).catch(e=>{let s=t.error?v(t.error,e):void 0;s?M.error(s,{id:r,...a,...null==a?void 0:a.error}):M.dismiss(r)}),e};var z=1e3,I=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,S=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,P=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${S} 0.15s ease-out forwards;
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
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,R=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,T=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${R} 1s linear infinite;
`,U=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,B=g`
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
}`,H=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${B} 0.2s ease-out forwards;
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
`,W=x("div")`
  position: absolute;
`,Y=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,J=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Z=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(J,null,t):t:"blank"===a?null:i.createElement(Y,null,i.createElement(T,{...r}),"loading"!==a&&i.createElement(W,null,"error"===a?i.createElement(P,{...r}):i.createElement(H,{...r})))},V=x("div")`
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
`,K=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,G=i.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(Z,{toast:e}),n=i.createElement(K,{...e.ariaProps},v(e.message,e));return i.createElement(V,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:o,message:n}):i.createElement(i.Fragment,null,o,n))});o=i.createElement,u.p=void 0,h=o,y=void 0,b=void 0;var Q=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let o=i.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:o,className:t,style:a},s)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=A)=>{let[a,r]=(0,i.useState)(C[t]||E),s=(0,i.useRef)(C[t]);(0,i.useEffect)(()=>(s.current!==C[t]&&r(C[t]),j.push([t,r]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),s=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=z)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,a)},[]);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&M.dismiss(a.id);return}return setTimeout(()=>M.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=(0,i.useCallback)(F(t),[t]),l=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,i.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,i.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:o}=t||{},i=a.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(a,o);return i.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let o,n,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return i.createElement(Q,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?v(a.message,a):s?s(a):i.createElement(G,{toast:a,position:l}))}))},et=M},78340:(e,t,a)=>{"use strict";a.d(t,{A:()=>l});var r=a(12115);let s=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)},o=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,r.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:s,className:n="",children:l,iconNode:d,...c},u)=>(0,r.createElement)("svg",{ref:u,...i,width:t,height:t,stroke:e,strokeWidth:s?24*Number(a)/Number(t):a,className:o("lucide",n),...!l&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0})(c)&&{"aria-hidden":"true"},...c},[...d.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(l)?l:[l]])),l=(e,t)=>{let a=(0,r.forwardRef)(({className:a,...i},l)=>(0,r.createElement)(n,{ref:l,iconNode:t,className:o(`lucide-${s(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...i}));return a.displayName=s(e),a}}},e=>{e.O(0,[8441,3794,7358],()=>e(e.s=15091)),_N_E=e.O()}]);