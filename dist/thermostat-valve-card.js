/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$3=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$2,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$2=c$1?c$1.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$2(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$2=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r$1=`<${n}>`,l$1=document,c=()=>l$1.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l$1.createTreeWalker(l$1,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$1:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l$1).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o=s.litElementPolyfillSupport;o?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=o=>void 0===o.strings,m={},p=(o,t=m)=>o._$AH=t;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e(class extends i{constructor(r$1){if(super(r$1),r$1.type!==t.PROPERTY&&r$1.type!==t.ATTRIBUTE&&r$1.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!r(r$1))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===E||t$1===A)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return E}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return E}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return E;return p(i),t$1}});

const colorSchemes = [
    "home-assistant",
    "bright",
    "warm",
    "mint",
    "sky",
    "lavender",
];
const en$1 = {
    label: "Color scheme",
    "home-assistant": "Home Assistant",
    bright: "Bright",
    warm: "Warm",
    mint: "Mint",
    sky: "Sky",
    lavender: "Lavender",
    invalid: "Choose a valid color_scheme: home-assistant, bright, warm, mint, sky or lavender.",
};
const nb$1 = {
    label: "Fargevalg",
    "home-assistant": "Home Assistant",
    bright: "Lys",
    warm: "Varm",
    mint: "Mint",
    sky: "Himmelblå",
    lavender: "Lavendel",
    invalid: "Velg en gyldig color_scheme: home-assistant, bright, warm, mint, sky eller lavender.",
};
function colorSchemeText(hass) {
    const language = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(language) ? nb$1 : en$1;
}
function applyColorScheme(host, value, hass) {
    const scheme = value === undefined ? "home-assistant" : value;
    if (typeof scheme !== "string" ||
        !colorSchemes.includes(scheme)) {
        throw new Error(colorSchemeText(hass).invalid);
    }
    if (scheme === "home-assistant")
        host.removeAttribute("data-color-scheme");
    else
        host.setAttribute("data-color-scheme", scheme);
}
function colorSchemeSelector(hass, value, change) {
    const text = colorSchemeText(hass);
    return b `<label
    style="display:flex;flex-direction:column;align-items:stretch;gap:6px;margin:12px 0;"
  >
    ${text.label}
    <select
      name="color_scheme"
      style="font:inherit;min-height:44px;width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--divider-color, #ccc);background:var(--card-background-color, #fff);color:var(--primary-text-color, #202b36);"
      .value=${l(String(value ?? "home-assistant"))}
      @change=${(event) => {
        event.stopPropagation();
        change(event.target.value);
    }}
    >
      ${colorSchemes.map((scheme) => b `<option value=${scheme} ?selected=${scheme === (value ?? "home-assistant")}>${text[scheme]}</option>`)}
    </select>
  </label>`;
}
/** Local overrides only: removing the attribute restores the dashboard theme. */
const colorSchemeStyles = i$4 `
  :host([data-color-scheme]) {
    color-scheme: light;
    --primary-text-color: #202b36;
    --secondary-text-color: #52606d;
    --disabled-text-color: #626d78;
    --text-primary-color: #fff;
    --success-color: #28723c;
    --warning-color: #8c6100;
    --error-color: #bd2635;
    --orange-color: #ab4b13;
    --info-color: #146a91;
    --primary-color: var(--scheme-accent);
    --accent-color: var(--scheme-accent);
    --card-background-color: var(--scheme-surface);
    --ha-card-background: var(--scheme-surface);
    --primary-background-color: var(--scheme-surface);
    --secondary-background-color: var(--scheme-secondary);
    --divider-color: var(--scheme-border);
    --ha-card-border-color: var(--scheme-border);
    --bubble-main-background-color: var(--scheme-surface);
    --bubble-secondary-background-color: var(--scheme-secondary);
    --bubble-icon-background-color: var(--scheme-secondary);
    --bubble-sub-button-background-color: var(--scheme-secondary);
    --bubble-accent-color: var(--scheme-accent);
    --bubble-border: 1px solid var(--scheme-border);
    --ha-card-box-shadow: 0 2px 8px rgb(32 43 54 / 0.06);
    --bubble-box-shadow: var(--ha-card-box-shadow);
    --input-fill-color: var(--scheme-secondary);
    --input-ink-color: var(--primary-text-color);
    --input-label-ink-color: var(--secondary-text-color);
    --mdc-theme-primary: var(--scheme-accent);
    --mdc-theme-surface: var(--scheme-surface);
    --mdc-theme-on-surface: var(--primary-text-color);
    --mdc-text-field-fill-color: var(--scheme-secondary);
    --mdc-text-field-ink-color: var(--primary-text-color);
  }
  :host([data-color-scheme="bright"]) {
    --scheme-surface: #ffffff;
    --scheme-secondary: #edf3fa;
    --scheme-accent: #2365a5;
    --scheme-border: #ccd9e7;
  }
  :host([data-color-scheme="warm"]) {
    --scheme-surface: #fffaf1;
    --scheme-secondary: #f4ead9;
    --scheme-accent: #885321;
    --scheme-border: #ddd0ba;
  }
  :host([data-color-scheme="mint"]) {
    --scheme-surface: #f2fbf5;
    --scheme-secondary: #dfefe5;
    --scheme-accent: #286c50;
    --scheme-border: #c1d9ca;
  }
  :host([data-color-scheme="sky"]) {
    --scheme-surface: #f1f8ff;
    --scheme-secondary: #dfeefa;
    --scheme-accent: #22638e;
    --scheme-border: #c2d8e9;
  }
  :host([data-color-scheme="lavender"]) {
    --scheme-surface: #faf5ff;
    --scheme-secondary: #ede3f6;
    --scheme-accent: #725095;
    --scheme-border: #d7c8e5;
  }
`;

