var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all5) => {
  for (var name in all5)
    __defProp(target, name, { get: all5[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __decorateClass = (decorators, target, key2, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key2) : target;
  for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
    if (decorator = decorators[i6])
      result = (kind ? decorator(target, key2, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key2, result);
  return result;
};

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports, module2) {
    module2.exports = function isBuffer2(obj) {
      return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    };
  }
});

// node_modules/extend/index.js
var require_extend = __commonJS({
  "node_modules/extend/index.js"(exports, module2) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;
    var isArray = function isArray2(arr) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(arr);
      }
      return toStr.call(arr) === "[object Array]";
    };
    var isPlainObject2 = function isPlainObject3(obj) {
      if (!obj || toStr.call(obj) !== "[object Object]") {
        return false;
      }
      var hasOwnConstructor = hasOwn.call(obj, "constructor");
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }
      var key2;
      for (key2 in obj) {
      }
      return typeof key2 === "undefined" || hasOwn.call(obj, key2);
    };
    var setProperty = function setProperty2(target, options) {
      if (defineProperty && options.name === "__proto__") {
        defineProperty(target, options.name, {
          enumerable: true,
          configurable: true,
          value: options.newValue,
          writable: true
        });
      } else {
        target[options.name] = options.newValue;
      }
    };
    var getProperty = function getProperty2(obj, name) {
      if (name === "__proto__") {
        if (!hasOwn.call(obj, name)) {
          return void 0;
        } else if (gOPD) {
          return gOPD(obj, name).value;
        }
      }
      return obj[name];
    };
    module2.exports = function extend2() {
      var options, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i6 = 1;
      var length = arguments.length;
      var deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i6 = 2;
      }
      if (target == null || typeof target !== "object" && typeof target !== "function") {
        target = {};
      }
      for (; i6 < length; ++i6) {
        options = arguments[i6];
        if (options != null) {
          for (name in options) {
            src = getProperty(target, name);
            copy = getProperty(options, name);
            if (target !== copy) {
              if (deep && copy && (isPlainObject2(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject2(src) ? src : {};
                }
                setProperty(target, { name, newValue: extend2(deep, clone, copy) });
              } else if (typeof copy !== "undefined") {
                setProperty(target, { name, newValue: copy });
              }
            }
          }
        }
      }
      return target;
    };
  }
});

