(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7177],{32324:(e,t,a)=>{"use strict";a.d(t,{A:()=>l,O:()=>n});var r=a(95155),s=a(12115),o=a(81926);let i=(0,s.createContext)(),n=({children:e})=>{let[t,a]=(0,s.useState)(null),[n,l]=(0,s.useState)(!0),d=async()=>{try{let e=await (0,o.Ny)();a(e.data.data)}catch(e){localStorage.removeItem("token"),a(null)}finally{l(!1)}};return(0,s.useEffect)(()=>{localStorage.getItem("token")?d():l(!1)},[]),(0,r.jsx)(i.Provider,{value:{user:t,setUser:a,loading:n,logout:()=>{localStorage.removeItem("token"),a(null)}},children:e})},l=()=>(0,s.useContext)(i)},38434:(e,t,a)=>{"use strict";let r,s;a.d(t,{l$:()=>ee,Ay:()=>et,oR:()=>_});var o,i=a(12115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",r="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?a=o+" "+i+";":r+="f"==o[1]?u(i,o):o+"{"+u(i,"k"==o[1]?"":t)+"}":"object"==typeof i?r+=u(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(o,i):o+":"+i+";")}return a+(t&&s?t+"{"+s+"}":s)+r},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function f(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var o;let i=m(e),n=p[i]||(p[i]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(i));if(!p[n]){let t=i!==e?e:(e=>{let t,a,r=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?r.shift():t[3]?(a=t[3].replace(c," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(c," ").trim();return r[0]})(e);p[n]=u(s?{["@keyframes "+n]:t}:t,a?"":"."+n)}let f=a&&p.g?p.g:null;return a&&(p.g=p[n]),o=p[n],f?t.data=t.data.replace(f,o):-1===t.data.indexOf(o)&&(t.data=r?o+t.data:t.data+o),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let o=t[s];if(o&&o.call){let e=o(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+r+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}f.bind({g:1});let y,h,g,b=f.bind({k:1});function v(e,t){let a=this||{};return function(){let r=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;a.p=Object.assign({theme:h&&h()},n),a.o=/ *go\d+/.test(l),n.className=f.apply(a,r)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),g&&d[0]&&g(n),y(d,n)}return t?t(s):s}}var x=(e,t)=>"function"==typeof e?e(t):e,w=(r=0,()=>(++r).toString()),j=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},k="default",E=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return E(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},N=[],$={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},O=(e,t=k)=>{C[t]=E(C[t]||$,e),N.forEach(([e,a])=>{e===t&&a(C[t])})},A=e=>Object.keys(C).forEach(t=>O(e,t)),D=(e=k)=>t=>{O(t,e)},I={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},P=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return D(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},_=(e,t)=>P("blank")(e,t);_.error=P("error"),_.success=P("success"),_.loading=P("loading"),_.custom=P("custom"),_.dismiss=(e,t)=>{let a={type:3,toastId:e};t?D(t)(a):A(a)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let a={type:4,toastId:e};t?D(t)(a):A(a)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,a)=>{let r=_.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?x(t.success,e):void 0;return s?_.success(s,{id:r,...a,...null==a?void 0:a.success}):_.dismiss(r),e}).catch(e=>{let s=t.error?x(t.error,e):void 0;s?_.error(s,{id:r,...a,...null==a?void 0:a.error}):_.dismiss(r)}),e};var S=1e3,z=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${M} 0.15s ease-out forwards;
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
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,R=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,F=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${R} 1s linear infinite;
`,H=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=b`
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
}`,q=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${U} 0.2s ease-out forwards;
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
`,B=v("div")`
  position: absolute;
`,Y=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(G,null,t):t:"blank"===a?null:i.createElement(Y,null,i.createElement(F,{...r}),"loading"!==a&&i.createElement(B,null,"error"===a?i.createElement(L,{...r}):i.createElement(q,{...r})))},K=v("div")`
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
`,Q=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,V=i.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=j()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(J,{toast:e}),n=i.createElement(Q,{...e.ariaProps},x(e.message,e));return i.createElement(K,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:o,message:n}):i.createElement(i.Fragment,null,o,n))});o=i.createElement,u.p=void 0,y=o,h=void 0,g=void 0;var W=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let o=i.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:o,className:t,style:a},s)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,i.useState)(C[t]||$),s=(0,i.useRef)(C[t]);(0,i.useEffect)(()=>(s.current!==C[t]&&r(C[t]),N.push([t,r]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||I[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),s=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=S)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,a)},[]);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&_.dismiss(a.id);return}return setTimeout(()=>_.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=(0,i.useCallback)(D(t),[t]),l=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,i.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,i.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:o}=t||{},i=a.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(a,o);return i.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let o,n,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:j()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return i.createElement(W,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?x(a.message,a):s?s(a):i.createElement(V,{toast:a,position:l}))}))},et=_},51743:()=>{},53337:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,51743,23)),Promise.resolve().then(a.bind(a,90528))},54480:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});var r=a(95155);let s=({text:e="Loading..."})=>(0,r.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-[#0b1224]",children:(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4",children:[(0,r.jsxs)("div",{className:"relative w-16 h-16",children:[(0,r.jsx)("div",{className:"absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"}),(0,r.jsx)("div",{className:"absolute inset-2 rounded-full bg-white/10 border border-white/20"}),(0,r.jsx)("div",{className:"absolute inset-4 rounded-full bg-cyan-400/80 animate-bounce"}),(0,r.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,r.jsx)("span",{className:"text-xl font-bold text-white",children:"₹"})})]}),(0,r.jsx)("p",{className:"text-white font-semibold",children:e})]})})},81926:(e,t,a)=>{"use strict";a.d(t,{MI:()=>r,Ny:()=>s,UR:()=>o});let r=async e=>({data:{token:"dummy-jwt-token-12345"}}),s=async()=>({data:{data:{_id:"user123",name:"Demo Super Admin",mobile:"9876543210",role:"SUPER_ADMIN",profilePhoto:{url:"https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff"}}}}),o=async e=>({data:{message:"Password changed successfully"}})},90528:(e,t,a)=>{"use strict";a.d(t,{Providers:()=>c});var r=a(95155),s=a(32324),o=a(12115),i=a(54480);let n=(0,o.createContext)(),l=({children:e})=>{let[t,a]=(0,o.useState)(!1);return(0,r.jsxs)(n.Provider,{value:{loading:t,setLoading:a},children:[t&&(0,r.jsx)(i.A,{}),e]})};var d=a(38434);function c({children:e}){return(0,r.jsxs)(s.O,{children:[(0,r.jsx)(l,{children:e}),(0,r.jsx)(d.l$,{position:"top-right",reverseOrder:!1,toastOptions:{duration:3e3,style:{borderRadius:"12px",background:"#1f2937",color:"#fff",fontSize:"14px"},success:{iconTheme:{primary:"#22c55e",secondary:"#fff"}},error:{iconTheme:{primary:"#ef4444",secondary:"#fff"}}}})]})}}},e=>{e.O(0,[3334,8441,3794,7358],()=>e(e.s=53337)),_N_E=e.O()}]);