(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hdom = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EPS = 1e-6;
exports.EVENT_ALL = "*";
exports.EVENT_ENABLE = "enable";
exports.EVENT_DISABLE = "disable";
exports.SEMAPHORE = Symbol();

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function implementsFunction(x, fn) {
    return x != null && typeof x[fn] === "function";
}
exports.implementsFunction = implementsFunction;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isArrayLike(x) {
    return (x != null && typeof x !== "function" && x.length !== undefined);
}
exports.isArrayLike = isArrayLike;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDate(x) {
    return x instanceof Date;
}
exports.isDate = isDate;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === "function";
}
exports.isFunction = isFunction;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isIterable(x) {
    return x != null && typeof x[Symbol.iterator] === "function";
}
exports.isIterable = isIterable;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMap(x) {
    return x instanceof Map;
}
exports.isMap = isMap;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Similar to `isObject()`, but also checks if prototype is that of
 * `Object` (or `null`).
 *
 * @param x
 */
function isPlainObject(x) {
    let proto;
    return Object.prototype.toString.call(x) === "[object Object]" &&
        (proto = Object.getPrototypeOf(x), proto === null || proto === Object.getPrototypeOf({}));
}
exports.isPlainObject = isPlainObject;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRegExp(x) {
    return x instanceof RegExp;
}
exports.isRegExp = isRegExp;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSet(x) {
    return x instanceof Set;
}
exports.isSet = isSet;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(x) {
    return typeof x === "string";
}
exports.isString = isString;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
/**
 * Based on "An O(NP) Sequence Comparison Algorithm""
 * by Wu, Manber, Myers and Miller
 *
 * - http://www.itu.dk/stud/speciale/bepjea/xwebtex/litt/an-onp-sequence-comparison-algorithm.pdf
 * - https://github.com/cubicdaiya/onp
 *
 * Various optimizations, fixes & refactorings.
 * By default uses `@thi.ng/equiv` for equality checks.
 */