// node_modules/@lit/reactive-element/css-tag.js
var t = window;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var n = /* @__PURE__ */ new WeakMap();
var o = class {
  constructor(t5, e10, n8) {
    if (this._$cssResult$ = true, n8 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e10;
  }
  get styleSheet() {
    let t5 = this.o;
    const s7 = this.t;
    if (e && void 0 === t5) {
      const e10 = void 0 !== s7 && 1 === s7.length;
      e10 && (t5 = n.get(s7)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e10 && n.set(s7, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new o("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e10) => {
  const n8 = 1 === t5.length ? t5[0] : e10.reduce((e11, s7, n9) => e11 + ((t6) => {
    if (true === t6._$cssResult$)
      return t6.cssText;
    if ("number" == typeof t6)
      return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s7) + t5[n9 + 1], t5[0]);
  return new o(n8, t5, s);
};
var S = (s7, n8) => {
  e ? s7.adoptedStyleSheets = n8.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet) : n8.forEach((e10) => {
    const n9 = document.createElement("style"), o9 = t.litNonce;
    void 0 !== o9 && n9.setAttribute("nonce", o9), n9.textContent = e10.cssText, s7.appendChild(n9);
  });
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e10 = "";
  for (const s7 of t6.cssRules)
    e10 += s7.cssText;
  return r(e10);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2 = window;
var r2 = e2.trustedTypes;
var h = r2 ? r2.emptyScript : "";
var o2 = e2.reactiveElementPolyfillSupport;
var n2 = { toAttribute(t5, i6) {
  switch (i6) {
    case Boolean:
      t5 = t5 ? h : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, i6) {
  let s7 = t5;
  switch (i6) {
    case Boolean:
      s7 = null !== t5;
      break;
    case Number:
      s7 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        s7 = JSON.parse(t5);
      } catch (t6) {
        s7 = null;
      }
  }
  return s7;
} };
var a = (t5, i6) => i6 !== t5 && (i6 == i6 || t5 == t5);
var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
var d = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
  }
  static addInitializer(t5) {
    var i6;
    this.finalize(), (null !== (i6 = this.h) && void 0 !== i6 ? i6 : this.h = []).push(t5);
  }
  static get observedAttributes() {
    this.finalize();
    const t5 = [];
    return this.elementProperties.forEach((i6, s7) => {
      const e10 = this._$Ep(s7, i6);
      void 0 !== e10 && (this._$Ev.set(e10, s7), t5.push(e10));
    }), t5;
  }
  static createProperty(t5, i6 = l) {
    if (i6.state && (i6.attribute = false), this.finalize(), this.elementProperties.set(t5, i6), !i6.noAccessor && !this.prototype.hasOwnProperty(t5)) {
      const s7 = "symbol" == typeof t5 ? Symbol() : "__" + t5, e10 = this.getPropertyDescriptor(t5, s7, i6);
      void 0 !== e10 && Object.defineProperty(this.prototype, t5, e10);
    }
  }
  static getPropertyDescriptor(t5, i6, s7) {
    return { get() {
      return this[i6];
    }, set(e10) {
      const r5 = this[t5];
      this[i6] = e10, this.requestUpdate(t5, r5, s7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t5 = Object.getPrototypeOf(this);
    if (t5.finalize(), void 0 !== t5.h && (this.h = [...t5.h]), this.elementProperties = new Map(t5.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const t6 = this.properties, i6 = [...Object.getOwnPropertyNames(t6), ...Object.getOwnPropertySymbols(t6)];
      for (const s7 of i6)
        this.createProperty(s7, t6[s7]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i6) {
    const s7 = [];
    if (Array.isArray(i6)) {
      const e10 = new Set(i6.flat(1 / 0).reverse());
      for (const i7 of e10)
        s7.unshift(c(i7));
    } else
      void 0 !== i6 && s7.push(c(i6));
    return s7;
  }
  static _$Ep(t5, i6) {
    const s7 = i6.attribute;
    return false === s7 ? void 0 : "string" == typeof s7 ? s7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  u() {
    var t5;
    this._$E_ = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t5 = this.constructor.h) || void 0 === t5 || t5.forEach((t6) => t6(this));
  }
  addController(t5) {
    var i6, s7;
    (null !== (i6 = this._$ES) && void 0 !== i6 ? i6 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && (null === (s7 = t5.hostConnected) || void 0 === s7 || s7.call(t5));
  }
  removeController(t5) {
    var i6;
    null === (i6 = this._$ES) || void 0 === i6 || i6.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t5, i6) => {
      this.hasOwnProperty(i6) && (this._$Ei.set(i6, this[i6]), delete this[i6]);
    });
  }
  createRenderRoot() {
    var t5;
    const s7 = null !== (t5 = this.shadowRoot) && void 0 !== t5 ? t5 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s7, this.constructor.elementStyles), s7;
  }
  connectedCallback() {
    var t5;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostConnected) || void 0 === i6 ? void 0 : i6.call(t6);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var t5;
    null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
      var i6;
      return null === (i6 = t6.hostDisconnected) || void 0 === i6 ? void 0 : i6.call(t6);
    });
  }
  attributeChangedCallback(t5, i6, s7) {
    this._$AK(t5, s7);
  }
  _$EO(t5, i6, s7 = l) {
    var e10;
    const r5 = this.constructor._$Ep(t5, s7);
    if (void 0 !== r5 && true === s7.reflect) {
      const h5 = (void 0 !== (null === (e10 = s7.converter) || void 0 === e10 ? void 0 : e10.toAttribute) ? s7.converter : n2).toAttribute(i6, s7.type);
      this._$El = t5, null == h5 ? this.removeAttribute(r5) : this.setAttribute(r5, h5), this._$El = null;
    }
  }
  _$AK(t5, i6) {
    var s7;
    const e10 = this.constructor, r5 = e10._$Ev.get(t5);
    if (void 0 !== r5 && this._$El !== r5) {
      const t6 = e10.getPropertyOptions(r5), h5 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== (null === (s7 = t6.converter) || void 0 === s7 ? void 0 : s7.fromAttribute) ? t6.converter : n2;
      this._$El = r5, this[r5] = h5.fromAttribute(i6, t6.type), this._$El = null;
    }
  }
  requestUpdate(t5, i6, s7) {
    let e10 = true;
    void 0 !== t5 && (((s7 = s7 || this.constructor.getPropertyOptions(t5)).hasChanged || a)(this[t5], i6) ? (this._$AL.has(t5) || this._$AL.set(t5, i6), true === s7.reflect && this._$El !== t5 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t5, s7))) : e10 = false), !this.isUpdatePending && e10 && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = true;
    try {
      await this._$E_;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t5;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((t6, i7) => this[i7] = t6), this._$Ei = void 0);
    let i6 = false;
    const s7 = this._$AL;
    try {
      i6 = this.shouldUpdate(s7), i6 ? (this.willUpdate(s7), null === (t5 = this._$ES) || void 0 === t5 || t5.forEach((t6) => {
        var i7;
        return null === (i7 = t6.hostUpdate) || void 0 === i7 ? void 0 : i7.call(t6);
      }), this.update(s7)) : this._$Ek();
    } catch (t6) {
      throw i6 = false, this._$Ek(), t6;
    }
    i6 && this._$AE(s7);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var i6;
    null === (i6 = this._$ES) || void 0 === i6 || i6.forEach((t6) => {
      var i7;
      return null === (i7 = t6.hostUpdated) || void 0 === i7 ? void 0 : i7.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    void 0 !== this._$EC && (this._$EC.forEach((t6, i6) => this._$EO(i6, this[i6], t6)), this._$EC = void 0), this._$Ek();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
d.finalized = true, d.elementProperties = /* @__PURE__ */ new Map(), d.elementStyles = [], d.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: d }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.6.1");

// node_modules/lit-html/lit-html.js
var t2;
var i2 = window;
var s3 = i2.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var o3 = "$lit$";
var n3 = `lit$${(Math.random() + "").slice(9)}$`;
var l2 = "?" + n3;
var h2 = `<${l2}>`;
var r3 = document;
var d2 = () => r3.createComment("");
var u = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var c2 = Array.isArray;
var v = (t5) => c2(t5) || "function" == typeof (null == t5 ? void 0 : t5[Symbol.iterator]);
var a2 = "[ 	\n\f\r]";
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var w = (t5) => (i6, ...s7) => ({ _$litType$: t5, strings: i6, values: s7 });
var x = w(1);
var b = w(2);
var T = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var E = /* @__PURE__ */ new WeakMap();
var C = r3.createTreeWalker(r3, 129, null, false);
var P = (t5, i6) => {
  const s7 = t5.length - 1, l7 = [];
  let r5, d3 = 2 === i6 ? "<svg>" : "", u2 = f;
  for (let i7 = 0; i7 < s7; i7++) {
    const s8 = t5[i7];
    let e10, c6, v2 = -1, a3 = 0;
    for (; a3 < s8.length && (u2.lastIndex = a3, c6 = u2.exec(s8), null !== c6); )
      a3 = u2.lastIndex, u2 === f ? "!--" === c6[1] ? u2 = _ : void 0 !== c6[1] ? u2 = m : void 0 !== c6[2] ? (y.test(c6[2]) && (r5 = RegExp("</" + c6[2], "g")), u2 = p) : void 0 !== c6[3] && (u2 = p) : u2 === p ? ">" === c6[0] ? (u2 = null != r5 ? r5 : f, v2 = -1) : void 0 === c6[1] ? v2 = -2 : (v2 = u2.lastIndex - c6[2].length, e10 = c6[1], u2 = void 0 === c6[3] ? p : '"' === c6[3] ? $ : g) : u2 === $ || u2 === g ? u2 = p : u2 === _ || u2 === m ? u2 = f : (u2 = p, r5 = void 0);
    const w2 = u2 === p && t5[i7 + 1].startsWith("/>") ? " " : "";
    d3 += u2 === f ? s8 + h2 : v2 >= 0 ? (l7.push(e10), s8.slice(0, v2) + o3 + s8.slice(v2) + n3 + w2) : s8 + n3 + (-2 === v2 ? (l7.push(void 0), i7) : w2);
  }
  const c5 = d3 + (t5[s7] || "<?>") + (2 === i6 ? "</svg>" : "");
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [void 0 !== e3 ? e3.createHTML(c5) : c5, l7];
};
var V = class {
  constructor({ strings: t5, _$litType$: i6 }, e10) {
    let h5;
    this.parts = [];
    let r5 = 0, u2 = 0;
    const c5 = t5.length - 1, v2 = this.parts, [a3, f2] = P(t5, i6);
    if (this.el = V.createElement(a3, e10), C.currentNode = this.el.content, 2 === i6) {
      const t6 = this.el.content, i7 = t6.firstChild;
      i7.remove(), t6.append(...i7.childNodes);
    }
    for (; null !== (h5 = C.nextNode()) && v2.length < c5; ) {
      if (1 === h5.nodeType) {
        if (h5.hasAttributes()) {
          const t6 = [];
          for (const i7 of h5.getAttributeNames())
            if (i7.endsWith(o3) || i7.startsWith(n3)) {
              const s7 = f2[u2++];
              if (t6.push(i7), void 0 !== s7) {
                const t7 = h5.getAttribute(s7.toLowerCase() + o3).split(n3), i8 = /([.?@])?(.*)/.exec(s7);
                v2.push({ type: 1, index: r5, name: i8[2], strings: t7, ctor: "." === i8[1] ? k : "?" === i8[1] ? I : "@" === i8[1] ? L : R });
              } else
                v2.push({ type: 6, index: r5 });
            }
          for (const i7 of t6)
            h5.removeAttribute(i7);
        }
        if (y.test(h5.tagName)) {
          const t6 = h5.textContent.split(n3), i7 = t6.length - 1;
          if (i7 > 0) {
            h5.textContent = s3 ? s3.emptyScript : "";
            for (let s7 = 0; s7 < i7; s7++)
              h5.append(t6[s7], d2()), C.nextNode(), v2.push({ type: 2, index: ++r5 });
            h5.append(t6[i7], d2());
          }
        }
      } else if (8 === h5.nodeType)
        if (h5.data === l2)
          v2.push({ type: 2, index: r5 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = h5.data.indexOf(n3, t6 + 1)); )
            v2.push({ type: 7, index: r5 }), t6 += n3.length - 1;
        }
      r5++;
    }
  }
  static createElement(t5, i6) {
    const s7 = r3.createElement("template");
    return s7.innerHTML = t5, s7;
  }
};
function N(t5, i6, s7 = t5, e10) {
  var o9, n8, l7, h5;
  if (i6 === T)
    return i6;
  let r5 = void 0 !== e10 ? null === (o9 = s7._$Co) || void 0 === o9 ? void 0 : o9[e10] : s7._$Cl;
  const d3 = u(i6) ? void 0 : i6._$litDirective$;
  return (null == r5 ? void 0 : r5.constructor) !== d3 && (null === (n8 = null == r5 ? void 0 : r5._$AO) || void 0 === n8 || n8.call(r5, false), void 0 === d3 ? r5 = void 0 : (r5 = new d3(t5), r5._$AT(t5, s7, e10)), void 0 !== e10 ? (null !== (l7 = (h5 = s7)._$Co) && void 0 !== l7 ? l7 : h5._$Co = [])[e10] = r5 : s7._$Cl = r5), void 0 !== r5 && (i6 = N(t5, r5._$AS(t5, i6.values), r5, e10)), i6;
}
var S2 = class {
  constructor(t5, i6) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    var i6;
    const { el: { content: s7 }, parts: e10 } = this._$AD, o9 = (null !== (i6 = null == t5 ? void 0 : t5.creationScope) && void 0 !== i6 ? i6 : r3).importNode(s7, true);
    C.currentNode = o9;
    let n8 = C.nextNode(), l7 = 0, h5 = 0, d3 = e10[0];
    for (; void 0 !== d3; ) {
      if (l7 === d3.index) {
        let i7;
        2 === d3.type ? i7 = new M(n8, n8.nextSibling, this, t5) : 1 === d3.type ? i7 = new d3.ctor(n8, d3.name, d3.strings, this, t5) : 6 === d3.type && (i7 = new z(n8, this, t5)), this._$AV.push(i7), d3 = e10[++h5];
      }
      l7 !== (null == d3 ? void 0 : d3.index) && (n8 = C.nextNode(), l7++);
    }
    return o9;
  }
  v(t5) {
    let i6 = 0;
    for (const s7 of this._$AV)
      void 0 !== s7 && (void 0 !== s7.strings ? (s7._$AI(t5, s7, i6), i6 += s7.strings.length - 2) : s7._$AI(t5[i6])), i6++;
  }
};
var M = class {
  constructor(t5, i6, s7, e10) {
    var o9;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s7, this.options = e10, this._$Cp = null === (o9 = null == e10 ? void 0 : e10.isConnected) || void 0 === o9 || o9;
  }
  get _$AU() {
    var t5, i6;
    return null !== (i6 = null === (t5 = this._$AM) || void 0 === t5 ? void 0 : t5._$AU) && void 0 !== i6 ? i6 : this._$Cp;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === (null == t5 ? void 0 : t5.nodeType) && (t5 = i6.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i6 = this) {
    t5 = N(this, t5, i6), u(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== T && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : v(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== A && u(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r3.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    var i6;
    const { values: s7, _$litType$: e10 } = t5, o9 = "number" == typeof e10 ? this._$AC(t5) : (void 0 === e10.el && (e10.el = V.createElement(e10.h, this.options)), e10);
    if ((null === (i6 = this._$AH) || void 0 === i6 ? void 0 : i6._$AD) === o9)
      this._$AH.v(s7);
    else {
      const t6 = new S2(o9, this), i7 = t6.u(this.options);
      t6.v(s7), this.$(i7), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i6 = E.get(t5.strings);
    return void 0 === i6 && E.set(t5.strings, i6 = new V(t5)), i6;
  }
  T(t5) {
    c2(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s7, e10 = 0;
    for (const o9 of t5)
      e10 === i6.length ? i6.push(s7 = new M(this.k(d2()), this.k(d2()), this, this.options)) : s7 = i6[e10], s7._$AI(o9), e10++;
    e10 < i6.length && (this._$AR(s7 && s7._$AB.nextSibling, e10), i6.length = e10);
  }
  _$AR(t5 = this._$AA.nextSibling, i6) {
    var s7;
    for (null === (s7 = this._$AP) || void 0 === s7 || s7.call(this, false, true, i6); t5 && t5 !== this._$AB; ) {
      const i7 = t5.nextSibling;
      t5.remove(), t5 = i7;
    }
  }
  setConnected(t5) {
    var i6;
    void 0 === this._$AM && (this._$Cp = t5, null === (i6 = this._$AP) || void 0 === i6 || i6.call(this, t5));
  }
};
var R = class {
  constructor(t5, i6, s7, e10, o9) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e10, this.options = o9, s7.length > 2 || "" !== s7[0] || "" !== s7[1] ? (this._$AH = Array(s7.length - 1).fill(new String()), this.strings = s7) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5, i6 = this, s7, e10) {
    const o9 = this.strings;
    let n8 = false;
    if (void 0 === o9)
      t5 = N(this, t5, i6, 0), n8 = !u(t5) || t5 !== this._$AH && t5 !== T, n8 && (this._$AH = t5);
    else {
      const e11 = t5;
      let l7, h5;
      for (t5 = o9[0], l7 = 0; l7 < o9.length - 1; l7++)
        h5 = N(this, e11[s7 + l7], i6, l7), h5 === T && (h5 = this._$AH[l7]), n8 || (n8 = !u(h5) || h5 !== this._$AH[l7]), h5 === A ? t5 = A : t5 !== A && (t5 += (null != h5 ? h5 : "") + o9[l7 + 1]), this._$AH[l7] = h5;
    }
    n8 && !e10 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t5 ? t5 : "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var H = s3 ? s3.emptyScript : "";
var I = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    t5 && t5 !== A ? this.element.setAttribute(this.name, H) : this.element.removeAttribute(this.name);
  }
};
var L = class extends R {
  constructor(t5, i6, s7, e10, o9) {
    super(t5, i6, s7, e10, o9), this.type = 5;
  }
  _$AI(t5, i6 = this) {
    var s7;
    if ((t5 = null !== (s7 = N(this, t5, i6, 0)) && void 0 !== s7 ? s7 : A) === T)
      return;
    const e10 = this._$AH, o9 = t5 === A && e10 !== A || t5.capture !== e10.capture || t5.once !== e10.once || t5.passive !== e10.passive, n8 = t5 !== A && (e10 === A || o9);
    o9 && this.element.removeEventListener(this.name, this, e10), n8 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var i6, s7;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s7 = null === (i6 = this.options) || void 0 === i6 ? void 0 : i6.host) && void 0 !== s7 ? s7 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var z = class {
  constructor(t5, i6, s7) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s7;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N(this, t5);
  }
};
var Z = { O: o3, P: n3, A: l2, C: 1, M: P, L: S2, D: v, R: N, I: M, V: R, H: I, N: L, U: k, F: z };
var j = i2.litHtmlPolyfillSupport;
null == j || j(V, M), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.7.2");
var B = (t5, i6, s7) => {
  var e10, o9;
  const n8 = null !== (e10 = null == s7 ? void 0 : s7.renderBefore) && void 0 !== e10 ? e10 : i6;
  let l7 = n8._$litPart$;
  if (void 0 === l7) {
    const t6 = null !== (o9 = null == s7 ? void 0 : s7.renderBefore) && void 0 !== o9 ? o9 : null;
    n8._$litPart$ = l7 = new M(i6.insertBefore(d2(), t6), t6, void 0, null != s7 ? s7 : {});
  }
  return l7._$AI(t5), l7;
};

// node_modules/lit-element/lit-element.js
var l3;
var o4;
var s4 = class extends d {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t5, e10;
    const i6 = super.createRenderRoot();
    return null !== (t5 = (e10 = this.renderOptions).renderBefore) && void 0 !== t5 || (e10.renderBefore = i6.firstChild), i6;
  }
  update(t5) {
    const i6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = B(i6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t5;
    super.connectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(true);
  }
  disconnectedCallback() {
    var t5;
    super.disconnectedCallback(), null === (t5 = this._$Do) || void 0 === t5 || t5.setConnected(false);
  }
  render() {
    return T;
  }
};
s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
var n4 = globalThis.litElementPolyfillSupport;
null == n4 || n4({ LitElement: s4 });
(null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.3.1");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var e4 = (e10) => (n8) => "function" == typeof n8 ? ((e11, n9) => (customElements.define(e11, n9), n9))(e10, n8) : ((e11, n9) => {
  const { kind: t5, elements: s7 } = n9;
  return { kind: t5, elements: s7, finisher(n10) {
    customElements.define(e11, n10);
  } };
})(e10, n8);

// node_modules/@lit/reactive-element/decorators/property.js
var i3 = (i6, e10) => "method" === e10.kind && e10.descriptor && !("value" in e10.descriptor) ? { ...e10, finisher(n8) {
  n8.createProperty(e10.key, i6);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e10.key, initializer() {
  "function" == typeof e10.initializer && (this[e10.key] = e10.initializer.call(this));
}, finisher(n8) {
  n8.createProperty(e10.key, i6);
} };
function e5(e10) {
  return (n8, t5) => void 0 !== t5 ? ((i6, e11, n9) => {
    e11.constructor.createProperty(n9, i6);
  })(e10, n8, t5) : i3(e10, n8);
}

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var n5;
var e6 = null != (null === (n5 = window.HTMLSlotElement) || void 0 === n5 ? void 0 : n5.prototype.assignedElements) ? (o9, n8) => o9.assignedElements(n8) : (o9, n8) => o9.assignedNodes(n8).filter((o10) => o10.nodeType === Node.ELEMENT_NODE);

// node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e7 = (t5) => (...e10) => ({ _$litDirective$: t5, values: e10 });
var i4 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e10, i6) {
    this._$Ct = t5, this._$AM = e10, this._$Ci = i6;
  }
  _$AS(t5, e10) {
    return this.update(t5, e10);
  }
  update(t5, e10) {
    return this.render(...e10);
  }
};

// node_modules/lit-html/directives/class-map.js
var o6 = e7(class extends i4 {
  constructor(t5) {
    var i6;
    if (super(t5), t5.type !== t3.ATTRIBUTE || "class" !== t5.name || (null === (i6 = t5.strings) || void 0 === i6 ? void 0 : i6.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t5) {
    return " " + Object.keys(t5).filter((i6) => t5[i6]).join(" ") + " ";
  }
  update(i6, [s7]) {
    var r5, o9;
    if (void 0 === this.it) {
      this.it = /* @__PURE__ */ new Set(), void 0 !== i6.strings && (this.nt = new Set(i6.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
      for (const t5 in s7)
        s7[t5] && !(null === (r5 = this.nt) || void 0 === r5 ? void 0 : r5.has(t5)) && this.it.add(t5);
      return this.render(s7);
    }
    const e10 = i6.element.classList;
    this.it.forEach((t5) => {
      t5 in s7 || (e10.remove(t5), this.it.delete(t5));
    });
    for (const t5 in s7) {
      const i7 = !!s7[t5];
      i7 === this.it.has(t5) || (null === (o9 = this.nt) || void 0 === o9 ? void 0 : o9.has(t5)) || (i7 ? (e10.add(t5), this.it.add(t5)) : (e10.remove(t5), this.it.delete(t5)));
    }
    return T;
  }
});

// node_modules/@markprompt/core/index.js
var DEFAULT_MODEL = "gpt-3.5-turbo";
var I_DONT_KNOW_MESSAGE = "Sorry, I am not sure how to answer that.";
var MARKPROMPT_COMPLETIONS_URL = "https://api.markprompt.com/v1/completions";
var STREAM_SEPARATOR = "___START_RESPONSE_STREAM___";
var defaultOptions = {
  model: DEFAULT_MODEL,
  completionsUrl: MARKPROMPT_COMPLETIONS_URL,
  iDontKnowMessage: I_DONT_KNOW_MESSAGE,
  promptTemplate: void 0
};
var submitPrompt = async function(prompt, projectKey, onAnswerChunk, onReferences, options) {
  if (!projectKey) {
    throw new Error("A projectKey is required.");
  }
  if (!prompt)
    return;
  options = Object.fromEntries(
    Object.entries(defaultOptions).map(([key2, value]) => {
      var _a;
      return [
        key2,
        (_a = options == null ? void 0 : options[key2]) != null ? _a : value
      ];
    })
  );
  try {
    const res = await fetch(options.completionsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        model: options.model,
        iDontKnowMessage: options.iDontKnowMessage,
        ...options.promptTemplate ? { promptTemplate: options.promptTemplate } : {},
        projectKey
      })
    });
    if (!res.ok || !res.body) {
      const text6 = await res.text();
      console.error("Error:", text6);
      return I_DONT_KNOW_MESSAGE;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let startText = "";
    let didHandleHeader = false;
    let refs = [];
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (!didHandleHeader) {
        startText = startText + chunkValue;
        if (startText.includes(STREAM_SEPARATOR)) {
          const parts = startText.split(STREAM_SEPARATOR);
          try {
            refs = JSON.parse(parts[0]);
          } catch {
          }
          onAnswerChunk(parts[1]);
          didHandleHeader = true;
        }
      } else {
        onAnswerChunk(chunkValue);
      }
    }
    onReferences(refs);
  } catch (e10) {
    console.error("Error", e10);
    onAnswerChunk(options.iDontKnowMessage);
  }
};

// node_modules/bail/index.js
function bail(error) {
  if (error) {
    throw error;
  }
}

// node_modules/unified/lib/index.js
var import_is_buffer2 = __toESM(require_is_buffer(), 1);
var import_extend = __toESM(require_extend(), 1);

// node_modules/is-plain-obj/index.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

// node_modules/trough/index.js
function trough() {
  const fns = [];
  const pipeline = { run, use };
  return pipeline;
  function run(...values) {
    let middlewareIndex = -1;
    const callback = values.pop();
    if (typeof callback !== "function") {
      throw new TypeError("Expected function as last argument, not " + callback);
    }
    next(null, ...values);
    function next(error, ...output) {
      const fn = fns[++middlewareIndex];
      let index2 = -1;
      if (error) {
        callback(error);
        return;
      }
      while (++index2 < values.length) {
        if (output[index2] === null || output[index2] === void 0) {
          output[index2] = values[index2];
        }
      }
      values = output;
      if (fn) {
        wrap(fn, next)(...output);
      } else {
        callback(null, ...output);
      }
    }
  }
  function use(middelware) {
    if (typeof middelware !== "function") {
      throw new TypeError(
        "Expected `middelware` to be a function, not " + middelware
      );
    }
    fns.push(middelware);
    return pipeline;
  }
}
function wrap(middleware, callback) {
  let called;
  return wrapped;
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length;
    let result;
    if (fnExpectsCallback) {
      parameters.push(done);
    }
    try {
      result = middleware.apply(this, parameters);
    } catch (error) {
      const exception = (
        /** @type {Error} */
        error
      );
      if (fnExpectsCallback && called) {
        throw exception;
      }
      return done(exception);
    }
    if (!fnExpectsCallback) {
      if (result instanceof Promise) {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done(error, ...output) {
    if (!called) {
      called = true;
      callback(error, ...output);
    }
  }
  function then(value) {
    done(null, value);
  }
}

// node_modules/vfile/lib/index.js
var import_is_buffer = __toESM(require_is_buffer(), 1);

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point(value);
  }
  return "";
}
function point(point4) {
  return index(point4 && point4.line) + ":" + index(point4 && point4.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/vfile-message/lib/index.js
var VFileMessage = class extends Error {
  /**
   * Create a message for `reason` at `place` from `origin`.
   *
   * When an error is passed in as `reason`, the `stack` is copied.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   *
   *   > 👉 **Note**: you should use markdown.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // To do: next major: expose `undefined` everywhere instead of `null`.
  constructor(reason, place, origin) {
    const parts = [null, null];
    let position3 = {
      // @ts-expect-error: we always follows the structure of `position`.
      start: { line: null, column: null },
      // @ts-expect-error: "
      end: { line: null, column: null }
    };
    super();
    if (typeof place === "string") {
      origin = place;
      place = void 0;
    }
    if (typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        parts[1] = origin;
      } else {
        parts[0] = origin.slice(0, index2);
        parts[1] = origin.slice(index2 + 1);
      }
    }
    if (place) {
      if ("type" in place || "position" in place) {
        if (place.position) {
          position3 = place.position;
        }
      } else if ("start" in place || "end" in place) {
        position3 = place;
      } else if ("line" in place || "column" in place) {
        position3.start = place;
      }
    }
    this.name = stringifyPosition(place) || "1:1";
    this.message = typeof reason === "object" ? reason.message : reason;
    this.stack = "";
    if (typeof reason === "object" && reason.stack) {
      this.stack = reason.stack;
    }
    this.reason = this.message;
    this.fatal;
    this.line = position3.start.line;
    this.column = position3.start.column;
    this.position = position3;
    this.source = parts[0];
    this.ruleId = parts[1];
    this.file;
    this.actual;
    this.expected;
    this.url;
    this.note;
  }
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.fatal = null;
VFileMessage.prototype.column = null;
VFileMessage.prototype.line = null;
VFileMessage.prototype.source = null;
VFileMessage.prototype.ruleId = null;
VFileMessage.prototype.position = null;

// node_modules/vfile/lib/minpath.browser.js
var path = { basename, dirname, extname, join, sep: "/" };
function basename(path3, ext) {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path3);
  let start = 0;
  let end = -1;
  let index2 = path3.length;
  let seenNonSlash;
  if (ext === void 0 || ext.length === 0 || ext.length > path3.length) {
    while (index2--) {
      if (path3.charCodeAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else if (end < 0) {
        seenNonSlash = true;
        end = index2 + 1;
      }
    }
    return end < 0 ? "" : path3.slice(start, end);
  }
  if (ext === path3) {
    return "";
  }
  let firstNonSlashEnd = -1;
  let extIndex = ext.length - 1;
  while (index2--) {
    if (path3.charCodeAt(index2) === 47) {
      if (seenNonSlash) {
        start = index2 + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        seenNonSlash = true;
        firstNonSlashEnd = index2 + 1;
      }
      if (extIndex > -1) {
        if (path3.charCodeAt(index2) === ext.charCodeAt(extIndex--)) {
          if (extIndex < 0) {
            end = index2;
          }
        } else {
          extIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path3.length;
  }
  return path3.slice(start, end);
}
function dirname(path3) {
  assertPath(path3);
  if (path3.length === 0) {
    return ".";
  }
  let end = -1;
  let index2 = path3.length;
  let unmatchedSlash;
  while (--index2) {
    if (path3.charCodeAt(index2) === 47) {
      if (unmatchedSlash) {
        end = index2;
        break;
      }
    } else if (!unmatchedSlash) {
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path3.charCodeAt(0) === 47 ? "/" : "." : end === 1 && path3.charCodeAt(0) === 47 ? "//" : path3.slice(0, end);
}
function extname(path3) {
  assertPath(path3);
  let index2 = path3.length;
  let end = -1;
  let startPart = 0;
  let startDot = -1;
  let preDotState = 0;
  let unmatchedSlash;
  while (index2--) {
    const code3 = path3.charCodeAt(index2);
    if (code3 === 47) {
      if (unmatchedSlash) {
        startPart = index2 + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      unmatchedSlash = true;
      end = index2 + 1;
    }
    if (code3 === 46) {
      if (startDot < 0) {
        startDot = index2;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
  preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path3.slice(startDot, end);
}
function join(...segments) {
  let index2 = -1;
  let joined;
  while (++index2 < segments.length) {
    assertPath(segments[index2]);
    if (segments[index2]) {
      joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
    }
  }
  return joined === void 0 ? "." : normalize(joined);
}
function normalize(path3) {
  assertPath(path3);
  const absolute = path3.charCodeAt(0) === 47;
  let value = normalizeString(path3, !absolute);
  if (value.length === 0 && !absolute) {
    value = ".";
  }
  if (value.length > 0 && path3.charCodeAt(path3.length - 1) === 47) {
    value += "/";
  }
  return absolute ? "/" + value : value;
}
function normalizeString(path3, allowAboveRoot) {
  let result = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let index2 = -1;
  let code3;
  let lastSlashIndex;
  while (++index2 <= path3.length) {
    if (index2 < path3.length) {
      code3 = path3.charCodeAt(index2);
    } else if (code3 === 47) {
      break;
    } else {
      code3 = 47;
    }
    if (code3 === 47) {
      if (lastSlash === index2 - 1 || dots === 1) {
      } else if (lastSlash !== index2 - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result.charCodeAt(result.length - 1) !== 46 || result.charCodeAt(result.length - 2) !== 46) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf("/");
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = "";
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
              }
              lastSlash = index2;
              dots = 0;
              continue;
            }
          } else if (result.length > 0) {
            result = "";
            lastSegmentLength = 0;
            lastSlash = index2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length > 0 ? result + "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (result.length > 0) {
          result += "/" + path3.slice(lastSlash + 1, index2);
        } else {
          result = path3.slice(lastSlash + 1, index2);
        }
        lastSegmentLength = index2 - lastSlash - 1;
      }
      lastSlash = index2;
      dots = 0;
    } else if (code3 === 46 && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function assertPath(path3) {
  if (typeof path3 !== "string") {
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(path3)
    );
  }
}

// node_modules/vfile/lib/minproc.browser.js
var proc = { cwd };
function cwd() {
  return "/";
}

// node_modules/vfile/lib/minurl.shared.js
function isUrl(fileUrlOrPath) {
  return fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && // @ts-expect-error: indexable.
  fileUrlOrPath.href && // @ts-expect-error: indexable.
  fileUrlOrPath.origin;
}

// node_modules/vfile/lib/minurl.browser.js
function urlToPath(path3) {
  if (typeof path3 === "string") {
    path3 = new URL(path3);
  } else if (!isUrl(path3)) {
    const error = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + path3 + "`"
    );
    error.code = "ERR_INVALID_ARG_TYPE";
    throw error;
  }
  if (path3.protocol !== "file:") {
    const error = new TypeError("The URL must be of scheme file");
    error.code = "ERR_INVALID_URL_SCHEME";
    throw error;
  }
  return getPathFromURLPosix(path3);
}
function getPathFromURLPosix(url) {
  if (url.hostname !== "") {
    const error = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    error.code = "ERR_INVALID_FILE_URL_HOST";
    throw error;
  }
  const pathname = url.pathname;
  let index2 = -1;
  while (++index2 < pathname.length) {
    if (pathname.charCodeAt(index2) === 37 && pathname.charCodeAt(index2 + 1) === 50) {
      const third = pathname.charCodeAt(index2 + 2);
      if (third === 70 || third === 102) {
        const error = new TypeError(
          "File URL path must not include encoded / characters"
        );
        error.code = "ERR_INVALID_FILE_URL_PATH";
        throw error;
      }
    }
  }
  return decodeURIComponent(pathname);
}

// node_modules/vfile/lib/index.js
var order = ["history", "path", "basename", "stem", "extname", "dirname"];
var VFile = class {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Buffer` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    let options;
    if (!value) {
      options = {};
    } else if (typeof value === "string" || buffer(value)) {
      options = { value };
    } else if (isUrl(value)) {
      options = { path: value };
    } else {
      options = value;
    }
    this.data = {};
    this.messages = [];
    this.history = [];
    this.cwd = proc.cwd();
    this.value;
    this.stored;
    this.result;
    this.map;
    let index2 = -1;
    while (++index2 < order.length) {
      const prop2 = order[index2];
      if (prop2 in options && options[prop2] !== void 0 && options[prop2] !== null) {
        this[prop2] = prop2 === "history" ? [...options[prop2]] : options[prop2];
      }
    }
    let prop;
    for (prop in options) {
      if (!order.includes(prop)) {
        this[prop] = options[prop];
      }
    }
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {string | URL} path
   */
  set path(path3) {
    if (isUrl(path3)) {
      path3 = urlToPath(path3);
    }
    assertNonEmpty(path3, "path");
    if (this.path !== path3) {
      this.history.push(path3);
    }
  }
  /**
   * Get the parent path (example: `'~'`).
   */
  get dirname() {
    return typeof this.path === "string" ? path.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   */
  set dirname(dirname2) {
    assertPath2(this.basename, "dirname");
    this.path = path.join(dirname2 || "", this.basename);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   */
  get basename() {
    return typeof this.path === "string" ? path.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set basename(basename2) {
    assertNonEmpty(basename2, "basename");
    assertPart(basename2, "basename");
    this.path = path.join(this.dirname || "", basename2);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   */
  get extname() {
    return typeof this.path === "string" ? path.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   */
  set extname(extname2) {
    assertPart(extname2, "extname");
    assertPath2(this.dirname, "extname");
    if (extname2) {
      if (extname2.charCodeAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname2.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = path.join(this.dirname, this.stem + (extname2 || ""));
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   */
  get stem() {
    return typeof this.path === "string" ? path.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set stem(stem) {
    assertNonEmpty(stem, "stem");
    assertPart(stem, "stem");
    this.path = path.join(this.dirname || "", stem + (this.extname || ""));
  }
  /**
   * Serialize the file.
   *
   * @param {BufferEncoding | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Buffer`
   *   (default: `'utf8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    return (this.value || "").toString(encoding || void 0);
  }
  /**
   * Create a warning message associated with the file.
   *
   * Its `fatal` is set to `false` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(reason, place, origin) {
    const message = new VFileMessage(reason, place, origin);
    if (this.path) {
      message.name = this.path + ":" + message.name;
      message.file = this.path;
    }
    message.fatal = false;
    this.messages.push(message);
    return message;
  }
  /**
   * Create an info message associated with the file.
   *
   * Its `fatal` is set to `null` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(reason, place, origin) {
    const message = this.message(reason, place, origin);
    message.fatal = null;
    return message;
  }
  /**
   * Create a fatal error associated with the file.
   *
   * Its `fatal` is set to `true` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * > 👉 **Note**: a fatal error means that a file is no longer processable.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Message.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(reason, place, origin) {
    const message = this.message(reason, place, origin);
    message.fatal = true;
    throw message;
  }
};
function assertPart(part, name) {
  if (part && part.includes(path.sep)) {
    throw new Error(
      "`" + name + "` cannot be a path: did not expect `" + path.sep + "`"
    );
  }
}
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error("`" + name + "` cannot be empty");
  }
}
function assertPath2(path3, name) {
  if (!path3) {
    throw new Error("Setting `" + name + "` requires `path` to be set too");
  }
}
function buffer(value) {
  return (0, import_is_buffer.default)(value);
}

// node_modules/unified/lib/index.js
var unified = base().freeze();
var own = {}.hasOwnProperty;
function base() {
  const transformers = trough();
  const attachers = [];
  let namespace = {};
  let frozen;
  let freezeIndex = -1;
  processor.data = data2;
  processor.Parser = void 0;
  processor.Compiler = void 0;
  processor.freeze = freeze;
  processor.attachers = attachers;
  processor.use = use;
  processor.parse = parse2;
  processor.stringify = stringify3;
  processor.run = run;
  processor.runSync = runSync;
  processor.process = process;
  processor.processSync = processSync;
  return processor;
  function processor() {
    const destination = base();
    let index2 = -1;
    while (++index2 < attachers.length) {
      destination.use(...attachers[index2]);
    }
    destination.data((0, import_extend.default)(true, {}, namespace));
    return destination;
  }
  function data2(key2, value) {
    if (typeof key2 === "string") {
      if (arguments.length === 2) {
        assertUnfrozen("data", frozen);
        namespace[key2] = value;
        return processor;
      }
      return own.call(namespace, key2) && namespace[key2] || null;
    }
    if (key2) {
      assertUnfrozen("data", frozen);
      namespace = key2;
      return processor;
    }
    return namespace;
  }
  function freeze() {
    if (frozen) {
      return processor;
    }
    while (++freezeIndex < attachers.length) {
      const [attacher, ...options] = attachers[freezeIndex];
      if (options[0] === false) {
        continue;
      }
      if (options[0] === true) {
        options[0] = void 0;
      }
      const transformer = attacher.call(processor, ...options);
      if (typeof transformer === "function") {
        transformers.use(transformer);
      }
    }
    frozen = true;
    freezeIndex = Number.POSITIVE_INFINITY;
    return processor;
  }
  function use(value, ...options) {
    let settings;
    assertUnfrozen("use", frozen);
    if (value === null || value === void 0) {
    } else if (typeof value === "function") {
      addPlugin(value, ...options);
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new TypeError("Expected usable value, not `" + value + "`");
    }
    if (settings) {
      namespace.settings = Object.assign(namespace.settings || {}, settings);
    }
    return processor;
    function add(value2) {
      if (typeof value2 === "function") {
        addPlugin(value2);
      } else if (typeof value2 === "object") {
        if (Array.isArray(value2)) {
          const [plugin, ...options2] = value2;
          addPlugin(plugin, ...options2);
        } else {
          addPreset(value2);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value2 + "`");
      }
    }
    function addPreset(result) {
      addList(result.plugins);
      if (result.settings) {
        settings = Object.assign(settings || {}, result.settings);
      }
    }
    function addList(plugins) {
      let index2 = -1;
      if (plugins === null || plugins === void 0) {
      } else if (Array.isArray(plugins)) {
        while (++index2 < plugins.length) {
          const thing = plugins[index2];
          add(thing);
        }
      } else {
        throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
      }
    }
    function addPlugin(plugin, value2) {
      let index2 = -1;
      let entry;
      while (++index2 < attachers.length) {
        if (attachers[index2][0] === plugin) {
          entry = attachers[index2];
          break;
        }
      }
      if (entry) {
        if (isPlainObject(entry[1]) && isPlainObject(value2)) {
          value2 = (0, import_extend.default)(true, entry[1], value2);
        }
        entry[1] = value2;
      } else {
        attachers.push([...arguments]);
      }
    }
  }
  function parse2(doc) {
    processor.freeze();
    const file = vfile(doc);
    const Parser = processor.Parser;
    assertParser("parse", Parser);
    if (newable(Parser, "parse")) {
      return new Parser(String(file), file).parse();
    }
    return Parser(String(file), file);
  }
  function stringify3(node2, doc) {
    processor.freeze();
    const file = vfile(doc);
    const Compiler = processor.Compiler;
    assertCompiler("stringify", Compiler);
    assertNode(node2);
    if (newable(Compiler, "compile")) {
      return new Compiler(node2, file).compile();
    }
    return Compiler(node2, file);
  }
  function run(node2, doc, callback) {
    assertNode(node2);
    processor.freeze();
    if (!callback && typeof doc === "function") {
      callback = doc;
      doc = void 0;
    }
    if (!callback) {
      return new Promise(executor);
    }
    executor(null, callback);
    function executor(resolve, reject) {
      transformers.run(node2, vfile(doc), done);
      function done(error, tree, file) {
        tree = tree || node2;
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(tree);
        } else {
          callback(null, tree, file);
        }
      }
    }
  }
  function runSync(node2, file) {
    let result;
    let complete;
    processor.run(node2, file, done);
    assertDone("runSync", "run", complete);
    return result;
    function done(error, tree) {
      bail(error);
      result = tree;
      complete = true;
    }
  }
  function process(doc, callback) {
    processor.freeze();
    assertParser("process", processor.Parser);
    assertCompiler("process", processor.Compiler);
    if (!callback) {
      return new Promise(executor);
    }
    executor(null, callback);
    function executor(resolve, reject) {
      const file = vfile(doc);
      processor.run(processor.parse(file), file, (error, tree, file2) => {
        if (error || !tree || !file2) {
          done(error);
        } else {
          const result = processor.stringify(tree, file2);
          if (result === void 0 || result === null) {
          } else if (looksLikeAVFileValue(result)) {
            file2.value = result;
          } else {
            file2.result = result;
          }
          done(error, file2);
        }
      });
      function done(error, file2) {
        if (error || !file2) {
          reject(error);
        } else if (resolve) {
          resolve(file2);
        } else {
          callback(null, file2);
        }
      }
    }
  }
  function processSync(doc) {
    let complete;
    processor.freeze();
    assertParser("processSync", processor.Parser);
    assertCompiler("processSync", processor.Compiler);
    const file = vfile(doc);
    processor.process(file, done);
    assertDone("processSync", "process", complete);
    return file;
    function done(error) {
      complete = true;
      bail(error);
    }
  }
}
function newable(value, name) {
  return typeof value === "function" && // Prototypes do exist.
  // type-coverage:ignore-next-line
  value.prototype && // A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  // type-coverage:ignore-next-line
  (keys(value.prototype) || name in value.prototype);
}
function keys(value) {
  let key2;
  for (key2 in value) {
    if (own.call(value, key2)) {
      return true;
    }
  }
  return false;
}
function assertParser(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `Parser`");
  }
}
function assertCompiler(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `Compiler`");
  }
}
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      "Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
  }
}
function assertNode(node2) {
  if (!isPlainObject(node2) || typeof node2.type !== "string") {
    throw new TypeError("Expected node, got `" + node2 + "`");
  }
}
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      "`" + name + "` finished async. Use `" + asyncName + "` instead"
    );
  }
}
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value);
}
function looksLikeAVFile(value) {
  return Boolean(
    value && typeof value === "object" && "message" in value && "messages" in value
  );
}
function looksLikeAVFileValue(value) {
  return typeof value === "string" || (0, import_is_buffer2.default)(value);
}

// node_modules/mdast-util-to-string/lib/index.js
var emptyOptions = {};
function toString(value, options) {
  const settings = options || emptyOptions;
  const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
  const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
  return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value) {
      return value.type === "html" && !includeHtml ? "" : value.value;
    }
    if (includeImageAlt && "alt" in value && value.alt) {
      return value.alt;
    }
    if ("children" in value) {
      return all(value.children, includeImageAlt, includeHtml);
    }
  }
  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml);
  }
  return "";
}
function all(values, includeImageAlt, includeHtml) {
  const result = [];
  let index2 = -1;
  while (++index2 < values.length) {
    result[index2] = one(values[index2], includeImageAlt, includeHtml);
  }
  return result.join("");
}
function node(value) {
  return Boolean(value && typeof value === "object");
}

// node_modules/micromark-util-chunked/index.js
function splice(list3, start, remove, items) {
  const end = list3.length;
  let chunkStart = 0;
  let parameters;
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;
  if (items.length < 1e4) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    [].splice.apply(list3, parameters);
  } else {
    if (remove)
      [].splice.apply(list3, [start, remove]);
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 1e4);
      parameters.unshift(start, 0);
      [].splice.apply(list3, parameters);
      chunkStart += 1e4;
      start += 1e4;
    }
  }
}
function push(list3, items) {
  if (list3.length > 0) {
    splice(list3, list3.length, 0, items);
    return list3;
  }
  return items;
}

// node_modules/micromark-util-combine-extensions/index.js
var hasOwnProperty = {}.hasOwnProperty;
function combineExtensions(extensions) {
  const all5 = {};
  let index2 = -1;
  while (++index2 < extensions.length) {
    syntaxExtension(all5, extensions[index2]);
  }
  return all5;
}
function syntaxExtension(all5, extension2) {
  let hook;
  for (hook in extension2) {
    const maybe = hasOwnProperty.call(all5, hook) ? all5[hook] : void 0;
    const left = maybe || (all5[hook] = {});
    const right = extension2[hook];
    let code3;
    for (code3 in right) {
      if (!hasOwnProperty.call(left, code3))
        left[code3] = [];
      const value = right[code3];
      constructs(
        // @ts-expect-error Looks like a list.
        left[code3],
        Array.isArray(value) ? value : value ? [value] : []
      );
    }
  }
}
function constructs(existing, list3) {
  let index2 = -1;
  const before = [];
  while (++index2 < list3.length) {
    ;
    (list3[index2].add === "after" ? existing : before).push(list3[index2]);
  }
  splice(existing, 0, 0, before);
}

// node_modules/micromark-util-character/lib/unicode-punctuation-regex.js
var unicodePunctuationRegex = /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;

// node_modules/micromark-util-character/index.js
var asciiAlpha = regexCheck(/[A-Za-z]/);
var asciiDigit = regexCheck(/\d/);
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
function asciiControl(code3) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code3 !== null && (code3 < 32 || code3 === 127)
  );
}
function markdownLineEndingOrSpace(code3) {
  return code3 !== null && (code3 < 0 || code3 === 32);
}
function markdownLineEnding(code3) {
  return code3 !== null && code3 < -2;
}
function markdownSpace(code3) {
  return code3 === -2 || code3 === -1 || code3 === 32;
}
var unicodeWhitespace = regexCheck(/\s/);
var unicodePunctuation = regexCheck(unicodePunctuationRegex);
function regexCheck(regex) {
  return check;
  function check(code3) {
    return code3 !== null && regex.test(String.fromCharCode(code3));
  }
}

// node_modules/micromark-factory-space/index.js
function factorySpace(effects, ok2, type, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;
  function start(code3) {
    if (markdownSpace(code3)) {
      effects.enter(type);
      return prefix(code3);
    }
    return ok2(code3);
  }
  function prefix(code3) {
    if (markdownSpace(code3) && size++ < limit) {
      effects.consume(code3);
      return prefix;
    }
    effects.exit(type);
    return ok2(code3);
  }
}

// node_modules/micromark/lib/initialize/content.js
var content = {
  tokenize: initializeContent
};
function initializeContent(effects) {
  const contentStart = effects.attempt(
    this.parser.constructs.contentInitial,
    afterContentStartConstruct,
    paragraphInitial
  );
  let previous3;
  return contentStart;
  function afterContentStartConstruct(code3) {
    if (code3 === null) {
      effects.consume(code3);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code3);
    effects.exit("lineEnding");
    return factorySpace(effects, contentStart, "linePrefix");
  }
  function paragraphInitial(code3) {
    effects.enter("paragraph");
    return lineStart(code3);
  }
  function lineStart(code3) {
    const token = effects.enter("chunkText", {
      contentType: "text",
      previous: previous3
    });
    if (previous3) {
      previous3.next = token;
    }
    previous3 = token;
    return data2(code3);
  }
  function data2(code3) {
    if (code3 === null) {
      effects.exit("chunkText");
      effects.exit("paragraph");
      effects.consume(code3);
      return;
    }
    if (markdownLineEnding(code3)) {
      effects.consume(code3);
      effects.exit("chunkText");
      return lineStart;
    }
    effects.consume(code3);
    return data2;
  }
}

// node_modules/micromark/lib/initialize/document.js
var document2 = {
  tokenize: initializeDocument
};
var containerConstruct = {
  tokenize: tokenizeContainer
};
function initializeDocument(effects) {
  const self = this;
  const stack = [];
  let continued = 0;
  let childFlow;
  let childToken;
  let lineStartOffset;
  return start;
  function start(code3) {
    if (continued < stack.length) {
      const item = stack[continued];
      self.containerState = item[1];
      return effects.attempt(
        item[0].continuation,
        documentContinue,
        checkNewContainers
      )(code3);
    }
    return checkNewContainers(code3);
  }
  function documentContinue(code3) {
    continued++;
    if (self.containerState._closeFlow) {
      self.containerState._closeFlow = void 0;
      if (childFlow) {
        closeFlow();
      }
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let point4;
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          point4 = self.events[indexBeforeFlow][1].end;
          break;
        }
      }
      exitContainers(continued);
      let index2 = indexBeforeExits;
      while (index2 < self.events.length) {
        self.events[index2][1].end = Object.assign({}, point4);
        index2++;
      }
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );
      self.events.length = index2;
      return checkNewContainers(code3);
    }
    return start(code3);
  }
  function checkNewContainers(code3) {
    if (continued === stack.length) {
      if (!childFlow) {
        return documentContinued(code3);
      }
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code3);
      }
      self.interrupt = Boolean(
        childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
      );
    }
    self.containerState = {};
    return effects.check(
      containerConstruct,
      thereIsANewContainer,
      thereIsNoNewContainer
    )(code3);
  }
  function thereIsANewContainer(code3) {
    if (childFlow)
      closeFlow();
    exitContainers(continued);
    return documentContinued(code3);
  }
  function thereIsNoNewContainer(code3) {
    self.parser.lazy[self.now().line] = continued !== stack.length;
    lineStartOffset = self.now().offset;
    return flowStart(code3);
  }
  function documentContinued(code3) {
    self.containerState = {};
    return effects.attempt(
      containerConstruct,
      containerContinue,
      flowStart
    )(code3);
  }
  function containerContinue(code3) {
    continued++;
    stack.push([self.currentConstruct, self.containerState]);
    return documentContinued(code3);
  }
  function flowStart(code3) {
    if (code3 === null) {
      if (childFlow)
        closeFlow();
      exitContainers(0);
      effects.consume(code3);
      return;
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter("chunkFlow", {
      contentType: "flow",
      previous: childToken,
      _tokenizer: childFlow
    });
    return flowContinue(code3);
  }
  function flowContinue(code3) {
    if (code3 === null) {
      writeToChild(effects.exit("chunkFlow"), true);
      exitContainers(0);
      effects.consume(code3);
      return;
    }
    if (markdownLineEnding(code3)) {
      effects.consume(code3);
      writeToChild(effects.exit("chunkFlow"));
      continued = 0;
      self.interrupt = void 0;
      return start;
    }
    effects.consume(code3);
    return flowContinue;
  }
  function writeToChild(token, eof) {
    const stream = self.sliceStream(token);
    if (eof)
      stream.push(null);
    token.previous = childToken;
    if (childToken)
      childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);
    if (self.parser.lazy[token.start.line]) {
      let index2 = childFlow.events.length;
      while (index2--) {
        if (
          // The token starts before the line ending…
          childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
          (!childFlow.events[index2][1].end || // …or ends after it.
          childFlow.events[index2][1].end.offset > lineStartOffset)
        ) {
          return;
        }
      }
      const indexBeforeExits = self.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let seen;
      let point4;
      while (indexBeforeFlow--) {
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          if (seen) {
            point4 = self.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      }
      exitContainers(continued);
      index2 = indexBeforeExits;
      while (index2 < self.events.length) {
        self.events[index2][1].end = Object.assign({}, point4);
        index2++;
      }
      splice(
        self.events,
        indexBeforeFlow + 1,
        0,
        self.events.slice(indexBeforeExits)
      );
      self.events.length = index2;
    }
  }
  function exitContainers(size) {
    let index2 = stack.length;
    while (index2-- > size) {
      const entry = stack[index2];
      self.containerState = entry[1];
      entry[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]);
    childToken = void 0;
    childFlow = void 0;
    self.containerState._closeFlow = void 0;
  }
}
function tokenizeContainer(effects, ok2, nok) {
  return factorySpace(
    effects,
    effects.attempt(this.parser.constructs.document, ok2, nok),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
  );
}

// node_modules/micromark-util-classify-character/index.js
function classifyCharacter(code3) {
  if (code3 === null || markdownLineEndingOrSpace(code3) || unicodeWhitespace(code3)) {
    return 1;
  }
  if (unicodePunctuation(code3)) {
    return 2;
  }
}

// node_modules/micromark-util-resolve-all/index.js
function resolveAll(constructs2, events, context) {
  const called = [];
  let index2 = -1;
  while (++index2 < constructs2.length) {
    const resolve = constructs2[index2].resolveAll;
    if (resolve && !called.includes(resolve)) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }
  return events;
}

// node_modules/micromark-core-commonmark/lib/attention.js
var attention = {
  name: "attention",
  tokenize: tokenizeAttention,
  resolveAll: resolveAllAttention
};
function resolveAllAttention(events, context) {
  let index2 = -1;
  let open;
  let group;
  let text6;
  let openingSequence;
  let closingSequence;
  let use;
  let nextEvents;
  let offset;
  while (++index2 < events.length) {
    if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
      open = index2;
      while (open--) {
        if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
          if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
            continue;
          }
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
          const start = Object.assign({}, events[open][1].end);
          const end = Object.assign({}, events[index2][1].start);
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: Object.assign({}, events[open][1].end)
          };
          closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: Object.assign({}, events[index2][1].start),
            end
          };
          text6 = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: Object.assign({}, events[open][1].end),
            end: Object.assign({}, events[index2][1].start)
          };
          group = {
            type: use > 1 ? "strong" : "emphasis",
            start: Object.assign({}, openingSequence.start),
            end: Object.assign({}, closingSequence.end)
          };
          events[open][1].end = Object.assign({}, openingSequence.start);
          events[index2][1].start = Object.assign({}, closingSequence.end);
          nextEvents = [];
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [
              ["enter", events[open][1], context],
              ["exit", events[open][1], context]
            ]);
          }
          nextEvents = push(nextEvents, [
            ["enter", group, context],
            ["enter", openingSequence, context],
            ["exit", openingSequence, context],
            ["enter", text6, context]
          ]);
          nextEvents = push(
            nextEvents,
            resolveAll(
              context.parser.constructs.insideSpan.null,
              events.slice(open + 1, index2),
              context
            )
          );
          nextEvents = push(nextEvents, [
            ["exit", text6, context],
            ["enter", closingSequence, context],
            ["exit", closingSequence, context],
            ["exit", group, context]
          ]);
          if (events[index2][1].end.offset - events[index2][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [
              ["enter", events[index2][1], context],
              ["exit", events[index2][1], context]
            ]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index2 - open + 3, nextEvents);
          index2 = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }
  index2 = -1;
  while (++index2 < events.length) {
    if (events[index2][1].type === "attentionSequence") {
      events[index2][1].type = "data";
    }
  }
  return events;
}
function tokenizeAttention(effects, ok2) {
  const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
  const previous3 = this.previous;
  const before = classifyCharacter(previous3);
  let marker;
  return start;
  function start(code3) {
    effects.enter("attentionSequence");
    marker = code3;
    return sequence(code3);
  }
  function sequence(code3) {
    if (code3 === marker) {
      effects.consume(code3);
      return sequence;
    }
    const token = effects.exit("attentionSequence");
    const after = classifyCharacter(code3);
    const open = !after || after === 2 && before || attentionMarkers2.includes(code3);
    const close = !before || before === 2 && after || attentionMarkers2.includes(previous3);
    token._open = Boolean(marker === 42 ? open : open && (before || !close));
    token._close = Boolean(marker === 42 ? close : close && (after || !open));
    return ok2(code3);
  }
}
function movePoint(point4, offset) {
  point4.column += offset;
  point4.offset += offset;
  point4._bufferIndex += offset;
}

// node_modules/micromark-core-commonmark/lib/autolink.js
var autolink = {
  name: "autolink",
  tokenize: tokenizeAutolink
};
function tokenizeAutolink(effects, ok2, nok) {
  let size = 1;
  return start;
  function start(code3) {
    effects.enter("autolink");
    effects.enter("autolinkMarker");
    effects.consume(code3);
    effects.exit("autolinkMarker");
    effects.enter("autolinkProtocol");
    return open;
  }
  function open(code3) {
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      return schemeOrEmailAtext;
    }
    return asciiAtext(code3) ? emailAtext(code3) : nok(code3);
  }
  function schemeOrEmailAtext(code3) {
    return code3 === 43 || code3 === 45 || code3 === 46 || asciiAlphanumeric(code3) ? schemeInsideOrEmailAtext(code3) : emailAtext(code3);
  }
  function schemeInsideOrEmailAtext(code3) {
    if (code3 === 58) {
      effects.consume(code3);
      return urlInside;
    }
    if ((code3 === 43 || code3 === 45 || code3 === 46 || asciiAlphanumeric(code3)) && size++ < 32) {
      effects.consume(code3);
      return schemeInsideOrEmailAtext;
    }
    return emailAtext(code3);
  }
  function urlInside(code3) {
    if (code3 === 62) {
      effects.exit("autolinkProtocol");
      return end(code3);
    }
    if (code3 === null || code3 === 32 || code3 === 60 || asciiControl(code3)) {
      return nok(code3);
    }
    effects.consume(code3);
    return urlInside;
  }
  function emailAtext(code3) {
    if (code3 === 64) {
      effects.consume(code3);
      size = 0;
      return emailAtSignOrDot;
    }
    if (asciiAtext(code3)) {
      effects.consume(code3);
      return emailAtext;
    }
    return nok(code3);
  }
  function emailAtSignOrDot(code3) {
    return asciiAlphanumeric(code3) ? emailLabel(code3) : nok(code3);
  }
  function emailLabel(code3) {
    if (code3 === 46) {
      effects.consume(code3);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code3 === 62) {
      effects.exit("autolinkProtocol").type = "autolinkEmail";
      return end(code3);
    }
    return emailValue(code3);
  }
  function emailValue(code3) {
    if ((code3 === 45 || asciiAlphanumeric(code3)) && size++ < 63) {
      effects.consume(code3);
      return code3 === 45 ? emailValue : emailLabel;
    }
    return nok(code3);
  }
  function end(code3) {
    effects.enter("autolinkMarker");
    effects.consume(code3);
    effects.exit("autolinkMarker");
    effects.exit("autolink");
    return ok2;
  }
}

// node_modules/micromark-core-commonmark/lib/blank-line.js
var blankLine = {
  tokenize: tokenizeBlankLine,
  partial: true
};
function tokenizeBlankLine(effects, ok2, nok) {
  return factorySpace(effects, afterWhitespace, "linePrefix");
  function afterWhitespace(code3) {
    return code3 === null || markdownLineEnding(code3) ? ok2(code3) : nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/block-quote.js
var blockQuote = {
  name: "blockQuote",
  tokenize: tokenizeBlockQuoteStart,
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit
};
function tokenizeBlockQuoteStart(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    if (code3 === 62) {
      const state = self.containerState;
      if (!state.open) {
        effects.enter("blockQuote", {
          _container: true
        });
        state.open = true;
      }
      effects.enter("blockQuotePrefix");
      effects.enter("blockQuoteMarker");
      effects.consume(code3);
      effects.exit("blockQuoteMarker");
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    if (markdownSpace(code3)) {
      effects.enter("blockQuotePrefixWhitespace");
      effects.consume(code3);
      effects.exit("blockQuotePrefixWhitespace");
      effects.exit("blockQuotePrefix");
      return ok2;
    }
    effects.exit("blockQuotePrefix");
    return ok2(code3);
  }
}
function tokenizeBlockQuoteContinuation(effects, ok2, nok) {
  return factorySpace(
    effects,
    effects.attempt(blockQuote, ok2, nok),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
  );
}
function exit(effects) {
  effects.exit("blockQuote");
}

// node_modules/micromark-core-commonmark/lib/character-escape.js
var characterEscape = {
  name: "characterEscape",
  tokenize: tokenizeCharacterEscape
};
function tokenizeCharacterEscape(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.enter("characterEscape");
    effects.enter("escapeMarker");
    effects.consume(code3);
    effects.exit("escapeMarker");
    return open;
  }
  function open(code3) {
    if (asciiPunctuation(code3)) {
      effects.enter("characterEscapeValue");
      effects.consume(code3);
      effects.exit("characterEscapeValue");
      effects.exit("characterEscape");
      return ok2;
    }
    return nok(code3);
  }
}

// node_modules/decode-named-character-reference/index.dom.js
var element = document.createElement("i");
function decodeNamedCharacterReference(value) {
  const characterReference2 = "&" + value + ";";
  element.innerHTML = characterReference2;
  const char = element.textContent;
  if (char.charCodeAt(char.length - 1) === 59 && value !== "semi") {
    return false;
  }
  return char === characterReference2 ? false : char;
}

// node_modules/micromark-core-commonmark/lib/character-reference.js
var characterReference = {
  name: "characterReference",
  tokenize: tokenizeCharacterReference
};
function tokenizeCharacterReference(effects, ok2, nok) {
  const self = this;
  let size = 0;
  let max;
  let test;
  return start;
  function start(code3) {
    effects.enter("characterReference");
    effects.enter("characterReferenceMarker");
    effects.consume(code3);
    effects.exit("characterReferenceMarker");
    return open;
  }
  function open(code3) {
    if (code3 === 35) {
      effects.enter("characterReferenceMarkerNumeric");
      effects.consume(code3);
      effects.exit("characterReferenceMarkerNumeric");
      return numeric;
    }
    effects.enter("characterReferenceValue");
    max = 31;
    test = asciiAlphanumeric;
    return value(code3);
  }
  function numeric(code3) {
    if (code3 === 88 || code3 === 120) {
      effects.enter("characterReferenceMarkerHexadecimal");
      effects.consume(code3);
      effects.exit("characterReferenceMarkerHexadecimal");
      effects.enter("characterReferenceValue");
      max = 6;
      test = asciiHexDigit;
      return value;
    }
    effects.enter("characterReferenceValue");
    max = 7;
    test = asciiDigit;
    return value(code3);
  }
  function value(code3) {
    let token;
    if (code3 === 59 && size) {
      token = effects.exit("characterReferenceValue");
      if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token))) {
        return nok(code3);
      }
      effects.enter("characterReferenceMarker");
      effects.consume(code3);
      effects.exit("characterReferenceMarker");
      effects.exit("characterReference");
      return ok2;
    }
    if (test(code3) && size++ < max) {
      effects.consume(code3);
      return value;
    }
    return nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/code-fenced.js
var codeFenced = {
  name: "codeFenced",
  tokenize: tokenizeCodeFenced,
  concrete: true
};
function tokenizeCodeFenced(effects, ok2, nok) {
  const self = this;
  const closingFenceConstruct = {
    tokenize: tokenizeClosingFence,
    partial: true
  };
  const nonLazyLine = {
    tokenize: tokenizeNonLazyLine,
    partial: true
  };
  const tail = this.events[this.events.length - 1];
  const initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let sizeOpen = 0;
  let marker;
  return start;
  function start(code3) {
    effects.enter("codeFenced");
    effects.enter("codeFencedFence");
    effects.enter("codeFencedFenceSequence");
    marker = code3;
    return sequenceOpen(code3);
  }
  function sequenceOpen(code3) {
    if (code3 === marker) {
      effects.consume(code3);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit("codeFencedFenceSequence");
    return sizeOpen < 3 ? nok(code3) : factorySpace(effects, infoOpen, "whitespace")(code3);
  }
  function infoOpen(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return openAfter(code3);
    }
    effects.enter("codeFencedFenceInfo");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return info(code3);
  }
  function info(code3) {
    if (code3 === null || markdownLineEndingOrSpace(code3)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceInfo");
      return factorySpace(effects, infoAfter, "whitespace")(code3);
    }
    if (code3 === 96 && code3 === marker)
      return nok(code3);
    effects.consume(code3);
    return info;
  }
  function infoAfter(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return openAfter(code3);
    }
    effects.enter("codeFencedFenceMeta");
    effects.enter("chunkString", {
      contentType: "string"
    });
    return meta(code3);
  }
  function meta(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("chunkString");
      effects.exit("codeFencedFenceMeta");
      return openAfter(code3);
    }
    if (code3 === 96 && code3 === marker)
      return nok(code3);
    effects.consume(code3);
    return meta;
  }
  function openAfter(code3) {
    effects.exit("codeFencedFence");
    return self.interrupt ? ok2(code3) : contentStart(code3);
  }
  function contentStart(code3) {
    if (code3 === null) {
      return after(code3);
    }
    if (markdownLineEnding(code3)) {
      return effects.attempt(
        nonLazyLine,
        effects.attempt(
          closingFenceConstruct,
          after,
          initialPrefix ? factorySpace(
            effects,
            contentStart,
            "linePrefix",
            initialPrefix + 1
          ) : contentStart
        ),
        after
      )(code3);
    }
    effects.enter("codeFlowValue");
    return contentContinue(code3);
  }
  function contentContinue(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("codeFlowValue");
      return contentStart(code3);
    }
    effects.consume(code3);
    return contentContinue;
  }
  function after(code3) {
    effects.exit("codeFenced");
    return ok2(code3);
  }
  function tokenizeNonLazyLine(effects2, ok3, nok2) {
    const self2 = this;
    return start2;
    function start2(code3) {
      effects2.enter("lineEnding");
      effects2.consume(code3);
      effects2.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code3) {
      return self2.parser.lazy[self2.now().line] ? nok2(code3) : ok3(code3);
    }
  }
  function tokenizeClosingFence(effects2, ok3, nok2) {
    let size = 0;
    return factorySpace(
      effects2,
      closingSequenceStart,
      "linePrefix",
      this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    );
    function closingSequenceStart(code3) {
      effects2.enter("codeFencedFence");
      effects2.enter("codeFencedFenceSequence");
      return closingSequence(code3);
    }
    function closingSequence(code3) {
      if (code3 === marker) {
        effects2.consume(code3);
        size++;
        return closingSequence;
      }
      if (size < sizeOpen)
        return nok2(code3);
      effects2.exit("codeFencedFenceSequence");
      return factorySpace(effects2, closingSequenceEnd, "whitespace")(code3);
    }
    function closingSequenceEnd(code3) {
      if (code3 === null || markdownLineEnding(code3)) {
        effects2.exit("codeFencedFence");
        return ok3(code3);
      }
      return nok2(code3);
    }
  }
}

// node_modules/micromark-core-commonmark/lib/code-indented.js
var codeIndented = {
  name: "codeIndented",
  tokenize: tokenizeCodeIndented
};
var indentedContent = {
  tokenize: tokenizeIndentedContent,
  partial: true
};
function tokenizeCodeIndented(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    effects.enter("codeIndented");
    return factorySpace(effects, afterStartPrefix, "linePrefix", 4 + 1)(code3);
  }
  function afterStartPrefix(code3) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? afterPrefix(code3) : nok(code3);
  }
  function afterPrefix(code3) {
    if (code3 === null) {
      return after(code3);
    }
    if (markdownLineEnding(code3)) {
      return effects.attempt(indentedContent, afterPrefix, after)(code3);
    }
    effects.enter("codeFlowValue");
    return content3(code3);
  }
  function content3(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("codeFlowValue");
      return afterPrefix(code3);
    }
    effects.consume(code3);
    return content3;
  }
  function after(code3) {
    effects.exit("codeIndented");
    return ok2(code3);
  }
}
function tokenizeIndentedContent(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    if (self.parser.lazy[self.now().line]) {
      return nok(code3);
    }
    if (markdownLineEnding(code3)) {
      effects.enter("lineEnding");
      effects.consume(code3);
      effects.exit("lineEnding");
      return start;
    }
    return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code3);
  }
  function afterPrefix(code3) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok2(code3) : markdownLineEnding(code3) ? start(code3) : nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/code-text.js
var codeText = {
  name: "codeText",
  tokenize: tokenizeCodeText,
  resolve: resolveCodeText,
  previous
};
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  let index2;
  let enter;
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
    index2 = headEnterIndex;
    while (++index2 < tailExitIndex) {
      if (events[index2][1].type === "codeTextData") {
        events[headEnterIndex][1].type = "codeTextPadding";
        events[tailExitIndex][1].type = "codeTextPadding";
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  index2 = headEnterIndex - 1;
  tailExitIndex++;
  while (++index2 <= tailExitIndex) {
    if (enter === void 0) {
      if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
        enter = index2;
      }
    } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
      events[enter][1].type = "codeTextData";
      if (index2 !== enter + 2) {
        events[enter][1].end = events[index2 - 1][1].end;
        events.splice(enter + 2, index2 - enter - 2);
        tailExitIndex -= index2 - enter - 2;
        index2 = enter + 2;
      }
      enter = void 0;
    }
  }
  return events;
}
function previous(code3) {
  return code3 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function tokenizeCodeText(effects, ok2, nok) {
  const self = this;
  let sizeOpen = 0;
  let size;
  let token;
  return start;
  function start(code3) {
    effects.enter("codeText");
    effects.enter("codeTextSequence");
    return openingSequence(code3);
  }
  function openingSequence(code3) {
    if (code3 === 96) {
      effects.consume(code3);
      sizeOpen++;
      return openingSequence;
    }
    effects.exit("codeTextSequence");
    return gap(code3);
  }
  function gap(code3) {
    if (code3 === null) {
      return nok(code3);
    }
    if (code3 === 96) {
      token = effects.enter("codeTextSequence");
      size = 0;
      return closingSequence(code3);
    }
    if (code3 === 32) {
      effects.enter("space");
      effects.consume(code3);
      effects.exit("space");
      return gap;
    }
    if (markdownLineEnding(code3)) {
      effects.enter("lineEnding");
      effects.consume(code3);
      effects.exit("lineEnding");
      return gap;
    }
    effects.enter("codeTextData");
    return data2(code3);
  }
  function data2(code3) {
    if (code3 === null || code3 === 32 || code3 === 96 || markdownLineEnding(code3)) {
      effects.exit("codeTextData");
      return gap(code3);
    }
    effects.consume(code3);
    return data2;
  }
  function closingSequence(code3) {
    if (code3 === 96) {
      effects.consume(code3);
      size++;
      return closingSequence;
    }
    if (size === sizeOpen) {
      effects.exit("codeTextSequence");
      effects.exit("codeText");
      return ok2(code3);
    }
    token.type = "codeTextData";
    return data2(code3);
  }
}

// node_modules/micromark-util-subtokenize/index.js
function subtokenize(events) {
  const jumps = {};
  let index2 = -1;
  let event;
  let lineIndex;
  let otherIndex;
  let otherEvent;
  let parameters;
  let subevents;
  let more;
  while (++index2 < events.length) {
    while (index2 in jumps) {
      index2 = jumps[index2];
    }
    event = events[index2];
    if (index2 && event[1].type === "chunkFlow" && events[index2 - 1][1].type === "listItemPrefix") {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === "content") {
            break;
          }
          if (subevents[otherIndex][1].type === "chunkText") {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }
    if (event[0] === "enter") {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index2));
        index2 = jumps[index2];
        more = true;
      }
    } else if (event[1]._container) {
      otherIndex = index2;
      lineIndex = void 0;
      while (otherIndex--) {
        otherEvent = events[otherIndex];
        if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
          if (otherEvent[0] === "enter") {
            if (lineIndex) {
              events[lineIndex][1].type = "lineEndingBlank";
            }
            otherEvent[1].type = "lineEnding";
            lineIndex = otherIndex;
          }
        } else {
          break;
        }
      }
      if (lineIndex) {
        event[1].end = Object.assign({}, events[lineIndex][1].start);
        parameters = events.slice(lineIndex, index2);
        parameters.unshift(event);
        splice(events, lineIndex, index2 - lineIndex + 1, parameters);
      }
    }
  }
  return !more;
}
function subcontent(events, eventIndex) {
  const token = events[eventIndex][1];
  const context = events[eventIndex][2];
  let startPosition = eventIndex - 1;
  const startPositions = [];
  const tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
  const childEvents = tokenizer.events;
  const jumps = [];
  const gaps = {};
  let stream;
  let previous3;
  let index2 = -1;
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];
  while (current) {
    while (events[++startPosition][1] !== current) {
    }
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(null);
      }
      if (previous3) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = void 0;
      }
    }
    previous3 = current;
    current = current.next;
  }
  current = token;
  while (++index2 < childEvents.length) {
    if (
      // Find a void token that includes a break.
      childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
    ) {
      start = index2 + 1;
      breaks.push(start);
      current._tokenizer = void 0;
      current.previous = void 0;
      current = current.next;
    }
  }
  tokenizer.events = [];
  if (current) {
    current._tokenizer = void 0;
    current.previous = void 0;
  } else {
    breaks.pop();
  }
  index2 = breaks.length;
  while (index2--) {
    const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
    const start2 = startPositions.pop();
    jumps.unshift([start2, start2 + slice.length - 1]);
    splice(events, start2, 2, slice);
  }
  index2 = -1;
  while (++index2 < jumps.length) {
    gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
    adjust += jumps[index2][1] - jumps[index2][0] - 1;
  }
  return gaps;
}

// node_modules/micromark-core-commonmark/lib/content.js
var content2 = {
  tokenize: tokenizeContent,
  resolve: resolveContent
};
var continuationConstruct = {
  tokenize: tokenizeContinuation,
  partial: true
};
function resolveContent(events) {
  subtokenize(events);
  return events;
}
function tokenizeContent(effects, ok2) {
  let previous3;
  return start;
  function start(code3) {
    effects.enter("content");
    previous3 = effects.enter("chunkContent", {
      contentType: "content"
    });
    return data2(code3);
  }
  function data2(code3) {
    if (code3 === null) {
      return contentEnd(code3);
    }
    if (markdownLineEnding(code3)) {
      return effects.check(
        continuationConstruct,
        contentContinue,
        contentEnd
      )(code3);
    }
    effects.consume(code3);
    return data2;
  }
  function contentEnd(code3) {
    effects.exit("chunkContent");
    effects.exit("content");
    return ok2(code3);
  }
  function contentContinue(code3) {
    effects.consume(code3);
    effects.exit("chunkContent");
    previous3.next = effects.enter("chunkContent", {
      contentType: "content",
      previous: previous3
    });
    previous3 = previous3.next;
    return data2;
  }
}
function tokenizeContinuation(effects, ok2, nok) {
  const self = this;
  return startLookahead;
  function startLookahead(code3) {
    effects.exit("chunkContent");
    effects.enter("lineEnding");
    effects.consume(code3);
    effects.exit("lineEnding");
    return factorySpace(effects, prefixed, "linePrefix");
  }
  function prefixed(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return nok(code3);
    }
    const tail = self.events[self.events.length - 1];
    if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
      return ok2(code3);
    }
    return effects.interrupt(self.parser.constructs.flow, nok, ok2)(code3);
  }
}

// node_modules/micromark-factory-destination/index.js
function factoryDestination(effects, ok2, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;
  function start(code3) {
    if (code3 === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code3);
      effects.exit(literalMarkerType);
      return destinationEnclosedBefore;
    }
    if (code3 === null || code3 === 41 || asciiControl(code3)) {
      return nok(code3);
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return destinationRaw(code3);
  }
  function destinationEnclosedBefore(code3) {
    if (code3 === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code3);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok2;
    }
    effects.enter(stringType);
    effects.enter("chunkString", {
      contentType: "string"
    });
    return destinationEnclosed(code3);
  }
  function destinationEnclosed(code3) {
    if (code3 === 62) {
      effects.exit("chunkString");
      effects.exit(stringType);
      return destinationEnclosedBefore(code3);
    }
    if (code3 === null || code3 === 60 || markdownLineEnding(code3)) {
      return nok(code3);
    }
    effects.consume(code3);
    return code3 === 92 ? destinationEnclosedEscape : destinationEnclosed;
  }
  function destinationEnclosedEscape(code3) {
    if (code3 === 60 || code3 === 62 || code3 === 92) {
      effects.consume(code3);
      return destinationEnclosed;
    }
    return destinationEnclosed(code3);
  }
  function destinationRaw(code3) {
    if (code3 === 40) {
      if (++balance > limit)
        return nok(code3);
      effects.consume(code3);
      return destinationRaw;
    }
    if (code3 === 41) {
      if (!balance--) {
        effects.exit("chunkString");
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok2(code3);
      }
      effects.consume(code3);
      return destinationRaw;
    }
    if (code3 === null || markdownLineEndingOrSpace(code3)) {
      if (balance)
        return nok(code3);
      effects.exit("chunkString");
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok2(code3);
    }
    if (asciiControl(code3))
      return nok(code3);
    effects.consume(code3);
    return code3 === 92 ? destinationRawEscape : destinationRaw;
  }
  function destinationRawEscape(code3) {
    if (code3 === 40 || code3 === 41 || code3 === 92) {
      effects.consume(code3);
      return destinationRaw;
    }
    return destinationRaw(code3);
  }
}

// node_modules/micromark-factory-label/index.js
function factoryLabel(effects, ok2, nok, type, markerType, stringType) {
  const self = this;
  let size = 0;
  let data2;
  return start;
  function start(code3) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code3);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  function atBreak(code3) {
    if (code3 === null || code3 === 91 || code3 === 93 && !data2 || /* To do: remove in the future once we’ve switched from
     * `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
     * which doesn’t need this */
    /* Hidden footnotes hook */
    /* c8 ignore next 3 */
    code3 === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs || size > 999) {
      return nok(code3);
    }
    if (code3 === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code3);
      effects.exit(markerType);
      effects.exit(type);
      return ok2;
    }
    if (markdownLineEnding(code3)) {
      effects.enter("lineEnding");
      effects.consume(code3);
      effects.exit("lineEnding");
      return atBreak;
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return label(code3);
  }
  function label(code3) {
    if (code3 === null || code3 === 91 || code3 === 93 || markdownLineEnding(code3) || size++ > 999) {
      effects.exit("chunkString");
      return atBreak(code3);
    }
    effects.consume(code3);
    data2 = data2 || !markdownSpace(code3);
    return code3 === 92 ? labelEscape : label;
  }
  function labelEscape(code3) {
    if (code3 === 91 || code3 === 92 || code3 === 93) {
      effects.consume(code3);
      size++;
      return label;
    }
    return label(code3);
  }
}

// node_modules/micromark-factory-title/index.js
function factoryTitle(effects, ok2, nok, type, markerType, stringType) {
  let marker;
  return start;
  function start(code3) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code3);
    effects.exit(markerType);
    marker = code3 === 40 ? 41 : code3;
    return atFirstTitleBreak;
  }
  function atFirstTitleBreak(code3) {
    if (code3 === marker) {
      effects.enter(markerType);
      effects.consume(code3);
      effects.exit(markerType);
      effects.exit(type);
      return ok2;
    }
    effects.enter(stringType);
    return atTitleBreak(code3);
  }
  function atTitleBreak(code3) {
    if (code3 === marker) {
      effects.exit(stringType);
      return atFirstTitleBreak(marker);
    }
    if (code3 === null) {
      return nok(code3);
    }
    if (markdownLineEnding(code3)) {
      effects.enter("lineEnding");
      effects.consume(code3);
      effects.exit("lineEnding");
      return factorySpace(effects, atTitleBreak, "linePrefix");
    }
    effects.enter("chunkString", {
      contentType: "string"
    });
    return title(code3);
  }
  function title(code3) {
    if (code3 === marker || code3 === null || markdownLineEnding(code3)) {
      effects.exit("chunkString");
      return atTitleBreak(code3);
    }
    effects.consume(code3);
    return code3 === 92 ? titleEscape : title;
  }
  function titleEscape(code3) {
    if (code3 === marker || code3 === 92) {
      effects.consume(code3);
      return title;
    }
    return title(code3);
  }
}

// node_modules/micromark-factory-whitespace/index.js
function factoryWhitespace(effects, ok2) {
  let seen;
  return start;
  function start(code3) {
    if (markdownLineEnding(code3)) {
      effects.enter("lineEnding");
      effects.consume(code3);
      effects.exit("lineEnding");
      seen = true;
      return start;
    }
    if (markdownSpace(code3)) {
      return factorySpace(
        effects,
        start,
        seen ? "linePrefix" : "lineSuffix"
      )(code3);
    }
    return ok2(code3);
  }
}

// node_modules/micromark-util-normalize-identifier/index.js
function normalizeIdentifier(value) {
  return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}

// node_modules/micromark-core-commonmark/lib/definition.js
var definition = {
  name: "definition",
  tokenize: tokenizeDefinition
};
var titleConstruct = {
  tokenize: tokenizeTitle,
  partial: true
};
function tokenizeDefinition(effects, ok2, nok) {
  const self = this;
  let identifier;
  return start;
  function start(code3) {
    effects.enter("definition");
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      nok,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(code3);
  }
  function labelAfter(code3) {
    identifier = normalizeIdentifier(
      self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
    );
    if (code3 === 58) {
      effects.enter("definitionMarker");
      effects.consume(code3);
      effects.exit("definitionMarker");
      return factoryWhitespace(
        effects,
        factoryDestination(
          effects,
          effects.attempt(
            titleConstruct,
            factorySpace(effects, after, "whitespace"),
            factorySpace(effects, after, "whitespace")
          ),
          nok,
          "definitionDestination",
          "definitionDestinationLiteral",
          "definitionDestinationLiteralMarker",
          "definitionDestinationRaw",
          "definitionDestinationString"
        )
      );
    }
    return nok(code3);
  }
  function after(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("definition");
      if (!self.parser.defined.includes(identifier)) {
        self.parser.defined.push(identifier);
      }
      return ok2(code3);
    }
    return nok(code3);
  }
}
function tokenizeTitle(effects, ok2, nok) {
  return start;
  function start(code3) {
    return markdownLineEndingOrSpace(code3) ? factoryWhitespace(effects, before)(code3) : nok(code3);
  }
  function before(code3) {
    if (code3 === 34 || code3 === 39 || code3 === 40) {
      return factoryTitle(
        effects,
        factorySpace(effects, after, "whitespace"),
        nok,
        "definitionTitle",
        "definitionTitleMarker",
        "definitionTitleString"
      )(code3);
    }
    return nok(code3);
  }
  function after(code3) {
    return code3 === null || markdownLineEnding(code3) ? ok2(code3) : nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/hard-break-escape.js
var hardBreakEscape = {
  name: "hardBreakEscape",
  tokenize: tokenizeHardBreakEscape
};
function tokenizeHardBreakEscape(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.enter("hardBreakEscape");
    effects.enter("escapeMarker");
    effects.consume(code3);
    return open;
  }
  function open(code3) {
    if (markdownLineEnding(code3)) {
      effects.exit("escapeMarker");
      effects.exit("hardBreakEscape");
      return ok2(code3);
    }
    return nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/heading-atx.js
var headingAtx = {
  name: "headingAtx",
  tokenize: tokenizeHeadingAtx,
  resolve: resolveHeadingAtx
};
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  let content3;
  let text6;
  if (events[contentStart][1].type === "whitespace") {
    contentStart += 2;
  }
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content3 = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text6 = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      // @ts-expect-error Constants are fine to assign.
      contentType: "text"
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [
      ["enter", content3, context],
      ["enter", text6, context],
      ["exit", text6, context],
      ["exit", content3, context]
    ]);
  }
  return events;
}
function tokenizeHeadingAtx(effects, ok2, nok) {
  const self = this;
  let size = 0;
  return start;
  function start(code3) {
    effects.enter("atxHeading");
    effects.enter("atxHeadingSequence");
    return fenceOpenInside(code3);
  }
  function fenceOpenInside(code3) {
    if (code3 === 35 && size++ < 6) {
      effects.consume(code3);
      return fenceOpenInside;
    }
    if (code3 === null || markdownLineEndingOrSpace(code3)) {
      effects.exit("atxHeadingSequence");
      return self.interrupt ? ok2(code3) : headingBreak(code3);
    }
    return nok(code3);
  }
  function headingBreak(code3) {
    if (code3 === 35) {
      effects.enter("atxHeadingSequence");
      return sequence(code3);
    }
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("atxHeading");
      return ok2(code3);
    }
    if (markdownSpace(code3)) {
      return factorySpace(effects, headingBreak, "whitespace")(code3);
    }
    effects.enter("atxHeadingText");
    return data2(code3);
  }
  function sequence(code3) {
    if (code3 === 35) {
      effects.consume(code3);
      return sequence;
    }
    effects.exit("atxHeadingSequence");
    return headingBreak(code3);
  }
  function data2(code3) {
    if (code3 === null || code3 === 35 || markdownLineEndingOrSpace(code3)) {
      effects.exit("atxHeadingText");
      return headingBreak(code3);
    }
    effects.consume(code3);
    return data2;
  }
}

// node_modules/micromark-util-html-tag-name/index.js
var htmlBlockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
];
var htmlRawNames = ["pre", "script", "style", "textarea"];

// node_modules/micromark-core-commonmark/lib/html-flow.js
var htmlFlow = {
  name: "htmlFlow",
  tokenize: tokenizeHtmlFlow,
  resolveTo: resolveToHtmlFlow,
  concrete: true
};
var nextBlankConstruct = {
  tokenize: tokenizeNextBlank,
  partial: true
};
function resolveToHtmlFlow(events) {
  let index2 = events.length;
  while (index2--) {
    if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
      break;
    }
  }
  if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
    events[index2][1].start = events[index2 - 2][1].start;
    events[index2 + 1][1].start = events[index2 - 2][1].start;
    events.splice(index2 - 2, 2);
  }
  return events;
}
function tokenizeHtmlFlow(effects, ok2, nok) {
  const self = this;
  let kind;
  let startTag;
  let buffer2;
  let index2;
  let marker;
  return start;
  function start(code3) {
    effects.enter("htmlFlow");
    effects.enter("htmlFlowData");
    effects.consume(code3);
    return open;
  }
  function open(code3) {
    if (code3 === 33) {
      effects.consume(code3);
      return declarationStart;
    }
    if (code3 === 47) {
      effects.consume(code3);
      return tagCloseStart;
    }
    if (code3 === 63) {
      effects.consume(code3);
      kind = 3;
      return self.interrupt ? ok2 : continuationDeclarationInside;
    }
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      buffer2 = String.fromCharCode(code3);
      startTag = true;
      return tagName;
    }
    return nok(code3);
  }
  function declarationStart(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      kind = 2;
      return commentOpenInside;
    }
    if (code3 === 91) {
      effects.consume(code3);
      kind = 5;
      buffer2 = "CDATA[";
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      kind = 4;
      return self.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code3);
  }
  function commentOpenInside(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return self.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code3);
  }
  function cdataOpenInside(code3) {
    if (code3 === buffer2.charCodeAt(index2++)) {
      effects.consume(code3);
      return index2 === buffer2.length ? self.interrupt ? ok2 : continuation : cdataOpenInside;
    }
    return nok(code3);
  }
  function tagCloseStart(code3) {
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      buffer2 = String.fromCharCode(code3);
      return tagName;
    }
    return nok(code3);
  }
  function tagName(code3) {
    if (code3 === null || code3 === 47 || code3 === 62 || markdownLineEndingOrSpace(code3)) {
      if (code3 !== 47 && startTag && htmlRawNames.includes(buffer2.toLowerCase())) {
        kind = 1;
        return self.interrupt ? ok2(code3) : continuation(code3);
      }
      if (htmlBlockNames.includes(buffer2.toLowerCase())) {
        kind = 6;
        if (code3 === 47) {
          effects.consume(code3);
          return basicSelfClosing;
        }
        return self.interrupt ? ok2(code3) : continuation(code3);
      }
      kind = 7;
      return self.interrupt && !self.parser.lazy[self.now().line] ? nok(code3) : startTag ? completeAttributeNameBefore(code3) : completeClosingTagAfter(code3);
    }
    if (code3 === 45 || asciiAlphanumeric(code3)) {
      effects.consume(code3);
      buffer2 += String.fromCharCode(code3);
      return tagName;
    }
    return nok(code3);
  }
  function basicSelfClosing(code3) {
    if (code3 === 62) {
      effects.consume(code3);
      return self.interrupt ? ok2 : continuation;
    }
    return nok(code3);
  }
  function completeClosingTagAfter(code3) {
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return completeClosingTagAfter;
    }
    return completeEnd(code3);
  }
  function completeAttributeNameBefore(code3) {
    if (code3 === 47) {
      effects.consume(code3);
      return completeEnd;
    }
    if (code3 === 58 || code3 === 95 || asciiAlpha(code3)) {
      effects.consume(code3);
      return completeAttributeName;
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return completeAttributeNameBefore;
    }
    return completeEnd(code3);
  }
  function completeAttributeName(code3) {
    if (code3 === 45 || code3 === 46 || code3 === 58 || code3 === 95 || asciiAlphanumeric(code3)) {
      effects.consume(code3);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code3);
  }
  function completeAttributeNameAfter(code3) {
    if (code3 === 61) {
      effects.consume(code3);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code3);
  }
  function completeAttributeValueBefore(code3) {
    if (code3 === null || code3 === 60 || code3 === 61 || code3 === 62 || code3 === 96) {
      return nok(code3);
    }
    if (code3 === 34 || code3 === 39) {
      effects.consume(code3);
      marker = code3;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return completeAttributeValueBefore;
    }
    marker = null;
    return completeAttributeValueUnquoted(code3);
  }
  function completeAttributeValueQuoted(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return nok(code3);
    }
    if (code3 === marker) {
      effects.consume(code3);
      return completeAttributeValueQuotedAfter;
    }
    effects.consume(code3);
    return completeAttributeValueQuoted;
  }
  function completeAttributeValueUnquoted(code3) {
    if (code3 === null || code3 === 34 || code3 === 39 || code3 === 60 || code3 === 61 || code3 === 62 || code3 === 96 || markdownLineEndingOrSpace(code3)) {
      return completeAttributeNameAfter(code3);
    }
    effects.consume(code3);
    return completeAttributeValueUnquoted;
  }
  function completeAttributeValueQuotedAfter(code3) {
    if (code3 === 47 || code3 === 62 || markdownSpace(code3)) {
      return completeAttributeNameBefore(code3);
    }
    return nok(code3);
  }
  function completeEnd(code3) {
    if (code3 === 62) {
      effects.consume(code3);
      return completeAfter;
    }
    return nok(code3);
  }
  function completeAfter(code3) {
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return completeAfter;
    }
    return code3 === null || markdownLineEnding(code3) ? continuation(code3) : nok(code3);
  }
  function continuation(code3) {
    if (code3 === 45 && kind === 2) {
      effects.consume(code3);
      return continuationCommentInside;
    }
    if (code3 === 60 && kind === 1) {
      effects.consume(code3);
      return continuationRawTagOpen;
    }
    if (code3 === 62 && kind === 4) {
      effects.consume(code3);
      return continuationClose;
    }
    if (code3 === 63 && kind === 3) {
      effects.consume(code3);
      return continuationDeclarationInside;
    }
    if (code3 === 93 && kind === 5) {
      effects.consume(code3);
      return continuationCharacterDataInside;
    }
    if (markdownLineEnding(code3) && (kind === 6 || kind === 7)) {
      return effects.check(
        nextBlankConstruct,
        continuationClose,
        continuationAtLineEnding
      )(code3);
    }
    if (code3 === null || markdownLineEnding(code3)) {
      return continuationAtLineEnding(code3);
    }
    effects.consume(code3);
    return continuation;
  }
  function continuationAtLineEnding(code3) {
    effects.exit("htmlFlowData");
    return htmlContinueStart(code3);
  }
  function htmlContinueStart(code3) {
    if (code3 === null) {
      return done(code3);
    }
    if (markdownLineEnding(code3)) {
      return effects.attempt(
        {
          tokenize: htmlLineEnd,
          partial: true
        },
        htmlContinueStart,
        done
      )(code3);
    }
    effects.enter("htmlFlowData");
    return continuation(code3);
  }
  function htmlLineEnd(effects2, ok3, nok2) {
    return start2;
    function start2(code3) {
      effects2.enter("lineEnding");
      effects2.consume(code3);
      effects2.exit("lineEnding");
      return lineStart;
    }
    function lineStart(code3) {
      return self.parser.lazy[self.now().line] ? nok2(code3) : ok3(code3);
    }
  }
  function continuationCommentInside(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return continuationDeclarationInside;
    }
    return continuation(code3);
  }
  function continuationRawTagOpen(code3) {
    if (code3 === 47) {
      effects.consume(code3);
      buffer2 = "";
      return continuationRawEndTag;
    }
    return continuation(code3);
  }
  function continuationRawEndTag(code3) {
    if (code3 === 62 && htmlRawNames.includes(buffer2.toLowerCase())) {
      effects.consume(code3);
      return continuationClose;
    }
    if (asciiAlpha(code3) && buffer2.length < 8) {
      effects.consume(code3);
      buffer2 += String.fromCharCode(code3);
      return continuationRawEndTag;
    }
    return continuation(code3);
  }
  function continuationCharacterDataInside(code3) {
    if (code3 === 93) {
      effects.consume(code3);
      return continuationDeclarationInside;
    }
    return continuation(code3);
  }
  function continuationDeclarationInside(code3) {
    if (code3 === 62) {
      effects.consume(code3);
      return continuationClose;
    }
    if (code3 === 45 && kind === 2) {
      effects.consume(code3);
      return continuationDeclarationInside;
    }
    return continuation(code3);
  }
  function continuationClose(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("htmlFlowData");
      return done(code3);
    }
    effects.consume(code3);
    return continuationClose;
  }
  function done(code3) {
    effects.exit("htmlFlow");
    return ok2(code3);
  }
}
function tokenizeNextBlank(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.exit("htmlFlowData");
    effects.enter("lineEndingBlank");
    effects.consume(code3);
    effects.exit("lineEndingBlank");
    return effects.attempt(blankLine, ok2, nok);
  }
}

// node_modules/micromark-core-commonmark/lib/html-text.js
var htmlText = {
  name: "htmlText",
  tokenize: tokenizeHtmlText
};
function tokenizeHtmlText(effects, ok2, nok) {
  const self = this;
  let marker;
  let buffer2;
  let index2;
  let returnState;
  return start;
  function start(code3) {
    effects.enter("htmlText");
    effects.enter("htmlTextData");
    effects.consume(code3);
    return open;
  }
  function open(code3) {
    if (code3 === 33) {
      effects.consume(code3);
      return declarationOpen;
    }
    if (code3 === 47) {
      effects.consume(code3);
      return tagCloseStart;
    }
    if (code3 === 63) {
      effects.consume(code3);
      return instruction;
    }
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      return tagOpen;
    }
    return nok(code3);
  }
  function declarationOpen(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return commentOpen;
    }
    if (code3 === 91) {
      effects.consume(code3);
      buffer2 = "CDATA[";
      index2 = 0;
      return cdataOpen;
    }
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      return declaration;
    }
    return nok(code3);
  }
  function commentOpen(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return commentStart;
    }
    return nok(code3);
  }
  function commentStart(code3) {
    if (code3 === null || code3 === 62) {
      return nok(code3);
    }
    if (code3 === 45) {
      effects.consume(code3);
      return commentStartDash;
    }
    return comment2(code3);
  }
  function commentStartDash(code3) {
    if (code3 === null || code3 === 62) {
      return nok(code3);
    }
    return comment2(code3);
  }
  function comment2(code3) {
    if (code3 === null) {
      return nok(code3);
    }
    if (code3 === 45) {
      effects.consume(code3);
      return commentClose;
    }
    if (markdownLineEnding(code3)) {
      returnState = comment2;
      return atLineEnding(code3);
    }
    effects.consume(code3);
    return comment2;
  }
  function commentClose(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return end;
    }
    return comment2(code3);
  }
  function cdataOpen(code3) {
    if (code3 === buffer2.charCodeAt(index2++)) {
      effects.consume(code3);
      return index2 === buffer2.length ? cdata : cdataOpen;
    }
    return nok(code3);
  }
  function cdata(code3) {
    if (code3 === null) {
      return nok(code3);
    }
    if (code3 === 93) {
      effects.consume(code3);
      return cdataClose;
    }
    if (markdownLineEnding(code3)) {
      returnState = cdata;
      return atLineEnding(code3);
    }
    effects.consume(code3);
    return cdata;
  }
  function cdataClose(code3) {
    if (code3 === 93) {
      effects.consume(code3);
      return cdataEnd;
    }
    return cdata(code3);
  }
  function cdataEnd(code3) {
    if (code3 === 62) {
      return end(code3);
    }
    if (code3 === 93) {
      effects.consume(code3);
      return cdataEnd;
    }
    return cdata(code3);
  }
  function declaration(code3) {
    if (code3 === null || code3 === 62) {
      return end(code3);
    }
    if (markdownLineEnding(code3)) {
      returnState = declaration;
      return atLineEnding(code3);
    }
    effects.consume(code3);
    return declaration;
  }
  function instruction(code3) {
    if (code3 === null) {
      return nok(code3);
    }
    if (code3 === 63) {
      effects.consume(code3);
      return instructionClose;
    }
    if (markdownLineEnding(code3)) {
      returnState = instruction;
      return atLineEnding(code3);
    }
    effects.consume(code3);
    return instruction;
  }
  function instructionClose(code3) {
    return code3 === 62 ? end(code3) : instruction(code3);
  }
  function tagCloseStart(code3) {
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      return tagClose;
    }
    return nok(code3);
  }
  function tagClose(code3) {
    if (code3 === 45 || asciiAlphanumeric(code3)) {
      effects.consume(code3);
      return tagClose;
    }
    return tagCloseBetween(code3);
  }
  function tagCloseBetween(code3) {
    if (markdownLineEnding(code3)) {
      returnState = tagCloseBetween;
      return atLineEnding(code3);
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return tagCloseBetween;
    }
    return end(code3);
  }
  function tagOpen(code3) {
    if (code3 === 45 || asciiAlphanumeric(code3)) {
      effects.consume(code3);
      return tagOpen;
    }
    if (code3 === 47 || code3 === 62 || markdownLineEndingOrSpace(code3)) {
      return tagOpenBetween(code3);
    }
    return nok(code3);
  }
  function tagOpenBetween(code3) {
    if (code3 === 47) {
      effects.consume(code3);
      return end;
    }
    if (code3 === 58 || code3 === 95 || asciiAlpha(code3)) {
      effects.consume(code3);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding(code3)) {
      returnState = tagOpenBetween;
      return atLineEnding(code3);
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return tagOpenBetween;
    }
    return end(code3);
  }
  function tagOpenAttributeName(code3) {
    if (code3 === 45 || code3 === 46 || code3 === 58 || code3 === 95 || asciiAlphanumeric(code3)) {
      effects.consume(code3);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code3);
  }
  function tagOpenAttributeNameAfter(code3) {
    if (code3 === 61) {
      effects.consume(code3);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding(code3)) {
      returnState = tagOpenAttributeNameAfter;
      return atLineEnding(code3);
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code3);
  }
  function tagOpenAttributeValueBefore(code3) {
    if (code3 === null || code3 === 60 || code3 === 61 || code3 === 62 || code3 === 96) {
      return nok(code3);
    }
    if (code3 === 34 || code3 === 39) {
      effects.consume(code3);
      marker = code3;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding(code3)) {
      returnState = tagOpenAttributeValueBefore;
      return atLineEnding(code3);
    }
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code3);
    marker = void 0;
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code3) {
    if (code3 === marker) {
      effects.consume(code3);
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code3 === null) {
      return nok(code3);
    }
    if (markdownLineEnding(code3)) {
      returnState = tagOpenAttributeValueQuoted;
      return atLineEnding(code3);
    }
    effects.consume(code3);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueQuotedAfter(code3) {
    if (code3 === 62 || code3 === 47 || markdownLineEndingOrSpace(code3)) {
      return tagOpenBetween(code3);
    }
    return nok(code3);
  }
  function tagOpenAttributeValueUnquoted(code3) {
    if (code3 === null || code3 === 34 || code3 === 39 || code3 === 60 || code3 === 61 || code3 === 96) {
      return nok(code3);
    }
    if (code3 === 62 || markdownLineEndingOrSpace(code3)) {
      return tagOpenBetween(code3);
    }
    effects.consume(code3);
    return tagOpenAttributeValueUnquoted;
  }
  function atLineEnding(code3) {
    effects.exit("htmlTextData");
    effects.enter("lineEnding");
    effects.consume(code3);
    effects.exit("lineEnding");
    return factorySpace(
      effects,
      afterPrefix,
      "linePrefix",
      self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    );
  }
  function afterPrefix(code3) {
    effects.enter("htmlTextData");
    return returnState(code3);
  }
  function end(code3) {
    if (code3 === 62) {
      effects.consume(code3);
      effects.exit("htmlTextData");
      effects.exit("htmlText");
      return ok2;
    }
    return nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/label-end.js
var labelEnd = {
  name: "labelEnd",
  tokenize: tokenizeLabelEnd,
  resolveTo: resolveToLabelEnd,
  resolveAll: resolveAllLabelEnd
};
var resourceConstruct = {
  tokenize: tokenizeResource
};
var fullReferenceConstruct = {
  tokenize: tokenizeFullReference
};
var collapsedReferenceConstruct = {
  tokenize: tokenizeCollapsedReference
};
function resolveAllLabelEnd(events) {
  let index2 = -1;
  let token;
  while (++index2 < events.length) {
    token = events[index2][1];
    if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      events.splice(index2 + 1, token.type === "labelImage" ? 4 : 2);
      token.type = "data";
      index2++;
    }
  }
  return events;
}
function resolveToLabelEnd(events, context) {
  let index2 = events.length;
  let offset = 0;
  let token;
  let open;
  let close;
  let media;
  while (index2--) {
    token = events[index2][1];
    if (open) {
      if (token.type === "link" || token.type === "labelLink" && token._inactive) {
        break;
      }
      if (events[index2][0] === "enter" && token.type === "labelLink") {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
        open = index2;
        if (token.type !== "labelLink") {
          offset = 2;
          break;
        }
      }
    } else if (token.type === "labelEnd") {
      close = index2;
    }
  }
  const group = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  const label = {
    type: "label",
    start: Object.assign({}, events[open][1].start),
    end: Object.assign({}, events[close][1].end)
  };
  const text6 = {
    type: "labelText",
    start: Object.assign({}, events[open + offset + 2][1].end),
    end: Object.assign({}, events[close - 2][1].start)
  };
  media = [
    ["enter", group, context],
    ["enter", label, context]
  ];
  media = push(media, events.slice(open + 1, open + offset + 3));
  media = push(media, [["enter", text6, context]]);
  media = push(
    media,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(open + offset + 4, close - 3),
      context
    )
  );
  media = push(media, [
    ["exit", text6, context],
    events[close - 2],
    events[close - 1],
    ["exit", label, context]
  ]);
  media = push(media, events.slice(close + 1));
  media = push(media, [["exit", group, context]]);
  splice(events, open, events.length, media);
  return events;
}
function tokenizeLabelEnd(effects, ok2, nok) {
  const self = this;
  let index2 = self.events.length;
  let labelStart;
  let defined;
  while (index2--) {
    if ((self.events[index2][1].type === "labelImage" || self.events[index2][1].type === "labelLink") && !self.events[index2][1]._balanced) {
      labelStart = self.events[index2][1];
      break;
    }
  }
  return start;
  function start(code3) {
    if (!labelStart) {
      return nok(code3);
    }
    if (labelStart._inactive)
      return balanced(code3);
    defined = self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize({
          start: labelStart.end,
          end: self.now()
        })
      )
    );
    effects.enter("labelEnd");
    effects.enter("labelMarker");
    effects.consume(code3);
    effects.exit("labelMarker");
    effects.exit("labelEnd");
    return afterLabelEnd;
  }
  function afterLabelEnd(code3) {
    if (code3 === 40) {
      return effects.attempt(
        resourceConstruct,
        ok2,
        defined ? ok2 : balanced
      )(code3);
    }
    if (code3 === 91) {
      return effects.attempt(
        fullReferenceConstruct,
        ok2,
        defined ? effects.attempt(collapsedReferenceConstruct, ok2, balanced) : balanced
      )(code3);
    }
    return defined ? ok2(code3) : balanced(code3);
  }
  function balanced(code3) {
    labelStart._balanced = true;
    return nok(code3);
  }
}
function tokenizeResource(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.enter("resource");
    effects.enter("resourceMarker");
    effects.consume(code3);
    effects.exit("resourceMarker");
    return factoryWhitespace(effects, open);
  }
  function open(code3) {
    if (code3 === 41) {
      return end(code3);
    }
    return factoryDestination(
      effects,
      destinationAfter,
      nok,
      "resourceDestination",
      "resourceDestinationLiteral",
      "resourceDestinationLiteralMarker",
      "resourceDestinationRaw",
      "resourceDestinationString",
      32
    )(code3);
  }
  function destinationAfter(code3) {
    return markdownLineEndingOrSpace(code3) ? factoryWhitespace(effects, between2)(code3) : end(code3);
  }
  function between2(code3) {
    if (code3 === 34 || code3 === 39 || code3 === 40) {
      return factoryTitle(
        effects,
        factoryWhitespace(effects, end),
        nok,
        "resourceTitle",
        "resourceTitleMarker",
        "resourceTitleString"
      )(code3);
    }
    return end(code3);
  }
  function end(code3) {
    if (code3 === 41) {
      effects.enter("resourceMarker");
      effects.consume(code3);
      effects.exit("resourceMarker");
      effects.exit("resource");
      return ok2;
    }
    return nok(code3);
  }
}
function tokenizeFullReference(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    return factoryLabel.call(
      self,
      effects,
      afterLabel,
      nok,
      "reference",
      "referenceMarker",
      "referenceString"
    )(code3);
  }
  function afterLabel(code3) {
    return self.parser.defined.includes(
      normalizeIdentifier(
        self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
      )
    ) ? ok2(code3) : nok(code3);
  }
}
function tokenizeCollapsedReference(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.enter("reference");
    effects.enter("referenceMarker");
    effects.consume(code3);
    effects.exit("referenceMarker");
    return open;
  }
  function open(code3) {
    if (code3 === 93) {
      effects.enter("referenceMarker");
      effects.consume(code3);
      effects.exit("referenceMarker");
      effects.exit("reference");
      return ok2;
    }
    return nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-image.js
var labelStartImage = {
  name: "labelStartImage",
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
};
function tokenizeLabelStartImage(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    effects.enter("labelImage");
    effects.enter("labelImageMarker");
    effects.consume(code3);
    effects.exit("labelImageMarker");
    return open;
  }
  function open(code3) {
    if (code3 === 91) {
      effects.enter("labelMarker");
      effects.consume(code3);
      effects.exit("labelMarker");
      effects.exit("labelImage");
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    return code3 === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code3) : ok2(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-link.js
var labelStartLink = {
  name: "labelStartLink",
  tokenize: tokenizeLabelStartLink,
  resolveAll: labelEnd.resolveAll
};
function tokenizeLabelStartLink(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    effects.enter("labelLink");
    effects.enter("labelMarker");
    effects.consume(code3);
    effects.exit("labelMarker");
    effects.exit("labelLink");
    return after;
  }
  function after(code3) {
    return code3 === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code3) : ok2(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/line-ending.js
var lineEnding = {
  name: "lineEnding",
  tokenize: tokenizeLineEnding
};
function tokenizeLineEnding(effects, ok2) {
  return start;
  function start(code3) {
    effects.enter("lineEnding");
    effects.consume(code3);
    effects.exit("lineEnding");
    return factorySpace(effects, ok2, "linePrefix");
  }
}

// node_modules/micromark-core-commonmark/lib/thematic-break.js
var thematicBreak = {
  name: "thematicBreak",
  tokenize: tokenizeThematicBreak
};
function tokenizeThematicBreak(effects, ok2, nok) {
  let size = 0;
  let marker;
  return start;
  function start(code3) {
    effects.enter("thematicBreak");
    marker = code3;
    return atBreak(code3);
  }
  function atBreak(code3) {
    if (code3 === marker) {
      effects.enter("thematicBreakSequence");
      return sequence(code3);
    }
    if (markdownSpace(code3)) {
      return factorySpace(effects, atBreak, "whitespace")(code3);
    }
    if (size < 3 || code3 !== null && !markdownLineEnding(code3)) {
      return nok(code3);
    }
    effects.exit("thematicBreak");
    return ok2(code3);
  }
  function sequence(code3) {
    if (code3 === marker) {
      effects.consume(code3);
      size++;
      return sequence;
    }
    effects.exit("thematicBreakSequence");
    return atBreak(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/list.js
var list = {
  name: "list",
  tokenize: tokenizeListStart,
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd
};
var listItemPrefixWhitespaceConstruct = {
  tokenize: tokenizeListItemPrefixWhitespace,
  partial: true
};
var indentConstruct = {
  tokenize: tokenizeIndent,
  partial: true
};
function tokenizeListStart(effects, ok2, nok) {
  const self = this;
  const tail = self.events[self.events.length - 1];
  let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;
  function start(code3) {
    const kind = self.containerState.type || (code3 === 42 || code3 === 43 || code3 === 45 ? "listUnordered" : "listOrdered");
    if (kind === "listUnordered" ? !self.containerState.marker || code3 === self.containerState.marker : asciiDigit(code3)) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === "listUnordered") {
        effects.enter("listItemPrefix");
        return code3 === 42 || code3 === 45 ? effects.check(thematicBreak, nok, atMarker)(code3) : atMarker(code3);
      }
      if (!self.interrupt || code3 === 49) {
        effects.enter("listItemPrefix");
        effects.enter("listItemValue");
        return inside(code3);
      }
    }
    return nok(code3);
  }
  function inside(code3) {
    if (asciiDigit(code3) && ++size < 10) {
      effects.consume(code3);
      return inside;
    }
    if ((!self.interrupt || size < 2) && (self.containerState.marker ? code3 === self.containerState.marker : code3 === 41 || code3 === 46)) {
      effects.exit("listItemValue");
      return atMarker(code3);
    }
    return nok(code3);
  }
  function atMarker(code3) {
    effects.enter("listItemMarker");
    effects.consume(code3);
    effects.exit("listItemMarker");
    self.containerState.marker = self.containerState.marker || code3;
    return effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(
        listItemPrefixWhitespaceConstruct,
        endOfPrefix,
        otherPrefix
      )
    );
  }
  function onBlank(code3) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code3);
  }
  function otherPrefix(code3) {
    if (markdownSpace(code3)) {
      effects.enter("listItemPrefixWhitespace");
      effects.consume(code3);
      effects.exit("listItemPrefixWhitespace");
      return endOfPrefix;
    }
    return nok(code3);
  }
  function endOfPrefix(code3) {
    self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), true).length;
    return ok2(code3);
  }
}
function tokenizeListContinuation(effects, ok2, nok) {
  const self = this;
  self.containerState._closeFlow = void 0;
  return effects.check(blankLine, onBlank, notBlank);
  function onBlank(code3) {
    self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
    return factorySpace(
      effects,
      ok2,
      "listItemIndent",
      self.containerState.size + 1
    )(code3);
  }
  function notBlank(code3) {
    if (self.containerState.furtherBlankLines || !markdownSpace(code3)) {
      self.containerState.furtherBlankLines = void 0;
      self.containerState.initialBlankLine = void 0;
      return notInCurrentItem(code3);
    }
    self.containerState.furtherBlankLines = void 0;
    self.containerState.initialBlankLine = void 0;
    return effects.attempt(indentConstruct, ok2, notInCurrentItem)(code3);
  }
  function notInCurrentItem(code3) {
    self.containerState._closeFlow = true;
    self.interrupt = void 0;
    return factorySpace(
      effects,
      effects.attempt(list, ok2, nok),
      "linePrefix",
      self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    )(code3);
  }
}
function tokenizeIndent(effects, ok2, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    "listItemIndent",
    self.containerState.size + 1
  );
  function afterPrefix(code3) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self.containerState.size ? ok2(code3) : nok(code3);
  }
}
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok2, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    "listItemPrefixWhitespace",
    self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1
  );
  function afterPrefix(code3) {
    const tail = self.events[self.events.length - 1];
    return !markdownSpace(code3) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok2(code3) : nok(code3);
  }
}