const TYPE = "custom:thermostat-valve-card";
function normalizeConfig(config) {
    if (!config || config.type !== TYPE)
        throw new Error(`Expected type: ${TYPE}`);
    if (typeof config.entity !== "string" ||
        !/^climate\.\w+$/.test(config.entity))
        throw new Error("entity must be a climate entity");
    if (config.valve_entity !== undefined &&
        (typeof config.valve_entity !== "string" ||
            !/^(sensor|number|input_number)\.\w+$/.test(config.valve_entity)))
        throw new Error("valve_entity must be a sensor or number entity");
    if (config.show_valve !== undefined && typeof config.show_valve !== "boolean")
        throw new Error("Invalid show_valve");
    if (config.appearance !== undefined &&
        !["default", "bubble"].includes(config.appearance))
        throw new Error("Invalid appearance");
    for (const key of ["name", "icon"])
        if (config[key] !== undefined &&
            (typeof config[key] !== "string" || !config[key]?.trim()))
            throw new Error(`Invalid ${key}`);
    return { appearance: "default", show_valve: true, ...config };
}

function available(entity) {
    return !!entity && !["unavailable", "unknown", ""].includes(entity.state);
}
function numeric(value) {
    if (typeof value !== "number" && typeof value !== "string")
        return;
    if (typeof value === "string" && !value.trim())
        return;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}
function action(entity) {
    const value = entity.attributes.hvac_action;
    return typeof value === "string" && value ? value : undefined;
}
/**
 * What the room is doing. hvac_action is authoritative; entities that do not
 * report it fall back to their mode, so a thermostat set to heat reads warm.
 */
function tone(entity) {
    if (!available(entity))
        return "unavailable";
    const reported = action(entity);
    if (reported) {
        if (["heating", "preheating", "defrosting"].includes(reported))
            return "heating";
        if (reported === "cooling")
            return "cooling";
        return reported === "off" ? "off" : "idle";
    }
    if (entity.state === "heat")
        return "heating";
    if (entity.state === "cool")
        return "cooling";
    return entity.state === "off" ? "off" : "idle";
}
/** The status word: the reported action, else the mode. */
function status(entity) {
    const reported = action(entity);
    return reported
        ? { kind: "action", value: reported }
        : { kind: "mode", value: entity.state };
}
// Attribute names TRV integrations use for the valve opening in percent.
const valveAttributes = [
    "valve_position",
    "valve_opening",
    "pi_heating_demand",
];
const valveId = /(valve_opening|valve_position|valve|pi_heating_demand|heating_demand)$/;
/**
 * The valve opening, from (in order) the configured entity, a climate
 * attribute, or a percent sensor/number on the same device.
 */