function diffArray(_a, _b, equiv = equiv_1.equiv, linearOnly = false) {
    const state = {
        distance: 0,
        adds: {},
        dels: {},
        const: {},
        linear: []
    };
    if (_a === _b) {
        return state;
    }
    const reverse = _a.length >= _b.length;
    let a, b, na, nb;
    if (reverse) {
        a = _b;
        b = _a;
    }
    else {
        a = _a;
        b = _b;
    }
    na = a.length;
    nb = b.length;
    const offset = na + 1;
    const delta = nb - na;
    const doff = delta + offset;
    const size = na + nb + 3;
    const path = new Array(size).fill(-1);
    const fp = new Array(size).fill(-1);
    const epc = [];
    const pathPos = [];
    function snake(k, p, pp) {
        const koff = k + offset;
        let r, y;
        if (p > pp) {
            r = path[koff - 1];
            y = p;
        }
        else {
            r = path[koff + 1];
            y = pp;
        }
        let x = y - k;
        while (x < na && y < nb && equiv(a[x], b[y])) {
            x++;
            y++;
        }
        path[koff] = pathPos.length;
        pathPos.push([x, y, r]);
        return y;
    }
    let p = -1, pp;
    do {
        p++;
        for (let k = -p, ko = k + offset; k < delta; k++, ko++) {
            fp[ko] = snake(k, fp[ko - 1] + 1, fp[ko + 1]);
        }
        for (let k = delta + p, ko = k + offset; k > delta; k--, ko--) {
            fp[ko] = snake(k, fp[ko - 1] + 1, fp[ko + 1]);
        }
        fp[doff] = snake(delta, fp[doff - 1] + 1, fp[doff + 1]);
    } while (fp[doff] !== nb);
    state.distance = delta + 2 * p;
    let r = path[doff];
    while (r !== -1) {
        epc.push(pp = pathPos[r]);
        r = pp[2];
    }
    if (linearOnly) {
        buildLinearLog(epc, state, a, b, reverse);
    }
    else {
        buildFullLog(epc, state, a, b, reverse);
    }
    return state;
}
exports.diffArray = diffArray;
function buildFullLog(epc, state, a, b, reverse) {
    const linear = state.linear;
    let adds, dels, aID, dID;
    if (reverse) {
        adds = state.dels;
        dels = state.adds;
        aID = -1;
        dID = 1;
    }
    else {
        adds = state.adds;
        dels = state.dels;
        aID = 1;
        dID = -1;
    }
    for (let i = epc.length, px = 0, py = 0; --i >= 0;) {
        const e = epc[i];
        let v;
        while (px < e[0] || py < e[1]) {
            const d = e[1] - e[0], dp = py - px;
            if (d > dp) {
                adds[py] = v = b[py];
                linear.push([aID, py, v]);
                py++;
            }
            else if (d < dp) {
                dels[px] = v = a[px];
                linear.push([dID, px, v]);
                px++;
            }
            else {
                state.const[px] = v = a[px];
                linear.push([0, px, v]);
                px++;
                py++;
            }
        }
    }
}
function buildLinearLog(epc, state, a, b, reverse) {
    const linear = state.linear;
    const aID = reverse ? -1 : 1;
    const dID = reverse ? 1 : -1;
    for (let i = epc.length, px = 0, py = 0; --i >= 0;) {
        const e = epc[i];
        while (px < e[0] || py < e[1]) {
            const d = e[1] - e[0], dp = py - px;
            if (d > dp) {
                linear.push([aID, py, b[py]]);
                py++;
            }
            else if (d < dp) {
                linear.push([dID, px, a[px]]);
                px++;
            }
            else {
                linear.push([0, px, a[px]]);
                px++;
                py++;
            }
        }
    }
}

},{"@thi.ng/equiv":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equiv_1 = require("@thi.ng/equiv");
function diffObject(a, b) {
    const adds = [];
    const dels = [];
    const edits = [];
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));
    const state = { distance: 0, adds, dels, edits };
    if (a === b) {
        return state;
    }
    for (let k of keys) {
        const va = a[k];
        const vb = b[k];
        const hasA = va !== undefined;
        if (hasA && vb !== undefined) {
            if (!equiv_1.equiv(va, vb)) {
                edits.push([k, vb]);
                state.distance++;
            }
        }
        else {
            (hasA ? dels : adds).push(k);
            state.distance++;
        }
    }
    return state;
}
exports.diffObject = diffObject;

},{"@thi.ng/equiv":15}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_arraylike_1 = require("@thi.ng/checks/is-arraylike");
const is_date_1 = require("@thi.ng/checks/is-date");
const is_map_1 = require("@thi.ng/checks/is-map");
const is_plain_object_1 = require("@thi.ng/checks/is-plain-object");
const is_regexp_1 = require("@thi.ng/checks/is-regexp");
const is_set_1 = require("@thi.ng/checks/is-set");
exports.equiv = (a, b) => {
    if (a === b) {
        return true;
    }
    if (a != null) {
        if (typeof a.equiv === "function") {
            return a.equiv(b);
        }
    }
    else {
        return a == b;
    }
    if (b != null) {
        if (typeof b.equiv === "function") {
            return b.equiv(a);
        }
    }
    else {
        return a == b;
    }
    if (typeof a === "string" || typeof b === "string") {
        return false;
    }
    if (is_plain_object_1.isPlainObject(a) && is_plain_object_1.isPlainObject(b)) {
        return equivObject(a, b);
    }
    if (is_arraylike_1.isArrayLike(a) && is_arraylike_1.isArrayLike(b)) {
        return equivArrayLike(a, b);
    }
    if (is_set_1.isSet(a) && is_set_1.isSet(b)) {
        return equivSet(a, b);
    }
    if (is_map_1.isMap(a) && is_map_1.isMap(b)) {
        return equivMap(a, b);
    }
    if (is_date_1.isDate(a) && is_date_1.isDate(b)) {
        return a.getTime() === b.getTime();
    }
    if (is_regexp_1.isRegExp(a) && is_regexp_1.isRegExp(b)) {
        return a.toString() === b.toString();
    }
    // NaN
    return (a !== a && b !== b);
};
const equivArrayLike = (a, b) => {
    let l = a.length;
    if (b.length === l) {
        while (--l >= 0 && exports.equiv(a[l], b[l]))
            ;
    }
    return l < 0;
};
const equivSet = (a, b) => (a.size === b.size) &&
    exports.equiv([...a.keys()].sort(), [...b.keys()].sort());