// node_modules/micromark-core-commonmark/lib/setext-underline.js
var setextUnderline = {
  name: "setextUnderline",
  tokenize: tokenizeSetextUnderline,
  resolveTo: resolveToSetextUnderline
};
function resolveToSetextUnderline(events, context) {
  let index2 = events.length;
  let content3;
  let text6;
  let definition2;
  while (index2--) {
    if (events[index2][0] === "enter") {
      if (events[index2][1].type === "content") {
        content3 = index2;
        break;
      }
      if (events[index2][1].type === "paragraph") {
        text6 = index2;
      }
    } else {
      if (events[index2][1].type === "content") {
        events.splice(index2, 1);
      }
      if (!definition2 && events[index2][1].type === "definition") {
        definition2 = index2;
      }
    }
  }
  const heading2 = {
    type: "setextHeading",
    start: Object.assign({}, events[text6][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  events[text6][1].type = "setextHeadingText";
  if (definition2) {
    events.splice(text6, 0, ["enter", heading2, context]);
    events.splice(definition2 + 1, 0, ["exit", events[content3][1], context]);
    events[content3][1].end = Object.assign({}, events[definition2][1].end);
  } else {
    events[content3][1] = heading2;
  }
  events.push(["exit", heading2, context]);
  return events;
}
function tokenizeSetextUnderline(effects, ok2, nok) {
  const self = this;
  let index2 = self.events.length;
  let marker;
  let paragraph2;
  while (index2--) {
    if (self.events[index2][1].type !== "lineEnding" && self.events[index2][1].type !== "linePrefix" && self.events[index2][1].type !== "content") {
      paragraph2 = self.events[index2][1].type === "paragraph";
      break;
    }
  }
  return start;
  function start(code3) {
    if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph2)) {
      effects.enter("setextHeadingLine");
      effects.enter("setextHeadingLineSequence");
      marker = code3;
      return closingSequence(code3);
    }
    return nok(code3);
  }
  function closingSequence(code3) {
    if (code3 === marker) {
      effects.consume(code3);
      return closingSequence;
    }
    effects.exit("setextHeadingLineSequence");
    return factorySpace(effects, closingSequenceEnd, "lineSuffix")(code3);
  }
  function closingSequenceEnd(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      effects.exit("setextHeadingLine");
      return ok2(code3);
    }
    return nok(code3);
  }
}