function valve(hass, config, climate) {
    if (config.show_valve === false)
        return;
    const read = (id) => {
        const e = hass.states[id];
        return { entityId: id, value: available(e) ? numeric(e.state) : undefined };
    };
    if (config.valve_entity)
        return read(config.valve_entity);
    for (const key of valveAttributes) {
        const value = numeric(climate?.attributes[key]);
        if (value !== undefined)
            return { value };
    }
    const device = hass.entities?.[config.entity]?.device_id;
    if (!device)
        return;
    const mates = Object.values(hass.entities ?? {}).filter((e) => e.device_id === device &&
        /^(sensor|number)\./.test(e.entity_id) &&
        valveId.test(e.entity_id) &&
        hass.states[e.entity_id]?.attributes.unit_of_measurement === "%");
    // Prefer an explicit valve reading over a heating-demand estimate.
    mates.sort((a, b) => Number(/demand/.test(a.entity_id)) - Number(/demand/.test(b.entity_id)));
    return mates[0] ? read(mates[0].entity_id) : undefined;
}
const TARGET_TEMPERATURE = 1;
function target(entity, unit) {
    const a = entity.attributes;
    const step = numeric(a.target_temp_step) ??
        numeric(a.precision) ??
        (unit === "°F" ? 1 : 0.5);
    const fahrenheit = unit === "°F";
    const min = numeric(a.min_temp) ?? (fahrenheit ? 45 : 7);
    const max = numeric(a.max_temp) ?? (fahrenheit ? 95 : 35);
    const digits = Math.min(2, (String(step).split(".")[1] ?? "").length);
    const value = numeric(a.temperature);
    const low = numeric(a.target_temp_low), high = numeric(a.target_temp_high);
    return {
        value,
        min,
        max,
        step,
        digits,
        settable: value !== undefined &&
            (Number(a.supported_features ?? 0) & TARGET_TEMPERATURE) !== 0,
        range: value === undefined && low !== undefined && high !== undefined
            ? [low, high]
            : undefined,
    };
}
/** Move by whole steps, snapped to the step grid and clamped to the range. */
function nudge(t, from, steps) {
    const snapped = Math.round((from + steps * t.step) / t.step) * t.step;
    return Number(Math.min(t.max, Math.max(t.min, snapped)).toFixed(4));
}

const norwegian = /^(nb|nn|no)(-|$)/;
function tag(value) {
    return (value ?? "").replace(/_/g, "-").toLowerCase();
}
/** Dictionary language: `nb` for Bokmål and its aliases, otherwise `en`. */
function language(hass) {
    return norwegian.test(tag(hass?.language || hass?.locale?.language))
        ? "nb"
        : "en";
}
/**
 * Formatting locale, kept apart from the dictionary: `en-GB` keeps its own
 * formats. Norwegian aliases become `nb-NO`; malformed tags fall back to `en`.
 */