const equivMap = (a, b) => (a.size === b.size) &&
    exports.equiv([...a].sort(), [...b].sort());
const equivObject = (a, b) => {
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length)
        return false;
    for (let i = ka.length, k; --i >= 0;) {
        k = ka[i];
        if (!b.hasOwnProperty(k) || !exports.equiv(a[k], b[k])) {
            return false;
        }
    }
    return true;
};

},{"@thi.ng/checks/is-arraylike":4,"@thi.ng/checks/is-date":5,"@thi.ng/checks/is-map":8,"@thi.ng/checks/is-plain-object":9,"@thi.ng/checks/is-regexp":10,"@thi.ng/checks/is-set":11}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IllegalArgumentError extends Error {
    constructor(msg) {
        super("illegal argument(s)" + (msg !== undefined ? ": " + msg : ""));
    }
}
exports.IllegalArgumentError = IllegalArgumentError;
function illegalArgs(msg) {
    throw new IllegalArgumentError(msg);
}
exports.illegalArgs = illegalArgs;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG = false;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@thi.ng/api/api");
const isa = require("@thi.ng/checks/is-array");
const iss = require("@thi.ng/checks/is-string");
const array_1 = require("@thi.ng/diff/array");
const object_1 = require("@thi.ng/diff/object");
const equiv_1 = require("@thi.ng/equiv");
const dom_1 = require("./dom");
const isArray = isa.isArray;
const isString = iss.isString;
/**
 * Takes a DOM root element and two hiccup trees, `prev` and `curr`.
 * Recursively computes diff between both trees and applies any
 * necessary changes to reflect `curr` tree in real DOM.
 *
 * For newly added components, calls `init` with created DOM element
 * (plus user provided context and any other args) for any components
 * with `init` life cycle method. Likewise, calls `release` on
 * components with `release` method when the DOM element is removed.
 *
 * Important: The actual DOM element given is assumed to exactly
 * represent the state of the `prev` tree. Since this function does NOT
 * track the real DOM at all, the resulting changes will result in
 * potentially undefined behavior if there're discrepancies.
 *
 * @param root
 * @param prev previous tree
 * @param curr current tree
 */