// node_modules/micromark/lib/initialize/flow.js
var flow = {
  tokenize: initializeFlow
};
function initializeFlow(effects) {
  const self = this;
  const initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(
      this.parser.constructs.flowInitial,
      afterConstruct,
      factorySpace(
        effects,
        effects.attempt(
          this.parser.constructs.flow,
          afterConstruct,
          effects.attempt(content2, afterConstruct)
        ),
        "linePrefix"
      )
    )
  );
  return initial;
  function atBlankEnding(code3) {
    if (code3 === null) {
      effects.consume(code3);
      return;
    }
    effects.enter("lineEndingBlank");
    effects.consume(code3);
    effects.exit("lineEndingBlank");
    self.currentConstruct = void 0;
    return initial;
  }
  function afterConstruct(code3) {
    if (code3 === null) {
      effects.consume(code3);
      return;
    }
    effects.enter("lineEnding");
    effects.consume(code3);
    effects.exit("lineEnding");
    self.currentConstruct = void 0;
    return initial;
  }
}

// node_modules/micromark/lib/initialize/text.js
var resolver = {
  resolveAll: createResolver()
};
var string = initializeFactory("string");
var text = initializeFactory("text");
function initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: createResolver(
      field === "text" ? resolveAllLineSuffixes : void 0
    )
  };
  function initializeText(effects) {
    const self = this;
    const constructs2 = this.parser.constructs[field];
    const text6 = effects.attempt(constructs2, start, notText);
    return start;
    function start(code3) {
      return atBreak(code3) ? text6(code3) : notText(code3);
    }
    function notText(code3) {
      if (code3 === null) {
        effects.consume(code3);
        return;
      }
      effects.enter("data");
      effects.consume(code3);
      return data2;
    }
    function data2(code3) {
      if (atBreak(code3)) {
        effects.exit("data");
        return text6(code3);
      }
      effects.consume(code3);
      return data2;
    }
    function atBreak(code3) {
      if (code3 === null) {
        return true;
      }
      const list3 = constructs2[code3];
      let index2 = -1;
      if (list3) {
        while (++index2 < list3.length) {
          const item = list3[index2];
          if (!item.previous || item.previous.call(self, self.previous)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
function createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    let index2 = -1;
    let enter;
    while (++index2 <= events.length) {
      if (enter === void 0) {
        if (events[index2] && events[index2][1].type === "data") {
          enter = index2;
          index2++;
        }
      } else if (!events[index2] || events[index2][1].type !== "data") {
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          index2 = enter + 2;
        }
        enter = void 0;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0;
  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
      const data2 = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data2);
      let index2 = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      let tabs;
      while (index2--) {
        const chunk = chunks[index2];
        if (typeof chunk === "string") {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex)
            break;
          bufferIndex = -1;
        } else if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) {
        } else {
          index2++;
          break;
        }
      }
      if (size) {
        const token = {
          type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            line: data2.end.line,
            column: data2.end.column - size,
            offset: data2.end.offset - size,
            _index: data2.start._index + index2,
            _bufferIndex: index2 ? bufferIndex : data2.start._bufferIndex + bufferIndex
          },
          end: Object.assign({}, data2.end)
        };
        data2.end = Object.assign({}, token.start);
        if (data2.start.offset === data2.end.offset) {
          Object.assign(data2, token);
        } else {
          events.splice(
            eventIndex,
            0,
            ["enter", token, context],
            ["exit", token, context]
          );
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}

// node_modules/micromark/lib/create-tokenizer.js
function createTokenizer(parser, initialize, from) {
  let point4 = Object.assign(
    from ? Object.assign({}, from) : {
      line: 1,
      column: 1,
      offset: 0
    },
    {
      _index: 0,
      _bufferIndex: -1
    }
  );
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  let consumed = true;
  const effects = {
    consume,
    enter,
    exit: exit3,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    })
  };
  const context = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser,
    sliceStream,
    sliceSerialize,
    now,
    defineSkip,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  let expectedCode;
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    return Object.assign({}, point4);
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  function main() {
    let chunkIndex;
    while (point4._index < chunks.length) {
      const chunk = chunks[point4._index];
      if (typeof chunk === "string") {
        chunkIndex = point4._index;
        if (point4._bufferIndex < 0) {
          point4._bufferIndex = 0;
        }
        while (point4._index === chunkIndex && point4._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point4._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code3) {
    consumed = void 0;
    expectedCode = code3;
    state = state(code3);
  }
  function consume(code3) {
    if (markdownLineEnding(code3)) {
      point4.line++;
      point4.column = 1;
      point4.offset += code3 === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code3 !== -1) {
      point4.column++;
      point4.offset++;
    }
    if (point4._bufferIndex < 0) {
      point4._index++;
    } else {
      point4._bufferIndex++;
      if (point4._bufferIndex === chunks[point4._index].length) {
        point4._bufferIndex = -1;
        point4._index++;
      }
    }
    context.previous = code3;
    consumed = true;
  }
  function enter(type, fields) {
    const token = fields || {};
    token.type = type;
    token.start = now();
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit3(type) {
    const token = stack.pop();
    token.end = now();
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_2, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs2, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs2) ? (
        /* c8 ignore next 1 */
        handleListOfConstructs(constructs2)
      ) : "tokenize" in constructs2 ? handleListOfConstructs([constructs2]) : handleMapOfConstructs(constructs2);
      function handleMapOfConstructs(map2) {
        return start;
        function start(code3) {
          const def = code3 !== null && map2[code3];
          const all5 = code3 !== null && map2.null;
          const list3 = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(def) ? def : def ? [def] : [],
            ...Array.isArray(all5) ? all5 : all5 ? [all5] : []
          ];
          return handleListOfConstructs(list3)(code3);
        }
      }
      function handleListOfConstructs(list3) {
        listOfConstructs = list3;
        constructIndex = 0;
        if (list3.length === 0) {
          return bogusState;
        }
        return handleConstruct(list3[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code3) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok(code3);
          }
          return construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok2,
            nok
          )(code3);
        }
      }
      function ok2(code3) {
        consumed = true;
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code3) {
        consumed = true;
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(
        context.events,
        from2,
        context.events.length - from2,
        construct.resolve(context.events.slice(from2), context)
      );
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return {
      restore,
      from: startEventsIndex
    };
    function restore() {
      point4 = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if (point4.line in columnStart && point4.column < 2) {
      point4.column = columnStart[point4.line];
      point4.offset += columnStart[point4.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      view[0] = view[0].slice(startBufferIndex);
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index2 = -1;
  const result = [];
  let atTab;
  while (++index2 < chunks.length) {
    const chunk = chunks[index2];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else
      switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = "\n";
          break;
        }
        case -3: {
          value = "\r\n";
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab)
            continue;
          value = " ";
          break;
        }
        default: {
          value = String.fromCharCode(chunk);
        }
      }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join("");
}

// node_modules/micromark/lib/constructs.js
var constructs_exports = {};
__export(constructs_exports, {
  attentionMarkers: () => attentionMarkers,
  contentInitial: () => contentInitial,
  disable: () => disable,
  document: () => document3,
  flow: () => flow2,
  flowInitial: () => flowInitial,
  insideSpan: () => insideSpan,
  string: () => string2,
  text: () => text2
});
var document3 = {
  [42]: list,
  [43]: list,
  [45]: list,
  [48]: list,
  [49]: list,
  [50]: list,
  [51]: list,
  [52]: list,
  [53]: list,
  [54]: list,
  [55]: list,
  [56]: list,
  [57]: list,
  [62]: blockQuote
};
var contentInitial = {
  [91]: definition
};
var flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  [32]: codeIndented
};
var flow2 = {
  [35]: headingAtx,
  [42]: thematicBreak,
  [45]: [setextUnderline, thematicBreak],
  [60]: htmlFlow,
  [61]: setextUnderline,
  [95]: thematicBreak,
  [96]: codeFenced,
  [126]: codeFenced
};
var string2 = {
  [38]: characterReference,
  [92]: characterEscape
};
var text2 = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  [33]: labelStartImage,
  [38]: characterReference,
  [42]: attention,
  [60]: [autolink, htmlText],
  [91]: labelStartLink,
  [92]: [hardBreakEscape, characterEscape],
  [93]: labelEnd,
  [95]: attention,
  [96]: codeText
};
var insideSpan = {
  null: [attention, resolver]
};
var attentionMarkers = {
  null: [42, 95]
};
var disable = {
  null: []
};

// node_modules/micromark/lib/parse.js
function parse(options = {}) {
  const constructs2 = combineExtensions(
    // @ts-expect-error Same as above.
    [constructs_exports].concat(options.extensions || [])
  );
  const parser = {
    defined: [],
    lazy: {},
    constructs: constructs2,
    content: create2(content),
    document: create2(document2),
    flow: create2(flow),
    string: create2(string),
    text: create2(text)
  };
  return parser;
  function create2(initial) {
    return creator;
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}

// node_modules/micromark/lib/preprocess.js
var search = /[\0\t\n\r]/g;
function preprocess() {
  let column = 1;
  let buffer2 = "";
  let start = true;
  let atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    const chunks = [];
    let match;
    let next;
    let startPosition;
    let endPosition;
    let code3;
    value = buffer2 + value.toString(encoding);
    startPosition = 0;
    buffer2 = "";
    if (start) {
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = void 0;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== void 0 ? match.index : value.length;
      code3 = value.charCodeAt(endPosition);
      if (!match) {
        buffer2 = value.slice(startPosition);
        break;
      }
      if (code3 === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = void 0;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = void 0;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code3) {
          case 0: {
            chunks.push(65533);
            column++;
            break;
          }
          case 9: {
            next = Math.ceil(column / 4) * 4;
            chunks.push(-2);
            while (column++ < next)
              chunks.push(-1);
            break;
          }
          case 10: {
            chunks.push(-4);
            column = 1;
            break;
          }
          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn)
        chunks.push(-5);
      if (buffer2)
        chunks.push(buffer2);
      chunks.push(null);
    }
    return chunks;
  }
}

// node_modules/micromark/lib/postprocess.js
function postprocess(events) {
  while (!subtokenize(events)) {
  }
  return events;
}

// node_modules/micromark-util-decode-numeric-character-reference/index.js
function decodeNumericCharacterReference(value, base2) {
  const code3 = Number.parseInt(value, base2);
  if (
    // C0 except for HT, LF, FF, CR, space
    code3 < 9 || code3 === 11 || code3 > 13 && code3 < 32 || // Control character (DEL) of the basic block and C1 controls.
    code3 > 126 && code3 < 160 || // Lone high surrogates and low surrogates.
    code3 > 55295 && code3 < 57344 || // Noncharacters.
    code3 > 64975 && code3 < 65008 || (code3 & 65535) === 65535 || (code3 & 65535) === 65534 || // Out of range
    code3 > 1114111
  ) {
    return "\uFFFD";
  }
  return String.fromCharCode(code3);
}

// node_modules/micromark-util-decode-string/index.js
var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
function decode($0, $1, $2) {
  if ($1) {
    return $1;
  }
  const head2 = $2.charCodeAt(0);
  if (head2 === 35) {
    const head3 = $2.charCodeAt(1);
    const hex = head3 === 120 || head3 === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return decodeNamedCharacterReference($2) || $0;
}

// node_modules/mdast-util-from-markdown/lib/index.js
var own2 = {}.hasOwnProperty;
var fromMarkdown = (
  /**
   * @type {(
   *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
   *   ((value: Value, options?: Options | null | undefined) => Root)
   * )}
   */
  /**
   * @param {Value} value
   * @param {Encoding | Options | null | undefined} [encoding]
   * @param {Options | null | undefined} [options]
   * @returns {Root}
   */
  function(value, encoding, options) {
    if (typeof encoding !== "string") {
      options = encoding;
      encoding = void 0;
    }
    return compiler(options)(
      postprocess(
        // @ts-expect-error: micromark types need to accept `null`.
        parse(options).document().write(preprocess()(value, encoding, true))
      )
    );
  }
);
function compiler(options) {
  const config = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link2),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading2),
      blockQuote: opener(blockQuote2),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer2,
      codeFencedFenceMeta: buffer2,
      codeIndented: opener(codeFlow, buffer2),
      codeText: opener(codeText2, buffer2),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition2),
      definitionDestinationString: buffer2,
      definitionLabelString: buffer2,
      definitionTitleString: buffer2,
      emphasis: opener(emphasis2),
      hardBreakEscape: opener(hardBreak2),
      hardBreakTrailing: opener(hardBreak2),
      htmlFlow: opener(html6, buffer2),
      htmlFlowData: onenterdata,
      htmlText: opener(html6, buffer2),
      htmlTextData: onenterdata,
      image: opener(image2),
      label: buffer2,
      link: opener(link2),
      listItem: opener(listItem3),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list3, onenterlistordered),
      listUnordered: opener(list3),
      paragraph: opener(paragraph2),
      reference: onenterreference,
      referenceString: buffer2,
      resourceDestinationString: buffer2,
      resourceTitleString: buffer2,
      setextHeading: opener(heading2),
      strong: opener(strong2),
      thematicBreak: opener(thematicBreak3)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options || {}).mdastExtensions || []);
  const data2 = {};
  return compile;
  function compile(events) {
    let tree = {
      type: "root",
      children: []
    };
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit: exit3,
      buffer: buffer2,
      resume,
      setData,
      getData
    };
    const listStack = [];
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
        if (events[index2][0] === "enter") {
          listStack.push(index2);
        } else {
          const tail = listStack.pop();
          index2 = prepareList(events, tail, index2);
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      const handler = config[events[index2][0]];
      if (own2.call(handler, events[index2][1].type)) {
        handler[events[index2][1].type].call(
          Object.assign(
            {
              sliceSerialize: events[index2][2].sliceSerialize
            },
            context
          ),
          events[index2][1]
        );
      }
    }
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, void 0, tail[0]);
    }
    tree.position = {
      start: point2(
        events.length > 0 ? events[0][1].start : {
          line: 1,
          column: 1,
          offset: 0
        }
      ),
      end: point2(
        events.length > 0 ? events[events.length - 2][1].end : {
          line: 1,
          column: 1,
          offset: 0
        }
      )
    };
    index2 = -1;
    while (++index2 < config.transforms.length) {
      tree = config.transforms[index2](tree) || tree;
    }
    return tree;
  }
  function prepareList(events, start, length) {
    let index2 = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    let listItem4;
    let lineIndex;
    let firstBlankLineIndex;
    let atMarker;
    while (++index2 <= length) {
      const event = events[index2];
      if (event[1].type === "listUnordered" || event[1].type === "listOrdered" || event[1].type === "blockQuote") {
        if (event[0] === "enter") {
          containerBalance++;
        } else {
          containerBalance--;
        }
        atMarker = void 0;
      } else if (event[1].type === "lineEndingBlank") {
        if (event[0] === "enter") {
          if (listItem4 && !atMarker && !containerBalance && !firstBlankLineIndex) {
            firstBlankLineIndex = index2;
          }
          atMarker = void 0;
        }
      } else if (event[1].type === "linePrefix" || event[1].type === "listItemValue" || event[1].type === "listItemMarker" || event[1].type === "listItemPrefix" || event[1].type === "listItemPrefixWhitespace") {
      } else {
        atMarker = void 0;
      }
      if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
        if (listItem4) {
          let tailIndex = index2;
          lineIndex = void 0;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === "exit")
                continue;
              if (lineIndex) {
                events[lineIndex][1].type = "lineEndingBlank";
                listSpread = true;
              }
              tailEvent[1].type = "lineEnding";
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") {
            } else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem4._spread = true;
          }
          listItem4.end = Object.assign(
            {},
            lineIndex ? events[lineIndex][1].start : event[1].end
          );
          events.splice(lineIndex || index2, 0, ["exit", listItem4, event[2]]);
          index2++;
          length++;
        }
        if (event[1].type === "listItemPrefix") {
          listItem4 = {
            type: "listItem",
            // @ts-expect-error Patched
            _spread: false,
            start: Object.assign({}, event[1].start)
          };
          events.splice(index2, 0, ["enter", listItem4, event[2]]);
          index2++;
          length++;
          firstBlankLineIndex = void 0;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  function setData(key2, value) {
    data2[key2] = value;
  }
  function getData(key2) {
    return data2[key2];
  }
  function opener(create2, and) {
    return open;
    function open(token) {
      enter.call(this, create2(token), token);
      if (and)
        and.call(this, token);
    }
  }
  function buffer2() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function enter(node2, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(node2);
    this.stack.push(node2);
    this.tokenStack.push([token, errorHandler]);
    node2.position = {
      start: point2(token.start)
    };
    return node2;
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and)
        and.call(this, token);
      exit3.call(this, token);
    }
  }
  function exit3(token, onExitError) {
    const node2 = this.stack.pop();
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error(
        "Cannot close `" + token.type + "` (" + stringifyPosition({
          start: token.start,
          end: token.end
        }) + "): it\u2019s not open"
      );
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    node2.position.end = point2(token.end);
    return node2;
  }
  function resume() {
    return toString(this.stack.pop());
  }
  function onenterlistordered() {
    setData("expectingFirstListItemValue", true);
  }
  function onenterlistitemvalue(token) {
    if (getData("expectingFirstListItemValue")) {
      const ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
      setData("expectingFirstListItemValue");
    }
  }
  function onexitcodefencedfenceinfo() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.lang = data3;
  }
  function onexitcodefencedfencemeta() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.meta = data3;
  }
  function onexitcodefencedfence() {
    if (getData("flowCodeInside"))
      return;
    this.buffer();
    setData("flowCodeInside", true);
  }
  function onexitcodefenced() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data3.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    setData("flowCodeInside");
  }
  function onexitcodeindented() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data3.replace(/(\r?\n|\r)$/g, "");
  }
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data3;
  }
  function onexitdefinitiondestinationstring() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data3;
  }
  function onexitatxheadingsequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    if (!node2.depth) {
      const depth = this.sliceSerialize(token).length;
      node2.depth = depth;
    }
  }
  function onexitsetextheadingtext() {
    setData("setextHeadingSlurpLineEnding", true);
  }
  function onexitsetextheadinglinesequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    node2.depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2;
  }
  function onexitsetextheading() {
    setData("setextHeadingSlurpLineEnding");
  }
  function onenterdata(token) {
    const node2 = this.stack[this.stack.length - 1];
    let tail = node2.children[node2.children.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text6();
      tail.position = {
        start: point2(token.start)
      };
      node2.children.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = point2(token.end);
  }
  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    if (getData("atHardBreak")) {
      const tail = context.children[context.children.length - 1];
      tail.position.end = point2(token.end);
      setData("atHardBreak");
      return;
    }
    if (!getData("setextHeadingSlurpLineEnding") && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  function onexithardbreak() {
    setData("atHardBreak", true);
  }
  function onexithtmlflow() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data3;
  }
  function onexithtmltext() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data3;
  }
  function onexitcodetext() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.value = data3;
  }
  function onexitlink() {
    const node2 = this.stack[this.stack.length - 1];
    if (getData("inReference")) {
      const referenceType = getData("referenceType") || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    setData("referenceType");
  }
  function onexitimage() {
    const node2 = this.stack[this.stack.length - 1];
    if (getData("inReference")) {
      const referenceType = getData("referenceType") || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    setData("referenceType");
  }
  function onexitlabeltext(token) {
    const string3 = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ancestor.label = decodeString(string3);
    ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
  }
  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    const value = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    setData("inReference", true);
    if (node2.type === "link") {
      const children = fragment.children;
      node2.children = children;
    } else {
      node2.alt = value;
    }
  }
  function onexitresourcedestinationstring() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.url = data3;
  }
  function onexitresourcetitlestring() {
    const data3 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.title = data3;
  }
  function onexitresource() {
    setData("inReference");
  }
  function onenterreference() {
    setData("referenceType", "collapsed");
  }
  function onexitreferencestring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    node2.label = label;
    node2.identifier = normalizeIdentifier(
      this.sliceSerialize(token)
    ).toLowerCase();
    setData("referenceType", "full");
  }
  function onexitcharacterreferencemarker(token) {
    setData("characterReferenceType", token.type);
  }
  function onexitcharacterreferencevalue(token) {
    const data3 = this.sliceSerialize(token);
    const type = getData("characterReferenceType");
    let value;
    if (type) {
      value = decodeNumericCharacterReference(
        data3,
        type === "characterReferenceMarkerNumeric" ? 10 : 16
      );
      setData("characterReferenceType");
    } else {
      const result = decodeNamedCharacterReference(data3);
      value = result;
    }
    const tail = this.stack.pop();
    tail.value += value;
    tail.position.end = point2(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    node2.url = "mailto:" + this.sliceSerialize(token);
  }
  function blockQuote2() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function codeFlow() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function codeText2() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function definition2() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function emphasis2() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function heading2() {
    return {
      type: "heading",
      depth: void 0,
      children: []
    };
  }
  function hardBreak2() {
    return {
      type: "break"
    };
  }
  function html6() {
    return {
      type: "html",
      value: ""
    };
  }
  function image2() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function link2() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function list3(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      // @ts-expect-error Patched.
      spread: token._spread,
      children: []
    };
  }
  function listItem3(token) {
    return {
      type: "listItem",
      // @ts-expect-error Patched.
      spread: token._spread,
      checked: null,
      children: []
    };
  }
  function paragraph2() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function strong2() {
    return {
      type: "strong",
      children: []
    };
  }
  function text6() {
    return {
      type: "text",
      value: ""
    };
  }
  function thematicBreak3() {
    return {
      type: "thematicBreak"
    };
  }
}
function point2(d3) {
  return {
    line: d3.line,
    column: d3.column,
    offset: d3.offset
  };
}
function configure(combined, extensions) {
  let index2 = -1;
  while (++index2 < extensions.length) {
    const value = extensions[index2];
    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}
function extension(combined, extension2) {
  let key2;
  for (key2 in extension2) {
    if (own2.call(extension2, key2)) {
      if (key2 === "canContainEols") {
        const right = extension2[key2];
        if (right) {
          combined[key2].push(...right);
        }
      } else if (key2 === "transforms") {
        const right = extension2[key2];
        if (right) {
          combined[key2].push(...right);
        }
      } else if (key2 === "enter" || key2 === "exit") {
        const right = extension2[key2];
        if (right) {
          Object.assign(combined[key2], right);
        }
      }
    }
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error(
      "Cannot close `" + left.type + "` (" + stringifyPosition({
        start: left.start,
        end: left.end
      }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is open"
    );
  } else {
    throw new Error(
      "Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
        start: right.start,
        end: right.end
      }) + ") is still open"
    );
  }
}

