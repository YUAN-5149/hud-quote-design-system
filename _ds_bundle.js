/* @ds-bundle: {"format":4,"namespace":"HUDDesignSystem_c6680c","components":[],"sourceHashes":{"Chrome.jsx":"e0e6cd5f6544","Primitives.jsx":"c33a1470f13b","Screens.jsx":"640d3954ff80","ui_kits/quotation/Auth.jsx":"f1a55f5a3395","ui_kits/quotation/Chrome.jsx":"ffaf3283e3f0","ui_kits/quotation/Primitives.jsx":"6b3d08368fde","ui_kits/quotation/Screens.jsx":"9cd281c463a9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HUDDesignSystem_c6680c = window.HUDDesignSystem_c6680c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// Chrome.jsx
try { (() => {
// QuotationApp.jsx — UI Kit main app for 水電報價 HUD
// Demonstrates the full system: rail, topbar, dashboard, case list, quote builder, inspector.

const {
  useState,
  useEffect,
  useMemo
} = React;

// ─────────────────────────────────────────────────────────────
// Icons (lucide via CDN - mounted after render)
// ─────────────────────────────────────────────────────────────
const Icon = ({
  name,
  size = 16,
  className = ''
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": name,
  width: size,
  height: size,
  className: className
});

// ─────────────────────────────────────────────────────────────
// Left Rail
// ─────────────────────────────────────────────────────────────
const RAIL_ITEMS = [{
  id: 'dashboard',
  icon: 'layout-grid',
  label: '主控台'
}, {
  id: 'cases',
  icon: 'folder-kanban',
  label: '案件'
}, {
  id: 'quotes',
  icon: 'file-text',
  label: '報價單'
}, {
  id: 'materials',
  icon: 'package',
  label: '材料'
}, {
  id: 'billing',
  icon: 'receipt',
  label: '請款'
}, {
  id: 'reports',
  icon: 'activity',
  label: '報表'
}];
function Rail({
  active,
  onNav
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rail-logo"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "28",
    height: "28",
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 3 L57 17 L57 47 L32 61 L7 47 L7 17 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32 20 C32 20, 26 28, 26 34 C26 38.5 28.7 41 32 41 C35.3 41 38 38.5 38 34 C38 28 32 20 32 20 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32 28 L30 33 L33 33 L31 38",
    strokeWidth: "1.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), RAIL_ITEMS.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    className: `rail-btn ${active === item.id ? 'active' : ''}`,
    onClick: () => onNav(item.id),
    title: item.label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "rail-btn-lbl"
  }, item.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "rail-btn",
    title: "\u8A2D\u5B9A"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 20
  })));
}

// ─────────────────────────────────────────────────────────────
// Top Bar
// ─────────────────────────────────────────────────────────────
function TopBar({
  screenLabel
}) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hhmmss = time.toTimeString().slice(0, 8);
  const ymd = `${time.getFullYear()}.${String(time.getMonth() + 1).padStart(2, '0')}.${String(time.getDate()).padStart(2, '0')}`;
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "breadcrumb"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "SECTOR"), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "//"), /*#__PURE__*/React.createElement("span", {
    className: "bc-current"
  }, screenLabel)), /*#__PURE__*/React.createElement("div", {
    className: "topbar-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "status-dot ok"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "SYSTEM ONLINE \xB7 17 NODES"), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-1)'
    }
  }, ymd), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, hhmmss), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "OP \xB7 \u6C34\u96FB\u5E2B\u5085")));
}

// ─────────────────────────────────────────────────────────────
// Status bar (bottom)
// ─────────────────────────────────────────────────────────────
function StatusBar() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "statusbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "DB \xB7 SYNCED"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "LATENCY 14ms"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "REGION TPE-N"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, "v2.4.1 \xB7 BUILD 18026"));
}
Object.assign(window, {
  Rail,
  TopBar,
  StatusBar,
  Icon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "Chrome.jsx", error: String((e && e.message) || e) }); }

// Primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Panel.jsx — reusable HUD panel primitive
const Panel = ({
  title,
  meta,
  children,
  accent,
  className = '',
  style = {}
}) => /*#__PURE__*/React.createElement("section", {
  className: `hud-panel ${accent ? 'hud-panel-active' : ''} ${className}`,
  style: style
}, (title || meta) && /*#__PURE__*/React.createElement("div", {
  className: "hud-panel-header",
  style: {
    fontSize: "12px"
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "panel-title",
  style: {
    fontSize: "12px"
  }
}, title), meta && /*#__PURE__*/React.createElement("span", {
  className: "panel-meta"
}, meta)), /*#__PURE__*/React.createElement("div", {
  className: "hud-panel-body"
}, children));
const Metric = ({
  label,
  value,
  delta,
  deltaKind = 'ok',
  sub,
  accent
}) => /*#__PURE__*/React.createElement("div", {
  className: "metric"
}, /*#__PURE__*/React.createElement("div", {
  className: "metric-label mono-label"
}, label), /*#__PURE__*/React.createElement("div", {
  className: `metric-value ${accent ? 'accent' : ''}`
}, value), sub && /*#__PURE__*/React.createElement("div", {
  className: "metric-sub mono-label"
}, sub), delta && /*#__PURE__*/React.createElement("div", {
  className: `metric-delta ${deltaKind}`
}, delta));
const Chip = ({
  kind = 'info',
  children,
  code
}) => /*#__PURE__*/React.createElement("span", {
  className: `chip chip-${kind} ${code ? 'chip-code' : ''}`
}, !code && /*#__PURE__*/React.createElement("span", {
  className: `chip-dot chip-dot-${kind}`
}), children);
const Button = ({
  variant = 'primary',
  children,
  onClick,
  disabled,
  icon
}) => /*#__PURE__*/React.createElement("button", {
  className: `btn btn-${variant}`,
  onClick: onClick,
  disabled: disabled
}, icon && /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 14
}), /*#__PURE__*/React.createElement("span", null, children), variant === 'primary' && /*#__PURE__*/React.createElement("span", {
  className: "btn-caret"
}, "\u203A"));
const Field = ({
  label,
  children,
  helper,
  error
}) => /*#__PURE__*/React.createElement("label", {
  className: `field ${error ? 'field-error' : ''}`
}, /*#__PURE__*/React.createElement("span", {
  className: "field-label mono-label"
}, label), children, (helper || error) && /*#__PURE__*/React.createElement("span", {
  className: `field-helper ${error ? 'is-error' : ''}`
}, error || helper));
const Input = props => /*#__PURE__*/React.createElement("input", _extends({
  className: "input"
}, props));
const Toggle = ({
  on,
  onChange,
  label
}) => /*#__PURE__*/React.createElement("div", {
  className: "toggle-row",
  onClick: () => onChange(!on)
}, /*#__PURE__*/React.createElement("span", {
  className: `toggle ${on ? 'toggle-on' : ''}`
}), /*#__PURE__*/React.createElement("span", {
  className: "toggle-lbl"
}, label));
const Modal = ({
  open,
  onClose,
  title,
  meta,
  width = 520,
  children,
  footer
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal hud-panel hud-panel-active",
    style: {
      width
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "panel-meta"
  }, meta, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose,
    "aria-label": "close"
  }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-body modal-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, footer)));
};
const Select = ({
  value,
  onChange,
  options
}) => /*#__PURE__*/React.createElement("select", {
  className: "input",
  value: value,
  onChange: e => onChange(e.target.value)
}, options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o.value,
  value: o.value
}, o.label)));
Object.assign(window, {
  Panel,
  Metric,
  Chip,
  Button,
  Field,
  Input,
  Toggle,
  Modal,
  Select
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "Primitives.jsx", error: String((e && e.message) || e) }); }