function formatLocale(hass) {
    const value = tag(hass?.locale?.language || hass?.language || "en");
    if (norwegian.test(value))
        return "nb-NO";
    try {
        return Intl.getCanonicalLocales(value)[0] ?? "en";
    }
    catch {
        return "en";
    }
}
/** HA's number-format preference, as HA's own frontend maps it. */
function numberLocale(hass) {
    switch (hass?.locale?.number_format) {
        case "comma_decimal":
            return "de";
        case "decimal_period":
            return "en-US";
        case "space_comma":
            return "fr";
        case "system":
            return undefined;
        default:
            return formatLocale(hass);
    }
}
function formatNumber(hass, value, fractionDigits) {
    return new Intl.NumberFormat(numberLocale(hass), {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: hass?.locale?.number_format !== "none",
    }).format(value);
}
function formatPercent(hass, value) {
    return new Intl.NumberFormat(numberLocale(hass), {
        style: "percent",
        maximumFractionDigits: 0,
    }).format(value / 100);
}
const en = {
    heating: "Heating",
    cooling: "Cooling",
    idle: "Idle",
    off: "Off",
    drying: "Drying",
    fan: "Fan",
    preheating: "Preheating",
    defrosting: "Defrosting",
    heat: "Heat",
    cool: "Cool",
    heat_cool: "Heat/cool",
    auto: "Auto",
    dry: "Dry",
    fan_only: "Fan only",
    unavailable: "Unavailable",
    missing: "Entity not found",
    valve: "Valve opening",
    target: "Target temperature",
    lower: "Lower target temperature",
    raise: "Raise target temperature",
    range: "Target range",
    failed: "Could not set temperature",
    entity: "Climate entity",
    valve_entity: "Valve entity (optional, found automatically)",
    show_valve: "Show valve opening",
    name: "Name",
    icon: "Icon",
    appearance: "Appearance",
    default: "Default",
    bubble: "Bubble",
    invalidValue: "Invalid value",
};
const nb = {
    heating: "Varmer",
    cooling: "Kjøler",
    idle: "Hviler",
    off: "Av",
    drying: "Avfukter",
    fan: "Vifte",
    preheating: "Forvarmer",
    defrosting: "Avriser",
    heat: "Varme",
    cool: "Kjøling",
    heat_cool: "Varme/kjøling",
    auto: "Auto",
    dry: "Avfukting",
    fan_only: "Bare vifte",
    unavailable: "Utilgjengelig",
    missing: "Fant ikke enheten",
    valve: "Ventilåpning",
    target: "Ønsket temperatur",
    lower: "Senk ønsket temperatur",
    raise: "Øk ønsket temperatur",
    range: "Ønsket område",
    failed: "Kunne ikke endre temperaturen",
    entity: "Klimaenhet",
    valve_entity: "Ventilenhet (valgfri, finnes automatisk)",
    show_valve: "Vis ventilåpning",
    name: "Navn",
    icon: "Ikon",
    appearance: "Utseende",
    default: "Standard",
    bubble: "Bubble",
    invalidValue: "Ugyldig verdi",
};
function localize(hass, key) {
    return (language(hass) === "nb" ? nb : en)[key];
}
const actions = [
    "heating",
    "cooling",
    "idle",
    "off",
    "drying",
    "fan",
    "preheating",
    "defrosting",
];
const modes = ["off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"];
/** Display label for an hvac_action; unknown values stay recognizable. */
function actionLabel(hass, action) {
    return actions.includes(action) ? localize(hass, action) : action;
}
function modeLabel(hass, mode) {
    return modes.includes(mode) ? localize(hass, mode) : mode;
}

/**
 * A single row in the family of our Bubble-style cards: a status circle
 * tinted by heating/cooling (the row itself stays neutral), the name with a status line, a valve ring and a stepper pill.
 * Colours come from HA theme and climate state variables.
 */