exports.diffElement = (root, prev, curr) => _diffElement(root, prev, curr, 0);
const _diffElement = (parent, prev, curr, child) => {
    const delta = array_1.diffArray(prev, curr, equiv_1.equiv, true);
    if (delta.distance === 0) {
        return;
    }
    const edits = delta.linear;
    const el = parent.children[child];
    let i, j, k, eq, e, status, idx, val;
    if (edits[0][0] !== 0 || (i = prev[1]).key !== (j = curr[1]).key) {
        // DEBUG && console.log("replace:", prev, curr);
        releaseDeep(prev);
        dom_1.removeChild(parent, child);
        dom_1.createDOM(parent, curr, child);
        return;
    }
    if ((i = prev.__release) && i !== curr.__release) {
        releaseDeep(prev);
    }
    if (edits[1][0] !== 0) {
        diffAttributes(el, prev[1], curr[1]);
    }
    const equivKeys = extractEquivElements(edits);
    const n = edits.length;
    const noff = prev.length - 1;
    const offsets = new Array(noff + 1);
    for (i = noff; i >= 2; i--) {
        offsets[i] = i - 2;
    }
    for (i = 2; i < n; i++) {
        e = edits[i], status = e[0], val = e[2];
        // DEBUG && console.log(`edit: o:[${offsets.toString()}] i:${idx} s:${status}`, val);
        if (status === -1) {
            if (isArray(val)) {
                k = val[1].key;
                if (k !== undefined && equivKeys[k][2] !== undefined) {
                    eq = equivKeys[k];
                    k = eq[0];
                    // DEBUG && console.log(`diff equiv key @ ${k}:`, prev[k], curr[eq[2]]);
                    _diffElement(el, prev[k], curr[eq[2]], offsets[k]);
                }
                else {
                    idx = e[1];
                    // DEBUG && console.log("remove @", offsets[idx], val);
                    releaseDeep(val);
                    dom_1.removeChild(el, offsets[idx]);
                    for (j = noff; j >= idx; j--) {
                        offsets[j] = Math.max(offsets[j] - 1, 0);
                    }
                }
            }
            else if (isString(val)) {
                el.textContent = "";
            }
        }
        else if (status === 1) {
            if (isString(val)) {
                el.textContent = val;
            }
            else if (isArray(val)) {
                k = val[1].key;
                if (k === undefined || (k && equivKeys[k][0] === undefined)) {
                    idx = e[1];
                    // DEBUG && console.log("insert @", offsets[idx], val);
                    dom_1.createDOM(el, val, offsets[idx]);
                    for (j = noff; j >= idx; j--) {
                        offsets[j]++;
                    }
                }
            }
        }
    }
    if ((i = curr.__init) && i != prev.__init) {
        // DEBUG && console.log("call __init", curr);
        i.apply(curr, [el, ...(curr.__args)]);
    }
};
const releaseDeep = (tag) => {
    if (isArray(tag)) {
        if (tag.__release) {
            // DEBUG && console.log("call __release", tag);
            tag.__release.apply(tag, tag.__args);
            delete tag.__release;
        }
        for (let i = tag.length; --i >= 2;) {
            releaseDeep(tag[i]);
        }
    }
};
const diffAttributes = (el, prev, curr) => {
    let i, e, edits;
    const delta = object_1.diffObject(prev, curr);
    dom_1.removeAttribs(el, delta.dels, prev);
    let value = api_1.SEMAPHORE;
    for (edits = delta.edits, i = edits.length; --i >= 0;) {
        e = edits[i];
        const a = e[0];
        if (a.indexOf("on") === 0) {
            el.removeEventListener(a.substr(2), prev[a]);
        }
        if (a !== "value") {
            dom_1.setAttrib(el, a, e[1], curr);
        }
        else {
            value = e[1];
        }
    }
    for (edits = delta.adds, i = edits.length; --i >= 0;) {
        e = edits[i];
        if (e !== "value") {
            dom_1.setAttrib(el, e, curr[e], curr);
        }
        else {
            value = curr[e];
        }
    }
    if (value !== api_1.SEMAPHORE) {
        dom_1.setAttrib(el, "value", value, curr);
    }
};
const extractEquivElements = (edits) => {
    let k, v, e, ek;
    const equiv = {};
    for (let i = edits.length; --i >= 0;) {
        e = edits[i];
        v = e[2];
        if (isArray(v) && (k = v[1].key) !== undefined) {
            ek = equiv[k];
            !ek && (equiv[k] = ek = [, ,]);
            ek[e[0] + 1] = e[1];
        }
    }
    return equiv;
};

},{"./dom":19,"@thi.ng/api/api":1,"@thi.ng/checks/is-array":3,"@thi.ng/checks/is-string":12,"@thi.ng/diff/array":13,"@thi.ng/diff/object":14,"@thi.ng/equiv":15}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isa = require("@thi.ng/checks/is-array");
const isf = require("@thi.ng/checks/is-function");
const isi = require("@thi.ng/checks/is-iterable");
const iss = require("@thi.ng/checks/is-string");
const api_1 = require("@thi.ng/hiccup/api");
const css_1 = require("@thi.ng/hiccup/css");
const isArray = isa.isArray;
const isFunction = isf.isFunction;
const isIterable = isi.isIterable;
const isString = iss.isString;
/**
 * Creates an actual DOM tree from given hiccup component and `parent`
 * element. Calls `init` with created element (user provided context and
 * other args) for any components with `init` life cycle method. Returns
 * created root element(s) - usually only a single one, but can be an
 * array of elements, if the provided tree is an iterable. Creates DOM
 * text nodes for non-component values. Returns `parent` if tree is
 * `null` or `undefined`.
 *
 * @param parent
 * @param tag
 * @param insert
 */
