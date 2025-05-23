/**!
 * FlexSearch.js v0.8.203 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var u;
function v(a, c, b) {
  const f = typeof b, d = typeof a;
  if (f !== "undefined") {
    if (d !== "undefined") {
      if (b) {
        if (d === "function" && f === d) {
          return function(k) {
            return a(b(k));
          };
        }
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array) {
            return b.concat(a);
          }
          if (c === Map) {
            var g = new Map(b);
            for (var e of a) {
              g.set(e[0], e[1]);
            }
            return g;
          }
          if (c === Set) {
            e = new Set(b);
            for (g of a.values()) {
              e.add(g);
            }
            return e;
          }
        }
      }
      return a;
    }
    return b;
  }
  return d === "undefined" ? c : a;
}
function y() {
  return Object.create(null);
}
;const A = /[^\p{L}\p{N}]+/u, B = /(\d{3})/g, C = /(\D)(\d{3})/g, D = /(\d{3})(\D)/g, E = /[\u0300-\u036f]/g;
function F(a = {}) {
  if (!this || this.constructor !== F) {
    return new F(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
u = F.prototype;
u.assign = function(a) {
  this.normalize = v(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, f;
  if (b || b === "") {
    if (typeof b === "object" && b.constructor !== RegExp) {
      let d = "";
      f = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", f = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += typeof b === "object" ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (g) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = b === !1 || "a1a".split(b).length < 2;
    }
    this.numeric = v(a.numeric, f);
  } else {
    try {
      this.split = v(this.split, A);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = v(a.numeric, v(this.numeric, !0));
  }
  this.prepare = v(a.prepare, null, this.prepare);
  this.finalize = v(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = typeof b === "function" ? b : v(b && new Set(b), null, this.filter);
  this.dedupe = v(a.dedupe, !0, this.dedupe);
  this.matcher = v((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = v((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = v((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = v(a.replacer, null, this.replacer);
  this.minlength = v(a.minlength, 1, this.minlength);
  this.maxlength = v(a.maxlength, 1024, this.maxlength);
  this.rtl = v(a.rtl, !1, this.rtl);
  if (this.cache = b = v(a.cache, !0, this.cache)) {
    this.l = null, this.A = typeof b === "number" ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.m = 128;
  }
  this.g = "";
  this.s = null;
  this.h = "";
  this.u = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  return this;
};
u.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.u = null;
  this.cache && G(this);
  return this;
};
u.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && G(this);
  return this;
};
u.addMapper = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length > 1) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && G(this);
  return this;
};
u.addMatcher = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length < 2 && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.g += (this.g ? "|" : "") + a;
  this.s = null;
  this.cache && G(this);
  return this;
};
u.addReplacer = function(a, c) {
  if (typeof a === "string") {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && G(this);
  return this;
};
u.encode = function(a, c) {
  if (this.cache && a.length <= this.m) {
    if (this.l) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.l = setTimeout(G, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = E ? a.normalize("NFKD").replace(E, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(C, "$1 $2").replace(D, "$1 $2").replace(B, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let f = [], d = y(), g, e, k = this.split || this.split === "" ? a.split(this.split) : [a];
  for (let n = 0, h, r; n < k.length; n++) {
    if ((h = r = k[n]) && !(h.length < this.minlength || h.length > this.maxlength)) {
      if (c) {
        if (d[h]) {
          continue;
        }
        d[h] = 1;
      } else {
        if (g === h) {
          continue;
        }
        g = h;
      }
      if (b) {
        f.push(h);
      } else {
        if (!this.filter || (typeof this.filter === "function" ? this.filter(h) : !this.filter.has(h))) {
          if (this.cache && h.length <= this.o) {
            if (this.l) {
              var m = this.j.get(h);
              if (m || m === "") {
                m && f.push(m);
                continue;
              }
            } else {
              this.l = setTimeout(G, 50, this);
            }
          }
          if (this.stemmer) {
            this.u || (this.u = new RegExp("(?!^)(" + this.h + ")$"));
            let w;
            for (; w !== h && h.length > 2;) {
              w = h, h = h.replace(this.u, q => this.stemmer.get(q));
            }
          }
          if (h && (this.mapper || this.dedupe && h.length > 1)) {
            m = "";
            for (let w = 0, q = "", l, p; w < h.length; w++) {
              l = h.charAt(w), l === q && this.dedupe || ((p = this.mapper && this.mapper.get(l)) || p === "" ? p === q && this.dedupe || !(q = p) || (m += p) : m += q = l);
            }
            h = m;
          }
          this.matcher && h.length > 1 && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), h = h.replace(this.s, w => this.matcher.get(w)));
          if (h && this.replacer) {
            for (m = 0; h && m < this.replacer.length; m += 2) {
              h = h.replace(this.replacer[m], this.replacer[m + 1]);
            }
          }
          this.cache && r.length <= this.o && (this.j.set(r, h), this.j.size > this.A && (this.j.clear(), this.o = this.o / 1.1 | 0));
          if (h) {
            if (h !== r) {
              if (c) {
                if (d[h]) {
                  continue;
                }
                d[h] = 1;
              } else {
                if (e === h) {
                  continue;
                }
                e = h;
              }
            }
            f.push(h);
          }
        }
      }
    }
  }
  this.finalize && (f = this.finalize(f) || f);
  this.cache && a.length <= this.m && (this.i.set(a, f), this.i.size > this.A && (this.i.clear(), this.m = this.m / 1.1 | 0));
  return f;
};
function G(a) {
  a.l = null;
  a.i.clear();
  a.j.clear();
}
;function I(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (a.length === 1) {
    return a = a[0], a = b || a.length > c ? a.slice(b, b + c) : a;
  }
  let f = [];
  for (let d = 0, g, e; d < a.length; d++) {
    if ((g = a[d]) && (e = g.length)) {
      if (b) {
        if (b >= e) {
          b -= e;
          continue;
        }
        g = g.slice(b, b + c);
        e = g.length;
        b = 0;
      }
      e > c && (g = g.slice(0, c), e = c);
      if (!f.length && e >= c) {
        return g;
      }
      f.push(g);
      c -= e;
      if (!c) {
        break;
      }
    }
  }
  return f = f.length > 1 ? [].concat.apply([], f) : f[0];
}
;y();
J.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, d, g; f < b.length; f++) {
        if ((d = b[f]) && (g = d.length)) {
          if (d[g - 1] === a) {
            d.pop();
          } else {
            const e = d.indexOf(a);
            e >= 0 && d.splice(e, 1);
          }
        }
      }
    } else {
      K(this.map, a), this.depth && K(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  return this;
};
function K(a, c) {
  let b = 0;
  var f = typeof c === "undefined";
  if (a.constructor === Array) {
    for (let d = 0, g, e, k; d < a.length; d++) {
      if ((g = a[d]) && g.length) {
        if (f) {
          return 1;
        }
        e = g.indexOf(c);
        if (e >= 0) {
          if (g.length > 1) {
            return g.splice(e, 1), 1;
          }
          delete a[d];
          if (b) {
            return 1;
          }
          k = 1;
        } else {
          if (k) {
            return 1;
          }
          b++;
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      f = d[0], K(d[1], c) ? b++ : a.delete(f);
    }
  }
  return b;
}
;const L = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
J.prototype.add = function(a, c, b, f) {
  if (c && (a || a === 0)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    f = this.depth;
    c = this.encoder.encode(c, !f);
    const n = c.length;
    if (n) {
      const h = y(), r = y(), w = this.resolution;
      for (let q = 0; q < n; q++) {
        let l = c[this.rtl ? n - 1 - q : q];
        var d = l.length;
        if (d && (f || !r[l])) {
          var g = this.score ? this.score(c, l, q, null, 0) : M(w, n, q), e = "";
          switch(this.tokenize) {
            case "tolerant":
              N(this, r, l, g, a, b);
              if (d > 2) {
                for (let p = 1, t, z, x, H; p < d - 1; p++) {
                  t = l.charAt(p), z = l.charAt(p + 1), x = l.substring(0, p) + z, H = l.substring(p + 2), e = x + t + H, r[e] || N(this, r, e, g, a, b), e = x + H, r[e] || N(this, r, e, g, a, b);
                }
              }
              break;
            case "full":
              if (d > 2) {
                for (let p = 0, t; p < d; p++) {
                  for (g = d; g > p; g--) {
                    if (e = l.substring(p, g), !r[e]) {
                      t = this.rtl ? d - 1 - p : p;
                      var k = this.score ? this.score(c, l, q, e, t) : M(w, n, q, d, t);
                      N(this, r, e, k, a, b);
                    }
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (d > 1) {
                for (k = d - 1; k > 0; k--) {
                  if (e = l[this.rtl ? d - 1 - k : k] + e, !r[e]) {
                    var m = this.score ? this.score(c, l, q, e, k) : M(w, n, q, d, k);
                    N(this, r, e, m, a, b);
                  }
                }
                e = "";
              }
            case "forward":
              if (d > 1) {
                for (k = 0; k < d; k++) {
                  e += l[this.rtl ? d - 1 - k : k], r[e] || N(this, r, e, g, a, b);
                }
                break;
              }
            default:
              if (N(this, r, l, g, a, b), f && n > 1 && q < n - 1) {
                for (d = y(), e = this.v, g = l, k = Math.min(f + 1, this.rtl ? q + 1 : n - q), d[g] = 1, m = 1; m < k; m++) {
                  if ((l = c[this.rtl ? n - 1 - q - m : q + m]) && !d[l]) {
                    d[l] = 1;
                    const p = this.score ? this.score(c, g, q, l, m - 1) : M(e + (n / 2 > e ? 0 : 1), n, q, k - 1, m - 1), t = this.bidirectional && l > g;
                    N(this, h, t ? g : l, p, a, b, t ? l : g);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    }
  }
  return this;
};
function N(a, c, b, f, d, g, e) {
  let k = e ? a.ctx : a.map, m;
  if (!c[b] || e && !(m = c[b])[e]) {
    e ? (c = m || (c[b] = y()), c[e] = 1, (m = k.get(e)) ? k = m : k.set(e, k = new Map())) : c[b] = 1, (m = k.get(b)) ? k = m : k.set(b, k = []), k = k[f] || (k[f] = []), g && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function M(a, c, b, f, d) {
  return b && a > 1 ? c + (f || 0) <= a ? b + (d || 0) : (a - 1) / (c + (f || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;J.prototype.search = function(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : (b = a, a = ""));
  var f = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var g = b.context;
    var e = b.suggest;
    var k = !0;
    var m = b.resolution;
  }
  typeof k === "undefined" && (k = !0);
  g = this.depth && g !== !1;
  a = this.encoder.encode(a, !g);
  b = a.length;
  c = c || (k ? 100 : 0);
  if (b === 1) {
    return e = d, (d = O(this, a[0], "")) && d.length ? I.call(this, d, c, e) : [];
  }
  if (b === 2 && g && !e) {
    return e = d, (d = O(this, a[1], a[0])) && d.length ? I.call(this, d, c, e) : [];
  }
  k = y();
  var n = 0;
  if (g) {
    var h = a[0];
    n = 1;
  }
  m || m === 0 || (m = h ? this.v : this.resolution);
  for (let l, p; n < b; n++) {
    if ((p = a[n]) && !k[p]) {
      k[p] = 1;
      l = O(this, p, h);
      a: {
        g = l;
        var r = f, w = e, q = m;
        let t = [];
        if (g && g.length) {
          if (g.length <= q) {
            r.push(g);
            l = void 0;
            break a;
          }
          for (let z = 0, x; z < q; z++) {
            if (x = g[z]) {
              t[z] = x;
            }
          }
          if (t.length) {
            r.push(t);
            l = void 0;
            break a;
          }
        }
        l = w ? void 0 : t;
      }
      if (l) {
        f = l;
        break;
      }
      h && (e && l && f.length || (h = p));
    }
    e && h && n === b - 1 && !f.length && (m = this.resolution, h = "", n = -1, k = y());
  }
  a: {
    a = f;
    f = a.length;
    h = a;
    if (f > 1) {
      b: {
        f = e;
        h = a.length;
        e = [];
        b = y();
        for (let l = 0, p, t, z, x; l < m; l++) {
          for (n = 0; n < h; n++) {
            if (z = a[n], l < z.length && (p = z[l])) {
              for (g = 0; g < p.length; g++) {
                if (t = p[g], (k = b[t]) ? b[t]++ : (k = 0, b[t] = 1), x = e[k] || (e[k] = []), x.push(t), c && k === h - 1 && x.length - d === c) {
                  h = d ? x.slice(d) : x;
                  break b;
                }
              }
            }
          }
        }
        if (a = e.length) {
          if (f) {
            if (e.length > 1) {
              c: {
                for (a = [], m = y(), f = e.length, k = f - 1; k >= 0; k--) {
                  if (b = (f = e[k]) && f.length) {
                    for (n = 0; n < b; n++) {
                      if (h = f[n], !m[h]) {
                        if (m[h] = 1, d) {
                          d--;
                        } else {
                          if (a.push(h), a.length === c) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              a = (e = e[0]) && c && e.length > c || d ? e.slice(d, c + d) : e;
            }
            e = a;
          } else {
            if (a < h) {
              h = [];
              break b;
            }
            e = e[a - 1];
            if (c || d) {
              if (e.length > c || d) {
                e = e.slice(d, c + d);
              }
            }
          }
        }
        h = e;
      }
    } else if (f === 1) {
      c = I.call(null, a[0], c, d);
      break a;
    }
    c = h;
  }
  return c;
};
function O(a, c, b) {
  let f;
  b && (f = a.bidirectional && c > b) && (f = b, b = c, c = f);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function J(a, c) {
  if (!this || this.constructor !== J) {
    return new J(a);
  }
  if (a) {
    var b = typeof a === "string" ? a : a.preset;
    b && (L[b] || console.warn("Preset not found: " + b), a = Object.assign({}, L[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = b === !0 ? {depth:1} : b || {}, d = a.encode || a.encoder || {};
  this.encoder = d.encode ? d : typeof d === "object" ? new F(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && b !== "default" && b !== "exact" && b || "strict";
  this.depth = b === "strict" && f.depth || 0;
  this.bidirectional = f.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && f.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.v = f.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
}
u = J.prototype;
u.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  return this;
};
u.append = function(a, c) {
  return this.add(a, c, !0);
};
u.contain = function(a) {
  return this.reg.has(a);
};
u.update = function(a, c) {
  const b = this, f = this.remove(a);
  return f && f.then ? f.then(() => b.add(a, c)) : this.add(a, c);
};
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  K(this.map);
  this.depth && K(this.ctx);
  return this;
};
y();
export default {Index:J, Charset:null, Encoder:F, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=J;export const  Charset=null;export const  Encoder=F;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};