const styles = i$4 `
  :host {
    display: block;
    color: var(--primary-text-color, #1b1b1a);
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    --tv-muted: var(--secondary-text-color, #5b5a55);
    --tv-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tv-pill: var(--secondary-background-color, #f3f2ee);
    --tv-heat: var(--state-climate-heat-color, #ff8100);
    --tv-cool: var(--state-climate-cool-color, #2b9af9);
    --tv-idle: var(--disabled-text-color, #8a8984);
    --tv-error: var(--error-color, #c62828);
    --tv-radius: var(--ha-card-border-radius, 16px);
    --tv-circle: 50%;
  }
  :host([appearance="bubble"]) {
    --tv-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --tv-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --tv-radius: var(--bubble-border-radius, 32px);
    --tv-circle: var(--bubble-icon-border-radius, 50%);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    display: block;
    container-type: inline-size;
    padding: 6px;
    background: var(--tv-surface);
    border-radius: var(--tv-radius);
    overflow: hidden;
    --tone: var(--tv-idle);
  }
  :host([appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  .tone-heating {
    --tone: var(--tv-heat);
  }
  .tone-cooling {
    --tone: var(--tv-cool);
  }
  .tone-unavailable {
    --tone: var(--tv-error);
  }
  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 8px;
    min-height: 44px;
  }
  button {
    font: inherit;
    color: inherit;
    border: 0;
    margin: 0;
    background: none;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .symbol {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border-radius: var(--tv-circle);
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 14%, var(--tv-pill));
  }
  .tone-idle .symbol,
  .tone-off .symbol {
    color: var(--tv-muted);
    background: var(--tv-pill);
  }
  .name {
    flex: 1 1 96px;
    min-width: 0;
    padding: 2px 0;
    text-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 44px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status {
    font-size: 12px;
    color: var(--tv-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tone-heating .status strong,
  .tone-cooling .status strong {
    color: color-mix(in srgb, var(--tone) 55%, var(--primary-text-color, #000));
  }
  .status strong {
    font-weight: 600;
  }
  .tone-unavailable .status {
    color: var(--tv-error);
  }
  .valve {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 44px;
    padding: 0 4px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: var(--tv-muted);
  }
  .ring {
    width: 20px;
    height: 20px;
    transform: rotate(-90deg);
    flex: none;
  }
  .ring circle {
    fill: none;
    stroke-width: 4;
  }
  .ring .track {
    stroke: color-mix(in srgb, var(--tv-muted) 30%, transparent);
  }
  .ring .arc {
    stroke: var(--tone);
    stroke-linecap: round;
    transition: stroke-dasharray 0.4s;
  }
  .tone-idle .ring .arc,
  .tone-off .ring .arc {
    stroke: var(--tv-muted);
  }
  .stepper {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    border-radius: 22px;
    background: var(--tv-pill);
    min-height: 44px;
  }
  .stepper button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 20px;
    line-height: 1;
  }
  .stepper button:disabled {
    opacity: 0.4;
  }
  .stepper button:not(:disabled):hover {
    background: color-mix(in srgb, var(--tv-muted) 14%, transparent);
  }
  .value {
    min-width: 4.6em;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .value.pending {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
  .value[aria-busy="true"] {
    opacity: 0.6;
  }
  .range {
    padding: 0 14px;
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .error {
    margin: 6px 8px 2px;
    font-size: 12px;
    color: var(--tv-error);
    overflow-wrap: anywhere;
  }
  /* Narrow columns: the stepper moves under the name. */
  @container (max-width: 300px) {
    .stepper {
      flex: 1 0 100%;
      justify-content: space-between;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ring .arc {
      transition: none;
    }
  }
  .editor {
    display: grid;
    gap: 14px;
  }
  .editor label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
  }
  .editor input,
  .editor select {
    font: inherit;
    color: inherit;
    min-height: 44px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #ccc);
    background: var(--card-background-color, #fff);
    width: 100%;
  }
  .editor .toggle {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  .editor input[type="checkbox"] {
    width: 20px;
    min-height: 20px;
    height: 20px;
  }
  ${colorSchemeStyles}
`;