exports.createDOM = (parent, tag, insert) => {
    if (isArray(tag)) {
        const t = tag[0];
        if (isFunction(t)) {
            return exports.createDOM(parent, t.apply(null, tag.slice(1)));
        }
        const el = exports.createElement(parent, t, tag[1], insert);
        if (tag.__init) {
            tag.__init.apply(tag.__this, [el, ...tag.__args]);
        }
        if (tag[2]) {
            const n = tag.length;
            for (let i = 2; i < n; i++) {
                exports.createDOM(el, tag[i]);
            }
        }
        return el;
    }
    if (!isString(tag) && isIterable(tag)) {
        const res = [];
        for (let t of tag) {
            res.push(exports.createDOM(parent, t));
        }
        return res;
    }
    if (tag == null) {
        return parent;
    }
    return exports.createTextElement(parent, tag);
};
/**
 * Takes a DOM root element and normalized hdom tree, then walks tree
 * and initializes any event listeners and components with lifecycle
 * `init` methods. Assumes that an equivalent DOM (minus listeners)
 * already exists (e.g. generated via SSR) when called. Any other
 * discrepancies between the pre-existing DOM and the hdom tree will
 * cause undefined behavior.
 *
 * @param parent
 * @param tree
 * @param i
 */
exports.hydrateDOM = (parent, tree, i = 0) => {
    if (isArray(tree)) {
        const el = parent.children[i];
        if (isFunction(tree[0])) {
            return exports.hydrateDOM(parent, tree[0].apply(null, tree.slice(1)), i);
        }
        if (tree.__init) {
            tree.__init.apply(tree.__this, [el, ...tree.__args]);
        }
        const attr = tree[1];
        for (let a in attr) {
            if (a.indexOf("on") === 0) {
                el.addEventListener(a.substr(2), attr[a]);
            }
        }
        for (let n = tree.length, i = 2; i < n; i++) {
            exports.hydrateDOM(el, tree[i], i - 2);
        }
    }
    else if (!isString(tree) && isIterable(tree)) {
        for (let t of tree) {
            exports.hydrateDOM(parent, t, i);
            i++;
        }
    }
};
exports.createElement = (parent, tag, attribs, insert) => {
    const el = api_1.SVG_TAGS[tag] ?
        document.createElementNS(api_1.SVG_NS, tag) :
        document.createElement(tag);
    if (parent) {
        if (insert === undefined) {
            parent.appendChild(el);
        }
        else {
            parent.insertBefore(el, parent.children[insert]);
        }
    }
    if (attribs) {
        exports.setAttribs(el, attribs);
    }
    return el;
};
exports.createTextElement = (parent, content, insert) => {
    const el = document.createTextNode(content);
    if (parent) {
        if (insert === undefined) {
            parent.appendChild(el);
        }
        else {
            parent.insertBefore(el, parent.children[insert]);
        }
    }
    return el;
};
exports.cloneWithNewAttribs = (el, attribs) => {
    const res = el.cloneNode(true);
    exports.setAttribs(res, attribs);
    el.parentNode.replaceChild(res, el);
    return res;
};
exports.setAttribs = (el, attribs) => {
    for (let k in attribs) {
        exports.setAttrib(el, k, attribs[k], attribs);
    }
    return el;
};
/**
 * Sets a single attribute on given element. If attrib name is NOT
 * an event name and its value is a function, it is called with
 * given `attribs` object (usually the full attrib object passed
 * to `setAttribs`) and the function's return value is used as attrib
 * value.
 *
 * Special rules apply for certain attributes:
 *
 * - "style": see `setStyle()`
 * - "value": see `updateValueAttrib()`
 * - attrib IDs starting with "on" are treated as event listeners
 *
 * If the given (or computed) attrib value is `false` or `undefined`
 * the attrib is removed from the element.
 *
 * @param el
 * @param id
 * @param val
 * @param attribs
 */