// Screens.jsx
try { (() => {
// Screens.jsx — dashboard, case list, quote builder, quotes, materials
const {
  useState: useStateS,
  useMemo: useMemoS
} = React;

// ─────────────────────────────────────────────────────────────
// CASES (seed)
// ─────────────────────────────────────────────────────────────
const CASES_SEED = [{
  id: '#2025-0418',
  name: '大明商辦 3F 配電工程',
  client: '大明建設 · 王協理',
  status: 'active',
  statusLabel: '進行中',
  amount: 128400,
  updated: '14:32',
  location: '台北 · 信義',
  progress: 62
}, {
  id: '#2025-0416',
  name: '信義區吳公館整修',
  client: '吳先生',
  status: 'warn',
  statusLabel: '待確認',
  amount: 48200,
  updated: '11:08',
  location: '台北 · 信義',
  progress: 24
}, {
  id: '#2025-0411',
  name: '文心飯店地下機房配管',
  client: '文心國際酒店',
  status: 'alert',
  statusLabel: '逾期',
  amount: 312800,
  updated: '04/12',
  location: '台中 · 西屯',
  progress: 88
}, {
  id: '#2025-0409',
  name: '松山火鍋店冷凍配電',
  client: '頂鍋食品',
  status: 'ok',
  statusLabel: '已付款',
  amount: 92500,
  updated: '04/10',
  location: '台北 · 松山',
  progress: 100
}, {
  id: '#2025-0406',
  name: '林口集合住宅熱水管線',
  client: '日盛營造',
  status: 'active',
  statusLabel: '進行中',
  amount: 186700,
  updated: '04/15',
  location: '新北 · 林口',
  progress: 41
}, {
  id: '#2025-0402',
  name: '板橋誠品門市照明更新',
  client: '誠品生活',
  status: 'ok',
  statusLabel: '已付款',
  amount: 64200,
  updated: '04/03',
  location: '新北 · 板橋',
  progress: 100
}];

// ─────────────────────────────────────────────────────────────
// MATERIALS CATALOG (used by quote builder + materials screen)
// ─────────────────────────────────────────────────────────────
const MATERIALS = [{
  code: 'NFB-3P-100',
  name: '無熔絲開關 NFB 3P 100A',
  cat: '材料',
  unit: '個',
  price: 2850,
  stock: 12
}, {
  code: 'NFB-2P-30',
  name: '無熔絲開關 NFB 2P 30A',
  cat: '材料',
  unit: '個',
  price: 680,
  stock: 34
}, {
  code: 'PVC-1-4M',
  name: 'PVC 電管 1" × 4m',
  cat: '材料',
  unit: '支',
  price: 180,
  stock: 128
}, {
  code: 'PVC-3-4-4M',
  name: 'PVC 電管 3/4" × 4m',
  cat: '材料',
  unit: '支',
  price: 140,
  stock: 82
}, {
  code: 'PNL-60-80',
  name: '配電盤 600×800 烤漆',
  cat: '材料',
  unit: '座',
  price: 18500,
  stock: 3
}, {
  code: 'WIRE-5-5',
  name: '電線 5.5 平方 × 100m',
  cat: '材料',
  unit: '捲',
  price: 3200,
  stock: 18
}, {
  code: 'WIRE-2-0',
  name: '電線 2.0 平方 × 100m',
  cat: '材料',
  unit: '捲',
  price: 1400,
  stock: 24
}, {
  code: 'PIPE-CU-15',
  name: '銅管 15A × 3m',
  cat: '材料',
  unit: '支',
  price: 520,
  stock: 0
}, {
  code: 'LBR-ELEC-S',
  name: '配管施工 · 資深師傅',
  cat: '工資',
  unit: '工時',
  price: 1200,
  stock: '—'
}, {
  code: 'LBR-ELEC-J',
  name: '配管施工 · 助手',
  cat: '工資',
  unit: '工時',
  price: 700,
  stock: '—'
}, {
  code: 'LBR-GND',
  name: '接地測試 · 現場驗收',
  cat: '工資',
  unit: '式',
  price: 4500,
  stock: '—'
}, {
  code: 'LBR-PLB',
  name: '給排水配管施工',
  cat: '工資',
  unit: '工時',
  price: 1100,
  stock: '—'
}];
const fmt = n => 'NT$ ' + (n || 0).toLocaleString();

// ─────────────────────────────────────────────────────────────
// NEW CASE MODAL
// ─────────────────────────────────────────────────────────────
function NewCaseModal({
  open,
  onClose,
  onCreate
}) {
  const [name, setName] = useStateS('');
  const [client, setClient] = useStateS('');
  const [location, setLocation] = useStateS('');
  const [amount, setAmount] = useStateS('');
  const reset = () => {
    setName('');
    setClient('');
    setLocation('');
    setAmount('');
  };
  const submit = () => {
    if (!name.trim()) return;
    const now = new Date();
    const id = `#${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    onCreate({
      id,
      name: name.trim(),
      client: client.trim() || '—',
      location: location.trim() || '—',
      status: 'warn',
      statusLabel: '待確認',
      amount: +amount || 0,
      updated: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      progress: 0
    });
    reset();
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "\u65B0\u589E\u6848\u4EF6 \xB7 NEW CASE",
    meta: "FORM",
    width: 560,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: "check",
      onClick: submit
    }, "\u5EFA\u7ACB\u6848\u4EF6"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u6848\u4EF6\u540D\u7A31 \xB7 NAME"
  }, /*#__PURE__*/React.createElement(Input, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "\u5927\u660E\u5546\u8FA6 3F \u914D\u96FB\u5DE5\u7A0B",
    autoFocus: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u696D\u4E3B \xB7 CLIENT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: client,
    onChange: e => setClient(e.target.value),
    placeholder: "\u738B\u5354\u7406"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u5730\u9EDE \xB7 LOCATION"
  }, /*#__PURE__*/React.createElement(Input, {
    value: location,
    onChange: e => setLocation(e.target.value),
    placeholder: "\u53F0\u5317 \xB7 \u4FE1\u7FA9"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u9810\u4F30\u91D1\u984D \xB7 AMOUNT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: amount,
    onChange: e => setAmount(e.target.value),
    placeholder: "128400",
    type: "number"
  }))));
}

// ─────────────────────────────────────────────────────────────
// ADD LINE-ITEM MODAL
// ─────────────────────────────────────────────────────────────
function AddLineItemModal({
  open,
  onClose,
  onAdd
}) {
  const [mode, setMode] = useStateS('catalog'); // 'catalog' | 'custom'
  const [q, setQ] = useStateS('');
  const [custom, setCustom] = useStateS({
    name: '',
    cat: '材料',
    unit: '個',
    qty: 1,
    price: 0
  });
  const filtered = MATERIALS.filter(m => m.name.includes(q) || m.code.includes(q));
  const addFromCatalog = m => {
    onAdd({
      id: Date.now(),
      type: m.cat === '工資' ? 'labor' : 'material',
      name: m.name,
      qty: 1,
      unit: m.unit,
      price: m.price,
      cat: m.cat
    });
    onClose();
  };
  const addCustom = () => {
    if (!custom.name.trim()) return;
    onAdd({
      id: Date.now(),
      type: custom.cat === '工資' ? 'labor' : 'material',
      name: custom.name.trim(),
      qty: +custom.qty || 1,
      unit: custom.unit.trim() || '個',
      price: +custom.price || 0,
      cat: custom.cat
    });
    setCustom({
      name: '',
      cat: '材料',
      unit: '個',
      qty: 1,
      price: 0
    });
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "\u65B0\u589E\u5DE5\u9805 \xB7 ADD LINE",
    meta: mode === 'catalog' ? 'FROM CATALOG' : 'CUSTOM',
    width: 640
  }, /*#__PURE__*/React.createElement("div", {
    className: "mode-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `mode-tab ${mode === 'catalog' ? 'active' : ''}`,
    onClick: () => setMode('catalog')
  }, "\u5F9E\u6750\u6599\u5EAB\u9078\u53D6"), /*#__PURE__*/React.createElement("button", {
    className: `mode-tab ${mode === 'custom' ? 'active' : ''}`,
    onClick: () => setMode('custom')
  }, "\u81EA\u8A02\u5DE5\u9805")), mode === 'catalog' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "searchbar",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u54C1\u9805 / \u4EE3\u78BC",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, filtered.length, "/", MATERIALS.length)), /*#__PURE__*/React.createElement("div", {
    className: "pick-list"
  }, filtered.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.code,
    className: "pick-row",
    onClick: () => addFromCatalog(m)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--accent)',
      width: 110
    }
  }, m.code), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--fg-1)'
    }
  }, m.name), /*#__PURE__*/React.createElement(Chip, {
    kind: m.cat === '工資' ? 'info' : 'dim'
  }, m.cat), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      width: 90,
      textAlign: 'right',
      color: 'var(--fg-1)'
    }
  }, fmt(m.price)), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub",
    style: {
      width: 40,
      textAlign: 'right'
    }
  }, "/", m.unit))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: 'center',
      color: 'var(--fg-3)'
    }
  }, "\u7121\u7B26\u5408\u9805\u76EE"))), mode === 'custom' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u9805\u76EE\u540D\u7A31 \xB7 NAME"
  }, /*#__PURE__*/React.createElement(Input, {
    value: custom.name,
    onChange: e => setCustom({
      ...custom,
      name: e.target.value
    }),
    placeholder: "\u958B\u95DC\u9762\u677F 2P",
    autoFocus: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u985E\u5225 \xB7 CATEGORY"
  }, /*#__PURE__*/React.createElement(Select, {
    value: custom.cat,
    onChange: v => setCustom({
      ...custom,
      cat: v
    }),
    options: [{
      value: '材料',
      label: '材料'
    }, {
      value: '工資',
      label: '工資'
    }, {
      value: '雜項',
      label: '雜項'
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u55AE\u4F4D \xB7 UNIT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: custom.unit,
    onChange: e => setCustom({
      ...custom,
      unit: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u6578\u91CF \xB7 QTY"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: custom.qty,
    onChange: e => setCustom({
      ...custom,
      qty: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u55AE\u50F9 \xB7 UNIT PRICE"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: custom.price,
    onChange: e => setCustom({
      ...custom,
      price: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    onClick: addCustom
  }, "\u52A0\u5165\u5DE5\u9805"))));
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({
  cases,
  onOpenCase,
  onNewCase,
  onBuildQuote
}) {
  const activeCases = cases.filter(c => c.status === 'active');
  const totalMonth = cases.reduce((s, c) => s + c.amount, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Dashboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u4E3B\u63A7\u53F0 // COMMAND"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "plus",
    onClick: onNewCase
  }, "\u65B0\u589E\u6848\u4EF6"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "file-plus",
    onClick: onBuildQuote
  }, "\u5EFA\u7ACB\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u6536\u6B3E",
    meta: "2026 \xB7 APR",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL RECEIVED",
    value: fmt(totalMonth),
    delta: "\u25B2 +12.4% \xB7 \u6708\u589E NT$ 92,800"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u9032\u884C\u4E2D\u6848\u4EF6",
    meta: "LIVE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ACTIVE CASES",
    value: activeCases.length,
    accent: true,
    delta: `▲ ${cases.filter(c => c.status === 'warn').length} 待確認 · ${cases.filter(c => c.status === 'alert').length} 逾期`,
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5F85\u958B\u767C\u7968",
    meta: "PENDING"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TO BE ISSUED",
    value: fmt(218300),
    sub: "4 \u5F35",
    delta: "7 \u65E5\u5167\u5230\u671F",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u5DE5\u6642",
    meta: "LOG"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "LABOR HOURS",
    value: "214.5",
    sub: "HR \xB7 3 \u5E2B\u5085",
    delta: "\u25B2 \u6548\u7387 94%"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two-col"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6700\u8FD1\u6848\u4EF6",
    meta: `${cases.length} RECORDS · LIVE`
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CASE"), /*#__PURE__*/React.createElement("th", null, "\u696D\u4E3B / \u540D\u7A31"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u66F4\u65B0"))), /*#__PURE__*/React.createElement("tbody", null, cases.slice(0, 6).map((c, i) => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    className: i === 0 ? 'row-active' : '',
    onClick: () => onOpenCase(c)
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, c.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, c.client)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: c.status
  }, c.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(c.amount)), /*#__PURE__*/React.createElement("td", {
    className: "mono row-sub",
    style: {
      textAlign: 'right'
    }
  }, c.updated)))))), /*#__PURE__*/React.createElement("div", {
    className: "stack"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u7CFB\u7D71\u72C0\u614B",
    meta: "TELEMETRY"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tele-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u7BC0\u9EDE\u9023\u7DDA"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '94%',
      background: 'var(--ok)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "94%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u672C\u6708\u9054\u6210\u7387"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '72%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "72%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u6750\u6599\u5EAB\u5B58"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '38%',
      background: 'var(--warn)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "38%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u8ACB\u6B3E\u56DE\u6536"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '81%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "81%")))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u4ECA\u65E5\u6392\u7A0B",
    meta: "3 TASKS"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "task-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "09:00"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u65B0\u838A \xB7 \u51B7\u6C23\u914D\u7DDA\u73FE\u52D8"), /*#__PURE__*/React.createElement(Chip, {
    kind: "info"
  }, "\u73FE\u52D8")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "13:30"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u6587\u5FC3\u98EF\u5E97\u6A5F\u623F\u9A57\u6536"), /*#__PURE__*/React.createElement(Chip, {
    kind: "alert"
  }, "\u903E\u671F")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "16:00"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u5927\u660E\u5546\u8FA6\u5831\u50F9\u8907\u6838"), /*#__PURE__*/React.createElement(Chip, {
    kind: "warn"
  }, "\u5F85\u78BA\u8A8D")))))));
}

// ─────────────────────────────────────────────────────────────
// CASE LIST
// ─────────────────────────────────────────────────────────────
function CaseList({
  cases,
  onOpenCase,
  onNewCase
}) {
  const [q, setQ] = useStateS('');
  const filtered = useMemoS(() => cases.filter(c => c.name.includes(q) || c.id.includes(q) || c.client.includes(q)), [q, cases]);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Cases"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u6848\u4EF6\u5217\u8868 // CASES"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "searchbar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u6848\u4EF6 / \u696D\u4E3B"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, filtered.length, "/", cases.length)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    onClick: onNewCase
  }, "\u65B0\u589E\u6848\u4EF6"))), /*#__PURE__*/React.createElement(Panel, {
    title: `CASES · ${filtered.length} RECORDS`,
    meta: "FULL INDEX"
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CASE"), /*#__PURE__*/React.createElement("th", null, "\u540D\u7A31 / \u696D\u4E3B"), /*#__PURE__*/React.createElement("th", null, "\u5730\u5340"), /*#__PURE__*/React.createElement("th", null, "\u9032\u5EA6"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    onClick: () => onOpenCase(c)
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, c.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, c.client)), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, c.location), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "progress-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "progress-fill",
    style: {
      width: c.progress + '%',
      background: c.status === 'alert' ? 'var(--alert)' : c.status === 'warn' ? 'var(--warn)' : c.progress === 100 ? 'var(--ok)' : 'var(--accent)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub"
  }, c.progress, "%")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: c.status
  }, c.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(c.amount)))), filtered.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      textAlign: 'center',
      color: 'var(--fg-3)',
      padding: 32
    }
  }, "\u7121\u7B26\u5408\u6848\u4EF6"))))));
}

// ─────────────────────────────────────────────────────────────
// QUOTE BUILDER
// ─────────────────────────────────────────────────────────────
const LINE_ITEMS_INIT = [{
  id: 1,
  type: 'material',
  name: '無熔絲開關 NFB 3P 100A',
  qty: 2,
  unit: '個',
  price: 2850,
  cat: '材料'
}, {
  id: 2,
  type: 'material',
  name: 'PVC 電管 1" × 4m',
  qty: 24,
  unit: '支',
  price: 180,
  cat: '材料'
}, {
  id: 3,
  type: 'material',
  name: '配電盤 600×800 烤漆',
  qty: 1,
  unit: '座',
  price: 18500,
  cat: '材料'
}, {
  id: 4,
  type: 'labor',
  name: '配管施工 · 資深師傅',
  qty: 16,
  unit: '工時',
  price: 1200,
  cat: '工資'
}, {
  id: 5,
  type: 'labor',
  name: '接地測試 · 現場驗收',
  qty: 1,
  unit: '式',
  price: 4500,
  cat: '工資'
}];
function QuoteBuilder({
  caseData,
  onClose
}) {
  const [items, setItems] = useStateS(LINE_ITEMS_INIT);
  const [taxInc, setTaxInc] = useStateS(true);
  const [addOpen, setAddOpen] = useStateS(false);
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = taxInc ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax;
  const updateQty = (id, qty) => setItems(items.map(it => it.id === id ? {
    ...it,
    qty: Math.max(0, qty)
  } : it));
  const removeItem = id => setItems(items.filter(it => it.id !== id));
  const addItem = it => setItems(prev => [...prev, it]);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen screen-quote",
    "data-screen-label": "Quote Builder"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, "QUOTE BUILDER \xB7 ", caseData?.id || '#NEW'), /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, caseData?.name || '新報價單')), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose,
    icon: "x"
  }, "\u95DC\u9589"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    icon: "save"
  }, "\u5132\u5B58\u8349\u7A3F"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "send"
  }, "\u9001\u51FA\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "quote-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-main"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6848\u4EF6\u8CC7\u8A0A",
    meta: "CLIENT \xB7 SCOPE"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u696D\u4E3B"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: caseData?.client || '大明建設 · 王協理'
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u806F\u7D61\u96FB\u8A71"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "02-2723-xxxx"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u5DE5\u7A0B\u5730\u9EDE"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "\u53F0\u5317\u5E02\u4FE1\u7FA9\u5340\u677E\u9AD8\u8DEF 19 \u865F 3F"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u9810\u8A08\u5DE5\u671F"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "14 \u5929"
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DE5\u9805\u660E\u7D30",
    meta: `${items.length} LINE ITEMS`,
    accent: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table line-items"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "\u9805\u76EE"), /*#__PURE__*/React.createElement("th", null, "\u985E\u5225"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u6578\u91CF"), /*#__PURE__*/React.createElement("th", null, "\u55AE\u4F4D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u55AE\u50F9"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u5C0F\u8A08"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, items.map((it, i) => /*#__PURE__*/React.createElement("tr", {
    key: it.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono row-sub"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("td", null, it.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: it.type === 'labor' ? 'info' : 'dim'
  }, it.cat)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input input-inline",
    type: "number",
    value: it.qty,
    onChange: e => updateQty(it.id, +e.target.value)
  })), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, it.unit), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, it.price.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right',
      color: 'var(--accent)'
    }
  }, (it.qty * it.price).toLocaleString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => removeItem(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  }))))), items.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      color: 'var(--fg-3)',
      padding: 24
    }
  }, "\u5C1A\u7121\u5DE5\u9805 \xB7 \u9EDE\u64CA\u4E0B\u65B9\u65B0\u589E")))), /*#__PURE__*/React.createElement("button", {
    className: "add-line",
    onClick: () => setAddOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " \u65B0\u589E\u5DE5\u9805"))), /*#__PURE__*/React.createElement("aside", {
    className: "quote-side"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u91D1\u984D\u8A08\u7B97",
    meta: "AMOUNT"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u5C0F\u8A08"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fmt(subtotal))), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u71DF\u696D\u7A05 (5%)"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fmt(tax))), /*#__PURE__*/React.createElement("div", {
    className: "calc-total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, "TOTAL \xB7 \u7E3D\u8A08"), /*#__PURE__*/React.createElement("div", {
    className: "calc-total-v"
  }, fmt(total))), /*#__PURE__*/React.createElement(Toggle, {
    on: taxInc,
    onChange: setTaxInc,
    label: "\u542B\u71DF\u696D\u7A05"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6838\u51C6\u6D41\u7A0B",
    meta: "WORKFLOW"
  }, /*#__PURE__*/React.createElement("ol", {
    className: "steps"
  }, /*#__PURE__*/React.createElement("li", {
    className: "step-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u8349\u7A3F\u5EFA\u7ACB"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "04/17 10:24 \xB7 \u9673\u5E2B\u5085"))), /*#__PURE__*/React.createElement("li", {
    className: "step-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u5DE5\u6599\u8907\u6838"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "04/18 09:15 \xB7 \u6797\u5DE5"))), /*#__PURE__*/React.createElement("li", {
    className: "step-active"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u25CF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u9001\u51FA\u696D\u4E3B"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "\u7B49\u5F85 \xB7 03:42"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u25CB"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u696D\u4E3B\u7C3D\u56DE"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "\u2014"))))))), /*#__PURE__*/React.createElement(AddLineItemModal, {
    open: addOpen,
    onClose: () => setAddOpen(false),
    onAdd: addItem
  }));
}

// ─────────────────────────────────────────────────────────────
// QUOTES LIST
// ─────────────────────────────────────────────────────────────
const QUOTES = [{
  id: 'Q-2025-0418-A',
  caseId: '#2025-0418',
  case: '大明商辦 3F 配電工程',
  version: 'v3',
  status: 'warn',
  statusLabel: '待業主簽回',
  amount: 128400,
  issued: '04/18',
  valid: '05/18'
}, {
  id: 'Q-2025-0416-A',
  caseId: '#2025-0416',
  case: '信義區吳公館整修',
  version: 'v1',
  status: 'info',
  statusLabel: '草稿',
  amount: 48200,
  issued: '04/16',
  valid: '05/16'
}, {
  id: 'Q-2025-0411-B',
  caseId: '#2025-0411',
  case: '文心飯店地下機房配管',
  version: 'v2',
  status: 'ok',
  statusLabel: '已簽回',
  amount: 312800,
  issued: '04/11',
  valid: '05/11'
}, {
  id: 'Q-2025-0409-A',
  caseId: '#2025-0409',
  case: '松山火鍋店冷凍配電',
  version: 'v1',
  status: 'ok',
  statusLabel: '已簽回',
  amount: 92500,
  issued: '04/09',
  valid: '05/09'
}, {
  id: 'Q-2025-0406-A',
  caseId: '#2025-0406',
  case: '林口集合住宅熱水管線',
  version: 'v2',
  status: 'alert',
  statusLabel: '逾期未簽',
  amount: 186700,
  issued: '04/06',
  valid: '04/16'
}];
function QuotesList({
  onOpenQuote
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Quotes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u5831\u50F9\u55AE // QUOTES"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "file-plus",
    onClick: onOpenQuote
  }, "\u5EFA\u7ACB\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u958B\u7ACB",
    meta: "APR"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ISSUED",
    value: QUOTES.length,
    accent: true,
    sub: "\u5F35"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5F85\u696D\u4E3B\u7C3D\u56DE",
    meta: "PENDING"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "AWAITING",
    value: "1",
    delta: "03:42 \u5DF2\u7B49\u5F85",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DF2\u7C3D\u56DE\u91D1\u984D",
    meta: "APPROVED"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "SIGNED",
    value: fmt(405300)
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u903E\u671F\u672A\u7C3D",
    meta: "OVERDUE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "OVERDUE",
    value: "1",
    delta: "\u9700\u806F\u7D61\u696D\u4E3B",
    deltaKind: "alert"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5831\u50F9\u55AE\u7D00\u9304",
    meta: `${QUOTES.length} DOCS`
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "QUOTE"), /*#__PURE__*/React.createElement("th", null, "\u6848\u4EF6"), /*#__PURE__*/React.createElement("th", null, "\u7248\u672C"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", null, "\u958B\u7ACB"), /*#__PURE__*/React.createElement("th", null, "\u6709\u6548"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"))), /*#__PURE__*/React.createElement("tbody", null, QUOTES.map(q => /*#__PURE__*/React.createElement("tr", {
    key: q.id,
    onClick: onOpenQuote
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, q.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, q.case), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, q.caseId)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: "dim",
    code: true
  }, q.version)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: q.status
  }, q.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, q.issued), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, q.valid), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(q.amount))))))));
}

// ─────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────
function MaterialsScreen() {
  const [q, setQ] = useStateS('');
  const [cat, setCat] = useStateS('all');
  const filtered = MATERIALS.filter(m => (cat === 'all' || m.cat === cat) && (m.name.includes(q) || m.code.includes(q)));
  const totalValue = MATERIALS.filter(m => typeof m.stock === 'number').reduce((s, m) => s + m.stock * m.price, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Materials"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u6750\u6599\u5EAB // MATERIALS"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "download"
  }, "\u532F\u51FA\u6E05\u55AE"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "\u65B0\u589E\u54C1\u9805"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u54C1\u9805\u7E3D\u6578",
    meta: "CATALOG",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "SKUS",
    value: MATERIALS.length,
    accent: true
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5EAB\u5B58\u50F9\u503C",
    meta: "VALUE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ON-HAND",
    value: fmt(totalValue)
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u4F4E\u5EAB\u5B58",
    meta: "< 10"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "LOW STOCK",
    value: MATERIALS.filter(m => typeof m.stock === 'number' && m.stock < 10).length,
    delta: "\u5EFA\u8B70\u88DC\u8CA8",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u7F3A\u8CA8",
    meta: "ZERO"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "OUT",
    value: MATERIALS.filter(m => m.stock === 0).length,
    delta: "\u7ACB\u5373\u88DC\u8CA8",
    deltaKind: "alert"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: `CATALOG · ${filtered.length} SKUS`,
    meta: "LIVE"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "searchbar",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u54C1\u9805 / \u4EE3\u78BC",
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat-tabs"
  }, ['all', '材料', '工資'].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: `cat-tab ${cat === c ? 'active' : ''}`,
    onClick: () => setCat(c)
  }, c === 'all' ? '全部' : c)))), /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CODE"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: "12px"
    }
  }, "\u54C1\u540D"), /*#__PURE__*/React.createElement("th", null, "\u985E\u5225"), /*#__PURE__*/React.createElement("th", null, "\u55AE\u4F4D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u55AE\u50F9"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u5EAB\u5B58"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u5EAB\u5B58\u503C"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(m => {
    const low = typeof m.stock === 'number' && m.stock < 10;
    const out = m.stock === 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: m.code
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono"
    }, m.code), /*#__PURE__*/React.createElement("td", null, m.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
      kind: m.cat === '工資' ? 'info' : 'dim'
    }, m.cat)), /*#__PURE__*/React.createElement("td", {
      className: "row-sub mono"
    }, m.unit), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right'
      }
    }, fmt(m.price)), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right',
        color: out ? 'var(--alert)' : low ? 'var(--warn)' : 'var(--fg-1)'
      }
    }, m.stock, out && ' · 缺貨', low && !out && ' · 低'), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right',
        color: 'var(--accent)'
      }
    }, typeof m.stock === 'number' ? fmt(m.stock * m.price) : '—'));
  })))));
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────
const MONTHLY = [{
  m: '10月',
  rev: 612,
  cost: 384
}, {
  m: '11月',
  rev: 548,
  cost: 362
}, {
  m: '12月',
  rev: 724,
  cost: 441
}, {
  m: '01月',
  rev: 680,
  cost: 412
}, {
  m: '02月',
  rev: 512,
  cost: 318
}, {
  m: '03月',
  rev: 798,
  cost: 476
}, {
  m: '04月',
  rev: 842,
  cost: 498
}];
const CLIENT_DIST = [{
  name: '大明建設',
  value: 328,
  pct: 28
}, {
  name: '文心酒店',
  value: 312,
  pct: 27
}, {
  name: '日盛營造',
  value: 186,
  pct: 16
}, {
  name: '誠品生活',
  value: 128,
  pct: 11
}, {
  name: '其他 12 家',
  value: 204,
  pct: 18
}];
function ReportsScreen() {
  const [range, setRange] = useStateS('7m');
  const maxVal = Math.max(...MONTHLY.map(m => m.rev));
  const totalRev = MONTHLY.reduce((s, m) => s + m.rev, 0);
  const totalCost = MONTHLY.reduce((s, m) => s + m.cost, 0);
  const margin = ((totalRev - totalCost) / totalRev * 100).toFixed(1);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Reports"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u71DF\u904B\u5831\u8868 // REPORTS"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat-tabs"
  }, [['3m', '近 3 月'], ['7m', '近 7 月'], ['1y', '近一年']].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: `cat-tab ${range === v ? 'active' : ''}`,
    onClick: () => setRange(v)
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "download"
  }, "\u532F\u51FA PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u671F\u9593\u71DF\u6536",
    meta: "REVENUE",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL",
    value: fmt(totalRev * 1000),
    delta: "\u25B2 +18.2% \u5E74\u589E"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u671F\u9593\u6210\u672C",
    meta: "COST"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL",
    value: fmt(totalCost * 1000),
    delta: "\u25B2 +12.4% \u5E74\u589E",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6BDB\u5229\u7387",
    meta: "MARGIN"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "MARGIN",
    value: margin + '%',
    accent: true,
    delta: "\u25B2 +2.1 pt"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6848\u4EF6\u5B8C\u6210\u7387",
    meta: "RATE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "COMPLETION",
    value: "88%",
    delta: "\u25B2 \u9AD8\u65BC\u53BB\u5E74 6 pt"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two-col"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6708\u71DF\u6536\u5C0D\u6BD4",
    meta: "REVENUE \xB7 COST \xB7 \u5343\u5143"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-bars"
  }, MONTHLY.map(m => {
    const hR = m.rev / maxVal * 100;
    const hC = m.cost / maxVal * 100;
    return /*#__PURE__*/React.createElement("div", {
      key: m.m,
      className: "bar-group",
      title: `${m.m} · 營收 ${m.rev} / 成本 ${m.cost}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-pair"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar bar-rev",
      style: {
        height: hR + '%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar-v mono"
    }, m.rev)), /*#__PURE__*/React.createElement("span", {
      className: "bar bar-cost",
      style: {
        height: hC + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "bar-label mono"
    }, m.m));
  })), /*#__PURE__*/React.createElement("div", {
    className: "chart-legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-sq",
    style: {
      background: 'var(--accent)'
    }
  }), "\u71DF\u6536"), /*#__PURE__*/React.createElement("span", {
    className: "legend-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-sq",
    style: {
      background: 'var(--fg-4)'
    }
  }), "\u6210\u672C")))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u696D\u4E3B\u5206\u4F48",
    meta: "TOP CLIENTS"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "dist-list"
  }, CLIENT_DIST.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: c.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "dist-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-4)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-tc)',
      color: 'var(--fg-1)'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--accent)'
    }
  }, fmt(c.value * 1000))), /*#__PURE__*/React.createElement("div", {
    className: "dist-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dist-fill",
    style: {
      width: c.pct + '%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub"
  }, c.pct, "%")))))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DE5\u9805\u985E\u5225\u5206\u6790",
    meta: "BY CATEGORY"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat-grid"
  }, [{
    name: '配電 · 強電',
    pct: 42,
    amt: 1860
  }, {
    name: '配管 · 給排水',
    pct: 28,
    amt: 1240
  }, {
    name: '照明安裝',
    pct: 14,
    amt: 620
  }, {
    name: '空調配線',
    pct: 10,
    amt: 440
  }, {
    name: '其他雜項',
    pct: 6,
    amt: 264
  }].map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "cat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "num-hd"
  }, c.pct, "%"), /*#__PURE__*/React.createElement("div", {
    className: "mono row-sub"
  }, fmt(c.amt * 1000)), /*#__PURE__*/React.createElement("div", {
    className: "dist-bar",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dist-fill",
    style: {
      width: c.pct * 2 + '%'
    }
  })))))));
}
function ComingSoon({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": label
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, label)), /*#__PURE__*/React.createElement(Panel, {
    title: "MODULE \xB7 STANDBY",
    meta: "NOT WIRED"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px',
      textAlign: 'center',
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)',
      marginBottom: 12
    }
  }, "\u2310 STANDBY \u2310"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-tc)',
      fontSize: 14
    }
  }, "\u6B64\u6A21\u7D44\u65BC UI \u5957\u4EF6\u4E2D\u5C1A\u672A\u5BE6\u4F5C"))));
}
Object.assign(window, {
  Dashboard,
  CaseList,
  QuoteBuilder,
  QuotesList,
  MaterialsScreen,
  ReportsScreen,
  ComingSoon,
  CASES_SEED,
  NewCaseModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quotation/Auth.jsx
try { (() => {
// Auth.jsx — Login + Whitelist management for 水電報價 HUD
// Master admin password: 0937779487

const ADMIN_PASS = '0937779487';
const WL_KEY = 'hud_whitelist_v1';
const SESSION_KEY = 'hud_session_v1';
const WL_SEED = [{
  phone: '0912345678',
  name: '王師傅',
  role: '工班',
  addedAt: '2026-03-12',
  note: '北區主力'
}, {
  phone: '0922778899',
  name: '陳工頭',
  role: '工班',
  addedAt: '2026-03-15',
  note: '弱電施工'
}, {
  phone: '0933221100',
  name: '李業務',
  role: '業務',
  addedAt: '2026-04-02',
  note: ''
}, {
  phone: '0955667788',
  name: '林會計',
  role: '會計',
  addedAt: '2026-04-08',
  note: '請款窗口'
}];
function loadWhitelist() {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(WL_KEY, JSON.stringify(WL_SEED));
  return WL_SEED;
}
function saveWhitelist(list) {
  localStorage.setItem(WL_KEY, JSON.stringify(list));
}
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function saveSession(s) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));else localStorage.removeItem(SESSION_KEY);
}

// ─────────────────────────────────────────────────────────────
// Login Screen — full-viewport HUD console
// ─────────────────────────────────────────────────────────────
function LoginScreen({
  onAuth
}) {
  const [phone, setPhone] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [stage, setStage] = React.useState('idle'); // idle | verifying | granted | denied

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [stage, err]);
  const tryLogin = e => {
    e && e.preventDefault();
    setErr('');
    if (!phone.trim() || !pass.trim()) {
      setErr('請輸入手機號碼與通行碼');
      return;
    }
    setBusy(true);
    setStage('verifying');

    // simulate handshake
    setTimeout(() => {
      // admin master pass
      if (pass === ADMIN_PASS) {
        const wl = loadWhitelist();
        const found = wl.find(w => w.phone === phone.trim());
        const session = {
          phone: phone.trim(),
          name: found ? found.name : '系統管理員',
          role: found ? found.role : 'ADMIN',
          isAdmin: true,
          loginAt: new Date().toISOString()
        };
        setStage('granted');
        setTimeout(() => onAuth(session), 700);
        return;
      }
      // whitelisted users — phone == phone, pass == phone (last 4 digits also accepted)
      const wl = loadWhitelist();
      const found = wl.find(w => w.phone === phone.trim());
      if (found && (pass === found.phone || pass === found.phone.slice(-4))) {
        const session = {
          phone: found.phone,
          name: found.name,
          role: found.role,
          isAdmin: false,
          loginAt: new Date().toISOString()
        };
        setStage('granted');
        setTimeout(() => onAuth(session), 700);
        return;
      }
      setStage('denied');
      setErr(found ? '通行碼錯誤 // ACCESS DENIED' : '此號碼未在白名單 // NOT WHITELISTED');
      setBusy(false);
      setTimeout(() => setStage('idle'), 1400);
    }, 600);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "login-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-bg-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-bg-scan"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-brand"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "44",
    height: "44",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 3 L57 17 L57 47 L32 61 L7 47 L7 17 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32 18 L46 26 L46 42 L32 50 L18 42 L18 26 Z",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "34",
    r: "4",
    fill: "var(--accent)",
    stroke: "none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "login-brand-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-brand-title"
  }, "\u6C34\u96FB\u5831\u50F9"), /*#__PURE__*/React.createElement("div", {
    className: "login-brand-sub"
  }, "HYDRO\xB7ELECTRIC // QUOTATION CONSOLE"))), /*#__PURE__*/React.createElement("section", {
    className: `hud-panel login-panel ${stage === 'denied' ? 'login-deny' : ''} ${stage === 'granted' ? 'login-grant' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "SECURE LOGIN // \u8EAB\u5206\u9A57\u8B49"), /*#__PURE__*/React.createElement("span", {
    className: "panel-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: `status-dot ${stage === 'denied' ? 'dot-alert' : stage === 'granted' ? 'dot-ok' : ''}`
  }), stage === 'verifying' ? 'VERIFYING' : stage === 'granted' ? 'GRANTED' : stage === 'denied' ? 'DENIED' : 'READY')), /*#__PURE__*/React.createElement("form", {
    className: "login-body",
    onSubmit: tryLogin
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-corner tl"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-corner tr"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-corner bl"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-corner br"
  }), /*#__PURE__*/React.createElement("div", {
    className: "login-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-fld"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mono-label"
  }, "PHONE // \u624B\u6A5F\u865F\u78BC"), /*#__PURE__*/React.createElement("div", {
    className: "login-input-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "smartphone",
    className: "login-input-icon"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input login-input mono",
    inputMode: "numeric",
    autoComplete: "username",
    placeholder: "09XX XXX XXX",
    value: phone,
    onChange: e => setPhone(e.target.value.replace(/\s/g, '')),
    disabled: busy,
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "login-fld"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mono-label"
  }, "PASSCODE // \u901A\u884C\u78BC"), /*#__PURE__*/React.createElement("div", {
    className: "login-input-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "key-round",
    className: "login-input-icon"
  }), /*#__PURE__*/React.createElement("input", {
    className: "input login-input mono",
    type: "password",
    autoComplete: "current-password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pass,
    onChange: e => setPass(e.target.value),
    disabled: busy
  })))), /*#__PURE__*/React.createElement("div", {
    className: "login-meta-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "CHANNEL"), /*#__PURE__*/React.createElement("span", {
    className: "login-meta-v"
  }, "SECURE-01")), /*#__PURE__*/React.createElement("div", {
    className: "login-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "CIPHER"), /*#__PURE__*/React.createElement("span", {
    className: "login-meta-v"
  }, "AES-256")), /*#__PURE__*/React.createElement("div", {
    className: "login-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "SESSION"), /*#__PURE__*/React.createElement("span", {
    className: "login-meta-v"
  }, Math.random().toString(36).slice(2, 8).toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "login-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "NODE"), /*#__PURE__*/React.createElement("span", {
    className: "login-meta-v"
  }, "TPE\xB7HQ\xB707"))), err && /*#__PURE__*/React.createElement("div", {
    className: "login-err"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-alert"
  }), /*#__PURE__*/React.createElement("span", null, err)), /*#__PURE__*/React.createElement("div", {
    className: "login-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary login-submit",
    disabled: busy
  }, stage === 'verifying' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "loader",
    className: "spin"
  }), /*#__PURE__*/React.createElement("span", null, "VERIFYING\u2026")) : stage === 'granted' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check"
  }), /*#__PURE__*/React.createElement("span", null, "ACCESS GRANTED")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-in"
  }), /*#__PURE__*/React.createElement("span", null, "\u9032\u5165\u4E3B\u63A7\u53F0 // ENTER"), /*#__PURE__*/React.createElement("span", {
    className: "btn-caret"
  }, "\u203A")))), /*#__PURE__*/React.createElement("div", {
    className: "login-hint"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "HINT"), /*#__PURE__*/React.createElement("span", null, "\u767D\u540D\u55AE\u6210\u54E1\u4EE5\u624B\u6A5F\u865F\u70BA\u5E33\u865F\uFF0C\u901A\u884C\u78BC\u70BA\u624B\u6A5F\u672B\u56DB\u78BC\u6216\u5B8C\u6574\u865F\u78BC\u3002\u7BA1\u7406\u54E1\u8ACB\u8F38\u5165\u4E3B\u901A\u884C\u78BC\u3002")))), /*#__PURE__*/React.createElement("div", {
    className: "login-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "v2.6.0 \xB7 BUILD 4421"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "\xA9 2026 HYDRO-ELECTRIC OPS"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "UNAUTHORIZED ACCESS LOGGED"))));
}

// ─────────────────────────────────────────────────────────────
// Whitelist Screen — manage allowed phone numbers
// ─────────────────────────────────────────────────────────────
function WhitelistScreen({
  session,
  onLogout
}) {
  const [list, setList] = React.useState(() => loadWhitelist());
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({
    phone: '',
    name: '',
    role: '工班',
    note: ''
  });
  React.useEffect(() => {
    saveWhitelist(list);
  }, [list]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const filtered = list.filter(w => !q || w.phone.includes(q) || (w.name || '').includes(q) || (w.role || '').includes(q));
  const startAdd = () => {
    setEditing(null);
    setForm({
      phone: '',
      name: '',
      role: '工班',
      note: ''
    });
    setOpen(true);
  };
  const startEdit = w => {
    setEditing(w.phone);
    setForm({
      phone: w.phone,
      name: w.name,
      role: w.role,
      note: w.note || ''
    });
    setOpen(true);
  };
  const submit = () => {
    if (!/^09\d{8}$/.test(form.phone)) return alert('手機號碼格式錯誤 (09xxxxxxxx)');
    if (!form.name.trim()) return alert('請輸入姓名');
    const today = new Date().toISOString().slice(0, 10);
    if (editing) {
      setList(list.map(w => w.phone === editing ? {
        ...w,
        ...form
      } : w));
    } else {
      if (list.some(w => w.phone === form.phone)) return alert('此號碼已在白名單');
      setList([{
        ...form,
        addedAt: today
      }, ...list]);
    }
    setOpen(false);
  };
  const remove = phone => {
    if (!confirm(`從白名單移除 ${phone}？`)) return;
    setList(list.filter(w => w.phone !== phone));
  };
  const stats = {
    total: list.length,
    工班: list.filter(w => w.role === '工班').length,
    業務: list.filter(w => w.role === '業務').length,
    會計: list.filter(w => w.role === '會計').length
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u7E3D\u6388\u6B0A\u4EBA\u6578",
    meta: "WHITELIST",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "MEMBERS",
    value: stats.total,
    accent: true
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DE5\u73ED",
    meta: "FIELD CREW"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "CREW",
    value: stats.工班,
    delta: "\u65BD\u5DE5\u73FE\u5834",
    deltaKind: "ok"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u696D\u52D9",
    meta: "SALES"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "SALES",
    value: stats.業務,
    delta: "\u6848\u4EF6\u5C0D\u63A5",
    deltaKind: "ok"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6703\u8A08",
    meta: "FINANCE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "FIN",
    value: stats.會計,
    delta: "\u8ACB\u6B3E\u7BA1\u7406",
    deltaKind: "ok"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u7576\u524D\u767B\u5165\u8EAB\u5206",
    meta: "ACTIVE SESSION",
    accent: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "wl-session"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wl-session-avatar"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": session.isAdmin ? 'shield-check' : 'user'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-tc)',
      fontSize: 18,
      color: 'var(--fg-1)',
      fontWeight: 600
    }
  }, session.name), /*#__PURE__*/React.createElement(Chip, {
    kind: session.isAdmin ? 'active' : 'info'
  }, session.isAdmin ? 'ADMIN · 管理員' : session.role)), /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--fg-2)'
    }
  }, session.phone, " \xB7 LOGIN ", new Date(session.loginAt).toLocaleString('zh-TW'))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-solid",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-out"
  }), /*#__PURE__*/React.createElement("span", null, "\u767B\u51FA")))), /*#__PURE__*/React.createElement(Panel, {
    title: `白名單管理 // ${filtered.length} ENTRIES`,
    meta: session.isAdmin ? 'ADMIN MODE' : 'READ-ONLY'
  }, /*#__PURE__*/React.createElement("div", {
    className: "wl-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "searchbar",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 14,
      height: 14
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "\u641C\u5C0B / \u624B\u6A5F\u865F\u78BC / \u59D3\u540D / \u89D2\u8272",
    value: q,
    onChange: e => setQ(e.target.value)
  })), session.isAdmin && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: startAdd
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user-plus"
  }), /*#__PURE__*/React.createElement("span", null, "\u65B0\u589E\u6210\u54E1"), /*#__PURE__*/React.createElement("span", {
    className: "btn-caret"
  }, "+"))), /*#__PURE__*/React.createElement("table", {
    className: "data-table",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "PHONE"), /*#__PURE__*/React.createElement("th", null, "\u59D3\u540D"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: 12
    }
  }, "\u89D2\u8272"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: 12
    }
  }, "\u5099\u8A3B"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: 12
    }
  }, "\u52A0\u5165\u65E5\u671F"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right',
      fontSize: 12
    }
  }, "\u64CD\u4F5C"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(w => /*#__PURE__*/React.createElement("tr", {
    key: w.phone
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, w.phone), /*#__PURE__*/React.createElement("td", null, w.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: w.role === '會計' ? 'warn' : w.role === '業務' ? 'info' : 'ok'
  }, w.role)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--fg-3)'
    }
  }, w.note || '—'), /*#__PURE__*/React.createElement("td", {
    className: "row-sub"
  }, w.addedAt), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, session.isAdmin ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-solid btn-sm",
    onClick: () => startEdit(w)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pencil",
    style: {
      width: 12,
      height: 12
    }
  }), /*#__PURE__*/React.createElement("span", null, "\u7DE8\u8F2F")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-solid btn-sm wl-del",
    onClick: () => remove(w.phone)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 12,
      height: 12
    }
  }))) : /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, "READ-ONLY")))), filtered.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: 'center',
      padding: 32,
      color: 'var(--fg-3)'
    }
  }, "\u7121\u7B26\u5408\u7684\u767D\u540D\u55AE\u6210\u54E1"))))), open && /*#__PURE__*/React.createElement("div", {
    className: "hud-modal-veil",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("section", {
    className: "hud-panel hud-modal",
    onClick: e => e.stopPropagation(),
    style: {
      width: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, editing ? '編輯白名單成員' : '新增白名單成員'), /*#__PURE__*/React.createElement("span", {
    className: "panel-meta"
  }, editing ? 'EDIT' : 'NEW ENTRY')), /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-body",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u624B\u6A5F\u865F\u78BC \xB7 PHONE"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.phone,
    onChange: e => setForm({
      ...form,
      phone: e.target.value.replace(/\s/g, '')
    }),
    placeholder: "09XXXXXXXX",
    disabled: !!editing
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u59D3\u540D \xB7 NAME"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    }),
    placeholder: "\u738B\u5E2B\u5085"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u89D2\u8272 \xB7 ROLE"
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.role,
    onChange: v => setForm({
      ...form,
      role: v
    }),
    options: [{
      value: '工班',
      label: '工班 · FIELD CREW'
    }, {
      value: '業務',
      label: '業務 · SALES'
    }, {
      value: '會計',
      label: '會計 · FINANCE'
    }, {
      value: '管理',
      label: '管理 · ADMIN'
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u5099\u8A3B \xB7 NOTE"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.note,
    onChange: e => setForm({
      ...form,
      note: e.target.value
    }),
    placeholder: "(\u9078\u586B)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-solid",
    onClick: () => setOpen(false)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: submit
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  }), /*#__PURE__*/React.createElement("span", null, editing ? '儲存' : '加入白名單')))))));
}
Object.assign(window, {
  LoginScreen,
  WhitelistScreen,
  loadSession,
  saveSession
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quotation/Auth.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quotation/Chrome.jsx
try { (() => {
// QuotationApp.jsx — UI Kit main app for 水電報價 HUD
// Demonstrates the full system: rail, topbar, dashboard, case list, quote builder, inspector.

const {
  useState,
  useEffect,
  useMemo
} = React;

// ─────────────────────────────────────────────────────────────
// Icons (lucide via CDN - mounted after render)
// ─────────────────────────────────────────────────────────────
const Icon = ({
  name,
  size = 16,
  className = ''
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": name,
  width: size,
  height: size,
  className: className
});

// ─────────────────────────────────────────────────────────────
// Left Rail
// ─────────────────────────────────────────────────────────────
const RAIL_ITEMS = [{
  id: 'dashboard',
  icon: 'layout-grid',
  label: '主控台'
}, {
  id: 'cases',
  icon: 'folder-kanban',
  label: '案件'
}, {
  id: 'quotes',
  icon: 'file-text',
  label: '報價單'
}, {
  id: 'materials',
  icon: 'package',
  label: '材料'
}, {
  id: 'billing',
  icon: 'receipt',
  label: '請款'
}, {
  id: 'reports',
  icon: 'activity',
  label: '報表'
}, {
  id: 'whitelist',
  icon: 'shield-check',
  label: '白名單'
}];
function Rail({
  active,
  onNav,
  session,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rail-logo"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "28",
    height: "28",
    fill: "none",
    stroke: "#00E5FF",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32 3 L57 17 L57 47 L32 61 L7 47 L7 17 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32 20 C32 20, 26 28, 26 34 C26 38.5 28.7 41 32 41 C35.3 41 38 38.5 38 34 C38 28 32 20 32 20 Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32 28 L30 33 L33 33 L31 38",
    strokeWidth: "1.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), RAIL_ITEMS.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    className: `rail-btn ${active === item.id ? 'active' : ''}`,
    onClick: () => onNav(item.id),
    title: item.label
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "rail-btn-lbl"
  }, item.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), onLogout && /*#__PURE__*/React.createElement("button", {
    className: "rail-btn",
    title: "\u767B\u51FA",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "rail-btn-lbl"
  }, "\u767B\u51FA")), /*#__PURE__*/React.createElement("button", {
    className: "rail-btn",
    title: "\u8A2D\u5B9A"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 20
  })));
}

// ─────────────────────────────────────────────────────────────
// Top Bar
// ─────────────────────────────────────────────────────────────
function TopBar({
  screenLabel,
  session,
  onLogout
}) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hhmmss = time.toTimeString().slice(0, 8);
  const ymd = `${time.getFullYear()}.${String(time.getMonth() + 1).padStart(2, '0')}.${String(time.getDate()).padStart(2, '0')}`;
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "breadcrumb"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "SECTOR"), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "//"), /*#__PURE__*/React.createElement("span", {
    className: "bc-current"
  }, screenLabel)), /*#__PURE__*/React.createElement("div", {
    className: "topbar-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "status-dot ok"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "SYSTEM ONLINE \xB7 17 NODES"), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-1)'
    }
  }, ymd), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, hhmmss), /*#__PURE__*/React.createElement("span", {
    className: "bc-sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: session?.isAdmin ? 'var(--accent)' : 'var(--fg-1)'
    }
  }, "OP \xB7 ", session ? session.name : '陳師傅', session?.isAdmin ? ' [ADMIN]' : ''), onLogout && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-solid btn-sm",
    onClick: onLogout,
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 12
  }), /*#__PURE__*/React.createElement("span", null, "\u767B\u51FA"))));
}