class ThermostatValveEditor extends i$1 {
    constructor() {
        super(...arguments);
        this.config = { type: TYPE, entity: "" };
    }
    setConfig(config) {
        this.config = { ...config };
        this.requestUpdate();
    }
    updated() {
        this.renderRoot
            .querySelectorAll("input")
            .forEach((input) => {
            if (input.validity.customError)
                input.setCustomValidity(this.t("invalidValue"));
        });
    }
    t(key) {
        return localize(this.hass, key);
    }
    emit(next) {
        this.config = next;
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: { ...next } },
            bubbles: true,
            composed: true,
        }));
    }
    change(key, event) {
        const input = event.target;
        const value = input instanceof HTMLInputElement && input.type === "checkbox"
            ? input.checked
            : input.value.trim();
        const next = { ...this.config, [key]: value };
        if (value === "")
            delete next[key];
        try {
            normalizeConfig(next);
        }
        catch {
            if (input instanceof HTMLInputElement) {
                input.setCustomValidity(this.t("invalidValue"));
                input.reportValidity();
            }
            return;
        }
        if (input instanceof HTMLInputElement)
            input.setCustomValidity("");
        this.emit(next);
    }
    text(key, list, placeholder = "") {
        return b `<label
      >${this.t(key)}<input
        data-config=${key}
        list=${list ? `${key}-options` : ""}
        placeholder=${placeholder}
        .value=${l(String(this.config[key] ?? ""))}
        @change=${(e) => this.change(key, e)}
      />${list
            ? b `<datalist id=${`${key}-options`}>
              ${list.map((id) => b `<option value=${id}></option>`)}
            </datalist>`
            : ""}</label
    >`;
    }
    render() {
        const states = this.hass?.states ?? {};
        const climates = Object.keys(states).filter((id) => id.startsWith("climate."));
        const valves = Object.keys(states).filter((id) => /^(sensor|number|input_number)\./.test(id) &&
            states[id].attributes.unit_of_measurement === "%");
        const appearance = this.config.appearance ?? "default";
        return b `<div class="editor">
      ${this.text("entity", climates, "climate.…")}
      ${this.text("valve_entity", valves, "sensor.…")}
      <label class="toggle"
        ><input
          data-config="show_valve"
          type="checkbox"
          .checked=${l(this.config.show_valve !== false)}
          @change=${(e) => this.change("show_valve", e)}
        />${this.t("show_valve")}</label
      >
      ${this.text("name")} ${this.text("icon", undefined, "mdi:sofa")}
      <label
        >${this.t("appearance")}<select
          data-config="appearance"
          .value=${l(appearance)}
          @change=${(e) => this.change("appearance", e)}
        >
          ${["default", "bubble"].map((v) => b `<option value=${v} ?selected=${v === appearance}>
                ${this.t(v)}
              </option>`)}
        </select></label
      >
      ${colorSchemeSelector(this.hass, this.config.color_scheme, (scheme) => this.emit({ ...this.config, color_scheme: scheme }))}
    </div>`;
    }
}
ThermostatValveEditor.styles = styles;
ThermostatValveEditor.properties = { hass: { attribute: false } };
if (!customElements.get("thermostat-valve-card-editor"))
    customElements.define("thermostat-valve-card-editor", ThermostatValveEditor);