exports.setAttrib = (el, id, val, attribs) => {
    const isListener = id.indexOf("on") === 0;
    if (!isListener && isFunction(val)) {
        val = val(attribs);
    }
    if (val !== undefined && val !== false) {
        switch (id) {
            case "style":
                exports.setStyle(el, val);
                break;
            case "value":
                exports.updateValueAttrib(el, val);
                break;
            case "checked":
                // TODO add more native attribs?
                el[id] = val;
                break;
            default:
                if (isListener) {
                    el.addEventListener(id.substr(2), val);
                }
                else {
                    el.setAttribute(id, val);
                }
        }
    }
    else {
        el[id] != null ? (el[id] = null) : el.removeAttribute(id);
    }
    return el;
};
exports.updateValueAttrib = (el, v) => {
    switch (el.type) {
        case "text":
        case "textarea":
        case "password":
        case "email":
        case "url":
        case "tel":
        case "search":
            if (el.value !== undefined && isString(v)) {
                const e = el;
                const off = v.length - (e.value.length - e.selectionStart);
                e.value = v;
                e.selectionStart = e.selectionEnd = off;
            }
        default:
            el.value = v;
    }
};
exports.removeAttribs = (el, attribs, prev) => {
    for (let i = attribs.length; --i >= 0;) {
        const a = attribs[i];
        if (a.indexOf("on") === 0) {
            el.removeEventListener(a.substr(2), prev[a]);
        }
        else {
            el[a] ? (el[a] = null) : el.removeAttribute(a);
        }
    }
};
exports.setStyle = (el, styles) => (el.setAttribute("style", css_1.css(styles)), el);
exports.clearDOM = (el) => el.innerHTML = "";
exports.removeChild = (parent, childIdx) => {
    const n = parent.children[childIdx];
    if (n !== undefined) {
        n.remove();
    }
};

},{"@thi.ng/checks/is-array":3,"@thi.ng/checks/is-function":6,"@thi.ng/checks/is-iterable":7,"@thi.ng/checks/is-string":12,"@thi.ng/hiccup/api":23,"@thi.ng/hiccup/css":24}],20:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./api"));
__export(require("./diff"));
__export(require("./dom"));
__export(require("./normalize"));
__export(require("./start"));

},{"./api":17,"./diff":18,"./dom":19,"./normalize":21,"./start":22}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impf = require("@thi.ng/checks/implements-function");
const isa = require("@thi.ng/checks/is-array");
const isf = require("@thi.ng/checks/is-function");
const isi = require("@thi.ng/checks/is-iterable");
const iso = require("@thi.ng/checks/is-plain-object");
const iss = require("@thi.ng/checks/is-string");
const illegal_arguments_1 = require("@thi.ng/errors/illegal-arguments");
const api_1 = require("@thi.ng/hiccup/api");
const isArray = isa.isArray;
const isFunction = isf.isFunction;
const implementsFunction = impf.implementsFunction;
const isIterable = isi.isIterable;
const isPlainObject = iso.isPlainObject;
const isString = iss.isString;
/**
 * Expands single hiccup element/component into its canonical form:
 *
 * ```
 * [tagname, {attribs}, ...children]
 * ```
 *
 * Emmet-style ID and class names in the original tagname are moved into
 * the attribs object, e.g.:
 *
 * ```
 * ["div#foo.bar.baz"] => ["div", {id: "foo", class: "bar baz"}]
 * ```
 *
 * If both Emmet-style classes AND a `class` attrib exists, the former
 * are appended to the latter:
 *
 * ```
 * ["div.bar.baz", {class: "foo"}] => ["div", {class: "foo bar baz"}]
 * ```
 *
 * @param spec
 * @param keys
 */