// node_modules/remark-parse/lib/index.js
function remarkParse(options) {
  const parser = (doc) => {
    const settings = (
      /** @type {Options} */
      this.data("settings")
    );
    return fromMarkdown(
      doc,
      Object.assign({}, settings, options, {
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: this.data("micromarkExtensions") || [],
        mdastExtensions: this.data("fromMarkdownExtensions") || []
      })
    );
  };
  Object.assign(this, { Parser: parser });
}

// node_modules/remark-parse/index.js
var remark_parse_default = remarkParse;

// node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
function blockquote(state, node2) {
  const result = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: state.wrap(state.all(node2), true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/break.js
function hardBreak(state, node2) {
  const result = { type: "element", tagName: "br", properties: {}, children: [] };
  state.patch(node2, result);
  return [state.applyData(node2, result), { type: "text", value: "\n" }];
}

// node_modules/mdast-util-to-hast/lib/handlers/code.js
function code(state, node2) {
  const value = node2.value ? node2.value + "\n" : "";
  const lang = node2.lang ? node2.lang.match(/^[^ \t]+(?=[ \t]|$)/) : null;
  const properties = {};
  if (lang) {
    properties.className = ["language-" + lang];
  }
  let result = {
    type: "element",
    tagName: "code",
    properties,
    children: [{ type: "text", value }]
  };
  if (node2.meta) {
    result.data = { meta: node2.meta };
  }
  state.patch(node2, result);
  result = state.applyData(node2, result);
  result = { type: "element", tagName: "pre", properties: {}, children: [result] };
  state.patch(node2, result);
  return result;
}

// node_modules/mdast-util-to-hast/lib/handlers/delete.js
function strikethrough(state, node2) {
  const result = {
    type: "element",
    tagName: "del",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
function emphasis(state, node2) {
  const result = {
    type: "element",
    tagName: "em",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/micromark-util-sanitize-uri/index.js
function normalizeUri(value) {
  const result = [];
  let index2 = -1;
  let start = 0;
  let skip = 0;
  while (++index2 < value.length) {
    const code3 = value.charCodeAt(index2);
    let replace2 = "";
    if (code3 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
      skip = 2;
    } else if (code3 < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code3))) {
        replace2 = String.fromCharCode(code3);
      }
    } else if (code3 > 55295 && code3 < 57344) {
      const next = value.charCodeAt(index2 + 1);
      if (code3 < 56320 && next > 56319 && next < 57344) {
        replace2 = String.fromCharCode(code3, next);
        skip = 1;
      } else {
        replace2 = "\uFFFD";
      }
    } else {
      replace2 = String.fromCharCode(code3);
    }
    if (replace2) {
      result.push(value.slice(start, index2), encodeURIComponent(replace2));
      start = index2 + skip + 1;
      replace2 = "";
    }
    if (skip) {
      index2 += skip;
      skip = 0;
    }
  }
  return result.join("") + value.slice(start);
}

// node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
function footnoteReference(state, node2) {
  const id = String(node2.identifier).toUpperCase();
  const safeId = normalizeUri(id.toLowerCase());
  const index2 = state.footnoteOrder.indexOf(id);
  let counter;
  if (index2 === -1) {
    state.footnoteOrder.push(id);
    state.footnoteCounts[id] = 1;
    counter = state.footnoteOrder.length;
  } else {
    state.footnoteCounts[id]++;
    counter = index2 + 1;
  }
  const reuseCounter = state.footnoteCounts[id];
  const link2 = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + state.clobberPrefix + "fn-" + safeId,
      id: state.clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
      dataFootnoteRef: true,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(counter) }]
  };
  state.patch(node2, link2);
  const sup = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [link2]
  };
  state.patch(node2, sup);
  return state.applyData(node2, sup);
}

// node_modules/mdast-util-to-hast/lib/handlers/footnote.js
function footnote(state, node2) {
  const footnoteById = state.footnoteById;
  let no = 1;
  while (no in footnoteById)
    no++;
  const identifier = String(no);
  footnoteById[identifier] = {
    type: "footnoteDefinition",
    identifier,
    children: [{ type: "paragraph", children: node2.children }],
    position: node2.position
  };
  return footnoteReference(state, {
    type: "footnoteReference",
    identifier,
    position: node2.position
  });
}