/** Quiet time after the last +/- press before the target is sent. */
const COMMIT_DELAY = 800;
/** How long a sent value is shown before falling back to the entity's. */
const CONFIRM_TIMEOUT = 15000;
class ThermostatValveCard extends i$1 {
    constructor() {
        super(...arguments);
        this.sending = false;
        this.error = "";
        this.epoch = 0;
        this.t = (key) => localize(this.ha, key);
    }
    get hass() {
        return this.ha;
    }
    set hass(value) {
        this.ha = value;
        const climate = this.climate;
        if (!this.sending &&
            this.sent !== undefined &&
            numeric(climate?.attributes.temperature) === this.sent)
            this.settle();
        this.requestUpdate();
    }
    setConfig(value) {
        const next = normalizeConfig(value);
        applyColorScheme(this, value.color_scheme, this.ha);
        if (next.entity !== this.config?.entity)
            this.reset();
        this.config = next;
        this.setAttribute("appearance", next.appearance ?? "default");
        this.requestUpdate();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // A target the user already chose is still sent when the view closes.
        if (this.commitTimer) {
            clearTimeout(this.commitTimer);
            this.commitTimer = undefined;
            void this.commit();
        }
    }
    get climate() {
        return this.config ? this.ha?.states[this.config.entity] : undefined;
    }
    get unit() {
        return this.ha?.config?.unit_system?.temperature ?? "°C";
    }
    reset() {
        this.epoch++;
        clearTimeout(this.commitTimer);
        clearTimeout(this.confirmTimer);
        this.commitTimer = this.confirmTimer = undefined;
        this.draft = this.sent = undefined;
        this.sending = false;
        this.error = "";
    }
    settle() {
        clearTimeout(this.confirmTimer);
        this.confirmTimer = undefined;
        this.draft = this.sent = undefined;
    }
    get live() {
        return this.ha?.connection?.connected !== false;
    }
    canStep(t) {
        return this.live && !this.sending && available(this.climate) && t.settable;
    }
    step(steps) {
        const climate = this.climate;
        if (!climate)
            return;
        const t = target(climate, this.unit);
        if (!this.canStep(t))
            return;
        clearTimeout(this.confirmTimer);
        this.confirmTimer = undefined;
        this.sent = undefined;
        this.draft = nudge(t, this.draft ?? t.value, steps);
        this.error = "";
        clearTimeout(this.commitTimer);
        this.commitTimer = setTimeout(() => {
            this.commitTimer = undefined;
            void this.commit();
        }, COMMIT_DELAY);
        this.requestUpdate();
    }
    /** Send the draft once; Home Assistant's reply decides what is shown. */
    async commit() {
        clearTimeout(this.commitTimer);
        this.commitTimer = undefined;
        const climate = this.climate;
        const value = this.draft;
        if (!this.ha || !climate || value === undefined || this.sending)
            return;
        const t = target(climate, this.unit);
        if (!this.canStep(t) || value === t.value) {
            this.draft = undefined;
            this.requestUpdate();
            return;
        }
        const ticket = this.epoch;
        this.sending = true;
        this.sent = value;
        this.requestUpdate();
        try {
            await this.ha.callService("climate", "set_temperature", {
                entity_id: climate.entity_id,
                temperature: value,
            });
            if (ticket !== this.epoch)
                return;
            this.sending = false;
            if (numeric(this.climate?.attributes.temperature) === value)
                this.settle();
            else
                this.confirmTimer = setTimeout(() => {
                    this.settle();
                    this.requestUpdate();
                }, CONFIRM_TIMEOUT);
        }
        catch (error) {
            if (ticket !== this.epoch)
                return;
            this.sending = false;
            this.draft = this.sent = undefined;
            const message = error instanceof Error ? error.message : String(error);
            this.error = `${this.t("failed")}: ${message}`;
        }
        this.requestUpdate();
    }
    info(entityId) {
        if (!entityId)
            return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId },
            bubbles: true,
            composed: true,
        }));
    }
    temperature(value, digits) {
        return `${formatNumber(this.ha, value, digits)} ${this.unit}`;
    }
    statusLine(climate) {
        if (!climate)
            return b `${this.t("missing")}`;
        if (!available(climate))
            return b `${this.t("unavailable")}`;
        const s = status(climate);
        const word = s.kind === "action"
            ? actionLabel(this.ha, s.value)
            : modeLabel(this.ha, s.value);
        const current = numeric(climate.attributes.current_temperature);
        return b `<strong>${word}</strong
      >${current === undefined ? A : b ` · ${this.temperature(current, 1)}`}`;
    }
    valveView(v) {
        if (!v)
            return A;
        const percent = v.value === undefined ? undefined : Math.max(0, Math.min(100, v.value));
        const text = percent === undefined ? "—" : formatPercent(this.ha, percent);
        const label = `${this.t("valve")}: ${percent === undefined ? this.t("unavailable") : text}`;
        const ring = b `<svg class="ring" viewBox="0 0 20 20" aria-hidden="true">
        <circle class="track" cx="10" cy="10" r="8"></circle>
        ${percent
            ? w `<circle
                class="arc"
                cx="10"
                cy="10"
                r="8"
                pathLength="100"
                stroke-dasharray=${`${percent} 100`}
              ></circle>`
            : A}</svg
      ><span>${text}</span>`;
        return v.entityId
            ? b `<button
          class="valve"
          data-valve
          aria-label=${label}
          title=${label}
          @click=${() => this.info(v.entityId)}
        >
          ${ring}
        </button>`
            : b `<span
          class="valve"
          data-valve
          role="img"
          aria-label=${label}
          title=${label}
          >${ring}</span
        >`;
    }
    control(climate) {
        if (!climate)
            return A;
        const t = target(climate, this.unit);
        if (available(climate) && t.range && !t.settable)
            return b `<span class="range" title=${this.t("range")}
        >${formatNumber(this.ha, t.range[0], t.digits)}–${this.temperature(t.range[1], t.digits)}</span
      >`;
        const enabled = this.canStep(t);
        const shown = this.draft ?? (available(climate) ? t.value : undefined);
        return b `<div
      class="stepper"
      role="group"
      aria-label=${this.t("target")}
    >
      <button
        data-step="down"
        aria-label=${this.t("lower")}
        title=${this.t("lower")}
        ?disabled=${!enabled || (shown !== undefined && shown <= t.min)}
        @click=${() => this.step(-1)}
      >
        −
      </button>
      <output
        class=${`value ${this.draft !== undefined ? "pending" : ""}`}
        aria-live="polite"
        aria-busy=${this.sending ? "true" : "false"}
        >${shown === undefined ? "—" : this.temperature(shown, t.digits)}</output
      >
      <button
        data-step="up"
        aria-label=${this.t("raise")}
        title=${this.t("raise")}
        ?disabled=${!enabled || (shown !== undefined && shown >= t.max)}
        @click=${() => this.step(1)}
      >
        +
      </button>
    </div>`;
    }
    render() {
        if (!this.config || !this.ha)
            return A;
        const climate = this.climate;
        const name = this.config.name ??
            String(climate?.attributes.friendly_name ?? this.config.entity);
        const icon = this.config.icon ?? String(climate?.attributes.icon ?? "mdi:thermostat");
        const v = climate ? valve(this.ha, this.config, climate) : undefined;
        return b `<ha-card
      class=${`tone-${climate ? tone(climate) : "unavailable"}`}
    >
      <div class="row">
        <button
          class="symbol"
          aria-label=${name}
          @click=${() => this.info(this.config?.entity)}
        >
          <ha-icon .icon=${icon}></ha-icon>
        </button>
        <button class="name" @click=${() => this.info(this.config?.entity)}>
          <span class="title">${name}</span>
          <span class="status" data-status>${this.statusLine(climate)}</span>
        </button>
        ${this.valveView(v)}${this.control(climate)}
      </div>
      ${this.error ? b `<p class="error" role="alert">${this.error}</p>` : A}
    </ha-card>`;
    }
    getCardSize() {
        return 1;
    }
    getGridOptions() {
        return { columns: 12, rows: 1, min_columns: 6, min_rows: 1 };
    }
    static getConfigElement() {
        return document.createElement("thermostat-valve-card-editor");
    }
    static getStubConfig(hass) {
        const entity = Object.keys(hass?.states ?? {}).find((id) => id.startsWith("climate."));
        return { type: TYPE, entity: entity ?? "climate.living_room" };
    }
}
ThermostatValveCard.styles = styles;
if (!customElements.get("thermostat-valve-card"))
    customElements.define("thermostat-valve-card", ThermostatValveCard);
// Card-picker metadata has no hass context and stays English.
const catalog = window;
catalog.customCards ?? (catalog.customCards = []);
if (!catalog.customCards.some((c) => c.type === "thermostat-valve-card"))
    catalog.customCards.push({
        type: "thermostat-valve-card",
        name: "Thermostat Valve Card",
        description: "Compact thermostat row: target temperature, valve opening and heating/cooling state",
        preview: true,
    });

export { COMMIT_DELAY, ThermostatValveCard };
//# sourceMappingURL=thermostat-valve-card.js.map