exports.normalizeElement = (spec, keys) => {
    let tag = spec[0], hasAttribs = isPlainObject(spec[1]), match, id, clazz, attribs;
    if (!isString(tag) || !(match = api_1.TAG_REGEXP.exec(tag))) {
        illegal_arguments_1.illegalArgs(`${tag} is not a valid tag name`);
    }
    // return orig if already normalized and satisfies key requirement
    if (tag === match[1] && hasAttribs && (!keys || spec[1].key)) {
        return spec;
    }
    attribs = hasAttribs ? Object.assign({}, spec[1]) : {};
    id = match[2];
    clazz = match[3];
    if (id) {
        attribs.id = id;
    }
    if (clazz) {
        clazz = clazz.replace(/\./g, " ");
        if (attribs.class) {
            attribs.class += " " + clazz;
        }
        else {
            attribs.class = clazz;
        }
    }
    return [match[1], attribs, ...spec.slice(hasAttribs ? 2 : 1)];
};
/**
 * Calling this function is a prerequisite before passing a component
 * tree to `diffElement`. Recursively expands given hiccup component
 * tree into its canonical form by:
 *
 * - resolving Emmet-style tags (e.g. from `div#id.foo.bar`)
 * - evaluating embedded functions and replacing them with their result
 * - calling `render` life cycle method on component objects and using
 *   result
 * - consuming iterables and normalizing results
 * - calling `deref()` on elements implementing `IDeref` interface and
 *   using returned result
 * - calling `.toString()` on any other non-component value `x` and by
 *   default wrapping it in `["span", x]`. The only exceptions to this
 *   are: `option`, `textarea` and SVG `text` elements, for which spans
 *   are always skipped.
 *
 * Additionally, unless `keys` is set to false, an unique `key`
 * attribute is created for each node in the tree. This attribute is
 * used by `diffElement` to determine if a changed node can be patched
 * or will need to be replaced/removed. The `key` values are defined by
 * the `path` array arg.
 *
 * In terms of life cycle methods: `render` should ALWAYS return an
 * array or another function, else the component's `init` or `release`
 * fns will NOT be able to be called. E.g. If the return value of
 * `render` evaluates as a string or number, the return value should be
 * wrapped as `["span", "foo"]`. If no `init` or `release` are used,
 * this requirement is relaxed.
 *
 * For normal usage only the first 2 args should be specified and the
 * rest kept at their defaults.
 *
 * See `normalizeElement` for further details about canonical form.
 *
 * @param tree
 * @param ctx
 * @param path
 * @param keys
 * @param span
 */
exports.normalizeTree = (tree, ctx, path = [0], keys = true, span = true) => {
    if (tree == null) {
        return;
    }
    if (isArray(tree)) {
        if (tree.length === 0) {
            return;
        }
        const tag = tree[0];
        let norm, nattribs;
        // use result of function call
        // pass ctx as first arg and remaining array elements as rest args
        if (isFunction(tag)) {
            return exports.normalizeTree(tag.apply(null, [ctx, ...tree.slice(1)]), ctx, path, keys, span);
        }
        // component object w/ life cycle methods
        // (render() is the only required hook)
        if (implementsFunction(tag, "render")) {
            const args = [ctx, ...tree.slice(1)];
            norm = exports.normalizeTree(tag.render.apply(tag, args), ctx, path, keys, span);
            if (isArray(norm)) {
                norm.__this = tag;
                norm.__init = tag.init;
                norm.__release = tag.release;
                norm.__args = args;
            }
            return norm;
        }
        norm = exports.normalizeElement(tree, keys);
        nattribs = norm[1];
        if (keys && nattribs.key === undefined) {
            nattribs.key = path.join("-");
        }
        if (norm.length > 2) {
            const tag = norm[0];
            const res = [tag, nattribs];
            span = span && !api_1.NO_SPANS[tag];
            for (let i = 2, j = 2, k = 0, n = norm.length; i < n; i++) {
                let el = norm[i];
                if (el != null) {
                    const isarray = isArray(el);
                    if ((isarray && isArray(el[0])) || (!isarray && !isString(el) && isIterable(el))) {
                        for (let c of el) {
                            c = exports.normalizeTree(c, ctx, path.concat(k), keys, span);
                            if (c !== undefined) {
                                res[j++] = c;
                            }
                            k++;
                        }
                    }
                    else {
                        el = exports.normalizeTree(el, ctx, path.concat(k), keys, span);
                        if (el !== undefined) {
                            res[j++] = el;
                        }
                        k++;
                    }
                }
            }
            return res;
        }
        return norm;
    }
    if (isFunction(tree)) {
        return exports.normalizeTree(tree(ctx), ctx, path, keys, span);
    }
    if (implementsFunction(tree, "deref")) {
        return exports.normalizeTree(tree.deref(), ctx, path, keys, span);
    }
    return span ?
        ["span", keys ? { key: path.join("-") } : {}, tree.toString()] :
        tree.toString();
};

},{"@thi.ng/checks/implements-function":2,"@thi.ng/checks/is-array":3,"@thi.ng/checks/is-function":6,"@thi.ng/checks/is-iterable":7,"@thi.ng/checks/is-plain-object":9,"@thi.ng/checks/is-string":12,"@thi.ng/errors/illegal-arguments":16,"@thi.ng/hiccup/api":23}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_string_1 = require("@thi.ng/checks/is-string");
const diff_1 = require("./diff");
const dom_1 = require("./dom");
const normalize_1 = require("./normalize");
/**
 * Takes an hiccup tree (array, function or component object w/ life
 * cycle methods) and an optional object of DOM update options. Starts
 * RAF update loop, in each iteration first normalizing given tree, then
 * computing diff to previous frame's tree and applying any changes to
 * the real DOM. The `ctx` option can be used for passing arbitrary
 * config data or state down into the hiccup component tree. Any
 * embedded component function in the tree will receive this context
 * object as first argument, as will life cycle methods in component
 * objects.
 *
 * **Selective updates**: No updates will be applied if the given hiccup
 * tree is `undefined` or `null` or a root component function returns no
 * value. This way a given root function can do some state handling of
 * its own and implement fail-fast checks to determine no DOM updates
 * are necessary, save effort re-creating a new hiccup tree and request
 * skipping DOM updates via this function. In this case, the previous
 * DOM tree is kept around until the root function returns a tree again,
 * which then is diffed and applied against the previous tree kept as
 * usual. Any number of frames may be skipped this way.
 *
 * **Important:** Unless the `hydrate` option is enabled, the parent
 * element given is assumed to have NO children at the time when
 * `start()` is called. Since hdom does NOT track the real DOM, the
 * resulting changes will result in potentially undefined behavior if
 * the parent element wasn't empty. Likewise, if `hydrate` is enabled,
 * it is assumed that an equivalent DOM (minus listeners) already exists
 * (i.e. generated via SSR) when `start()` is called. Any other
 * discrepancies between the pre-existing DOM and the hdom trees will
 * cause undefined behavior.
 *
 * Returns a function, which when called, immediately cancels the update
 * loop.
 *
 * @param tree hiccup DOM tree
 * @param opts options
 */