// ─────────────────────────────────────────────────────────────
// Status bar (bottom)
// ─────────────────────────────────────────────────────────────
function StatusBar({
  session
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "statusbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "DB \xB7 SYNCED"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "LATENCY 14ms"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "REGION TPE-N"), session && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--ok)'
    }
  }, "SESSION \xB7 ", session.phone)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, "v2.4.1 \xB7 BUILD 18026"));
}
Object.assign(window, {
  Rail,
  TopBar,
  StatusBar,
  Icon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quotation/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quotation/Primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Panel.jsx — reusable HUD panel primitive
const Panel = ({
  title,
  meta,
  children,
  accent,
  className = '',
  style = {}
}) => /*#__PURE__*/React.createElement("section", {
  className: `hud-panel ${accent ? 'hud-panel-active' : ''} ${className}`,
  style: style
}, (title || meta) && /*#__PURE__*/React.createElement("div", {
  className: "hud-panel-header",
  style: {
    fontSize: 12
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "panel-title"
}, title), meta && /*#__PURE__*/React.createElement("span", {
  className: "panel-meta"
}, meta)), /*#__PURE__*/React.createElement("div", {
  className: "hud-panel-body"
}, children));
const Metric = ({
  label,
  value,
  delta,
  deltaKind = 'ok',
  sub,
  accent
}) => /*#__PURE__*/React.createElement("div", {
  className: "metric"
}, /*#__PURE__*/React.createElement("div", {
  className: "metric-label mono-label"
}, label), /*#__PURE__*/React.createElement("div", {
  className: `metric-value ${accent ? 'accent' : ''}`
}, value), sub && /*#__PURE__*/React.createElement("div", {
  className: "metric-sub mono-label"
}, sub), delta && /*#__PURE__*/React.createElement("div", {
  className: `metric-delta ${deltaKind}`
}, delta));
const Chip = ({
  kind = 'info',
  children,
  code
}) => /*#__PURE__*/React.createElement("span", {
  className: `chip chip-${kind} ${code ? 'chip-code' : ''}`
}, !code && /*#__PURE__*/React.createElement("span", {
  className: `chip-dot chip-dot-${kind}`
}), children);
const Button = ({
  variant = 'primary',
  children,
  onClick,
  disabled,
  icon
}) => /*#__PURE__*/React.createElement("button", {
  className: `btn btn-${variant}`,
  onClick: onClick,
  disabled: disabled
}, icon && /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 14
}), /*#__PURE__*/React.createElement("span", null, children), variant === 'primary' && /*#__PURE__*/React.createElement("span", {
  className: "btn-caret"
}, "\u203A"));
const Field = ({
  label,
  children,
  helper,
  error
}) => /*#__PURE__*/React.createElement("label", {
  className: `field ${error ? 'field-error' : ''}`
}, /*#__PURE__*/React.createElement("span", {
  className: "field-label mono-label"
}, label), children, (helper || error) && /*#__PURE__*/React.createElement("span", {
  className: `field-helper ${error ? 'is-error' : ''}`
}, error || helper));
const Input = props => /*#__PURE__*/React.createElement("input", _extends({
  className: "input"
}, props));
const Toggle = ({
  on,
  onChange,
  label
}) => /*#__PURE__*/React.createElement("div", {
  className: "toggle-row",
  onClick: () => onChange(!on)
}, /*#__PURE__*/React.createElement("span", {
  className: `toggle ${on ? 'toggle-on' : ''}`
}), /*#__PURE__*/React.createElement("span", {
  className: "toggle-lbl"
}, label));
const Modal = ({
  open,
  onClose,
  title,
  meta,
  width = 520,
  children,
  footer
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal hud-panel hud-panel-active",
    style: {
      width
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "panel-meta"
  }, meta, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose,
    "aria-label": "close"
  }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
    className: "hud-panel-body modal-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, footer)));
};
const Select = ({
  value,
  onChange,
  options
}) => /*#__PURE__*/React.createElement("select", {
  className: "input",
  value: value,
  onChange: e => onChange(e.target.value)
}, options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o.value,
  value: o.value
}, o.label)));
Object.assign(window, {
  Panel,
  Metric,
  Chip,
  Button,
  Field,
  Input,
  Toggle,
  Modal,
  Select
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quotation/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quotation/Screens.jsx
try { (() => {
// Screens.jsx — dashboard, case list, quote builder, quotes, materials
const {
  useState: useStateS,
  useMemo: useMemoS
} = React;

// ─────────────────────────────────────────────────────────────
// CASES (seed)
// ─────────────────────────────────────────────────────────────
const CASES_SEED = [{
  id: '#2025-0418',
  name: '大明商辦 3F 配電工程',
  client: '大明建設 · 王協理',
  status: 'active',
  statusLabel: '進行中',
  amount: 128400,
  updated: '14:32',
  location: '台北 · 信義',
  progress: 62
}, {
  id: '#2025-0416',
  name: '信義區吳公館整修',
  client: '吳先生',
  status: 'warn',
  statusLabel: '待確認',
  amount: 48200,
  updated: '11:08',
  location: '台北 · 信義',
  progress: 24
}, {
  id: '#2025-0411',
  name: '文心飯店地下機房配管',
  client: '文心國際酒店',
  status: 'alert',
  statusLabel: '逾期',
  amount: 312800,
  updated: '04/12',
  location: '台中 · 西屯',
  progress: 88
}, {
  id: '#2025-0409',
  name: '松山火鍋店冷凍配電',
  client: '頂鍋食品',
  status: 'ok',
  statusLabel: '已付款',
  amount: 92500,
  updated: '04/10',
  location: '台北 · 松山',
  progress: 100
}, {
  id: '#2025-0406',
  name: '林口集合住宅熱水管線',
  client: '日盛營造',
  status: 'active',
  statusLabel: '進行中',
  amount: 186700,
  updated: '04/15',
  location: '新北 · 林口',
  progress: 41
}, {
  id: '#2025-0402',
  name: '板橋誠品門市照明更新',
  client: '誠品生活',
  status: 'ok',
  statusLabel: '已付款',
  amount: 64200,
  updated: '04/03',
  location: '新北 · 板橋',
  progress: 100
}];

// ─────────────────────────────────────────────────────────────
// MATERIALS CATALOG (used by quote builder + materials screen)
// ─────────────────────────────────────────────────────────────
const MATERIALS = [{
  code: 'NFB-3P-100',
  name: '無熔絲開關 NFB 3P 100A',
  cat: '材料',
  unit: '個',
  price: 2850,
  stock: 12
}, {
  code: 'NFB-2P-30',
  name: '無熔絲開關 NFB 2P 30A',
  cat: '材料',
  unit: '個',
  price: 680,
  stock: 34
}, {
  code: 'PVC-1-4M',
  name: 'PVC 電管 1" × 4m',
  cat: '材料',
  unit: '支',
  price: 180,
  stock: 128
}, {
  code: 'PVC-3-4-4M',
  name: 'PVC 電管 3/4" × 4m',
  cat: '材料',
  unit: '支',
  price: 140,
  stock: 82
}, {
  code: 'PNL-60-80',
  name: '配電盤 600×800 烤漆',
  cat: '材料',
  unit: '座',
  price: 18500,
  stock: 3
}, {
  code: 'WIRE-5-5',
  name: '電線 5.5 平方 × 100m',
  cat: '材料',
  unit: '捲',
  price: 3200,
  stock: 18
}, {
  code: 'WIRE-2-0',
  name: '電線 2.0 平方 × 100m',
  cat: '材料',
  unit: '捲',
  price: 1400,
  stock: 24
}, {
  code: 'PIPE-CU-15',
  name: '銅管 15A × 3m',
  cat: '材料',
  unit: '支',
  price: 520,
  stock: 0
}, {
  code: 'LBR-ELEC-S',
  name: '配管施工 · 資深師傅',
  cat: '工資',
  unit: '工時',
  price: 1200,
  stock: '—'
}, {
  code: 'LBR-ELEC-J',
  name: '配管施工 · 助手',
  cat: '工資',
  unit: '工時',
  price: 700,
  stock: '—'
}, {
  code: 'LBR-GND',
  name: '接地測試 · 現場驗收',
  cat: '工資',
  unit: '式',
  price: 4500,
  stock: '—'
}, {
  code: 'LBR-PLB',
  name: '給排水配管施工',
  cat: '工資',
  unit: '工時',
  price: 1100,
  stock: '—'
}];
const fmt = n => 'NT$ ' + (n || 0).toLocaleString();

// ─────────────────────────────────────────────────────────────
// NEW CASE MODAL
// ─────────────────────────────────────────────────────────────
function NewCaseModal({
  open,
  onClose,
  onCreate
}) {
  const [name, setName] = useStateS('');
  const [client, setClient] = useStateS('');
  const [location, setLocation] = useStateS('');
  const [amount, setAmount] = useStateS('');
  const reset = () => {
    setName('');
    setClient('');
    setLocation('');
    setAmount('');
  };
  const submit = () => {
    if (!name.trim()) return;
    const now = new Date();
    const id = `#${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    onCreate({
      id,
      name: name.trim(),
      client: client.trim() || '—',
      location: location.trim() || '—',
      status: 'warn',
      statusLabel: '待確認',
      amount: +amount || 0,
      updated: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      progress: 0
    });
    reset();
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "\u65B0\u589E\u6848\u4EF6 \xB7 NEW CASE",
    meta: "FORM",
    width: 560,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: "check",
      onClick: submit
    }, "\u5EFA\u7ACB\u6848\u4EF6"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u6848\u4EF6\u540D\u7A31 \xB7 NAME"
  }, /*#__PURE__*/React.createElement(Input, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "\u5927\u660E\u5546\u8FA6 3F \u914D\u96FB\u5DE5\u7A0B",
    autoFocus: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u696D\u4E3B \xB7 CLIENT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: client,
    onChange: e => setClient(e.target.value),
    placeholder: "\u738B\u5354\u7406"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u5730\u9EDE \xB7 LOCATION"
  }, /*#__PURE__*/React.createElement(Input, {
    value: location,
    onChange: e => setLocation(e.target.value),
    placeholder: "\u53F0\u5317 \xB7 \u4FE1\u7FA9"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u9810\u4F30\u91D1\u984D \xB7 AMOUNT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: amount,
    onChange: e => setAmount(e.target.value),
    placeholder: "128400",
    type: "number"
  }))));
}

// ─────────────────────────────────────────────────────────────
// ADD LINE-ITEM MODAL
// ─────────────────────────────────────────────────────────────
function AddLineItemModal({
  open,
  onClose,
  onAdd
}) {
  const [mode, setMode] = useStateS('catalog'); // 'catalog' | 'custom'
  const [q, setQ] = useStateS('');
  const [custom, setCustom] = useStateS({
    name: '',
    cat: '材料',
    unit: '個',
    qty: 1,
    price: 0
  });
  const filtered = MATERIALS.filter(m => m.name.includes(q) || m.code.includes(q));
  const addFromCatalog = m => {
    onAdd({
      id: Date.now(),
      type: m.cat === '工資' ? 'labor' : 'material',
      name: m.name,
      qty: 1,
      unit: m.unit,
      price: m.price,
      cat: m.cat
    });
    onClose();
  };
  const addCustom = () => {
    if (!custom.name.trim()) return;
    onAdd({
      id: Date.now(),
      type: custom.cat === '工資' ? 'labor' : 'material',
      name: custom.name.trim(),
      qty: +custom.qty || 1,
      unit: custom.unit.trim() || '個',
      price: +custom.price || 0,
      cat: custom.cat
    });
    setCustom({
      name: '',
      cat: '材料',
      unit: '個',
      qty: 1,
      price: 0
    });
    onClose();
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "\u65B0\u589E\u5DE5\u9805 \xB7 ADD LINE",
    meta: mode === 'catalog' ? 'FROM CATALOG' : 'CUSTOM',
    width: 640
  }, /*#__PURE__*/React.createElement("div", {
    className: "mode-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: `mode-tab ${mode === 'catalog' ? 'active' : ''}`,
    onClick: () => setMode('catalog')
  }, "\u5F9E\u6750\u6599\u5EAB\u9078\u53D6"), /*#__PURE__*/React.createElement("button", {
    className: `mode-tab ${mode === 'custom' ? 'active' : ''}`,
    onClick: () => setMode('custom')
  }, "\u81EA\u8A02\u5DE5\u9805")), mode === 'catalog' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "searchbar",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u54C1\u9805 / \u4EE3\u78BC",
    autoFocus: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, filtered.length, "/", MATERIALS.length)), /*#__PURE__*/React.createElement("div", {
    className: "pick-list"
  }, filtered.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.code,
    className: "pick-row",
    onClick: () => addFromCatalog(m)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--accent)',
      width: 110
    }
  }, m.code), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--fg-1)'
    }
  }, m.name), /*#__PURE__*/React.createElement(Chip, {
    kind: m.cat === '工資' ? 'info' : 'dim'
  }, m.cat), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      width: 90,
      textAlign: 'right',
      color: 'var(--fg-1)'
    }
  }, fmt(m.price)), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub",
    style: {
      width: 40,
      textAlign: 'right'
    }
  }, "/", m.unit))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: 'center',
      color: 'var(--fg-3)'
    }
  }, "\u7121\u7B26\u5408\u9805\u76EE"))), mode === 'custom' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u9805\u76EE\u540D\u7A31 \xB7 NAME"
  }, /*#__PURE__*/React.createElement(Input, {
    value: custom.name,
    onChange: e => setCustom({
      ...custom,
      name: e.target.value
    }),
    placeholder: "\u958B\u95DC\u9762\u677F 2P",
    autoFocus: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u985E\u5225 \xB7 CATEGORY"
  }, /*#__PURE__*/React.createElement(Select, {
    value: custom.cat,
    onChange: v => setCustom({
      ...custom,
      cat: v
    }),
    options: [{
      value: '材料',
      label: '材料'
    }, {
      value: '工資',
      label: '工資'
    }, {
      value: '雜項',
      label: '雜項'
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u55AE\u4F4D \xB7 UNIT"
  }, /*#__PURE__*/React.createElement(Input, {
    value: custom.unit,
    onChange: e => setCustom({
      ...custom,
      unit: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u6578\u91CF \xB7 QTY"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: custom.qty,
    onChange: e => setCustom({
      ...custom,
      qty: e.target.value
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u55AE\u50F9 \xB7 UNIT PRICE"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: custom.price,
    onChange: e => setCustom({
      ...custom,
      price: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    onClick: addCustom
  }, "\u52A0\u5165\u5DE5\u9805"))));
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({
  cases,
  onOpenCase,
  onNewCase,
  onBuildQuote
}) {
  const activeCases = cases.filter(c => c.status === 'active');
  const totalMonth = cases.reduce((s, c) => s + c.amount, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Dashboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u4E3B\u63A7\u53F0 // COMMAND"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "plus",
    onClick: onNewCase
  }, "\u65B0\u589E\u6848\u4EF6"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "file-plus",
    onClick: onBuildQuote
  }, "\u5EFA\u7ACB\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u6536\u6B3E",
    meta: "2026 \xB7 APR",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL RECEIVED",
    value: fmt(totalMonth),
    delta: "\u25B2 +12.4% \xB7 \u6708\u589E NT$ 92,800"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u9032\u884C\u4E2D\u6848\u4EF6",
    meta: "LIVE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ACTIVE CASES",
    value: activeCases.length,
    accent: true,
    delta: `▲ ${cases.filter(c => c.status === 'warn').length} 待確認 · ${cases.filter(c => c.status === 'alert').length} 逾期`,
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5F85\u958B\u767C\u7968",
    meta: "PENDING"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TO BE ISSUED",
    value: fmt(218300),
    sub: "4 \u5F35",
    delta: "7 \u65E5\u5167\u5230\u671F",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u5DE5\u6642",
    meta: "LOG"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "LABOR HOURS",
    value: "214.5",
    sub: "HR \xB7 3 \u5E2B\u5085",
    delta: "\u25B2 \u6548\u7387 94%"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two-col"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6700\u8FD1\u6848\u4EF6",
    meta: `${cases.length} RECORDS · LIVE`
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CASE"), /*#__PURE__*/React.createElement("th", null, "\u696D\u4E3B / \u540D\u7A31"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u66F4\u65B0"))), /*#__PURE__*/React.createElement("tbody", null, cases.slice(0, 6).map((c, i) => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    className: i === 0 ? 'row-active' : '',
    onClick: () => onOpenCase(c)
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, c.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, c.client)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: c.status
  }, c.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(c.amount)), /*#__PURE__*/React.createElement("td", {
    className: "mono row-sub",
    style: {
      textAlign: 'right'
    }
  }, c.updated)))))), /*#__PURE__*/React.createElement("div", {
    className: "stack"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u7CFB\u7D71\u72C0\u614B",
    meta: "TELEMETRY"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tele-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u7BC0\u9EDE\u9023\u7DDA"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '94%',
      background: 'var(--ok)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "94%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u672C\u6708\u9054\u6210\u7387"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '72%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "72%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u6750\u6599\u5EAB\u5B58"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '38%',
      background: 'var(--warn)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "38%")), /*#__PURE__*/React.createElement("div", {
    className: "tele-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-lbl"
  }, "\u8ACB\u6B3E\u56DE\u6536"), /*#__PURE__*/React.createElement("span", {
    className: "tele-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tele-fill",
    style: {
      width: '81%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tele-v"
  }, "81%")))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u4ECA\u65E5\u6392\u7A0B",
    meta: "3 TASKS"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "task-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "09:00"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u65B0\u838A \xB7 \u51B7\u6C23\u914D\u7DDA\u73FE\u52D8"), /*#__PURE__*/React.createElement(Chip, {
    kind: "info"
  }, "\u73FE\u52D8")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "13:30"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u6587\u5FC3\u98EF\u5E97\u6A5F\u623F\u9A57\u6536"), /*#__PURE__*/React.createElement(Chip, {
    kind: "alert"
  }, "\u903E\u671F")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "task-time mono"
  }, "16:00"), /*#__PURE__*/React.createElement("span", {
    className: "task-lbl"
  }, "\u5927\u660E\u5546\u8FA6\u5831\u50F9\u8907\u6838"), /*#__PURE__*/React.createElement(Chip, {
    kind: "warn"
  }, "\u5F85\u78BA\u8A8D")))))));
}

// ─────────────────────────────────────────────────────────────
// CASE LIST
// ─────────────────────────────────────────────────────────────
function CaseList({
  cases,
  onOpenCase,
  onNewCase
}) {
  const [q, setQ] = useStateS('');
  const filtered = useMemoS(() => cases.filter(c => c.name.includes(q) || c.id.includes(q) || c.client.includes(q)), [q, cases]);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Cases"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u6848\u4EF6\u5217\u8868 // CASES"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "searchbar"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u6848\u4EF6 / \u696D\u4E3B"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, filtered.length, "/", cases.length)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    onClick: onNewCase
  }, "\u65B0\u589E\u6848\u4EF6"))), /*#__PURE__*/React.createElement(Panel, {
    title: `CASES · ${filtered.length} RECORDS`,
    meta: "FULL INDEX"
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CASE"), /*#__PURE__*/React.createElement("th", null, "\u540D\u7A31 / \u696D\u4E3B"), /*#__PURE__*/React.createElement("th", null, "\u5730\u5340"), /*#__PURE__*/React.createElement("th", null, "\u9032\u5EA6"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    onClick: () => onOpenCase(c)
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, c.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, c.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, c.client)), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, c.location), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "progress-mini"
  }, /*#__PURE__*/React.createElement("span", {
    className: "progress-fill",
    style: {
      width: c.progress + '%',
      background: c.status === 'alert' ? 'var(--alert)' : c.status === 'warn' ? 'var(--warn)' : c.progress === 100 ? 'var(--ok)' : 'var(--accent)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub"
  }, c.progress, "%")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: c.status
  }, c.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(c.amount)))), filtered.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 6,
    style: {
      textAlign: 'center',
      color: 'var(--fg-3)',
      padding: 32
    }
  }, "\u7121\u7B26\u5408\u6848\u4EF6"))))));
}

// ─────────────────────────────────────────────────────────────
// QUOTE BUILDER
// ─────────────────────────────────────────────────────────────
const LINE_ITEMS_INIT = [{
  id: 1,
  type: 'material',
  name: '無熔絲開關 NFB 3P 100A',
  qty: 2,
  unit: '個',
  price: 2850,
  cat: '材料'
}, {
  id: 2,
  type: 'material',
  name: 'PVC 電管 1" × 4m',
  qty: 24,
  unit: '支',
  price: 180,
  cat: '材料'
}, {
  id: 3,
  type: 'material',
  name: '配電盤 600×800 烤漆',
  qty: 1,
  unit: '座',
  price: 18500,
  cat: '材料'
}, {
  id: 4,
  type: 'labor',
  name: '配管施工 · 資深師傅',
  qty: 16,
  unit: '工時',
  price: 1200,
  cat: '工資'
}, {
  id: 5,
  type: 'labor',
  name: '接地測試 · 現場驗收',
  qty: 1,
  unit: '式',
  price: 4500,
  cat: '工資'
}];
function QuoteBuilder({
  caseData,
  onClose
}) {
  const [items, setItems] = useStateS(LINE_ITEMS_INIT);
  const [taxInc, setTaxInc] = useStateS(true);
  const [addOpen, setAddOpen] = useStateS(false);
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = taxInc ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax;
  const updateQty = (id, qty) => setItems(items.map(it => it.id === id ? {
    ...it,
    qty: Math.max(0, qty)
  } : it));
  const removeItem = id => setItems(items.filter(it => it.id !== id));
  const addItem = it => setItems(prev => [...prev, it]);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen screen-quote",
    "data-screen-label": "Quote Builder"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--fg-3)'
    }
  }, "QUOTE BUILDER \xB7 ", caseData?.id || '#NEW'), /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, caseData?.name || '新報價單')), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose,
    icon: "x"
  }, "\u95DC\u9589"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    icon: "save"
  }, "\u5132\u5B58\u8349\u7A3F"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "send"
  }, "\u9001\u51FA\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "quote-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-main"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6848\u4EF6\u8CC7\u8A0A",
    meta: "CLIENT \xB7 SCOPE"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-meta-grid"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u696D\u4E3B"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: caseData?.client || '大明建設 · 王協理'
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u806F\u7D61\u96FB\u8A71"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "02-2723-xxxx"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u5DE5\u7A0B\u5730\u9EDE"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "\u53F0\u5317\u5E02\u4FE1\u7FA9\u5340\u677E\u9AD8\u8DEF 19 \u865F 3F"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u9810\u8A08\u5DE5\u671F"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: "14 \u5929"
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DE5\u9805\u660E\u7D30",
    meta: `${items.length} LINE ITEMS`,
    accent: true
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table line-items"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "\u9805\u76EE"), /*#__PURE__*/React.createElement("th", null, "\u985E\u5225"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u6578\u91CF"), /*#__PURE__*/React.createElement("th", null, "\u55AE\u4F4D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u55AE\u50F9"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u5C0F\u8A08"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, items.map((it, i) => /*#__PURE__*/React.createElement("tr", {
    key: it.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono row-sub"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("td", null, it.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: it.type === 'labor' ? 'info' : 'dim'
  }, it.cat)), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input input-inline",
    type: "number",
    value: it.qty,
    onChange: e => updateQty(it.id, +e.target.value)
  })), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, it.unit), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, it.price.toLocaleString()), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right',
      color: 'var(--accent)'
    }
  }, (it.qty * it.price).toLocaleString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => removeItem(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  }))))), items.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      color: 'var(--fg-3)',
      padding: 24
    }
  }, "\u5C1A\u7121\u5DE5\u9805 \xB7 \u9EDE\u64CA\u4E0B\u65B9\u65B0\u589E")))), /*#__PURE__*/React.createElement("button", {
    className: "add-line",
    onClick: () => setAddOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " \u65B0\u589E\u5DE5\u9805"))), /*#__PURE__*/React.createElement("aside", {
    className: "quote-side"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u91D1\u984D\u8A08\u7B97",
    meta: "AMOUNT"
  }, /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u5C0F\u8A08"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fmt(subtotal))), /*#__PURE__*/React.createElement("div", {
    className: "calc-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u71DF\u696D\u7A05 (5%)"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, fmt(tax))), /*#__PURE__*/React.createElement("div", {
    className: "calc-total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, "TOTAL \xB7 \u7E3D\u8A08"), /*#__PURE__*/React.createElement("div", {
    className: "calc-total-v"
  }, fmt(total))), /*#__PURE__*/React.createElement(Toggle, {
    on: taxInc,
    onChange: setTaxInc,
    label: "\u542B\u71DF\u696D\u7A05"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6838\u51C6\u6D41\u7A0B",
    meta: "WORKFLOW"
  }, /*#__PURE__*/React.createElement("ol", {
    className: "steps"
  }, /*#__PURE__*/React.createElement("li", {
    className: "step-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u8349\u7A3F\u5EFA\u7ACB"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "04/17 10:24 \xB7 \u9673\u5E2B\u5085"))), /*#__PURE__*/React.createElement("li", {
    className: "step-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u5DE5\u6599\u8907\u6838"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "04/18 09:15 \xB7 \u6797\u5DE5"))), /*#__PURE__*/React.createElement("li", {
    className: "step-active"
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u25CF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u9001\u51FA\u696D\u4E3B"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "\u7B49\u5F85 \xB7 03:42"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "step-mark"
  }, "\u25CB"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "\u696D\u4E3B\u7C3D\u56DE"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, "\u2014"))))))), /*#__PURE__*/React.createElement(AddLineItemModal, {
    open: addOpen,
    onClose: () => setAddOpen(false),
    onAdd: addItem
  }));
}

// ─────────────────────────────────────────────────────────────
// QUOTES LIST
// ─────────────────────────────────────────────────────────────
const QUOTES = [{
  id: 'Q-2025-0418-A',
  caseId: '#2025-0418',
  case: '大明商辦 3F 配電工程',
  version: 'v3',
  status: 'warn',
  statusLabel: '待業主簽回',
  amount: 128400,
  issued: '04/18',
  valid: '05/18'
}, {
  id: 'Q-2025-0416-A',
  caseId: '#2025-0416',
  case: '信義區吳公館整修',
  version: 'v1',
  status: 'info',
  statusLabel: '草稿',
  amount: 48200,
  issued: '04/16',
  valid: '05/16'
}, {
  id: 'Q-2025-0411-B',
  caseId: '#2025-0411',
  case: '文心飯店地下機房配管',
  version: 'v2',
  status: 'ok',
  statusLabel: '已簽回',
  amount: 312800,
  issued: '04/11',
  valid: '05/11'
}, {
  id: 'Q-2025-0409-A',
  caseId: '#2025-0409',
  case: '松山火鍋店冷凍配電',
  version: 'v1',
  status: 'ok',
  statusLabel: '已簽回',
  amount: 92500,
  issued: '04/09',
  valid: '05/09'
}, {
  id: 'Q-2025-0406-A',
  caseId: '#2025-0406',
  case: '林口集合住宅熱水管線',
  version: 'v2',
  status: 'alert',
  statusLabel: '逾期未簽',
  amount: 186700,
  issued: '04/06',
  valid: '04/16'
}];
function QuotesList({
  onOpenQuote
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Quotes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u5831\u50F9\u55AE // QUOTES"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "file-plus",
    onClick: onOpenQuote
  }, "\u5EFA\u7ACB\u5831\u50F9"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u672C\u6708\u958B\u7ACB",
    meta: "APR"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ISSUED",
    value: QUOTES.length,
    accent: true,
    sub: "\u5F35"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5F85\u696D\u4E3B\u7C3D\u56DE",
    meta: "PENDING"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "AWAITING",
    value: "1",
    delta: "03:42 \u5DF2\u7B49\u5F85",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DF2\u7C3D\u56DE\u91D1\u984D",
    meta: "APPROVED"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "SIGNED",
    value: fmt(405300)
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u903E\u671F\u672A\u7C3D",
    meta: "OVERDUE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "OVERDUE",
    value: "1",
    delta: "\u9700\u806F\u7D61\u696D\u4E3B",
    deltaKind: "alert"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5831\u50F9\u55AE\u7D00\u9304",
    meta: `${QUOTES.length} DOCS`
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "QUOTE"), /*#__PURE__*/React.createElement("th", null, "\u6848\u4EF6"), /*#__PURE__*/React.createElement("th", null, "\u7248\u672C"), /*#__PURE__*/React.createElement("th", null, "\u72C0\u614B"), /*#__PURE__*/React.createElement("th", null, "\u958B\u7ACB"), /*#__PURE__*/React.createElement("th", null, "\u6709\u6548"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right'
    }
  }, "\u91D1\u984D"))), /*#__PURE__*/React.createElement("tbody", null, QUOTES.map(q => /*#__PURE__*/React.createElement("tr", {
    key: q.id,
    onClick: onOpenQuote
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, q.id), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, q.case), /*#__PURE__*/React.createElement("div", {
    className: "row-sub mono"
  }, q.caseId)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: "dim",
    code: true
  }, q.version)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
    kind: q.status
  }, q.statusLabel)), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, q.issued), /*#__PURE__*/React.createElement("td", {
    className: "row-sub mono"
  }, q.valid), /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      textAlign: 'right'
    }
  }, fmt(q.amount))))))));
}

// ─────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────
function MaterialsScreen() {
  const [q, setQ] = useStateS('');
  const [cat, setCat] = useStateS('all');
  const filtered = MATERIALS.filter(m => (cat === 'all' || m.cat === cat) && (m.name.includes(q) || m.code.includes(q)));
  const totalValue = MATERIALS.filter(m => typeof m.stock === 'number').reduce((s, m) => s + m.stock * m.price, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Materials"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u6750\u6599\u5EAB // MATERIALS"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "download"
  }, "\u532F\u51FA\u6E05\u55AE"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "\u65B0\u589E\u54C1\u9805"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u54C1\u9805\u7E3D\u6578",
    meta: "CATALOG",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "SKUS",
    value: MATERIALS.length,
    accent: true
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5EAB\u5B58\u50F9\u503C",
    meta: "VALUE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "ON-HAND",
    value: fmt(totalValue)
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u54C1\u9805\u7E3D\u6578",
    meta: "< 10"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "LOW STOCK",
    value: MATERIALS.filter(m => typeof m.stock === 'number' && m.stock < 10).length,
    delta: "\u5EFA\u8B70\u88DC\u8CA8",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u7F3A\u8CA8",
    meta: "ZERO"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "OUT",
    value: MATERIALS.filter(m => m.stock === 0).length,
    delta: "\u7ACB\u5373\u88DC\u8CA8",
    deltaKind: "alert"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: `CATALOG · ${filtered.length} SKUS`,
    meta: "LIVE"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "searchbar",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "SEARCH \xB7 \u54C1\u9805 / \u4EE3\u78BC",
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cat-tabs"
  }, ['all', '材料', '工資'].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: `cat-tab ${cat === c ? 'active' : ''}`,
    onClick: () => setCat(c)
  }, c === 'all' ? '全部' : c)))), /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "CODE"), /*#__PURE__*/React.createElement("th", null, "\u54C1\u540D"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: 12
    }
  }, "\u985E\u5225"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontSize: 12
    }
  }, "\u55AE\u4F4D"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right',
      fontSize: 12
    }
  }, "\u55AE\u50F9"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right',
      fontSize: 12
    }
  }, "\u5EAB\u5B58"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right',
      fontSize: 12
    }
  }, "\u5EAB\u5B58\u503C"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(m => {
    const low = typeof m.stock === 'number' && m.stock < 10;
    const out = m.stock === 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: m.code
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono"
    }, m.code), /*#__PURE__*/React.createElement("td", null, m.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Chip, {
      kind: m.cat === '工資' ? 'info' : 'dim'
    }, m.cat)), /*#__PURE__*/React.createElement("td", {
      className: "row-sub mono"
    }, m.unit), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right'
      }
    }, fmt(m.price)), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right',
        color: out ? 'var(--alert)' : low ? 'var(--warn)' : 'var(--fg-1)'
      }
    }, m.stock, out && ' · 缺貨', low && !out && ' · 低'), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        textAlign: 'right',
        color: 'var(--accent)'
      }
    }, typeof m.stock === 'number' ? fmt(m.stock * m.price) : '—'));
  })))));
}

// ─────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────
const MONTHLY = [{
  m: '10月',
  rev: 612,
  cost: 384
}, {
  m: '11月',
  rev: 548,
  cost: 362
}, {
  m: '12月',
  rev: 724,
  cost: 441
}, {
  m: '01月',
  rev: 680,
  cost: 412
}, {
  m: '02月',
  rev: 512,
  cost: 318
}, {
  m: '03月',
  rev: 798,
  cost: 476
}, {
  m: '04月',
  rev: 842,
  cost: 498
}];
const CLIENT_DIST = [{
  name: '大明建設',
  value: 328,
  pct: 28
}, {
  name: '文心酒店',
  value: 312,
  pct: 27
}, {
  name: '日盛營造',
  value: 186,
  pct: 16
}, {
  name: '誠品生活',
  value: 128,
  pct: 11
}, {
  name: '其他 12 家',
  value: 204,
  pct: 18
}];
function ReportsScreen() {
  const [range, setRange] = useStateS('7m');
  const maxVal = Math.max(...MONTHLY.map(m => m.rev));
  const totalRev = MONTHLY.reduce((s, m) => s + m.rev, 0);
  const totalCost = MONTHLY.reduce((s, m) => s + m.cost, 0);
  const margin = ((totalRev - totalCost) / totalRev * 100).toFixed(1);
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": "Reports"
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, "\u71DF\u904B\u5831\u8868 // REPORTS"), /*#__PURE__*/React.createElement("div", {
    className: "screen-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat-tabs"
  }, [['3m', '近 3 月'], ['7m', '近 7 月'], ['1y', '近一年']].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: `cat-tab ${range === v ? 'active' : ''}`,
    onClick: () => setRange(v)
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    icon: "download"
  }, "\u532F\u51FA PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "metric-grid",
    style: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u671F\u9593\u71DF\u6536",
    meta: "REVENUE",
    accent: true
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL",
    value: fmt(totalRev * 1000),
    delta: "\u25B2 +18.2% \u5E74\u589E"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u671F\u9593\u6210\u672C",
    meta: "COST"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "TOTAL",
    value: fmt(totalCost * 1000),
    delta: "\u25B2 +12.4% \u5E74\u589E",
    deltaKind: "warn"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6BDB\u5229\u7387",
    meta: "MARGIN"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "MARGIN",
    value: margin + '%',
    accent: true,
    delta: "\u25B2 +2.1 pt"
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "\u6848\u4EF6\u5B8C\u6210\u7387",
    meta: "RATE"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "COMPLETION",
    value: "88%",
    delta: "\u25B2 \u9AD8\u65BC\u53BB\u5E74 6 pt"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "two-col"
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "\u6708\u71DF\u6536\u5C0D\u6BD4",
    meta: "REVENUE \xB7 COST \xB7 \u5343\u5143"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-bars"
  }, MONTHLY.map(m => {
    const hR = m.rev / maxVal * 100;
    const hC = m.cost / maxVal * 100;
    return /*#__PURE__*/React.createElement("div", {
      key: m.m,
      className: "bar-group",
      title: `${m.m} · 營收 ${m.rev} / 成本 ${m.cost}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "bar-pair"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar bar-rev",
      style: {
        height: hR + '%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "bar-v mono"
    }, m.rev)), /*#__PURE__*/React.createElement("span", {
      className: "bar bar-cost",
      style: {
        height: hC + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "bar-label mono"
    }, m.m));
  })), /*#__PURE__*/React.createElement("div", {
    className: "chart-legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legend-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-sq",
    style: {
      background: 'var(--accent)'
    }
  }), "\u71DF\u6536"), /*#__PURE__*/React.createElement("span", {
    className: "legend-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-sq",
    style: {
      background: 'var(--fg-4)'
    }
  }), "\u6210\u672C")))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u696D\u4E3B\u5206\u4F48",
    meta: "TOP CLIENTS"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "dist-list"
  }, CLIENT_DIST.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: c.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "dist-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: 'var(--fg-4)'
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-tc)',
      color: 'var(--fg-1)'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--accent)'
    }
  }, fmt(c.value * 1000))), /*#__PURE__*/React.createElement("div", {
    className: "dist-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dist-fill",
    style: {
      width: c.pct + '%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono row-sub"
  }, c.pct, "%")))))), /*#__PURE__*/React.createElement(Panel, {
    title: "\u5DE5\u9805\u985E\u5225\u5206\u6790",
    meta: "BY CATEGORY"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cat-grid"
  }, [{
    name: '配電 · 強電',
    pct: 42,
    amt: 1860
  }, {
    name: '配管 · 給排水',
    pct: 28,
    amt: 1240
  }, {
    name: '照明安裝',
    pct: 14,
    amt: 620
  }, {
    name: '空調配線',
    pct: 10,
    amt: 440
  }, {
    name: '其他雜項',
    pct: 6,
    amt: 264
  }].map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "cat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)'
    }
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "num-hd"
  }, c.pct, "%"), /*#__PURE__*/React.createElement("div", {
    className: "mono row-sub"
  }, fmt(c.amt * 1000)), /*#__PURE__*/React.createElement("div", {
    className: "dist-bar",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dist-fill",
    style: {
      width: c.pct * 2 + '%'
    }
  })))))));
}
function ComingSoon({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "screen",
    "data-screen-label": label
  }, /*#__PURE__*/React.createElement("div", {
    className: "screen-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "screen-title"
  }, label)), /*#__PURE__*/React.createElement(Panel, {
    title: "MODULE \xB7 STANDBY",
    meta: "NOT WIRED"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px',
      textAlign: 'center',
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: 'var(--accent)',
      marginBottom: 12
    }
  }, "\u2310 STANDBY \u2310"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-tc)',
      fontSize: 14
    }
  }, "\u6B64\u6A21\u7D44\u65BC UI \u5957\u4EF6\u4E2D\u5C1A\u672A\u5BE6\u4F5C"))));
}
Object.assign(window, {
  Dashboard,
  CaseList,
  QuoteBuilder,
  QuotesList,
  MaterialsScreen,
  ReportsScreen,
  ComingSoon,
  CASES_SEED,
  NewCaseModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quotation/Screens.jsx", error: String((e && e.message) || e) }); }

})();
