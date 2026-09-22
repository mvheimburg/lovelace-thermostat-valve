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
const t$1=globalThis,i$2=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r$1=`<${n}>`,l$1=document,c=()=>l$1.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l$1.createTreeWalker(l$1,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$1:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H$1}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l$1).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}let H$1 = class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}};class I extends H$1{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H$1{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H$1{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

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
    for (const key of ["outdoor_entity", "flow_entity"])
        if (config[key] !== undefined &&
            (typeof config[key] !== "string" ||
                !/^(sensor|input_number|number)\.\w+$/.test(config[key] ?? "")))
            throw new Error(`${key} must be a sensor entity`);
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
            return { value, attribute: key };
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
    history: "History",
    historyFailed: "Could not load history",
    noHistory: "No history for this period",
    loading: "Loading history…",
    close: "Close",
    now: "Now",
    room: "Room",
    outdoor: "Outdoor",
    flow: "Flow",
    outdoor_entity: "Outdoor temperature (for history)",
    flow_entity: "Flow temperature (for history)",
    groupTitle: "Thermostats",
    configure: "Configure",
    configureHelp: "Rooms, names, icons and the outdoor and flow sensors belong to this card: edit the dashboard, then edit the card. Tap a room's icon to change its mode or preset in Home Assistant.",
    setup: "Edit the dashboard and add rooms to this card.",
    summaryHeating: "{n} heating",
    summaryCooling: "{n} cooling",
    summaryUnavailable: "{n} unavailable",
    allIdle: "Not heating",
    title: "Title",
    sections: "Room groups",
    sectionName: "Group heading (optional)",
    addSection: "Add room group",
    addThermostat: "Add room",
    thermostatN: "Room {n}",
    sectionN: "Room group {n}",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    draftInvalid: "Your latest edits are not saved yet. Choose a climate entity for every room, or remove the empty row.",
    invalidConfig: "The card configuration must be an object.",
    invalidType: "Expected type: custom:thermostat-group-card.",
    invalidAppearance: "appearance must be default or bubble.",
    invalidScheme: "Choose a valid color_scheme: home-assistant, bright, warm, mint, sky or lavender.",
    invalidSections: "sections must be a list of room groups.",
    invalidSection: "Each room group needs a list of thermostats.",
    invalidThermostat: "Each room needs a climate entity.",
    invalidValveEntity: "valve_entity must be a sensor or number entity.",
    invalidSensor: "outdoor_entity and flow_entity must be sensor entities.",
    invalidText: "Titles, names and icons must be text.",
    invalidShowValve: "show_valve must be true or false.",
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
    history: "Historikk",
    historyFailed: "Kunne ikke hente historikk",
    noHistory: "Ingen historikk for denne perioden",
    loading: "Henter historikk …",
    close: "Lukk",
    now: "Nå",
    room: "Rom",
    outdoor: "Ute",
    flow: "Tur",
    outdoor_entity: "Utetemperatur (for historikk)",
    flow_entity: "Turtemperatur (for historikk)",
    groupTitle: "Termostater",
    configure: "Konfigurer",
    configureHelp: "Rom, navn, ikoner og ute- og turtemperatur hører til dette kortet: rediger dashbordet, og rediger så kortet. Trykk på ikonet til et rom for å endre modus eller forhåndsvalg i Home Assistant.",
    setup: "Rediger dashbordet og legg til rom i dette kortet.",
    summaryHeating: "{n} varmer",
    summaryCooling: "{n} kjøler",
    summaryUnavailable: "{n} utilgjengelig",
    allIdle: "Varmer ikke",
    title: "Tittel",
    sections: "Romgrupper",
    sectionName: "Gruppeoverskrift (valgfri)",
    addSection: "Legg til romgruppe",
    addThermostat: "Legg til rom",
    thermostatN: "Rom {n}",
    sectionN: "Romgruppe {n}",
    moveUp: "Flytt opp",
    moveDown: "Flytt ned",
    remove: "Fjern",
    draftInvalid: "De siste endringene er ikke lagret ennå. Velg en klimaenhet for hvert rom, eller fjern den tomme raden.",
    invalidConfig: "Kortoppsettet må være et objekt.",
    invalidType: "Forventet type: custom:thermostat-group-card.",
    invalidAppearance: "appearance må være default eller bubble.",
    invalidScheme: "Velg en gyldig color_scheme: home-assistant, bright, warm, mint, sky eller lavender.",
    invalidSections: "sections må være en liste med romgrupper.",
    invalidSection: "Hver romgruppe trenger en liste med termostater.",
    invalidThermostat: "Hvert rom trenger en klimaenhet.",
    invalidValveEntity: "valve_entity må være en sensor- eller tallenhet.",
    invalidSensor: "outdoor_entity og flow_entity må være sensorenheter.",
    invalidText: "Titler, navn og ikoner må være tekst.",
    invalidShowValve: "show_valve må være true eller false.",
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
  /* A room inside the thermostat group card: a tile on the group's surface. */
  :host([embedded]) ha-card {
    background: color-mix(in srgb, var(--tv-pill) 45%, var(--tv-surface));
    border: none;
    border-radius: min(var(--tv-radius), 24px);
    box-shadow: none;
    --ha-card-border-width: 0;
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
  /* History: one chart of the valve (area) and the temperatures (lines). */
  .s-valve {
    --series: var(--tv-heat);
  }
  .s-room {
    --series: var(--primary-text-color, #1b1b1a);
  }
  .s-outdoor {
    --series: var(--tv-cool);
  }
  .s-flow {
    --series: var(--purple-color, #926bc7);
  }
  dialog {
    color: var(--primary-text-color, #1b1b1a);
    background: var(--tv-surface);
    border: 0;
    border-radius: min(var(--tv-radius), 28px);
    padding: 16px 16px 20px;
    width: min(640px, calc(100vw - 24px));
    max-height: 90dvh;
    overflow: auto;
    box-shadow: 0 16px 60px #0006;
  }
  dialog::backdrop {
    background: #0007;
  }
  .history-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .history-head h2 {
    flex: 1;
    margin: 0 4px;
    font-size: 18px;
    font-weight: 600;
  }
  .close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 24px;
    line-height: 1;
    background: var(--tv-pill);
  }
  .ranges {
    display: flex;
    gap: 6px;
    margin: 10px 0 6px;
  }
  .ranges button {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    background: var(--tv-pill);
    font-size: 13px;
    font-weight: 600;
  }
  .ranges button[aria-pressed="true"] {
    background: color-mix(
      in srgb,
      var(--primary-color, #03a9f4) 22%,
      var(--tv-pill)
    );
  }
  .plot {
    min-height: 120px;
    touch-action: pan-y;
  }
  .chart {
    display: block;
    width: 100%;
    height: auto;
  }
  .chart .grid {
    stroke: color-mix(in srgb, var(--tv-muted) 22%, transparent);
    stroke-width: 1;
  }
  .chart .axis {
    fill: var(--tv-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .chart .line {
    fill: none;
    stroke: var(--series);
    stroke-width: 2;
    stroke-linejoin: round;
  }
  .chart .edge {
    fill: none;
    stroke: var(--series);
    stroke-width: 1.5;
  }
  .chart .area {
    fill: color-mix(in srgb, var(--series) 28%, transparent);
    stroke: none;
  }
  .chart .cursor {
    stroke: var(--tv-muted);
    stroke-dasharray: 3 3;
  }
  .plot .hint {
    margin: 40px 0;
    text-align: center;
    color: var(--tv-muted);
  }
  .when {
    margin: 4px 4px 6px;
    font-size: 12px;
    color: var(--tv-muted);
  }
  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
    gap: 6px;
  }
  .legend .item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 8px;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: 16px;
    background: var(--tv-pill);
    text-align: start;
  }
  .legend .swatch {
    grid-row: span 2;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--series);
  }
  .legend .label {
    font-size: 12px;
    color: var(--tv-muted);
  }
  .legend strong {
    font-size: 15px;
    font-variant-numeric: tabular-nums;
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

const RANGES = [6, 24, 168];
function read(source, state, attributes) {
    if (["unavailable", "unknown", ""].includes(state))
        return undefined;
    return source.attribute
        ? numeric(attributes?.[source.attribute])
        : numeric(state);
}
/**
 * The history of every source over the last `hours`, ending with the current
 * state. Attribute sources need attributes on every row; the others do not.
 */
async function loadHistory(hass, sources, hours, now = Date.now()) {
    if (!hass.callWS)
        throw new Error("Home Assistant history API unavailable");
    const start = new Date(now - hours * 3600000).toISOString();
    const ask = async (list, attributes) => list.length
        ? hass.callWS({
            type: "history/history_during_period",
            start_time: start,
            entity_ids: [...new Set(list.map((s) => s.entityId))],
            minimal_response: !attributes,
            no_attributes: !attributes,
            significant_changes_only: false,
        })
        : {};
    const [withAttributes, plain] = await Promise.all([
        ask(sources.filter((s) => s.attribute), true),
        ask(sources.filter((s) => !s.attribute), false),
    ]);
    return sources.map((source) => {
        const rows = (source.attribute ? withAttributes : plain)[source.entityId];
        const points = (rows ?? []).map((row) => [
            Math.max(Date.parse(start), (row.lu ?? row.lc ?? 0) * 1000),
            read(source, row.s, row.a),
        ]);
        const current = hass.states[source.entityId];
        if (current)
            points.push([
                now,
                available(current)
                    ? read(source, current.state, current.attributes)
                    : undefined,
            ]);
        return { ...source, points };
    });
}
/** The value in force at `time`: the last point at or before it. */
function valueAt(series, time) {
    let value;
    for (const [t, v] of series.points) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}
/** Round-number ticks covering [min, max], about `count` of them. */
function ticks(min, max, count = 4) {
    const raw = (max - min) / count || 1;
    const power = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
        10 * power;
    const out = [];
    // From the step at or below min up to the first step at or above max.
    for (let v = Math.floor(min / step) * step;; v += step) {
        out.push(Number(v.toFixed(6)));
        if (v >= max - 1e-9)
            break;
    }
    return out;
}

const LEFT = 40, TOP = 10, BOTTOM = 196, H = 230;
/** Room kept right of the plot for the percent axis. */
const RIGHT_GUTTER = 44;
/** Split into runs of known values, so an unavailable spell leaves a gap. */
function runs(points) {
    const out = [];
    let current = [];
    for (const [t, v] of points) {
        if (v === undefined) {
            if (current.length)
                out.push(current);
            current = [];
        }
        else
            current.push([t, v]);
    }
    if (current.length)
        out.push(current);
    return out;
}
/**
 * Valve opening as a stepped area on a 0–100 % scale (right axis), and the
 * temperatures as lines on a shared °C scale (left axis).
 */
function chart(series, start, end, hover, text, 
/** Drawn at its on-screen width, so the axis text stays 12 px on a phone. */
W = 600) {
    const RIGHT = W - RIGHT_GUTTER;
    const temps = series.filter((s) => s.key !== "valve");
    const valve = series.find((s) => s.key === "valve");
    const values = temps.flatMap((s) => s.points.flatMap(([, v]) => (v === undefined ? [] : [v])));
    const lo = values.length ? Math.min(...values) : 0, hi = values.length ? Math.max(...values) : 30;
    const yTicks = ticks(Math.floor(lo - 1), Math.ceil(hi + 1));
    const yMin = yTicks[0], yMax = yTicks[yTicks.length - 1];
    const x = (t) => LEFT +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - LEFT);
    const y = (v) => BOTTOM - ((v - yMin) / (yMax - yMin || 1)) * (BOTTOM - TOP);
    const yPct = (v) => BOTTOM - (Math.min(100, Math.max(0, v)) / 100) * (BOTTOM - TOP);
    const hours = (end - start) / 3600000;
    // Hours between time labels; fewer of them on a phone-width chart.
    const narrow = W < 480;
    const every = hours <= 6
        ? narrow
            ? 2
            : 1
        : hours <= 24
            ? narrow
                ? 6
                : 4
            : narrow
                ? 48
                : 24;
    const xTicks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        const h = new Date(t).getHours();
        if (t < start)
            continue;
        if (every >= 24
            ? h === 0 && midnights++ % (every / 24) === 0
            : h % every === 0)
            xTicks.push(t);
    }
    const line = (points) => runs(points)
        .map((run) => run
        .map(([t, v], i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(v).toFixed(1)}`)
        .join(" "))
        .join(" ");
    // The valve holds each reading until the next one, as a valve does.
    const steps = (run) => run
        .map(([t, v], i) => {
        const next = run[i + 1];
        return `${x(t).toFixed(1)},${yPct(v).toFixed(1)}${next ? ` L${x(next[0]).toFixed(1)},${yPct(v).toFixed(1)}` : ""}`;
    })
        .join(" L");
    const edge = (points) => runs(points)
        .map((run) => `M${steps(run)}`)
        .join(" ");
    const area = (points) => runs(points)
        .map((run) => {
        const last = run[run.length - 1];
        return `M${x(run[0][0]).toFixed(1)},${BOTTOM} L${steps(run)} L${x(last[0]).toFixed(1)},${BOTTOM} Z`;
    })
        .join(" ");
    return w `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    ${yTicks.map((v) => w `<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y(v)} y2=${y(v)}></line>
        <text class="axis" x=${LEFT - 6} y=${y(v) + 4} text-anchor="end">${text.number(v, 0)}°</text>`)}
    ${valve
        ? [0, 50, 100].map((v) => w `<text class="axis" x=${RIGHT + 6} y=${yPct(v) + 4}>${text.percent(v)}</text>`)
        : A}
    ${xTicks.map((t) => w `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${BOTTOM}></line>
        <text class="axis" x=${x(t)} y=${BOTTOM + 18} text-anchor="middle">${text.time(t, every >= 24)}</text>`)}
    ${valve
        ? w `<path class="area s-valve" d=${area(valve.points)}></path>
            <path class="edge s-valve" d=${edge(valve.points)}></path>`
        : A}
    ${temps.map((s) => w `<path class=${`line s-${s.key}`} d=${line(s.points)}></path>`)}
    ${hover === undefined
        ? A
        : w `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${BOTTOM}></line>`}
  </svg>`;
}
/** The time under a pointer over the chart. */
function timeAt(event, element, start, end) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const RIGHT = W - RIGHT_GUTTER;
    const px = ((event.clientX - box.left) / box.width) * W;
    const ratio = (px - LEFT) / (RIGHT - LEFT);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}

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
        const temperatures = Object.keys(states).filter((id) => /^(sensor|number|input_number)\./.test(id) &&
            (states[id].attributes.device_class === "temperature" ||
                ["°C", "°F"].includes(String(states[id].attributes.unit_of_measurement))));
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
      ${this.text("outdoor_entity", temperatures, "sensor.…")}
      ${this.text("flow_entity", temperatures, "sensor.…")} ${this.text("name")}
      ${this.text("icon", undefined, "mdi:sofa")}
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
        /** The history dialog: chosen range, loaded series and the hovered time. */
        this.range = 24;
        this.loading = false;
        this.historyError = "";
        this.historyTicket = 0;
        this.plotWidth = 600;
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
    updated() {
        const plot = this.shadowRoot?.querySelector(".plot");
        if (!plot || this.resize)
            return;
        this.resize = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.contentRect.width);
            // Redraw next frame, outside the observer's own layout pass.
            if (width > 0 && Math.abs(width - this.plotWidth) > 4)
                requestAnimationFrame(() => {
                    this.plotWidth = width;
                    this.requestUpdate();
                });
        });
        this.resize.observe(plot);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.resize?.disconnect();
        this.resize = undefined;
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
        this.historyTicket++;
        this.series = this.window = this.hover = undefined;
        this.loading = false;
        this.historyError = "";
        this.dialog?.close();
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
    get dialog() {
        return this.shadowRoot?.querySelector("#history");
    }
    /** Valve, room, outdoor and flow temperature: whichever this room has. */
    sources() {
        const config = this.config;
        const climate = this.climate;
        const out = [];
        const v = climate ? valve(this.ha, config, climate) : undefined;
        if (v?.entityId)
            out.push({ key: "valve", entityId: v.entityId });
        else if (v?.attribute)
            out.push({
                key: "valve",
                entityId: config.entity,
                attribute: v.attribute,
            });
        out.push({
            key: "room",
            entityId: config.entity,
            attribute: "current_temperature",
        });
        if (config.outdoor_entity)
            out.push({ key: "outdoor", entityId: config.outdoor_entity });
        if (config.flow_entity)
            out.push({ key: "flow", entityId: config.flow_entity });
        return out;
    }
    async openHistory() {
        if (!this.config || !this.ha)
            return;
        await this.updateComplete;
        const dialog = this.dialog;
        if (dialog && !dialog.open)
            dialog.showModal();
        void this.loadHistory();
    }
    async loadHistory(range = this.range) {
        if (!this.ha)
            return;
        const ticket = ++this.historyTicket;
        this.range = range;
        this.loading = true;
        this.historyError = "";
        this.hover = undefined;
        this.requestUpdate();
        const end = Date.now();
        try {
            const series = await loadHistory(this.ha, this.sources(), range, end);
            if (ticket !== this.historyTicket)
                return;
            this.series = series;
            this.window = [end - range * 3600000, end];
        }
        catch (error) {
            if (ticket !== this.historyTicket)
                return;
            this.series = this.window = undefined;
            this.historyError = `${this.t("historyFailed")}: ${error instanceof Error
                ? error.message
                : typeof error === "object" && error && "message" in error
                    ? String(error.message)
                    : String(error)}`;
        }
        this.loading = false;
        this.requestUpdate();
    }
    closeHistory() {
        this.dialog?.close();
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
        return b `<button
      class="valve"
      data-valve
      aria-label=${`${label}. ${this.t("history")}`}
      title=${label}
      @click=${() => void this.openHistory()}
    >
      ${ring}
    </button>`;
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
          <button
            class="name"
            data-name
            aria-label=${`${name}: ${this.t("history")}`}
            @click=${() => void this.openHistory()}
          >
            <span class="title">${name}</span>
            <span class="status" data-status>${this.statusLine(climate)}</span>
          </button>
          ${this.valveView(v)}${this.control(climate)}
        </div>
        ${this.error ? b `<p class="error" role="alert">${this.error}</p>` : A}
      </ha-card>
      ${this.historyDialog(name)}`;
    }
    historyDialog(name) {
        const hour12 = this.ha?.locale?.time_format === "12"
            ? true
            : this.ha?.locale?.time_format === "24"
                ? false
                : undefined;
        const locale = formatLocale(this.ha);
        const time = (ms, withDay) => new Intl.DateTimeFormat(locale, withDay
            ? { weekday: "short", day: "numeric" }
            : { hour: "2-digit", minute: "2-digit", hour12 }).format(ms);
        const span = (hours) => new Intl.NumberFormat(locale, {
            style: "unit",
            unit: hours < 48 ? "hour" : "day",
            unitDisplay: "short",
        }).format(hours < 48 ? hours : hours / 24);
        const reading = (s, value) => value === undefined
            ? "—"
            : s.key === "valve"
                ? formatPercent(this.ha, value)
                : this.temperature(value, 1);
        const series = this.series;
        const window = this.window;
        const at = this.hover;
        return b `<dialog
      id="history"
      aria-labelledby="history-title"
      @close=${() => {
            this.historyTicket++;
            this.hover = undefined;
        }}
    >
      <div class="history-head">
        <h2 id="history-title">${name}</h2>
        <button
          class="close"
          data-close
          aria-label=${this.t("close")}
          title=${this.t("close")}
          @click=${() => this.closeHistory()}
        >
          ×
        </button>
      </div>
      <div class="ranges" role="group" aria-label=${this.t("history")}>
        ${RANGES.map((hours) => b `<button
              data-range=${hours}
              aria-pressed=${String(this.range === hours)}
              ?disabled=${this.loading && this.range === hours}
              @click=${() => void this.loadHistory(hours)}
            >
              ${span(hours)}
            </button>`)}
      </div>
      <div
        class="plot"
        aria-busy=${String(this.loading)}
        @pointermove=${(e) => {
            const svg = e.currentTarget.querySelector("svg");
            if (!svg || !window)
                return;
            this.hover = timeAt(e, svg, window[0], window[1]);
            this.requestUpdate();
        }}
        @pointerleave=${() => {
            this.hover = undefined;
            this.requestUpdate();
        }}
      >
        ${this.historyError
            ? b `<p class="error" role="alert">${this.historyError}</p>`
            : !series || !window
                ? b `<p class="hint" role="status">${this.t("loading")}</p>`
                : series.every((s) => s.points.every(([, v]) => v === undefined))
                    ? b `<p class="hint">${this.t("noHistory")}</p>`
                    : chart(series, window[0], window[1], at, {
                        number: (v, d) => formatNumber(this.ha, v, d),
                        percent: (v) => formatPercent(this.ha, v),
                        time,
                        label: `${this.t("history")}: ${name}`,
                    }, Math.max(280, this.plotWidth))}
      </div>
      <p class="when" aria-live="polite">
        ${at === undefined ? this.t("now") : time(at, false)}
      </p>
      <div class="legend">
        ${(series ?? []).map((s) => b `<button
              class=${`item s-${s.key}`}
              data-series=${s.key}
              @click=${() => {
            this.closeHistory();
            this.info(s.entityId);
        }}
            >
              <span class="swatch"></span>
              <span class="label">${this.t(s.key)}</span>
              <strong
                >${reading(s, at === undefined
            ? s.points[s.points.length - 1]?.[1]
            : valueAt(s, at))}</strong
              >
            </button>`)}
      </div>
    </dialog>`;
    }
    getCardSize() {
        return 1;
    }
    getGridOptions() {
        // Auto height: on a narrow column the stepper wraps below the name.
        return { columns: 12, rows: "auto", min_columns: 6, min_rows: 1 };
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
const catalog$1 = window;
catalog$1.customCards ?? (catalog$1.customCards = []);
if (!catalog$1.customCards.some((c) => c.type === "thermostat-valve-card"))
    catalog$1.customCards.push({
        type: "thermostat-valve-card",
        name: "Thermostat Valve Card",
        description: "Compact thermostat row: target temperature, valve opening and heating/cooling state",
        preview: true,
    });

const GROUP_TYPE = "custom:thermostat-group-card";
class GroupConfigError extends Error {
    constructor(code) {
        super(code);
        this.code = code;
    }
}
function object(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw new GroupConfigError("invalidConfig");
    return input;
}
function text(input, key) {
    if (input[key] !== undefined && typeof input[key] !== "string")
        throw new GroupConfigError("invalidText");
}
function entity(input, key, pattern, code) {
    const value = input[key];
    if (value !== undefined &&
        (typeof value !== "string" || !pattern.test(value)))
        throw new GroupConfigError(code);
}
const sensor = /^(sensor|number|input_number)\.\w+$/;
function normalizeGroupConfig(input) {
    const c = object(input);
    if (c.type !== GROUP_TYPE)
        throw new GroupConfigError("invalidType");
    text(c, "title");
    text(c, "icon");
    if (c.appearance !== undefined &&
        !["default", "bubble"].includes(String(c.appearance)))
        throw new GroupConfigError("invalidAppearance");
    if (c.color_scheme !== undefined &&
        !colorSchemes.includes(c.color_scheme))
        throw new GroupConfigError("invalidScheme");
    if (c.show_valve !== undefined && typeof c.show_valve !== "boolean")
        throw new GroupConfigError("invalidShowValve");
    entity(c, "outdoor_entity", sensor, "invalidSensor");
    entity(c, "flow_entity", sensor, "invalidSensor");
    const sections = c.sections ?? [];
    if (!Array.isArray(sections))
        throw new GroupConfigError("invalidSections");
    return {
        ...c,
        type: GROUP_TYPE,
        sections: sections.map((value) => {
            const s = object(value);
            if (!Array.isArray(s.thermostats))
                throw new GroupConfigError("invalidSection");
            text(s, "name");
            text(s, "icon");
            return {
                ...s,
                thermostats: s.thermostats.map((value) => {
                    const t = object(value);
                    if (typeof t.entity !== "string" || !/^climate\.\w+$/.test(t.entity))
                        throw new GroupConfigError("invalidThermostat");
                    text(t, "name");
                    text(t, "icon");
                    entity(t, "valve_entity", sensor, "invalidValveEntity");
                    return { ...t, entity: t.entity };
                }),
            };
        }),
    };
}

/**
 * Edits a draft of the group configuration. Only a valid draft is sent to the
 * dashboard; a new room stays here until its climate entity is chosen.
 */
class ThermostatGroupEditor extends i$1 {
    constructor() {
        super(...arguments);
        this.config = { type: GROUP_TYPE, sections: [] };
    }
    setConfig(config) {
        this.config = structuredClone({
            ...config,
            sections: config.sections ?? [],
        });
        this.invalid = undefined;
        this.requestUpdate();
    }
    t(key) {
        return localize(this.hass, key);
    }
    /** Keep the draft; send it only when it is a configuration the card accepts. */
    emit(next) {
        this.config = next;
        try {
            const config = normalizeGroupConfig(next);
            this.invalid = undefined;
            this.dispatchEvent(new CustomEvent("config-changed", {
                detail: { config },
                bubbles: true,
                composed: true,
            }));
        }
        catch (error) {
            if (!(error instanceof GroupConfigError))
                throw error;
            this.invalid = error.code;
        }
        this.requestUpdate();
    }
    set(key, value) {
        const next = { ...this.config, [key]: value };
        if (value === "" || value === undefined)
            delete next[key];
        this.emit(next);
    }
    sections(update) {
        const sections = structuredClone(this.config.sections);
        update(sections);
        this.emit({ ...this.config, sections });
    }
    setSection(si, key, value) {
        this.sections((s) => {
            if (value)
                s[si][key] = value;
            else
                delete s[si][key];
        });
    }
    setRoom(si, ti, key, value) {
        this.sections((s) => {
            const room = s[si].thermostats[ti];
            if (value || key === "entity")
                room[key] = value;
            else
                delete room[key];
        });
    }
    move(list, from, to) {
        if (to < 0 || to >= list.length)
            return;
        const [item] = list.splice(from, 1);
        list.splice(to, 0, item);
    }
    input(label, value, change, options = {}) {
        return b `<label
      >${label}<input
        list=${options.list ? options.id : ""}
        placeholder=${options.placeholder ?? ""}
        .value=${l(value ?? "")}
        @change=${(e) => change(e.target.value.trim())}
      />${options.list
            ? b `<datalist id=${options.id}>
              ${options.list.map((id) => b `<option value=${id}></option>`)}
            </datalist>`
            : A}</label
    >`;
    }
    groupText(key, list, placeholder = "") {
        return this.input(this.t(key), this.config[key], (value) => this.set(key, value), { list, id: `${key}-options`, placeholder });
    }
    orderButtons(count, index, move, remove, label) {
        return b `<button
        data-action="up"
        aria-label=${`${this.t("moveUp")}: ${label}`}
        title=${this.t("moveUp")}
        ?disabled=${index === 0}
        @click=${() => move(index - 1)}
      >
        ↑</button
      ><button
        data-action="down"
        aria-label=${`${this.t("moveDown")}: ${label}`}
        title=${this.t("moveDown")}
        ?disabled=${index === count - 1}
        @click=${() => move(index + 1)}
      >
        ↓</button
      ><button
        data-action="remove"
        aria-label=${`${this.t("remove")}: ${label}`}
        @click=${remove}
      >
        ${this.t("remove")}
      </button>`;
    }
    room(si, ti, room, count, lists) {
        const label = room.name ||
            room.entity ||
            this.t("thermostatN").replace("{n}", String(ti + 1));
        return b `<div class="room" data-room=${`${si}.${ti}`}>
      <div class="bar">
        <strong>${label}</strong>
        ${this.orderButtons(count, ti, (to) => this.sections((s) => this.move(s[si].thermostats, ti, to)), () => this.sections((s) => s[si].thermostats.splice(ti, 1)), label)}
      </div>
      ${this.input(this.t("entity"), room.entity, (v) => this.setRoom(si, ti, "entity", v), {
            list: lists.climates,
            id: `climates-${si}-${ti}`,
            placeholder: "climate.…",
        })}
      ${this.input(this.t("name"), room.name, (v) => this.setRoom(si, ti, "name", v))}
      ${this.input(this.t("icon"), room.icon, (v) => this.setRoom(si, ti, "icon", v), { placeholder: "mdi:sofa" })}
      ${this.input(this.t("valve_entity"), room.valve_entity, (v) => this.setRoom(si, ti, "valve_entity", v), {
            list: lists.valves,
            id: `valves-${si}-${ti}`,
            placeholder: "sensor.…",
        })}
    </div>`;
    }
    render() {
        const states = this.hass?.states ?? {};
        const ids = Object.keys(states);
        const climates = ids.filter((id) => id.startsWith("climate."));
        const valves = ids.filter((id) => /^(sensor|number|input_number)\./.test(id) &&
            states[id].attributes.unit_of_measurement === "%");
        const temperatures = ids.filter((id) => /^(sensor|number|input_number)\./.test(id) &&
            (states[id].attributes.device_class === "temperature" ||
                ["°C", "°F"].includes(String(states[id].attributes.unit_of_measurement))));
        const appearance = this.config.appearance ?? "default";
        const sections = this.config.sections;
        return b `<div class="editor">
      ${this.invalid
            ? b `<p class="warning" role="alert" data-warning>
              ${this.invalid === "invalidThermostat"
                ? this.t("draftInvalid")
                : `${this.t("draftInvalid")} ${this.t(this.invalid)}`}
            </p>`
            : A}
      ${this.groupText("title", undefined, this.t("groupTitle"))}
      ${this.groupText("icon", undefined, "mdi:home-thermometer-outline")}
      <label
        >${this.t("appearance")}<select
          data-config="appearance"
          .value=${l(appearance)}
          @change=${(e) => this.set("appearance", e.target.value)}
        >
          ${["default", "bubble"].map((v) => b `<option value=${v} ?selected=${v === appearance}>
                ${this.t(v)}
              </option>`)}
        </select></label
      >
      ${colorSchemeSelector(this.hass, this.config.color_scheme, (scheme) => this.set("color_scheme", scheme))}
      <label class="toggle"
        ><input
          data-config="show_valve"
          type="checkbox"
          .checked=${l(this.config.show_valve !== false)}
          @change=${(e) => this.set("show_valve", e.target.checked)}
        />${this.t("show_valve")}</label
      >
      ${this.groupText("outdoor_entity", temperatures, "sensor.…")}
      ${this.groupText("flow_entity", temperatures, "sensor.…")}
      ${sections.map((section, si) => {
            const label = section.name || this.t("sectionN").replace("{n}", String(si + 1));
            return b `<fieldset data-section=${si}>
          <legend>${label}</legend>
          <div class="bar">
            <strong></strong>
            ${this.orderButtons(sections.length, si, (to) => this.sections((s) => this.move(s, si, to)), () => this.sections((s) => s.splice(si, 1)), label)}
          </div>
          ${this.input(this.t("sectionName"), section.name, (v) => this.setSection(si, "name", v))}
          ${this.input(this.t("icon"), section.icon, (v) => this.setSection(si, "icon", v), { placeholder: "mdi:home-floor-1" })}
          ${section.thermostats.map((room, ti) => this.room(si, ti, room, section.thermostats.length, {
                climates,
                valves,
            }))}
          <button
            class="add"
            data-action="add-thermostat"
            @click=${() => this.sections((s) => s[si].thermostats.push({ entity: "" }))}
          >
            + ${this.t("addThermostat")}
          </button>
        </fieldset>`;
        })}
      <button
        class="add"
        data-action="add-section"
        @click=${() => this.sections((s) => s.push({ thermostats: [{ entity: "" }] }))}
      >
        + ${this.t("addSection")}
      </button>
    </div>`;
    }
}
ThermostatGroupEditor.styles = [
    styles,
    i$4 `
      fieldset {
        display: grid;
        gap: 12px;
        margin: 0;
        padding: 12px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 12px;
      }
      legend {
        padding: 0 6px;
        font-weight: 600;
      }
      .room {
        display: grid;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
        background: var(--tv-pill);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .bar strong {
        flex: 1;
        font-size: 13px;
      }
      .bar button,
      .add {
        min-height: 44px;
        min-width: 44px;
        padding: 0 12px;
        border-radius: 22px;
        border: 1px solid var(--divider-color, #ccc);
        background: var(--card-background-color, #fff);
      }
      .add {
        justify-self: start;
      }
      .warning {
        margin: 0;
        padding: 10px 12px;
        border-radius: 10px;
        color: var(--tv-error);
        background: color-mix(in srgb, var(--tv-error) 10%, transparent);
      }
    `,
];
ThermostatGroupEditor.properties = { hass: { attribute: false } };
if (!customElements.get("thermostat-group-card-editor"))
    customElements.define("thermostat-group-card-editor", ThermostatGroupEditor);

/**
 * Several rooms in one card, optionally under group headings. Each room is a
 * thermostat-valve-card drawn as a tile, so every room keeps the single
 * card's stepper, pending/failure handling and history.
 */
class ThermostatGroupCard extends i$1 {
    constructor() {
        super(...arguments);
        this.config = { type: GROUP_TYPE, sections: [] };
        /** One embedded room card per position, reused across renders. */
        this.rows = new Map();
        this.t = (key) => localize(this.ha, key);
    }
    get hass() {
        return this.ha;
    }
    set hass(value) {
        this.ha = value;
        this.requestUpdate();
    }
    setConfig(input) {
        this.configError = undefined;
        try {
            this.config = normalizeGroupConfig(input);
        }
        catch (error) {
            if (!(error instanceof GroupConfigError))
                throw error;
            this.config = { type: GROUP_TYPE, sections: [] };
            this.configError = error.code;
        }
        applyColorScheme(this, this.config.color_scheme);
        this.setAttribute("appearance", this.config.appearance ?? "default");
        this.requestUpdate();
    }
    /** The single-room configuration for one entry, with the group's shared settings. */
    roomConfig(t) {
        const c = this.config;
        const room = {
            type: TYPE,
            entity: t.entity,
            appearance: c.appearance ?? "default",
            show_valve: c.show_valve !== false,
        };
        if (t.name?.trim())
            room.name = t.name;
        if (t.icon?.trim())
            room.icon = t.icon;
        if (t.valve_entity)
            room.valve_entity = t.valve_entity;
        if (c.outdoor_entity)
            room.outdoor_entity = c.outdoor_entity;
        if (c.flow_entity)
            room.flow_entity = c.flow_entity;
        return room;
    }
    row(key, t) {
        const config = this.roomConfig(t);
        const json = JSON.stringify(config);
        let row = this.rows.get(key);
        if (!row) {
            const card = document.createElement("thermostat-valve-card");
            card.setAttribute("embedded", "");
            row = { card, json: "" };
            this.rows.set(key, row);
        }
        if (row.json !== json) {
            row.card.setConfig(config);
            row.json = json;
        }
        row.card.hass = this.ha;
        return row.card;
    }
    /** What needs attention: how many rooms heat, cool or are unavailable. */
    summary() {
        const ids = new Set(this.config.sections.flatMap((s) => s.thermostats.map((t) => t.entity)));
        const counts = { heating: 0, cooling: 0, unavailable: 0 };
        for (const id of ids) {
            const kind = tone(this.ha?.states[id]);
            if (kind in counts)
                counts[kind]++;
        }
        const parts = [
            ["heating", "summaryHeating"],
            ["cooling", "summaryCooling"],
            ["unavailable", "summaryUnavailable"],
        ]
            .filter(([kind]) => counts[kind])
            .map(([kind, key]) => this.t(key).replace("{n}", formatNumber(this.ha, counts[kind], 0)));
        return parts.length ? parts.join(" · ") : this.t("allIdle");
    }
    get dialog() {
        return this.shadowRoot?.querySelector("#configure");
    }
    render() {
        if (!this.ha)
            return A;
        const used = new Set();
        const rooms = this.config.sections.map((s, si) => s.thermostats.map((t, ti) => {
            const key = `${si}.${ti}`;
            used.add(key);
            return this.row(key, t);
        }));
        for (const key of [...this.rows.keys()])
            if (!used.has(key))
                this.rows.delete(key);
        const empty = !used.size;
        return b `<ha-card class="group">
      <header>
        <ha-icon
          .icon=${this.config.icon || "mdi:home-thermometer-outline"}
        ></ha-icon>
        <div class="heading">
          <h2>${this.config.title || this.t("groupTitle")}</h2>
          ${empty || this.configError
            ? A
            : b `<span class="summary" data-summary
                  >${this.summary()}</span
                >`}
        </div>
        <button
          class="round"
          data-action="configure"
          aria-label=${this.t("configure")}
          title=${this.t("configure")}
          @click=${() => this.dialog?.showModal()}
        >
          <ha-icon .icon=${"mdi:cog-outline"}></ha-icon>
        </button>
      </header>
      ${this.configError
            ? b `<p class="error" role="alert">${this.t(this.configError)}</p>`
            : empty
                ? b `<p class="hint">${this.t("setup")}</p>`
                : this.config.sections.map((s, si) => b `<section>
                    ${s.name?.trim() || s.icon
                    ? b `<h3>
                            ${s.icon
                        ? b `<ha-icon .icon=${s.icon}></ha-icon>`
                        : A}${s.name ?? ""}
                          </h3>`
                    : A}
                    <div class="rooms">${rooms[si]}</div>
                  </section>`)}
      <dialog id="configure" aria-labelledby="configure-title">
        <div class="history-head">
          <h2 id="configure-title">${this.t("configure")}</h2>
          <button
            class="close"
            data-close
            aria-label=${this.t("close")}
            title=${this.t("close")}
            @click=${() => this.dialog?.close()}
          >
            ×
          </button>
        </div>
        <p>${this.t("configureHelp")}</p>
      </dialog>
    </ha-card>`;
    }
    getCardSize() {
        return (1 +
            this.config.sections.reduce((n, s) => n + (s.name ? 1 : 0) + s.thermostats.length, 0));
    }
    getGridOptions() {
        return { columns: 12, rows: "auto", min_columns: 6 };
    }
    static getConfigElement() {
        return document.createElement("thermostat-group-card-editor");
    }
    static getStubConfig(hass) {
        const climates = Object.keys(hass?.states ?? {})
            .filter((id) => id.startsWith("climate."))
            .slice(0, 4);
        return {
            type: GROUP_TYPE,
            sections: climates.length
                ? [{ thermostats: climates.map((entity) => ({ entity })) }]
                : [],
        };
    }
}
ThermostatGroupCard.styles = [
    styles,
    i$4 `
      ha-card.group {
        padding: 12px;
        display: grid;
        gap: 12px;
      }
      header {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
      }
      header > ha-icon {
        color: var(--tv-muted);
        flex: none;
      }
      .heading {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .summary {
        font-size: 12px;
        color: var(--tv-muted);
      }
      .round {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--tv-pill);
        color: var(--primary-text-color, #1b1b1a);
      }
      section {
        display: grid;
        gap: 6px;
      }
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 4px 2px;
        font-size: 14px;
        font-weight: 600;
      }
      h3 ha-icon {
        --mdc-icon-size: 20px;
        color: var(--tv-muted);
      }
      .rooms {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
        gap: 6px;
      }
      .hint {
        margin: 0 4px;
        color: var(--tv-muted);
      }
      dialog p {
        margin: 12px 4px 0;
        line-height: 1.45;
      }
    `,
];
if (!customElements.get("thermostat-group-card"))
    customElements.define("thermostat-group-card", ThermostatGroupCard);
// Card-picker metadata has no hass context and stays English.
const catalog = window;
catalog.customCards ?? (catalog.customCards = []);
if (!catalog.customCards.some((c) => c.type === "thermostat-group-card"))
    catalog.customCards.push({
        type: "thermostat-group-card",
        name: "Thermostat Group Card",
        description: "Several rooms' thermostats in one card, with valve opening, heating/cooling state and target temperature",
        preview: true,
    });
//# sourceMappingURL=thermostat-valve-card.js.map