exports.start = (tree, opts) => {
    opts = Object.assign({ root: "app", span: true, normalize: true }, opts);
    let prev = [];
    let isActive = true;
    const root = is_string_1.isString(opts.root) ?
        document.getElementById(opts.root) :
        opts.root;
    const update = () => {
        if (isActive) {
            const curr = opts.normalize ?
                normalize_1.normalizeTree(tree, opts.ctx, [0], true, opts.span) :
                tree;
            if (curr != null) {
                if (opts.hydrate) {
                    dom_1.hydrateDOM(root, curr);
                    opts.hydrate = false;
                }
                else {
                    diff_1.diffElement(root, prev, curr);
                }
                prev = curr;
            }
            // check again in case one of the components called cancel
            isActive && requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
    return () => (isActive = false);
};

},{"./diff":18,"./dom":19,"./normalize":21,"@thi.ng/checks/is-string":12}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVG_NS = "http://www.w3.org/2000/svg";
exports.XLINK_NS = "http://www.w3.org/1999/xlink";
exports.TAG_REGEXP = /^([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?$/;
// tslint:disable-next-line
exports.SVG_TAGS = "animate animateColor animateMotion animateTransform circle clipPath color-profile defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg switch symbol text textPath title tref tspan use view"
    .split(" ")
    .reduce((acc, x) => (acc[x] = 1, acc), {});
// tslint:disable-next-line
exports.VOID_TAGS = "area base br circle col command ellipse embed hr img input keygen line link meta param path polygon polyline rect source stop track use wbr"
    .split(" ")
    .reduce((acc, x) => (acc[x] = 1, acc), {});
exports.ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
};
exports.NO_SPANS = {
    option: 1,
    text: 1,
    textarea: 1,
};
exports.ENTITY_RE = new RegExp(`[${Object.keys(exports.ENTITIES)}]`, "g");

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_1 = require("@thi.ng/checks/is-function");
exports.css = (rules) => {
    let css = "", v;
    for (let r in rules) {
        v = rules[r];
        if (is_function_1.isFunction(v)) {
            v = v(rules);
        }
        v != null && (css += `${r}:${v};`);
    }
    return css;
};

},{"@thi.ng/checks/is-function":6}]},{},[20])(20)
});