// node_modules/mdast-util-to-hast/lib/handlers/heading.js
function heading(state, node2) {
  const result = {
    type: "element",
    tagName: "h" + node2.depth,
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/html.js
function html(state, node2) {
  if (state.dangerous) {
    const result = { type: "raw", value: node2.value };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  return null;
}

// node_modules/mdast-util-to-hast/lib/revert.js
function revert(state, node2) {
  const subtype = node2.referenceType;
  let suffix = "]";
  if (subtype === "collapsed") {
    suffix += "[]";
  } else if (subtype === "full") {
    suffix += "[" + (node2.label || node2.identifier) + "]";
  }
  if (node2.type === "imageReference") {
    return { type: "text", value: "![" + node2.alt + suffix };
  }
  const contents = state.all(node2);
  const head2 = contents[0];
  if (head2 && head2.type === "text") {
    head2.value = "[" + head2.value;
  } else {
    contents.unshift({ type: "text", value: "[" });
  }
  const tail = contents[contents.length - 1];
  if (tail && tail.type === "text") {
    tail.value += suffix;
  } else {
    contents.push({ type: "text", value: suffix });
  }
  return contents;
}

// node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
function imageReference(state, node2) {
  const def = state.definition(node2.identifier);
  if (!def) {
    return revert(state, node2);
  }
  const properties = { src: normalizeUri(def.url || ""), alt: node2.alt };
  if (def.title !== null && def.title !== void 0) {
    properties.title = def.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/image.js
function image(state, node2) {
  const properties = { src: normalizeUri(node2.url) };
  if (node2.alt !== null && node2.alt !== void 0) {
    properties.alt = node2.alt;
  }
  if (node2.title !== null && node2.title !== void 0) {
    properties.title = node2.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
function inlineCode(state, node2) {
  const text6 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
  state.patch(node2, text6);
  const result = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [text6]
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
function linkReference(state, node2) {
  const def = state.definition(node2.identifier);
  if (!def) {
    return revert(state, node2);
  }
  const properties = { href: normalizeUri(def.url || "") };
  if (def.title !== null && def.title !== void 0) {
    properties.title = def.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/link.js
function link(state, node2) {
  const properties = { href: normalizeUri(node2.url) };
  if (node2.title !== null && node2.title !== void 0) {
    properties.title = node2.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/list-item.js
function listItem(state, node2, parent) {
  const results = state.all(node2);
  const loose = parent ? listLoose(parent) : listItemLoose(node2);
  const properties = {};
  const children = [];
  if (typeof node2.checked === "boolean") {
    const head2 = results[0];
    let paragraph2;
    if (head2 && head2.type === "element" && head2.tagName === "p") {
      paragraph2 = head2;
    } else {
      paragraph2 = { type: "element", tagName: "p", properties: {}, children: [] };
      results.unshift(paragraph2);
    }
    if (paragraph2.children.length > 0) {
      paragraph2.children.unshift({ type: "text", value: " " });
    }
    paragraph2.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: node2.checked, disabled: true },
      children: []
    });
    properties.className = ["task-list-item"];
  }
  let index2 = -1;
  while (++index2 < results.length) {
    const child = results[index2];
    if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
      children.push({ type: "text", value: "\n" });
    }
    if (child.type === "element" && child.tagName === "p" && !loose) {
      children.push(...child.children);
    } else {
      children.push(child);
    }
  }
  const tail = results[results.length - 1];
  if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
    children.push({ type: "text", value: "\n" });
  }
  const result = { type: "element", tagName: "li", properties, children };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function listLoose(node2) {
  let loose = false;
  if (node2.type === "list") {
    loose = node2.spread || false;
    const children = node2.children;
    let index2 = -1;
    while (!loose && ++index2 < children.length) {
      loose = listItemLoose(children[index2]);
    }
  }
  return loose;
}
function listItemLoose(node2) {
  const spread = node2.spread;
  return spread === void 0 || spread === null ? node2.children.length > 1 : spread;
}

// node_modules/mdast-util-to-hast/lib/handlers/list.js
function list2(state, node2) {
  const properties = {};
  const results = state.all(node2);
  let index2 = -1;
  if (typeof node2.start === "number" && node2.start !== 1) {
    properties.start = node2.start;
  }
  while (++index2 < results.length) {
    const child = results[index2];
    if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
      properties.className = ["contains-task-list"];
      break;
    }
  }
  const result = {
    type: "element",
    tagName: node2.ordered ? "ol" : "ul",
    properties,
    children: state.wrap(results, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
function paragraph(state, node2) {
  const result = {
    type: "element",
    tagName: "p",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/root.js
function root(state, node2) {
  const result = { type: "root", children: state.wrap(state.all(node2)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/strong.js
function strong(state, node2) {
  const result = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/unist-util-position/lib/index.js
var pointStart = point3("start");
var pointEnd = point3("end");
function position2(node2) {
  return { start: pointStart(node2), end: pointEnd(node2) };
}
function point3(type) {
  return point4;
  function point4(node2) {
    const point5 = node2 && node2.position && node2.position[type] || {};
    return {
      // @ts-expect-error: in practice, null is allowed.
      line: point5.line || null,
      // @ts-expect-error: in practice, null is allowed.
      column: point5.column || null,
      // @ts-expect-error: in practice, null is allowed.
      offset: point5.offset > -1 ? point5.offset : null
    };
  }
}

// node_modules/mdast-util-to-hast/lib/handlers/table.js
function table(state, node2) {
  const rows = state.all(node2);
  const firstRow = rows.shift();
  const tableContent = [];
  if (firstRow) {
    const head2 = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: state.wrap([firstRow], true)
    };
    state.patch(node2.children[0], head2);
    tableContent.push(head2);
  }
  if (rows.length > 0) {
    const body3 = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: state.wrap(rows, true)
    };
    const start = pointStart(node2.children[1]);
    const end = pointEnd(node2.children[node2.children.length - 1]);
    if (start.line && end.line)
      body3.position = { start, end };
    tableContent.push(body3);
  }
  const result = {
    type: "element",
    tagName: "table",
    properties: {},
    children: state.wrap(tableContent, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/table-row.js
function tableRow(state, node2, parent) {
  const siblings2 = parent ? parent.children : void 0;
  const rowIndex = siblings2 ? siblings2.indexOf(node2) : 1;
  const tagName = rowIndex === 0 ? "th" : "td";
  const align = parent && parent.type === "table" ? parent.align : void 0;
  const length = align ? align.length : node2.children.length;
  let cellIndex = -1;
  const cells2 = [];
  while (++cellIndex < length) {
    const cell = node2.children[cellIndex];
    const properties = {};
    const alignValue = align ? align[cellIndex] : void 0;
    if (alignValue) {
      properties.align = alignValue;
    }
    let result2 = { type: "element", tagName, properties, children: [] };
    if (cell) {
      result2.children = state.all(cell);
      state.patch(cell, result2);
      result2 = state.applyData(node2, result2);
    }
    cells2.push(result2);
  }
  const result = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: state.wrap(cells2, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
function tableCell(state, node2) {
  const result = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/trim-lines/index.js
var tab = 9;
var space = 32;
function trimLines(value) {
  const source = String(value);
  const search2 = /\r?\n|\r/g;
  let match = search2.exec(source);
  let last = 0;
  const lines = [];
  while (match) {
    lines.push(
      trimLine(source.slice(last, match.index), last > 0, true),
      match[0]
    );
    last = match.index + match[0].length;
    match = search2.exec(source);
  }
  lines.push(trimLine(source.slice(last), last > 0, false));
  return lines.join("");
}
function trimLine(value, start, end) {
  let startIndex = 0;
  let endIndex = value.length;
  if (start) {
    let code3 = value.codePointAt(startIndex);
    while (code3 === tab || code3 === space) {
      startIndex++;
      code3 = value.codePointAt(startIndex);
    }
  }
  if (end) {
    let code3 = value.codePointAt(endIndex - 1);
    while (code3 === tab || code3 === space) {
      endIndex--;
      code3 = value.codePointAt(endIndex - 1);
    }
  }
  return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}

// node_modules/mdast-util-to-hast/lib/handlers/text.js
function text3(state, node2) {
  const result = { type: "text", value: trimLines(String(node2.value)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
function thematicBreak2(state, node2) {
  const result = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}

// node_modules/mdast-util-to-hast/lib/handlers/index.js
var handlers = {
  blockquote,
  break: hardBreak,
  code,
  delete: strikethrough,
  emphasis,
  footnoteReference,
  footnote,
  heading,
  html,
  imageReference,
  image,
  inlineCode,
  linkReference,
  link,
  listItem,
  list: list2,
  paragraph,
  root,
  strong,
  table,
  tableCell,
  tableRow,
  text: text3,
  thematicBreak: thematicBreak2,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
};
function ignore() {
  return null;
}

// node_modules/unist-util-is/lib/index.js
var convert = (
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {AssertAnything}
   */
  function(test) {
    if (test === void 0 || test === null) {
      return ok;
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  }
);
function anyFactory(tests) {
  const checks2 = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks2[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index3 = -1;
    while (++index3 < checks2.length) {
      if (checks2[index3].call(this, ...parameters))
        return true;
    }
    return false;
  }
}
function propsFactory(check) {
  return castFactory(all5);
  function all5(node2) {
    let key2;
    for (key2 in check) {
      if (node2[key2] !== check[key2])
        return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node2) {
    return node2 && node2.type === check;
  }
}
function castFactory(check) {
  return assertion;
  function assertion(node2, ...parameters) {
    return Boolean(
      node2 && typeof node2 === "object" && "type" in node2 && // @ts-expect-error: fine.
      Boolean(check.call(this, node2, ...parameters))
    );
  }
}
function ok() {
  return true;
}

// node_modules/unist-util-visit-parents/lib/color.browser.js
function color(d3) {
  return d3;
}

// node_modules/unist-util-visit-parents/lib/index.js
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
var visitParents = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor<Node>} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function(tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    const is2 = convert(test);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node2, index2, parents) {
      const value = node2 && typeof node2 === "object" ? node2 : {};
      if (typeof value.type === "string") {
        const name = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit2, "name", {
          value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
        });
      }
      return visit2;
      function visit2() {
        let result = [];
        let subresult;
        let offset;
        let grandparents;
        if (!test || is2(node2, index2, parents[parents.length - 1] || null)) {
          result = toResult(visitor(node2, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if (node2.children && result[0] !== SKIP) {
          offset = (reverse ? node2.children.length : -1) + step;
          grandparents = parents.concat(node2);
          while (offset > -1 && offset < node2.children.length) {
            subresult = factory(node2.children[offset], offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
        return result;
      }
    }
  }
);
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return [value];
}

// node_modules/unist-util-visit/lib/index.js
var visit = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function(tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node2, parents) {
      const parent = parents[parents.length - 1];
      return visitor(
        node2,
        parent ? parent.children.indexOf(node2) : null,
        parent
      );
    }
  }
);

// node_modules/unist-util-generated/lib/index.js
function generated(node2) {
  return !node2 || !node2.position || !node2.position.start || !node2.position.start.line || !node2.position.start.column || !node2.position.end || !node2.position.end.line || !node2.position.end.column;
}

// node_modules/mdast-util-definitions/lib/index.js
var own3 = {}.hasOwnProperty;
function definitions(tree) {
  const cache = /* @__PURE__ */ Object.create(null);
  if (!tree || !tree.type) {
    throw new Error("mdast-util-definitions expected node");
  }
  visit(tree, "definition", (definition3) => {
    const id = clean(definition3.identifier);
    if (id && !own3.call(cache, id)) {
      cache[id] = definition3;
    }
  });
  return definition2;
  function definition2(identifier) {
    const id = clean(identifier);
    return id && own3.call(cache, id) ? cache[id] : null;
  }
}
function clean(value) {
  return String(value || "").toUpperCase();
}

// node_modules/mdast-util-to-hast/lib/state.js
var own4 = {}.hasOwnProperty;
function createState(tree, options) {
  const settings = options || {};
  const dangerous2 = settings.allowDangerousHtml || false;
  const footnoteById = {};
  state.dangerous = dangerous2;
  state.clobberPrefix = settings.clobberPrefix === void 0 || settings.clobberPrefix === null ? "user-content-" : settings.clobberPrefix;
  state.footnoteLabel = settings.footnoteLabel || "Footnotes";
  state.footnoteLabelTagName = settings.footnoteLabelTagName || "h2";
  state.footnoteLabelProperties = settings.footnoteLabelProperties || {
    className: ["sr-only"]
  };
  state.footnoteBackLabel = settings.footnoteBackLabel || "Back to content";
  state.unknownHandler = settings.unknownHandler;
  state.passThrough = settings.passThrough;
  state.handlers = { ...handlers, ...settings.handlers };
  state.definition = definitions(tree);
  state.footnoteById = footnoteById;
  state.footnoteOrder = [];
  state.footnoteCounts = {};
  state.patch = patch;
  state.applyData = applyData;
  state.one = oneBound;
  state.all = allBound;
  state.wrap = wrap2;
  state.augment = augment;
  visit(tree, "footnoteDefinition", (definition2) => {
    const id = String(definition2.identifier).toUpperCase();
    if (!own4.call(footnoteById, id)) {
      footnoteById[id] = definition2;
    }
  });
  return state;
  function augment(left, right) {
    if (left && "data" in left && left.data) {
      const data2 = left.data;
      if (data2.hName) {
        if (right.type !== "element") {
          right = {
            type: "element",
            tagName: "",
            properties: {},
            children: []
          };
        }
        right.tagName = data2.hName;
      }
      if (right.type === "element" && data2.hProperties) {
        right.properties = { ...right.properties, ...data2.hProperties };
      }
      if ("children" in right && right.children && data2.hChildren) {
        right.children = data2.hChildren;
      }
    }
    if (left) {
      const ctx = "type" in left ? left : { position: left };
      if (!generated(ctx)) {
        right.position = { start: pointStart(ctx), end: pointEnd(ctx) };
      }
    }
    return right;
  }
  function state(node2, tagName, props, children) {
    if (Array.isArray(props)) {
      children = props;
      props = {};
    }
    return augment(node2, {
      type: "element",
      tagName,
      properties: props || {},
      children: children || []
    });
  }
  function oneBound(node2, parent) {
    return one2(state, node2, parent);
  }
  function allBound(parent) {
    return all2(state, parent);
  }
}
function patch(from, to) {
  if (from.position)
    to.position = position2(from);
}
function applyData(from, to) {
  let result = to;
  if (from && from.data) {
    const hName = from.data.hName;
    const hChildren = from.data.hChildren;
    const hProperties = from.data.hProperties;
    if (typeof hName === "string") {
      if (result.type === "element") {
        result.tagName = hName;
      } else {
        result = {
          type: "element",
          tagName: hName,
          properties: {},
          children: []
        };
      }
    }
    if (result.type === "element" && hProperties) {
      result.properties = { ...result.properties, ...hProperties };
    }
    if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
      result.children = hChildren;
    }
  }
  return result;
}
function one2(state, node2, parent) {
  const type = node2 && node2.type;
  if (!type) {
    throw new Error("Expected node, got `" + node2 + "`");
  }
  if (own4.call(state.handlers, type)) {
    return state.handlers[type](state, node2, parent);
  }
  if (state.passThrough && state.passThrough.includes(type)) {
    return "children" in node2 ? { ...node2, children: all2(state, node2) } : node2;
  }
  if (state.unknownHandler) {
    return state.unknownHandler(state, node2, parent);
  }
  return defaultUnknownHandler(state, node2);
}
function all2(state, parent) {
  const values = [];
  if ("children" in parent) {
    const nodes = parent.children;
    let index2 = -1;
    while (++index2 < nodes.length) {
      const result = one2(state, nodes[index2], parent);
      if (result) {
        if (index2 && nodes[index2 - 1].type === "break") {
          if (!Array.isArray(result) && result.type === "text") {
            result.value = result.value.replace(/^\s+/, "");
          }
          if (!Array.isArray(result) && result.type === "element") {
            const head2 = result.children[0];
            if (head2 && head2.type === "text") {
              head2.value = head2.value.replace(/^\s+/, "");
            }
          }
        }
        if (Array.isArray(result)) {
          values.push(...result);
        } else {
          values.push(result);
        }
      }
    }
  }
  return values;
}
function defaultUnknownHandler(state, node2) {
  const data2 = node2.data || {};
  const result = "value" in node2 && !(own4.call(data2, "hProperties") || own4.call(data2, "hChildren")) ? { type: "text", value: node2.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: all2(state, node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function wrap2(nodes, loose) {
  const result = [];
  let index2 = -1;
  if (loose) {
    result.push({ type: "text", value: "\n" });
  }
  while (++index2 < nodes.length) {
    if (index2)
      result.push({ type: "text", value: "\n" });
    result.push(nodes[index2]);
  }
  if (loose && nodes.length > 0) {
    result.push({ type: "text", value: "\n" });
  }
  return result;
}

// node_modules/mdast-util-to-hast/lib/footer.js
function footer(state) {
  const listItems = [];
  let index2 = -1;
  while (++index2 < state.footnoteOrder.length) {
    const def = state.footnoteById[state.footnoteOrder[index2]];
    if (!def) {
      continue;
    }
    const content3 = state.all(def);
    const id = String(def.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    let referenceIndex = 0;
    const backReferences = [];
    while (++referenceIndex <= state.footnoteCounts[id]) {
      const backReference = {
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + state.clobberPrefix + "fnref-" + safeId + (referenceIndex > 1 ? "-" + referenceIndex : ""),
          dataFootnoteBackref: true,
          className: ["data-footnote-backref"],
          ariaLabel: state.footnoteBackLabel
        },
        children: [{ type: "text", value: "\u21A9" }]
      };
      if (referenceIndex > 1) {
        backReference.children.push({
          type: "element",
          tagName: "sup",
          children: [{ type: "text", value: String(referenceIndex) }]
        });
      }
      if (backReferences.length > 0) {
        backReferences.push({ type: "text", value: " " });
      }
      backReferences.push(backReference);
    }
    const tail = content3[content3.length - 1];
    if (tail && tail.type === "element" && tail.tagName === "p") {
      const tailTail = tail.children[tail.children.length - 1];
      if (tailTail && tailTail.type === "text") {
        tailTail.value += " ";
      } else {
        tail.children.push({ type: "text", value: " " });
      }
      tail.children.push(...backReferences);
    } else {
      content3.push(...backReferences);
    }
    const listItem3 = {
      type: "element",
      tagName: "li",
      properties: { id: state.clobberPrefix + "fn-" + safeId },
      children: state.wrap(content3, true)
    };
    state.patch(def, listItem3);
    listItems.push(listItem3);
  }
  if (listItems.length === 0) {
    return;
  }
  return {
    type: "element",
    tagName: "section",
    properties: { dataFootnotes: true, className: ["footnotes"] },
    children: [
      {
        type: "element",
        tagName: state.footnoteLabelTagName,
        properties: {
          // To do: use structured clone.
          ...JSON.parse(JSON.stringify(state.footnoteLabelProperties)),
          id: "footnote-label"
        },
        children: [{ type: "text", value: state.footnoteLabel }]
      },
      { type: "text", value: "\n" },
      {
        type: "element",
        tagName: "ol",
        properties: {},
        children: state.wrap(listItems, true)
      },
      { type: "text", value: "\n" }
    ]
  };
}

// node_modules/mdast-util-to-hast/lib/index.js
function toHast(tree, options) {
  const state = createState(tree, options);
  const node2 = state.one(tree, null);
  const foot = footer(state);
  if (foot) {
    node2.children.push({ type: "text", value: "\n" }, foot);
  }
  return Array.isArray(node2) ? { type: "root", children: node2 } : node2;
}

// node_modules/remark-rehype/lib/index.js
var remarkRehype = (
  /** @type {(import('unified').Plugin<[Processor, Options?]|[null|undefined, Options?]|[Options]|[], MdastRoot>)} */
  function(destination, options) {
    return destination && "run" in destination ? bridge(destination, options) : mutate(destination || options);
  }
);
var lib_default = remarkRehype;
function bridge(destination, options) {
  return (node2, file, next) => {
    destination.run(toHast(node2, options), file, (error) => {
      next(error);
    });
  };
}
function mutate(options) {
  return (node2) => toHast(node2, options);
}

// node_modules/hast-util-sanitize/lib/schema.js
var defaultSchema = {
  strip: ["script"],
  clobberPrefix: "user-content-",
  clobber: ["name", "id"],
  ancestors: {
    tbody: ["table"],
    tfoot: ["table"],
    thead: ["table"],
    td: ["table"],
    th: ["table"],
    tr: ["table"]
  },
  protocols: {
    href: ["http", "https", "mailto", "xmpp", "irc", "ircs"],
    cite: ["http", "https"],
    src: ["http", "https"],
    longDesc: ["http", "https"]
  },
  tagNames: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "br",
    "b",
    "i",
    "strong",
    "em",
    "a",
    "pre",
    "code",
    "img",
    "tt",
    "div",
    "ins",
    "del",
    "sup",
    "sub",
    "p",
    "ol",
    "ul",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "blockquote",
    "dl",
    "dt",
    "dd",
    "kbd",
    "q",
    "samp",
    "var",
    "hr",
    "ruby",
    "rt",
    "rp",
    "li",
    "tr",
    "td",
    "th",
    "s",
    "strike",
    "summary",
    "details",
    "caption",
    "figure",
    "figcaption",
    "abbr",
    "bdo",
    "cite",
    "dfn",
    "mark",
    "small",
    "span",
    "time",
    "wbr",
    "input"
  ],
  attributes: {
    a: ["href"],
    img: ["src", "longDesc"],
    input: [
      ["type", "checkbox"],
      ["disabled", true]
    ],
    li: [["className", "task-list-item"]],
    div: ["itemScope", "itemType"],
    blockquote: ["cite"],
    del: ["cite"],
    ins: ["cite"],
    q: ["cite"],
    "*": [
      "abbr",
      "accept",
      "acceptCharset",
      "accessKey",
      "action",
      "align",
      "alt",
      "ariaDescribedBy",
      "ariaHidden",
      "ariaLabel",
      "ariaLabelledBy",
      "axis",
      "border",
      "cellPadding",
      "cellSpacing",
      "char",
      "charOff",
      "charSet",
      "checked",
      "clear",
      "cols",
      "colSpan",
      "color",
      "compact",
      "coords",
      "dateTime",
      "dir",
      "disabled",
      "encType",
      "htmlFor",
      "frame",
      "headers",
      "height",
      "hrefLang",
      "hSpace",
      "isMap",
      "id",
      "label",
      "lang",
      "maxLength",
      "media",
      "method",
      "multiple",
      "name",
      "noHref",
      "noShade",
      "noWrap",
      "open",
      "prompt",
      "readOnly",
      "rel",
      "rev",
      "rows",
      "rowSpan",
      "rules",
      "scope",
      "selected",
      "shape",
      "size",
      "span",
      "start",
      "summary",
      "tabIndex",
      "target",
      "title",
      "type",
      "useMap",
      "vAlign",
      "value",
      "vSpace",
      "width",
      "itemProp"
    ]
  },
  required: {
    input: {
      type: "checkbox",
      disabled: true
    }
  }
};

// node_modules/hast-util-sanitize/lib/index.js
var own5 = {}.hasOwnProperty;
var nodeSchema = {
  root: { children: all3 },
  doctype: handleDoctype,
  comment: handleComment,
  element: {
    tagName: handleTagName,
    properties: handleProperties,
    children: all3
  },
  text: { value: handleValue },
  "*": { data: allow, position: allow }
};
function sanitize(node2, schema) {
  let ctx = { type: "root", children: [] };
  if (node2 && typeof node2 === "object" && node2.type) {
    const replace2 = one3(
      Object.assign({}, defaultSchema, schema || {}),
      node2,
      []
    );
    if (replace2) {
      if (Array.isArray(replace2)) {
        if (replace2.length === 1) {
          ctx = replace2[0];
        } else {
          ctx.children = replace2;
        }
      } else {
        ctx = replace2;
      }
    }
  }
  return ctx;
}
function one3(schema, node2, stack) {
  const type = node2 && node2.type;
  const replacement = { type: node2.type };
  let replace2;
  if (own5.call(nodeSchema, type)) {
    let definition2 = nodeSchema[type];
    if (typeof definition2 === "function") {
      definition2 = definition2(schema, node2);
    }
    if (definition2) {
      const allowed = Object.assign({}, definition2, nodeSchema["*"]);
      let key2;
      replace2 = true;
      for (key2 in allowed) {
        if (own5.call(allowed, key2)) {
          const result = allowed[key2](schema, node2[key2], node2, stack);
          if (result === false) {
            replace2 = void 0;
            replacement[key2] = node2[key2];
          } else if (result !== void 0 && result !== null) {
            replacement[key2] = result;
          }
        }
      }
    }
  }
  if (replace2) {
    return replacement;
  }
  return replacement.type === "element" && schema.strip && !schema.strip.includes(replacement.tagName) ? replacement.children : void 0;
}
function all3(schema, children, node2, stack) {
  const results = [];
  if (Array.isArray(children)) {
    let index2 = -1;
    if (node2.type === "element") {
      stack.push(node2.tagName);
    }
    while (++index2 < children.length) {
      const value = one3(schema, children[index2], stack);
      if (value) {
        if (Array.isArray(value)) {
          results.push(...value);
        } else {
          results.push(value);
        }
      }
    }
    if (node2.type === "element") {
      stack.pop();
    }
  }
  return results;
}
function handleDoctype(schema) {
  return schema.allowDoctypes ? { name: handleDoctypeName } : void 0;
}
function handleComment(schema) {
  return schema.allowComments ? { value: handleCommentValue } : void 0;
}
function handleProperties(schema, properties, node2, stack) {
  const name = handleTagName(schema, node2.tagName, node2, stack);
  const attrs = schema.attributes || {};
  const reqs = schema.required || {};
  const props = properties || {};
  const allowed = Object.assign(
    {},
    toPropertyValueMap(attrs["*"]),
    toPropertyValueMap(name && own5.call(attrs, name) ? attrs[name] : [])
  );
  const result = {};
  let key2;
  for (key2 in props) {
    if (own5.call(props, key2)) {
      let value = props[key2];
      let definition2;
      if (own5.call(allowed, key2)) {
        definition2 = allowed[key2];
      } else if (data(key2) && own5.call(allowed, "data*")) {
        definition2 = allowed["data*"];
      } else {
        continue;
      }
      value = Array.isArray(value) ? handlePropertyValues(schema, value, key2, definition2) : handlePropertyValue(schema, value, key2, definition2);
      if (value !== void 0 && value !== null) {
        result[key2] = value;
      }
    }
  }
  if (name && own5.call(reqs, name)) {
    for (key2 in reqs[name]) {
      if (!own5.call(result, key2)) {
        result[key2] = reqs[name][key2];
      }
    }
  }
  return result;
}
function handleDoctypeName() {
  return "html";
}
function handleTagName(schema, tagName, _2, stack) {
  const name = typeof tagName === "string" ? tagName : "";
  let index2 = -1;
  if (!name || name === "*" || schema.tagNames && !schema.tagNames.includes(name)) {
    return false;
  }
  if (schema.ancestors && own5.call(schema.ancestors, name)) {
    while (++index2 < schema.ancestors[name].length) {
      if (stack.includes(schema.ancestors[name][index2])) {
        return name;
      }
    }
    return false;
  }
  return name;
}
function handleCommentValue(_2, value) {
  const result = typeof value === "string" ? value : "";
  const index2 = result.indexOf("-->");
  return index2 < 0 ? result : result.slice(0, index2);
}
function handleValue(_2, value) {
  return typeof value === "string" ? value : "";
}
function allow(_2, value) {
  return value;
}
function handlePropertyValues(schema, values, prop, definition2) {
  let index2 = -1;
  const result = [];
  while (++index2 < values.length) {
    const value = handlePropertyValue(schema, values[index2], prop, definition2);
    if (value !== void 0 && value !== null) {
      result.push(value);
    }
  }
  return result;
}
function handlePropertyValue(schema, value, prop, definition2) {
  if ((typeof value === "boolean" || typeof value === "number" || typeof value === "string") && safeProtocol(schema, value, prop) && (definition2.length === 0 || definition2.some(
    (allowed) => allowed && typeof allowed === "object" && "flags" in allowed ? allowed.test(String(value)) : allowed === value
  ))) {
    return schema.clobberPrefix && schema.clobber && schema.clobber.includes(prop) ? schema.clobberPrefix + value : value;
  }
}
function safeProtocol(schema, value, prop) {
  const url = String(value);
  const colon = url.indexOf(":");
  const questionMark = url.indexOf("?");
  const numberSign = url.indexOf("#");
  const slash = url.indexOf("/");
  const protocols = schema.protocols && own5.call(schema.protocols, prop) ? schema.protocols[prop].concat() : [];
  let index2 = -1;
  if (protocols.length === 0 || colon < 0 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
  slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign) {
    return true;
  }
  while (++index2 < protocols.length) {
    if (colon === protocols[index2].length && url.slice(0, protocols[index2].length) === protocols[index2]) {
      return true;
    }
  }
  return false;
}
function toPropertyValueMap(values) {
  const result = {};
  let index2 = -1;
  while (++index2 < values.length) {
    const value = values[index2];
    if (Array.isArray(value)) {
      result[value[0]] = value.slice(1);
    } else {
      result[value] = [];
    }
  }
  return result;
}
function data(prop) {
  return prop.length > 4 && prop.slice(0, 4).toLowerCase() === "data";
}

// node_modules/rehype-sanitize/index.js
function rehypeSanitize(options = defaultSchema) {
  return (tree) => sanitize(tree, options);
}

// node_modules/property-information/lib/util/schema.js
var Schema = class {
  /**
   * @constructor
   * @param {Properties} property
   * @param {Normal} normal
   * @param {string} [space]
   */
  constructor(property, normal, space2) {
    this.property = property;
    this.normal = normal;
    if (space2) {
      this.space = space2;
    }
  }
};
Schema.prototype.property = {};
Schema.prototype.normal = {};
Schema.prototype.space = null;

// node_modules/property-information/lib/util/merge.js
function merge(definitions2, space2) {
  const property = {};
  const normal = {};
  let index2 = -1;
  while (++index2 < definitions2.length) {
    Object.assign(property, definitions2[index2].property);
    Object.assign(normal, definitions2[index2].normal);
  }
  return new Schema(property, normal, space2);
}

// node_modules/property-information/lib/normalize.js
function normalize2(value) {
  return value.toLowerCase();
}

// node_modules/property-information/lib/util/info.js
var Info = class {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   */
  constructor(property, attribute) {
    this.property = property;
    this.attribute = attribute;
  }
};
Info.prototype.space = null;
Info.prototype.boolean = false;
Info.prototype.booleanish = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.number = false;
Info.prototype.commaSeparated = false;
Info.prototype.spaceSeparated = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.mustUseProperty = false;
Info.prototype.defined = false;

// node_modules/property-information/lib/util/types.js
var types_exports = {};
__export(types_exports, {
  boolean: () => boolean,
  booleanish: () => booleanish,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  commaSeparated: () => commaSeparated,
  number: () => number,
  overloadedBoolean: () => overloadedBoolean,
  spaceSeparated: () => spaceSeparated
});
var powers = 0;
var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}

// node_modules/property-information/lib/util/defined-info.js
var checks = Object.keys(types_exports);
var DefinedInfo = class extends Info {
  /**
   * @constructor
   * @param {string} property
   * @param {string} attribute
   * @param {number|null} [mask]
   * @param {string} [space]
   */
  constructor(property, attribute, mask, space2) {
    let index2 = -1;
    super(property, attribute);
    mark(this, "space", space2);
    if (typeof mask === "number") {
      while (++index2 < checks.length) {
        const check = checks[index2];
        mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
      }
    }
  }
};
DefinedInfo.prototype.defined = true;
function mark(values, key2, value) {
  if (value) {
    values[key2] = value;
  }
}

// node_modules/property-information/lib/util/create.js
var own6 = {}.hasOwnProperty;
function create(definition2) {
  const property = {};
  const normal = {};
  let prop;
  for (prop in definition2.properties) {
    if (own6.call(definition2.properties, prop)) {
      const value = definition2.properties[prop];
      const info = new DefinedInfo(
        prop,
        definition2.transform(definition2.attributes || {}, prop),
        value,
        definition2.space
      );
      if (definition2.mustUseProperty && definition2.mustUseProperty.includes(prop)) {
        info.mustUseProperty = true;
      }
      property[prop] = info;
      normal[normalize2(prop)] = prop;
      normal[normalize2(info.attribute)] = prop;
    }
  }
  return new Schema(property, normal, definition2.space);
}

// node_modules/property-information/lib/xlink.js
var xlink = create({
  space: "xlink",
  transform(_2, prop) {
    return "xlink:" + prop.slice(5).toLowerCase();
  },
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  }
});

// node_modules/property-information/lib/xml.js
var xml = create({
  space: "xml",
  transform(_2, prop) {
    return "xml:" + prop.slice(3).toLowerCase();
  },
  properties: { xmlLang: null, xmlBase: null, xmlSpace: null }
});

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}

// node_modules/property-information/lib/xmlns.js
var xmlns = create({
  space: "xmlns",
  attributes: { xmlnsxlink: "xmlns:xlink" },
  transform: caseInsensitiveTransform,
  properties: { xmlns: null, xmlnsXLink: null }
});

// node_modules/property-information/lib/aria.js
var aria = create({
  transform(_2, prop) {
    return prop === "role" ? prop : "aria-" + prop.slice(4).toLowerCase();
  },
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  }
});

// node_modules/property-information/lib/html.js
var html2 = create({
  space: "html",
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  transform: caseInsensitiveTransform,
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    capture: boolean,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    cols: number,
    colSpan: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: boolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  }
});

// node_modules/property-information/lib/svg.js
var svg = create({
  space: "svg",
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  transform: caseSensitiveTransform,
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  }
});

// node_modules/property-information/lib/find.js
var valid = /^data[-\w.:]+$/i;
var dash = /-[a-z]/g;
var cap = /[A-Z]/g;
function find(schema, value) {
  const normal = normalize2(value);
  let prop = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      prop = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(prop, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}

// node_modules/property-information/index.js
var html3 = merge([xml, xlink, xmlns, aria, html2], "html");
var svg2 = merge([xml, xlink, xmlns, aria, svg], "svg");

// node_modules/html-void-elements/index.js
var htmlVoidElements = [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "nextid",
  "param",
  "source",
  "track",
  "wbr"
];

// node_modules/zwitch/index.js
var own7 = {}.hasOwnProperty;
function zwitch(key2, options) {
  const settings = options || {};
  function one5(value, ...parameters) {
    let fn = one5.invalid;
    const handlers2 = one5.handlers;
    if (value && own7.call(value, key2)) {
      const id = String(value[key2]);
      fn = own7.call(handlers2, id) ? handlers2[id] : one5.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one5.handlers = settings.handlers || {};
  one5.invalid = settings.invalid;
  one5.unknown = settings.unknown;
  return one5;
}

// node_modules/stringify-entities/lib/core.js
function core(value, options) {
  value = value.replace(
    options.subset ? charactersToExpression(options.subset) : /["&'<>`]/g,
    basic
  );
  if (options.subset || options.escapeOnly) {
    return value;
  }
  return value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, surrogate).replace(
    // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
    /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,
    basic
  );
  function surrogate(pair, index2, all5) {
    return options.format(
      (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
      all5.charCodeAt(index2 + 2),
      options
    );
  }
  function basic(character, index2, all5) {
    return options.format(
      character.charCodeAt(0),
      all5.charCodeAt(index2 + 1),
      options
    );
  }
}
function charactersToExpression(subset) {
  const groups = [];
  let index2 = -1;
  while (++index2 < subset.length) {
    groups.push(subset[index2].replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"));
  }
  return new RegExp("(?:" + groups.join("|") + ")", "g");
}

// node_modules/stringify-entities/lib/util/to-hexadecimal.js
function toHexadecimal(code3, next, omit) {
  const value = "&#x" + code3.toString(16).toUpperCase();
  return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next)) ? value : value + ";";
}

// node_modules/stringify-entities/lib/util/to-decimal.js
function toDecimal(code3, next, omit) {
  const value = "&#" + String(code3);
  return omit && next && !/\d/.test(String.fromCharCode(next)) ? value : value + ";";
}

// node_modules/character-entities-legacy/index.js
var characterEntitiesLegacy = [
  "AElig",
  "AMP",
  "Aacute",
  "Acirc",
  "Agrave",
  "Aring",
  "Atilde",
  "Auml",
  "COPY",
  "Ccedil",
  "ETH",
  "Eacute",
  "Ecirc",
  "Egrave",
  "Euml",
  "GT",
  "Iacute",
  "Icirc",
  "Igrave",
  "Iuml",
  "LT",
  "Ntilde",
  "Oacute",
  "Ocirc",
  "Ograve",
  "Oslash",
  "Otilde",
  "Ouml",
  "QUOT",
  "REG",
  "THORN",
  "Uacute",
  "Ucirc",
  "Ugrave",
  "Uuml",
  "Yacute",
  "aacute",
  "acirc",
  "acute",
  "aelig",
  "agrave",
  "amp",
  "aring",
  "atilde",
  "auml",
  "brvbar",
  "ccedil",
  "cedil",
  "cent",
  "copy",
  "curren",
  "deg",
  "divide",
  "eacute",
  "ecirc",
  "egrave",
  "eth",
  "euml",
  "frac12",
  "frac14",
  "frac34",
  "gt",
  "iacute",
  "icirc",
  "iexcl",
  "igrave",
  "iquest",
  "iuml",
  "laquo",
  "lt",
  "macr",
  "micro",
  "middot",
  "nbsp",
  "not",
  "ntilde",
  "oacute",
  "ocirc",
  "ograve",
  "ordf",
  "ordm",
  "oslash",
  "otilde",
  "ouml",
  "para",
  "plusmn",
  "pound",
  "quot",
  "raquo",
  "reg",
  "sect",
  "shy",
  "sup1",
  "sup2",
  "sup3",
  "szlig",
  "thorn",
  "times",
  "uacute",
  "ucirc",
  "ugrave",
  "uml",
  "uuml",
  "yacute",
  "yen",
  "yuml"
];

// node_modules/character-entities-html4/index.js
var characterEntitiesHtml4 = {
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  fnof: "\u0192",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  bull: "\u2022",
  hellip: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  oline: "\u203E",
  frasl: "\u2044",
  weierp: "\u2118",
  image: "\u2111",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  circ: "\u02C6",
  tilde: "\u02DC",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  permil: "\u2030",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  euro: "\u20AC"
};

// node_modules/stringify-entities/lib/constant/dangerous.js
var dangerous = [
  "cent",
  "copy",
  "divide",
  "gt",
  "lt",
  "not",
  "para",
  "times"
];

// node_modules/stringify-entities/lib/util/to-named.js
var own8 = {}.hasOwnProperty;
var characters = {};
var key;
for (key in characterEntitiesHtml4) {
  if (own8.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key;
  }
}
function toNamed(code3, next, omit, attribute) {
  const character = String.fromCharCode(code3);
  if (own8.call(characters, character)) {
    const name = characters[character];
    const value = "&" + name;
    if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && /[^\da-z]/i.test(String.fromCharCode(next)))) {
      return value;
    }
    return value + ";";
  }
  return "";
}

// node_modules/stringify-entities/lib/util/format-smart.js
function formatSmart(code3, next, options) {
  let numeric = toHexadecimal(code3, next, options.omitOptionalSemicolons);
  let named;
  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code3,
      next,
      options.omitOptionalSemicolons,
      options.attribute
    );
  }
  if ((options.useShortestReferences || !named) && options.useShortestReferences) {
    const decimal = toDecimal(code3, next, options.omitOptionalSemicolons);
    if (decimal.length < numeric.length) {
      numeric = decimal;
    }
  }
  return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
}

// node_modules/stringify-entities/lib/index.js
function stringifyEntities(value, options) {
  return core(value, Object.assign({ format: formatSmart }, options));
}

// node_modules/hast-util-to-html/lib/handle/comment.js
function comment(node2, _1, _2, state) {
  return state.settings.bogusComments ? "<?" + stringifyEntities(
    node2.value,
    Object.assign({}, state.settings.characterReferences, { subset: [">"] })
  ) + ">" : "<!--" + node2.value.replace(/^>|^->|<!--|-->|--!>|<!-$/g, encode) + "-->";
  function encode($0) {
    return stringifyEntities(
      $0,
      Object.assign({}, state.settings.characterReferences, {
        subset: ["<", ">"]
      })
    );
  }
}

// node_modules/hast-util-to-html/lib/handle/doctype.js
function doctype(_1, _2, _3, state) {
  return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
}

// node_modules/ccount/index.js
function ccount(value, character) {
  const source = String(value);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index2 = source.indexOf(character);
  while (index2 !== -1) {
    count++;
    index2 = source.indexOf(character, index2 + character.length);
  }
  return count;
}

// node_modules/comma-separated-tokens/index.js
function stringify(values, options) {
  const settings = options || {};
  const input = values[values.length - 1] === "" ? [...values, ""] : values;
  return input.join(
    (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
  ).trim();
}

// node_modules/space-separated-tokens/index.js
function stringify2(values) {
  return values.join(" ").trim();
}

// node_modules/hast-util-whitespace/index.js
function whitespace(thing) {
  const value = (
    // @ts-expect-error looks like a node.
    thing && typeof thing === "object" && thing.type === "text" ? (
      // @ts-expect-error looks like a text.
      thing.value || ""
    ) : thing
  );
  return typeof value === "string" && value.replace(/[ \t\n\f\r]/g, "") === "";
}

// node_modules/hast-util-to-html/lib/omission/util/siblings.js
var siblingAfter = siblings(1);
var siblingBefore = siblings(-1);
function siblings(increment2) {
  return sibling;
  function sibling(parent, index2, includeWhitespace) {
    const siblings2 = parent ? parent.children : [];
    let offset = (index2 || 0) + increment2;
    let next = siblings2 && siblings2[offset];
    if (!includeWhitespace) {
      while (next && whitespace(next)) {
        offset += increment2;
        next = siblings2[offset];
      }
    }
    return next;
  }
}

// node_modules/hast-util-to-html/lib/omission/omission.js
var own9 = {}.hasOwnProperty;
function omission(handlers2) {
  return omit;
  function omit(node2, index2, parent) {
    return own9.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
  }
}

// node_modules/hast-util-to-html/lib/omission/closing.js
var closing = omission({
  html: html4,
  head: headOrColgroupOrCaption,
  body,
  p: p2,
  li,
  dt,
  dd,
  rt: rubyElement,
  rp: rubyElement,
  optgroup,
  option,
  menuitem,
  colgroup: headOrColgroupOrCaption,
  caption: headOrColgroupOrCaption,
  thead,
  tbody,
  tfoot,
  tr,
  td: cells,
  th: cells
});
function headOrColgroupOrCaption(_2, index2, parent) {
  const next = siblingAfter(parent, index2, true);
  return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
}
function html4(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type !== "comment";
}
function body(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type !== "comment";
}
function p2(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || // Confusing parent.
  !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
}
function li(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "li";
}
function dt(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
}
function dd(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
}
function rubyElement(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
}
function optgroup(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "optgroup";
}
function option(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
}
function menuitem(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "menuitem" || next.tagName === "hr" || next.tagName === "menu");
}
function thead(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
}
function tbody(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
}
function tfoot(_2, index2, parent) {
  return !siblingAfter(parent, index2);
}
function tr(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "tr";
}
function cells(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
}

// node_modules/hast-util-to-html/lib/omission/opening.js
var opening = omission({
  html: html5,
  head,
  body: body2,
  colgroup,
  tbody: tbody2
});
function html5(node2) {
  const head2 = siblingAfter(node2, -1);
  return !head2 || head2.type !== "comment";
}
function head(node2) {
  const children = node2.children;
  const seen = [];
  let index2 = -1;
  while (++index2 < children.length) {
    const child = children[index2];
    if (child.type === "element" && (child.tagName === "title" || child.tagName === "base")) {
      if (seen.includes(child.tagName))
        return false;
      seen.push(child.tagName);
    }
  }
  return children.length > 0;
}
function body2(node2) {
  const head2 = siblingAfter(node2, -1, true);
  return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
}
function colgroup(node2, index2, parent) {
  const previous3 = siblingBefore(parent, index2);
  const head2 = siblingAfter(node2, -1, true);
  if (parent && previous3 && previous3.type === "element" && previous3.tagName === "colgroup" && closing(previous3, parent.children.indexOf(previous3), parent)) {
    return false;
  }
  return head2 && head2.type === "element" && head2.tagName === "col";
}
function tbody2(node2, index2, parent) {
  const previous3 = siblingBefore(parent, index2);
  const head2 = siblingAfter(node2, -1);
  if (parent && previous3 && previous3.type === "element" && (previous3.tagName === "thead" || previous3.tagName === "tbody") && closing(previous3, parent.children.indexOf(previous3), parent)) {
    return false;
  }
  return head2 && head2.type === "element" && head2.tagName === "tr";
}

// node_modules/hast-util-to-html/lib/handle/element.js
var constants = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
    [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
    ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(""), "\"&'`".split("")],
    ["\0&'".split(""), "\0\"&'`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(""), "\"&'`".split("")],
    ['\0"&'.split(""), "\0\"&'`".split("")]
  ]
};
function element2(node2, index2, parent, state) {
  const schema = state.schema;
  const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
  let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node2.tagName.toLowerCase());
  const parts = [];
  let last;
  if (schema.space === "html" && node2.tagName === "svg") {
    state.schema = svg2;
  }
  const attrs = serializeAttributes(state, node2.properties);
  const content3 = state.all(
    schema.space === "html" && node2.tagName === "template" ? node2.content : node2
  );
  state.schema = schema;
  if (content3)
    selfClosing = false;
  if (attrs || !omit || !opening(node2, index2, parent)) {
    parts.push("<", node2.tagName, attrs ? " " + attrs : "");
    if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
      last = attrs.charAt(attrs.length - 1);
      if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
        parts.push(" ");
      }
      parts.push("/");
    }
    parts.push(">");
  }
  parts.push(content3);
  if (!selfClosing && (!omit || !closing(node2, index2, parent))) {
    parts.push("</" + node2.tagName + ">");
  }
  return parts.join("");
}
function serializeAttributes(state, props) {
  const values = [];
  let index2 = -1;
  let key2;
  if (props) {
    for (key2 in props) {
      if (props[key2] !== void 0 && props[key2] !== null) {
        const value = serializeAttribute(state, key2, props[key2]);
        if (value)
          values.push(value);
      }
    }
  }
  while (++index2 < values.length) {
    const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : null;
    if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
      values[index2] += " ";
    }
  }
  return values.join("");
}
function serializeAttribute(state, key2, value) {
  const info = find(state.schema, key2);
  const x2 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
  const y2 = state.settings.allowDangerousCharacters ? 0 : 1;
  let quote = state.quote;
  let result;
  if (info.overloadedBoolean && (value === info.attribute || value === "")) {
    value = true;
  } else if (info.boolean || info.overloadedBoolean && typeof value !== "string") {
    value = Boolean(value);
  }
  if (value === void 0 || value === null || value === false || typeof value === "number" && Number.isNaN(value)) {
    return "";
  }
  const name = stringifyEntities(
    info.attribute,
    Object.assign({}, state.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: constants.name[x2][y2]
    })
  );
  if (value === true)
    return name;
  value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
    padLeft: !state.settings.tightCommaSeparatedLists
  }) : String(value);
  if (state.settings.collapseEmptyAttributes && !value)
    return name;
  if (state.settings.preferUnquoted) {
    result = stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        subset: constants.unquoted[x2][y2],
        attribute: true
      })
    );
  }
  if (result !== value) {
    if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
      quote = state.alternative;
    }
    result = quote + stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: (quote === "'" ? constants.single : constants.double)[x2][y2],
        attribute: true
      })
    ) + quote;
  }
  return name + (result ? "=" + result : result);
}

// node_modules/hast-util-to-html/lib/handle/text.js
function text4(node2, _2, parent, state) {
  return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(
    node2.value,
    Object.assign({}, state.settings.characterReferences, {
      subset: ["<", "&"]
    })
  );
}

// node_modules/hast-util-to-html/lib/handle/raw.js
function raw(node2, index2, parent, state) {
  return state.settings.allowDangerousHtml ? node2.value : text4(node2, index2, parent, state);
}

// node_modules/hast-util-to-html/lib/handle/root.js
function root2(node2, _1, _2, state) {
  return state.all(node2);
}

// node_modules/hast-util-to-html/lib/handle/index.js
var handle = zwitch("type", {
  invalid,
  unknown,
  handlers: { comment, doctype, element: element2, raw, root: root2, text: text4 }
});
function invalid(node2) {
  throw new Error("Expected node, not `" + node2 + "`");
}
function unknown(node2) {
  throw new Error("Cannot compile unknown node `" + node2.type + "`");
}

// node_modules/hast-util-to-html/lib/index.js
function toHtml(tree, options) {
  const options_ = options || {};
  const quote = options_.quote || '"';
  const alternative = quote === '"' ? "'" : '"';
  if (quote !== '"' && quote !== "'") {
    throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
  }
  const state = {
    one: one4,
    all: all4,
    settings: {
      omitOptionalTags: options_.omitOptionalTags || false,
      allowParseErrors: options_.allowParseErrors || false,
      allowDangerousCharacters: options_.allowDangerousCharacters || false,
      quoteSmart: options_.quoteSmart || false,
      preferUnquoted: options_.preferUnquoted || false,
      tightAttributes: options_.tightAttributes || false,
      upperDoctype: options_.upperDoctype || false,
      tightDoctype: options_.tightDoctype || false,
      bogusComments: options_.bogusComments || false,
      tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
      tightSelfClosing: options_.tightSelfClosing || false,
      collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
      allowDangerousHtml: options_.allowDangerousHtml || false,
      voids: options_.voids || htmlVoidElements,
      characterReferences: options_.characterReferences || options_.entities || {},
      closeSelfClosing: options_.closeSelfClosing || false,
      closeEmptyElements: options_.closeEmptyElements || false
    },
    schema: options_.space === "svg" ? svg2 : html3,
    quote,
    alternative
  };
  return state.one(
    Array.isArray(tree) ? { type: "root", children: tree } : tree,
    void 0,
    void 0
  );
}
function one4(node2, index2, parent) {
  return handle(node2, index2, parent, this);
}
function all4(parent) {
  const results = [];
  const children = parent && parent.children || [];
  let index2 = -1;
  while (++index2 < children.length) {
    results[index2] = this.one(children[index2], index2, parent);
  }
  return results.join("");
}

// node_modules/rehype-stringify/lib/index.js
function rehypeStringify(config) {
  const processorSettings = (
    /** @type {Options} */
    this.data("settings")
  );
  const settings = Object.assign({}, processorSettings, config);
  Object.assign(this, { Compiler: compiler2 });
  function compiler2(tree) {
    return toHtml(tree, settings);
  }
}

// node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
var www = {
  tokenize: tokenizeWww,
  partial: true
};
var domain = {
  tokenize: tokenizeDomain,
  partial: true
};
var path2 = {
  tokenize: tokenizePath,
  partial: true
};
var punctuation = {
  tokenize: tokenizePunctuation,
  partial: true
};
var namedCharacterReference = {
  tokenize: tokenizeNamedCharacterReference,
  partial: true
};
var wwwAutolink = {
  tokenize: tokenizeWwwAutolink,
  previous: previousWww
};
var httpAutolink = {
  tokenize: tokenizeHttpAutolink,
  previous: previousHttp
};
var emailAutolink = {
  tokenize: tokenizeEmailAutolink,
  previous: previousEmail
};
var text5 = {};
var gfmAutolinkLiteral = {
  text: text5
};
var code2 = 48;
while (code2 < 123) {
  text5[code2] = emailAutolink;
  code2++;
  if (code2 === 58)
    code2 = 65;
  else if (code2 === 91)
    code2 = 97;
}
text5[43] = emailAutolink;
text5[45] = emailAutolink;
text5[46] = emailAutolink;
text5[95] = emailAutolink;
text5[72] = [emailAutolink, httpAutolink];
text5[104] = [emailAutolink, httpAutolink];
text5[87] = [emailAutolink, wwwAutolink];
text5[119] = [emailAutolink, wwwAutolink];
function tokenizeEmailAutolink(effects, ok2, nok) {
  const self = this;
  let hasDot;
  let hasDigitInLastSegment;
  return start;
  function start(code3) {
    if (!gfmAtext(code3) || !previousEmail(self.previous) || previousUnbalanced(self.events)) {
      return nok(code3);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkEmail");
    return atext(code3);
  }
  function atext(code3) {
    if (gfmAtext(code3)) {
      effects.consume(code3);
      return atext;
    }
    if (code3 === 64) {
      effects.consume(code3);
      return label;
    }
    return nok(code3);
  }
  function label(code3) {
    if (code3 === 46) {
      return effects.check(punctuation, done, dotContinuation)(code3);
    }
    if (code3 === 45 || code3 === 95) {
      return effects.check(punctuation, nok, dashOrUnderscoreContinuation)(code3);
    }
    if (asciiAlphanumeric(code3)) {
      if (!hasDigitInLastSegment && asciiDigit(code3)) {
        hasDigitInLastSegment = true;
      }
      effects.consume(code3);
      return label;
    }
    return done(code3);
  }
  function dotContinuation(code3) {
    effects.consume(code3);
    hasDot = true;
    hasDigitInLastSegment = void 0;
    return label;
  }
  function dashOrUnderscoreContinuation(code3) {
    effects.consume(code3);
    return afterDashOrUnderscore;
  }
  function afterDashOrUnderscore(code3) {
    if (code3 === 46) {
      return effects.check(punctuation, nok, dotContinuation)(code3);
    }
    return label(code3);
  }
  function done(code3) {
    if (hasDot && !hasDigitInLastSegment) {
      effects.exit("literalAutolinkEmail");
      effects.exit("literalAutolink");
      return ok2(code3);
    }
    return nok(code3);
  }
}
function tokenizeWwwAutolink(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    if (code3 !== 87 && code3 !== 119 || !previousWww(self.previous) || previousUnbalanced(self.events)) {
      return nok(code3);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkWww");
    return effects.check(
      www,
      effects.attempt(domain, effects.attempt(path2, done), nok),
      nok
    )(code3);
  }
  function done(code3) {
    effects.exit("literalAutolinkWww");
    effects.exit("literalAutolink");
    return ok2(code3);
  }
}
function tokenizeHttpAutolink(effects, ok2, nok) {
  const self = this;
  return start;
  function start(code3) {
    if (code3 !== 72 && code3 !== 104 || !previousHttp(self.previous) || previousUnbalanced(self.events)) {
      return nok(code3);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkHttp");
    effects.consume(code3);
    return t1;
  }
  function t1(code3) {
    if (code3 === 84 || code3 === 116) {
      effects.consume(code3);
      return t22;
    }
    return nok(code3);
  }
  function t22(code3) {
    if (code3 === 84 || code3 === 116) {
      effects.consume(code3);
      return p3;
    }
    return nok(code3);
  }
  function p3(code3) {
    if (code3 === 80 || code3 === 112) {
      effects.consume(code3);
      return s7;
    }
    return nok(code3);
  }
  function s7(code3) {
    if (code3 === 83 || code3 === 115) {
      effects.consume(code3);
      return colon;
    }
    return colon(code3);
  }
  function colon(code3) {
    if (code3 === 58) {
      effects.consume(code3);
      return slash1;
    }
    return nok(code3);
  }
  function slash1(code3) {
    if (code3 === 47) {
      effects.consume(code3);
      return slash2;
    }
    return nok(code3);
  }
  function slash2(code3) {
    if (code3 === 47) {
      effects.consume(code3);
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    return code3 === null || asciiControl(code3) || unicodeWhitespace(code3) || unicodePunctuation(code3) ? nok(code3) : effects.attempt(domain, effects.attempt(path2, done), nok)(code3);
  }
  function done(code3) {
    effects.exit("literalAutolinkHttp");
    effects.exit("literalAutolink");
    return ok2(code3);
  }
}
function tokenizeWww(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.consume(code3);
    return w2;
  }
  function w2(code3) {
    if (code3 === 87 || code3 === 119) {
      effects.consume(code3);
      return w3;
    }
    return nok(code3);
  }
  function w3(code3) {
    if (code3 === 87 || code3 === 119) {
      effects.consume(code3);
      return dot;
    }
    return nok(code3);
  }
  function dot(code3) {
    if (code3 === 46) {
      effects.consume(code3);
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    return code3 === null || markdownLineEnding(code3) ? nok(code3) : ok2(code3);
  }
}
function tokenizeDomain(effects, ok2, nok) {
  let hasUnderscoreInLastSegment;
  let hasUnderscoreInLastLastSegment;
  return domain2;
  function domain2(code3) {
    if (code3 === 38) {
      return effects.check(
        namedCharacterReference,
        done,
        punctuationContinuation
      )(code3);
    }
    if (code3 === 46 || code3 === 95) {
      return effects.check(punctuation, done, punctuationContinuation)(code3);
    }
    if (code3 === null || asciiControl(code3) || unicodeWhitespace(code3) || code3 !== 45 && unicodePunctuation(code3)) {
      return done(code3);
    }
    effects.consume(code3);
    return domain2;
  }
  function punctuationContinuation(code3) {
    if (code3 === 46) {
      hasUnderscoreInLastLastSegment = hasUnderscoreInLastSegment;
      hasUnderscoreInLastSegment = void 0;
      effects.consume(code3);
      return domain2;
    }
    if (code3 === 95)
      hasUnderscoreInLastSegment = true;
    effects.consume(code3);
    return domain2;
  }
  function done(code3) {
    if (!hasUnderscoreInLastLastSegment && !hasUnderscoreInLastSegment) {
      return ok2(code3);
    }
    return nok(code3);
  }
}
function tokenizePath(effects, ok2) {
  let balance = 0;
  return inPath;
  function inPath(code3) {
    if (code3 === 38) {
      return effects.check(
        namedCharacterReference,
        ok2,
        continuedPunctuation
      )(code3);
    }
    if (code3 === 40) {
      balance++;
    }
    if (code3 === 41) {
      return effects.check(
        punctuation,
        parenAtPathEnd,
        continuedPunctuation
      )(code3);
    }
    if (pathEnd(code3)) {
      return ok2(code3);
    }
    if (trailingPunctuation(code3)) {
      return effects.check(punctuation, ok2, continuedPunctuation)(code3);
    }
    effects.consume(code3);
    return inPath;
  }
  function continuedPunctuation(code3) {
    effects.consume(code3);
    return inPath;
  }
  function parenAtPathEnd(code3) {
    balance--;
    return balance < 0 ? ok2(code3) : continuedPunctuation(code3);
  }
}
function tokenizeNamedCharacterReference(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.consume(code3);
    return inside;
  }
  function inside(code3) {
    if (asciiAlpha(code3)) {
      effects.consume(code3);
      return inside;
    }
    if (code3 === 59) {
      effects.consume(code3);
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    return pathEnd(code3) ? ok2(code3) : nok(code3);
  }
}
function tokenizePunctuation(effects, ok2, nok) {
  return start;
  function start(code3) {
    effects.consume(code3);
    return after;
  }
  function after(code3) {
    if (trailingPunctuation(code3)) {
      effects.consume(code3);
      return after;
    }
    return pathEnd(code3) ? ok2(code3) : nok(code3);
  }
}
function trailingPunctuation(code3) {
  return code3 === 33 || code3 === 34 || code3 === 39 || code3 === 41 || code3 === 42 || code3 === 44 || code3 === 46 || code3 === 58 || code3 === 59 || code3 === 60 || code3 === 63 || code3 === 95 || code3 === 126;
}
function pathEnd(code3) {
  return code3 === null || code3 === 60 || markdownLineEndingOrSpace(code3);
}
function gfmAtext(code3) {
  return code3 === 43 || code3 === 45 || code3 === 46 || code3 === 95 || asciiAlphanumeric(code3);
}
function previousWww(code3) {
  return code3 === null || code3 === 40 || code3 === 42 || code3 === 95 || code3 === 126 || markdownLineEndingOrSpace(code3);
}
function previousHttp(code3) {
  return code3 === null || !asciiAlpha(code3);
}
function previousEmail(code3) {
  return code3 !== 47 && previousHttp(code3);
}
function previousUnbalanced(events) {
  let index2 = events.length;
  let result = false;
  while (index2--) {
    const token = events[index2][1];
    if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
      result = true;
      break;
    }
    if (token._gfmAutolinkLiteralWalkedInto) {
      result = false;
      break;
    }
  }
  if (events.length > 0 && !result) {
    events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
  }
  return result;
}

// node_modules/micromark-extension-gfm-footnote/lib/syntax.js
var indent = {
  tokenize: tokenizeIndent2,
  partial: true
};
function gfmFootnote() {
  return {
    document: {
      [91]: {
        tokenize: tokenizeDefinitionStart,
        continuation: {
          tokenize: tokenizeDefinitionContinuation
        },
        exit: gfmFootnoteDefinitionEnd
      }
    },
    text: {
      [91]: {
        tokenize: tokenizeGfmFootnoteCall
      },
      [93]: {
        add: "after",
        tokenize: tokenizePotentialGfmFootnoteCall,
        resolveTo: resolveToPotentialGfmFootnoteCall
      }
    }
  };
}
function tokenizePotentialGfmFootnoteCall(effects, ok2, nok) {
  const self = this;
  let index2 = self.events.length;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let labelStart;
  while (index2--) {
    const token = self.events[index2][1];
    if (token.type === "labelImage") {
      labelStart = token;
      break;
    }
    if (token.type === "gfmFootnoteCall" || token.type === "labelLink" || token.type === "label" || token.type === "image" || token.type === "link") {
      break;
    }
  }
  return start;
  function start(code3) {
    if (!labelStart || !labelStart._balanced) {
      return nok(code3);
    }
    const id = normalizeIdentifier(
      self.sliceSerialize({
        start: labelStart.end,
        end: self.now()
      })
    );
    if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
      return nok(code3);
    }
    effects.enter("gfmFootnoteCallLabelMarker");
    effects.consume(code3);
    effects.exit("gfmFootnoteCallLabelMarker");
    return ok2(code3);
  }
}
function resolveToPotentialGfmFootnoteCall(events, context) {
  let index2 = events.length;
  let labelStart;
  while (index2--) {
    if (events[index2][1].type === "labelImage" && events[index2][0] === "enter") {
      labelStart = events[index2][1];
      break;
    }
  }
  events[index2 + 1][1].type = "data";
  events[index2 + 3][1].type = "gfmFootnoteCallLabelMarker";
  const call = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, events[index2 + 3][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  };
  const marker = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, events[index2 + 3][1].end),
    end: Object.assign({}, events[index2 + 3][1].end)
  };
  marker.end.column++;
  marker.end.offset++;
  marker.end._bufferIndex++;
  const string3 = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, marker.end),
    end: Object.assign({}, events[events.length - 1][1].start)
  };
  const chunk = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, string3.start),
    end: Object.assign({}, string3.end)
  };
  const replacement = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    events[index2 + 1],
    events[index2 + 2],
    ["enter", call, context],
    // The `[`
    events[index2 + 3],
    events[index2 + 4],
    // The `^`.
    ["enter", marker, context],
    ["exit", marker, context],
    // Everything in between.
    ["enter", string3, context],
    ["enter", chunk, context],
    ["exit", chunk, context],
    ["exit", string3, context],
    // The ending (`]`, properly parsed and labelled).
    events[events.length - 2],
    events[events.length - 1],
    ["exit", call, context]
  ];
  events.splice(index2, events.length - index2 + 1, ...replacement);
  return events;
}
function tokenizeGfmFootnoteCall(effects, ok2, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let size = 0;
  let data2;
  return start;
  function start(code3) {
    effects.enter("gfmFootnoteCall");
    effects.enter("gfmFootnoteCallLabelMarker");
    effects.consume(code3);
    effects.exit("gfmFootnoteCallLabelMarker");
    return callStart;
  }
  function callStart(code3) {
    if (code3 !== 94)
      return nok(code3);
    effects.enter("gfmFootnoteCallMarker");
    effects.consume(code3);
    effects.exit("gfmFootnoteCallMarker");
    effects.enter("gfmFootnoteCallString");
    effects.enter("chunkString").contentType = "string";
    return callData;
  }
  function callData(code3) {
    if (
      // Too long.
      size > 999 || // Closing brace with nothing.
      code3 === 93 && !data2 || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code3 === null || code3 === 91 || markdownLineEndingOrSpace(code3)
    ) {
      return nok(code3);
    }
    if (code3 === 93) {
      effects.exit("chunkString");
      const token = effects.exit("gfmFootnoteCallString");
      if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) {
        return nok(code3);
      }
      effects.enter("gfmFootnoteCallLabelMarker");
      effects.consume(code3);
      effects.exit("gfmFootnoteCallLabelMarker");
      effects.exit("gfmFootnoteCall");
      return ok2;
    }
    if (!markdownLineEndingOrSpace(code3)) {
      data2 = true;
    }
    size++;
    effects.consume(code3);
    return code3 === 92 ? callEscape : callData;
  }
  function callEscape(code3) {
    if (code3 === 91 || code3 === 92 || code3 === 93) {
      effects.consume(code3);
      size++;
      return callData;
    }
    return callData(code3);
  }
}
function tokenizeDefinitionStart(effects, ok2, nok) {
  const self = this;
  const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
  let identifier;
  let size = 0;
  let data2;
  return start;
  function start(code3) {
    effects.enter("gfmFootnoteDefinition")._container = true;
    effects.enter("gfmFootnoteDefinitionLabel");
    effects.enter("gfmFootnoteDefinitionLabelMarker");
    effects.consume(code3);
    effects.exit("gfmFootnoteDefinitionLabelMarker");
    return labelAtMarker;
  }
  function labelAtMarker(code3) {
    if (code3 === 94) {
      effects.enter("gfmFootnoteDefinitionMarker");
      effects.consume(code3);
      effects.exit("gfmFootnoteDefinitionMarker");
      effects.enter("gfmFootnoteDefinitionLabelString");
      effects.enter("chunkString").contentType = "string";
      return labelInside;
    }
    return nok(code3);
  }
  function labelInside(code3) {
    if (
      // Too long.
      size > 999 || // Closing brace with nothing.
      code3 === 93 && !data2 || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      code3 === null || code3 === 91 || markdownLineEndingOrSpace(code3)
    ) {
      return nok(code3);
    }
    if (code3 === 93) {
      effects.exit("chunkString");
      const token = effects.exit("gfmFootnoteDefinitionLabelString");
      identifier = normalizeIdentifier(self.sliceSerialize(token));
      effects.enter("gfmFootnoteDefinitionLabelMarker");
      effects.consume(code3);
      effects.exit("gfmFootnoteDefinitionLabelMarker");
      effects.exit("gfmFootnoteDefinitionLabel");
      return labelAfter;
    }
    if (!markdownLineEndingOrSpace(code3)) {
      data2 = true;
    }
    size++;
    effects.consume(code3);
    return code3 === 92 ? labelEscape : labelInside;
  }
  function labelEscape(code3) {
    if (code3 === 91 || code3 === 92 || code3 === 93) {
      effects.consume(code3);
      size++;
      return labelInside;
    }
    return labelInside(code3);
  }
  function labelAfter(code3) {
    if (code3 === 58) {
      effects.enter("definitionMarker");
      effects.consume(code3);
      effects.exit("definitionMarker");
      if (!defined.includes(identifier)) {
        defined.push(identifier);
      }
      return factorySpace(
        effects,
        whitespaceAfter,
        "gfmFootnoteDefinitionWhitespace"
      );
    }
    return nok(code3);
  }
  function whitespaceAfter(code3) {
    return ok2(code3);
  }
}
function tokenizeDefinitionContinuation(effects, ok2, nok) {
  return effects.check(blankLine, ok2, effects.attempt(indent, ok2, nok));
}
function gfmFootnoteDefinitionEnd(effects) {
  effects.exit("gfmFootnoteDefinition");
}
function tokenizeIndent2(effects, ok2, nok) {
  const self = this;
  return factorySpace(
    effects,
    afterPrefix,
    "gfmFootnoteDefinitionIndent",
    4 + 1
  );
  function afterPrefix(code3) {
    const tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "gfmFootnoteDefinitionIndent" && tail[2].sliceSerialize(tail[1], true).length === 4 ? ok2(code3) : nok(code3);
  }
}

