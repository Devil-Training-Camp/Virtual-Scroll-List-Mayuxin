import { defineComponent as E, toRefs as A, ref as i, computed as c, watch as F, onMounted as O, onUpdated as q, nextTick as D, openBlock as b, createElementBlock as _, createElementVNode as H, normalizeStyle as R, unref as C, Fragment as N, renderList as U, renderSlot as j } from "vue";
const G = ["tId"], J = E({
  name: "VirtualScrollList"
}), P = /* @__PURE__ */ E({
  ...J,
  props: {
    dataSource: { default: () => [] },
    estimatedItemSize: { default: 100 },
    bufferScale: { default: 1 }
  },
  setup(M) {
    const S = M, { estimatedItemSize: f, bufferScale: I } = A(S), r = i([]), h = i(), y = i(0), p = i(0), n = i(0), d = i(0), e = i([]), g = i(0), w = i(), m = c(() => Math.ceil(y.value / f.value) + 1), z = c(() => `translate3d(0, ${p.value}px, 0)`), k = c(() => Math.min(n.value, m.value * I.value)), T = c(() => Math.min(r.value.length - d.value, m.value * I.value)), B = c(() => r.value.slice(n.value - k.value, d.value + T.value)), L = () => {
      e.value = r.value.map((a, l) => ({
        index: l,
        height: f.value,
        top: l * f.value,
        bottom: (l + 1) * f.value
      })), g.value = e.value[e.value.length - 1].bottom;
    };
    F(S.dataSource, (a) => {
      r.value = a.map((l, t) => ({
        _id: t,
        ...l
      })), L();
    }, { immediate: !0 }), O(() => {
      y.value = h.value.clientHeight, d.value = n.value + m.value;
    }), q(async () => {
      await D(), r.value.length && ([...w.value].forEach((l) => {
        const t = +l.getAttribute("tId"), { height: s } = l.getBoundingClientRect(), u = e.value[t].height - s;
        if (u) {
          e.value[t].height = s, e.value[t].bottom = e.value[t].bottom - u;
          let o = t + 1;
          for (; o < e.value.length; )
            e.value[o].top = e.value[o - 1].bottom, e.value[o].bottom = e.value[o].bottom - u, o++;
        }
      }), g.value = e.value[e.value.length - 1].bottom, x());
    });
    const x = () => {
      if (n.value > 0) {
        let a = e.value[n.value].top - e.value[n.value - k.value].top;
        p.value = e.value[n.value - 1].bottom - a;
      } else
        p.value = 0;
    }, V = (a, l) => {
      let t = 0, s = a.length - 1, v = null;
      for (; t <= s; ) {
        let u = Math.floor((t + s) / 2), o = a[u].bottom;
        if (o === l)
          return u + 1;
        o < l ? t = u + 1 : o > l && ((v === null || v > u) && (v = u), s = s - 1);
      }
      return v;
    };
    function $() {
      window.requestAnimationFrame(() => {
        const a = h.value.scrollTop;
        n.value = V(e.value, a), d.value = n.value + m.value, x();
      });
    }
    return (a, l) => (b(), _("div", {
      ref_key: "containerRef",
      ref: h,
      class: "infinite-list-container",
      onScroll: $
    }, [
      H("div", {
        class: "infinite-list-phantom",
        style: R({ height: `${g.value}px` })
      }, null, 4),
      H("div", {
        class: "infinite-list",
        style: R({ transform: C(z) })
      }, [
        (b(!0), _(N, null, U(C(B), (t) => (b(), _("div", {
          key: t._id,
          tId: t._id,
          class: "infinite-list-item",
          ref_for: !0,
          ref_key: "itemsRef",
          ref: w
        }, [
          j(a.$slots, "default", { item: t }, void 0, !0)
        ], 8, G))), 128))
      ], 4)
    ], 544));
  }
});
export {
  P as default
};
