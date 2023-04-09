var ss=Object.create;var Qt=Object.defineProperty;var Ri=Object.getOwnPropertyDescriptor;var us=Object.getOwnPropertyNames;var cs=Object.getPrototypeOf,ps=Object.prototype.hasOwnProperty;var Mi=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Bi=(e,t)=>{for(var n in t)Qt(e,n,{get:t[n],enumerable:!0})},hs=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of us(t))!ps.call(e,i)&&i!==n&&Qt(e,i,{get:()=>t[i],enumerable:!(r=Ri(t,i))||r.enumerable});return e};var Wn=(e,t,n)=>(n=e!=null?ss(cs(e)):{},hs(t||!e||!e.__esModule?Qt(n,"default",{value:e,enumerable:!0}):n,e));var te=(e,t,n,r)=>{for(var i=r>1?void 0:r?Ri(t,n):t,o=e.length-1,l;o>=0;o--)(l=e[o])&&(i=(r?l(t,n,i):l(i))||i);return r&&i&&Qt(t,n,i),i};var sr=Mi((gm,uo)=>{uo.exports=function(t){return t!=null&&t.constructor!=null&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}});var bo=Mi((xm,yo)=>{"use strict";var un=Object.prototype.hasOwnProperty,xo=Object.prototype.toString,co=Object.defineProperty,po=Object.getOwnPropertyDescriptor,ho=function(t){return typeof Array.isArray=="function"?Array.isArray(t):xo.call(t)==="[object Array]"},mo=function(t){if(!t||xo.call(t)!=="[object Object]")return!1;var n=un.call(t,"constructor"),r=t.constructor&&t.constructor.prototype&&un.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!n&&!r)return!1;var i;for(i in t);return typeof i=="undefined"||un.call(t,i)},fo=function(t,n){co&&n.name==="__proto__"?co(t,n.name,{enumerable:!0,configurable:!0,value:n.newValue,writable:!0}):t[n.name]=n.newValue},go=function(t,n){if(n==="__proto__")if(un.call(t,n)){if(po)return po(t,n).value}else return;return t[n]};yo.exports=function e(){var t,n,r,i,o,l,s=arguments[0],a=1,c=arguments.length,u=!1;for(typeof s=="boolean"&&(u=s,s=arguments[1]||{},a=2),(s==null||typeof s!="object"&&typeof s!="function")&&(s={});a<c;++a)if(t=arguments[a],t!=null)for(n in t)r=go(s,n),i=go(t,n),s!==i&&(u&&i&&(mo(i)||(o=ho(i)))?(o?(o=!1,l=r&&ho(r)?r:[]):l=r&&mo(r)?r:{},fo(s,{name:n,newValue:e(u,l,i)})):typeof i!="undefined"&&fo(s,{name:n,newValue:i}));return s}});var Yt=window,Gt=Yt.ShadowRoot&&(Yt.ShadyCSS===void 0||Yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kn=Symbol(),Hi=new WeakMap,Et=class{constructor(t,n,r){if(this._$cssResult$=!0,r!==Kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o,n=this.t;if(Gt&&t===void 0){let r=n!==void 0&&n.length===1;r&&(t=Hi.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Hi.set(n,t))}return t}toString(){return this.cssText}},Ui=e=>new Et(typeof e=="string"?e:e+"",void 0,Kn),_t=(e,...t)=>{let n=e.length===1?e[0]:t.reduce((r,i,o)=>r+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new Et(n,e,Kn)},Qn=(e,t)=>{Gt?e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet):t.forEach(n=>{let r=document.createElement("style"),i=Yt.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=n.cssText,e.appendChild(r)})},Zt=Gt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(let r of t.cssRules)n+=r.cssText;return Ui(n)})(e):e;var Yn,Xt=window,ji=Xt.trustedTypes,ms=ji?ji.emptyScript:"",qi=Xt.reactiveElementPolyfillSupport,Zn={toAttribute(e,t){switch(t){case Boolean:e=e?ms:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Vi=(e,t)=>t!==e&&(t==t||e==e),Gn={attribute:!0,type:String,converter:Zn,reflect:!1,hasChanged:Vi},Te=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var n;this.finalize(),((n=this.h)!==null&&n!==void 0?n:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((n,r)=>{let i=this._$Ep(r,n);i!==void 0&&(this._$Ev.set(i,r),t.push(i))}),t}static createProperty(t,n=Gn){if(n.state&&(n.attribute=!1),this.finalize(),this.elementProperties.set(t,n),!n.noAccessor&&!this.prototype.hasOwnProperty(t)){let r=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,r,n);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,n,r){return{get(){return this[n]},set(i){let o=this[t];this[n]=i,this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Gn}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let n=this.properties,r=[...Object.getOwnPropertyNames(n),...Object.getOwnPropertySymbols(n)];for(let i of r)this.createProperty(i,n[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let n=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)n.unshift(Zt(i))}else t!==void 0&&n.push(Zt(t));return n}static _$Ep(t,n){let r=n.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(n=>n(this))}addController(t){var n,r;((n=this._$ES)!==null&&n!==void 0?n:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)===null||r===void 0||r.call(t))}removeController(t){var n;(n=this._$ES)===null||n===void 0||n.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,n)=>{this.hasOwnProperty(n)&&(this._$Ei.set(n,this[n]),delete this[n])})}createRenderRoot(){var t;let n=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Qn(n,this.constructor.elementStyles),n}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var r;return(r=n.hostConnected)===null||r===void 0?void 0:r.call(n)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(n=>{var r;return(r=n.hostDisconnected)===null||r===void 0?void 0:r.call(n)})}attributeChangedCallback(t,n,r){this._$AK(t,r)}_$EO(t,n,r=Gn){var i;let o=this.constructor._$Ep(t,r);if(o!==void 0&&r.reflect===!0){let l=(((i=r.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?r.converter:Zn).toAttribute(n,r.type);this._$El=t,l==null?this.removeAttribute(o):this.setAttribute(o,l),this._$El=null}}_$AK(t,n){var r;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let l=i.getPropertyOptions(o),s=typeof l.converter=="function"?{fromAttribute:l.converter}:((r=l.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?l.converter:Zn;this._$El=o,this[o]=s.fromAttribute(n,l.type),this._$El=null}}requestUpdate(t,n,r){let i=!0;t!==void 0&&(((r=r||this.constructor.getPropertyOptions(t)).hasChanged||Vi)(this[t],n)?(this._$AL.has(t)||this._$AL.set(t,n),r.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(n){Promise.reject(n)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let n=!1,r=this._$AL;try{n=this.shouldUpdate(r),n?(this.willUpdate(r),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(r)):this._$Ek()}catch(i){throw n=!1,this._$Ek(),i}n&&this._$AE(r)}willUpdate(t){}_$AE(t){var n;(n=this._$ES)===null||n===void 0||n.forEach(r=>{var i;return(i=r.hostUpdated)===null||i===void 0?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((n,r)=>this._$EO(r,this[r],n)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Te.finalized=!0,Te.elementProperties=new Map,Te.elementStyles=[],Te.shadowRootOptions={mode:"open"},qi==null||qi({ReactiveElement:Te}),((Yn=Xt.reactiveElementVersions)!==null&&Yn!==void 0?Yn:Xt.reactiveElementVersions=[]).push("1.6.1");var Xn,Jt=window,ct=Jt.trustedTypes,Wi=ct?ct.createPolicy("lit-html",{createHTML:e=>e}):void 0,en="$lit$",Le=`lit$${(Math.random()+"").slice(9)}$`,er="?"+Le,fs=`<${er}>`,pt=document,Lt=()=>pt.createComment(""),Pt=e=>e===null||typeof e!="object"&&typeof e!="function",Ji=Array.isArray,eo=e=>Ji(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Jn=`[ 	
\f\r]`,Tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ki=/-->/g,Qi=/>/g,Ve=RegExp(`>|${Jn}(?:([^\\s"'>=/]+)(${Jn}*=${Jn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yi=/'/g,Gi=/"/g,to=/^(?:script|style|textarea|title)$/i,no=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),Pe=no(1),yh=no(2),me=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),Zi=new WeakMap,ut=pt.createTreeWalker(pt,129,null,!1),ro=(e,t)=>{let n=e.length-1,r=[],i,o=t===2?"<svg>":"",l=Tt;for(let a=0;a<n;a++){let c=e[a],u,p,m=-1,f=0;for(;f<c.length&&(l.lastIndex=f,p=l.exec(c),p!==null);)f=l.lastIndex,l===Tt?p[1]==="!--"?l=Ki:p[1]!==void 0?l=Qi:p[2]!==void 0?(to.test(p[2])&&(i=RegExp("</"+p[2],"g")),l=Ve):p[3]!==void 0&&(l=Ve):l===Ve?p[0]===">"?(l=i!=null?i:Tt,m=-1):p[1]===void 0?m=-2:(m=l.lastIndex-p[2].length,u=p[1],l=p[3]===void 0?Ve:p[3]==='"'?Gi:Yi):l===Gi||l===Yi?l=Ve:l===Ki||l===Qi?l=Tt:(l=Ve,i=void 0);let h=l===Ve&&e[a+1].startsWith("/>")?" ":"";o+=l===Tt?c+fs:m>=0?(r.push(u),c.slice(0,m)+en+c.slice(m)+Le+h):c+Le+(m===-2?(r.push(void 0),a):h)}let s=o+(e[n]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[Wi!==void 0?Wi.createHTML(s):s,r]},We=class{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let o=0,l=0,s=t.length-1,a=this.parts,[c,u]=ro(t,n);if(this.el=We.createElement(c,r),ut.currentNode=this.el.content,n===2){let p=this.el.content,m=p.firstChild;m.remove(),p.append(...m.childNodes)}for(;(i=ut.nextNode())!==null&&a.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let p=[];for(let m of i.getAttributeNames())if(m.endsWith(en)||m.startsWith(Le)){let f=u[l++];if(p.push(m),f!==void 0){let h=i.getAttribute(f.toLowerCase()+en).split(Le),b=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:b[2],strings:h,ctor:b[1]==="."?nn:b[1]==="?"?rn:b[1]==="@"?on:Qe})}else a.push({type:6,index:o})}for(let m of p)i.removeAttribute(m)}if(to.test(i.tagName)){let p=i.textContent.split(Le),m=p.length-1;if(m>0){i.textContent=ct?ct.emptyScript:"";for(let f=0;f<m;f++)i.append(p[f],Lt()),ut.nextNode(),a.push({type:2,index:++o});i.append(p[m],Lt())}}}else if(i.nodeType===8)if(i.data===er)a.push({type:2,index:o});else{let p=-1;for(;(p=i.data.indexOf(Le,p+1))!==-1;)a.push({type:7,index:o}),p+=Le.length-1}o++}}static createElement(t,n){let r=pt.createElement("template");return r.innerHTML=t,r}};function Ke(e,t,n=e,r){var i,o,l,s;if(t===me)return t;let a=r!==void 0?(i=n._$Co)===null||i===void 0?void 0:i[r]:n._$Cl,c=Pt(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==c&&((o=a==null?void 0:a._$AO)===null||o===void 0||o.call(a,!1),c===void 0?a=void 0:(a=new c(e),a._$AT(e,n,r)),r!==void 0?((l=(s=n)._$Co)!==null&&l!==void 0?l:s._$Co=[])[r]=a:n._$Cl=a),a!==void 0&&(t=Ke(e,a._$AS(e,t.values),a,r)),t}var tn=class{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var n;let{el:{content:r},parts:i}=this._$AD,o=((n=t==null?void 0:t.creationScope)!==null&&n!==void 0?n:pt).importNode(r,!0);ut.currentNode=o;let l=ut.nextNode(),s=0,a=0,c=i[0];for(;c!==void 0;){if(s===c.index){let u;c.type===2?u=new $e(l,l.nextSibling,this,t):c.type===1?u=new c.ctor(l,c.name,c.strings,this,t):c.type===6&&(u=new ln(l,this,t)),this._$AV.push(u),c=i[++a]}s!==(c==null?void 0:c.index)&&(l=ut.nextNode(),s++)}return o}v(t){let n=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,n),n+=r.strings.length-2):r._$AI(t[n])),n++}},$e=class{constructor(t,n,r,i){var o;this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=r,this.options=i,this._$Cp=(o=i==null?void 0:i.isConnected)===null||o===void 0||o}get _$AU(){var t,n;return(n=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&n!==void 0?n:this._$Cp}get parentNode(){let t=this._$AA.parentNode,n=this._$AM;return n!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=Ke(this,t,n),Pt(t)?t===W||t==null||t===""?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==me&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):eo(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==W&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.$(pt.createTextNode(t)),this._$AH=t}g(t){var n;let{values:r,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=We.createElement(i.h,this.options)),i);if(((n=this._$AH)===null||n===void 0?void 0:n._$AD)===o)this._$AH.v(r);else{let l=new tn(o,this),s=l.u(this.options);l.v(r),this.$(s),this._$AH=l}}_$AC(t){let n=Zi.get(t.strings);return n===void 0&&Zi.set(t.strings,n=new We(t)),n}T(t){Ji(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let o of t)i===n.length?n.push(r=new $e(this.k(Lt()),this.k(Lt()),this,this.options)):r=n[i],r._$AI(o),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,n);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var n;this._$AM===void 0&&(this._$Cp=t,(n=this._$AP)===null||n===void 0||n.call(this,t))}},Qe=class{constructor(t,n,r,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=W}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,n=this,r,i){let o=this.strings,l=!1;if(o===void 0)t=Ke(this,t,n,0),l=!Pt(t)||t!==this._$AH&&t!==me,l&&(this._$AH=t);else{let s=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=Ke(this,s[r+a],n,a),c===me&&(c=this._$AH[a]),l||(l=!Pt(c)||c!==this._$AH[a]),c===W?t=W:t!==W&&(t+=(c!=null?c:"")+o[a+1]),this._$AH[a]=c}l&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},nn=class extends Qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}},ds=ct?ct.emptyScript:"",rn=class extends Qe{constructor(){super(...arguments),this.type=4}j(t){t&&t!==W?this.element.setAttribute(this.name,ds):this.element.removeAttribute(this.name)}},on=class extends Qe{constructor(t,n,r,i,o){super(t,n,r,i,o),this.type=5}_$AI(t,n=this){var r;if((t=(r=Ke(this,t,n,0))!==null&&r!==void 0?r:W)===me)return;let i=this._$AH,o=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,l=t!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),l&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var n,r;typeof this._$AH=="function"?this._$AH.call((r=(n=this.options)===null||n===void 0?void 0:n.host)!==null&&r!==void 0?r:this.element,t):this._$AH.handleEvent(t)}},ln=class{constructor(t,n,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ke(this,t)}},io={O:en,P:Le,A:er,C:1,M:ro,L:tn,D:eo,R:Ke,I:$e,V:Qe,H:rn,N:on,U:nn,F:ln},Xi=Jt.litHtmlPolyfillSupport;Xi==null||Xi(We,$e),((Xn=Jt.litHtmlVersions)!==null&&Xn!==void 0?Xn:Jt.litHtmlVersions=[]).push("2.7.2");var oo=(e,t,n)=>{var r,i;let o=(r=n==null?void 0:n.renderBefore)!==null&&r!==void 0?r:t,l=o._$litPart$;if(l===void 0){let s=(i=n==null?void 0:n.renderBefore)!==null&&i!==void 0?i:null;o._$litPart$=l=new $e(t.insertBefore(Lt(),s),s,void 0,n!=null?n:{})}return l._$AI(e),l};var tr,nr;var we=class extends Te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,n;let r=super.createRenderRoot();return(t=(n=this.renderOptions).renderBefore)!==null&&t!==void 0||(n.renderBefore=r.firstChild),r}update(t){let n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=oo(n,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return me}};we.finalized=!0,we._$litElement$=!0,(tr=globalThis.litElementHydrateSupport)===null||tr===void 0||tr.call(globalThis,{LitElement:we});var lo=globalThis.litElementPolyfillSupport;lo==null||lo({LitElement:we});((nr=globalThis.litElementVersions)!==null&&nr!==void 0?nr:globalThis.litElementVersions=[]).push("3.3.1");var an=e=>t=>typeof t=="function"?((n,r)=>(customElements.define(n,r),r))(e,t):((n,r)=>{let{kind:i,elements:o}=r;return{kind:i,elements:o,finisher(l){customElements.define(n,l)}}})(e,t);var gs=(e,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(n){n.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(n){n.createProperty(t.key,e)}};function oe(e){return(t,n)=>n!==void 0?((r,i,o)=>{i.constructor.createProperty(o,r)})(e,t,n):gs(e,t)}var rr,Vh=((rr=window.HTMLSlotElement)===null||rr===void 0?void 0:rr.prototype.assignedElements)!=null?(e,t)=>e.assignedElements(t):(e,t)=>e.assignedNodes(t).filter(n=>n.nodeType===Node.ELEMENT_NODE);var Ye={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ge=e=>(...t)=>({_$litDirective$:e,values:t}),Fe=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,r){this._$Ct=t,this._$AM=n,this._$Ci=r}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};var ir=Ge(class extends Fe{constructor(e){var t;if(super(e),e.type!==Ye.ATTRIBUTE||e.name!=="class"||((t=e.strings)===null||t===void 0?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var n,r;if(this.it===void 0){this.it=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(let o in t)t[o]&&!(!((n=this.nt)===null||n===void 0)&&n.has(o))&&this.it.add(o);return this.render(t)}let i=e.element.classList;this.it.forEach(o=>{o in t||(i.remove(o),this.it.delete(o))});for(let o in t){let l=!!t[o];l===this.it.has(o)||!((r=this.nt)===null||r===void 0)&&r.has(o)||(l?(i.add(o),this.it.add(o)):(i.remove(o),this.it.delete(o)))}return me}});var or="gpt-3.5-turbo",sn="Sorry, I am not sure how to answer that.",lr="https://api.markprompt.com/v1/completions",ao="___START_RESPONSE_STREAM___",xs={model:or,completionsUrl:lr,iDontKnowMessage:sn},so=async function(e,t,n,r,i){if(!t)throw new Error("A projectKey is required.");if(e){i=Object.fromEntries(Object.entries(xs).map(([o,l])=>{var s;return[o,(s=i==null?void 0:i[o])!=null?s:l]}));try{let o=await fetch(i.completionsUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:e,model:i.model,iDontKnowMessage:i.iDontKnowMessage,projectKey:t})});if(!o.ok||!o.body){let m=await o.text();return console.error("Error:",m),sn}let l=o.body.getReader(),s=new TextDecoder,a=!1,c="",u=!1,p=[];for(;!a;){let{value:m,done:f}=await l.read();a=f;let h=s.decode(m);if(u)n(h);else if(c=c+h,c.includes(ao)){let b=c.split(ao);try{p=JSON.parse(b[0])}catch{}n(b[1]),u=!0}}r(p)}catch(o){console.error("Error",o),n(i.iDontKnowMessage)}}};function ar(e){if(e)throw e}var Po=Wn(sr(),1),gr=Wn(bo(),1);function Dt(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function wo(){let e=[],t={run:n,use:r};return t;function n(...i){let o=-1,l=i.pop();if(typeof l!="function")throw new TypeError("Expected function as last argument, not "+l);s(null,...i);function s(a,...c){let u=e[++o],p=-1;if(a){l(a);return}for(;++p<i.length;)(c[p]===null||c[p]===void 0)&&(c[p]=i[p]);i=c,u?ys(u,s)(...c):l(null,...c)}}function r(i){if(typeof i!="function")throw new TypeError("Expected `middelware` to be a function, not "+i);return e.push(i),t}}function ys(e,t){let n;return r;function r(...l){let s=e.length>l.length,a;s&&l.push(i);try{a=e.apply(this,l)}catch(c){let u=c;if(s&&n)throw u;return i(u)}s||(a instanceof Promise?a.then(o,i):a instanceof Error?i(a):o(a))}function i(l,...s){n||(n=!0,t(l,...s))}function o(l){i(null,l)}}var Eo=Wn(sr(),1);function Ne(e){return!e||typeof e!="object"?"":"position"in e||"type"in e?ko(e.position):"start"in e||"end"in e?ko(e):"line"in e||"column"in e?ur(e):""}function ur(e){return So(e&&e.line)+":"+So(e&&e.column)}function ko(e){return ur(e&&e.start)+"-"+ur(e&&e.end)}function So(e){return e&&typeof e=="number"?e:1}var ae=class extends Error{constructor(t,n,r){let i=[null,null],o={start:{line:null,column:null},end:{line:null,column:null}};if(super(),typeof n=="string"&&(r=n,n=void 0),typeof r=="string"){let l=r.indexOf(":");l===-1?i[1]=r:(i[0]=r.slice(0,l),i[1]=r.slice(l+1))}n&&("type"in n||"position"in n?n.position&&(o=n.position):"start"in n||"end"in n?o=n:("line"in n||"column"in n)&&(o.start=n)),this.name=Ne(n)||"1:1",this.message=typeof t=="object"?t.message:t,this.stack="",typeof t=="object"&&t.stack&&(this.stack=t.stack),this.reason=this.message,this.fatal,this.line=o.start.line,this.column=o.start.column,this.position=o,this.source=i[0],this.ruleId=i[1],this.file,this.actual,this.expected,this.url,this.note}};ae.prototype.file="";ae.prototype.name="";ae.prototype.reason="";ae.prototype.message="";ae.prototype.stack="";ae.prototype.fatal=null;ae.prototype.column=null;ae.prototype.line=null;ae.prototype.source=null;ae.prototype.ruleId=null;ae.prototype.position=null;var ye={basename:bs,dirname:ws,extname:ks,join:Ss,sep:"/"};function bs(e,t){if(t!==void 0&&typeof t!="string")throw new TypeError('"ext" argument must be a string');Ot(e);let n=0,r=-1,i=e.length,o;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.charCodeAt(i)===47){if(o){n=i+1;break}}else r<0&&(o=!0,r=i+1);return r<0?"":e.slice(n,r)}if(t===e)return"";let l=-1,s=t.length-1;for(;i--;)if(e.charCodeAt(i)===47){if(o){n=i+1;break}}else l<0&&(o=!0,l=i+1),s>-1&&(e.charCodeAt(i)===t.charCodeAt(s--)?s<0&&(r=i):(s=-1,r=l));return n===r?r=l:r<0&&(r=e.length),e.slice(n,r)}function ws(e){if(Ot(e),e.length===0)return".";let t=-1,n=e.length,r;for(;--n;)if(e.charCodeAt(n)===47){if(r){t=n;break}}else r||(r=!0);return t<0?e.charCodeAt(0)===47?"/":".":t===1&&e.charCodeAt(0)===47?"//":e.slice(0,t)}function ks(e){Ot(e);let t=e.length,n=-1,r=0,i=-1,o=0,l;for(;t--;){let s=e.charCodeAt(t);if(s===47){if(l){r=t+1;break}continue}n<0&&(l=!0,n=t+1),s===46?i<0?i=t:o!==1&&(o=1):i>-1&&(o=-1)}return i<0||n<0||o===0||o===1&&i===n-1&&i===r+1?"":e.slice(i,n)}function Ss(...e){let t=-1,n;for(;++t<e.length;)Ot(e[t]),e[t]&&(n=n===void 0?e[t]:n+"/"+e[t]);return n===void 0?".":As(n)}function As(e){Ot(e);let t=e.charCodeAt(0)===47,n=Cs(e,!t);return n.length===0&&!t&&(n="."),n.length>0&&e.charCodeAt(e.length-1)===47&&(n+="/"),t?"/"+n:n}function Cs(e,t){let n="",r=0,i=-1,o=0,l=-1,s,a;for(;++l<=e.length;){if(l<e.length)s=e.charCodeAt(l);else{if(s===47)break;s=47}if(s===47){if(!(i===l-1||o===1))if(i!==l-1&&o===2){if(n.length<2||r!==2||n.charCodeAt(n.length-1)!==46||n.charCodeAt(n.length-2)!==46){if(n.length>2){if(a=n.lastIndexOf("/"),a!==n.length-1){a<0?(n="",r=0):(n=n.slice(0,a),r=n.length-1-n.lastIndexOf("/")),i=l,o=0;continue}}else if(n.length>0){n="",r=0,i=l,o=0;continue}}t&&(n=n.length>0?n+"/..":"..",r=2)}else n.length>0?n+="/"+e.slice(i+1,l):n=e.slice(i+1,l),r=l-i-1;i=l,o=0}else s===46&&o>-1?o++:o=-1}return n}function Ot(e){if(typeof e!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}var Ao={cwd:vs};function vs(){return"/"}function ht(e){return e!==null&&typeof e=="object"&&e.href&&e.origin}function Co(e){if(typeof e=="string")e=new URL(e);else if(!ht(e)){let t=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code="ERR_INVALID_ARG_TYPE",t}if(e.protocol!=="file:"){let t=new TypeError("The URL must be of scheme file");throw t.code="ERR_INVALID_URL_SCHEME",t}return Es(e)}function Es(e){if(e.hostname!==""){let r=new TypeError('File URL host must be "localhost" or empty on darwin');throw r.code="ERR_INVALID_FILE_URL_HOST",r}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.charCodeAt(n)===37&&t.charCodeAt(n+1)===50){let r=t.charCodeAt(n+2);if(r===70||r===102){let i=new TypeError("File URL path must not include encoded / characters");throw i.code="ERR_INVALID_FILE_URL_PATH",i}}return decodeURIComponent(t)}var cr=["history","path","basename","stem","extname","dirname"],It=class{constructor(t){let n;t?typeof t=="string"||_s(t)?n={value:t}:ht(t)?n={path:t}:n=t:n={},this.data={},this.messages=[],this.history=[],this.cwd=Ao.cwd(),this.value,this.stored,this.result,this.map;let r=-1;for(;++r<cr.length;){let o=cr[r];o in n&&n[o]!==void 0&&n[o]!==null&&(this[o]=o==="history"?[...n[o]]:n[o])}let i;for(i in n)cr.includes(i)||(this[i]=n[i])}get path(){return this.history[this.history.length-1]}set path(t){ht(t)&&(t=Co(t)),hr(t,"path"),this.path!==t&&this.history.push(t)}get dirname(){return typeof this.path=="string"?ye.dirname(this.path):void 0}set dirname(t){vo(this.basename,"dirname"),this.path=ye.join(t||"",this.basename)}get basename(){return typeof this.path=="string"?ye.basename(this.path):void 0}set basename(t){hr(t,"basename"),pr(t,"basename"),this.path=ye.join(this.dirname||"",t)}get extname(){return typeof this.path=="string"?ye.extname(this.path):void 0}set extname(t){if(pr(t,"extname"),vo(this.dirname,"extname"),t){if(t.charCodeAt(0)!==46)throw new Error("`extname` must start with `.`");if(t.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=ye.join(this.dirname,this.stem+(t||""))}get stem(){return typeof this.path=="string"?ye.basename(this.path,this.extname):void 0}set stem(t){hr(t,"stem"),pr(t,"stem"),this.path=ye.join(this.dirname||"",t+(this.extname||""))}toString(t){return(this.value||"").toString(t||void 0)}message(t,n,r){let i=new ae(t,n,r);return this.path&&(i.name=this.path+":"+i.name,i.file=this.path),i.fatal=!1,this.messages.push(i),i}info(t,n,r){let i=this.message(t,n,r);return i.fatal=null,i}fail(t,n,r){let i=this.message(t,n,r);throw i.fatal=!0,i}};function pr(e,t){if(e&&e.includes(ye.sep))throw new Error("`"+t+"` cannot be a path: did not expect `"+ye.sep+"`")}function hr(e,t){if(!e)throw new Error("`"+t+"` cannot be empty")}function vo(e,t){if(!e)throw new Error("Setting `"+t+"` requires `path` to be set too")}function _s(e){return(0,Eo.default)(e)}var xr=Do().freeze(),Fo={}.hasOwnProperty;function Do(){let e=wo(),t=[],n={},r,i=-1;return o.data=l,o.Parser=void 0,o.Compiler=void 0,o.freeze=s,o.attachers=t,o.use=a,o.parse=c,o.stringify=u,o.run=p,o.runSync=m,o.process=f,o.processSync=h,o;function o(){let b=Do(),S=-1;for(;++S<t.length;)b.use(...t[S]);return b.data((0,gr.default)(!0,{},n)),b}function l(b,S){return typeof b=="string"?arguments.length===2?(dr("data",r),n[b]=S,o):Fo.call(n,b)&&n[b]||null:b?(dr("data",r),n=b,o):n}function s(){if(r)return o;for(;++i<t.length;){let[b,...S]=t[i];if(S[0]===!1)continue;S[0]===!0&&(S[0]=void 0);let x=b.call(o,...S);typeof x=="function"&&e.use(x)}return r=!0,i=Number.POSITIVE_INFINITY,o}function a(b,...S){let x;if(dr("use",r),b!=null)if(typeof b=="function")D(b,...S);else if(typeof b=="object")Array.isArray(b)?P(b):C(b);else throw new TypeError("Expected usable value, not `"+b+"`");return x&&(n.settings=Object.assign(n.settings||{},x)),o;function _(k){if(typeof k=="function")D(k);else if(typeof k=="object")if(Array.isArray(k)){let[L,...$]=k;D(L,...$)}else C(k);else throw new TypeError("Expected usable value, not `"+k+"`")}function C(k){P(k.plugins),k.settings&&(x=Object.assign(x||{},k.settings))}function P(k){let L=-1;if(k!=null)if(Array.isArray(k))for(;++L<k.length;){let $=k[L];_($)}else throw new TypeError("Expected a list of plugins, not `"+k+"`")}function D(k,L){let $=-1,R;for(;++$<t.length;)if(t[$][0]===k){R=t[$];break}R?(Dt(R[1])&&Dt(L)&&(L=(0,gr.default)(!0,R[1],L)),R[1]=L):t.push([...arguments])}}function c(b){o.freeze();let S=zt(b),x=o.Parser;return mr("parse",x),_o(x,"parse")?new x(String(S),S).parse():x(String(S),S)}function u(b,S){o.freeze();let x=zt(S),_=o.Compiler;return fr("stringify",_),To(b),_o(_,"compile")?new _(b,x).compile():_(b,x)}function p(b,S,x){if(To(b),o.freeze(),!x&&typeof S=="function"&&(x=S,S=void 0),!x)return new Promise(_);_(null,x);function _(C,P){e.run(b,zt(S),D);function D(k,L,$){L=L||b,k?P(k):C?C(L):x(null,L,$)}}}function m(b,S){let x,_;return o.run(b,S,C),Lo("runSync","run",_),x;function C(P,D){ar(P),x=D,_=!0}}function f(b,S){if(o.freeze(),mr("process",o.Parser),fr("process",o.Compiler),!S)return new Promise(x);x(null,S);function x(_,C){let P=zt(b);o.run(o.parse(P),P,(k,L,$)=>{if(k||!L||!$)D(k);else{let R=o.stringify(L,$);R==null||(Ps(R)?$.value=R:$.result=R),D(k,$)}});function D(k,L){k||!L?C(k):_?_(L):S(null,L)}}}function h(b){let S;o.freeze(),mr("processSync",o.Parser),fr("processSync",o.Compiler);let x=zt(b);return o.process(x,_),Lo("processSync","process",S),x;function _(C){S=!0,ar(C)}}}function _o(e,t){return typeof e=="function"&&e.prototype&&(Ts(e.prototype)||t in e.prototype)}function Ts(e){let t;for(t in e)if(Fo.call(e,t))return!0;return!1}function mr(e,t){if(typeof t!="function")throw new TypeError("Cannot `"+e+"` without `Parser`")}function fr(e,t){if(typeof t!="function")throw new TypeError("Cannot `"+e+"` without `Compiler`")}function dr(e,t){if(t)throw new Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function To(e){if(!Dt(e)||typeof e.type!="string")throw new TypeError("Expected node, got `"+e+"`")}function Lo(e,t,n){if(!n)throw new Error("`"+e+"` finished async. Use `"+t+"` instead")}function zt(e){return Ls(e)?e:new It(e)}function Ls(e){return!!(e&&typeof e=="object"&&"message"in e&&"messages"in e)}function Ps(e){return typeof e=="string"||(0,Po.default)(e)}var Fs={};function yr(e,t){let n=t||Fs,r=typeof n.includeImageAlt=="boolean"?n.includeImageAlt:!0,i=typeof n.includeHtml=="boolean"?n.includeHtml:!0;return Io(e,r,i)}function Io(e,t,n){if(Ds(e)){if("value"in e)return e.type==="html"&&!n?"":e.value;if(t&&"alt"in e&&e.alt)return e.alt;if("children"in e)return Oo(e.children,t,n)}return Array.isArray(e)?Oo(e,t,n):""}function Oo(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Io(e[i],t,n);return r.join("")}function Ds(e){return!!(e&&typeof e=="object")}function X(e,t,n,r){let i=e.length,o=0,l;if(t<0?t=-t>i?0:i+t:t=t>i?i:t,n=n>0?n:0,r.length<1e4)l=Array.from(r),l.unshift(t,n),[].splice.apply(e,l);else for(n&&[].splice.apply(e,[t,n]);o<r.length;)l=r.slice(o,o+1e4),l.unshift(t,0),[].splice.apply(e,l),o+=1e4,t+=1e4}function he(e,t){return e.length>0?(X(e,e.length,0,t),e):t}var zo={}.hasOwnProperty;function cn(e){let t={},n=-1;for(;++n<e.length;)Os(t,e[n]);return t}function Os(e,t){let n;for(n in t){let i=(zo.call(e,n)?e[n]:void 0)||(e[n]={}),o=t[n],l;for(l in o){zo.call(i,l)||(i[l]=[]);let s=o[l];Is(i[l],Array.isArray(s)?s:s?[s]:[])}}}function Is(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add==="after"?e:r).push(t[n]);X(e,0,0,r)}var $o=/[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;var se=Me(/[A-Za-z]/),Ze=Me(/\d/),No=Me(/[\dA-Fa-f]/),J=Me(/[\dA-Za-z]/),Ro=Me(/[!-/:-@[-`{-~]/),br=Me(/[#-'*+\--9=?A-Z^-~]/);function Re(e){return e!==null&&(e<32||e===127)}function B(e){return e!==null&&(e<0||e===32)}function E(e){return e!==null&&e<-2}function N(e){return e===-2||e===-1||e===32}var Xe=Me(/\s/),Je=Me($o);function Me(e){return t;function t(n){return n!==null&&e.test(String.fromCharCode(n))}}function F(e,t,n,r){let i=r?r-1:Number.POSITIVE_INFINITY,o=0;return l;function l(a){return N(a)?(e.enter(n),s(a)):t(a)}function s(a){return N(a)&&o++<i?(e.consume(a),s):(e.exit(n),t(a))}}var Mo={tokenize:zs};function zs(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(s){if(s===null){e.consume(s);return}return e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),F(e,t,"linePrefix")}function i(s){return e.enter("paragraph"),o(s)}function o(s){let a=e.enter("chunkText",{contentType:"text",previous:n});return n&&(n.next=a),n=a,l(s)}function l(s){if(s===null){e.exit("chunkText"),e.exit("paragraph"),e.consume(s);return}return E(s)?(e.consume(s),e.exit("chunkText"),o):(e.consume(s),l)}}var Ho={tokenize:$s},Bo={tokenize:Ns};function $s(e){let t=this,n=[],r=0,i,o,l;return s;function s(C){if(r<n.length){let P=n[r];return t.containerState=P[1],e.attempt(P[0].continuation,a,c)(C)}return c(C)}function a(C){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&_();let P=t.events.length,D=P,k;for(;D--;)if(t.events[D][0]==="exit"&&t.events[D][1].type==="chunkFlow"){k=t.events[D][1].end;break}x(r);let L=P;for(;L<t.events.length;)t.events[L][1].end=Object.assign({},k),L++;return X(t.events,D+1,0,t.events.slice(P)),t.events.length=L,c(C)}return s(C)}function c(C){if(r===n.length){if(!i)return m(C);if(i.currentConstruct&&i.currentConstruct.concrete)return h(C);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(Bo,u,p)(C)}function u(C){return i&&_(),x(r),m(C)}function p(C){return t.parser.lazy[t.now().line]=r!==n.length,l=t.now().offset,h(C)}function m(C){return t.containerState={},e.attempt(Bo,f,h)(C)}function f(C){return r++,n.push([t.currentConstruct,t.containerState]),m(C)}function h(C){if(C===null){i&&_(),x(0),e.consume(C);return}return i=i||t.parser.flow(t.now()),e.enter("chunkFlow",{contentType:"flow",previous:o,_tokenizer:i}),b(C)}function b(C){if(C===null){S(e.exit("chunkFlow"),!0),x(0),e.consume(C);return}return E(C)?(e.consume(C),S(e.exit("chunkFlow")),r=0,t.interrupt=void 0,s):(e.consume(C),b)}function S(C,P){let D=t.sliceStream(C);if(P&&D.push(null),C.previous=o,o&&(o.next=C),o=C,i.defineSkip(C.start),i.write(D),t.parser.lazy[C.start.line]){let k=i.events.length;for(;k--;)if(i.events[k][1].start.offset<l&&(!i.events[k][1].end||i.events[k][1].end.offset>l))return;let L=t.events.length,$=L,R,ee;for(;$--;)if(t.events[$][0]==="exit"&&t.events[$][1].type==="chunkFlow"){if(R){ee=t.events[$][1].end;break}R=!0}for(x(r),k=L;k<t.events.length;)t.events[k][1].end=Object.assign({},ee),k++;X(t.events,$+1,0,t.events.slice(L)),t.events.length=k}}function x(C){let P=n.length;for(;P-- >C;){let D=n[P];t.containerState=D[1],D[0].exit.call(t,e)}n.length=C}function _(){i.write([null]),o=void 0,i=void 0,t.containerState._closeFlow=void 0}}function Ns(e,t,n){return F(e,e.attempt(this.parser.constructs.document,t,n),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function mt(e){if(e===null||B(e)||Xe(e))return 1;if(Je(e))return 2}function Be(e,t,n){let r=[],i=-1;for(;++i<e.length;){let o=e[i].resolveAll;o&&!r.includes(o)&&(t=o(t,n),r.push(o))}return t}var $t={name:"attention",tokenize:Ms,resolveAll:Rs};function Rs(e,t){let n=-1,r,i,o,l,s,a,c,u;for(;++n<e.length;)if(e[n][0]==="enter"&&e[n][1].type==="attentionSequence"&&e[n][1]._close){for(r=n;r--;)if(e[r][0]==="exit"&&e[r][1].type==="attentionSequence"&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;a=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let p=Object.assign({},e[r][1].end),m=Object.assign({},e[n][1].start);Uo(p,-a),Uo(m,a),l={type:a>1?"strongSequence":"emphasisSequence",start:p,end:Object.assign({},e[r][1].end)},s={type:a>1?"strongSequence":"emphasisSequence",start:Object.assign({},e[n][1].start),end:m},o={type:a>1?"strongText":"emphasisText",start:Object.assign({},e[r][1].end),end:Object.assign({},e[n][1].start)},i={type:a>1?"strong":"emphasis",start:Object.assign({},l.start),end:Object.assign({},s.end)},e[r][1].end=Object.assign({},l.start),e[n][1].start=Object.assign({},s.end),c=[],e[r][1].end.offset-e[r][1].start.offset&&(c=he(c,[["enter",e[r][1],t],["exit",e[r][1],t]])),c=he(c,[["enter",i,t],["enter",l,t],["exit",l,t],["enter",o,t]]),c=he(c,Be(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),c=he(c,[["exit",o,t],["enter",s,t],["exit",s,t],["exit",i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,c=he(c,[["enter",e[n][1],t],["exit",e[n][1],t]])):u=0,X(e,r-1,n-r+3,c),n=r+c.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type==="attentionSequence"&&(e[n][1].type="data");return e}function Ms(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=mt(r),o;return l;function l(a){return e.enter("attentionSequence"),o=a,s(a)}function s(a){if(a===o)return e.consume(a),s;let c=e.exit("attentionSequence"),u=mt(a),p=!u||u===2&&i||n.includes(a),m=!i||i===2&&u||n.includes(r);return c._open=!!(o===42?p:p&&(i||!m)),c._close=!!(o===42?m:m&&(u||!p)),t(a)}}function Uo(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var wr={name:"autolink",tokenize:Bs};function Bs(e,t,n){let r=1;return i;function i(h){return e.enter("autolink"),e.enter("autolinkMarker"),e.consume(h),e.exit("autolinkMarker"),e.enter("autolinkProtocol"),o}function o(h){return se(h)?(e.consume(h),l):br(h)?c(h):n(h)}function l(h){return h===43||h===45||h===46||J(h)?s(h):c(h)}function s(h){return h===58?(e.consume(h),a):(h===43||h===45||h===46||J(h))&&r++<32?(e.consume(h),s):c(h)}function a(h){return h===62?(e.exit("autolinkProtocol"),f(h)):h===null||h===32||h===60||Re(h)?n(h):(e.consume(h),a)}function c(h){return h===64?(e.consume(h),r=0,u):br(h)?(e.consume(h),c):n(h)}function u(h){return J(h)?p(h):n(h)}function p(h){return h===46?(e.consume(h),r=0,u):h===62?(e.exit("autolinkProtocol").type="autolinkEmail",f(h)):m(h)}function m(h){return(h===45||J(h))&&r++<63?(e.consume(h),h===45?m:p):n(h)}function f(h){return e.enter("autolinkMarker"),e.consume(h),e.exit("autolinkMarker"),e.exit("autolink"),t}}var ke={tokenize:Hs,partial:!0};function Hs(e,t,n){return F(e,r,"linePrefix");function r(i){return i===null||E(i)?t(i):n(i)}}var pn={name:"blockQuote",tokenize:Us,continuation:{tokenize:js},exit:qs};function Us(e,t,n){let r=this;return i;function i(l){if(l===62){let s=r.containerState;return s.open||(e.enter("blockQuote",{_container:!0}),s.open=!0),e.enter("blockQuotePrefix"),e.enter("blockQuoteMarker"),e.consume(l),e.exit("blockQuoteMarker"),o}return n(l)}function o(l){return N(l)?(e.enter("blockQuotePrefixWhitespace"),e.consume(l),e.exit("blockQuotePrefixWhitespace"),e.exit("blockQuotePrefix"),t):(e.exit("blockQuotePrefix"),t(l))}}function js(e,t,n){return F(e,e.attempt(pn,t,n),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function qs(e){e.exit("blockQuote")}var hn={name:"characterEscape",tokenize:Vs};function Vs(e,t,n){return r;function r(o){return e.enter("characterEscape"),e.enter("escapeMarker"),e.consume(o),e.exit("escapeMarker"),i}function i(o){return Ro(o)?(e.enter("characterEscapeValue"),e.consume(o),e.exit("characterEscapeValue"),e.exit("characterEscape"),t):n(o)}}var jo=document.createElement("i");function ft(e){let t="&"+e+";";jo.innerHTML=t;let n=jo.textContent;return n.charCodeAt(n.length-1)===59&&e!=="semi"||n===t?!1:n}var mn={name:"characterReference",tokenize:Ws};function Ws(e,t,n){let r=this,i=0,o,l;return s;function s(p){return e.enter("characterReference"),e.enter("characterReferenceMarker"),e.consume(p),e.exit("characterReferenceMarker"),a}function a(p){return p===35?(e.enter("characterReferenceMarkerNumeric"),e.consume(p),e.exit("characterReferenceMarkerNumeric"),c):(e.enter("characterReferenceValue"),o=31,l=J,u(p))}function c(p){return p===88||p===120?(e.enter("characterReferenceMarkerHexadecimal"),e.consume(p),e.exit("characterReferenceMarkerHexadecimal"),e.enter("characterReferenceValue"),o=6,l=No,u):(e.enter("characterReferenceValue"),o=7,l=Ze,u(p))}function u(p){let m;return p===59&&i?(m=e.exit("characterReferenceValue"),l===J&&!ft(r.sliceSerialize(m))?n(p):(e.enter("characterReferenceMarker"),e.consume(p),e.exit("characterReferenceMarker"),e.exit("characterReference"),t)):l(p)&&i++<o?(e.consume(p),u):n(p)}}var fn={name:"codeFenced",tokenize:Ks,concrete:!0};function Ks(e,t,n){let r=this,i={tokenize:D,partial:!0},o={tokenize:P,partial:!0},l=this.events[this.events.length-1],s=l&&l[1].type==="linePrefix"?l[2].sliceSerialize(l[1],!0).length:0,a=0,c;return u;function u(k){return e.enter("codeFenced"),e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),c=k,p(k)}function p(k){return k===c?(e.consume(k),a++,p):(e.exit("codeFencedFenceSequence"),a<3?n(k):F(e,m,"whitespace")(k))}function m(k){return k===null||E(k)?S(k):(e.enter("codeFencedFenceInfo"),e.enter("chunkString",{contentType:"string"}),f(k))}function f(k){return k===null||B(k)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),F(e,h,"whitespace")(k)):k===96&&k===c?n(k):(e.consume(k),f)}function h(k){return k===null||E(k)?S(k):(e.enter("codeFencedFenceMeta"),e.enter("chunkString",{contentType:"string"}),b(k))}function b(k){return k===null||E(k)?(e.exit("chunkString"),e.exit("codeFencedFenceMeta"),S(k)):k===96&&k===c?n(k):(e.consume(k),b)}function S(k){return e.exit("codeFencedFence"),r.interrupt?t(k):x(k)}function x(k){return k===null?C(k):E(k)?e.attempt(o,e.attempt(i,C,s?F(e,x,"linePrefix",s+1):x),C)(k):(e.enter("codeFlowValue"),_(k))}function _(k){return k===null||E(k)?(e.exit("codeFlowValue"),x(k)):(e.consume(k),_)}function C(k){return e.exit("codeFenced"),t(k)}function P(k,L,$){let R=this;return ee;function ee(H){return k.enter("lineEnding"),k.consume(H),k.exit("lineEnding"),I}function I(H){return R.parser.lazy[R.now().line]?$(H):L(H)}}function D(k,L,$){let R=0;return F(k,ee,"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function ee(T){return k.enter("codeFencedFence"),k.enter("codeFencedFenceSequence"),I(T)}function I(T){return T===c?(k.consume(T),R++,I):R<a?$(T):(k.exit("codeFencedFenceSequence"),F(k,H,"whitespace")(T))}function H(T){return T===null||E(T)?(k.exit("codeFencedFence"),L(T)):$(T)}}}var Nt={name:"codeIndented",tokenize:Ys},Qs={tokenize:Gs,partial:!0};function Ys(e,t,n){let r=this;return i;function i(c){return e.enter("codeIndented"),F(e,o,"linePrefix",4+1)(c)}function o(c){let u=r.events[r.events.length-1];return u&&u[1].type==="linePrefix"&&u[2].sliceSerialize(u[1],!0).length>=4?l(c):n(c)}function l(c){return c===null?a(c):E(c)?e.attempt(Qs,l,a)(c):(e.enter("codeFlowValue"),s(c))}function s(c){return c===null||E(c)?(e.exit("codeFlowValue"),l(c)):(e.consume(c),s)}function a(c){return e.exit("codeIndented"),t(c)}}function Gs(e,t,n){let r=this;return i;function i(l){return r.parser.lazy[r.now().line]?n(l):E(l)?(e.enter("lineEnding"),e.consume(l),e.exit("lineEnding"),i):F(e,o,"linePrefix",4+1)(l)}function o(l){let s=r.events[r.events.length-1];return s&&s[1].type==="linePrefix"&&s[2].sliceSerialize(s[1],!0).length>=4?t(l):E(l)?i(l):n(l)}}var kr={name:"codeText",tokenize:Js,resolve:Zs,previous:Xs};function Zs(e){let t=e.length-4,n=3,r,i;if((e[n][1].type==="lineEnding"||e[n][1].type==="space")&&(e[t][1].type==="lineEnding"||e[t][1].type==="space")){for(r=n;++r<t;)if(e[r][1].type==="codeTextData"){e[n][1].type="codeTextPadding",e[t][1].type="codeTextPadding",n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!=="lineEnding"&&(i=r):(r===t||e[r][1].type==="lineEnding")&&(e[i][1].type="codeTextData",r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function Xs(e){return e!==96||this.events[this.events.length-1][1].type==="characterEscape"}function Js(e,t,n){let r=this,i=0,o,l;return s;function s(m){return e.enter("codeText"),e.enter("codeTextSequence"),a(m)}function a(m){return m===96?(e.consume(m),i++,a):(e.exit("codeTextSequence"),c(m))}function c(m){return m===null?n(m):m===96?(l=e.enter("codeTextSequence"),o=0,p(m)):m===32?(e.enter("space"),e.consume(m),e.exit("space"),c):E(m)?(e.enter("lineEnding"),e.consume(m),e.exit("lineEnding"),c):(e.enter("codeTextData"),u(m))}function u(m){return m===null||m===32||m===96||E(m)?(e.exit("codeTextData"),c(m)):(e.consume(m),u)}function p(m){return m===96?(e.consume(m),o++,p):o===i?(e.exit("codeTextSequence"),e.exit("codeText"),t(m)):(l.type="codeTextData",u(m))}}function dn(e){let t={},n=-1,r,i,o,l,s,a,c;for(;++n<e.length;){for(;n in t;)n=t[n];if(r=e[n],n&&r[1].type==="chunkFlow"&&e[n-1][1].type==="listItemPrefix"&&(a=r[1]._tokenizer.events,o=0,o<a.length&&a[o][1].type==="lineEndingBlank"&&(o+=2),o<a.length&&a[o][1].type==="content"))for(;++o<a.length&&a[o][1].type!=="content";)a[o][1].type==="chunkText"&&(a[o][1]._isInFirstContentOfListItem=!0,o++);if(r[0]==="enter")r[1].contentType&&(Object.assign(t,eu(e,n)),n=t[n],c=!0);else if(r[1]._container){for(o=n,i=void 0;o--&&(l=e[o],l[1].type==="lineEnding"||l[1].type==="lineEndingBlank");)l[0]==="enter"&&(i&&(e[i][1].type="lineEndingBlank"),l[1].type="lineEnding",i=o);i&&(r[1].end=Object.assign({},e[i][1].start),s=e.slice(i,n),s.unshift(r),X(e,i,n-i+1,s))}}return!c}function eu(e,t){let n=e[t][1],r=e[t][2],i=t-1,o=[],l=n._tokenizer||r.parser[n.contentType](n.start),s=l.events,a=[],c={},u,p,m=-1,f=n,h=0,b=0,S=[b];for(;f;){for(;e[++i][1]!==f;);o.push(i),f._tokenizer||(u=r.sliceStream(f),f.next||u.push(null),p&&l.defineSkip(f.start),f._isInFirstContentOfListItem&&(l._gfmTasklistFirstContentOfListItem=!0),l.write(u),f._isInFirstContentOfListItem&&(l._gfmTasklistFirstContentOfListItem=void 0)),p=f,f=f.next}for(f=n;++m<s.length;)s[m][0]==="exit"&&s[m-1][0]==="enter"&&s[m][1].type===s[m-1][1].type&&s[m][1].start.line!==s[m][1].end.line&&(b=m+1,S.push(b),f._tokenizer=void 0,f.previous=void 0,f=f.next);for(l.events=[],f?(f._tokenizer=void 0,f.previous=void 0):S.pop(),m=S.length;m--;){let x=s.slice(S[m],S[m+1]),_=o.pop();a.unshift([_,_+x.length-1]),X(e,_,2,x)}for(m=-1;++m<a.length;)c[h+a[m][0]]=h+a[m][1],h+=a[m][1]-a[m][0]-1;return c}var Sr={tokenize:ru,resolve:nu},tu={tokenize:iu,partial:!0};function nu(e){return dn(e),e}function ru(e,t){let n;return r;function r(s){return e.enter("content"),n=e.enter("chunkContent",{contentType:"content"}),i(s)}function i(s){return s===null?o(s):E(s)?e.check(tu,l,o)(s):(e.consume(s),i)}function o(s){return e.exit("chunkContent"),e.exit("content"),t(s)}function l(s){return e.consume(s),e.exit("chunkContent"),n.next=e.enter("chunkContent",{contentType:"content",previous:n}),n=n.next,i}}function iu(e,t,n){let r=this;return i;function i(l){return e.exit("chunkContent"),e.enter("lineEnding"),e.consume(l),e.exit("lineEnding"),F(e,o,"linePrefix")}function o(l){if(l===null||E(l))return n(l);let s=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes("codeIndented")&&s&&s[1].type==="linePrefix"&&s[2].sliceSerialize(s[1],!0).length>=4?t(l):e.interrupt(r.parser.constructs.flow,n,t)(l)}}function gn(e,t,n,r,i,o,l,s,a){let c=a||Number.POSITIVE_INFINITY,u=0;return p;function p(x){return x===60?(e.enter(r),e.enter(i),e.enter(o),e.consume(x),e.exit(o),m):x===null||x===41||Re(x)?n(x):(e.enter(r),e.enter(l),e.enter(s),e.enter("chunkString",{contentType:"string"}),b(x))}function m(x){return x===62?(e.enter(o),e.consume(x),e.exit(o),e.exit(i),e.exit(r),t):(e.enter(s),e.enter("chunkString",{contentType:"string"}),f(x))}function f(x){return x===62?(e.exit("chunkString"),e.exit(s),m(x)):x===null||x===60||E(x)?n(x):(e.consume(x),x===92?h:f)}function h(x){return x===60||x===62||x===92?(e.consume(x),f):f(x)}function b(x){return x===40?++u>c?n(x):(e.consume(x),b):x===41?u--?(e.consume(x),b):(e.exit("chunkString"),e.exit(s),e.exit(l),e.exit(r),t(x)):x===null||B(x)?u?n(x):(e.exit("chunkString"),e.exit(s),e.exit(l),e.exit(r),t(x)):Re(x)?n(x):(e.consume(x),x===92?S:b)}function S(x){return x===40||x===41||x===92?(e.consume(x),b):b(x)}}function xn(e,t,n,r,i,o){let l=this,s=0,a;return c;function c(f){return e.enter(r),e.enter(i),e.consume(f),e.exit(i),e.enter(o),u}function u(f){return f===null||f===91||f===93&&!a||f===94&&!s&&"_hiddenFootnoteSupport"in l.parser.constructs||s>999?n(f):f===93?(e.exit(o),e.enter(i),e.consume(f),e.exit(i),e.exit(r),t):E(f)?(e.enter("lineEnding"),e.consume(f),e.exit("lineEnding"),u):(e.enter("chunkString",{contentType:"string"}),p(f))}function p(f){return f===null||f===91||f===93||E(f)||s++>999?(e.exit("chunkString"),u(f)):(e.consume(f),a=a||!N(f),f===92?m:p)}function m(f){return f===91||f===92||f===93?(e.consume(f),s++,p):p(f)}}function yn(e,t,n,r,i,o){let l;return s;function s(m){return e.enter(r),e.enter(i),e.consume(m),e.exit(i),l=m===40?41:m,a}function a(m){return m===l?(e.enter(i),e.consume(m),e.exit(i),e.exit(r),t):(e.enter(o),c(m))}function c(m){return m===l?(e.exit(o),a(l)):m===null?n(m):E(m)?(e.enter("lineEnding"),e.consume(m),e.exit("lineEnding"),F(e,c,"linePrefix")):(e.enter("chunkString",{contentType:"string"}),u(m))}function u(m){return m===l||m===null||E(m)?(e.exit("chunkString"),c(m)):(e.consume(m),m===92?p:u)}function p(m){return m===l||m===92?(e.consume(m),u):u(m)}}function et(e,t){let n;return r;function r(i){return E(i)?(e.enter("lineEnding"),e.consume(i),e.exit("lineEnding"),n=!0,r):N(i)?F(e,r,n?"linePrefix":"lineSuffix")(i):t(i)}}function ue(e){return e.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}var Ar={name:"definition",tokenize:lu},ou={tokenize:au,partial:!0};function lu(e,t,n){let r=this,i;return o;function o(a){return e.enter("definition"),xn.call(r,e,l,n,"definitionLabel","definitionLabelMarker","definitionLabelString")(a)}function l(a){return i=ue(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),a===58?(e.enter("definitionMarker"),e.consume(a),e.exit("definitionMarker"),et(e,gn(e,e.attempt(ou,F(e,s,"whitespace"),F(e,s,"whitespace")),n,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString"))):n(a)}function s(a){return a===null||E(a)?(e.exit("definition"),r.parser.defined.includes(i)||r.parser.defined.push(i),t(a)):n(a)}}function au(e,t,n){return r;function r(l){return B(l)?et(e,i)(l):n(l)}function i(l){return l===34||l===39||l===40?yn(e,F(e,o,"whitespace"),n,"definitionTitle","definitionTitleMarker","definitionTitleString")(l):n(l)}function o(l){return l===null||E(l)?t(l):n(l)}}var Cr={name:"hardBreakEscape",tokenize:su};function su(e,t,n){return r;function r(o){return e.enter("hardBreakEscape"),e.enter("escapeMarker"),e.consume(o),i}function i(o){return E(o)?(e.exit("escapeMarker"),e.exit("hardBreakEscape"),t(o)):n(o)}}var vr={name:"headingAtx",tokenize:cu,resolve:uu};function uu(e,t){let n=e.length-2,r=3,i,o;return e[r][1].type==="whitespace"&&(r+=2),n-2>r&&e[n][1].type==="whitespace"&&(n-=2),e[n][1].type==="atxHeadingSequence"&&(r===n-1||n-4>r&&e[n-2][1].type==="whitespace")&&(n-=r+1===n?2:4),n>r&&(i={type:"atxHeadingText",start:e[r][1].start,end:e[n][1].end},o={type:"chunkText",start:e[r][1].start,end:e[n][1].end,contentType:"text"},X(e,r,n-r+1,[["enter",i,t],["enter",o,t],["exit",o,t],["exit",i,t]])),e}function cu(e,t,n){let r=this,i=0;return o;function o(u){return e.enter("atxHeading"),e.enter("atxHeadingSequence"),l(u)}function l(u){return u===35&&i++<6?(e.consume(u),l):u===null||B(u)?(e.exit("atxHeadingSequence"),r.interrupt?t(u):s(u)):n(u)}function s(u){return u===35?(e.enter("atxHeadingSequence"),a(u)):u===null||E(u)?(e.exit("atxHeading"),t(u)):N(u)?F(e,s,"whitespace")(u):(e.enter("atxHeadingText"),c(u))}function a(u){return u===35?(e.consume(u),a):(e.exit("atxHeadingSequence"),s(u))}function c(u){return u===null||u===35||B(u)?(e.exit("atxHeadingText"),s(u)):(e.consume(u),c)}}var qo=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],Er=["pre","script","style","textarea"];var _r={name:"htmlFlow",tokenize:mu,resolveTo:hu,concrete:!0},pu={tokenize:fu,partial:!0};function hu(e){let t=e.length;for(;t--&&!(e[t][0]==="enter"&&e[t][1].type==="htmlFlow"););return t>1&&e[t-2][1].type==="linePrefix"&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function mu(e,t,n){let r=this,i,o,l,s,a;return c;function c(g){return e.enter("htmlFlow"),e.enter("htmlFlowData"),e.consume(g),u}function u(g){return g===33?(e.consume(g),p):g===47?(e.consume(g),h):g===63?(e.consume(g),i=3,r.interrupt?t:re):se(g)?(e.consume(g),l=String.fromCharCode(g),o=!0,b):n(g)}function p(g){return g===45?(e.consume(g),i=2,m):g===91?(e.consume(g),i=5,l="CDATA[",s=0,f):se(g)?(e.consume(g),i=4,r.interrupt?t:re):n(g)}function m(g){return g===45?(e.consume(g),r.interrupt?t:re):n(g)}function f(g){return g===l.charCodeAt(s++)?(e.consume(g),s===l.length?r.interrupt?t:I:f):n(g)}function h(g){return se(g)?(e.consume(g),l=String.fromCharCode(g),b):n(g)}function b(g){return g===null||g===47||g===62||B(g)?g!==47&&o&&Er.includes(l.toLowerCase())?(i=1,r.interrupt?t(g):I(g)):qo.includes(l.toLowerCase())?(i=6,g===47?(e.consume(g),S):r.interrupt?t(g):I(g)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(g):o?_(g):x(g)):g===45||J(g)?(e.consume(g),l+=String.fromCharCode(g),b):n(g)}function S(g){return g===62?(e.consume(g),r.interrupt?t:I):n(g)}function x(g){return N(g)?(e.consume(g),x):R(g)}function _(g){return g===47?(e.consume(g),R):g===58||g===95||se(g)?(e.consume(g),C):N(g)?(e.consume(g),_):R(g)}function C(g){return g===45||g===46||g===58||g===95||J(g)?(e.consume(g),C):P(g)}function P(g){return g===61?(e.consume(g),D):N(g)?(e.consume(g),P):_(g)}function D(g){return g===null||g===60||g===61||g===62||g===96?n(g):g===34||g===39?(e.consume(g),a=g,k):N(g)?(e.consume(g),D):(a=null,L(g))}function k(g){return g===null||E(g)?n(g):g===a?(e.consume(g),$):(e.consume(g),k)}function L(g){return g===null||g===34||g===39||g===60||g===61||g===62||g===96||B(g)?P(g):(e.consume(g),L)}function $(g){return g===47||g===62||N(g)?_(g):n(g)}function R(g){return g===62?(e.consume(g),ee):n(g)}function ee(g){return N(g)?(e.consume(g),ee):g===null||E(g)?I(g):n(g)}function I(g){return g===45&&i===2?(e.consume(g),G):g===60&&i===1?(e.consume(g),y):g===62&&i===4?(e.consume(g),K):g===63&&i===3?(e.consume(g),re):g===93&&i===5?(e.consume(g),V):E(g)&&(i===6||i===7)?e.check(pu,K,H)(g):g===null||E(g)?H(g):(e.consume(g),I)}function H(g){return e.exit("htmlFlowData"),T(g)}function T(g){return g===null?d(g):E(g)?e.attempt({tokenize:M,partial:!0},T,d)(g):(e.enter("htmlFlowData"),I(g))}function M(g,Ce,je){return at;function at(be){return g.enter("lineEnding"),g.consume(be),g.exit("lineEnding"),St}function St(be){return r.parser.lazy[r.now().line]?je(be):Ce(be)}}function G(g){return g===45?(e.consume(g),re):I(g)}function y(g){return g===47?(e.consume(g),l="",le):I(g)}function le(g){return g===62&&Er.includes(l.toLowerCase())?(e.consume(g),K):se(g)&&l.length<8?(e.consume(g),l+=String.fromCharCode(g),le):I(g)}function V(g){return g===93?(e.consume(g),re):I(g)}function re(g){return g===62?(e.consume(g),K):g===45&&i===2?(e.consume(g),re):I(g)}function K(g){return g===null||E(g)?(e.exit("htmlFlowData"),d(g)):(e.consume(g),K)}function d(g){return e.exit("htmlFlow"),t(g)}}function fu(e,t,n){return r;function r(i){return e.exit("htmlFlowData"),e.enter("lineEndingBlank"),e.consume(i),e.exit("lineEndingBlank"),e.attempt(ke,t,n)}}var Tr={name:"htmlText",tokenize:du};function du(e,t,n){let r=this,i,o,l,s;return a;function a(d){return e.enter("htmlText"),e.enter("htmlTextData"),e.consume(d),c}function c(d){return d===33?(e.consume(d),u):d===47?(e.consume(d),L):d===63?(e.consume(d),D):se(d)?(e.consume(d),ee):n(d)}function u(d){return d===45?(e.consume(d),p):d===91?(e.consume(d),o="CDATA[",l=0,S):se(d)?(e.consume(d),P):n(d)}function p(d){return d===45?(e.consume(d),m):n(d)}function m(d){return d===null||d===62?n(d):d===45?(e.consume(d),f):h(d)}function f(d){return d===null||d===62?n(d):h(d)}function h(d){return d===null?n(d):d===45?(e.consume(d),b):E(d)?(s=h,V(d)):(e.consume(d),h)}function b(d){return d===45?(e.consume(d),K):h(d)}function S(d){return d===o.charCodeAt(l++)?(e.consume(d),l===o.length?x:S):n(d)}function x(d){return d===null?n(d):d===93?(e.consume(d),_):E(d)?(s=x,V(d)):(e.consume(d),x)}function _(d){return d===93?(e.consume(d),C):x(d)}function C(d){return d===62?K(d):d===93?(e.consume(d),C):x(d)}function P(d){return d===null||d===62?K(d):E(d)?(s=P,V(d)):(e.consume(d),P)}function D(d){return d===null?n(d):d===63?(e.consume(d),k):E(d)?(s=D,V(d)):(e.consume(d),D)}function k(d){return d===62?K(d):D(d)}function L(d){return se(d)?(e.consume(d),$):n(d)}function $(d){return d===45||J(d)?(e.consume(d),$):R(d)}function R(d){return E(d)?(s=R,V(d)):N(d)?(e.consume(d),R):K(d)}function ee(d){return d===45||J(d)?(e.consume(d),ee):d===47||d===62||B(d)?I(d):n(d)}function I(d){return d===47?(e.consume(d),K):d===58||d===95||se(d)?(e.consume(d),H):E(d)?(s=I,V(d)):N(d)?(e.consume(d),I):K(d)}function H(d){return d===45||d===46||d===58||d===95||J(d)?(e.consume(d),H):T(d)}function T(d){return d===61?(e.consume(d),M):E(d)?(s=T,V(d)):N(d)?(e.consume(d),T):I(d)}function M(d){return d===null||d===60||d===61||d===62||d===96?n(d):d===34||d===39?(e.consume(d),i=d,G):E(d)?(s=M,V(d)):N(d)?(e.consume(d),M):(e.consume(d),i=void 0,le)}function G(d){return d===i?(e.consume(d),y):d===null?n(d):E(d)?(s=G,V(d)):(e.consume(d),G)}function y(d){return d===62||d===47||B(d)?I(d):n(d)}function le(d){return d===null||d===34||d===39||d===60||d===61||d===96?n(d):d===62||B(d)?I(d):(e.consume(d),le)}function V(d){return e.exit("htmlTextData"),e.enter("lineEnding"),e.consume(d),e.exit("lineEnding"),F(e,re,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function re(d){return e.enter("htmlTextData"),s(d)}function K(d){return d===62?(e.consume(d),e.exit("htmlTextData"),e.exit("htmlText"),t):n(d)}}var tt={name:"labelEnd",tokenize:ku,resolveTo:wu,resolveAll:bu},gu={tokenize:Su},xu={tokenize:Au},yu={tokenize:Cu};function bu(e){let t=-1,n;for(;++t<e.length;)n=e[t][1],(n.type==="labelImage"||n.type==="labelLink"||n.type==="labelEnd")&&(e.splice(t+1,n.type==="labelImage"?4:2),n.type="data",t++);return e}function wu(e,t){let n=e.length,r=0,i,o,l,s;for(;n--;)if(i=e[n][1],o){if(i.type==="link"||i.type==="labelLink"&&i._inactive)break;e[n][0]==="enter"&&i.type==="labelLink"&&(i._inactive=!0)}else if(l){if(e[n][0]==="enter"&&(i.type==="labelImage"||i.type==="labelLink")&&!i._balanced&&(o=n,i.type!=="labelLink")){r=2;break}}else i.type==="labelEnd"&&(l=n);let a={type:e[o][1].type==="labelLink"?"link":"image",start:Object.assign({},e[o][1].start),end:Object.assign({},e[e.length-1][1].end)},c={type:"label",start:Object.assign({},e[o][1].start),end:Object.assign({},e[l][1].end)},u={type:"labelText",start:Object.assign({},e[o+r+2][1].end),end:Object.assign({},e[l-2][1].start)};return s=[["enter",a,t],["enter",c,t]],s=he(s,e.slice(o+1,o+r+3)),s=he(s,[["enter",u,t]]),s=he(s,Be(t.parser.constructs.insideSpan.null,e.slice(o+r+4,l-3),t)),s=he(s,[["exit",u,t],e[l-2],e[l-1],["exit",c,t]]),s=he(s,e.slice(l+1)),s=he(s,[["exit",a,t]]),X(e,o,e.length,s),e}function ku(e,t,n){let r=this,i=r.events.length,o,l;for(;i--;)if((r.events[i][1].type==="labelImage"||r.events[i][1].type==="labelLink")&&!r.events[i][1]._balanced){o=r.events[i][1];break}return s;function s(u){return o?o._inactive?c(u):(l=r.parser.defined.includes(ue(r.sliceSerialize({start:o.end,end:r.now()}))),e.enter("labelEnd"),e.enter("labelMarker"),e.consume(u),e.exit("labelMarker"),e.exit("labelEnd"),a):n(u)}function a(u){return u===40?e.attempt(gu,t,l?t:c)(u):u===91?e.attempt(xu,t,l?e.attempt(yu,t,c):c)(u):l?t(u):c(u)}function c(u){return o._balanced=!0,n(u)}}function Su(e,t,n){return r;function r(a){return e.enter("resource"),e.enter("resourceMarker"),e.consume(a),e.exit("resourceMarker"),et(e,i)}function i(a){return a===41?s(a):gn(e,o,n,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(a)}function o(a){return B(a)?et(e,l)(a):s(a)}function l(a){return a===34||a===39||a===40?yn(e,et(e,s),n,"resourceTitle","resourceTitleMarker","resourceTitleString")(a):s(a)}function s(a){return a===41?(e.enter("resourceMarker"),e.consume(a),e.exit("resourceMarker"),e.exit("resource"),t):n(a)}}function Au(e,t,n){let r=this;return i;function i(l){return xn.call(r,e,o,n,"reference","referenceMarker","referenceString")(l)}function o(l){return r.parser.defined.includes(ue(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(l):n(l)}}function Cu(e,t,n){return r;function r(o){return e.enter("reference"),e.enter("referenceMarker"),e.consume(o),e.exit("referenceMarker"),i}function i(o){return o===93?(e.enter("referenceMarker"),e.consume(o),e.exit("referenceMarker"),e.exit("reference"),t):n(o)}}var Lr={name:"labelStartImage",tokenize:vu,resolveAll:tt.resolveAll};function vu(e,t,n){let r=this;return i;function i(s){return e.enter("labelImage"),e.enter("labelImageMarker"),e.consume(s),e.exit("labelImageMarker"),o}function o(s){return s===91?(e.enter("labelMarker"),e.consume(s),e.exit("labelMarker"),e.exit("labelImage"),l):n(s)}function l(s){return s===94&&"_hiddenFootnoteSupport"in r.parser.constructs?n(s):t(s)}}var Pr={name:"labelStartLink",tokenize:Eu,resolveAll:tt.resolveAll};function Eu(e,t,n){let r=this;return i;function i(l){return e.enter("labelLink"),e.enter("labelMarker"),e.consume(l),e.exit("labelMarker"),e.exit("labelLink"),o}function o(l){return l===94&&"_hiddenFootnoteSupport"in r.parser.constructs?n(l):t(l)}}var Rt={name:"lineEnding",tokenize:_u};function _u(e,t){return n;function n(r){return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),F(e,t,"linePrefix")}}var nt={name:"thematicBreak",tokenize:Tu};function Tu(e,t,n){let r=0,i;return o;function o(a){return e.enter("thematicBreak"),i=a,l(a)}function l(a){return a===i?(e.enter("thematicBreakSequence"),s(a)):N(a)?F(e,l,"whitespace")(a):r<3||a!==null&&!E(a)?n(a):(e.exit("thematicBreak"),t(a))}function s(a){return a===i?(e.consume(a),r++,s):(e.exit("thematicBreakSequence"),l(a))}}var ce={name:"list",tokenize:Fu,continuation:{tokenize:Du},exit:Iu},Lu={tokenize:zu,partial:!0},Pu={tokenize:Ou,partial:!0};function Fu(e,t,n){let r=this,i=r.events[r.events.length-1],o=i&&i[1].type==="linePrefix"?i[2].sliceSerialize(i[1],!0).length:0,l=0;return s;function s(f){let h=r.containerState.type||(f===42||f===43||f===45?"listUnordered":"listOrdered");if(h==="listUnordered"?!r.containerState.marker||f===r.containerState.marker:Ze(f)){if(r.containerState.type||(r.containerState.type=h,e.enter(h,{_container:!0})),h==="listUnordered")return e.enter("listItemPrefix"),f===42||f===45?e.check(nt,n,c)(f):c(f);if(!r.interrupt||f===49)return e.enter("listItemPrefix"),e.enter("listItemValue"),a(f)}return n(f)}function a(f){return Ze(f)&&++l<10?(e.consume(f),a):(!r.interrupt||l<2)&&(r.containerState.marker?f===r.containerState.marker:f===41||f===46)?(e.exit("listItemValue"),c(f)):n(f)}function c(f){return e.enter("listItemMarker"),e.consume(f),e.exit("listItemMarker"),r.containerState.marker=r.containerState.marker||f,e.check(ke,r.interrupt?n:u,e.attempt(Lu,m,p))}function u(f){return r.containerState.initialBlankLine=!0,o++,m(f)}function p(f){return N(f)?(e.enter("listItemPrefixWhitespace"),e.consume(f),e.exit("listItemPrefixWhitespace"),m):n(f)}function m(f){return r.containerState.size=o+r.sliceSerialize(e.exit("listItemPrefix"),!0).length,t(f)}}function Du(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(ke,i,o);function i(s){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,F(e,t,"listItemIndent",r.containerState.size+1)(s)}function o(s){return r.containerState.furtherBlankLines||!N(s)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,l(s)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Pu,t,l)(s))}function l(s){return r.containerState._closeFlow=!0,r.interrupt=void 0,F(e,e.attempt(ce,t,n),"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(s)}}function Ou(e,t,n){let r=this;return F(e,i,"listItemIndent",r.containerState.size+1);function i(o){let l=r.events[r.events.length-1];return l&&l[1].type==="listItemIndent"&&l[2].sliceSerialize(l[1],!0).length===r.containerState.size?t(o):n(o)}}function Iu(e){e.exit(this.containerState.type)}function zu(e,t,n){let r=this;return F(e,i,"listItemPrefixWhitespace",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4+1);function i(o){let l=r.events[r.events.length-1];return!N(o)&&l&&l[1].type==="listItemPrefixWhitespace"?t(o):n(o)}}var bn={name:"setextUnderline",tokenize:Nu,resolveTo:$u};function $u(e,t){let n=e.length,r,i,o;for(;n--;)if(e[n][0]==="enter"){if(e[n][1].type==="content"){r=n;break}e[n][1].type==="paragraph"&&(i=n)}else e[n][1].type==="content"&&e.splice(n,1),!o&&e[n][1].type==="definition"&&(o=n);let l={type:"setextHeading",start:Object.assign({},e[i][1].start),end:Object.assign({},e[e.length-1][1].end)};return e[i][1].type="setextHeadingText",o?(e.splice(i,0,["enter",l,t]),e.splice(o+1,0,["exit",e[r][1],t]),e[r][1].end=Object.assign({},e[o][1].end)):e[r][1]=l,e.push(["exit",l,t]),e}function Nu(e,t,n){let r=this,i=r.events.length,o,l;for(;i--;)if(r.events[i][1].type!=="lineEnding"&&r.events[i][1].type!=="linePrefix"&&r.events[i][1].type!=="content"){l=r.events[i][1].type==="paragraph";break}return s;function s(u){return!r.parser.lazy[r.now().line]&&(r.interrupt||l)?(e.enter("setextHeadingLine"),e.enter("setextHeadingLineSequence"),o=u,a(u)):n(u)}function a(u){return u===o?(e.consume(u),a):(e.exit("setextHeadingLineSequence"),F(e,c,"lineSuffix")(u))}function c(u){return u===null||E(u)?(e.exit("setextHeadingLine"),t(u)):n(u)}}var Vo={tokenize:Ru};function Ru(e){let t=this,n=e.attempt(ke,r,e.attempt(this.parser.constructs.flowInitial,i,F(e,e.attempt(this.parser.constructs.flow,i,e.attempt(Sr,i)),"linePrefix")));return n;function r(o){if(o===null){e.consume(o);return}return e.enter("lineEndingBlank"),e.consume(o),e.exit("lineEndingBlank"),t.currentConstruct=void 0,n}function i(o){if(o===null){e.consume(o);return}return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),t.currentConstruct=void 0,n}}var Wo={resolveAll:Go()},Ko=Yo("string"),Qo=Yo("text");function Yo(e){return{tokenize:t,resolveAll:Go(e==="text"?Mu:void 0)};function t(n){let r=this,i=this.parser.constructs[e],o=n.attempt(i,l,s);return l;function l(u){return c(u)?o(u):s(u)}function s(u){if(u===null){n.consume(u);return}return n.enter("data"),n.consume(u),a}function a(u){return c(u)?(n.exit("data"),o(u)):(n.consume(u),a)}function c(u){if(u===null)return!0;let p=i[u],m=-1;if(p)for(;++m<p.length;){let f=p[m];if(!f.previous||f.previous.call(r,r.previous))return!0}return!1}}}function Go(e){return t;function t(n,r){let i=-1,o;for(;++i<=n.length;)o===void 0?n[i]&&n[i][1].type==="data"&&(o=i,i++):(!n[i]||n[i][1].type!=="data")&&(i!==o+2&&(n[o][1].end=n[i-1][1].end,n.splice(o+2,i-o-2),i=o+2),o=void 0);return e?e(n,r):n}}function Mu(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type==="lineEnding")&&e[n-1][1].type==="data"){let r=e[n-1][1],i=t.sliceStream(r),o=i.length,l=-1,s=0,a;for(;o--;){let c=i[o];if(typeof c=="string"){for(l=c.length;c.charCodeAt(l-1)===32;)s++,l--;if(l)break;l=-1}else if(c===-2)a=!0,s++;else if(c!==-1){o++;break}}if(s){let c={type:n===e.length||a||s<2?"lineSuffix":"hardBreakTrailing",start:{line:r.end.line,column:r.end.column-s,offset:r.end.offset-s,_index:r.start._index+o,_bufferIndex:o?l:r.start._bufferIndex+l},end:Object.assign({},r.end)};r.end=Object.assign({},c.start),r.start.offset===r.end.offset?Object.assign(r,c):(e.splice(n,0,["enter",c,t],["exit",c,t]),n+=2)}n++}return e}function Zo(e,t,n){let r=Object.assign(n?Object.assign({},n):{line:1,column:1,offset:0},{_index:0,_bufferIndex:-1}),i={},o=[],l=[],s=[],a=!0,c={consume:P,enter:D,exit:k,attempt:R(L),check:R($),interrupt:R($,{interrupt:!0})},u={previous:null,code:null,containerState:{},events:[],parser:e,sliceStream:b,sliceSerialize:h,now:S,defineSkip:x,write:f},p=t.tokenize.call(u,c),m;return t.resolveAll&&o.push(t),u;function f(T){return l=he(l,T),_(),l[l.length-1]!==null?[]:(ee(t,0),u.events=Be(o,u.events,u),u.events)}function h(T,M){return Hu(b(T),M)}function b(T){return Bu(l,T)}function S(){return Object.assign({},r)}function x(T){i[T.line]=T.column,H()}function _(){let T;for(;r._index<l.length;){let M=l[r._index];if(typeof M=="string")for(T=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===T&&r._bufferIndex<M.length;)C(M.charCodeAt(r._bufferIndex));else C(M)}}function C(T){a=void 0,m=T,p=p(T)}function P(T){E(T)?(r.line++,r.column=1,r.offset+=T===-3?2:1,H()):T!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===l[r._index].length&&(r._bufferIndex=-1,r._index++)),u.previous=T,a=!0}function D(T,M){let G=M||{};return G.type=T,G.start=S(),u.events.push(["enter",G,u]),s.push(G),G}function k(T){let M=s.pop();return M.end=S(),u.events.push(["exit",M,u]),M}function L(T,M){ee(T,M.from)}function $(T,M){M.restore()}function R(T,M){return G;function G(y,le,V){let re,K,d,g;return Array.isArray(y)?je(y):"tokenize"in y?je([y]):Ce(y);function Ce(ie){return At;function At(ve){let st=ve!==null&&ie[ve],qe=ve!==null&&ie.null,qn=[...Array.isArray(st)?st:st?[st]:[],...Array.isArray(qe)?qe:qe?[qe]:[]];return je(qn)(ve)}}function je(ie){return re=ie,K=0,ie.length===0?V:at(ie[K])}function at(ie){return At;function At(ve){return g=I(),d=ie,ie.partial||(u.currentConstruct=ie),ie.name&&u.parser.constructs.disable.null.includes(ie.name)?be(ve):ie.tokenize.call(M?Object.assign(Object.create(u),M):u,c,St,be)(ve)}}function St(ie){return a=!0,T(d,g),le}function be(ie){return a=!0,g.restore(),++K<re.length?at(re[K]):V}}}function ee(T,M){T.resolveAll&&!o.includes(T)&&o.push(T),T.resolve&&X(u.events,M,u.events.length-M,T.resolve(u.events.slice(M),u)),T.resolveTo&&(u.events=T.resolveTo(u.events,u))}function I(){let T=S(),M=u.previous,G=u.currentConstruct,y=u.events.length,le=Array.from(s);return{restore:V,from:y};function V(){r=T,u.previous=M,u.currentConstruct=G,u.events.length=y,s=le,H()}}function H(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function Bu(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,o=t.end._bufferIndex,l;return n===i?l=[e[n].slice(r,o)]:(l=e.slice(n,i),r>-1&&(l[0]=l[0].slice(r)),o>0&&l.push(e[i].slice(0,o))),l}function Hu(e,t){let n=-1,r=[],i;for(;++n<e.length;){let o=e[n],l;if(typeof o=="string")l=o;else switch(o){case-5:{l="\r";break}case-4:{l=`
`;break}case-3:{l=`\r
`;break}case-2:{l=t?" ":"	";break}case-1:{if(!t&&i)continue;l=" ";break}default:l=String.fromCharCode(o)}i=o===-2,r.push(l)}return r.join("")}var Fr={};Bi(Fr,{attentionMarkers:()=>Yu,contentInitial:()=>ju,disable:()=>Gu,document:()=>Uu,flow:()=>Vu,flowInitial:()=>qu,insideSpan:()=>Qu,string:()=>Wu,text:()=>Ku});var Uu={[42]:ce,[43]:ce,[45]:ce,[48]:ce,[49]:ce,[50]:ce,[51]:ce,[52]:ce,[53]:ce,[54]:ce,[55]:ce,[56]:ce,[57]:ce,[62]:pn},ju={[91]:Ar},qu={[-2]:Nt,[-1]:Nt,[32]:Nt},Vu={[35]:vr,[42]:nt,[45]:[bn,nt],[60]:_r,[61]:bn,[95]:nt,[96]:fn,[126]:fn},Wu={[38]:mn,[92]:hn},Ku={[-5]:Rt,[-4]:Rt,[-3]:Rt,[33]:Lr,[38]:mn,[42]:$t,[60]:[wr,Tr],[91]:Pr,[92]:[Cr,hn],[93]:tt,[95]:$t,[96]:kr},Qu={null:[$t,Wo]},Yu={null:[42,95]},Gu={null:[]};function Xo(e={}){let t=cn([Fr].concat(e.extensions||[])),n={defined:[],lazy:{},constructs:t,content:r(Mo),document:r(Ho),flow:r(Vo),string:r(Ko),text:r(Qo)};return n;function r(i){return o;function o(l){return Zo(n,i,l)}}}var Jo=/[\0\t\n\r]/g;function el(){let e=1,t="",n=!0,r;return i;function i(o,l,s){let a=[],c,u,p,m,f;for(o=t+o.toString(l),p=0,t="",n&&(o.charCodeAt(0)===65279&&p++,n=void 0);p<o.length;){if(Jo.lastIndex=p,c=Jo.exec(o),m=c&&c.index!==void 0?c.index:o.length,f=o.charCodeAt(m),!c){t=o.slice(p);break}if(f===10&&p===m&&r)a.push(-3),r=void 0;else switch(r&&(a.push(-5),r=void 0),p<m&&(a.push(o.slice(p,m)),e+=m-p),f){case 0:{a.push(65533),e++;break}case 9:{for(u=Math.ceil(e/4)*4,a.push(-2);e++<u;)a.push(-1);break}case 10:{a.push(-4),e=1;break}default:r=!0,e=1}p=m+1}return s&&(r&&a.push(-5),t&&a.push(t),a.push(null)),a}}function tl(e){for(;!dn(e););return e}function wn(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)===65535||(n&65535)===65534||n>1114111?"\uFFFD":String.fromCharCode(n)}var Zu=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function kn(e){return e.replace(Zu,Xu)}function Xu(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let i=n.charCodeAt(1),o=i===120||i===88;return wn(n.slice(o?2:1),o?16:10)}return ft(n)||e}var rl={}.hasOwnProperty,Dr=function(e,t,n){return typeof t!="string"&&(n=t,t=void 0),Ju(n)(tl(Xo(n).document().write(el()(e,t,!0))))};function Ju(e){let t={transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:s($i),autolinkProtocol:I,autolinkEmail:I,atxHeading:s(Oi),blockQuote:s(st),characterEscape:I,characterReference:I,codeFenced:s(qe),codeFencedFenceInfo:a,codeFencedFenceMeta:a,codeIndented:s(qe,a),codeText:s(qn,a),codeTextData:I,data:I,codeFlowValue:I,definition:s(es),definitionDestinationString:a,definitionLabelString:a,definitionTitleString:a,emphasis:s(ts),hardBreakEscape:s(Ii),hardBreakTrailing:s(Ii),htmlFlow:s(zi,a),htmlFlowData:I,htmlText:s(zi,a),htmlTextData:I,image:s(ns),label:a,link:s($i),listItem:s(rs),listItemValue:h,listOrdered:s(Ni,f),listUnordered:s(Ni),paragraph:s(is),reference:at,referenceString:a,resourceDestinationString:a,resourceTitleString:a,setextHeading:s(Oi),strong:s(os),thematicBreak:s(as)},exit:{atxHeading:u(),atxHeadingSequence:L,autolink:u(),autolinkEmail:ve,autolinkProtocol:At,blockQuote:u(),characterEscapeValue:H,characterReferenceMarkerHexadecimal:be,characterReferenceMarkerNumeric:be,characterReferenceValue:ie,codeFenced:u(_),codeFencedFence:x,codeFencedFenceInfo:b,codeFencedFenceMeta:S,codeFlowValue:H,codeIndented:u(C),codeText:u(le),codeTextData:H,data:H,definition:u(),definitionDestinationString:k,definitionLabelString:P,definitionTitleString:D,emphasis:u(),hardBreakEscape:u(M),hardBreakTrailing:u(M),htmlFlow:u(G),htmlFlowData:H,htmlText:u(y),htmlTextData:H,image:u(re),label:d,labelText:K,lineEnding:T,link:u(V),listItem:u(),listOrdered:u(),listUnordered:u(),paragraph:u(),referenceString:St,resourceDestinationString:g,resourceTitleString:Ce,resource:je,setextHeading:u(ee),setextHeadingLineSequence:R,setextHeadingText:$,strong:u(),thematicBreak:u()}};il(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(w){let v={type:"root",children:[]},O={stack:[v],tokenStack:[],config:t,enter:c,exit:p,buffer:a,resume:m,setData:o,getData:l},U=[],q=-1;for(;++q<w.length;)if(w[q][1].type==="listOrdered"||w[q][1].type==="listUnordered")if(w[q][0]==="enter")U.push(q);else{let xe=U.pop();q=i(w,xe,q)}for(q=-1;++q<w.length;){let xe=t[w[q][0]];rl.call(xe,w[q][1].type)&&xe[w[q][1].type].call(Object.assign({sliceSerialize:w[q][2].sliceSerialize},O),w[q][1])}if(O.tokenStack.length>0){let xe=O.tokenStack[O.tokenStack.length-1];(xe[1]||nl).call(O,void 0,xe[0])}for(v.position={start:He(w.length>0?w[0][1].start:{line:1,column:1,offset:0}),end:He(w.length>0?w[w.length-2][1].end:{line:1,column:1,offset:0})},q=-1;++q<t.transforms.length;)v=t.transforms[q](v)||v;return v}function i(w,v,O){let U=v-1,q=-1,xe=!1,ze,Ee,Ct,vt;for(;++U<=O;){let Z=w[U];if(Z[1].type==="listUnordered"||Z[1].type==="listOrdered"||Z[1].type==="blockQuote"?(Z[0]==="enter"?q++:q--,vt=void 0):Z[1].type==="lineEndingBlank"?Z[0]==="enter"&&(ze&&!vt&&!q&&!Ct&&(Ct=U),vt=void 0):Z[1].type==="linePrefix"||Z[1].type==="listItemValue"||Z[1].type==="listItemMarker"||Z[1].type==="listItemPrefix"||Z[1].type==="listItemPrefixWhitespace"||(vt=void 0),!q&&Z[0]==="enter"&&Z[1].type==="listItemPrefix"||q===-1&&Z[0]==="exit"&&(Z[1].type==="listUnordered"||Z[1].type==="listOrdered")){if(ze){let Vn=U;for(Ee=void 0;Vn--;){let _e=w[Vn];if(_e[1].type==="lineEnding"||_e[1].type==="lineEndingBlank"){if(_e[0]==="exit")continue;Ee&&(w[Ee][1].type="lineEndingBlank",xe=!0),_e[1].type="lineEnding",Ee=Vn}else if(!(_e[1].type==="linePrefix"||_e[1].type==="blockQuotePrefix"||_e[1].type==="blockQuotePrefixWhitespace"||_e[1].type==="blockQuoteMarker"||_e[1].type==="listItemIndent"))break}Ct&&(!Ee||Ct<Ee)&&(ze._spread=!0),ze.end=Object.assign({},Ee?w[Ee][1].start:Z[1].end),w.splice(Ee||U,0,["exit",ze,Z[2]]),U++,O++}Z[1].type==="listItemPrefix"&&(ze={type:"listItem",_spread:!1,start:Object.assign({},Z[1].start)},w.splice(U,0,["enter",ze,Z[2]]),U++,O++,Ct=void 0,vt=!0)}}return w[v][1]._spread=xe,O}function o(w,v){n[w]=v}function l(w){return n[w]}function s(w,v){return O;function O(U){c.call(this,w(U),U),v&&v.call(this,U)}}function a(){this.stack.push({type:"fragment",children:[]})}function c(w,v,O){return this.stack[this.stack.length-1].children.push(w),this.stack.push(w),this.tokenStack.push([v,O]),w.position={start:He(v.start)},w}function u(w){return v;function v(O){w&&w.call(this,O),p.call(this,O)}}function p(w,v){let O=this.stack.pop(),U=this.tokenStack.pop();if(U)U[0].type!==w.type&&(v?v.call(this,w,U[0]):(U[1]||nl).call(this,w,U[0]));else throw new Error("Cannot close `"+w.type+"` ("+Ne({start:w.start,end:w.end})+"): it\u2019s not open");return O.position.end=He(w.end),O}function m(){return yr(this.stack.pop())}function f(){o("expectingFirstListItemValue",!0)}function h(w){if(l("expectingFirstListItemValue")){let v=this.stack[this.stack.length-2];v.start=Number.parseInt(this.sliceSerialize(w),10),o("expectingFirstListItemValue")}}function b(){let w=this.resume(),v=this.stack[this.stack.length-1];v.lang=w}function S(){let w=this.resume(),v=this.stack[this.stack.length-1];v.meta=w}function x(){l("flowCodeInside")||(this.buffer(),o("flowCodeInside",!0))}function _(){let w=this.resume(),v=this.stack[this.stack.length-1];v.value=w.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),o("flowCodeInside")}function C(){let w=this.resume(),v=this.stack[this.stack.length-1];v.value=w.replace(/(\r?\n|\r)$/g,"")}function P(w){let v=this.resume(),O=this.stack[this.stack.length-1];O.label=v,O.identifier=ue(this.sliceSerialize(w)).toLowerCase()}function D(){let w=this.resume(),v=this.stack[this.stack.length-1];v.title=w}function k(){let w=this.resume(),v=this.stack[this.stack.length-1];v.url=w}function L(w){let v=this.stack[this.stack.length-1];if(!v.depth){let O=this.sliceSerialize(w).length;v.depth=O}}function $(){o("setextHeadingSlurpLineEnding",!0)}function R(w){let v=this.stack[this.stack.length-1];v.depth=this.sliceSerialize(w).charCodeAt(0)===61?1:2}function ee(){o("setextHeadingSlurpLineEnding")}function I(w){let v=this.stack[this.stack.length-1],O=v.children[v.children.length-1];(!O||O.type!=="text")&&(O=ls(),O.position={start:He(w.start)},v.children.push(O)),this.stack.push(O)}function H(w){let v=this.stack.pop();v.value+=this.sliceSerialize(w),v.position.end=He(w.end)}function T(w){let v=this.stack[this.stack.length-1];if(l("atHardBreak")){let O=v.children[v.children.length-1];O.position.end=He(w.end),o("atHardBreak");return}!l("setextHeadingSlurpLineEnding")&&t.canContainEols.includes(v.type)&&(I.call(this,w),H.call(this,w))}function M(){o("atHardBreak",!0)}function G(){let w=this.resume(),v=this.stack[this.stack.length-1];v.value=w}function y(){let w=this.resume(),v=this.stack[this.stack.length-1];v.value=w}function le(){let w=this.resume(),v=this.stack[this.stack.length-1];v.value=w}function V(){let w=this.stack[this.stack.length-1];if(l("inReference")){let v=l("referenceType")||"shortcut";w.type+="Reference",w.referenceType=v,delete w.url,delete w.title}else delete w.identifier,delete w.label;o("referenceType")}function re(){let w=this.stack[this.stack.length-1];if(l("inReference")){let v=l("referenceType")||"shortcut";w.type+="Reference",w.referenceType=v,delete w.url,delete w.title}else delete w.identifier,delete w.label;o("referenceType")}function K(w){let v=this.sliceSerialize(w),O=this.stack[this.stack.length-2];O.label=kn(v),O.identifier=ue(v).toLowerCase()}function d(){let w=this.stack[this.stack.length-1],v=this.resume(),O=this.stack[this.stack.length-1];if(o("inReference",!0),O.type==="link"){let U=w.children;O.children=U}else O.alt=v}function g(){let w=this.resume(),v=this.stack[this.stack.length-1];v.url=w}function Ce(){let w=this.resume(),v=this.stack[this.stack.length-1];v.title=w}function je(){o("inReference")}function at(){o("referenceType","collapsed")}function St(w){let v=this.resume(),O=this.stack[this.stack.length-1];O.label=v,O.identifier=ue(this.sliceSerialize(w)).toLowerCase(),o("referenceType","full")}function be(w){o("characterReferenceType",w.type)}function ie(w){let v=this.sliceSerialize(w),O=l("characterReferenceType"),U;O?(U=wn(v,O==="characterReferenceMarkerNumeric"?10:16),o("characterReferenceType")):U=ft(v);let q=this.stack.pop();q.value+=U,q.position.end=He(w.end)}function At(w){H.call(this,w);let v=this.stack[this.stack.length-1];v.url=this.sliceSerialize(w)}function ve(w){H.call(this,w);let v=this.stack[this.stack.length-1];v.url="mailto:"+this.sliceSerialize(w)}function st(){return{type:"blockquote",children:[]}}function qe(){return{type:"code",lang:null,meta:null,value:""}}function qn(){return{type:"inlineCode",value:""}}function es(){return{type:"definition",identifier:"",label:null,title:null,url:""}}function ts(){return{type:"emphasis",children:[]}}function Oi(){return{type:"heading",depth:void 0,children:[]}}function Ii(){return{type:"break"}}function zi(){return{type:"html",value:""}}function ns(){return{type:"image",title:null,url:"",alt:null}}function $i(){return{type:"link",title:null,url:"",children:[]}}function Ni(w){return{type:"list",ordered:w.type==="listOrdered",start:null,spread:w._spread,children:[]}}function rs(w){return{type:"listItem",spread:w._spread,checked:null,children:[]}}function is(){return{type:"paragraph",children:[]}}function os(){return{type:"strong",children:[]}}function ls(){return{type:"text",value:""}}function as(){return{type:"thematicBreak"}}}function He(e){return{line:e.line,column:e.column,offset:e.offset}}function il(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?il(e,r):ec(e,r)}}function ec(e,t){let n;for(n in t)if(rl.call(t,n)){if(n==="canContainEols"){let r=t[n];r&&e[n].push(...r)}else if(n==="transforms"){let r=t[n];r&&e[n].push(...r)}else if(n==="enter"||n==="exit"){let r=t[n];r&&Object.assign(e[n],r)}}}function nl(e,t){throw e?new Error("Cannot close `"+e.type+"` ("+Ne({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+Ne({start:t.start,end:t.end})+") is open"):new Error("Cannot close document, a token (`"+t.type+"`, "+Ne({start:t.start,end:t.end})+") is still open")}function Or(e){Object.assign(this,{Parser:n=>{let r=this.data("settings");return Dr(n,Object.assign({},r,e,{extensions:this.data("micromarkExtensions")||[],mdastExtensions:this.data("fromMarkdownExtensions")||[]}))}})}var ol=Or;function ll(e,t){let n={type:"element",tagName:"blockquote",properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function al(e,t){let n={type:"element",tagName:"br",properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:"text",value:`
`}]}function sl(e,t){let n=t.value?t.value+`
`:"",r=t.lang?t.lang.match(/^[^ \t]+(?=[ \t]|$)/):null,i={};r&&(i.className=["language-"+r]);let o={type:"element",tagName:"code",properties:i,children:[{type:"text",value:n}]};return t.meta&&(o.data={meta:t.meta}),e.patch(t,o),o=e.applyData(t,o),o={type:"element",tagName:"pre",properties:{},children:[o]},e.patch(t,o),o}function ul(e,t){let n={type:"element",tagName:"del",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function cl(e,t){let n={type:"element",tagName:"em",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function de(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let o=e.charCodeAt(n),l="";if(o===37&&J(e.charCodeAt(n+1))&&J(e.charCodeAt(n+2)))i=2;else if(o<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o))||(l=String.fromCharCode(o));else if(o>55295&&o<57344){let s=e.charCodeAt(n+1);o<56320&&s>56319&&s<57344?(l=String.fromCharCode(o,s),i=1):l="\uFFFD"}else l=String.fromCharCode(o);l&&(t.push(e.slice(r,n),encodeURIComponent(l)),r=n+i+1,l=""),i&&(n+=i,i=0)}return t.join("")+e.slice(r)}function Sn(e,t){let n=String(t.identifier).toUpperCase(),r=de(n.toLowerCase()),i=e.footnoteOrder.indexOf(n),o;i===-1?(e.footnoteOrder.push(n),e.footnoteCounts[n]=1,o=e.footnoteOrder.length):(e.footnoteCounts[n]++,o=i+1);let l=e.footnoteCounts[n],s={type:"element",tagName:"a",properties:{href:"#"+e.clobberPrefix+"fn-"+r,id:e.clobberPrefix+"fnref-"+r+(l>1?"-"+l:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(o)}]};e.patch(t,s);let a={type:"element",tagName:"sup",properties:{},children:[s]};return e.patch(t,a),e.applyData(t,a)}function pl(e,t){let n=e.footnoteById,r=1;for(;r in n;)r++;let i=String(r);return n[i]={type:"footnoteDefinition",identifier:i,children:[{type:"paragraph",children:t.children}],position:t.position},Sn(e,{type:"footnoteReference",identifier:i,position:t.position})}function hl(e,t){let n={type:"element",tagName:"h"+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ml(e,t){if(e.dangerous){let n={type:"raw",value:t.value};return e.patch(t,n),e.applyData(t,n)}return null}function An(e,t){let n=t.referenceType,r="]";if(n==="collapsed"?r+="[]":n==="full"&&(r+="["+(t.label||t.identifier)+"]"),t.type==="imageReference")return{type:"text",value:"!["+t.alt+r};let i=e.all(t),o=i[0];o&&o.type==="text"?o.value="["+o.value:i.unshift({type:"text",value:"["});let l=i[i.length-1];return l&&l.type==="text"?l.value+=r:i.push({type:"text",value:r}),i}function fl(e,t){let n=e.definition(t.identifier);if(!n)return An(e,t);let r={src:de(n.url||""),alt:t.alt};n.title!==null&&n.title!==void 0&&(r.title=n.title);let i={type:"element",tagName:"img",properties:r,children:[]};return e.patch(t,i),e.applyData(t,i)}function dl(e,t){let n={src:de(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:"element",tagName:"img",properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function gl(e,t){let n={type:"text",value:t.value.replace(/\r?\n|\r/g," ")};e.patch(t,n);let r={type:"element",tagName:"code",properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function xl(e,t){let n=e.definition(t.identifier);if(!n)return An(e,t);let r={href:de(n.url||"")};n.title!==null&&n.title!==void 0&&(r.title=n.title);let i={type:"element",tagName:"a",properties:r,children:e.all(t)};return e.patch(t,i),e.applyData(t,i)}function yl(e,t){let n={href:de(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:"element",tagName:"a",properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function bl(e,t,n){let r=e.all(t),i=n?tc(n):wl(t),o={},l=[];if(typeof t.checked=="boolean"){let u=r[0],p;u&&u.type==="element"&&u.tagName==="p"?p=u:(p={type:"element",tagName:"p",properties:{},children:[]},r.unshift(p)),p.children.length>0&&p.children.unshift({type:"text",value:" "}),p.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:t.checked,disabled:!0},children:[]}),o.className=["task-list-item"]}let s=-1;for(;++s<r.length;){let u=r[s];(i||s!==0||u.type!=="element"||u.tagName!=="p")&&l.push({type:"text",value:`
`}),u.type==="element"&&u.tagName==="p"&&!i?l.push(...u.children):l.push(u)}let a=r[r.length-1];a&&(i||a.type!=="element"||a.tagName!=="p")&&l.push({type:"text",value:`
`});let c={type:"element",tagName:"li",properties:o,children:l};return e.patch(t,c),e.applyData(t,c)}function tc(e){let t=!1;if(e.type==="list"){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=wl(n[r])}return t}function wl(e){let t=e.spread;return t==null?e.children.length>1:t}function kl(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start=="number"&&t.start!==1&&(n.start=t.start);++i<r.length;){let l=r[i];if(l.type==="element"&&l.tagName==="li"&&l.properties&&Array.isArray(l.properties.className)&&l.properties.className.includes("task-list-item")){n.className=["contains-task-list"];break}}let o={type:"element",tagName:t.ordered?"ol":"ul",properties:n,children:e.wrap(r,!0)};return e.patch(t,o),e.applyData(t,o)}function Sl(e,t){let n={type:"element",tagName:"p",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Al(e,t){let n={type:"root",children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function Cl(e,t){let n={type:"element",tagName:"strong",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var dt=vl("start"),gt=vl("end");function Ir(e){return{start:dt(e),end:gt(e)}}function vl(e){return t;function t(n){let r=n&&n.position&&n.position[e]||{};return{line:r.line||null,column:r.column||null,offset:r.offset>-1?r.offset:null}}}function El(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let l={type:"element",tagName:"thead",properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],l),i.push(l)}if(n.length>0){let l={type:"element",tagName:"tbody",properties:{},children:e.wrap(n,!0)},s=dt(t.children[1]),a=gt(t.children[t.children.length-1]);s.line&&a.line&&(l.position={start:s,end:a}),i.push(l)}let o={type:"element",tagName:"table",properties:{},children:e.wrap(i,!0)};return e.patch(t,o),e.applyData(t,o)}function _l(e,t,n){let r=n?n.children:void 0,o=(r?r.indexOf(t):1)===0?"th":"td",l=n&&n.type==="table"?n.align:void 0,s=l?l.length:t.children.length,a=-1,c=[];for(;++a<s;){let p=t.children[a],m={},f=l?l[a]:void 0;f&&(m.align=f);let h={type:"element",tagName:o,properties:m,children:[]};p&&(h.children=e.all(p),e.patch(p,h),h=e.applyData(t,h)),c.push(h)}let u={type:"element",tagName:"tr",properties:{},children:e.wrap(c,!0)};return e.patch(t,u),e.applyData(t,u)}function Tl(e,t){let n={type:"element",tagName:"td",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Pl(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,o=[];for(;r;)o.push(Ll(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return o.push(Ll(t.slice(i),i>0,!1)),o.join("")}function Ll(e,t,n){let r=0,i=e.length;if(t){let o=e.codePointAt(r);for(;o===9||o===32;)r++,o=e.codePointAt(r)}if(n){let o=e.codePointAt(i-1);for(;o===9||o===32;)i--,o=e.codePointAt(i-1)}return i>r?e.slice(r,i):""}function Fl(e,t){let n={type:"text",value:Pl(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function Dl(e,t){let n={type:"element",tagName:"hr",properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var Ol={blockquote:ll,break:al,code:sl,delete:ul,emphasis:cl,footnoteReference:Sn,footnote:pl,heading:hl,html:ml,imageReference:fl,image:dl,inlineCode:gl,linkReference:xl,link:yl,listItem:bl,list:kl,paragraph:Sl,root:Al,strong:Cl,table:El,tableCell:Tl,tableRow:_l,text:Fl,thematicBreak:Dl,toml:Cn,yaml:Cn,definition:Cn,footnoteDefinition:Cn};function Cn(){return null}var xt=function(e){if(e==null)return oc;if(typeof e=="string")return ic(e);if(typeof e=="object")return Array.isArray(e)?nc(e):rc(e);if(typeof e=="function")return vn(e);throw new Error("Expected function, string, or object as test")};function nc(e){let t=[],n=-1;for(;++n<e.length;)t[n]=xt(e[n]);return vn(r);function r(...i){let o=-1;for(;++o<t.length;)if(t[o].call(this,...i))return!0;return!1}}function rc(e){return vn(t);function t(n){let r;for(r in e)if(n[r]!==e[r])return!1;return!0}}function ic(e){return vn(t);function t(n){return n&&n.type===e}}function vn(e){return t;function t(n,...r){return!!(n&&typeof n=="object"&&"type"in n&&e.call(this,n,...r))}}function oc(){return!0}var zr=!0,En=!1,$r="skip",Mt=function(e,t,n,r){typeof t=="function"&&typeof n!="function"&&(r=n,n=t,t=null);let i=xt(t),o=r?-1:1;l(e,void 0,[])();function l(s,a,c){let u=s&&typeof s=="object"?s:{};if(typeof u.type=="string"){let m=typeof u.tagName=="string"?u.tagName:typeof u.name=="string"?u.name:void 0;Object.defineProperty(p,"name",{value:"node ("+(s.type+(m?"<"+m+">":""))+")"})}return p;function p(){let m=[],f,h,b;if((!t||i(s,a,c[c.length-1]||null))&&(m=lc(n(s,c)),m[0]===En))return m;if(s.children&&m[0]!==$r)for(h=(r?s.children.length:-1)+o,b=c.concat(s);h>-1&&h<s.children.length;){if(f=l(s.children[h],h,b)(),f[0]===En)return f;h=typeof f[1]=="number"?f[1]:h+o}return m}}};function lc(e){return Array.isArray(e)?e:typeof e=="number"?[zr,e]:[e]}var Bt=function(e,t,n,r){typeof t=="function"&&typeof n!="function"&&(r=n,n=t,t=null),Mt(e,t,i,r);function i(o,l){let s=l[l.length-1];return n(o,s?s.children.indexOf(o):null,s)}};function Nr(e){return!e||!e.position||!e.position.start||!e.position.start.line||!e.position.start.column||!e.position.end||!e.position.end.line||!e.position.end.column}var Il={}.hasOwnProperty;function Rr(e){let t=Object.create(null);if(!e||!e.type)throw new Error("mdast-util-definitions expected node");return Bt(e,"definition",r=>{let i=zl(r.identifier);i&&!Il.call(t,i)&&(t[i]=r)}),n;function n(r){let i=zl(r);return i&&Il.call(t,i)?t[i]:null}}function zl(e){return String(e||"").toUpperCase()}var _n={}.hasOwnProperty;function $l(e,t){let n=t||{},r=n.allowDangerousHtml||!1,i={};return l.dangerous=r,l.clobberPrefix=n.clobberPrefix===void 0||n.clobberPrefix===null?"user-content-":n.clobberPrefix,l.footnoteLabel=n.footnoteLabel||"Footnotes",l.footnoteLabelTagName=n.footnoteLabelTagName||"h2",l.footnoteLabelProperties=n.footnoteLabelProperties||{className:["sr-only"]},l.footnoteBackLabel=n.footnoteBackLabel||"Back to content",l.unknownHandler=n.unknownHandler,l.passThrough=n.passThrough,l.handlers={...Ol,...n.handlers},l.definition=Rr(e),l.footnoteById=i,l.footnoteOrder=[],l.footnoteCounts={},l.patch=ac,l.applyData=sc,l.one=s,l.all=a,l.wrap=cc,l.augment=o,Bt(e,"footnoteDefinition",c=>{let u=String(c.identifier).toUpperCase();_n.call(i,u)||(i[u]=c)}),l;function o(c,u){if(c&&"data"in c&&c.data){let p=c.data;p.hName&&(u.type!=="element"&&(u={type:"element",tagName:"",properties:{},children:[]}),u.tagName=p.hName),u.type==="element"&&p.hProperties&&(u.properties={...u.properties,...p.hProperties}),"children"in u&&u.children&&p.hChildren&&(u.children=p.hChildren)}if(c){let p="type"in c?c:{position:c};Nr(p)||(u.position={start:dt(p),end:gt(p)})}return u}function l(c,u,p,m){return Array.isArray(p)&&(m=p,p={}),o(c,{type:"element",tagName:u,properties:p||{},children:m||[]})}function s(c,u){return Nl(l,c,u)}function a(c){return Mr(l,c)}}function ac(e,t){e.position&&(t.position=Ir(e))}function sc(e,t){let n=t;if(e&&e.data){let r=e.data.hName,i=e.data.hChildren,o=e.data.hProperties;typeof r=="string"&&(n.type==="element"?n.tagName=r:n={type:"element",tagName:r,properties:{},children:[]}),n.type==="element"&&o&&(n.properties={...n.properties,...o}),"children"in n&&n.children&&i!==null&&i!==void 0&&(n.children=i)}return n}function Nl(e,t,n){let r=t&&t.type;if(!r)throw new Error("Expected node, got `"+t+"`");return _n.call(e.handlers,r)?e.handlers[r](e,t,n):e.passThrough&&e.passThrough.includes(r)?"children"in t?{...t,children:Mr(e,t)}:t:e.unknownHandler?e.unknownHandler(e,t,n):uc(e,t)}function Mr(e,t){let n=[];if("children"in t){let r=t.children,i=-1;for(;++i<r.length;){let o=Nl(e,r[i],t);if(o){if(i&&r[i-1].type==="break"&&(!Array.isArray(o)&&o.type==="text"&&(o.value=o.value.replace(/^\s+/,"")),!Array.isArray(o)&&o.type==="element")){let l=o.children[0];l&&l.type==="text"&&(l.value=l.value.replace(/^\s+/,""))}Array.isArray(o)?n.push(...o):n.push(o)}}}return n}function uc(e,t){let n=t.data||{},r="value"in t&&!(_n.call(n,"hProperties")||_n.call(n,"hChildren"))?{type:"text",value:t.value}:{type:"element",tagName:"div",properties:{},children:Mr(e,t)};return e.patch(t,r),e.applyData(t,r)}function cc(e,t){let n=[],r=-1;for(t&&n.push({type:"text",value:`
`});++r<e.length;)r&&n.push({type:"text",value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:"text",value:`
`}),n}function Rl(e){let t=[],n=-1;for(;++n<e.footnoteOrder.length;){let r=e.footnoteById[e.footnoteOrder[n]];if(!r)continue;let i=e.all(r),o=String(r.identifier).toUpperCase(),l=de(o.toLowerCase()),s=0,a=[];for(;++s<=e.footnoteCounts[o];){let p={type:"element",tagName:"a",properties:{href:"#"+e.clobberPrefix+"fnref-"+l+(s>1?"-"+s:""),dataFootnoteBackref:!0,className:["data-footnote-backref"],ariaLabel:e.footnoteBackLabel},children:[{type:"text",value:"\u21A9"}]};s>1&&p.children.push({type:"element",tagName:"sup",children:[{type:"text",value:String(s)}]}),a.length>0&&a.push({type:"text",value:" "}),a.push(p)}let c=i[i.length-1];if(c&&c.type==="element"&&c.tagName==="p"){let p=c.children[c.children.length-1];p&&p.type==="text"?p.value+=" ":c.children.push({type:"text",value:" "}),c.children.push(...a)}else i.push(...a);let u={type:"element",tagName:"li",properties:{id:e.clobberPrefix+"fn-"+l},children:e.wrap(i,!0)};e.patch(r,u),t.push(u)}if(t.length!==0)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:e.footnoteLabelTagName,properties:{...JSON.parse(JSON.stringify(e.footnoteLabelProperties)),id:"footnote-label"},children:[{type:"text",value:e.footnoteLabel}]},{type:"text",value:`
`},{type:"element",tagName:"ol",properties:{},children:e.wrap(t,!0)},{type:"text",value:`
`}]}}function Tn(e,t){let n=$l(e,t),r=n.one(e,null),i=Rl(n);return i&&r.children.push({type:"text",value:`
`},i),Array.isArray(r)?{type:"root",children:r}:r}var pc=function(e,t){return e&&"run"in e?hc(e,t):mc(e||t)},Br=pc;function hc(e,t){return(n,r,i)=>{e.run(Tn(n,t),r,o=>{i(o)})}}function mc(e){return t=>Tn(t,e)}var Ht={strip:["script"],clobberPrefix:"user-content-",clobber:["name","id"],ancestors:{tbody:["table"],tfoot:["table"],thead:["table"],td:["table"],th:["table"],tr:["table"]},protocols:{href:["http","https","mailto","xmpp","irc","ircs"],cite:["http","https"],src:["http","https"],longDesc:["http","https"]},tagNames:["h1","h2","h3","h4","h5","h6","br","b","i","strong","em","a","pre","code","img","tt","div","ins","del","sup","sub","p","ol","ul","table","thead","tbody","tfoot","blockquote","dl","dt","dd","kbd","q","samp","var","hr","ruby","rt","rp","li","tr","td","th","s","strike","summary","details","caption","figure","figcaption","abbr","bdo","cite","dfn","mark","small","span","time","wbr","input"],attributes:{a:["href"],img:["src","longDesc"],input:[["type","checkbox"],["disabled",!0]],li:[["className","task-list-item"]],div:["itemScope","itemType"],blockquote:["cite"],del:["cite"],ins:["cite"],q:["cite"],"*":["abbr","accept","acceptCharset","accessKey","action","align","alt","ariaDescribedBy","ariaHidden","ariaLabel","ariaLabelledBy","axis","border","cellPadding","cellSpacing","char","charOff","charSet","checked","clear","cols","colSpan","color","compact","coords","dateTime","dir","disabled","encType","htmlFor","frame","headers","height","hrefLang","hSpace","isMap","id","label","lang","maxLength","media","method","multiple","name","noHref","noShade","noWrap","open","prompt","readOnly","rel","rev","rows","rowSpan","rules","scope","selected","shape","size","span","start","summary","tabIndex","target","title","type","useMap","vAlign","value","vSpace","width","itemProp"]},required:{input:{type:"checkbox",disabled:!0}}};var Se={}.hasOwnProperty,Hr={root:{children:Ml},doctype:fc,comment:dc,element:{tagName:jl,properties:gc,children:Ml},text:{value:bc},"*":{data:Bl,position:Bl}};function Ur(e,t){let n={type:"root",children:[]};if(e&&typeof e=="object"&&e.type){let r=Ul(Object.assign({},Ht,t||{}),e,[]);r&&(Array.isArray(r)?r.length===1?n=r[0]:n.children=r:n=r)}return n}function Ul(e,t,n){let r=t&&t.type,i={type:t.type},o;if(Se.call(Hr,r)){let l=Hr[r];if(typeof l=="function"&&(l=l(e,t)),l){let s=Object.assign({},l,Hr["*"]),a;o=!0;for(a in s)if(Se.call(s,a)){let c=s[a](e,t[a],t,n);c===!1?(o=void 0,i[a]=t[a]):c!=null&&(i[a]=c)}}}return o?i:i.type==="element"&&e.strip&&!e.strip.includes(i.tagName)?i.children:void 0}function Ml(e,t,n,r){let i=[];if(Array.isArray(t)){let o=-1;for(n.type==="element"&&r.push(n.tagName);++o<t.length;){let l=Ul(e,t[o],r);l&&(Array.isArray(l)?i.push(...l):i.push(l))}n.type==="element"&&r.pop()}return i}function fc(e){return e.allowDoctypes?{name:xc}:void 0}function dc(e){return e.allowComments?{value:yc}:void 0}function gc(e,t,n,r){let i=jl(e,n.tagName,n,r),o=e.attributes||{},l=e.required||{},s=t||{},a=Object.assign({},Hl(o["*"]),Hl(i&&Se.call(o,i)?o[i]:[])),c={},u;for(u in s)if(Se.call(s,u)){let p=s[u],m;if(Se.call(a,u))m=a[u];else if(Sc(u)&&Se.call(a,"data*"))m=a["data*"];else continue;p=Array.isArray(p)?wc(e,p,u,m):ql(e,p,u,m),p!=null&&(c[u]=p)}if(i&&Se.call(l,i))for(u in l[i])Se.call(c,u)||(c[u]=l[i][u]);return c}function xc(){return"html"}function jl(e,t,n,r){let i=typeof t=="string"?t:"",o=-1;if(!i||i==="*"||e.tagNames&&!e.tagNames.includes(i))return!1;if(e.ancestors&&Se.call(e.ancestors,i)){for(;++o<e.ancestors[i].length;)if(r.includes(e.ancestors[i][o]))return i;return!1}return i}function yc(e,t){let n=typeof t=="string"?t:"",r=n.indexOf("-->");return r<0?n:n.slice(0,r)}function bc(e,t){return typeof t=="string"?t:""}function Bl(e,t){return t}function wc(e,t,n,r){let i=-1,o=[];for(;++i<t.length;){let l=ql(e,t[i],n,r);l!=null&&o.push(l)}return o}function ql(e,t,n,r){if((typeof t=="boolean"||typeof t=="number"||typeof t=="string")&&kc(e,t,n)&&(r.length===0||r.some(i=>i&&typeof i=="object"&&"flags"in i?i.test(String(t)):i===t)))return e.clobberPrefix&&e.clobber&&e.clobber.includes(n)?e.clobberPrefix+t:t}function kc(e,t,n){let r=String(t),i=r.indexOf(":"),o=r.indexOf("?"),l=r.indexOf("#"),s=r.indexOf("/"),a=e.protocols&&Se.call(e.protocols,n)?e.protocols[n].concat():[],c=-1;if(a.length===0||i<0||s>-1&&i>s||o>-1&&i>o||l>-1&&i>l)return!0;for(;++c<a.length;)if(i===a[c].length&&r.slice(0,a[c].length)===a[c])return!0;return!1}function Hl(e){let t={},n=-1;for(;++n<e.length;){let r=e[n];Array.isArray(r)?t[r[0]]=r.slice(1):t[r]=[]}return t}function Sc(e){return e.length>4&&e.slice(0,4).toLowerCase()==="data"}function jr(e=Ht){return t=>Ur(t,e)}var De=class{constructor(t,n,r){this.property=t,this.normal=n,r&&(this.space=r)}};De.prototype.property={};De.prototype.normal={};De.prototype.space=null;function qr(e,t){let n={},r={},i=-1;for(;++i<e.length;)Object.assign(n,e[i].property),Object.assign(r,e[i].normal);return new De(n,r,t)}function Ut(e){return e.toLowerCase()}var pe=class{constructor(t,n){this.property=t,this.attribute=n}};pe.prototype.space=null;pe.prototype.boolean=!1;pe.prototype.booleanish=!1;pe.prototype.overloadedBoolean=!1;pe.prototype.number=!1;pe.prototype.commaSeparated=!1;pe.prototype.spaceSeparated=!1;pe.prototype.commaOrSpaceSeparated=!1;pe.prototype.mustUseProperty=!1;pe.prototype.defined=!1;var jt={};Bi(jt,{boolean:()=>z,booleanish:()=>Q,commaOrSpaceSeparated:()=>fe,commaSeparated:()=>Ue,number:()=>A,overloadedBoolean:()=>Vr,spaceSeparated:()=>j});var Ac=0,z=rt(),Q=rt(),Vr=rt(),A=rt(),j=rt(),Ue=rt(),fe=rt();function rt(){return 2**++Ac}var Wr=Object.keys(jt),it=class extends pe{constructor(t,n,r,i){let o=-1;if(super(t,n),Vl(this,"space",i),typeof r=="number")for(;++o<Wr.length;){let l=Wr[o];Vl(this,Wr[o],(r&jt[l])===jt[l])}}};it.prototype.defined=!0;function Vl(e,t,n){n&&(e[t]=n)}var Cc={}.hasOwnProperty;function ge(e){let t={},n={},r;for(r in e.properties)if(Cc.call(e.properties,r)){let i=e.properties[r],o=new it(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(o.mustUseProperty=!0),t[r]=o,n[Ut(r)]=r,n[Ut(o.attribute)]=r}return new De(t,n,e.space)}var Kr=ge({space:"xlink",transform(e,t){return"xlink:"+t.slice(5).toLowerCase()},properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null}});var Qr=ge({space:"xml",transform(e,t){return"xml:"+t.slice(3).toLowerCase()},properties:{xmlLang:null,xmlBase:null,xmlSpace:null}});function Ln(e,t){return t in e?e[t]:t}function Pn(e,t){return Ln(e,t.toLowerCase())}var Yr=ge({space:"xmlns",attributes:{xmlnsxlink:"xmlns:xlink"},transform:Pn,properties:{xmlns:null,xmlnsXLink:null}});var Gr=ge({transform(e,t){return t==="role"?t:"aria-"+t.slice(4).toLowerCase()},properties:{ariaActiveDescendant:null,ariaAtomic:Q,ariaAutoComplete:null,ariaBusy:Q,ariaChecked:Q,ariaColCount:A,ariaColIndex:A,ariaColSpan:A,ariaControls:j,ariaCurrent:null,ariaDescribedBy:j,ariaDetails:null,ariaDisabled:Q,ariaDropEffect:j,ariaErrorMessage:null,ariaExpanded:Q,ariaFlowTo:j,ariaGrabbed:Q,ariaHasPopup:null,ariaHidden:Q,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:j,ariaLevel:A,ariaLive:null,ariaModal:Q,ariaMultiLine:Q,ariaMultiSelectable:Q,ariaOrientation:null,ariaOwns:j,ariaPlaceholder:null,ariaPosInSet:A,ariaPressed:Q,ariaReadOnly:Q,ariaRelevant:null,ariaRequired:Q,ariaRoleDescription:j,ariaRowCount:A,ariaRowIndex:A,ariaRowSpan:A,ariaSelected:Q,ariaSetSize:A,ariaSort:null,ariaValueMax:A,ariaValueMin:A,ariaValueNow:A,ariaValueText:null,role:null}});var Wl=ge({space:"html",attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},transform:Pn,mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:Ue,acceptCharset:j,accessKey:j,action:null,allow:null,allowFullScreen:z,allowPaymentRequest:z,allowUserMedia:z,alt:null,as:null,async:z,autoCapitalize:null,autoComplete:j,autoFocus:z,autoPlay:z,capture:z,charSet:null,checked:z,cite:null,className:j,cols:A,colSpan:null,content:null,contentEditable:Q,controls:z,controlsList:j,coords:A|Ue,crossOrigin:null,data:null,dateTime:null,decoding:null,default:z,defer:z,dir:null,dirName:null,disabled:z,download:Vr,draggable:Q,encType:null,enterKeyHint:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:z,formTarget:null,headers:j,height:A,hidden:z,high:A,href:null,hrefLang:null,htmlFor:j,httpEquiv:j,id:null,imageSizes:null,imageSrcSet:null,inputMode:null,integrity:null,is:null,isMap:z,itemId:null,itemProp:j,itemRef:j,itemScope:z,itemType:j,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:z,low:A,manifest:null,max:null,maxLength:A,media:null,method:null,min:null,minLength:A,multiple:z,muted:z,name:null,nonce:null,noModule:z,noValidate:z,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:z,optimum:A,pattern:null,ping:j,placeholder:null,playsInline:z,poster:null,preload:null,readOnly:z,referrerPolicy:null,rel:j,required:z,reversed:z,rows:A,rowSpan:A,sandbox:j,scope:null,scoped:z,seamless:z,selected:z,shape:null,size:A,sizes:null,slot:null,span:A,spellCheck:Q,src:null,srcDoc:null,srcLang:null,srcSet:null,start:A,step:null,style:null,tabIndex:A,target:null,title:null,translate:null,type:null,typeMustMatch:z,useMap:null,value:Q,width:A,wrap:null,align:null,aLink:null,archive:j,axis:null,background:null,bgColor:null,border:A,borderColor:null,bottomMargin:A,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:z,declare:z,event:null,face:null,frame:null,frameBorder:null,hSpace:A,leftMargin:A,link:null,longDesc:null,lowSrc:null,marginHeight:A,marginWidth:A,noResize:z,noHref:z,noShade:z,noWrap:z,object:null,profile:null,prompt:null,rev:null,rightMargin:A,rules:null,scheme:null,scrolling:Q,standby:null,summary:null,text:null,topMargin:A,valueType:null,version:null,vAlign:null,vLink:null,vSpace:A,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:z,disableRemotePlayback:z,prefix:null,property:null,results:A,security:null,unselectable:null}});var Kl=ge({space:"svg",attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},transform:Ln,properties:{about:fe,accentHeight:A,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:A,amplitude:A,arabicForm:null,ascent:A,attributeName:null,attributeType:null,azimuth:A,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:A,by:null,calcMode:null,capHeight:A,className:j,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:A,diffuseConstant:A,direction:null,display:null,dur:null,divisor:A,dominantBaseline:null,download:z,dx:null,dy:null,edgeMode:null,editable:null,elevation:A,enableBackground:null,end:null,event:null,exponent:A,externalResourcesRequired:null,fill:null,fillOpacity:A,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:Ue,g2:Ue,glyphName:Ue,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:A,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:A,horizOriginX:A,horizOriginY:A,id:null,ideographic:A,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:A,k:A,k1:A,k2:A,k3:A,k4:A,kernelMatrix:fe,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:A,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:A,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:A,overlineThickness:A,paintOrder:null,panose1:null,path:null,pathLength:A,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:j,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:A,pointsAtY:A,pointsAtZ:A,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:fe,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:fe,rev:fe,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:fe,requiredFeatures:fe,requiredFonts:fe,requiredFormats:fe,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:A,specularExponent:A,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:A,strikethroughThickness:A,string:null,stroke:null,strokeDashArray:fe,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:A,strokeOpacity:A,strokeWidth:null,style:null,surfaceScale:A,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:fe,tabIndex:A,tableValues:null,target:null,targetX:A,targetY:A,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:fe,to:null,transform:null,u1:null,u2:null,underlinePosition:A,underlineThickness:A,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:A,values:null,vAlphabetic:A,vMathematical:A,vectorEffect:null,vHanging:A,vIdeographic:A,version:null,vertAdvY:A,vertOriginX:A,vertOriginY:A,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:A,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null}});var vc=/^data[-\w.:]+$/i,Ql=/-[a-z]/g,Ec=/[A-Z]/g;function Zr(e,t){let n=Ut(t),r=t,i=pe;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)==="data"&&vc.test(t)){if(t.charAt(4)==="-"){let o=t.slice(5).replace(Ql,Tc);r="data"+o.charAt(0).toUpperCase()+o.slice(1)}else{let o=t.slice(4);if(!Ql.test(o)){let l=o.replace(Ec,_c);l.charAt(0)!=="-"&&(l="-"+l),t="data"+l}}i=it}return new i(r,t)}function _c(e){return"-"+e.toLowerCase()}function Tc(e){return e.charAt(1).toUpperCase()}var Yl=qr([Qr,Kr,Yr,Gr,Wl],"html"),Fn=qr([Qr,Kr,Yr,Gr,Kl],"svg");var Gl=["area","base","basefont","bgsound","br","col","command","embed","frame","hr","image","img","input","isindex","keygen","link","menuitem","meta","nextid","param","source","track","wbr"];var Zl={}.hasOwnProperty;function Xl(e,t){let n=t||{};function r(i,...o){let l=r.invalid,s=r.handlers;if(i&&Zl.call(i,e)){let a=String(i[e]);l=Zl.call(s,a)?s[a]:r.unknown}if(l)return l.call(this,i,...o)}return r.handlers=n.handlers||{},r.invalid=n.invalid,r.unknown=n.unknown,r}function Jl(e,t){if(e=e.replace(t.subset?Lc(t.subset):/["&'<>`]/g,r),t.subset||t.escapeOnly)return e;return e.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,n).replace(/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,r);function n(i,o,l){return t.format((i.charCodeAt(0)-55296)*1024+i.charCodeAt(1)-56320+65536,l.charCodeAt(o+2),t)}function r(i,o,l){return t.format(i.charCodeAt(0),l.charCodeAt(o+1),t)}}function Lc(e){let t=[],n=-1;for(;++n<e.length;)t.push(e[n].replace(/[|\\{}()[\]^$+*?.]/g,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function ea(e,t,n){let r="&#x"+e.toString(16).toUpperCase();return n&&t&&!/[\dA-Fa-f]/.test(String.fromCharCode(t))?r:r+";"}function ta(e,t,n){let r="&#"+String(e);return n&&t&&!/\d/.test(String.fromCharCode(t))?r:r+";"}var na=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"];var Dn={nbsp:"\xA0",iexcl:"\xA1",cent:"\xA2",pound:"\xA3",curren:"\xA4",yen:"\xA5",brvbar:"\xA6",sect:"\xA7",uml:"\xA8",copy:"\xA9",ordf:"\xAA",laquo:"\xAB",not:"\xAC",shy:"\xAD",reg:"\xAE",macr:"\xAF",deg:"\xB0",plusmn:"\xB1",sup2:"\xB2",sup3:"\xB3",acute:"\xB4",micro:"\xB5",para:"\xB6",middot:"\xB7",cedil:"\xB8",sup1:"\xB9",ordm:"\xBA",raquo:"\xBB",frac14:"\xBC",frac12:"\xBD",frac34:"\xBE",iquest:"\xBF",Agrave:"\xC0",Aacute:"\xC1",Acirc:"\xC2",Atilde:"\xC3",Auml:"\xC4",Aring:"\xC5",AElig:"\xC6",Ccedil:"\xC7",Egrave:"\xC8",Eacute:"\xC9",Ecirc:"\xCA",Euml:"\xCB",Igrave:"\xCC",Iacute:"\xCD",Icirc:"\xCE",Iuml:"\xCF",ETH:"\xD0",Ntilde:"\xD1",Ograve:"\xD2",Oacute:"\xD3",Ocirc:"\xD4",Otilde:"\xD5",Ouml:"\xD6",times:"\xD7",Oslash:"\xD8",Ugrave:"\xD9",Uacute:"\xDA",Ucirc:"\xDB",Uuml:"\xDC",Yacute:"\xDD",THORN:"\xDE",szlig:"\xDF",agrave:"\xE0",aacute:"\xE1",acirc:"\xE2",atilde:"\xE3",auml:"\xE4",aring:"\xE5",aelig:"\xE6",ccedil:"\xE7",egrave:"\xE8",eacute:"\xE9",ecirc:"\xEA",euml:"\xEB",igrave:"\xEC",iacute:"\xED",icirc:"\xEE",iuml:"\xEF",eth:"\xF0",ntilde:"\xF1",ograve:"\xF2",oacute:"\xF3",ocirc:"\xF4",otilde:"\xF5",ouml:"\xF6",divide:"\xF7",oslash:"\xF8",ugrave:"\xF9",uacute:"\xFA",ucirc:"\xFB",uuml:"\xFC",yacute:"\xFD",thorn:"\xFE",yuml:"\xFF",fnof:"\u0192",Alpha:"\u0391",Beta:"\u0392",Gamma:"\u0393",Delta:"\u0394",Epsilon:"\u0395",Zeta:"\u0396",Eta:"\u0397",Theta:"\u0398",Iota:"\u0399",Kappa:"\u039A",Lambda:"\u039B",Mu:"\u039C",Nu:"\u039D",Xi:"\u039E",Omicron:"\u039F",Pi:"\u03A0",Rho:"\u03A1",Sigma:"\u03A3",Tau:"\u03A4",Upsilon:"\u03A5",Phi:"\u03A6",Chi:"\u03A7",Psi:"\u03A8",Omega:"\u03A9",alpha:"\u03B1",beta:"\u03B2",gamma:"\u03B3",delta:"\u03B4",epsilon:"\u03B5",zeta:"\u03B6",eta:"\u03B7",theta:"\u03B8",iota:"\u03B9",kappa:"\u03BA",lambda:"\u03BB",mu:"\u03BC",nu:"\u03BD",xi:"\u03BE",omicron:"\u03BF",pi:"\u03C0",rho:"\u03C1",sigmaf:"\u03C2",sigma:"\u03C3",tau:"\u03C4",upsilon:"\u03C5",phi:"\u03C6",chi:"\u03C7",psi:"\u03C8",omega:"\u03C9",thetasym:"\u03D1",upsih:"\u03D2",piv:"\u03D6",bull:"\u2022",hellip:"\u2026",prime:"\u2032",Prime:"\u2033",oline:"\u203E",frasl:"\u2044",weierp:"\u2118",image:"\u2111",real:"\u211C",trade:"\u2122",alefsym:"\u2135",larr:"\u2190",uarr:"\u2191",rarr:"\u2192",darr:"\u2193",harr:"\u2194",crarr:"\u21B5",lArr:"\u21D0",uArr:"\u21D1",rArr:"\u21D2",dArr:"\u21D3",hArr:"\u21D4",forall:"\u2200",part:"\u2202",exist:"\u2203",empty:"\u2205",nabla:"\u2207",isin:"\u2208",notin:"\u2209",ni:"\u220B",prod:"\u220F",sum:"\u2211",minus:"\u2212",lowast:"\u2217",radic:"\u221A",prop:"\u221D",infin:"\u221E",ang:"\u2220",and:"\u2227",or:"\u2228",cap:"\u2229",cup:"\u222A",int:"\u222B",there4:"\u2234",sim:"\u223C",cong:"\u2245",asymp:"\u2248",ne:"\u2260",equiv:"\u2261",le:"\u2264",ge:"\u2265",sub:"\u2282",sup:"\u2283",nsub:"\u2284",sube:"\u2286",supe:"\u2287",oplus:"\u2295",otimes:"\u2297",perp:"\u22A5",sdot:"\u22C5",lceil:"\u2308",rceil:"\u2309",lfloor:"\u230A",rfloor:"\u230B",lang:"\u2329",rang:"\u232A",loz:"\u25CA",spades:"\u2660",clubs:"\u2663",hearts:"\u2665",diams:"\u2666",quot:'"',amp:"&",lt:"<",gt:">",OElig:"\u0152",oelig:"\u0153",Scaron:"\u0160",scaron:"\u0161",Yuml:"\u0178",circ:"\u02C6",tilde:"\u02DC",ensp:"\u2002",emsp:"\u2003",thinsp:"\u2009",zwnj:"\u200C",zwj:"\u200D",lrm:"\u200E",rlm:"\u200F",ndash:"\u2013",mdash:"\u2014",lsquo:"\u2018",rsquo:"\u2019",sbquo:"\u201A",ldquo:"\u201C",rdquo:"\u201D",bdquo:"\u201E",dagger:"\u2020",Dagger:"\u2021",permil:"\u2030",lsaquo:"\u2039",rsaquo:"\u203A",euro:"\u20AC"};var ra=["cent","copy","divide","gt","lt","not","para","times"];var ia={}.hasOwnProperty,Xr={},On;for(On in Dn)ia.call(Dn,On)&&(Xr[Dn[On]]=On);function oa(e,t,n,r){let i=String.fromCharCode(e);if(ia.call(Xr,i)){let o=Xr[i],l="&"+o;return n&&na.includes(o)&&!ra.includes(o)&&(!r||t&&t!==61&&/[^\da-z]/i.test(String.fromCharCode(t)))?l:l+";"}return""}function la(e,t,n){let r=ea(e,t,n.omitOptionalSemicolons),i;if((n.useNamedReferences||n.useShortestReferences)&&(i=oa(e,t,n.omitOptionalSemicolons,n.attribute)),(n.useShortestReferences||!i)&&n.useShortestReferences){let o=ta(e,t,n.omitOptionalSemicolons);o.length<r.length&&(r=o)}return i&&(!n.useShortestReferences||i.length<r.length)?i:r}function Oe(e,t){return Jl(e,Object.assign({format:la},t))}function aa(e,t,n,r){return r.settings.bogusComments?"<?"+Oe(e.value,Object.assign({},r.settings.characterReferences,{subset:[">"]}))+">":"<!--"+e.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g,i)+"-->";function i(o){return Oe(o,Object.assign({},r.settings.characterReferences,{subset:["<",">"]}))}}function sa(e,t,n,r){return"<!"+(r.settings.upperDoctype?"DOCTYPE":"doctype")+(r.settings.tightDoctype?"":" ")+"html>"}function yt(e,t){let n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let r=0,i=n.indexOf(t);for(;i!==-1;)r++,i=n.indexOf(t,i+t.length);return r}function ua(e,t){let n=t||{};return(e[e.length-1]===""?[...e,""]:e).join((n.padRight?" ":"")+","+(n.padLeft===!1?"":" ")).trim()}function ca(e){return e.join(" ").trim()}function bt(e){let t=e&&typeof e=="object"&&e.type==="text"?e.value||"":e;return typeof t=="string"&&t.replace(/[ \t\n\f\r]/g,"")===""}var Y=pa(1),Jr=pa(-1);function pa(e){return t;function t(n,r,i){let o=n?n.children:[],l=(r||0)+e,s=o&&o[l];if(!i)for(;s&&bt(s);)l+=e,s=o[l];return s}}var Pc={}.hasOwnProperty;function In(e){return t;function t(n,r,i){return Pc.call(e,n.tagName)&&e[n.tagName](n,r,i)}}var qt=In({html:Fc,head:ei,body:Dc,p:Oc,li:Ic,dt:zc,dd:$c,rt:ha,rp:ha,optgroup:Nc,option:Rc,menuitem:Mc,colgroup:ei,caption:ei,thead:Bc,tbody:Hc,tfoot:Uc,tr:jc,td:ma,th:ma});function ei(e,t,n){let r=Y(n,t,!0);return!r||r.type!=="comment"&&!(r.type==="text"&&bt(r.value.charAt(0)))}function Fc(e,t,n){let r=Y(n,t);return!r||r.type!=="comment"}function Dc(e,t,n){let r=Y(n,t);return!r||r.type!=="comment"}function Oc(e,t,n){let r=Y(n,t);return r?r.type==="element"&&(r.tagName==="address"||r.tagName==="article"||r.tagName==="aside"||r.tagName==="blockquote"||r.tagName==="details"||r.tagName==="div"||r.tagName==="dl"||r.tagName==="fieldset"||r.tagName==="figcaption"||r.tagName==="figure"||r.tagName==="footer"||r.tagName==="form"||r.tagName==="h1"||r.tagName==="h2"||r.tagName==="h3"||r.tagName==="h4"||r.tagName==="h5"||r.tagName==="h6"||r.tagName==="header"||r.tagName==="hgroup"||r.tagName==="hr"||r.tagName==="main"||r.tagName==="menu"||r.tagName==="nav"||r.tagName==="ol"||r.tagName==="p"||r.tagName==="pre"||r.tagName==="section"||r.tagName==="table"||r.tagName==="ul"):!n||!(n.type==="element"&&(n.tagName==="a"||n.tagName==="audio"||n.tagName==="del"||n.tagName==="ins"||n.tagName==="map"||n.tagName==="noscript"||n.tagName==="video"))}function Ic(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&r.tagName==="li"}function zc(e,t,n){let r=Y(n,t);return r&&r.type==="element"&&(r.tagName==="dt"||r.tagName==="dd")}function $c(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="dt"||r.tagName==="dd")}function ha(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="rp"||r.tagName==="rt")}function Nc(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&r.tagName==="optgroup"}function Rc(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="option"||r.tagName==="optgroup")}function Mc(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="menuitem"||r.tagName==="hr"||r.tagName==="menu")}function Bc(e,t,n){let r=Y(n,t);return r&&r.type==="element"&&(r.tagName==="tbody"||r.tagName==="tfoot")}function Hc(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="tbody"||r.tagName==="tfoot")}function Uc(e,t,n){return!Y(n,t)}function jc(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&r.tagName==="tr"}function ma(e,t,n){let r=Y(n,t);return!r||r.type==="element"&&(r.tagName==="td"||r.tagName==="th")}var fa=In({html:qc,head:Vc,body:Wc,colgroup:Kc,tbody:Qc});function qc(e){let t=Y(e,-1);return!t||t.type!=="comment"}function Vc(e){let t=e.children,n=[],r=-1;for(;++r<t.length;){let i=t[r];if(i.type==="element"&&(i.tagName==="title"||i.tagName==="base")){if(n.includes(i.tagName))return!1;n.push(i.tagName)}}return t.length>0}function Wc(e){let t=Y(e,-1,!0);return!t||t.type!=="comment"&&!(t.type==="text"&&bt(t.value.charAt(0)))&&!(t.type==="element"&&(t.tagName==="meta"||t.tagName==="link"||t.tagName==="script"||t.tagName==="style"||t.tagName==="template"))}function Kc(e,t,n){let r=Jr(n,t),i=Y(e,-1,!0);return n&&r&&r.type==="element"&&r.tagName==="colgroup"&&qt(r,n.children.indexOf(r),n)?!1:i&&i.type==="element"&&i.tagName==="col"}function Qc(e,t,n){let r=Jr(n,t),i=Y(e,-1);return n&&r&&r.type==="element"&&(r.tagName==="thead"||r.tagName==="tbody")&&qt(r,n.children.indexOf(r),n)?!1:i&&i.type==="element"&&i.tagName==="tr"}var zn={name:[[`	
\f\r &/=>`.split(""),`	
\f\r "&'/=>\``.split("")],[`\0	
\f\r "&'/<=>`.split(""),`\0	
\f\r "&'/<=>\``.split("")]],unquoted:[[`	
\f\r &>`.split(""),`\0	
\f\r "&'<=>\``.split("")],[`\0	
\f\r "&'<=>\``.split(""),`\0	
\f\r "&'<=>\``.split("")]],single:[["&'".split(""),"\"&'`".split("")],["\0&'".split(""),"\0\"&'`".split("")]],double:[['"&'.split(""),"\"&'`".split("")],['\0"&'.split(""),"\0\"&'`".split("")]]};function da(e,t,n,r){let i=r.schema,o=i.space==="svg"?!1:r.settings.omitOptionalTags,l=i.space==="svg"?r.settings.closeEmptyElements:r.settings.voids.includes(e.tagName.toLowerCase()),s=[],a;i.space==="html"&&e.tagName==="svg"&&(r.schema=Fn);let c=Yc(r,e.properties),u=r.all(i.space==="html"&&e.tagName==="template"?e.content:e);return r.schema=i,u&&(l=!1),(c||!o||!fa(e,t,n))&&(s.push("<",e.tagName,c?" "+c:""),l&&(i.space==="svg"||r.settings.closeSelfClosing)&&(a=c.charAt(c.length-1),(!r.settings.tightSelfClosing||a==="/"||a&&a!=='"'&&a!=="'")&&s.push(" "),s.push("/")),s.push(">")),s.push(u),!l&&(!o||!qt(e,t,n))&&s.push("</"+e.tagName+">"),s.join("")}function Yc(e,t){let n=[],r=-1,i;if(t){for(i in t)if(t[i]!==void 0&&t[i]!==null){let o=Gc(e,i,t[i]);o&&n.push(o)}}for(;++r<n.length;){let o=e.settings.tightAttributes?n[r].charAt(n[r].length-1):null;r!==n.length-1&&o!=='"'&&o!=="'"&&(n[r]+=" ")}return n.join("")}function Gc(e,t,n){let r=Zr(e.schema,t),i=e.settings.allowParseErrors&&e.schema.space==="html"?0:1,o=e.settings.allowDangerousCharacters?0:1,l=e.quote,s;if(r.overloadedBoolean&&(n===r.attribute||n==="")?n=!0:(r.boolean||r.overloadedBoolean&&typeof n!="string")&&(n=!!n),n==null||n===!1||typeof n=="number"&&Number.isNaN(n))return"";let a=Oe(r.attribute,Object.assign({},e.settings.characterReferences,{subset:zn.name[i][o]}));return n===!0||(n=Array.isArray(n)?(r.commaSeparated?ua:ca)(n,{padLeft:!e.settings.tightCommaSeparatedLists}):String(n),e.settings.collapseEmptyAttributes&&!n)?a:(e.settings.preferUnquoted&&(s=Oe(n,Object.assign({},e.settings.characterReferences,{subset:zn.unquoted[i][o],attribute:!0}))),s!==n&&(e.settings.quoteSmart&&yt(n,l)>yt(n,e.alternative)&&(l=e.alternative),s=l+Oe(n,Object.assign({},e.settings.characterReferences,{subset:(l==="'"?zn.single:zn.double)[i][o],attribute:!0}))+l),a+(s&&"="+s))}function $n(e,t,n,r){return n&&n.type==="element"&&(n.tagName==="script"||n.tagName==="style")?e.value:Oe(e.value,Object.assign({},r.settings.characterReferences,{subset:["<","&"]}))}function ga(e,t,n,r){return r.settings.allowDangerousHtml?e.value:$n(e,t,n,r)}function xa(e,t,n,r){return r.all(e)}var ya=Xl("type",{invalid:Zc,unknown:Xc,handlers:{comment:aa,doctype:sa,element:da,raw:ga,root:xa,text:$n}});function Zc(e){throw new Error("Expected node, not `"+e+"`")}function Xc(e){throw new Error("Cannot compile unknown node `"+e.type+"`")}function ti(e,t){let n=t||{},r=n.quote||'"',i=r==='"'?"'":'"';if(r!=='"'&&r!=="'")throw new Error("Invalid quote `"+r+"`, expected `'` or `\"`");return{one:Jc,all:ep,settings:{omitOptionalTags:n.omitOptionalTags||!1,allowParseErrors:n.allowParseErrors||!1,allowDangerousCharacters:n.allowDangerousCharacters||!1,quoteSmart:n.quoteSmart||!1,preferUnquoted:n.preferUnquoted||!1,tightAttributes:n.tightAttributes||!1,upperDoctype:n.upperDoctype||!1,tightDoctype:n.tightDoctype||!1,bogusComments:n.bogusComments||!1,tightCommaSeparatedLists:n.tightCommaSeparatedLists||!1,tightSelfClosing:n.tightSelfClosing||!1,collapseEmptyAttributes:n.collapseEmptyAttributes||!1,allowDangerousHtml:n.allowDangerousHtml||!1,voids:n.voids||Gl,characterReferences:n.characterReferences||n.entities||{},closeSelfClosing:n.closeSelfClosing||!1,closeEmptyElements:n.closeEmptyElements||!1},schema:n.space==="svg"?Fn:Yl,quote:r,alternative:i}.one(Array.isArray(e)?{type:"root",children:e}:e,void 0,void 0)}function Jc(e,t,n){return ya(e,t,n,this)}function ep(e){let t=[],n=e&&e.children||[],r=-1;for(;++r<n.length;)t[r]=this.one(n[r],r,e);return t.join("")}function Nn(e){let t=this.data("settings"),n=Object.assign({},t,e);Object.assign(this,{Compiler:r});function r(i){return ti(i,n)}}var tp={tokenize:op,partial:!0},wa={tokenize:lp,partial:!0},ka={tokenize:ap,partial:!0},wt={tokenize:up,partial:!0},Sa={tokenize:sp,partial:!0},Aa={tokenize:rp,previous:Ea},Ca={tokenize:ip,previous:ii},Ie={tokenize:np,previous:_a},Ae={},ni={text:Ae},ot=48;for(;ot<123;)Ae[ot]=Ie,ot++,ot===58?ot=65:ot===91&&(ot=97);Ae[43]=Ie;Ae[45]=Ie;Ae[46]=Ie;Ae[95]=Ie;Ae[72]=[Ie,Ca];Ae[104]=[Ie,Ca];Ae[87]=[Ie,Aa];Ae[119]=[Ie,Aa];function np(e,t,n){let r=this,i,o;return l;function l(f){return!ba(f)||!_a(r.previous)||oi(r.events)?n(f):(e.enter("literalAutolink"),e.enter("literalAutolinkEmail"),s(f))}function s(f){return ba(f)?(e.consume(f),s):f===64?(e.consume(f),a):n(f)}function a(f){return f===46?e.check(wt,m,c)(f):f===45||f===95?e.check(wt,n,u)(f):J(f)?(!o&&Ze(f)&&(o=!0),e.consume(f),a):m(f)}function c(f){return e.consume(f),i=!0,o=void 0,a}function u(f){return e.consume(f),p}function p(f){return f===46?e.check(wt,n,c)(f):a(f)}function m(f){return i&&!o?(e.exit("literalAutolinkEmail"),e.exit("literalAutolink"),t(f)):n(f)}}function rp(e,t,n){let r=this;return i;function i(l){return l!==87&&l!==119||!Ea(r.previous)||oi(r.events)?n(l):(e.enter("literalAutolink"),e.enter("literalAutolinkWww"),e.check(tp,e.attempt(wa,e.attempt(ka,o),n),n)(l))}function o(l){return e.exit("literalAutolinkWww"),e.exit("literalAutolink"),t(l)}}function ip(e,t,n){let r=this;return i;function i(h){return h!==72&&h!==104||!ii(r.previous)||oi(r.events)?n(h):(e.enter("literalAutolink"),e.enter("literalAutolinkHttp"),e.consume(h),o)}function o(h){return h===84||h===116?(e.consume(h),l):n(h)}function l(h){return h===84||h===116?(e.consume(h),s):n(h)}function s(h){return h===80||h===112?(e.consume(h),a):n(h)}function a(h){return h===83||h===115?(e.consume(h),c):c(h)}function c(h){return h===58?(e.consume(h),u):n(h)}function u(h){return h===47?(e.consume(h),p):n(h)}function p(h){return h===47?(e.consume(h),m):n(h)}function m(h){return h===null||Re(h)||Xe(h)||Je(h)?n(h):e.attempt(wa,e.attempt(ka,f),n)(h)}function f(h){return e.exit("literalAutolinkHttp"),e.exit("literalAutolink"),t(h)}}function op(e,t,n){return r;function r(a){return e.consume(a),i}function i(a){return a===87||a===119?(e.consume(a),o):n(a)}function o(a){return a===87||a===119?(e.consume(a),l):n(a)}function l(a){return a===46?(e.consume(a),s):n(a)}function s(a){return a===null||E(a)?n(a):t(a)}}function lp(e,t,n){let r,i;return o;function o(a){return a===38?e.check(Sa,s,l)(a):a===46||a===95?e.check(wt,s,l)(a):a===null||Re(a)||Xe(a)||a!==45&&Je(a)?s(a):(e.consume(a),o)}function l(a){return a===46?(i=r,r=void 0,e.consume(a),o):(a===95&&(r=!0),e.consume(a),o)}function s(a){return!i&&!r?t(a):n(a)}}function ap(e,t){let n=0;return r;function r(l){return l===38?e.check(Sa,t,i)(l):(l===40&&n++,l===41?e.check(wt,o,i)(l):ri(l)?t(l):va(l)?e.check(wt,t,i)(l):(e.consume(l),r))}function i(l){return e.consume(l),r}function o(l){return n--,n<0?t(l):i(l)}}function sp(e,t,n){return r;function r(l){return e.consume(l),i}function i(l){return se(l)?(e.consume(l),i):l===59?(e.consume(l),o):n(l)}function o(l){return ri(l)?t(l):n(l)}}function up(e,t,n){return r;function r(o){return e.consume(o),i}function i(o){return va(o)?(e.consume(o),i):ri(o)?t(o):n(o)}}function va(e){return e===33||e===34||e===39||e===41||e===42||e===44||e===46||e===58||e===59||e===60||e===63||e===95||e===126}function ri(e){return e===null||e===60||B(e)}function ba(e){return e===43||e===45||e===46||e===95||J(e)}function Ea(e){return e===null||e===40||e===42||e===95||e===126||B(e)}function ii(e){return e===null||!se(e)}function _a(e){return e!==47&&ii(e)}function oi(e){let t=e.length,n=!1;for(;t--;){let r=e[t][1];if((r.type==="labelLink"||r.type==="labelImage")&&!r._balanced){n=!0;break}if(r._gfmAutolinkLiteralWalkedInto){n=!1;break}}return e.length>0&&!n&&(e[e.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),n}var cp={tokenize:xp,partial:!0};function li(){return{document:{[91]:{tokenize:fp,continuation:{tokenize:dp},exit:gp}},text:{[91]:{tokenize:mp},[93]:{add:"after",tokenize:pp,resolveTo:hp}}}}function pp(e,t,n){let r=this,i=r.events.length,o=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),l;for(;i--;){let a=r.events[i][1];if(a.type==="labelImage"){l=a;break}if(a.type==="gfmFootnoteCall"||a.type==="labelLink"||a.type==="label"||a.type==="image"||a.type==="link")break}return s;function s(a){if(!l||!l._balanced)return n(a);let c=ue(r.sliceSerialize({start:l.end,end:r.now()}));return c.codePointAt(0)!==94||!o.includes(c.slice(1))?n(a):(e.enter("gfmFootnoteCallLabelMarker"),e.consume(a),e.exit("gfmFootnoteCallLabelMarker"),t(a))}}function hp(e,t){let n=e.length,r;for(;n--;)if(e[n][1].type==="labelImage"&&e[n][0]==="enter"){r=e[n][1];break}e[n+1][1].type="data",e[n+3][1].type="gfmFootnoteCallLabelMarker";let i={type:"gfmFootnoteCall",start:Object.assign({},e[n+3][1].start),end:Object.assign({},e[e.length-1][1].end)},o={type:"gfmFootnoteCallMarker",start:Object.assign({},e[n+3][1].end),end:Object.assign({},e[n+3][1].end)};o.end.column++,o.end.offset++,o.end._bufferIndex++;let l={type:"gfmFootnoteCallString",start:Object.assign({},o.end),end:Object.assign({},e[e.length-1][1].start)},s={type:"chunkString",contentType:"string",start:Object.assign({},l.start),end:Object.assign({},l.end)},a=[e[n+1],e[n+2],["enter",i,t],e[n+3],e[n+4],["enter",o,t],["exit",o,t],["enter",l,t],["enter",s,t],["exit",s,t],["exit",l,t],e[e.length-2],e[e.length-1],["exit",i,t]];return e.splice(n,e.length-n+1,...a),e}function mp(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o=0,l;return s;function s(p){return e.enter("gfmFootnoteCall"),e.enter("gfmFootnoteCallLabelMarker"),e.consume(p),e.exit("gfmFootnoteCallLabelMarker"),a}function a(p){return p!==94?n(p):(e.enter("gfmFootnoteCallMarker"),e.consume(p),e.exit("gfmFootnoteCallMarker"),e.enter("gfmFootnoteCallString"),e.enter("chunkString").contentType="string",c)}function c(p){if(o>999||p===93&&!l||p===null||p===91||B(p))return n(p);if(p===93){e.exit("chunkString");let m=e.exit("gfmFootnoteCallString");return i.includes(ue(r.sliceSerialize(m)))?(e.enter("gfmFootnoteCallLabelMarker"),e.consume(p),e.exit("gfmFootnoteCallLabelMarker"),e.exit("gfmFootnoteCall"),t):n(p)}return B(p)||(l=!0),o++,e.consume(p),p===92?u:c}function u(p){return p===91||p===92||p===93?(e.consume(p),o++,c):c(p)}}function fp(e,t,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o,l=0,s;return a;function a(h){return e.enter("gfmFootnoteDefinition")._container=!0,e.enter("gfmFootnoteDefinitionLabel"),e.enter("gfmFootnoteDefinitionLabelMarker"),e.consume(h),e.exit("gfmFootnoteDefinitionLabelMarker"),c}function c(h){return h===94?(e.enter("gfmFootnoteDefinitionMarker"),e.consume(h),e.exit("gfmFootnoteDefinitionMarker"),e.enter("gfmFootnoteDefinitionLabelString"),e.enter("chunkString").contentType="string",u):n(h)}function u(h){if(l>999||h===93&&!s||h===null||h===91||B(h))return n(h);if(h===93){e.exit("chunkString");let b=e.exit("gfmFootnoteDefinitionLabelString");return o=ue(r.sliceSerialize(b)),e.enter("gfmFootnoteDefinitionLabelMarker"),e.consume(h),e.exit("gfmFootnoteDefinitionLabelMarker"),e.exit("gfmFootnoteDefinitionLabel"),m}return B(h)||(s=!0),l++,e.consume(h),h===92?p:u}function p(h){return h===91||h===92||h===93?(e.consume(h),l++,u):u(h)}function m(h){return h===58?(e.enter("definitionMarker"),e.consume(h),e.exit("definitionMarker"),i.includes(o)||i.push(o),F(e,f,"gfmFootnoteDefinitionWhitespace")):n(h)}function f(h){return t(h)}}function dp(e,t,n){return e.check(ke,t,e.attempt(cp,t,n))}function gp(e){e.exit("gfmFootnoteDefinition")}function xp(e,t,n){let r=this;return F(e,i,"gfmFootnoteDefinitionIndent",4+1);function i(o){let l=r.events[r.events.length-1];return l&&l[1].type==="gfmFootnoteDefinitionIndent"&&l[2].sliceSerialize(l[1],!0).length===4?t(o):n(o)}}function ai(e){let n=(e||{}).singleTilde,r={tokenize:o,resolveAll:i};return n==null&&(n=!0),{text:{[126]:r},insideSpan:{null:[r]},attentionMarkers:{null:[126]}};function i(l,s){let a=-1;for(;++a<l.length;)if(l[a][0]==="enter"&&l[a][1].type==="strikethroughSequenceTemporary"&&l[a][1]._close){let c=a;for(;c--;)if(l[c][0]==="exit"&&l[c][1].type==="strikethroughSequenceTemporary"&&l[c][1]._open&&l[a][1].end.offset-l[a][1].start.offset===l[c][1].end.offset-l[c][1].start.offset){l[a][1].type="strikethroughSequence",l[c][1].type="strikethroughSequence";let u={type:"strikethrough",start:Object.assign({},l[c][1].start),end:Object.assign({},l[a][1].end)},p={type:"strikethroughText",start:Object.assign({},l[c][1].end),end:Object.assign({},l[a][1].start)},m=[["enter",u,s],["enter",l[c][1],s],["exit",l[c][1],s],["enter",p,s]],f=s.parser.constructs.insideSpan.null;f&&X(m,m.length,0,Be(f,l.slice(c+1,a),s)),X(m,m.length,0,[["exit",p,s],["enter",l[a][1],s],["exit",l[a][1],s],["exit",u,s]]),X(l,c-1,a-c+3,m),a=c+m.length-2;break}}for(a=-1;++a<l.length;)l[a][1].type==="strikethroughSequenceTemporary"&&(l[a][1].type="data");return l}function o(l,s,a){let c=this.previous,u=this.events,p=0;return m;function m(h){return c===126&&u[u.length-1][1].type!=="characterEscape"?a(h):(l.enter("strikethroughSequenceTemporary"),f(h))}function f(h){let b=mt(c);if(h===126)return p>1?a(h):(l.consume(h),p++,f);if(p<2&&!n)return a(h);let S=l.exit("strikethroughSequenceTemporary"),x=mt(h);return S._open=!x||x===2&&!!b,S._close=!b||b===2&&!!x,s(h)}}}var si={flow:{null:{tokenize:bp,resolve:yp}}},Ta={tokenize:wp,partial:!0};function yp(e,t){let n=-1,r,i,o,l,s,a,c;for(;++n<e.length;){let u=e[n][1];if(o&&(u.type==="temporaryTableCellContent"&&(l=l||n,s=n),(u.type==="tableCellDivider"||u.type==="tableRow")&&s)){let p={type:"tableContent",start:e[l][1].start,end:e[s][1].end},m={type:"chunkText",start:p.start,end:p.end,contentType:"text"};e.splice(l,s-l+1,["enter",p,t],["enter",m,t],["exit",m,t],["exit",p,t]),n-=s-l-3,l=void 0,s=void 0}if(e[n][0]==="exit"&&a!==void 0&&a+(c?0:1)<n&&(u.type==="tableCellDivider"||u.type==="tableRow"&&(a+3<n||e[a][1].type!=="whitespace"))){let p={type:i?"tableDelimiter":r?"tableHeader":"tableData",start:e[a][1].start,end:e[n][1].end};e.splice(n+(u.type==="tableCellDivider"?1:0),0,["exit",p,t]),e.splice(a,0,["enter",p,t]),n+=2,a=n+1,c=!0}u.type==="tableRow"&&(o=e[n][0]==="enter",o&&(a=n+1,c=!1)),u.type==="tableDelimiterRow"&&(i=e[n][0]==="enter",i&&(a=n+1,c=!1)),u.type==="tableHead"&&(r=e[n][0]==="enter")}return e}function bp(e,t,n){let r=this,i=[],o=0,l,s;return a;function a(y){return e.enter("table")._align=i,e.enter("tableHead"),e.enter("tableRow"),y===124?c(y):(o++,e.enter("temporaryTableCellContent"),m(y))}function c(y){return e.enter("tableCellDivider"),e.consume(y),e.exit("tableCellDivider"),l=!0,u}function u(y){return y===null||E(y)?h(y):N(y)?(e.enter("whitespace"),e.consume(y),p):(l&&(l=void 0,o++),y===124?c(y):(e.enter("temporaryTableCellContent"),m(y)))}function p(y){return N(y)?(e.consume(y),p):(e.exit("whitespace"),u(y))}function m(y){return y===null||y===124||B(y)?(e.exit("temporaryTableCellContent"),u(y)):(e.consume(y),y===92?f:m)}function f(y){return y===92||y===124?(e.consume(y),m):m(y)}function h(y){if(y===null)return n(y);e.exit("tableRow"),e.exit("tableHead");let le=r.interrupt;return r.interrupt=!0,e.attempt({tokenize:G,partial:!0},function(V){return r.interrupt=le,e.enter("tableDelimiterRow"),b(V)},function(V){return r.interrupt=le,n(V)})(y)}function b(y){return y===null||E(y)?P(y):N(y)?(e.enter("whitespace"),e.consume(y),S):y===45?(e.enter("tableDelimiterFiller"),e.consume(y),s=!0,i.push("none"),x):y===58?(e.enter("tableDelimiterAlignment"),e.consume(y),e.exit("tableDelimiterAlignment"),i.push("left"),_):y===124?(e.enter("tableCellDivider"),e.consume(y),e.exit("tableCellDivider"),b):n(y)}function S(y){return N(y)?(e.consume(y),S):(e.exit("whitespace"),b(y))}function x(y){return y===45?(e.consume(y),x):(e.exit("tableDelimiterFiller"),y===58?(e.enter("tableDelimiterAlignment"),e.consume(y),e.exit("tableDelimiterAlignment"),i[i.length-1]=i[i.length-1]==="left"?"center":"right",C):b(y))}function _(y){return y===45?(e.enter("tableDelimiterFiller"),e.consume(y),s=!0,x):n(y)}function C(y){return y===null||E(y)?P(y):N(y)?(e.enter("whitespace"),e.consume(y),S):y===124?(e.enter("tableCellDivider"),e.consume(y),e.exit("tableCellDivider"),b):n(y)}function P(y){return e.exit("tableDelimiterRow"),!s||o!==i.length?n(y):y===null?D(y):e.check(Ta,D,e.attempt({tokenize:G,partial:!0},F(e,k,"linePrefix",4),D))(y)}function D(y){return e.exit("table"),t(y)}function k(y){return e.enter("tableBody"),L(y)}function L(y){return e.enter("tableRow"),y===124?$(y):(e.enter("temporaryTableCellContent"),I(y))}function $(y){return e.enter("tableCellDivider"),e.consume(y),e.exit("tableCellDivider"),R}function R(y){return y===null||E(y)?T(y):N(y)?(e.enter("whitespace"),e.consume(y),ee):y===124?$(y):(e.enter("temporaryTableCellContent"),I(y))}function ee(y){return N(y)?(e.consume(y),ee):(e.exit("whitespace"),R(y))}function I(y){return y===null||y===124||B(y)?(e.exit("temporaryTableCellContent"),R(y)):(e.consume(y),y===92?H:I)}function H(y){return y===92||y===124?(e.consume(y),I):I(y)}function T(y){return e.exit("tableRow"),y===null?M(y):e.check(Ta,M,e.attempt({tokenize:G,partial:!0},F(e,L,"linePrefix",4),M))(y)}function M(y){return e.exit("tableBody"),D(y)}function G(y,le,V){return re;function re(d){return y.enter("lineEnding"),y.consume(d),y.exit("lineEnding"),F(y,K,"linePrefix")}function K(d){if(r.parser.lazy[r.now().line]||d===null||E(d))return V(d);let g=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes("codeIndented")&&g&&g[1].type==="linePrefix"&&g[2].sliceSerialize(g[1],!0).length>=4?V(d):(r._gfmTableDynamicInterruptHack=!0,y.check(r.parser.constructs.flow,function(Ce){return r._gfmTableDynamicInterruptHack=!1,V(Ce)},function(Ce){return r._gfmTableDynamicInterruptHack=!1,le(Ce)})(d))}}}function wp(e,t,n){let r=0;return i;function i(l){return e.enter("check"),e.consume(l),o}function o(l){return l===-1||l===32?(e.consume(l),r++,r===4?t:o):l===null||B(l)?t(l):n(l)}}var kp={tokenize:Sp},ui={text:{[91]:kp}};function Sp(e,t,n){let r=this;return i;function i(a){return r.previous!==null||!r._gfmTasklistFirstContentOfListItem?n(a):(e.enter("taskListCheck"),e.enter("taskListCheckMarker"),e.consume(a),e.exit("taskListCheckMarker"),o)}function o(a){return B(a)?(e.enter("taskListCheckValueUnchecked"),e.consume(a),e.exit("taskListCheckValueUnchecked"),l):a===88||a===120?(e.enter("taskListCheckValueChecked"),e.consume(a),e.exit("taskListCheckValueChecked"),l):n(a)}function l(a){return a===93?(e.enter("taskListCheckMarker"),e.consume(a),e.exit("taskListCheckMarker"),e.exit("taskListCheck"),s):n(a)}function s(a){return E(a)?t(a):N(a)?e.check({tokenize:Ap},t,n)(a):n(a)}}function Ap(e,t,n){return F(e,r,"whitespace");function r(i){return i===null?n(i):t(i)}}function La(e){return cn([ni,li(),ai(e),si,ui])}function ci(e){if(typeof e!="string")throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}var Cp={}.hasOwnProperty,pi=function(e,t,n,r){let i,o;typeof t=="string"||t instanceof RegExp?(o=[[t,n]],i=r):(o=t,i=n),i||(i={});let l=xt(i.ignore||[]),s=vp(o),a=-1;for(;++a<s.length;)Mt(e,"text",c);return e;function c(p,m){let f=-1,h;for(;++f<m.length;){let b=m[f];if(l(b,h?h.children.indexOf(b):void 0,h))return;h=b}if(h)return u(p,m)}function u(p,m){let f=m[m.length-1],h=s[a][0],b=s[a][1],S=0,x=f.children.indexOf(p),_=!1,C=[];h.lastIndex=0;let P=h.exec(p.value);for(;P;){let D=P.index,k={index:P.index,input:P.input,stack:[...m,p]},L=b(...P,k);if(typeof L=="string"&&(L=L.length>0?{type:"text",value:L}:void 0),L!==!1&&(S!==D&&C.push({type:"text",value:p.value.slice(S,D)}),Array.isArray(L)?C.push(...L):L&&C.push(L),S=D+P[0].length,_=!0),!h.global)break;P=h.exec(p.value)}return _?(S<p.value.length&&C.push({type:"text",value:p.value.slice(S)}),f.children.splice(x,1,...C)):C=[p],x+C.length}};function vp(e){let t=[];if(typeof e!="object")throw new TypeError("Expected array or object as schema");if(Array.isArray(e)){let n=-1;for(;++n<e.length;)t.push([Pa(e[n][0]),Fa(e[n][1])])}else{let n;for(n in e)Cp.call(e,n)&&t.push([Pa(n),Fa(e[n])])}return t}function Pa(e){return typeof e=="string"?new RegExp(ci(e),"g"):e}function Fa(e){return typeof e=="function"?e:()=>e}var hi="phrasing",mi=["autolink","link","image","label"],di={transforms:[Fp],enter:{literalAutolink:Ep,literalAutolinkEmail:fi,literalAutolinkHttp:fi,literalAutolinkWww:fi},exit:{literalAutolink:Pp,literalAutolinkEmail:Lp,literalAutolinkHttp:_p,literalAutolinkWww:Tp}},gi={unsafe:[{character:"@",before:"[+\\-.\\w]",after:"[\\-.\\w]",inConstruct:hi,notInConstruct:mi},{character:".",before:"[Ww]",after:"[\\-.\\w]",inConstruct:hi,notInConstruct:mi},{character:":",before:"[ps]",after:"\\/",inConstruct:hi,notInConstruct:mi}]};function Ep(e){this.enter({type:"link",title:null,url:"",children:[]},e)}function fi(e){this.config.enter.autolinkProtocol.call(this,e)}function _p(e){this.config.exit.autolinkProtocol.call(this,e)}function Tp(e){this.config.exit.data.call(this,e);let t=this.stack[this.stack.length-1];t.url="http://"+this.sliceSerialize(e)}function Lp(e){this.config.exit.autolinkEmail.call(this,e)}function Pp(e){this.exit(e)}function Fp(e){pi(e,[[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi,Dp],[/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g,Op]],{ignore:["link","linkReference"]})}function Dp(e,t,n,r,i){let o="";if(!Da(i)||(/^w/i.test(t)&&(n=t+n,t="",o="http://"),!Ip(n)))return!1;let l=zp(n+r);if(!l[0])return!1;let s={type:"link",title:null,url:o+t+l[0],children:[{type:"text",value:t+l[0]}]};return l[1]?[s,{type:"text",value:l[1]}]:s}function Op(e,t,n,r){return!Da(r,!0)||/[-\d_]$/.test(n)?!1:{type:"link",title:null,url:"mailto:"+t+"@"+n,children:[{type:"text",value:t+"@"+n}]}}function Ip(e){let t=e.split(".");return!(t.length<2||t[t.length-1]&&(/_/.test(t[t.length-1])||!/[a-zA-Z\d]/.test(t[t.length-1]))||t[t.length-2]&&(/_/.test(t[t.length-2])||!/[a-zA-Z\d]/.test(t[t.length-2])))}function zp(e){let t=/[!"&'),.:;<>?\]}]+$/.exec(e);if(!t)return[e,void 0];e=e.slice(0,t.index);let n=t[0],r=n.indexOf(")"),i=yt(e,"("),o=yt(e,")");for(;r!==-1&&i>o;)e+=n.slice(0,r+1),n=n.slice(r+1),r=n.indexOf(")"),o++;return[e,n]}function Da(e,t){let n=e.input.charCodeAt(e.index-1);return(e.index===0||Xe(n)||Je(n))&&(!t||n!==47)}function xi(e){return e.label||!e.identifier?e.label||"":kn(e.identifier)}function Oa(e,t,n){let r=t.indexStack,i=e.children||[],o=t.createTracker(n),l=[],s=-1;for(r.push(-1);++s<i.length;){let a=i[s];r[r.length-1]=s,l.push(o.move(t.handle(a,e,t,{before:`
`,after:`
`,...o.current()}))),a.type!=="list"&&(t.bulletLastUsed=void 0),s<i.length-1&&l.push(o.move($p(a,i[s+1],e,t)))}return r.pop(),l.join("")}function $p(e,t,n,r){let i=r.join.length;for(;i--;){let o=r.join[i](e,t,n,r);if(o===!0||o===1)break;if(typeof o=="number")return`
`.repeat(1+o);if(o===!1)return`

<!---->

`}return`

`}var Np=/\r?\n|\r/g;function Ia(e,t){let n=[],r=0,i=0,o;for(;o=Np.exec(e);)l(e.slice(r,o.index)),n.push(o[0]),r=o.index+o[0].length,i++;return l(e.slice(r)),n.join("");function l(s){n.push(t(s,i,!s))}}function Rn(e){if(!e._compiled){let t=(e.atBreak?"[\\r\\n][\\t ]*":"")+(e.before?"(?:"+e.before+")":"");e._compiled=new RegExp((t?"("+t+")":"")+(/[|\\{}()[\]^$+*?.-]/.test(e.character)?"\\":"")+e.character+(e.after?"(?:"+e.after+")":""),"g")}return e._compiled}function $a(e,t){return za(e,t.inConstruct,!0)&&!za(e,t.notInConstruct,!1)}function za(e,t,n){if(typeof t=="string"&&(t=[t]),!t||t.length===0)return n;let r=-1;for(;++r<t.length;)if(e.includes(t[r]))return!0;return!1}function yi(e,t,n){let r=(n.before||"")+(t||"")+(n.after||""),i=[],o=[],l={},s=-1;for(;++s<e.unsafe.length;){let u=e.unsafe[s];if(!$a(e.stack,u))continue;let p=Rn(u),m;for(;m=p.exec(r);){let f="before"in u||!!u.atBreak,h="after"in u,b=m.index+(f?m[1].length:0);i.includes(b)?(l[b].before&&!f&&(l[b].before=!1),l[b].after&&!h&&(l[b].after=!1)):(i.push(b),l[b]={before:f,after:h})}}i.sort(Rp);let a=n.before?n.before.length:0,c=r.length-(n.after?n.after.length:0);for(s=-1;++s<i.length;){let u=i[s];u<a||u>=c||u+1<c&&i[s+1]===u+1&&l[u].after&&!l[u+1].before&&!l[u+1].after||i[s-1]===u-1&&l[u].before&&!l[u-1].before&&!l[u-1].after||(a!==u&&o.push(Na(r.slice(a,u),"\\")),a=u,/[!-/:-@[-`{-~]/.test(r.charAt(u))&&(!n.encode||!n.encode.includes(r.charAt(u)))?o.push("\\"):(o.push("&#x"+r.charCodeAt(u).toString(16).toUpperCase()+";"),a++))}return o.push(Na(r.slice(a,c),n.after)),o.join("")}function Rp(e,t){return e-t}function Na(e,t){let n=/\\(?=[!-/:-@[-`{-~])/g,r=[],i=[],o=e+t,l=-1,s=0,a;for(;a=n.exec(o);)r.push(a.index);for(;++l<r.length;)s!==r[l]&&i.push(e.slice(s,r[l])),i.push("\\"),s=r[l];return i.push(e.slice(s)),i.join("")}function lt(e){let t=e||{},n=t.now||{},r=t.lineShift||0,i=n.line||1,o=n.column||1;return{move:a,current:l,shift:s};function l(){return{now:{line:i,column:o},lineShift:r}}function s(c){r+=c}function a(c){let u=c||"",p=u.split(/\r?\n|\r/g),m=p[p.length-1];return i+=p.length-1,o=p.length===1?o+m.length:1+m.length+r,u}}Ra.peek=Kp;function bi(){return{enter:{gfmFootnoteDefinition:Mp,gfmFootnoteDefinitionLabelString:Bp,gfmFootnoteCall:jp,gfmFootnoteCallString:qp},exit:{gfmFootnoteDefinition:Up,gfmFootnoteDefinitionLabelString:Hp,gfmFootnoteCall:Wp,gfmFootnoteCallString:Vp}}}function wi(){return{unsafe:[{character:"[",inConstruct:["phrasing","label","reference"]}],handlers:{footnoteDefinition:Qp,footnoteReference:Ra}}}function Mp(e){this.enter({type:"footnoteDefinition",identifier:"",label:"",children:[]},e)}function Bp(){this.buffer()}function Hp(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ue(this.sliceSerialize(e)).toLowerCase()}function Up(e){this.exit(e)}function jp(e){this.enter({type:"footnoteReference",identifier:"",label:""},e)}function qp(){this.buffer()}function Vp(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ue(this.sliceSerialize(e)).toLowerCase()}function Wp(e){this.exit(e)}function Ra(e,t,n,r){let i=lt(r),o=i.move("[^"),l=n.enter("footnoteReference"),s=n.enter("reference");return o+=i.move(yi(n,xi(e),{...i.current(),before:o,after:"]"})),s(),l(),o+=i.move("]"),o}function Kp(){return"["}function Qp(e,t,n,r){let i=lt(r),o=i.move("[^"),l=n.enter("footnoteDefinition"),s=n.enter("label");return o+=i.move(yi(n,xi(e),{...i.current(),before:o,after:"]"})),s(),o+=i.move("]:"+(e.children&&e.children.length>0?" ":"")),i.shift(4),o+=i.move(Ia(Oa(e,n,i.current()),Yp)),l(),o}function Yp(e,t,n){return t===0?e:(n?"":"    ")+e}function Mn(e,t,n){let r=t.indexStack,i=e.children||[],o=[],l=-1,s=n.before;r.push(-1);let a=t.createTracker(n);for(;++l<i.length;){let c=i[l],u;if(r[r.length-1]=l,l+1<i.length){let p=t.handle.handlers[i[l+1].type];p&&p.peek&&(p=p.peek),u=p?p(i[l+1],e,t,{before:"",after:"",...a.current()}).charAt(0):""}else u=n.after;o.length>0&&(s==="\r"||s===`
`)&&c.type==="html"&&(o[o.length-1]=o[o.length-1].replace(/(\r?\n|\r)$/," "),s=" ",a=t.createTracker(n),a.move(o.join(""))),o.push(a.move(t.handle(c,e,t,{...a.current(),before:s,after:u}))),s=o[o.length-1].slice(-1)}return r.pop(),o.join("")}var Gp=["autolink","destinationLiteral","destinationRaw","reference","titleQuote","titleApostrophe"];Ma.peek=Jp;var ki={canContainEols:["delete"],enter:{strikethrough:Zp},exit:{strikethrough:Xp}},Si={unsafe:[{character:"~",inConstruct:"phrasing",notInConstruct:Gp}],handlers:{delete:Ma}};function Zp(e){this.enter({type:"delete",children:[]},e)}function Xp(e){this.exit(e)}function Ma(e,t,n,r){let i=lt(r),o=n.enter("strikethrough"),l=i.move("~~");return l+=Mn(e,n,{...i.current(),before:l,after:"~"}),l+=i.move("~~"),o(),l}function Jp(){return"~"}Ai.peek=eh;function Ai(e,t,n){let r=e.value||"",i="`",o=-1;for(;new RegExp("(^|[^`])"+i+"([^`]|$)").test(r);)i+="`";for(/[^ \r\n]/.test(r)&&(/^[ \r\n]/.test(r)&&/[ \r\n]$/.test(r)||/^`|`$/.test(r))&&(r=" "+r+" ");++o<n.unsafe.length;){let l=n.unsafe[o],s=Rn(l),a;if(l.atBreak)for(;a=s.exec(r);){let c=a.index;r.charCodeAt(c)===10&&r.charCodeAt(c-1)===13&&c--,r=r.slice(0,c)+" "+r.slice(a.index+1)}}return i+r+i}function eh(){return"`"}function Ha(e,t={}){let n=(t.align||[]).concat(),r=t.stringLength||nh,i=[],o=[],l=[],s=[],a=0,c=-1;for(;++c<e.length;){let h=[],b=[],S=-1;for(e[c].length>a&&(a=e[c].length);++S<e[c].length;){let x=th(e[c][S]);if(t.alignDelimiters!==!1){let _=r(x);b[S]=_,(s[S]===void 0||_>s[S])&&(s[S]=_)}h.push(x)}o[c]=h,l[c]=b}let u=-1;if(typeof n=="object"&&"length"in n)for(;++u<a;)i[u]=Ba(n[u]);else{let h=Ba(n);for(;++u<a;)i[u]=h}u=-1;let p=[],m=[];for(;++u<a;){let h=i[u],b="",S="";h===99?(b=":",S=":"):h===108?b=":":h===114&&(S=":");let x=t.alignDelimiters===!1?1:Math.max(1,s[u]-b.length-S.length),_=b+"-".repeat(x)+S;t.alignDelimiters!==!1&&(x=b.length+x+S.length,x>s[u]&&(s[u]=x),m[u]=x),p[u]=_}o.splice(1,0,p),l.splice(1,0,m),c=-1;let f=[];for(;++c<o.length;){let h=o[c],b=l[c];u=-1;let S=[];for(;++u<a;){let x=h[u]||"",_="",C="";if(t.alignDelimiters!==!1){let P=s[u]-(b[u]||0),D=i[u];D===114?_=" ".repeat(P):D===99?P%2?(_=" ".repeat(P/2+.5),C=" ".repeat(P/2-.5)):(_=" ".repeat(P/2),C=_):C=" ".repeat(P)}t.delimiterStart!==!1&&!u&&S.push("|"),t.padding!==!1&&!(t.alignDelimiters===!1&&x==="")&&(t.delimiterStart!==!1||u)&&S.push(" "),t.alignDelimiters!==!1&&S.push(_),S.push(x),t.alignDelimiters!==!1&&S.push(C),t.padding!==!1&&S.push(" "),(t.delimiterEnd!==!1||u!==a-1)&&S.push("|")}f.push(t.delimiterEnd===!1?S.join("").replace(/ +$/,""):S.join(""))}return f.join(`
`)}function th(e){return e==null?"":String(e)}function nh(e){return e.length}function Ba(e){let t=typeof e=="string"?e.codePointAt(0):0;return t===67||t===99?99:t===76||t===108?108:t===82||t===114?114:0}var vi={enter:{table:rh,tableData:Ua,tableHeader:Ua,tableRow:oh},exit:{codeText:lh,table:ih,tableData:Ci,tableHeader:Ci,tableRow:Ci}};function rh(e){let t=e._align;this.enter({type:"table",align:t.map(n=>n==="none"?null:n),children:[]},e),this.setData("inTable",!0)}function ih(e){this.exit(e),this.setData("inTable")}function oh(e){this.enter({type:"tableRow",children:[]},e)}function Ci(e){this.exit(e)}function Ua(e){this.enter({type:"tableCell",children:[]},e)}function lh(e){let t=this.resume();this.getData("inTable")&&(t=t.replace(/\\([\\|])/g,ah));let n=this.stack[this.stack.length-1];n.value=t,this.exit(e)}function ah(e,t){return t==="|"?t:e}function Ei(e){let t=e||{},n=t.tableCellPadding,r=t.tablePipeAlign,i=t.stringLength,o=n?" ":"|";return{unsafe:[{character:"\r",inConstruct:"tableCell"},{character:`
`,inConstruct:"tableCell"},{atBreak:!0,character:"|",after:"[	 :-]"},{character:"|",inConstruct:"tableCell"},{atBreak:!0,character:":",after:"-"},{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{table:l,tableRow:s,tableCell:a,inlineCode:m}};function l(f,h,b,S){return c(u(f,b,S),f.align)}function s(f,h,b,S){let x=p(f,b,S),_=c([x]);return _.slice(0,_.indexOf(`
`))}function a(f,h,b,S){let x=b.enter("tableCell"),_=b.enter("phrasing"),C=Mn(f,b,{...S,before:o,after:o});return _(),x(),C}function c(f,h){return Ha(f,{align:h,alignDelimiters:r,padding:n,stringLength:i})}function u(f,h,b){let S=f.children,x=-1,_=[],C=h.enter("table");for(;++x<S.length;)_[x]=p(S[x],h,b);return C(),_}function p(f,h,b){let S=f.children,x=-1,_=[],C=h.enter("tableRow");for(;++x<S.length;)_[x]=a(S[x],f,h,b);return C(),_}function m(f,h,b){let S=Ai(f,h,b);return b.stack.includes("tableCell")&&(S=S.replace(/\|/g,"\\$&")),S}}function ja(e){let t=e.options.bullet||"*";if(t!=="*"&&t!=="+"&&t!=="-")throw new Error("Cannot serialize items with `"+t+"` for `options.bullet`, expected `*`, `+`, or `-`");return t}function qa(e){let t=e.options.listItemIndent||"tab";if(t===1||t==="1")return"one";if(t!=="tab"&&t!=="one"&&t!=="mixed")throw new Error("Cannot serialize items with `"+t+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return t}function Va(e,t,n,r){let i=qa(n),o=n.bulletCurrent||ja(n);t&&t.type==="list"&&t.ordered&&(o=(typeof t.start=="number"&&t.start>-1?t.start:1)+(n.options.incrementListMarker===!1?0:t.children.indexOf(e))+o);let l=o.length+1;(i==="tab"||i==="mixed"&&(t&&t.type==="list"&&t.spread||e.spread))&&(l=Math.ceil(l/4)*4);let s=n.createTracker(r);s.move(o+" ".repeat(l-o.length)),s.shift(l);let a=n.enter("listItem"),c=n.indentLines(n.containerFlow(e,s.current()),u);return a(),c;function u(p,m,f){return m?(f?"":" ".repeat(l))+p:(f?o:o+" ".repeat(l-o.length))+p}}var _i={exit:{taskListCheckValueChecked:Wa,taskListCheckValueUnchecked:Wa,paragraph:sh}},Ti={unsafe:[{atBreak:!0,character:"-",after:"[:|-]"}],handlers:{listItem:uh}};function Wa(e){let t=this.stack[this.stack.length-2];t.checked=e.type==="taskListCheckValueChecked"}function sh(e){let t=this.stack[this.stack.length-2];if(t&&t.type==="listItem"&&typeof t.checked=="boolean"){let n=this.stack[this.stack.length-1],r=n.children[0];if(r&&r.type==="text"){let i=t.children,o=-1,l;for(;++o<i.length;){let s=i[o];if(s.type==="paragraph"){l=s;break}}l===n&&(r.value=r.value.slice(1),r.value.length===0?n.children.shift():n.position&&r.position&&typeof r.position.start.offset=="number"&&(r.position.start.column++,r.position.start.offset++,n.position.start=Object.assign({},r.position.start)))}}this.exit(e)}function uh(e,t,n,r){let i=e.children[0],o=typeof e.checked=="boolean"&&i&&i.type==="paragraph",l="["+(e.checked?"x":" ")+"] ",s=lt(r);o&&s.move(l);let a=Va(e,t,n,{...r,...s.current()});return o&&(a=a.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/,c)),a;function c(u){return u+l}}function Li(){return[di,bi(),ki,vi,_i]}function Pi(e){return{extensions:[gi,wi(),Si,Ei(e),Ti]}}function Fi(e={}){let t=this.data();n("micromarkExtensions",La(e)),n("fromMarkdownExtensions",Li()),n("toMarkdownExtensions",Pi(e));function n(r,i){(t[r]?t[r]:t[r]=[]).push(i)}}var{I:g0}=io,Ka=e=>e===null||typeof e!="object"&&typeof e!="function";var Qa=e=>e.strings===void 0;var Vt=(e,t)=>{var n,r;let i=e._$AN;if(i===void 0)return!1;for(let o of i)(r=(n=o)._$AO)===null||r===void 0||r.call(n,t,!1),Vt(o,t);return!0},Bn=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while((n==null?void 0:n.size)===0)},Ya=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),hh(t)}};function ch(e){this._$AN!==void 0?(Bn(this),this._$AM=e,Ya(this)):this._$AM=e}function ph(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let o=n;o<r.length;o++)Vt(r[o],!1),Bn(r[o]);else r!=null&&(Vt(r,!1),Bn(r));else Vt(this,e)}var hh=e=>{var t,n,r,i;e.type==Ye.CHILD&&((t=(r=e)._$AP)!==null&&t!==void 0||(r._$AP=ph),(n=(i=e)._$AQ)!==null&&n!==void 0||(i._$AQ=ch))},Hn=class extends Fe{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,r){super._$AT(t,n,r),Ya(this),this.isConnected=t._$AU}_$AO(t,n=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)===null||r===void 0||r.call(this):(i=this.disconnected)===null||i===void 0||i.call(this)),n&&(Vt(this,t),Bn(this))}setValue(t){if(Qa(this._$Ct))this._$Ct._$AI(t,this);else{let n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}};var Un=class{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}},jn=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){var t;(t=this.Y)!==null&&t!==void 0||(this.Y=new Promise(n=>this.Z=n))}resume(){var t;(t=this.Z)===null||t===void 0||t.call(this),this.Y=this.Z=void 0}};var Ga=e=>!Ka(e)&&typeof e.then=="function",Za=1073741823,Di=class extends Hn{constructor(){super(...arguments),this._$C_t=Za,this._$Cwt=[],this._$Cq=new Un(this),this._$CK=new jn}render(...t){var n;return(n=t.find(r=>!Ga(r)))!==null&&n!==void 0?n:me}update(t,n){let r=this._$Cwt,i=r.length;this._$Cwt=n;let o=this._$Cq,l=this._$CK;this.isConnected||this.disconnected();for(let s=0;s<n.length&&!(s>this._$C_t);s++){let a=n[s];if(!Ga(a))return this._$C_t=s,a;s<i&&a===r[s]||(this._$C_t=Za,i=0,Promise.resolve(a).then(async c=>{for(;l.get();)await l.get();let u=o.deref();if(u!==void 0){let p=u._$Cwt.indexOf(a);p>-1&&p<u._$C_t&&(u._$C_t=p,u.setValue(c))}}))}return me}disconnected(){this._$Cq.disconnect(),this._$CK.pause()}reconnected(){this._$Cq.reconnect(this),this._$CK.resume()}},Xa=Ge(Di);var Wt=class extends Fe{constructor(t){if(super(t),this.et=W,t.type!==Ye.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===W||t==null)return this.ft=void 0,this.et=t;if(t===me)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;let n=[t];return n.raw=n,this.ft={_$litType$:this.constructor.resultType,strings:n,values:[]}}};Wt.directiveName="unsafeHTML",Wt.resultType=1;var Ja=Ge(Wt);var ne=class extends we{constructor(){super(...arguments);this.model=or;this.iDontKnowMessage=sn;this.completionsUrl=lr;this.projectKey="";this.dark=!0;this.accentColor="";this.responseStyle="";this.referenceItemStyle="";this.placeholder="Ask me anything\u2026";this.prompt="";this.idToRefMap={};this.loading=!1;this.answer="";this.references=[]}onInput(n){let r=n.target;this.prompt=r.value}scrollToBottom(){let n=this.renderRoot.querySelector("#result");n.scrollTop=n.scrollHeight}getRefFromId(n){}reset(){let n=this.renderRoot.querySelector("#prompt-input");n.value="",this.answer="",this.references=[],this.loading=!1}focus(){this.renderRoot.querySelector("#prompt-input").focus()}async onSubmit(n){n.preventDefault(),this.prompt!==""&&(this.answer="",this.references=[],this.loading=!0,await so(this.prompt,this.projectKey,r=>{this.scrollToBottom(),this.answer+=r},r=>{this.scrollToBottom(),this.references=r},{model:this.model,iDontKnowMessage:this.iDontKnowMessage,completionsUrl:this.completionsUrl}),this.loading=!1)}async renderMarkdown(n){let r=await xr().use(ol).use(Fi).use(Br,{allowDangerousHtml:!0}).use(jr).use(Nn).process(n);return typeof r.value!="string"?"":Ja(r.value)}render(){return Pe`
      <div class="root">
        <div class="input-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>

          <form class="prompt-form" @submit="${this.onSubmit}">
            <input
              id="prompt-input"
              class="prompt-input"
              type="text"
              name="prompt"
              @input="${this.onInput}"
              placeholder="${this.placeholder}"
              value="${this.prompt}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus
            />
          </form>
        </div>

        <div class="gradient"></div>
        <prose-block class="result" id="result">
          <div class="answer prose">
            ${this.loading&&!(this.answer.length>0)?Pe`<animated-caret class="caret"></animated-caret>`:W}
            ${Xa(this.renderMarkdown(this.answer),W)}
            ${this.loading&&this.answer.length>0?Pe`<animated-caret class="caret"></animated-caret>`:W}
          </div>
          ${this.answer.length>0&&this.references.length>0?Pe`
                <div class="references-container">
                  <div
                    class="${ir({"animate-slide-up":!this.loading})}"
                  >
                    <p>Generated from the following sources:</p>
                    <div class="references">
                      ${this.references.map(n=>{let r=this.idToRefMap?this.idToRefMap[n]:void 0;return r||(r=this.getRefFromId(n)),r&&r.href?Pe`<a
                            href="${r.href}"
                            class="reference-item"
                          >
                            ${r.label||n}</a
                          >`:Pe`<div class="reference-item">
                          ${n}
                        </div>`})}
                    </div>
                  </div>
                </div>
              `:W}
          <div class="spacer"></div>
        </prose-block>
      </div>
    `}};ne.styles=_t`
    .root {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .input-container {
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      border-bottom-width: 1px;
      background-color: var(--input-bg-color);
      border-color: var(--border-color);
      height: 3rem;
    }

    .input-container svg {
      height: 20px;
      width: 20px;
      color: var(--search-icon-color);
      flex: none;
    }

    .prompt-form {
      flex-grow: 1;
    }

    .prompt-input {
      box-sizing: border-box;
      width: 100%;
      padding: 4px;
      appearance: none;
      border-radius: 0.375rem;
      border-width: 0px;
      background-color: transparent;
      color: var(--text-color);
      font-size: 1rem;
    }

    .prompt-input::placeholder {
      color: var(--input-placeholder-color);
    }

    .prompt-input:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 0 black;
    }

    .gradient {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      height: 2.5rem;
    }

    .result {
      box-sizing: border-box;
      border-top: 1px solid var(--border-color);
      background-color: var(--result-bg-color);
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 3rem;
      z-index: 0;
      max-width: 100%;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .result::-webkit-scrollbar {
      display: none;
    }

    .answer {
      padding: 2rem;
      color: var(--text-color);
    }

    .answer img {
      max-width: 100%;
    }

    .answer a {
      color: var(--link-color);
    }

    .spacer {
      height: 2rem;
    }

    .references-container {
      border-top: 1px solid var(--border-color);
      padding: 2rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: rgb(115 115 115 / 1);
    }

    .references {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .reference-item {
      font-weight: 600;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
      color: var(--accent-color);
      text-decoration: none;
      background-color: var(--reference-item-bg-color);
      transition-property: background-color, border-color, color, fill, stroke,
        opacity, box-shadow, transform;
      transition-duration: 200ms;
    }

    .reference-item:hover {
      background-color: var(--reference-item-bg-color-hover);
    }

    .caret {
      color: var(--caret-color);
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-up {
      animation-name: slide-up;
      animation-duration: 1s;
      animation-fill-mode: both;
      transition-timing-function: ease-in-out;
    }
  `,te([oe({type:String})],ne.prototype,"model",2),te([oe({type:String})],ne.prototype,"iDontKnowMessage",2),te([oe({type:String})],ne.prototype,"completionsUrl",2),te([oe({type:String})],ne.prototype,"projectKey",2),te([oe({type:Boolean})],ne.prototype,"dark",2),te([oe({type:String})],ne.prototype,"accentColor",2),te([oe({type:String})],ne.prototype,"responseStyle",2),te([oe({type:String})],ne.prototype,"referenceItemStyle",2),te([oe({type:String})],ne.prototype,"placeholder",2),te([oe({type:String,state:!0})],ne.prototype,"prompt",2),te([oe({type:Object})],ne.prototype,"idToRefMap",2),te([oe({type:Boolean,state:!0})],ne.prototype,"loading",2),te([oe({type:String,state:!0})],ne.prototype,"answer",2),te([oe({type:Array,state:!0})],ne.prototype,"references",2),ne=te([an("markprompt-content")],ne);var Kt=class extends we{render(){return Pe`<span></span>`}};Kt.styles=_t`
    :host {
      display: inline-block;
      width: 8px;
      height: 15px;
      background-color: currentColor;
      animation: blink 1s infinite;
      transform: matrix(1, 0, 0, 1, 2, 2);
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, currentColor 0px 0px 3px 0px;
      border-radius: 1px;
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,Kt=te([an("animated-caret")],Kt);var kt=class extends we{constructor(){super(...arguments);this.class=""}render(){return Pe`
      <div
        class="${ir({prose:!0,[this.class]:this.class.length>0})}"
      >
        <slot></slot>
      </div>
    `}};kt.styles=_t`
    .prose {
      color: var(--tw-prose-body);
      max-width: 65ch;
    }

    .prose :where([class~='lead']):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-lead);
      font-size: 1.25em;
      line-height: 1.6;
      margin-top: 1.2em;
      margin-bottom: 1.2em;
    }

    .prose :where(a):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-links);
      text-decoration: underline;
      font-weight: 500;
    }

    .prose :where(strong):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-bold);
      font-weight: 600;
    }

    .prose :where(ol):not(:where([class~='not-prose'] *)) {
      list-style-type: decimal;
      padding-left: 1.625em;
    }

    .prose :where(ol[type='A']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-alpha;
    }

    .prose :where(ol[type='a']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-alpha;
    }

    .prose :where(ol[type='A']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-alpha;
    }

    .prose :where(ol[type='a']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-alpha;
    }

    .prose :where(ol[type='I']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-roman;
    }

    .prose :where(ol[type='i']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-roman;
    }

    .prose :where(ol[type='I']):not(:where([class~='not-prose'] *)) {
      list-style-type: upper-roman;
    }

    .prose :where(ol[type='i']):not(:where([class~='not-prose'] *)) {
      list-style-type: lower-roman;
    }

    .prose :where(ol[type='1']):not(:where([class~='not-prose'] *)) {
      list-style-type: decimal;
    }

    .prose :where(ul):not(:where([class~='not-prose'] *)) {
      list-style-type: disc;
      padding-left: 1.625em;
    }

    .prose :where(ol > li):not(:where([class~='not-prose'] *))::marker {
      font-weight: 400;
      color: var(--tw-prose-counters);
    }

    .prose :where(ul > li):not(:where([class~='not-prose'] *))::marker {
      color: var(--tw-prose-bullets);
    }

    .prose :where(hr):not(:where([class~='not-prose'] *)) {
      border-color: var(--tw-prose-hr);
      border-top-width: 1px;
      margin-top: 3em;
      margin-bottom: 3em;
    }

    .prose :where(blockquote):not(:where([class~='not-prose'] *)) {
      font-weight: 500;
      font-style: italic;
      color: var(--tw-prose-quotes);
      border-left-width: 0.25rem;
      border-left-color: var(--tw-prose-quote-borders);
      quotes: '\201C''\201D''\2018''\2019';
      margin-top: 1.6em;
      margin-bottom: 1.6em;
      padding-left: 1em;
    }

    .prose
      :where(blockquote p:first-of-type):not(
        :where([class~='not-prose'] *)
      )::before {
      content: open-quote;
    }

    .prose
      :where(blockquote p:last-of-type):not(
        :where([class~='not-prose'] *)
      )::after {
      content: close-quote;
    }

    .prose :where(h1):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 800;
      font-size: 2.25em;
      margin-top: 0;
      margin-bottom: 0.8888889em;
      line-height: 1.1111111;
    }

    .prose :where(h1 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 900;
    }

    .prose :where(h2):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 700;
      font-size: 1.5em;
      margin-top: 2em;
      margin-bottom: 1em;
      line-height: 1.3333333;
    }

    .prose :where(h2 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 800;
    }

    .prose :where(h3):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      font-size: 1.25em;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      line-height: 1.6;
    }

    .prose :where(h3 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 700;
    }

    .prose :where(h4):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.5;
    }

    .prose :where(h4 strong):not(:where([class~='not-prose'] *)) {
      font-weight: 700;
    }

    .prose :where(figure > *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
      margin-bottom: 0;
    }

    .prose :where(figcaption):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-captions);
      font-size: 0.875em;
      line-height: 1.4285714;
      margin-top: 0.8571429em;
    }

    .prose :where(code):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-code);
      font-weight: 600;
      font-size: 0.875em;
    }

    .prose :where(code):not(:where([class~='not-prose'] *))::before {
      content: '\`';
    }

    .prose :where(code):not(:where([class~='not-prose'] *))::after {
      content: '\`';
    }

    .prose :where(a code):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-links);
    }

    .prose :where(pre):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-pre-code);
      background-color: var(--tw-prose-pre-bg);
      overflow-x: auto;
      font-weight: 400;
      font-size: 0.875em;
      line-height: 1.7142857;
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
      border-radius: 0.375rem;
      padding-top: 0.8571429em;
      padding-right: 1.1428571em;
      padding-bottom: 0.8571429em;
      padding-left: 1.1428571em;
    }

    .prose :where(pre code):not(:where([class~='not-prose'] *)) {
      background-color: transparent;
      border-width: 0;
      border-radius: 0;
      padding: 0;
      font-weight: inherit;
      color: inherit;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
    }

    .prose :where(pre code):not(:where([class~='not-prose'] *))::before {
      content: none;
    }

    .prose :where(pre code):not(:where([class~='not-prose'] *))::after {
      content: none;
    }

    .prose :where(table):not(:where([class~='not-prose'] *)) {
      width: 100%;
      table-layout: auto;
      text-align: left;
      margin-top: 2em;
      margin-bottom: 2em;
      font-size: 0.875em;
      line-height: 1.7142857;
    }

    .prose :where(thead):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 1px;
      border-bottom-color: var(--tw-prose-th-borders);
    }

    .prose :where(thead th):not(:where([class~='not-prose'] *)) {
      color: var(--tw-prose-headings);
      font-weight: 600;
      vertical-align: bottom;
      padding-right: 0.5714286em;
      padding-bottom: 0.5714286em;
      padding-left: 0.5714286em;
    }

    .prose :where(tbody tr):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 1px;
      border-bottom-color: var(--tw-prose-td-borders);
    }

    .prose :where(tbody tr:last-child):not(:where([class~='not-prose'] *)) {
      border-bottom-width: 0;
    }

    .prose :where(tbody td):not(:where([class~='not-prose'] *)) {
      vertical-align: baseline;
      padding-top: 0.5714286em;
      padding-right: 0.5714286em;
      padding-bottom: 0.5714286em;
      padding-left: 0.5714286em;
    }

    .prose {
      --tw-prose-body: #374151;
      --tw-prose-headings: #111827;
      --tw-prose-lead: #4b5563;
      --tw-prose-links: #111827;
      --tw-prose-bold: #111827;
      --tw-prose-counters: #6b7280;
      --tw-prose-bullets: #d1d5db;
      --tw-prose-hr: #e5e7eb;
      --tw-prose-quotes: #111827;
      --tw-prose-quote-borders: #e5e7eb;
      --tw-prose-captions: #6b7280;
      --tw-prose-code: #111827;
      --tw-prose-pre-code: #e5e7eb;
      --tw-prose-pre-bg: #1f2937;
      --tw-prose-th-borders: #d1d5db;
      --tw-prose-td-borders: #e5e7eb;
      --tw-prose-invert-body: #d1d5db;
      --tw-prose-invert-headings: #fff;
      --tw-prose-invert-lead: #9ca3af;
      --tw-prose-invert-links: #fff;
      --tw-prose-invert-bold: #fff;
      --tw-prose-invert-counters: #9ca3af;
      --tw-prose-invert-bullets: #4b5563;
      --tw-prose-invert-hr: #374151;
      --tw-prose-invert-quotes: #f3f4f6;
      --tw-prose-invert-quote-borders: #374151;
      --tw-prose-invert-captions: #9ca3af;
      --tw-prose-invert-code: #fff;
      --tw-prose-invert-pre-code: #d1d5db;
      --tw-prose-invert-pre-bg: rgb(0 0 0 / 50%);
      --tw-prose-invert-th-borders: #4b5563;
      --tw-prose-invert-td-borders: #374151;
      font-size: 1rem;
      line-height: 1.75;
    }

    .prose :where(p):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
    }

    .prose :where(img):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(video):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(figure):not(:where([class~='not-prose'] *)) {
      margin-top: 2em;
      margin-bottom: 2em;
    }

    .prose :where(h2 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.875em;
    }

    .prose :where(h3 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.9em;
    }

    .prose :where(li):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }

    .prose :where(ol > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.375em;
    }

    .prose :where(ul > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.375em;
    }

    .prose > :where(ul > li p):not(:where([class~='not-prose'] *)) {
      margin-top: 0.75em;
      margin-bottom: 0.75em;
    }

    .prose
      > :where(ul > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
    }

    .prose
      > :where(ul > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.25em;
    }

    .prose
      > :where(ol > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.25em;
    }

    .prose
      > :where(ol > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.25em;
    }

    .prose
      :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~='not-prose'] *)) {
      margin-top: 0.75em;
      margin-bottom: 0.75em;
    }

    .prose :where(hr + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h2 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h3 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(h4 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose :where(thead th:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose :where(thead th:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose :where(tbody td:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose :where(tbody td:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose > :where(:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose > :where(:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 0;
    }

    .prose-sm {
      font-size: 0.875rem;
      line-height: 1.7142857;
    }

    .prose-sm :where(p):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
      margin-bottom: 1.1428571em;
    }

    .prose-sm :where([class~='lead']):not(:where([class~='not-prose'] *)) {
      font-size: 1.2857143em;
      line-height: 1.5555556;
      margin-top: 0.8888889em;
      margin-bottom: 0.8888889em;
    }

    .prose-sm :where(blockquote):not(:where([class~='not-prose'] *)) {
      margin-top: 1.3333333em;
      margin-bottom: 1.3333333em;
      padding-left: 1.1111111em;
    }

    .prose-sm :where(h1):not(:where([class~='not-prose'] *)) {
      font-size: 2.1428571em;
      margin-top: 0;
      margin-bottom: 0.8em;
      line-height: 1.2;
    }

    .prose-sm :where(h2):not(:where([class~='not-prose'] *)) {
      font-size: 1.4285714em;
      margin-top: 1.6em;
      margin-bottom: 0.8em;
      line-height: 1.4;
    }

    .prose-sm :where(h3):not(:where([class~='not-prose'] *)) {
      font-size: 1.2857143em;
      margin-top: 1.5555556em;
      margin-bottom: 0.4444444em;
      line-height: 1.5555556;
    }

    .prose-sm :where(h4):not(:where([class~='not-prose'] *)) {
      margin-top: 1.4285714em;
      margin-bottom: 0.5714286em;
      line-height: 1.4285714;
    }

    .prose-sm :where(img):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(video):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(figure):not(:where([class~='not-prose'] *)) {
      margin-top: 1.7142857em;
      margin-bottom: 1.7142857em;
    }

    .prose-sm :where(figure > *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
      margin-bottom: 0;
    }

    .prose-sm :where(figcaption):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
      line-height: 1.3333333;
      margin-top: 0.6666667em;
    }

    .prose-sm :where(code):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
    }

    .prose-sm :where(h2 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.9em;
    }

    .prose-sm :where(h3 code):not(:where([class~='not-prose'] *)) {
      font-size: 0.8888889em;
    }

    .prose-sm :where(pre):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
      line-height: 1.6666667;
      margin-top: 1.6666667em;
      margin-bottom: 1.6666667em;
      border-radius: 0.25rem;
      padding-top: 0.6666667em;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    .prose-sm :where(ol):not(:where([class~='not-prose'] *)) {
      padding-left: 1.5714286em;
    }

    .prose-sm :where(ul):not(:where([class~='not-prose'] *)) {
      padding-left: 1.5714286em;
    }

    .prose-sm :where(li):not(:where([class~='not-prose'] *)) {
      margin-top: 0.2857143em;
      margin-bottom: 0.2857143em;
    }

    .prose-sm :where(ol > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.4285714em;
    }

    .prose-sm :where(ul > li):not(:where([class~='not-prose'] *)) {
      padding-left: 0.4285714em;
    }

    .prose-sm > :where(ul > li p):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    .prose-sm
      > :where(ul > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
    }

    .prose-sm
      > :where(ul > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.1428571em;
    }

    .prose-sm
      > :where(ol > li > *:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 1.1428571em;
    }

    .prose-sm
      > :where(ol > li > *:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 1.1428571em;
    }

    .prose-sm
      :where(ul ul, ul ol, ol ul, ol ol):not(:where([class~='not-prose'] *)) {
      margin-top: 0.5714286em;
      margin-bottom: 0.5714286em;
    }

    .prose-sm :where(hr):not(:where([class~='not-prose'] *)) {
      margin-top: 2.8571429em;
      margin-bottom: 2.8571429em;
    }

    .prose-sm :where(hr + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h2 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h3 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(h4 + *):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm :where(table):not(:where([class~='not-prose'] *)) {
      font-size: 0.8571429em;
      line-height: 1.5;
    }

    .prose-sm :where(thead th):not(:where([class~='not-prose'] *)) {
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    .prose-sm :where(thead th:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose-sm :where(thead th:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose-sm :where(tbody td):not(:where([class~='not-prose'] *)) {
      padding-top: 0.6666667em;
      padding-right: 1em;
      padding-bottom: 0.6666667em;
      padding-left: 1em;
    }

    .prose-sm :where(tbody td:first-child):not(:where([class~='not-prose'] *)) {
      padding-left: 0;
    }

    .prose-sm :where(tbody td:last-child):not(:where([class~='not-prose'] *)) {
      padding-right: 0;
    }

    .prose-sm > :where(:first-child):not(:where([class~='not-prose'] *)) {
      margin-top: 0;
    }

    .prose-sm > :where(:last-child):not(:where([class~='not-prose'] *)) {
      margin-bottom: 0;
    }
  `,te([oe({type:String})],kt.prototype,"class",2),kt=te([an("prose-block")],kt);
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