// node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
function gfmStrikethrough(options) {
  const options_ = options || {};
  let single = options_.singleTilde;
  const tokenizer = {
    tokenize: tokenizeStrikethrough,
    resolveAll: resolveAllStrikethrough
  };
  if (single === null || single === void 0) {
    single = true;
  }
  return {
    text: {
      [126]: tokenizer
    },
    insideSpan: {
      null: [tokenizer]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function resolveAllStrikethrough(events, context) {
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][0] === "enter" && events[index2][1].type === "strikethroughSequenceTemporary" && events[index2][1]._close) {
        let open = index2;
        while (open--) {
          if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && // If the sizes are the same:
          events[index2][1].end.offset - events[index2][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
            events[index2][1].type = "strikethroughSequence";
            events[open][1].type = "strikethroughSequence";
            const strikethrough2 = {
              type: "strikethrough",
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index2][1].end)
            };
            const text6 = {
              type: "strikethroughText",
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index2][1].start)
            };
            const nextEvents = [
              ["enter", strikethrough2, context],
              ["enter", events[open][1], context],
              ["exit", events[open][1], context],
              ["enter", text6, context]
            ];
            const insideSpan2 = context.parser.constructs.insideSpan.null;
            if (insideSpan2) {
              splice(
                nextEvents,
                nextEvents.length,
                0,
                // @ts-expect-error: to do: update `mdast-util-types` to allow explicit `undefined`s.
                resolveAll(insideSpan2, events.slice(open + 1, index2), context)
              );
            }
            splice(nextEvents, nextEvents.length, 0, [
              ["exit", text6, context],
              ["enter", events[index2][1], context],
              ["exit", events[index2][1], context],
              ["exit", strikethrough2, context]
            ]);
            splice(events, open - 1, index2 - open + 3, nextEvents);
            index2 = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === "strikethroughSequenceTemporary") {
        events[index2][1].type = "data";
      }
    }
    return events;
  }
  function tokenizeStrikethrough(effects, ok2, nok) {
    const previous3 = this.previous;
    const events = this.events;
    let size = 0;
    return start;
    function start(code3) {
      if (previous3 === 126 && events[events.length - 1][1].type !== "characterEscape") {
        return nok(code3);
      }
      effects.enter("strikethroughSequenceTemporary");
      return more(code3);
    }
    function more(code3) {
      const before = classifyCharacter(previous3);
      if (code3 === 126) {
        if (size > 1)
          return nok(code3);
        effects.consume(code3);
        size++;
        return more;
      }
      if (size < 2 && !single)
        return nok(code3);
      const token = effects.exit("strikethroughSequenceTemporary");
      const after = classifyCharacter(code3);
      token._open = !after || after === 2 && Boolean(before);
      token._close = !before || before === 2 && Boolean(after);
      return ok2(code3);
    }
  }
}

// node_modules/micromark-extension-gfm-table/lib/syntax.js
var gfmTable = {
  flow: {
    null: {
      tokenize: tokenizeTable,
      resolve: resolveTable
    }
  }
};
var nextPrefixedOrBlank = {
  tokenize: tokenizeNextPrefixedOrBlank,
  partial: true
};
function resolveTable(events, context) {
  let index2 = -1;
  let inHead;
  let inDelimiterRow;
  let inRow;
  let contentStart;
  let contentEnd;
  let cellStart;
  let seenCellInRow;
  while (++index2 < events.length) {
    const token = events[index2][1];
    if (inRow) {
      if (token.type === "temporaryTableCellContent") {
        contentStart = contentStart || index2;
        contentEnd = index2;
      }
      if (
        // Combine separate content parts into one.
        (token.type === "tableCellDivider" || token.type === "tableRow") && contentEnd
      ) {
        const content3 = {
          type: "tableContent",
          start: events[contentStart][1].start,
          end: events[contentEnd][1].end
        };
        const text6 = {
          type: "chunkText",
          start: content3.start,
          end: content3.end,
          // @ts-expect-error It’s fine.
          contentType: "text"
        };
        events.splice(
          contentStart,
          contentEnd - contentStart + 1,
          ["enter", content3, context],
          ["enter", text6, context],
          ["exit", text6, context],
          ["exit", content3, context]
        );
        index2 -= contentEnd - contentStart - 3;
        contentStart = void 0;
        contentEnd = void 0;
      }
    }
    if (events[index2][0] === "exit" && cellStart !== void 0 && cellStart + (seenCellInRow ? 0 : 1) < index2 && (token.type === "tableCellDivider" || token.type === "tableRow" && (cellStart + 3 < index2 || events[cellStart][1].type !== "whitespace"))) {
      const cell = {
        type: inDelimiterRow ? "tableDelimiter" : inHead ? "tableHeader" : "tableData",
        start: events[cellStart][1].start,
        end: events[index2][1].end
      };
      events.splice(index2 + (token.type === "tableCellDivider" ? 1 : 0), 0, [
        "exit",
        cell,
        context
      ]);
      events.splice(cellStart, 0, ["enter", cell, context]);
      index2 += 2;
      cellStart = index2 + 1;
      seenCellInRow = true;
    }
    if (token.type === "tableRow") {
      inRow = events[index2][0] === "enter";
      if (inRow) {
        cellStart = index2 + 1;
        seenCellInRow = false;
      }
    }
    if (token.type === "tableDelimiterRow") {
      inDelimiterRow = events[index2][0] === "enter";
      if (inDelimiterRow) {
        cellStart = index2 + 1;
        seenCellInRow = false;
      }
    }
    if (token.type === "tableHead") {
      inHead = events[index2][0] === "enter";
    }
  }
  return events;
}
function tokenizeTable(effects, ok2, nok) {
  const self = this;
  const align = [];
  let tableHeaderCount = 0;
  let seenDelimiter;
  let hasDash;
  return start;
  function start(code3) {
    effects.enter("table")._align = align;
    effects.enter("tableHead");
    effects.enter("tableRow");
    if (code3 === 124) {
      return cellDividerHead(code3);
    }
    tableHeaderCount++;
    effects.enter("temporaryTableCellContent");
    return inCellContentHead(code3);
  }
  function cellDividerHead(code3) {
    effects.enter("tableCellDivider");
    effects.consume(code3);
    effects.exit("tableCellDivider");
    seenDelimiter = true;
    return cellBreakHead;
  }
  function cellBreakHead(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return atRowEndHead(code3);
    }
    if (markdownSpace(code3)) {
      effects.enter("whitespace");
      effects.consume(code3);
      return inWhitespaceHead;
    }
    if (seenDelimiter) {
      seenDelimiter = void 0;
      tableHeaderCount++;
    }
    if (code3 === 124) {
      return cellDividerHead(code3);
    }
    effects.enter("temporaryTableCellContent");
    return inCellContentHead(code3);
  }
  function inWhitespaceHead(code3) {
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return inWhitespaceHead;
    }
    effects.exit("whitespace");
    return cellBreakHead(code3);
  }
  function inCellContentHead(code3) {
    if (code3 === null || code3 === 124 || markdownLineEndingOrSpace(code3)) {
      effects.exit("temporaryTableCellContent");
      return cellBreakHead(code3);
    }
    effects.consume(code3);
    return code3 === 92 ? inCellContentEscapeHead : inCellContentHead;
  }
  function inCellContentEscapeHead(code3) {
    if (code3 === 92 || code3 === 124) {
      effects.consume(code3);
      return inCellContentHead;
    }
    return inCellContentHead(code3);
  }
  function atRowEndHead(code3) {
    if (code3 === null) {
      return nok(code3);
    }
    effects.exit("tableRow");
    effects.exit("tableHead");
    const originalInterrupt = self.interrupt;
    self.interrupt = true;
    return effects.attempt(
      {
        tokenize: tokenizeRowEnd,
        partial: true
      },
      function(code4) {
        self.interrupt = originalInterrupt;
        effects.enter("tableDelimiterRow");
        return atDelimiterRowBreak(code4);
      },
      function(code4) {
        self.interrupt = originalInterrupt;
        return nok(code4);
      }
    )(code3);
  }
  function atDelimiterRowBreak(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return rowEndDelimiter(code3);
    }
    if (markdownSpace(code3)) {
      effects.enter("whitespace");
      effects.consume(code3);
      return inWhitespaceDelimiter;
    }
    if (code3 === 45) {
      effects.enter("tableDelimiterFiller");
      effects.consume(code3);
      hasDash = true;
      align.push("none");
      return inFillerDelimiter;
    }
    if (code3 === 58) {
      effects.enter("tableDelimiterAlignment");
      effects.consume(code3);
      effects.exit("tableDelimiterAlignment");
      align.push("left");
      return afterLeftAlignment;
    }
    if (code3 === 124) {
      effects.enter("tableCellDivider");
      effects.consume(code3);
      effects.exit("tableCellDivider");
      return atDelimiterRowBreak;
    }
    return nok(code3);
  }
  function inWhitespaceDelimiter(code3) {
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return inWhitespaceDelimiter;
    }
    effects.exit("whitespace");
    return atDelimiterRowBreak(code3);
  }
  function inFillerDelimiter(code3) {
    if (code3 === 45) {
      effects.consume(code3);
      return inFillerDelimiter;
    }
    effects.exit("tableDelimiterFiller");
    if (code3 === 58) {
      effects.enter("tableDelimiterAlignment");
      effects.consume(code3);
      effects.exit("tableDelimiterAlignment");
      align[align.length - 1] = align[align.length - 1] === "left" ? "center" : "right";
      return afterRightAlignment;
    }
    return atDelimiterRowBreak(code3);
  }
  function afterLeftAlignment(code3) {
    if (code3 === 45) {
      effects.enter("tableDelimiterFiller");
      effects.consume(code3);
      hasDash = true;
      return inFillerDelimiter;
    }
    return nok(code3);
  }
  function afterRightAlignment(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return rowEndDelimiter(code3);
    }
    if (markdownSpace(code3)) {
      effects.enter("whitespace");
      effects.consume(code3);
      return inWhitespaceDelimiter;
    }
    if (code3 === 124) {
      effects.enter("tableCellDivider");
      effects.consume(code3);
      effects.exit("tableCellDivider");
      return atDelimiterRowBreak;
    }
    return nok(code3);
  }
  function rowEndDelimiter(code3) {
    effects.exit("tableDelimiterRow");
    if (!hasDash || tableHeaderCount !== align.length) {
      return nok(code3);
    }
    if (code3 === null) {
      return tableClose(code3);
    }
    return effects.check(
      nextPrefixedOrBlank,
      tableClose,
      effects.attempt(
        {
          tokenize: tokenizeRowEnd,
          partial: true
        },
        factorySpace(effects, bodyStart, "linePrefix", 4),
        tableClose
      )
    )(code3);
  }
  function tableClose(code3) {
    effects.exit("table");
    return ok2(code3);
  }
  function bodyStart(code3) {
    effects.enter("tableBody");
    return rowStartBody(code3);
  }
  function rowStartBody(code3) {
    effects.enter("tableRow");
    if (code3 === 124) {
      return cellDividerBody(code3);
    }
    effects.enter("temporaryTableCellContent");
    return inCellContentBody(code3);
  }
  function cellDividerBody(code3) {
    effects.enter("tableCellDivider");
    effects.consume(code3);
    effects.exit("tableCellDivider");
    return cellBreakBody;
  }
  function cellBreakBody(code3) {
    if (code3 === null || markdownLineEnding(code3)) {
      return atRowEndBody(code3);
    }
    if (markdownSpace(code3)) {
      effects.enter("whitespace");
      effects.consume(code3);
      return inWhitespaceBody;
    }
    if (code3 === 124) {
      return cellDividerBody(code3);
    }
    effects.enter("temporaryTableCellContent");
    return inCellContentBody(code3);
  }
  function inWhitespaceBody(code3) {
    if (markdownSpace(code3)) {
      effects.consume(code3);
      return inWhitespaceBody;
    }
    effects.exit("whitespace");
    return cellBreakBody(code3);
  }
  function inCellContentBody(code3) {
    if (code3 === null || code3 === 124 || markdownLineEndingOrSpace(code3)) {
      effects.exit("temporaryTableCellContent");
      return cellBreakBody(code3);
    }
    effects.consume(code3);
    return code3 === 92 ? inCellContentEscapeBody : inCellContentBody;
  }
  function inCellContentEscapeBody(code3) {
    if (code3 === 92 || code3 === 124) {
      effects.consume(code3);
      return inCellContentBody;
    }
    return inCellContentBody(code3);
  }
  function atRowEndBody(code3) {
    effects.exit("tableRow");
    if (code3 === null) {
      return tableBodyClose(code3);
    }
    return effects.check(
      nextPrefixedOrBlank,
      tableBodyClose,
      effects.attempt(
        {
          tokenize: tokenizeRowEnd,
          partial: true
        },
        factorySpace(effects, rowStartBody, "linePrefix", 4),
        tableBodyClose
      )
    )(code3);
  }
  function tableBodyClose(code3) {
    effects.exit("tableBody");
    return tableClose(code3);
  }
  function tokenizeRowEnd(effects2, ok3, nok2) {
    return start2;
    function start2(code3) {
      effects2.enter("lineEnding");
      effects2.consume(code3);
      effects2.exit("lineEnding");
      return factorySpace(effects2, prefixed, "linePrefix");
    }
    function prefixed(code3) {
      if (self.parser.lazy[self.now().line] || code3 === null || markdownLineEnding(code3)) {
        return nok2(code3);
      }
      const tail = self.events[self.events.length - 1];
      if (!self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
        return nok2(code3);
      }
      self._gfmTableDynamicInterruptHack = true;
      return effects2.check(
        self.parser.constructs.flow,
        function(code4) {
          self._gfmTableDynamicInterruptHack = false;
          return nok2(code4);
        },
        function(code4) {
          self._gfmTableDynamicInterruptHack = false;
          return ok3(code4);
        }
      )(code3);
    }
  }
}
function tokenizeNextPrefixedOrBlank(effects, ok2, nok) {
  let size = 0;
  return start;
  function start(code3) {
    effects.enter("check");
    effects.consume(code3);
    return whitespace2;
  }
  function whitespace2(code3) {
    if (code3 === -1 || code3 === 32) {
      effects.consume(code3);
      size++;
      return size === 4 ? ok2 : whitespace2;
    }
    if (code3 === null || markdownLineEndingOrSpace(code3)) {
      return ok2(code3);
    }
    return nok(code3);
  }
}

// node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
var tasklistCheck = {
  tokenize: tokenizeTasklistCheck
};
var gfmTaskListItem = {
  text: {
    [91]: tasklistCheck
  }
};
function tokenizeTasklistCheck(effects, ok2, nok) {
  const self = this;
  return open;
  function open(code3) {
    if (
      // Exit if there’s stuff before.
      self.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !self._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code3);
    }
    effects.enter("taskListCheck");
    effects.enter("taskListCheckMarker");
    effects.consume(code3);
    effects.exit("taskListCheckMarker");
    return inside;
  }
  function inside(code3) {
    if (markdownLineEndingOrSpace(code3)) {
      effects.enter("taskListCheckValueUnchecked");
      effects.consume(code3);
      effects.exit("taskListCheckValueUnchecked");
      return close;
    }
    if (code3 === 88 || code3 === 120) {
      effects.enter("taskListCheckValueChecked");
      effects.consume(code3);
      effects.exit("taskListCheckValueChecked");
      return close;
    }
    return nok(code3);
  }
  function close(code3) {
    if (code3 === 93) {
      effects.enter("taskListCheckMarker");
      effects.consume(code3);
      effects.exit("taskListCheckMarker");
      effects.exit("taskListCheck");
      return after;
    }
    return nok(code3);
  }
  function after(code3) {
    if (markdownLineEnding(code3)) {
      return ok2(code3);
    }
    if (markdownSpace(code3)) {
      return effects.check(
        {
          tokenize: spaceThenNonSpace
        },
        ok2,
        nok
      )(code3);
    }
    return nok(code3);
  }
}
function spaceThenNonSpace(effects, ok2, nok) {
  return factorySpace(effects, after, "whitespace");
  function after(code3) {
    return code3 === null ? nok(code3) : ok2(code3);
  }
}

// node_modules/micromark-extension-gfm/index.js
function gfm(options) {
  return combineExtensions([
    gfmAutolinkLiteral,
    gfmFootnote(),
    gfmStrikethrough(options),
    gfmTable,
    gfmTaskListItem
  ]);
}

// node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string3) {
  if (typeof string3 !== "string") {
    throw new TypeError("Expected a string");
  }
  return string3.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// node_modules/mdast-util-find-and-replace/lib/index.js
var own10 = {}.hasOwnProperty;
var findAndReplace = (
  /**
   * @type {(
   *   (<Tree extends Node>(tree: Tree, find: Find, replace?: Replace | null | undefined, options?: Options | null | undefined) => Tree) &
   *   (<Tree extends Node>(tree: Tree, schema: FindAndReplaceSchema | FindAndReplaceList, options?: Options | null | undefined) => Tree)
   * )}
   **/
  /**
   * @template {Node} Tree
   * @param {Tree} tree
   * @param {Find | FindAndReplaceSchema | FindAndReplaceList} find
   * @param {Replace | Options | null | undefined} [replace]
   * @param {Options | null | undefined} [options]
   * @returns {Tree}
   */
  function(tree, find2, replace2, options) {
    let settings;
    let schema;
    if (typeof find2 === "string" || find2 instanceof RegExp) {
      schema = [[find2, replace2]];
      settings = options;
    } else {
      schema = find2;
      settings = replace2;
    }
    if (!settings) {
      settings = {};
    }
    const ignored = convert(settings.ignore || []);
    const pairs = toPairs(schema);
    let pairIndex = -1;
    while (++pairIndex < pairs.length) {
      visitParents(tree, "text", visitor);
    }
    return tree;
    function visitor(node2, parents) {
      let index2 = -1;
      let grandparent;
      while (++index2 < parents.length) {
        const parent = parents[index2];
        if (ignored(
          parent,
          // @ts-expect-error: TS doesn’t understand but it’s perfect.
          grandparent ? grandparent.children.indexOf(parent) : void 0,
          grandparent
        )) {
          return;
        }
        grandparent = parent;
      }
      if (grandparent) {
        return handler(node2, parents);
      }
    }
    function handler(node2, parents) {
      const parent = parents[parents.length - 1];
      const find3 = pairs[pairIndex][0];
      const replace3 = pairs[pairIndex][1];
      let start = 0;
      const index2 = parent.children.indexOf(node2);
      let change = false;
      let nodes = [];
      find3.lastIndex = 0;
      let match = find3.exec(node2.value);
      while (match) {
        const position3 = match.index;
        const matchObject = {
          index: match.index,
          input: match.input,
          // @ts-expect-error: stack is fine.
          stack: [...parents, node2]
        };
        let value = replace3(...match, matchObject);
        if (typeof value === "string") {
          value = value.length > 0 ? { type: "text", value } : void 0;
        }
        if (value !== false) {
          if (start !== position3) {
            nodes.push({
              type: "text",
              value: node2.value.slice(start, position3)
            });
          }
          if (Array.isArray(value)) {
            nodes.push(...value);
          } else if (value) {
            nodes.push(value);
          }
          start = position3 + match[0].length;
          change = true;
        }
        if (!find3.global) {
          break;
        }
        match = find3.exec(node2.value);
      }
      if (change) {
        if (start < node2.value.length) {
          nodes.push({ type: "text", value: node2.value.slice(start) });
        }
        parent.children.splice(index2, 1, ...nodes);
      } else {
        nodes = [node2];
      }
      return index2 + nodes.length;
    }
  }
);
function toPairs(schema) {
  const result = [];
  if (typeof schema !== "object") {
    throw new TypeError("Expected array or object as schema");
  }
  if (Array.isArray(schema)) {
    let index2 = -1;
    while (++index2 < schema.length) {
      result.push([
        toExpression(schema[index2][0]),
        toFunction(schema[index2][1])
      ]);
    }
  } else {
    let key2;
    for (key2 in schema) {
      if (own10.call(schema, key2)) {
        result.push([toExpression(key2), toFunction(schema[key2])]);
      }
    }
  }
  return result;
}
function toExpression(find2) {
  return typeof find2 === "string" ? new RegExp(escapeStringRegexp(find2), "g") : find2;
}
function toFunction(replace2) {
  return typeof replace2 === "function" ? replace2 : () => replace2;
}

