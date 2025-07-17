const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../js/FirstScreen-BdRtZnYJ.js","../js/chunk-BGOHbAIP.js","../js/chunk-BZx1Y0xT.js","../js/chunk-B2cPBgOe.js","../js/chunk-JppToInG.js"])))=>i.map(i=>d[i]);
import{j as l}from"../js/chunk-BGOHbAIP.js";import{r as h,R as j,E as oe}from"../js/chunk-BZx1Y0xT.js";import{_ as re,R as ie}from"../js/chunk-JppToInG.js";import"../js/chunk-B2cPBgOe.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const R=new Map,C=new Map,k=new Set,E=new Set;let $=new WeakMap;function se(e){let t=e.__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t===void 0){let i=0;e.__REACT_DEVTOOLS_GLOBAL_HOOK__=t={renderers:new Map,supportsFiber:!0,inject:s=>i++,onScheduleFiberRoot:(s,c,a)=>{},onCommitFiberRoot:(s,c,a,d)=>{},onCommitFiberUnmount(){}}}if(t.isDisabled)return;const n=t.inject;t.inject=function(i){const s=n.apply(this,arguments);return typeof i.scheduleRefresh=="function"&&typeof i.setRefreshHandler=="function"&&R.set(s,i),s},t.renderers.forEach((i,s)=>{typeof i.scheduleRefresh=="function"&&typeof i.setRefreshHandler=="function"&&R.set(s,i)});const r=t.onCommitFiberRoot,o=t.onScheduleFiberRoot||(()=>{});t.onScheduleFiberRoot=function(i,s,c){return E.delete(s),$!==null&&$.set(s,c),o.apply(this,arguments)},t.onCommitFiberRoot=function(i,s,c,a){const d=R.get(i);if(d!==void 0){C.set(s,d);const p=s.current,u=p.alternate;if(u!==null){const w=u.memoizedState!=null&&u.memoizedState.element!=null&&k.has(s),v=p.memoizedState!=null&&p.memoizedState.element!=null;!w&&v?(k.add(s),E.delete(s)):w&&v||(w&&!v?(k.delete(s),a?E.add(s):C.delete(s)):!w&&!v&&a&&E.add(s))}else k.add(s)}return r.apply(this,arguments)}}window.__registerBeforePerformReactRefresh=e=>{};se(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>e=>e;const ae=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),N=__DEFINES__;Object.keys(N).forEach(e=>{const t=e.split(".");let n=ae;for(let r=0;r<t.length;r++){const o=t[r];r===t.length-1?n[o]=N[e]:n=n[o]||(n[o]={})}});function y(e){"@babel/helpers - typeof";return y=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(e)}function ce(e,t){if(y(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(y(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function le(e){var t=ce(e,"string");return y(t)=="symbol"?t:t+""}function m(e,t,n){return(t=le(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var de=class{constructor(e,t,n){this.logger=e,this.transport=t,this.importUpdatedModule=n,m(this,"hotModulesMap",new Map),m(this,"disposeMap",new Map),m(this,"pruneMap",new Map),m(this,"dataMap",new Map),m(this,"customListenersMap",new Map),m(this,"ctxToListenersMap",new Map),m(this,"currentFirstInvalidatedBy",void 0),m(this,"updateQueue",[]),m(this,"pendingUpdateQueue",!1)}async notifyListeners(e,t){const n=this.customListenersMap.get(e);n&&await Promise.allSettled(n.map(r=>r(t)))}send(e){this.transport.send(e).catch(t=>{this.logger.error(t)})}clear(){this.hotModulesMap.clear(),this.disposeMap.clear(),this.pruneMap.clear(),this.dataMap.clear(),this.customListenersMap.clear(),this.ctxToListenersMap.clear()}async prunePaths(e){await Promise.all(e.map(t=>{const n=this.disposeMap.get(t);if(n)return n(this.dataMap.get(t))})),e.forEach(t=>{const n=this.pruneMap.get(t);n&&n(this.dataMap.get(t))})}warnFailedUpdate(e,t){(!(e instanceof Error)||!e.message.includes("fetch"))&&this.logger.error(e),this.logger.error(`Failed to reload ${t}. This could be due to syntax errors or importing non-existent modules. (see errors above)`)}async queueUpdate(e){if(this.updateQueue.push(this.fetchUpdate(e)),!this.pendingUpdateQueue){this.pendingUpdateQueue=!0,await Promise.resolve(),this.pendingUpdateQueue=!1;const t=[...this.updateQueue];this.updateQueue=[],(await Promise.all(t)).forEach(n=>n&&n())}}async fetchUpdate(e){const{path:t,acceptedPath:n,firstInvalidatedBy:r}=e,o=this.hotModulesMap.get(t);if(!o)return;let i;const s=t===n,c=o.callbacks.filter(({deps:a})=>a.includes(n));if(s||c.length>0){const a=this.disposeMap.get(n);a&&await a(this.dataMap.get(n));try{i=await this.importUpdatedModule(e)}catch(d){this.warnFailedUpdate(d,n)}}return()=>{try{this.currentFirstInvalidatedBy=r;for(const{deps:d,fn:p}of c)p(d.map(u=>u===n?i:void 0));const a=s?t:`${n} via ${t}`;this.logger.debug(`hot updated: ${a}`)}finally{this.currentFirstInvalidatedBy=void 0}}}};let ue="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",fe=(e=21)=>{let t="",n=e|0;for(;n--;)t+=ue[Math.random()*64|0];return t};typeof process<"u"&&process.platform;function me(){let e,t;return{promise:new Promise((r,o)=>{e=r,t=o}),resolve:e,reject:t}}function H(e){const t=new Error(e.message||"Unknown invoke error");return Object.assign(t,e,{runnerError:new Error("RunnerError")}),t}const pe=e=>{if(e.invoke)return{...e,async invoke(n,r){const o=await e.invoke({type:"custom",event:"vite:invoke",data:{id:"send",name:n,data:r}});if("error"in o)throw H(o.error);return o.result}};if(!e.send||!e.connect)throw new Error("transport must implement send and connect when invoke is not implemented");const t=new Map;return{...e,connect({onMessage:n,onDisconnection:r}){return e.connect({onMessage(o){if(o.type==="custom"&&o.event==="vite:invoke"){const i=o.data;if(i.id.startsWith("response:")){const s=i.id.slice(9),c=t.get(s);if(!c)return;c.timeoutId&&clearTimeout(c.timeoutId),t.delete(s);const{error:a,result:d}=i.data;a?c.reject(a):c.resolve(d);return}}n(o)},onDisconnection:r})},disconnect(){var n;return t.forEach(r=>{r.reject(new Error(`transport was disconnected, cannot call ${JSON.stringify(r.name)}`))}),t.clear(),(n=e.disconnect)==null?void 0:n.call(e)},send(n){return e.send(n)},async invoke(n,r){var w;const o=fe(),i={type:"custom",event:"vite:invoke",data:{name:n,id:`send:${o}`,data:r}},s=e.send(i),{promise:c,resolve:a,reject:d}=me(),p=e.timeout??6e4;let u;p>0&&(u=setTimeout(()=>{t.delete(o),d(new Error(`transport invoke timed out after ${p}ms (data: ${JSON.stringify(i)})`))},p),(w=u==null?void 0:u.unref)==null||w.call(u)),t.set(o,{resolve:a,reject:d,name:n,timeoutId:u}),s&&s.catch(v=>{clearTimeout(u),t.delete(o),d(v)});try{return await c}catch(v){throw H(v)}}}},he=e=>{const t=pe(e);let n=!t.connect,r;return{...e,...t.connect?{async connect(o){if(n)return;if(r){await r;return}const i=t.connect({onMessage:o??(()=>{}),onDisconnection(){n=!1}});i&&(r=i,await r,r=void 0),n=!0}}:{},...t.disconnect?{async disconnect(){n&&(r&&await r,n=!1,await t.disconnect())}}:{},async send(o){if(t.send){if(!n)if(r)await r;else throw new Error("send was called before connect");await t.send(o)}},async invoke(o,i){if(!n)if(r)await r;else throw new Error("invoke was called before connect");return t.invoke(o,i)}}},I=e=>{const t=e.pingInterval??3e4;let n,r;return{async connect({onMessage:o,onDisconnection:i}){const s=e.createConnection();s.addEventListener("message",async({data:a})=>{o(JSON.parse(a))});let c=s.readyState===s.OPEN;c||await new Promise((a,d)=>{s.addEventListener("open",()=>{c=!0,a()},{once:!0}),s.addEventListener("close",async()=>{if(!c){d(new Error("WebSocket closed without opened."));return}o({type:"custom",event:"vite:ws:disconnect",data:{webSocket:s}}),i()})}),o({type:"custom",event:"vite:ws:connect",data:{webSocket:s}}),n=s,r=setInterval(()=>{s.readyState===s.OPEN&&s.send(JSON.stringify({type:"ping"}))},t)},disconnect(){clearInterval(r),n==null||n.close()},send(o){n.send(JSON.stringify(o))}}};function we(e){const t=new ve;return n=>t.enqueue(()=>e(n))}var ve=class{constructor(){m(this,"queue",[]),m(this,"pending",!1)}enqueue(e){return new Promise((t,n)=>{this.queue.push({promise:e,resolve:t,reject:n}),this.dequeue()})}dequeue(){if(this.pending)return!1;const e=this.queue.shift();return e?(this.pending=!0,e.promise().then(e.resolve).catch(e.reject).finally(()=>{this.pending=!1,this.dequeue()}),!0):!1}};const ge=__HMR_CONFIG_NAME__,be=__BASE__||"/";function f(e,t={},...n){const r=document.createElement(e);for(const[o,i]of Object.entries(t))r.setAttribute(o,i);return r.append(...n),r}const ye=`
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`,xe=()=>f("div",{class:"backdrop",part:"backdrop"},f("div",{class:"window",part:"window"},f("pre",{class:"message",part:"message"},f("span",{class:"plugin",part:"plugin"}),f("span",{class:"message-body",part:"message-body"})),f("pre",{class:"file",part:"file"}),f("pre",{class:"frame",part:"frame"}),f("pre",{class:"stack",part:"stack"}),f("div",{class:"tip",part:"tip"},"Click outside, press ",f("kbd",{},"Esc")," key, or fix the code to dismiss.",f("br"),"You can also disable this overlay by setting ",f("code",{part:"config-option-name"},"server.hmr.overlay")," to ",f("code",{part:"config-option-value"},"false")," in ",f("code",{part:"config-file-name"},ge),".")),f("style",{},ye)),F=/(?:file:\/\/)?(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g,L=/^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm,{HTMLElement:ke=class{}}=globalThis;var Ee=class extends ke{constructor(e,t=!0){var i;super(),m(this,"root",void 0),m(this,"closeOnEsc",void 0),this.root=this.attachShadow({mode:"open"}),this.root.appendChild(xe()),L.lastIndex=0;const n=e.frame&&L.test(e.frame),r=n?e.message.replace(L,""):e.message;e.plugin&&this.text(".plugin",`[plugin:${e.plugin}] `),this.text(".message-body",r.trim());const[o]=(((i=e.loc)==null?void 0:i.file)||e.id||"unknown file").split("?");e.loc?this.text(".file",`${o}:${e.loc.line}:${e.loc.column}`,t):e.id&&this.text(".file",o),n&&this.text(".frame",e.frame.trim()),this.text(".stack",e.stack,t),this.root.querySelector(".window").addEventListener("click",s=>{s.stopPropagation()}),this.addEventListener("click",()=>{this.close()}),this.closeOnEsc=s=>{(s.key==="Escape"||s.code==="Escape")&&this.close()},document.addEventListener("keydown",this.closeOnEsc)}text(e,t,n=!1){const r=this.root.querySelector(e);if(!n)r.textContent=t;else{let o=0,i;for(F.lastIndex=0;i=F.exec(t);){const{0:s,index:c}=i,a=t.slice(o,c);r.appendChild(document.createTextNode(a));const d=document.createElement("a");d.textContent=s,d.className="file-link",d.onclick=()=>{fetch(new URL(`${be}__open-in-editor?file=${encodeURIComponent(s)}`,import.meta.url))},r.appendChild(d),o+=a.length+s.length}o<t.length&&r.appendChild(document.createTextNode(t.slice(o)))}}close(){var e;(e=this.parentNode)==null||e.removeChild(this),document.removeEventListener("keydown",this.closeOnEsc)}};const x="vite-error-overlay",{customElements:S}=globalThis;S&&!S.get(x)&&S.define(x,Ee);const O=new URL(import.meta.url),Ge=__SERVER_HOST__,U=__HMR_PROTOCOL__||(O.protocol==="https:"?"wss":"ws"),J=__HMR_PORT__,Me=`${__HMR_HOSTNAME__||O.hostname}:${J||O.port}${__HMR_BASE__}`,_e=__HMR_DIRECT_TARGET__,P=__BASE__||"/",A=__HMR_TIMEOUT__,D=__WS_TOKEN__,Y=he((()=>{let e=I({createConnection:()=>new WebSocket(`${U}://${Me}?token=${D}`,"vite-hmr"),pingInterval:A});return{async connect(t){try{await e.connect(t)}catch(n){if(!J){e=I({createConnection:()=>new WebSocket(`${U}://${_e}?token=${D}`,"vite-hmr"),pingInterval:A});try{await e.connect(t)}catch(r){if(r instanceof Error&&r.message.includes("WebSocket closed without opened.")){const o=new URL(import.meta.url),i=o.host+o.pathname.replace(/@vite\/client$/,"")}}return}throw n}},async disconnect(){await e.disconnect()},send(t){e.send(t)}}})());let Z=!1;var G;typeof window<"u"&&((G=window.addEventListener)==null||G.call(window,"beforeunload",()=>{Z=!0}));function q(e){const t=new URL(e,"http://vite.dev");return t.searchParams.delete("direct"),t.pathname+t.search}let z=!0;const B=new WeakSet,Re=e=>{let t;return()=>{t&&(clearTimeout(t),t=null),t=setTimeout(()=>{location.reload()},e)}},T=Re(50),g=new de({error:e=>{},debug:(...e)=>{}},Y,async function({acceptedPath:t,timestamp:n,explicitImportRequired:r,isWithinCircularImport:o}){const[i,s]=t.split("?"),c=import(P+i.slice(1)+`?${r?"import&":""}t=${n}${s?`&${s}`:""}`);return o&&c.catch(()=>{T()}),await c});Y.connect(we(Le));async function Le(e){switch(e.type){case"connected":break;case"update":if(await g.notifyListeners("vite:beforeUpdate",e),M)if(z&&Oe()){location.reload();return}else W&&X(),z=!1;await Promise.all(e.updates.map(async t=>{if(t.type==="js-update")return g.queueUpdate(t);const{path:n,timestamp:r}=t,o=q(n),i=Array.from(document.querySelectorAll("link")).find(c=>!B.has(c)&&q(c.href).includes(o));if(!i)return;const s=`${P}${o.slice(1)}${o.includes("?")?"&":"?"}t=${r}`;return new Promise(c=>{const a=i.cloneNode();a.href=new URL(s,i.href).href;const d=()=>{i.remove(),c()};a.addEventListener("load",d),a.addEventListener("error",d),B.add(i),i.after(a)})})),await g.notifyListeners("vite:afterUpdate",e);break;case"custom":{if(await g.notifyListeners(e.event,e.data),e.event==="vite:ws:disconnect"&&M&&!Z){const t=e.data.webSocket,n=new URL(t.url);n.search="",await Pe(n.href),location.reload()}break}case"full-reload":if(await g.notifyListeners("vite:beforeFullReload",e),M)if(e.path&&e.path.endsWith(".html")){const t=decodeURI(location.pathname),n=P+e.path.slice(1);(t===n||e.path==="/index.html"||t.endsWith("/")&&t+"index.html"===n)&&T();return}else T();break;case"prune":await g.notifyListeners("vite:beforePrune",e),await g.prunePaths(e.paths);break;case"error":{if(await g.notifyListeners("vite:error",e),M){const t=e.err;W&&Se(t)}break}case"ping":break;default:return e}}const W=__HMR_ENABLE_OVERLAY__,M="document"in globalThis;function Se(e){X();const{customElements:t}=globalThis;if(t){const n=t.get(x);document.body.appendChild(new n(e))}}function X(){document.querySelectorAll(x).forEach(e=>e.close())}function Oe(){return document.querySelectorAll(x).length}async function Pe(e,t=1e3){async function n(){const r=new WebSocket(e,"vite-ping");return new Promise(o=>{function i(){o(!0),c()}function s(){o(!1),c()}function c(){r.removeEventListener("open",i),r.removeEventListener("error",s),r.close()}r.addEventListener("open",i),r.addEventListener("error",s)})}if(!await n())for(await Q(t);;)if(document.visibilityState==="visible"){if(await n())break;await Q(t)}else await Te()}function Q(e){return new Promise(t=>setTimeout(t,e))}function Te(){return new Promise(e=>{const t=async()=>{document.visibilityState==="visible"&&(e(),document.removeEventListener("visibilitychange",t))};document.addEventListener("visibilitychange",t)})}const je=new Map;"document"in globalThis&&document.querySelectorAll("style[data-vite-dev-id]").forEach(e=>{je.set(e.getAttribute("data-vite-dev-id"),e)});var K;"document"in globalThis&&((K=document.querySelector("meta[property=csp-nonce]"))==null||K.nonce);const b={xs:320,sm:640,md:768,lg:1024,xl:1280,"2xl":1536,"3xl":1920,"4xl":2560};function Ce(e){const[t,n]=h.useState(!1),r=h.useRef(null);return h.useEffect(()=>{if(typeof window>"u")return;const o=window.matchMedia(e);r.current=o,n(o.matches);const i=s=>{n(s.matches)};return o.addEventListener?o.addEventListener("change",i):o.addListener(i),()=>{o.removeEventListener?o.removeEventListener("change",i):o.removeListener(i)}},[e]),t}function _(){const[e,t]=h.useState(()=>{if(typeof window>"u")return{category:"desktop",breakpoint:"lg",width:1024,height:768,orientation:"landscape",pixelRatio:1,isTouch:!1,isRetina:!1,isMobile:!1,isTablet:!1,isDesktop:!0,hasHover:!0,prefersReducedMotion:!1,colorScheme:"dark",canHover:!0,pointerAccuracy:"fine"};const r=window.innerWidth,o=window.innerHeight;return V(r,o)}),n=h.useCallback(()=>{if(typeof window>"u")return;const r=window.innerWidth,o=window.innerHeight;t(V(r,o))},[]);return h.useEffect(()=>{if(typeof window>"u")return;let r;const o=()=>{clearTimeout(r),r=setTimeout(n,16)};window.addEventListener("resize",o,{passive:!0}),window.addEventListener("orientationchange",o,{passive:!0});const i=window.matchMedia("(prefers-color-scheme: dark)");return i.addEventListener("change",o),()=>{clearTimeout(r),window.removeEventListener("resize",o),window.removeEventListener("orientationchange",o),i.removeEventListener("change",o)}},[n]),e}function $e(e){const{breakpoint:t}=_();return h.useMemo(()=>{if(typeof e!="object"||e===null)return e;const n=e,r=Object.keys(b),o=r.indexOf(t);for(let i=o;i>=0;i--){const s=r[i];if(n[s]!==void 0)return n[s]}for(const i of r)if(n[i]!==void 0)return n[i]},[e,t])}function Ke(){return Ce("(prefers-reduced-motion: reduce)")}function V(e,t){const n=typeof window<"u"&&window.devicePixelRatio||1,r=e>t?"landscape":"portrait",o=Ne(e),i=He(e),s=typeof window<"u"&&("ontouchstart"in window||navigator.maxTouchPoints>0),c=n>=2,a=typeof window<"u"&&window.matchMedia("(hover: hover)").matches,d=typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,p=typeof window<"u"&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",u=typeof window<"u"&&window.matchMedia("(hover: hover) and (pointer: fine)").matches,w=typeof window<"u"&&window.matchMedia("(pointer: coarse)").matches?"coarse":"fine";return{category:i,breakpoint:o,width:e,height:t,orientation:r,pixelRatio:n,isTouch:s,isRetina:c,isMobile:i==="mobile",isTablet:i==="tablet",isDesktop:i==="desktop"||i==="ultrawide",hasHover:a,prefersReducedMotion:d,colorScheme:p,canHover:u,pointerAccuracy:w}}function Ne(e){const t=Object.entries(b).reverse();for(const[n,r]of t)if(e>=r)return n;return"xs"}function He(e){return e>=b["3xl"]?"ultrawide":e>=b.lg?"desktop":e>=b.sm?"tablet":"mobile"}function ee({children:e,className:t="",maxWidth:n="xl",padding:r={xs:16,sm:20,md:24,lg:32,xl:40,"2xl":48},center:o=!0,id:i}){const s=$e(r),c=h.useMemo(()=>{const a=["w-full",o?"mx-auto":"",t];if(n!=="full")switch(n){case"xs":a.push("max-w-xs");break;case"sm":a.push("max-w-sm");break;case"md":a.push("max-w-md");break;case"lg":a.push("max-w-4xl");break;case"xl":a.push("max-w-6xl");break;case"2xl":a.push("max-w-7xl");break;case"3xl":a.push("max-w-[1800px]");break;case"4xl":a.push("max-w-[2400px]");break}return a.filter(Boolean).join(" ")},[n,o,t]);return l.jsx("div",{id:i,className:c,style:{paddingLeft:`${s}px`,paddingRight:`${s}px`},children:e})}const Ie=j.lazy(()=>re(()=>import("../js/FirstScreen-BdRtZnYJ.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url));function Fe({children:e}){const{isMobile:t,isTablet:n,prefersReducedMotion:r}=_();return h.useEffect(()=>{const o=()=>{try{typeof window<"u"&&(Object.defineProperty(window,"ethereum",{get(){},set(){return!1},configurable:!1}),Object.defineProperty(window,"phantom",{get(){},set(){return!1},configurable:!1}),Object.defineProperty(window,"keplr",{get(){},set(){return!1},configurable:!1}))}catch{}},i=()=>{typeof window<"u"&&(t&&!r&&document.documentElement.style.setProperty("--animation-duration","0.3s"),n&&document.documentElement.style.setProperty("--animation-duration","0.5s"),!t&&!n&&!r&&document.documentElement.style.setProperty("--animation-duration","0.8s"))};return o(),i(),document.readyState==="loading"?(document.addEventListener("DOMContentLoaded",()=>{o(),i()}),()=>{document.removeEventListener("DOMContentLoaded",o),document.removeEventListener("DOMContentLoaded",i)}):()=>{}},[t,n,r]),l.jsx(l.Fragment,{children:e})}function Ue(){const{isMobile:e,isTablet:t,prefersReducedMotion:n}=_();return l.jsx("div",{className:"min-h-screen bg-slate-900 flex items-center justify-center",children:l.jsx(ee,{className:"text-center",children:l.jsxs("div",{className:"relative",children:[l.jsx("div",{className:`
              ${e?"w-12 h-12":t?"w-14 h-14":"w-16 h-16"} 
              border-4 border-emerald-500/20 border-t-emerald-500 rounded-full
              ${n?"":"animate-spin"}
            `}),!e&&!n&&l.jsx("div",{className:`
                absolute inset-0 
                ${t?"w-14 h-14":"w-16 h-16"} 
                border-4 border-emerald-500/10 rounded-full animate-pulse
              `}),l.jsx("div",{className:`
              absolute top-20 left-1/2 transform -translate-x-1/2 text-emerald-400 font-medium
              ${e?"text-sm":t?"text-base":"text-lg"}
              ${n?"":"animate-pulse"}
            `,children:"Loading..."})]})})})}function Ae({error:e,resetErrorBoundary:t}){const{isMobile:n,isTablet:r,breakpoint:o}=_();return h.useEffect(()=>{},[e,n,r,o]),l.jsx("div",{className:"min-h-screen bg-slate-900 flex items-center justify-center px-4",children:l.jsxs(ee,{maxWidth:n?"sm":"md",className:"text-center",children:[l.jsxs("div",{className:"mb-8",children:[l.jsx("div",{className:`
              ${n?"w-16 h-16":r?"w-18 h-18":"w-20 h-20"} 
              mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse
            `,children:l.jsx("svg",{className:`${n?"w-8 h-8":"w-10 h-10"} text-red-400`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:l.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"})})}),l.jsx("h1",{className:`${n?"text-xl":"text-2xl"} font-bold text-white mb-3`,children:"Oeps, er ging iets mis!"}),l.jsx("p",{className:`text-gray-400 mb-8 leading-relaxed ${n?"text-sm":"text-base"}`,children:"Er is een onverwachte fout opgetreden. Dit kan komen door browser extensies of een tijdelijke storing. Probeer de pagina opnieuw te laden."}),l.jsxs("div",{className:"space-y-3",children:[l.jsx("button",{onClick:t,className:`
                w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium 
                transition-all duration-200 transform hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${n?"text-sm":"text-base"}
              `,children:"Probeer opnieuw"}),l.jsx("button",{onClick:()=>window.location.href="/",className:`
                w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium 
                transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${n?"text-sm":"text-base"}
              `,children:"Ga naar homepage"})]})]}),!1]})})}function De(){return l.jsx(Fe,{children:l.jsx(oe,{FallbackComponent:Ae,onError:(e,t)=>{},onReset:()=>{window.location.reload()},children:l.jsx(j.Suspense,{fallback:l.jsx(Ue,{}),children:l.jsx(Ie,{})})})})}function te(){if(typeof window<"u"){const e=window.requestAnimationFrame;window.requestAnimationFrame=function(t){try{return e.call(window,t)}catch{return setTimeout(t,16)}}}}typeof window<"u"&&te();const qe=()=>{te(),console.log=function(){},console.warn=function(){},console.info=function(){},console.debug=function(){},"performance"in window&&"measure"in performance&&performance.mark("app-start"),(()=>{["ethereum","web3","phantom","solana","keplr","MetaMask","Trust","Coinbase","BinanceChain"].forEach(n=>{n in window||Object.defineProperty(window,n,{get:()=>{},set:()=>!1,configurable:!1,enumerable:!1})})})(),window.addEventListener("error",t=>{const n=t.error;if(n&&n.stack){const r=n.message||"",o=n.stack||"";if(o.includes("extension")||o.includes("chrome-extension")||o.includes("moz-extension")||r.includes("MetaMask")||r.includes("phantom")||r.includes("keplr")||r.includes("ethereum"))return t.preventDefault(),!1}return!0}),window.addEventListener("securitypolicyviolation",t=>{})};qe();const ne=document.getElementById("root");if(!ne)throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');const ze=ie.createRoot(ne);ze.render(l.jsx(j.StrictMode,{children:l.jsx(De,{})}));export{Ke as a,$e as b,_ as u};