// node_modules/mdast-util-gfm-autolink-literal/lib/index.js
var inConstruct = "phrasing";
var notInConstruct = ["autolink", "link", "image", "label"];
var gfmAutolinkLiteralFromMarkdown = {
  transforms: [transformGfmAutolinkLiterals],
  enter: {
    literalAutolink: enterLiteralAutolink,
    literalAutolinkEmail: enterLiteralAutolinkValue,
    literalAutolinkHttp: enterLiteralAutolinkValue,
    literalAutolinkWww: enterLiteralAutolinkValue
  },
  exit: {
    literalAutolink: exitLiteralAutolink,
    literalAutolinkEmail: exitLiteralAutolinkEmail,
    literalAutolinkHttp: exitLiteralAutolinkHttp,
    literalAutolinkWww: exitLiteralAutolinkWww
  }
};
var gfmAutolinkLiteralToMarkdown = {
  unsafe: [
    {
      character: "@",
      before: "[+\\-.\\w]",
      after: "[\\-.\\w]",
      inConstruct,
      notInConstruct
    },
    {
      character: ".",
      before: "[Ww]",
      after: "[\\-.\\w]",
      inConstruct,
      notInConstruct
    },
    { character: ":", before: "[ps]", after: "\\/", inConstruct, notInConstruct }
  ]
};
function enterLiteralAutolink(token) {
  this.enter({ type: "link", title: null, url: "", children: [] }, token);
}
function enterLiteralAutolinkValue(token) {
  this.config.enter.autolinkProtocol.call(this, token);
}
function exitLiteralAutolinkHttp(token) {
  this.config.exit.autolinkProtocol.call(this, token);
}
function exitLiteralAutolinkWww(token) {
  this.config.exit.data.call(this, token);
  const node2 = (
    /** @type {Link} */
    this.stack[this.stack.length - 1]
  );
  node2.url = "http://" + this.sliceSerialize(token);
}
function exitLiteralAutolinkEmail(token) {
  this.config.exit.autolinkEmail.call(this, token);
}
function exitLiteralAutolink(token) {
  this.exit(token);
}
function transformGfmAutolinkLiterals(tree) {
  findAndReplace(
    tree,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
      [/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g, findEmail]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function findUrl(_2, protocol, domain2, path3, match) {
  let prefix = "";
  if (!previous2(match)) {
    return false;
  }
  if (/^w/i.test(protocol)) {
    domain2 = protocol + domain2;
    protocol = "";
    prefix = "http://";
  }
  if (!isCorrectDomain(domain2)) {
    return false;
  }
  const parts = splitUrl(domain2 + path3);
  if (!parts[0])
    return false;
  const result = {
    type: "link",
    title: null,
    url: prefix + protocol + parts[0],
    children: [{ type: "text", value: protocol + parts[0] }]
  };
  if (parts[1]) {
    return [result, { type: "text", value: parts[1] }];
  }
  return result;
}
function findEmail(_2, atext, label, match) {
  if (
    // Not an expected previous character.
    !previous2(match, true) || // Label ends in not allowed character.
    /[-\d_]$/.test(label)
  ) {
    return false;
  }
  return {
    type: "link",
    title: null,
    url: "mailto:" + atext + "@" + label,
    children: [{ type: "text", value: atext + "@" + label }]
  };
}
function isCorrectDomain(domain2) {
  const parts = domain2.split(".");
  if (parts.length < 2 || parts[parts.length - 1] && (/_/.test(parts[parts.length - 1]) || !/[a-zA-Z\d]/.test(parts[parts.length - 1])) || parts[parts.length - 2] && (/_/.test(parts[parts.length - 2]) || !/[a-zA-Z\d]/.test(parts[parts.length - 2]))) {
    return false;
  }
  return true;
}
function splitUrl(url) {
  const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);
  if (!trailExec) {
    return [url, void 0];
  }
  url = url.slice(0, trailExec.index);
  let trail = trailExec[0];
  let closingParenIndex = trail.indexOf(")");
  const openingParens = ccount(url, "(");
  let closingParens = ccount(url, ")");
  while (closingParenIndex !== -1 && openingParens > closingParens) {
    url += trail.slice(0, closingParenIndex + 1);
    trail = trail.slice(closingParenIndex + 1);
    closingParenIndex = trail.indexOf(")");
    closingParens++;
  }
  return [url, trail];
}
function previous2(match, email) {
  const code3 = match.input.charCodeAt(match.index - 1);
  return (match.index === 0 || unicodeWhitespace(code3) || unicodePunctuation(code3)) && (!email || code3 !== 47);
}

// node_modules/mdast-util-to-markdown/lib/util/association.js
function association(node2) {
  if (node2.label || !node2.identifier) {
    return node2.label || "";
  }
  return decodeString(node2.identifier);
}

// node_modules/mdast-util-to-markdown/lib/util/container-flow.js
function containerFlow(parent, state, info) {
  const indexStack = state.indexStack;
  const children = parent.children || [];
  const tracker = state.createTracker(info);
  const results = [];
  let index2 = -1;
  indexStack.push(-1);
  while (++index2 < children.length) {
    const child = children[index2];
    indexStack[indexStack.length - 1] = index2;
    results.push(
      tracker.move(
        state.handle(child, parent, state, {
          before: "\n",
          after: "\n",
          ...tracker.current()
        })
      )
    );
    if (child.type !== "list") {
      state.bulletLastUsed = void 0;
    }
    if (index2 < children.length - 1) {
      results.push(
        tracker.move(between(child, children[index2 + 1], parent, state))
      );
    }
  }
  indexStack.pop();
  return results.join("");
}
function between(left, right, parent, state) {
  let index2 = state.join.length;
  while (index2--) {
    const result = state.join[index2](left, right, parent, state);
    if (result === true || result === 1) {
      break;
    }
    if (typeof result === "number") {
      return "\n".repeat(1 + result);
    }
    if (result === false) {
      return "\n\n<!---->\n\n";
    }
  }
  return "\n\n";
}

// node_modules/mdast-util-to-markdown/lib/util/indent-lines.js
var eol = /\r?\n|\r/g;
function indentLines(value, map2) {
  const result = [];
  let start = 0;
  let line = 0;
  let match;
  while (match = eol.exec(value)) {
    one5(value.slice(start, match.index));
    result.push(match[0]);
    start = match.index + match[0].length;
    line++;
  }
  one5(value.slice(start));
  return result.join("");
  function one5(value2) {
    result.push(map2(value2, line, !value2));
  }
}

// node_modules/mdast-util-to-markdown/lib/util/pattern-compile.js
function patternCompile(pattern) {
  if (!pattern._compiled) {
    const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
    pattern._compiled = new RegExp(
      (before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""),
      "g"
    );
  }
  return pattern._compiled;
}

// node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
function patternInScope(stack, pattern) {
  return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
function listInScope(stack, list3, none) {
  if (typeof list3 === "string") {
    list3 = [list3];
  }
  if (!list3 || list3.length === 0) {
    return none;
  }
  let index2 = -1;
  while (++index2 < list3.length) {
    if (stack.includes(list3[index2])) {
      return true;
    }
  }
  return false;
}

// node_modules/mdast-util-to-markdown/lib/util/safe.js
function safe(state, input, config) {
  const value = (config.before || "") + (input || "") + (config.after || "");
  const positions = [];
  const result = [];
  const infos = {};
  let index2 = -1;
  while (++index2 < state.unsafe.length) {
    const pattern = state.unsafe[index2];
    if (!patternInScope(state.stack, pattern)) {
      continue;
    }
    const expression = patternCompile(pattern);
    let match;
    while (match = expression.exec(value)) {
      const before = "before" in pattern || Boolean(pattern.atBreak);
      const after = "after" in pattern;
      const position3 = match.index + (before ? match[1].length : 0);
      if (positions.includes(position3)) {
        if (infos[position3].before && !before) {
          infos[position3].before = false;
        }
        if (infos[position3].after && !after) {
          infos[position3].after = false;
        }
      } else {
        positions.push(position3);
        infos[position3] = { before, after };
      }
    }
  }
  positions.sort(numerical);
  let start = config.before ? config.before.length : 0;
  const end = value.length - (config.after ? config.after.length : 0);
  index2 = -1;
  while (++index2 < positions.length) {
    const position3 = positions[index2];
    if (position3 < start || position3 >= end) {
      continue;
    }
    if (position3 + 1 < end && positions[index2 + 1] === position3 + 1 && infos[position3].after && !infos[position3 + 1].before && !infos[position3 + 1].after || positions[index2 - 1] === position3 - 1 && infos[position3].before && !infos[position3 - 1].before && !infos[position3 - 1].after) {
      continue;
    }
    if (start !== position3) {
      result.push(escapeBackslashes(value.slice(start, position3), "\\"));
    }
    start = position3;
    if (/[!-/:-@[-`{-~]/.test(value.charAt(position3)) && (!config.encode || !config.encode.includes(value.charAt(position3)))) {
      result.push("\\");
    } else {
      result.push(
        "&#x" + value.charCodeAt(position3).toString(16).toUpperCase() + ";"
      );
      start++;
    }
  }
  result.push(escapeBackslashes(value.slice(start, end), config.after));
  return result.join("");
}
function numerical(a3, b2) {
  return a3 - b2;
}
function escapeBackslashes(value, after) {
  const expression = /\\(?=[!-/:-@[-`{-~])/g;
  const positions = [];
  const results = [];
  const whole = value + after;
  let index2 = -1;
  let start = 0;
  let match;
  while (match = expression.exec(whole)) {
    positions.push(match.index);
  }
  while (++index2 < positions.length) {
    if (start !== positions[index2]) {
      results.push(value.slice(start, positions[index2]));
    }
    results.push("\\");
    start = positions[index2];
  }
  results.push(value.slice(start));
  return results.join("");
}

// node_modules/mdast-util-to-markdown/lib/util/track.js
function track(config) {
  const options = config || {};
  const now = options.now || {};
  let lineShift = options.lineShift || 0;
  let line = now.line || 1;
  let column = now.column || 1;
  return { move, current, shift };
  function current() {
    return { now: { line, column }, lineShift };
  }
  function shift(value) {
    lineShift += value;
  }
  function move(input) {
    const value = input || "";
    const chunks = value.split(/\r?\n|\r/g);
    const tail = chunks[chunks.length - 1];
    line += chunks.length - 1;
    column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
    return value;
  }
}

// node_modules/mdast-util-gfm-footnote/lib/index.js
footnoteReference2.peek = footnoteReferencePeek;
function gfmFootnoteFromMarkdown() {
  return {
    enter: {
      gfmFootnoteDefinition: enterFootnoteDefinition,
      gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
      gfmFootnoteCall: enterFootnoteCall,
      gfmFootnoteCallString: enterFootnoteCallString
    },
    exit: {
      gfmFootnoteDefinition: exitFootnoteDefinition,
      gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
      gfmFootnoteCall: exitFootnoteCall,
      gfmFootnoteCallString: exitFootnoteCallString
    }
  };
}
function gfmFootnoteToMarkdown() {
  return {
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["phrasing", "label", "reference"] }],
    handlers: { footnoteDefinition, footnoteReference: footnoteReference2 }
  };
}
function enterFootnoteDefinition(token) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    token
  );
}
function enterFootnoteDefinitionLabelString() {
  this.buffer();
}
function exitFootnoteDefinitionLabelString(token) {
  const label = this.resume();
  const node2 = (
    /** @type {FootnoteDefinition} */
    this.stack[this.stack.length - 1]
  );
  node2.label = label;
  node2.identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase();
}
function exitFootnoteDefinition(token) {
  this.exit(token);
}
function enterFootnoteCall(token) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, token);
}
function enterFootnoteCallString() {
  this.buffer();
}
function exitFootnoteCallString(token) {
  const label = this.resume();
  const node2 = (
    /** @type {FootnoteDefinition} */
    this.stack[this.stack.length - 1]
  );
  node2.label = label;
  node2.identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase();
}
function exitFootnoteCall(token) {
  this.exit(token);
}
function footnoteReference2(node2, _2, context, safeOptions) {
  const tracker = track(safeOptions);
  let value = tracker.move("[^");
  const exit3 = context.enter("footnoteReference");
  const subexit = context.enter("reference");
  value += tracker.move(
    safe(context, association(node2), {
      ...tracker.current(),
      before: value,
      after: "]"
    })
  );
  subexit();
  exit3();
  value += tracker.move("]");
  return value;
}
function footnoteReferencePeek() {
  return "[";
}
function footnoteDefinition(node2, _2, context, safeOptions) {
  const tracker = track(safeOptions);
  let value = tracker.move("[^");
  const exit3 = context.enter("footnoteDefinition");
  const subexit = context.enter("label");
  value += tracker.move(
    safe(context, association(node2), {
      ...tracker.current(),
      before: value,
      after: "]"
    })
  );
  subexit();
  value += tracker.move(
    "]:" + (node2.children && node2.children.length > 0 ? " " : "")
  );
  tracker.shift(4);
  value += tracker.move(
    indentLines(containerFlow(node2, context, tracker.current()), map)
  );
  exit3();
  return value;
}
function map(line, index2, blank) {
  if (index2 === 0) {
    return line;
  }
  return (blank ? "" : "    ") + line;
}

// node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js
function containerPhrasing(parent, state, info) {
  const indexStack = state.indexStack;
  const children = parent.children || [];
  const results = [];
  let index2 = -1;
  let before = info.before;
  indexStack.push(-1);
  let tracker = state.createTracker(info);
  while (++index2 < children.length) {
    const child = children[index2];
    let after;
    indexStack[indexStack.length - 1] = index2;
    if (index2 + 1 < children.length) {
      let handle2 = state.handle.handlers[children[index2 + 1].type];
      if (handle2 && handle2.peek)
        handle2 = handle2.peek;
      after = handle2 ? handle2(children[index2 + 1], parent, state, {
        before: "",
        after: "",
        ...tracker.current()
      }).charAt(0) : "";
    } else {
      after = info.after;
    }
    if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
      results[results.length - 1] = results[results.length - 1].replace(
        /(\r?\n|\r)$/,
        " "
      );
      before = " ";
      tracker = state.createTracker(info);
      tracker.move(results.join(""));
    }
    results.push(
      tracker.move(
        state.handle(child, parent, state, {
          ...tracker.current(),
          before,
          after
        })
      )
    );
    before = results[results.length - 1].slice(-1);
  }
  indexStack.pop();
  return results.join("");
}

// node_modules/mdast-util-gfm-strikethrough/lib/index.js
var constructsWithoutStrikethrough = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
handleDelete.peek = peekDelete;
var gfmStrikethroughFromMarkdown = {
  canContainEols: ["delete"],
  enter: { strikethrough: enterStrikethrough },
  exit: { strikethrough: exitStrikethrough }
};
var gfmStrikethroughToMarkdown = {
  unsafe: [
    {
      character: "~",
      inConstruct: "phrasing",
      notInConstruct: constructsWithoutStrikethrough
    }
  ],
  handlers: { delete: handleDelete }
};
function enterStrikethrough(token) {
  this.enter({ type: "delete", children: [] }, token);
}
function exitStrikethrough(token) {
  this.exit(token);
}
function handleDelete(node2, _2, context, safeOptions) {
  const tracker = track(safeOptions);
  const exit3 = context.enter("strikethrough");
  let value = tracker.move("~~");
  value += containerPhrasing(node2, context, {
    ...tracker.current(),
    before: value,
    after: "~"
  });
  value += tracker.move("~~");
  exit3();
  return value;
}
function peekDelete() {
  return "~";
}

// node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
inlineCode2.peek = inlineCodePeek;
function inlineCode2(node2, _2, state) {
  let value = node2.value || "";
  let sequence = "`";
  let index2 = -1;
  while (new RegExp("(^|[^`])" + sequence + "([^`]|$)").test(value)) {
    sequence += "`";
  }
  if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) {
    value = " " + value + " ";
  }
  while (++index2 < state.unsafe.length) {
    const pattern = state.unsafe[index2];
    const expression = patternCompile(pattern);
    let match;
    if (!pattern.atBreak)
      continue;
    while (match = expression.exec(value)) {
      let position3 = match.index;
      if (value.charCodeAt(position3) === 10 && value.charCodeAt(position3 - 1) === 13) {
        position3--;
      }
      value = value.slice(0, position3) + " " + value.slice(match.index + 1);
    }
  }
  return sequence + value + sequence;
}
function inlineCodePeek() {
  return "`";
}

// node_modules/markdown-table/index.js
function markdownTable(table2, options = {}) {
  const align = (options.align || []).concat();
  const stringLength = options.stringLength || defaultStringLength;
  const alignments = [];
  const cellMatrix = [];
  const sizeMatrix = [];
  const longestCellByColumn = [];
  let mostCellsPerRow = 0;
  let rowIndex = -1;
  while (++rowIndex < table2.length) {
    const row2 = [];
    const sizes2 = [];
    let columnIndex2 = -1;
    if (table2[rowIndex].length > mostCellsPerRow) {
      mostCellsPerRow = table2[rowIndex].length;
    }
    while (++columnIndex2 < table2[rowIndex].length) {
      const cell = serialize(table2[rowIndex][columnIndex2]);
      if (options.alignDelimiters !== false) {
        const size = stringLength(cell);
        sizes2[columnIndex2] = size;
        if (longestCellByColumn[columnIndex2] === void 0 || size > longestCellByColumn[columnIndex2]) {
          longestCellByColumn[columnIndex2] = size;
        }
      }
      row2.push(cell);
    }
    cellMatrix[rowIndex] = row2;
    sizeMatrix[rowIndex] = sizes2;
  }
  let columnIndex = -1;
  if (typeof align === "object" && "length" in align) {
    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = toAlignment(align[columnIndex]);
    }
  } else {
    const code3 = toAlignment(align);
    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = code3;
    }
  }
  columnIndex = -1;
  const row = [];
  const sizes = [];
  while (++columnIndex < mostCellsPerRow) {
    const code3 = alignments[columnIndex];
    let before = "";
    let after = "";
    if (code3 === 99) {
      before = ":";
      after = ":";
    } else if (code3 === 108) {
      before = ":";
    } else if (code3 === 114) {
      after = ":";
    }
    let size = options.alignDelimiters === false ? 1 : Math.max(
      1,
      longestCellByColumn[columnIndex] - before.length - after.length
    );
    const cell = before + "-".repeat(size) + after;
    if (options.alignDelimiters !== false) {
      size = before.length + size + after.length;
      if (size > longestCellByColumn[columnIndex]) {
        longestCellByColumn[columnIndex] = size;
      }
      sizes[columnIndex] = size;
    }
    row[columnIndex] = cell;
  }
  cellMatrix.splice(1, 0, row);
  sizeMatrix.splice(1, 0, sizes);
  rowIndex = -1;
  const lines = [];
  while (++rowIndex < cellMatrix.length) {
    const row2 = cellMatrix[rowIndex];
    const sizes2 = sizeMatrix[rowIndex];
    columnIndex = -1;
    const line = [];
    while (++columnIndex < mostCellsPerRow) {
      const cell = row2[columnIndex] || "";
      let before = "";
      let after = "";
      if (options.alignDelimiters !== false) {
        const size = longestCellByColumn[columnIndex] - (sizes2[columnIndex] || 0);
        const code3 = alignments[columnIndex];
        if (code3 === 114) {
          before = " ".repeat(size);
        } else if (code3 === 99) {
          if (size % 2) {
            before = " ".repeat(size / 2 + 0.5);
            after = " ".repeat(size / 2 - 0.5);
          } else {
            before = " ".repeat(size / 2);
            after = before;
          }
        } else {
          after = " ".repeat(size);
        }
      }
      if (options.delimiterStart !== false && !columnIndex) {
        line.push("|");
      }
      if (options.padding !== false && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(options.alignDelimiters === false && cell === "") && (options.delimiterStart !== false || columnIndex)) {
        line.push(" ");
      }
      if (options.alignDelimiters !== false) {
        line.push(before);
      }
      line.push(cell);
      if (options.alignDelimiters !== false) {
        line.push(after);
      }
      if (options.padding !== false) {
        line.push(" ");
      }
      if (options.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) {
        line.push("|");
      }
    }
    lines.push(
      options.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join("")
    );
  }
  return lines.join("\n");
}
function serialize(value) {
  return value === null || value === void 0 ? "" : String(value);
}
function defaultStringLength(value) {
  return value.length;
}
function toAlignment(value) {
  const code3 = typeof value === "string" ? value.codePointAt(0) : 0;
  return code3 === 67 || code3 === 99 ? 99 : code3 === 76 || code3 === 108 ? 108 : code3 === 82 || code3 === 114 ? 114 : 0;
}

// node_modules/mdast-util-gfm-table/lib/index.js
var gfmTableFromMarkdown = {
  enter: {
    table: enterTable,
    tableData: enterCell,
    tableHeader: enterCell,
    tableRow: enterRow
  },
  exit: {
    codeText: exitCodeText,
    table: exitTable,
    tableData: exit2,
    tableHeader: exit2,
    tableRow: exit2
  }
};
function enterTable(token) {
  const align = token._align;
  this.enter(
    {
      type: "table",
      align: align.map((d3) => d3 === "none" ? null : d3),
      children: []
    },
    token
  );
  this.setData("inTable", true);
}
function exitTable(token) {
  this.exit(token);
  this.setData("inTable");
}
function enterRow(token) {
  this.enter({ type: "tableRow", children: [] }, token);
}
function exit2(token) {
  this.exit(token);
}
function enterCell(token) {
  this.enter({ type: "tableCell", children: [] }, token);
}
function exitCodeText(token) {
  let value = this.resume();
  if (this.getData("inTable")) {
    value = value.replace(/\\([\\|])/g, replace);
  }
  const node2 = (
    /** @type {InlineCode} */
    this.stack[this.stack.length - 1]
  );
  node2.value = value;
  this.exit(token);
}
function replace($0, $1) {
  return $1 === "|" ? $1 : $0;
}
function gfmTableToMarkdown(options) {
  const settings = options || {};
  const padding = settings.tableCellPadding;
  const alignDelimiters = settings.tablePipeAlign;
  const stringLength = settings.stringLength;
  const around = padding ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: "\n", inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: true, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: true, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: true, character: "-", after: "[:|-]" }
    ],
    handlers: {
      table: handleTable,
      tableRow: handleTableRow,
      tableCell: handleTableCell,
      inlineCode: inlineCodeWithTable
    }
  };
  function handleTable(node2, _2, context, safeOptions) {
    return serializeData(
      handleTableAsData(node2, context, safeOptions),
      node2.align
    );
  }
  function handleTableRow(node2, _2, context, safeOptions) {
    const row = handleTableRowAsData(node2, context, safeOptions);
    const value = serializeData([row]);
    return value.slice(0, value.indexOf("\n"));
  }
  function handleTableCell(node2, _2, context, safeOptions) {
    const exit3 = context.enter("tableCell");
    const subexit = context.enter("phrasing");
    const value = containerPhrasing(node2, context, {
      ...safeOptions,
      before: around,
      after: around
    });
    subexit();
    exit3();
    return value;
  }
  function serializeData(matrix, align) {
    return markdownTable(matrix, {
      align,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength
    });
  }
  function handleTableAsData(node2, context, safeOptions) {
    const children = node2.children;
    let index2 = -1;
    const result = [];
    const subexit = context.enter("table");
    while (++index2 < children.length) {
      result[index2] = handleTableRowAsData(
        children[index2],
        context,
        safeOptions
      );
    }
    subexit();
    return result;
  }
  function handleTableRowAsData(node2, context, safeOptions) {
    const children = node2.children;
    let index2 = -1;
    const result = [];
    const subexit = context.enter("tableRow");
    while (++index2 < children.length) {
      result[index2] = handleTableCell(
        children[index2],
        node2,
        context,
        safeOptions
      );
    }
    subexit();
    return result;
  }
  function inlineCodeWithTable(node2, parent, context) {
    let value = inlineCode2(node2, parent, context);
    if (context.stack.includes("tableCell")) {
      value = value.replace(/\|/g, "\\$&");
    }
    return value;
  }
}

// node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
function checkBullet(state) {
  const marker = state.options.bullet || "*";
  if (marker !== "*" && marker !== "+" && marker !== "-") {
    throw new Error(
      "Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  }
  return marker;
}

// node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
function checkListItemIndent(state) {
  const style = state.options.listItemIndent || "tab";
  if (style === 1 || style === "1") {
    return "one";
  }
  if (style !== "tab" && style !== "one" && style !== "mixed") {
    throw new Error(
      "Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  }
  return style;
}

// node_modules/mdast-util-to-markdown/lib/handle/list-item.js
function listItem2(node2, parent, state, info) {
  const listItemIndent = checkListItemIndent(state);
  let bullet = state.bulletCurrent || checkBullet(state);
  if (parent && parent.type === "list" && parent.ordered) {
    bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node2)) + bullet;
  }
  let size = bullet.length + 1;
  if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node2.spread)) {
    size = Math.ceil(size / 4) * 4;
  }
  const tracker = state.createTracker(info);
  tracker.move(bullet + " ".repeat(size - bullet.length));
  tracker.shift(size);
  const exit3 = state.enter("listItem");
  const value = state.indentLines(
    state.containerFlow(node2, tracker.current()),
    map2
  );
  exit3();
  return value;
  function map2(line, index2, blank) {
    if (index2) {
      return (blank ? "" : " ".repeat(size)) + line;
    }
    return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
  }
}

// node_modules/mdast-util-gfm-task-list-item/lib/index.js
var gfmTaskListItemFromMarkdown = {
  exit: {
    taskListCheckValueChecked: exitCheck,
    taskListCheckValueUnchecked: exitCheck,
    paragraph: exitParagraphWithTaskListItem
  }
};
var gfmTaskListItemToMarkdown = {
  unsafe: [{ atBreak: true, character: "-", after: "[:|-]" }],
  handlers: { listItem: listItemWithTaskListItem }
};
function exitCheck(token) {
  const node2 = (
    /** @type {ListItem} */
    this.stack[this.stack.length - 2]
  );
  node2.checked = token.type === "taskListCheckValueChecked";
}
function exitParagraphWithTaskListItem(token) {
  const parent = (
    /** @type {Parents} */
    this.stack[this.stack.length - 2]
  );
  if (parent && parent.type === "listItem" && typeof parent.checked === "boolean") {
    const node2 = (
      /** @type {Paragraph} */
      this.stack[this.stack.length - 1]
    );
    const head2 = node2.children[0];
    if (head2 && head2.type === "text") {
      const siblings2 = parent.children;
      let index2 = -1;
      let firstParaghraph;
      while (++index2 < siblings2.length) {
        const sibling = siblings2[index2];
        if (sibling.type === "paragraph") {
          firstParaghraph = sibling;
          break;
        }
      }
      if (firstParaghraph === node2) {
        head2.value = head2.value.slice(1);
        if (head2.value.length === 0) {
          node2.children.shift();
        } else if (node2.position && head2.position && typeof head2.position.start.offset === "number") {
          head2.position.start.column++;
          head2.position.start.offset++;
          node2.position.start = Object.assign({}, head2.position.start);
        }
      }
    }
  }
  this.exit(token);
}
function listItemWithTaskListItem(node2, parent, context, safeOptions) {
  const head2 = node2.children[0];
  const checkable = typeof node2.checked === "boolean" && head2 && head2.type === "paragraph";
  const checkbox = "[" + (node2.checked ? "x" : " ") + "] ";
  const tracker = track(safeOptions);
  if (checkable) {
    tracker.move(checkbox);
  }
  let value = listItem2(node2, parent, context, {
    ...safeOptions,
    ...tracker.current()
  });
  if (checkable) {
    value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
  }
  return value;
  function check($0) {
    return $0 + checkbox;
  }
}

// node_modules/mdast-util-gfm/lib/index.js
function gfmFromMarkdown() {
  return [
    gfmAutolinkLiteralFromMarkdown,
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown,
    gfmTableFromMarkdown,
    gfmTaskListItemFromMarkdown
  ];
}
function gfmToMarkdown(options) {
  return {
    extensions: [
      gfmAutolinkLiteralToMarkdown,
      gfmFootnoteToMarkdown(),
      gfmStrikethroughToMarkdown,
      gfmTableToMarkdown(options),
      gfmTaskListItemToMarkdown
    ]
  };
}

// node_modules/remark-gfm/index.js
function remarkGfm(options = {}) {
  const data2 = this.data();
  add("micromarkExtensions", gfm(options));
  add("fromMarkdownExtensions", gfmFromMarkdown());
  add("toMarkdownExtensions", gfmToMarkdown(options));
  function add(field, value) {
    const list3 = (
      /** @type {unknown[]} */
      // Other extensions
      /* c8 ignore next 2 */
      data2[field] ? data2[field] : data2[field] = []
    );
    list3.push(value);
  }
}

// node_modules/lit-html/directive-helpers.js
var { I: l5 } = Z;
var t4 = (o9) => null === o9 || "object" != typeof o9 && "function" != typeof o9;
var e8 = (o9) => void 0 === o9.strings;

// node_modules/lit-html/async-directive.js
var s5 = (i6, t5) => {
  var e10, o9;
  const r5 = i6._$AN;
  if (void 0 === r5)
    return false;
  for (const i7 of r5)
    null === (o9 = (e10 = i7)._$AO) || void 0 === o9 || o9.call(e10, t5, false), s5(i7, t5);
  return true;
};
var o7 = (i6) => {
  let t5, e10;
  do {
    if (void 0 === (t5 = i6._$AM))
      break;
    e10 = t5._$AN, e10.delete(i6), i6 = t5;
  } while (0 === (null == e10 ? void 0 : e10.size));
};
var r4 = (i6) => {
  for (let t5; t5 = i6._$AM; i6 = t5) {
    let e10 = t5._$AN;
    if (void 0 === e10)
      t5._$AN = e10 = /* @__PURE__ */ new Set();
    else if (e10.has(i6))
      break;
    e10.add(i6), l6(t5);
  }
};
function n6(i6) {
  void 0 !== this._$AN ? (o7(this), this._$AM = i6, r4(this)) : this._$AM = i6;
}
function h3(i6, t5 = false, e10 = 0) {
  const r5 = this._$AH, n8 = this._$AN;
  if (void 0 !== n8 && 0 !== n8.size)
    if (t5)
      if (Array.isArray(r5))
        for (let i7 = e10; i7 < r5.length; i7++)
          s5(r5[i7], false), o7(r5[i7]);
      else
        null != r5 && (s5(r5, false), o7(r5));
    else
      s5(this, i6);
}
var l6 = (i6) => {
  var t5, s7, o9, r5;
  i6.type == t3.CHILD && (null !== (t5 = (o9 = i6)._$AP) && void 0 !== t5 || (o9._$AP = h3), null !== (s7 = (r5 = i6)._$AQ) && void 0 !== s7 || (r5._$AQ = n6));
};
var c3 = class extends i4 {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(i6, t5, e10) {
    super._$AT(i6, t5, e10), r4(this), this.isConnected = i6._$AU;
  }
  _$AO(i6, t5 = true) {
    var e10, r5;
    i6 !== this.isConnected && (this.isConnected = i6, i6 ? null === (e10 = this.reconnected) || void 0 === e10 || e10.call(this) : null === (r5 = this.disconnected) || void 0 === r5 || r5.call(this)), t5 && (s5(this, i6), o7(this));
  }
  setValue(t5) {
    if (e8(this._$Ct))
      this._$Ct._$AI(t5, this);
    else {
      const i6 = [...this._$Ct._$AH];
      i6[this._$Ci] = t5, this._$Ct._$AI(i6, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
};

// node_modules/lit-html/directives/private-async-helpers.js
var s6 = class {
  constructor(t5) {
    this.G = t5;
  }
  disconnect() {
    this.G = void 0;
  }
  reconnect(t5) {
    this.G = t5;
  }
  deref() {
    return this.G;
  }
};
var i5 = class {
  constructor() {
    this.Y = void 0, this.Z = void 0;
  }
  get() {
    return this.Y;
  }
  pause() {
    var t5;
    null !== (t5 = this.Y) && void 0 !== t5 || (this.Y = new Promise((t6) => this.Z = t6));
  }
  resume() {
    var t5;
    null === (t5 = this.Z) || void 0 === t5 || t5.call(this), this.Y = this.Z = void 0;
  }
};

// node_modules/lit-html/directives/until.js
var n7 = (t5) => !t4(t5) && "function" == typeof t5.then;
var h4 = 1073741823;
var c4 = class extends c3 {
  constructor() {
    super(...arguments), this._$C_t = h4, this._$Cwt = [], this._$Cq = new s6(this), this._$CK = new i5();
  }
  render(...s7) {
    var i6;
    return null !== (i6 = s7.find((t5) => !n7(t5))) && void 0 !== i6 ? i6 : T;
  }
  update(s7, i6) {
    const r5 = this._$Cwt;
    let e10 = r5.length;
    this._$Cwt = i6;
    const o9 = this._$Cq, c5 = this._$CK;
    this.isConnected || this.disconnected();
    for (let t5 = 0; t5 < i6.length && !(t5 > this._$C_t); t5++) {
      const s8 = i6[t5];
      if (!n7(s8))
        return this._$C_t = t5, s8;
      t5 < e10 && s8 === r5[t5] || (this._$C_t = h4, e10 = 0, Promise.resolve(s8).then(async (t6) => {
        for (; c5.get(); )
          await c5.get();
        const i7 = o9.deref();
        if (void 0 !== i7) {
          const r6 = i7._$Cwt.indexOf(s8);
          r6 > -1 && r6 < i7._$C_t && (i7._$C_t = r6, i7.setValue(t6));
        }
      }));
    }
    return T;
  }
  disconnected() {
    this._$Cq.disconnect(), this._$CK.pause();
  }
  reconnected() {
    this._$Cq.reconnect(this), this._$CK.resume();
  }
};
var m2 = e7(c4);

// node_modules/lit-html/directives/unsafe-html.js
var e9 = class extends i4 {
  constructor(i6) {
    if (super(i6), this.et = A, i6.type !== t3.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r5) {
    if (r5 === A || null == r5)
      return this.ft = void 0, this.et = r5;
    if (r5 === T)
      return r5;
    if ("string" != typeof r5)
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r5 === this.et)
      return this.ft;
    this.et = r5;
    const s7 = [r5];
    return s7.raw = s7, this.ft = { _$litType$: this.constructor.resultType, strings: s7, values: [] };
  }
};
e9.directiveName = "unsafeHTML", e9.resultType = 1;
var o8 = e7(e9);

// src/markprompt-content.ts
var Markprompt = class extends s4 {
  constructor() {
    super(...arguments);
    this.model = DEFAULT_MODEL;
    this.iDontKnowMessage = I_DONT_KNOW_MESSAGE;
    this.completionsUrl = MARKPROMPT_COMPLETIONS_URL;
    this.projectKey = "";
    this.placeholder = "Ask me anything\u2026";
    this.prompt = "";
    this.idToRefMap = {};
    this.loading = false;
    this.answer = "";
    this.references = [];
  }
  onInput(event) {
    const input = event.target;
    this.prompt = input.value;
  }
  scrollToBottom() {
    const resultContainer = this.renderRoot.querySelector("#result");
    resultContainer.scrollTop = resultContainer.scrollHeight;
  }
  getRefFromId(id) {
    return void 0;
  }
  reset() {
    const input = this.renderRoot.querySelector(
      "#prompt-input"
    );
    input.value = "";
    this.answer = "";
    this.references = [];
    this.loading = false;
  }
  focus() {
    const input = this.renderRoot.querySelector(
      "#prompt-input"
    );
    input.focus();
  }
  async onSubmit(event) {
    event.preventDefault();
    if (this.prompt === "")
      return;
    this.answer = "";
    this.references = [];
    this.loading = true;
    console.log("this.promptTemplate", this.promptTemplate);
    await submitPrompt(
      this.prompt,
      this.projectKey,
      (chunk) => {
        this.scrollToBottom();
        this.answer += chunk;
      },
      (references) => {
        this.scrollToBottom();
        this.references = references;
      },
      {
        model: this.model,
        iDontKnowMessage: this.iDontKnowMessage,
        completionsUrl: this.completionsUrl,
        ...this.promptTemplate ? { promptTemplate: this.promptTemplate } : {}
      }
    );
    this.loading = false;
  }
  async renderMarkdown(markdown) {
    const file = await unified().use(remark_parse_default).use(remarkGfm).use(lib_default, { allowDangerousHtml: true }).use(rehypeSanitize).use(rehypeStringify).process(markdown);
    if (typeof file.value !== "string") {
      return "";
    }
    return o8(file.value);
  }
  render() {
    return x`
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
            ${this.loading && !(this.answer.length > 0) ? x`<animated-caret class="caret"></animated-caret>` : A}
            ${m2(this.renderMarkdown(this.answer), A)}
            ${this.loading && this.answer.length > 0 ? x`<animated-caret class="caret"></animated-caret>` : A}
          </div>
          ${this.answer.length > 0 && this.references.length > 0 ? x`
                <div class="references-container">
                  <div
                    class="${o6({
      "animate-slide-up": !this.loading
    })}"
                  >
                    <p>Generated from the following sources:</p>
                    <div class="references">
                      ${this.references.map((reference) => {
      let refInfo = this.idToRefMap ? this.idToRefMap[reference] : void 0;
      if (!refInfo) {
        refInfo = this.getRefFromId(reference);
      }
      if (refInfo && refInfo.href) {
        return x`<a
                            href="${refInfo.href}"
                            class="reference-item"
                          >
                            ${refInfo.label || reference}</a
                          >`;
      }
      return x`<div class="reference-item">
                          ${reference}
                        </div>`;
    })}
                    </div>
                  </div>
                </div>
              ` : A}
          <div class="spacer"></div>
        </prose-block>
      </div>
    `;
  }
};
Markprompt.styles = i`
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
  `;
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "model", 2);
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "promptTemplate", 2);
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "iDontKnowMessage", 2);
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "completionsUrl", 2);
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "projectKey", 2);
__decorateClass([
  e5({ type: String })
], Markprompt.prototype, "placeholder", 2);
__decorateClass([
  e5({ type: String, state: true })
], Markprompt.prototype, "prompt", 2);
__decorateClass([
  e5({ type: Object })
], Markprompt.prototype, "idToRefMap", 2);
__decorateClass([
  e5({ type: Boolean, state: true })
], Markprompt.prototype, "loading", 2);
__decorateClass([
  e5({ type: String, state: true })
], Markprompt.prototype, "answer", 2);
__decorateClass([
  e5({ type: Array, state: true })
], Markprompt.prototype, "references", 2);
Markprompt = __decorateClass([
  e4("markprompt-content")
], Markprompt);
var Caret = class extends s4 {
  render() {
    return x`<span></span>`;
  }
};
Caret.styles = i`
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
  `;
Caret = __decorateClass([
  e4("animated-caret")
], Caret);
var ProseBlock = class extends s4 {
  constructor() {
    super(...arguments);
    this.class = "";
  }
  render() {
    return x`
      <div
        class="${o6({
      prose: true,
      [this.class]: this.class.length > 0
    })}"
      >
        <slot></slot>
      </div>
    `;
  }
};
ProseBlock.styles = i`
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
  `;
__decorateClass([
  e5({ type: String })
], ProseBlock.prototype, "class", 2);
ProseBlock = __decorateClass([
  e4("prose-block")
], ProseBlock);
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
